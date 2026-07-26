// Stage 0 intake for a generated batch: freeze each game source under generated/<game-id>/<batch-id>/ and
// scaffold every mechanical artifact that does not require judgement (manifest, adapter, plan skeleton,
// evaluation config entry). Annotation planning, the instrumented copy, and the private policy stay with the
// agent; this script only removes the error-prone hash and boilerplate work.
//
// Usage:
//   node scripts/intake-batch-games.mjs <batch-id> <source-directory> [game-id ...]
//
// <source-directory> holds one directory per game, each containing main.js (the layout produced by the
// generation workflow in tmp/games/, and the published layout in docs/).

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [batchId, sourceDirectory, ...requestedGameIds] = process.argv.slice(2);

if (batchId == null || sourceDirectory == null) {
  throw new Error("usage: node scripts/intake-batch-games.mjs <batch-id> <source-directory> [game-id ...]");
}
if (!/^[a-z0-9-]+$/.test(batchId)) throw new Error("batch id must match ^[a-z0-9-]+$");

// npm runs this with the workflow root as the working directory even when invoked from the repository root
// (`npm --prefix evaluation ...`), so resolve the source directory against the directory the user actually
// typed the command in first.
const absoluteSourceDirectory = resolveSourceDirectory(sourceDirectory);
const candidates = fs.readdirSync(absoluteSourceDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(absoluteSourceDirectory, name, "main.js")))
  .sort();
const selected = requestedGameIds.length === 0
  ? candidates
  : candidates.filter((name) => requestedGameIds.includes(name));
const unknown = requestedGameIds.filter((name) => !candidates.includes(name));
if (unknown.length > 0) throw new Error(`no main.js found for: ${unknown.join(", ")}`);
if (selected.length === 0) throw new Error(`no game with main.js under ${sourceDirectory}`);

const invalidIds = selected.filter((name) => !/^[a-z0-9-]+$/.test(name));
if (invalidIds.length > 0) {
  throw new Error(`game directory names must match ^[a-z0-9-]+$: ${invalidIds.join(", ")}`);
}

const runtimeBundlePath = "vendor/crisp-game-lib/docs/bundle.js";
const runtimeBundleSha256 = digest(path.join(root, runtimeBundlePath));
const acquiredAt = new Date().toISOString();
const intake = [];

for (const gameId of selected) {
  const base = `generated/${gameId}/${batchId}`;
  const absoluteBase = path.join(root, base);
  const sourcePath = path.join(absoluteSourceDirectory, gameId, "main.js");
  const originalRelative = `${base}/original/main.js`;
  const instrumentedRelative = `${base}/instrumented/main.js`;

  if (fs.existsSync(path.join(absoluteBase, "original/main.js"))) {
    const frozen = digest(path.join(absoluteBase, "original/main.js"));
    if (frozen !== digest(sourcePath)) {
      throw new Error(`${gameId}: a different source is already frozen under ${base}; use a new batch id`);
    }
  }

  write(originalRelative, fs.readFileSync(sourcePath, "utf8"));
  // The instrumented copy starts as a byte-identical copy so that the annotation-only diff gate is
  // meaningful from the first run; the agent adds only beginDrawing/endDrawing lines to it.
  if (!fs.existsSync(path.join(root, instrumentedRelative))) {
    write(instrumentedRelative, fs.readFileSync(sourcePath, "utf8"));
  }

  const originalSha256 = digest(path.join(root, originalRelative));
  const instrumentedSha256 = digest(path.join(root, instrumentedRelative));

  write(`${base}/game.manifest.json`, `${JSON.stringify({
    schema_version: 1,
    game_id: gameId,
    source: { path: originalRelative, sha256: originalSha256, repository: null, commit: null },
    instrumented_source: {
      path: instrumentedRelative,
      sha256: instrumentedSha256,
      repository: null,
      commit: null,
    },
    pair_id: null,
    runtime: { name: "crisp-game-lib", version: "1.5.0", bundle_sha256: runtimeBundleSha256 },
    input_styles: ["tap"],
    execution_environment: "fresh_node_vm",
    observation_channels: ["runtime_result", "private_drawing_annotation"],
    trust_class: "simulator_only_unverified",
  }, null, 2)}\n`);

  write(`${base}/adapter.mjs`, [
    "export default {",
    `  game_id: ${JSON.stringify(gameId)},`,
    `  source_path: ${JSON.stringify(instrumentedRelative)},`,
    `  source_sha256: ${JSON.stringify(instrumentedSha256)},`,
    "  source_commit: null,",
    "  annotation_contract_version: 1,",
    "};",
    "",
  ].join("\n"));

  // The policy is game-specific judgement, but its module contract is not: scaffold the shape the shared
  // executor requires so it does not have to be rediscovered from the runtime source per game.
  if (!fs.existsSync(path.join(root, `${base}/private-policy.mjs`))) {
    write(`${base}/private-policy.mjs`, policySkeleton(gameId));
  }

  write(`${base}/intake.json`, `${JSON.stringify({
    schema_version: 1,
    artifact_class: "private_intake_record",
    game_id: gameId,
    batch_id: batchId,
    acquired_at: acquiredAt,
    acquisition_source: path.relative(path.dirname(root), sourcePath),
    original_sha256: originalSha256,
    runtime_bundle_sha256: runtimeBundleSha256,
    pair_id: null,
    notes: [
      "input_styles in game.manifest.json is a placeholder until static qualification confirms it.",
      "instrumented/main.js starts byte-identical to the original; only annotation scopes may be added.",
    ],
  }, null, 2)}\n`);

  intake.push({ gameId, base, originalSha256, instrumentedSha256 });
  process.stdout.write(`${gameId}: frozen at ${base} (${originalSha256.slice(0, 12)})\n`);
}

