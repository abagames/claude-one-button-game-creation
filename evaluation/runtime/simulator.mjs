import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import {
  assertValidEpisodeRequest,
  assertValidPrivateEpisodeResult,
} from "./episode-contracts.mjs";
import {
  assertValidInputSequence,
  expandPressedStates,
  hashCanonicalJson,
} from "./input-sequence.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GAME_ID_PATTERN = /^[a-z0-9-]+$/;

export function createSimulator(config) {
  if (config == null || !Array.isArray(config.adapters) || config.adapters.length < 1) {
    throw new Error("createSimulator requires at least one game adapter");
  }
  const root = path.resolve(config.rootDir ?? packageRoot);
  const runtimeBundlePath = normalizeRelativePath(config.runtimeBundlePath ?? "vendor/crisp-game-lib/docs/bundle.js");
  const absoluteBundlePath = resolveInside(root, runtimeBundlePath);
  const runtimeBundleSha256 = sha256File(absoluteBundlePath);
  if (config.runtimeBundleSha256 != null && config.runtimeBundleSha256 !== runtimeBundleSha256) {
    throw new Error("Runtime bundle SHA-256 does not match the configured hash");
  }
  const games = new Map();
  for (const value of config.adapters) {
    const adapter = normalizeAdapter(root, value);
    if (games.has(adapter.game_id)) throw new Error(`Duplicate game adapter: ${adapter.game_id}`);
    games.set(adapter.game_id, adapter);
  }
  const state = {
    root,
    runtimeBundlePath,
    runtimeBundleSha256,
    bundleScript: new vm.Script(fs.readFileSync(absoluteBundlePath, "utf8"), { filename: runtimeBundlePath }),
    games,
    compiledGames: new Map(),
  };
  const descriptor = Object.freeze({
    executor_id: "generic-node-vm-annotation-simulator-v1",
    runtime_bundle_sha256: runtimeBundleSha256,
    supported_games: [...games.values()].map(({ game_id, source_path, source_sha256, annotation_contract_version }) => ({
      game_id,
      source_path,
      source_sha256,
      annotation_contract_version,
    })),
    observation_channels: ["runtime_result", "private_drawing_annotation"],
    omitted_channels: ["canvas_raster", "audio_output", "raf_timing", "external_host_events"],
  });
  return Object.freeze({
    descriptor,
    runEpisodes(requests, options = {}) {
      return runEpisodes(state, requests, options);
    },
    runClosedLoopEpisodes(requests, createController, options = {}) {
      return runClosedLoopEpisodes(state, requests, createController, options);
    },
  });
}

async function runEpisodes(state, requests, options = {}) {
  if (!Array.isArray(requests) || requests.length < 1) {
    throw new Error("runEpisodes requires at least one request");
  }
  for (const request of requests) {
    assertValidEpisodeRequest(request);
    if (!state.games.has(request.game_id)) throw new Error(`Unknown game adapter: ${request.game_id}`);
    if (request.capture_canvas) {
      throw new Error("Canvas raster capture is outside this simulator's capability class");
    }
  }
  const concurrency = options.concurrency ?? 1;
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("annotation simulator concurrency must be a positive integer");
  }
  const results = new Array(requests.length);
  let nextIndex = 0;
  acquireRejectionGuard();
  try {
    await Promise.all(Array.from({ length: Math.min(concurrency, requests.length) }, async () => {
      while (nextIndex < requests.length) {
        const index = nextIndex++;
        results[index] = await runInFreshContext(state, requests[index], options, index);
      }
    }));
  } finally {
    releaseRejectionGuard();
  }
  return results;
}

// Game initialization inside the VM is asynchronous, and a capability the shim does not provide rejects that
// promise. Without this guard the default Node behavior terminates the whole evaluation process instead of
// recording a load error for one game, which would turn an unsupported capability into a lost batch.
let rejectionGuardDepth = 0;
const guardedRejections = [];

function onGuardedRejection(reason) {
  guardedRejections.push(reason instanceof Error ? reason.message : String(reason));
}

function acquireRejectionGuard() {
  if (rejectionGuardDepth === 0) process.on("unhandledRejection", onGuardedRejection);
  rejectionGuardDepth++;
}

function releaseRejectionGuard() {
  rejectionGuardDepth--;
  if (rejectionGuardDepth === 0) process.off("unhandledRejection", onGuardedRejection);
}

