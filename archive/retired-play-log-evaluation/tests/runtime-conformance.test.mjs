import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  createSimulator,
  generateBaselinePolicy,
  runAdapterConformance,
  sha256File,
} from "../runtime/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = "tests/fixtures/annotated-one-button.js";
const adapter = {
  game_id: "annotated-one-button",
  source_path: sourcePath,
  source_sha256: sha256File(path.join(root, sourcePath)),
  source_commit: null,
  annotation_contract_version: 1,
};

function makeSimulator(overrides = {}) {
  return createSimulator({ rootDir: root, adapters: [adapter], ...overrides });
}

function makeRequest(inputSequence) {
  return {
    schema_version: 0,
    game_id: "annotated-one-button",
    gameplay_seed: 424242,
    input_sequence: inputSequence,
    timeout_ms: 30000,
    capture_canvas: false,
  };
}

test("generic adapter executes annotated one-button game without raster capture", async () => {
  const simulator = makeSimulator();
  const input = generateBaselinePolicy({
    role: "periodic",
    durationTicks: 20,
    periodTicks: 4,
    pressedTicks: 1,
  }).inputSequence;
  const privateSteps = [];
  const [result] = await simulator.runEpisodes([makeRequest(input)], {
    onPrivateFrame(step) { privateSteps.push(step); },
  });

  assert.equal(result.game_id, "annotated-one-button");
  assert.equal(result.termination.kind, "game_over");
  assert.equal(result.final_score, 3);
  assert.equal(result.frames.length, result.executed_ticks);
  assert.equal(result.frames.every((frame) => frame.canvas_sha256 === null), true);
  assert.equal(privateSteps.length, result.executed_ticks);
  assert.equal(privateSteps.every((step) => step.privateDrawing?.records?.length === 1), true);
  assert.equal(privateSteps.every((step) => step.privateDrawing.records[0].subject.type === "player"), true);
  assert.equal(new Set(privateSteps.map((step) => step.privateDrawing.records[0].subject.episodeRef)).size, 1);
  assert.deepEqual(simulator.descriptor.observation_channels, [
    "runtime_result",
    "private_drawing_annotation",
  ]);
});

test("same adapter, seed, and input replay exactly across fresh contexts", async () => {
  const simulator = makeSimulator();
  const input = generateBaselinePolicy({ role: "hold", durationTicks: 8 }).inputSequence;
  const request = makeRequest(input);
  const [first] = await simulator.runEpisodes([request]);
  const [second] = await simulator.runEpisodes([request]);
  assert.deepEqual(second, first);
});

test("generic adapter conformance covers all fixed baseline roles", async () => {
  const conformance = await runAdapterConformance({
    simulator: makeSimulator(),
    gameId: "annotated-one-button",
    gameplaySeed: 321,
    durationTicks: 20,
  });
  assert.equal(conformance.passed, true);
  assert.deepEqual(new Set(conformance.checks.map((check) => check.policy_role)), new Set([
    "idle", "hold", "periodic", "seeded_random",
  ]));
  assert.equal(conformance.first_results_sha256, conformance.replay_results_sha256);
});

test("the logical view rectangle is observed from the runtime, not declared", async () => {
  const input = generateBaselinePolicy({ role: "idle", durationTicks: 4 }).inputSequence;
  const [defaultView] = await makeSimulator().runEpisodes([makeRequest(input)]);
  assert.deepEqual(defaultView.view_size, { x: 100, y: 100 });

  const widePath = "tests/fixtures/wide-view-one-button.js";
  const wideAdapter = {
    game_id: "wide-view-one-button",
    source_path: widePath,
    source_sha256: sha256File(path.join(root, widePath)),
    source_commit: null,
    annotation_contract_version: 1,
  };
  const [wideView] = await createSimulator({ rootDir: root, adapters: [wideAdapter] }).runEpisodes([{
    schema_version: 0,
    game_id: "wide-view-one-button",
    gameplay_seed: 424242,
    input_sequence: input,
    timeout_ms: 30000,
    capture_canvas: false,
  }]);
  assert.deepEqual(wideView.view_size, { x: 200, y: 150 });
});