const configPath = `batches/${batchId}/evaluation-config.mjs`;
if (!fs.existsSync(path.join(root, configPath))) {
  write(configPath, [
    "// Frozen evaluation config for this batch. List only adapters, policies, plan paths, policy parameters,",
    "// and required annotation coverage. Record its SHA-256 in the completion report before execution.",
    ...intake.map(({ gameId, base }) => (
      `import ${camel(gameId)}Adapter from "../../${base}/adapter.mjs";\n`
      + `import * as ${camel(gameId)}Policy from "../../${base}/private-policy.mjs";`
    )),
    "",
    "export const evaluationConfigs = [",
    ...intake.map(({ gameId, base }) => [
      "  {",
      `    adapter: ${camel(gameId)}Adapter,`,
      `    policy: ${camel(gameId)}Policy,`,
      `    policyPath: "${base}/private-policy.mjs",`,
      `    planPath: "${base}/play-log-quality-plan.private.json",`,
      "    parameters: undefined,",
      "    requiredCoverage: [], // fill in from the annotation plan",
      "  },",
    ].join("\n")),
    "];",
    "",
  ].join("\n"));
  process.stdout.write(`scaffolded ${configPath}\n`);
} else {
  process.stdout.write(`${configPath} already exists; left unchanged\n`);
}

process.stdout.write([
  "",
  "Next, per game (agent work that cannot be scaffolded):",
  "  1. Stage 1-2: static qualification and the private mechanical inventory",
  "  2. Stage 3-4: annotation plan, then annotation-only scopes in instrumented/main.js",
  `     npm run check:annotation-diff -- generated/<game-id>/${batchId}/original/main.js generated/<game-id>/${batchId}/instrumented/main.js`,
  "     Re-run this intake script afterwards to refresh the instrumented hash in adapter.mjs and the manifest",
  "  3. Stage 7: private-policy.mjs, qualified on development seeds only",
  "  4. Stage 8: play-log-quality-plan.private.json, frozen before any analysis seed is opened",
  `     output_directory must be generated/<game-id>/${batchId}/artifacts/play-log-analysis`,
  `  5. npm run evaluate:play-log-quality -- ${configPath}`,
  "",
].join("\n"));

function policySkeleton(gameId) {
  return [
    `// Private closed-loop policy for ${gameId}.`,
    "//",
    "// Contract required by the shared Stage 8-13 executor:",
    "//   toObservation(step, input, requestIndex) -> observation",
    "//     Build the versioned allowlist the policy is allowed to see. Never return source objects,",
    "//     functions, future state, or the runtime RNG.",
    "//   createController(parameters) -> { nextPressed({ logical_tick }), observe(observation) }",
    "//     nextPressed() must return a boolean and must be deterministic: exact replay of the recorded",
    "//     input sequence is a hard gate, so no Math.random, no Date, no wall-clock.",
    "//     observe() runs after the step it describes, so the decision for tick t may only use",
    "//     observations up to tick t-1. Plan for that one-tick lag instead of trying to remove it.",
    "//   `parameters` comes from the frozen evaluation config and shares the plan's freeze boundary.",
    "",
    "export function toObservation(step, input) {",
    "  return {",
    "    logical_tick: step.logicalTick,",
    "    score: step.score,",
    "    phase: step.phase,",
    "    input: {",
    "      pressed: input.pressed,",
    "      just_pressed: input.just_pressed,",
    "      just_released: input.just_released,",
    "    },",
    "    records: (step.privateDrawing?.records ?? []).map((record) => ({",
    "      type: record.subject?.type ?? null,",
    "      pos: { x: record.pos.x, y: record.pos.y },",
    "      size: { x: record.size.x, y: record.size.y },",
    "    })),",
    "  };",
    "}",
    "",
    "export function createController(parameters = {}) {",
    "  const settings = { ...parameters };",
    "  let observed = null;",
    "",
    "  return {",
    "    nextPressed({ logical_tick }) {",
    "      if (observed == null) return false; // TODO: opening behaviour before the first observation",
    "      // TODO: decide from `observed` only. Keep it deterministic.",
    "      return false;",
    "    },",
    "    observe(observation) {",
    "      observed = observation;",
    "    },",
    "  };",
    "}",
    "",
  ].join("\n");
}

function resolveSourceDirectory(value) {
  const candidates = [
    ...(path.isAbsolute(value) ? [] : [process.env.INIT_CWD, process.cwd(), root]
      .filter(Boolean)
      .map((base) => path.resolve(base, value))),
    ...(path.isAbsolute(value) ? [path.resolve(value)] : []),
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate)
    && fs.statSync(candidate).isDirectory());
  if (found == null) {
    throw new Error(`source directory not found; tried:\n  ${[...new Set(candidates)].join("\n  ")}`);
  }
  return found;
}

function write(relativePath, contents) {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, contents);
}

function digest(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function camel(gameId) {
  return gameId.replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase());
}