async function runClosedLoopEpisodes(state, requests, createController, options = {}) {
  if (!Array.isArray(requests) || requests.length < 1) {
    throw new Error("runClosedLoopEpisodes requires at least one request");
  }
  if (typeof createController !== "function") {
    throw new Error("runClosedLoopEpisodes requires a controller factory");
  }
  const normalized = requests.map((request) => {
    if (!Number.isInteger(request.duration_ticks) || request.duration_ticks < 1) {
      throw new Error("closed-loop duration_ticks must be a positive integer");
    }
    return {
      schema_version: 0,
      game_id: request.game_id,
      gameplay_seed: request.gameplay_seed,
      input_sequence: {
        schema_version: 1,
        duration_ticks: request.duration_ticks,
        transitions: [{ tick: 0, pressed: false }],
      },
      timeout_ms: request.timeout_ms,
      capture_canvas: false,
    };
  });
  return runEpisodes(state, normalized, {
    ...options,
    createClosedLoopController: (context) => createController({
      ...context,
      request: requests[context.requestIndex],
    }),
  });
}

async function runInFreshContext(state, request, options, requestIndex) {
  const adapter = state.games.get(request.game_id);
  const diagnostics = { console_errors: [], runtime_errors: [], cleanup_errors: [] };
  const frames = [];
  let executedTickCount = 0;
  let lastLogicalTick = null;
  let episodeRandomSeed = null;
  let finalScore = null;
  let termination = null;
  let stage = "load";
  const deadline = Date.now() + request.timeout_ms;
  let inputSequenceSha256 = hashCanonicalJson(request.input_sequence);
  let viewSize = null;
  const executedPressedStates = [];
  const closedLoopController = options.createClosedLoopController?.({ request, requestIndex }) ?? null;
  const rejectionMark = guardedRejections.length;
  let pressedRunTicks = 0;
  let releaseCount = 0;

  try {
    const context = createRuntimeContext(request.gameplay_seed, diagnostics);
    runWithDeadline(state.bundleScript, context, deadline);
    runWithDeadline(gameScript(state, request.game_id), context, deadline);
    runWithDeadline(new vm.Script("onLoad()", { filename: "annotation-simulator:onLoad" }), context, deadline);
    await waitForReady(context, deadline);
    if (context.__crispEvaluator?.error != null) {
      throw new Error(`Runtime initialization failed: ${context.__crispEvaluator.error}`);
    }
    viewSize = readViewSize(context, deadline);
    const started = cloneFromContext(runWithDeadline(
      new vm.Script("__crispEvaluator.startEpisode()", { filename: "annotation-simulator:startEpisode" }),
      context,
      deadline
    ));
    episodeRandomSeed = started.episodeRandomSeed;
    finalScore = started.score;
    stage = "running";

    const pressedStates = closedLoopController == null
      ? expandPressedStates(request.input_sequence)
      : Array.from({ length: request.input_sequence.duration_ticks }, () => null);
    const stepScript = new vm.Script("__crispEvaluator.step({ pressed: __simulatorPressed })", {
      filename: "annotation-simulator:step",
    });
    for (let actionTick = 0; actionTick < pressedStates.length; actionTick++) {
      const pressed = closedLoopController == null
        ? pressedStates[actionTick]
        : await closedLoopController.nextPressed({ logical_tick: actionTick });
      if (typeof pressed !== "boolean") throw new Error("closed-loop controller must return a boolean pressed state");
      const previousPressed = executedPressedStates.at(-1) ?? false;
      const justPressed = pressed && !previousPressed;
      const justReleased = !pressed && previousPressed;
      pressedRunTicks = pressed ? (previousPressed ? pressedRunTicks + 1 : 1) : 0;
      if (justReleased) releaseCount++;
      executedPressedStates.push(pressed);
      context.__simulatorPressed = pressed;
      const step = cloneFromContext(runWithDeadline(stepScript, context, deadline));
      executedTickCount++;
      lastLogicalTick = step.logicalTick;
      if (closedLoopController != null) {
        const observation = options.toClosedLoopObservation?.(structuredClone(step), {
          pressed,
          just_pressed: justPressed,
          just_released: justReleased,
          pressed_run_ticks: pressedRunTicks,
          release_count: releaseCount,
        }, requestIndex);
        if (observation === undefined) throw new Error("closed-loop observation adapter must return an observation");
        await closedLoopController.observe(observation);
        await options.onClosedLoopObservation?.(structuredClone(observation), requestIndex);
      }
      finalScore = step.score;
      episodeRandomSeed = step.episodeRandomSeed;
      await options.onPrivateFrame?.(structuredClone(step), requestIndex);
      if (options.retainFrames !== false) {
        frames.push({
          logical_tick: step.logicalTick,
          input: {
            pressed: step.input.pressed,
            just_pressed: step.input.justPressed,
            just_released: step.input.justReleased,
          },
          phase: step.phase,
          private_step_sha256: hashCanonicalJson(step),
          canvas_sha256: null,
        });
      }
      if (step.phase === "gameOver") {
        termination = { kind: "game_over", logical_tick: step.logicalTick, message: null };
        break;
      }
      if (step.phase === "error") {
        termination = { kind: "runtime_error", logical_tick: step.logicalTick, message: "Runtime returned phase error." };
        break;
      }
    }
    termination ??= { kind: "tick_budget", logical_tick: lastLogicalTick, message: null };
    if (closedLoopController != null && executedPressedStates.length > 0) {
      const actualInputSequence = statesToSequence(executedPressedStates);
      inputSequenceSha256 = hashCanonicalJson(actualInputSequence);
      await options.onClosedLoopActionSequence?.(structuredClone(actualInputSequence), requestIndex);
    }
  } catch (error) {
    const isTimeout = error instanceof SimulatorTimeoutError || /Script execution timed out/.test(String(error));
    termination = {
      kind: isTimeout ? "timeout" : stage === "running" ? "runtime_error" : "load_error",
      logical_tick: lastLogicalTick,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  // Node reports unhandled rejections at a macrotask boundary, and the episode loop only yields microtasks.
  // Cross one boundary before snapshotting so a rejection raised by this episode is attributed to it instead
  // of leaking into the next one.
  await new Promise((resolve) => setImmediate(resolve));
  diagnostics.runtime_errors.push(...guardedRejections.slice(rejectionMark));
  return assertValidPrivateEpisodeResult({
    schema_version: 0,
    artifact_class: "private_runtime",
    game_id: request.game_id,
    source_commit: adapter.source_commit,
    source_hash: adapter.source_sha256,
    runtime_bundle_sha256: state.runtimeBundleSha256,
    gameplay_seed: request.gameplay_seed,
    view_size: viewSize,
    input_sequence_sha256: inputSequenceSha256,
    episode_random_seed: episodeRandomSeed,
    executed_ticks: executedTickCount,
    final_score: finalScore,
    termination,
    frames,
    diagnostics,
  });
}

const viewSizeScript = new vm.Script(
  "(() => {"
  + " const size = typeof options !== 'undefined' && options != null ? options.viewSize : null;"
  + " return size == null ? { x: 100, y: 100 } : { x: size.x, y: size.y };"
  + "})()",
  { filename: "annotation-simulator:viewSize" }
);

// The logical view rectangle is a runtime observation, not an adapter or plan declaration: downstream
// boundary reasoning must never depend on an agent-supplied number. Games that do not set `options.viewSize`
// run on the crisp-game-lib default of 100x100.
function readViewSize(context, deadline) {
  const size = cloneFromContext(runWithDeadline(viewSizeScript, context, deadline));
  return Number.isFinite(size?.x) && Number.isFinite(size?.y) && size.x > 0 && size.y > 0
    ? { x: size.x, y: size.y }
    : null;
}

function createRuntimeContext(gameplaySeed, diagnostics) {
  const document = createDocument();
  const storage = new Map();
  const context = {
    console: {
      log() {},
      info() {},
      warn() {},
      error(...values) { diagnostics.console_errors.push(values.map(String).join(" ")); },
    },
    document,
    innerWidth: 800,
    innerHeight: 600,
    location: { search: "" },
    localStorage: {
      getItem(key) { return storage.has(key) ? storage.get(key) : null; },
      setItem(key, value) { storage.set(String(key), String(value)); },
      removeItem(key) { storage.delete(String(key)); },
      clear() { storage.clear(); },
    },
    navigator: { userAgent: "crisp-game-lib-generic-annotation-simulator" },
    performance: { now: () => 0 },
    AudioContext: SimulatorAudioContext,
    webkitAudioContext: SimulatorAudioContext,
    // Audio assets never load: the returned promise stays pending, so declaring `audioFiles` neither
    // initializes audio state nor produces a rejection. Games that need fetched data for their mechanics are
    // rejected by the static qualification stage, not by this stub.
    fetch: () => new Promise(() => {}),
    requestAnimationFrame() { throw new Error("RAF is unavailable in annotation simulator manual mode"); },
    cancelAnimationFrame() {},
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    structuredClone,
    Uint8ClampedArray,
    TextEncoder,
    TextDecoder,
    URL,
    __crispEvaluatorConfig: {
      schemaVersion: 1,
      executionMode: "manual",
      gameplaySeed,
      drawingAnnotations: true,
    },
    addEventListener() {},
    removeEventListener() {},
  };
  context.window = context;
  context.globalThis = context;
  document.defaultView = context;
  return vm.createContext(context, {
    name: `annotation-simulator-${gameplaySeed}`,
    codeGeneration: { strings: true, wasm: false },
  });
}

// Inert audio host layer. Sound is an omitted observation channel, and BGM or SE declarations are
// presentation, not mechanics — without this shim a game that declares `audioFiles` could not be evaluated
// mechanically at all, and stripping the declaration would violate the annotation-only source rule. Every
// node here is a no-op sink: it generates no artifact, exposes no observation, and cannot affect game state.
class SimulatorAudioNode {
  constructor() {
    this.gain = { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {} };
    this.buffer = null;
    this.loop = false;
  }
  connect() { return this; }
  disconnect() {}
  start() {}
  stop() {}
  noteOn() {}
  noteOff() {}
}

class SimulatorAudioContext {
  constructor() {
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.state = "running";
    this.destination = new SimulatorAudioNode();
  }
  createGain() { return new SimulatorAudioNode(); }
  createBufferSource() { return new SimulatorAudioNode(); }
  createOscillator() { return new SimulatorAudioNode(); }
  createMediaStreamDestination() { return { stream: null }; }
  decodeAudioData() { return new Promise(() => {}); }
  resume() { return Promise.resolve(); }
  suspend() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
}

function createDocument() {
  const body = createContainer();
  const head = createContainer();
  return {
    title: "",
    hidden: false,
    body,
    head,
    defaultView: null,
    createElement(tagName) {
      if (String(tagName).toLowerCase() === "canvas") return new SimulatorCanvas();
      return {
        tagName: String(tagName).toUpperCase(),
        style: {},
        src: "",
        href: "",
        width: 0,
        height: 0,
        addEventListener() {},
        removeEventListener() {},
        click() {},
      };
    },
    addEventListener() {},
    removeEventListener() {},
  };
}

function createContainer() {
  return {
    style: {},
    children: [],
    appendChild(child) { this.children.push(child); return child; },
    removeChild(child) { this.children = this.children.filter((value) => value !== child); return child; },
  };
}

class SimulatorCanvas {
  constructor() {
    this._width = 300;
    this._height = 150;
    this.style = {};
    this.offsetLeft = 0;
    this.offsetTop = 0;
    this.clientWidth = 100;
    this.clientHeight = 100;
    this.context = new SimulatorCanvasContext(this);
  }
  get width() { return this._width; }
  set width(value) { this._width = Number(value); this.context?.reset(); }
  get height() { return this._height; }
  set height(value) { this._height = Number(value); this.context?.reset(); }
  getContext(kind) { return kind === "2d" ? this.context : null; }
  getBoundingClientRect() {
    return { top: 0, left: 0, width: this.clientWidth, height: this.clientHeight, right: this.clientWidth, bottom: this.clientHeight, x: 0, y: 0 };
  }
  addEventListener() {}
  removeEventListener() {}
  toDataURL() { return "data:image/png;base64,"; }
}

class SimulatorCanvasContext {
  constructor(canvas) {
    this.canvas = canvas;
    this.fillStyle = "#000";
    this.strokeStyle = "#000";
    this.lineWidth = 1;
    this.globalAlpha = 1;
    this.globalCompositeOperation = "source-over";
    this.imageSmoothingEnabled = false;
    this.reset();
  }
  reset() { this.pixels = new Uint8ClampedArray(Math.max(0, this.canvas.width * this.canvas.height * 4)); }
  clearRect(x, y, width, height) { this.#paint(x, y, width, height, 0); }
  fillRect(x, y, width, height) { this.#paint(x, y, width, height, 255); }
  getImageData(x, y, width, height) {
    const data = new Uint8ClampedArray(Math.max(0, width * height * 4));
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const sx = Math.floor(x + px);
        const sy = Math.floor(y + py);
        if (sx < 0 || sy < 0 || sx >= this.canvas.width || sy >= this.canvas.height) continue;
        const source = (sy * this.canvas.width + sx) * 4;
        const destination = (py * width + px) * 4;
        data[destination + 3] = this.pixels[source + 3];
      }
    }
    return { data, width, height };
  }
  putImageData() {}
  drawImage() {}
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  arc() {}
  fill() {}
  stroke() {}
  save() {}
  restore() {}
  translate() {}
  rotate() {}
  scale() {}
  setTransform() {}
  measureText() { return { width: 0 }; }
  fillText() {}
  createLinearGradient() { return { addColorStop() {} }; }
  #paint(x, y, width, height, alpha) {
    const x0 = Math.max(0, Math.floor(Math.min(x, x + width)));
    const x1 = Math.min(this.canvas.width, Math.ceil(Math.max(x, x + width)));
    const y0 = Math.max(0, Math.floor(Math.min(y, y + height)));
    const y1 = Math.min(this.canvas.height, Math.ceil(Math.max(y, y + height)));
    for (let py = y0; py < y1; py++) {
      for (let px = x0; px < x1; px++) this.pixels[(py * this.canvas.width + px) * 4 + 3] = alpha;
    }
  }
}

function gameScript(state, gameId) {
  if (!state.compiledGames.has(gameId)) {
    const descriptor = state.games.get(gameId);
    state.compiledGames.set(gameId, new vm.Script(
      fs.readFileSync(resolveInside(state.root, descriptor.source_path), "utf8"),
      { filename: descriptor.source_path }
    ));
  }
  return state.compiledGames.get(gameId);
}

function runWithDeadline(script, context, deadline) {
  const timeout = remaining(deadline);
  return script.runInContext(context, { timeout });
}

async function waitForReady(context, deadline) {
  while (context.__crispEvaluator?.ready !== true && context.__crispEvaluator?.error == null) {
    if (Date.now() >= deadline) throw new SimulatorTimeoutError("Simulator initialization timeout exceeded");
    await new Promise((resolve) => setImmediate(resolve));
  }
}

function cloneFromContext(value) {
  return structuredClone(value);
}

function statesToSequence(states) {
  const transitions = [];
  let previous = false;
  for (let tick = 0; tick < states.length; tick++) {
    if (tick === 0 || states[tick] !== previous) transitions.push({ tick, pressed: states[tick] });
    previous = states[tick];
  }
  return assertValidInputSequence({ schema_version: 1, duration_ticks: states.length, transitions });
}

function remaining(deadline) {
  const value = deadline - Date.now();
  if (value <= 0) throw new SimulatorTimeoutError("Simulator wall-clock timeout exceeded");
  return value;
}

function normalizeAdapter(root, value) {
  if (value == null || typeof value !== "object") throw new Error("Game adapter must be an object");
  if (!GAME_ID_PATTERN.test(value.game_id ?? "")) throw new Error("Adapter game_id must match ^[a-z0-9-]+$");
  const sourcePath = normalizeRelativePath(value.source_path);
  const actualSourceSha256 = sha256File(resolveInside(root, sourcePath));
  if (!/^[0-9a-f]{64}$/.test(value.source_sha256 ?? "")) {
    throw new Error(`Adapter ${value.game_id} requires source_sha256`);
  }
  if (actualSourceSha256 !== value.source_sha256) {
    throw new Error(`Adapter ${value.game_id} source SHA-256 mismatch`);
  }
  if (value.source_commit != null && !/^[0-9a-f]{40}$/.test(value.source_commit)) {
    throw new Error(`Adapter ${value.game_id} source_commit must be a full commit or null`);
  }
  if (!Number.isInteger(value.annotation_contract_version) || value.annotation_contract_version < 1) {
    throw new Error(`Adapter ${value.game_id} requires a positive annotation_contract_version`);
  }
  return Object.freeze({
    game_id: value.game_id,
    source_path: sourcePath,
    source_sha256: actualSourceSha256,
    source_commit: value.source_commit ?? null,
    annotation_contract_version: value.annotation_contract_version,
  });
}

function normalizeRelativePath(value) {
  if (typeof value !== "string" || value.length < 1 || path.isAbsolute(value)) {
    throw new Error("Runtime and game source paths must be non-empty relative paths");
  }
  return value.split(path.sep).join("/");
}

function resolveInside(root, relativePath) {
  const absolute = path.resolve(root, relativePath);
  const relation = path.relative(root, absolute);
  if (relation === "" || relation.startsWith(`..${path.sep}`) || relation === ".." || path.isAbsolute(relation)) {
    if (relation !== "") throw new Error(`Path escapes simulator root: ${relativePath}`);
  }
  return absolute;
}

export function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

class SimulatorTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = "SimulatorTimeoutError";
  }
}