test("declaring audio assets does not block mechanical evaluation", async () => {
  const audioPath = "tests/fixtures/audio-declaring-one-button.js";
  const audioAdapter = {
    game_id: "audio-declaring-one-button",
    source_path: audioPath,
    source_sha256: sha256File(path.join(root, audioPath)),
    source_commit: null,
    annotation_contract_version: 1,
  };
  const simulator = createSimulator({ rootDir: root, adapters: [audioAdapter] });
  const request = {
    schema_version: 0,
    game_id: "audio-declaring-one-button",
    gameplay_seed: 424242,
    input_sequence: generateBaselinePolicy({
      role: "periodic",
      durationTicks: 20,
      periodTicks: 4,
      pressedTicks: 1,
    }).inputSequence,
    timeout_ms: 30000,
    capture_canvas: false,
  };
  const privateSteps = [];
  const [result] = await simulator.runEpisodes([request], {
    onPrivateFrame(step) { privateSteps.push(step); },
  });
  const [replay] = await simulator.runEpisodes([request]);

  // The audio host layer is inert, so the episode is a normal mechanical episode.
  assert.equal(result.termination.kind, "game_over");
  assert.deepEqual(result.view_size, { x: 100, y: 100 });
  assert.deepEqual(Object.values(result.diagnostics).flat(), []);
  assert.deepEqual(replay, result);
  assert.ok(privateSteps.every((step) => step.privateDrawing.records.length === 1));
  assert.deepEqual(simulator.descriptor.omitted_channels.includes("audio_output"), true);
});

// Run in a child process: the point of this test is that the host process survives an unhandled rejection
// raised from inside the VM. The node:test runner reports any unhandled rejection as a test failure
// regardless of installed handlers, so it cannot observe the production behavior.
test("an asynchronous failure inside the VM fails closed, not fatally", () => {
  const script = `
    import { createSimulator, generateBaselinePolicy, sha256File } from "./runtime/index.mjs";
    const adapters = ["async-failure-one-button", "annotated-one-button"].map((game_id) => {
      const source_path = \`tests/fixtures/\${game_id}.js\`;
      return {
        game_id,
        source_path,
        source_sha256: sha256File(source_path),
        source_commit: null,
        annotation_contract_version: 1,
      };
    });
    const simulator = createSimulator({ adapters });
    const input = generateBaselinePolicy({ role: "idle", durationTicks: 6 }).inputSequence;
    const results = await simulator.runEpisodes(adapters.map(({ game_id }) => ({
      schema_version: 0,
      game_id,
      gameplay_seed: 424242,
      input_sequence: input,
      timeout_ms: 30000,
      capture_canvas: false,
    })));
    process.stdout.write(JSON.stringify(results.map((result) => ({
      kind: result.termination.kind,
      diagnostics: result.diagnostics.runtime_errors,
    }))));
  `;
  const stdout = execFileSync(process.execPath, ["--input-type=module", "-e", script], {
    cwd: root,
    encoding: "utf8",
  });
  const [failing, healthy] = JSON.parse(stdout);

  assert.ok(failing.diagnostics.some((item) => /simulated asynchronous game failure/.test(item)));
  assert.deepEqual(healthy.diagnostics, []);
  assert.equal(healthy.kind, "tick_budget");
});

test("adapter source and runtime hashes fail closed", () => {
  assert.throws(() => createSimulator({
    rootDir: root,
    adapters: [{ ...adapter, source_sha256: "0".repeat(64) }],
  }), /source SHA-256 mismatch/);
  assert.throws(() => makeSimulator({ runtimeBundleSha256: "0".repeat(64) }), /Runtime bundle SHA-256/);
});

test("seeded_random is the canonical seeded baseline role", () => {
  const generated = generateBaselinePolicy({
    role: "seeded_random",
    durationTicks: 20,
    meanSegmentTicks: 4,
    policySeed: 1234,
  });
  const legacy = generateBaselinePolicy({
    role: "random",
    durationTicks: 20,
    meanSegmentTicks: 4,
    policySeed: 1234,
  });
  assert.equal(generated.provenance.policy_role, "seeded_random");
  assert.deepEqual(legacy, generated);
});

test("raster capture and unknown games are rejected", async () => {
  const simulator = makeSimulator();
  const input = generateBaselinePolicy({ role: "idle", durationTicks: 1 }).inputSequence;
  await assert.rejects(
    simulator.runEpisodes([{ ...makeRequest(input), capture_canvas: true }]),
    /Invalid episode request/
  );
  await assert.rejects(
    simulator.runEpisodes([{ ...makeRequest(input), game_id: "unknown-game" }]),
    /Unknown game adapter/
  );
});
