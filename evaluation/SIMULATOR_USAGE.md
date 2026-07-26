# Generic Simulator Usage

This document defines how to register one or more instrumented crisp-game-lib games with the generic Node VM
simulator bundled with this workflow root (`evaluation/`) and run episodes. Execution observes only `runtime_result` and
`private_drawing_annotation`; it does not acquire images, audio, real time, or external host events.

## 1. Setup

Install dependencies with the workflow root (`evaluation/`) as the working directory, and pass the shared runtime gates first.

```bash
cd evaluation
npm ci --ignore-scripts
npm test
```

`package-lock.json` pins `ajv 8.20.0` and its dependencies. A successful `npm test` shows only the conformance
of the bundled runtime; it does not guarantee annotation coverage or mechanical quality of any new game.

## 2. Adapter registration

Create `generated/<game-id>/adapter.mjs` as the following data-only module.

```js
export default {
  game_id: "example-game",
  source_path: "generated/example-game/instrumented/main.js",
  source_sha256: "<SHA-256 of instrumented main.js>",
  source_commit: null,
  annotation_contract_version: 1,
};
```

The default `rootDir` of `createSimulator()` is the workflow root (`evaluation/`) itself. `runtimeBundlePath` and the adapter's
`source_path` are resolved as relative paths from this root, and references outside the root are rejected.
Specify a 40-character commit in `source_commit` only when a full commit exists in the snapshot.

Even when loading the fixed bundle from the default path, pass its known hash to verify it before execution.

```js
import adapter from "./adapter.mjs";
import { createSimulator } from "../../runtime/index.mjs";

const simulator = createSimulator({
  runtimeBundleSha256: "6aa6b18a3ff3fd75866c3e758b4b1758aa234da1d72116e1fb5ed59164f558a4",
  adapters: [adapter],
});
```

When specifying a different root or bundle, fix `rootDir`, `runtimeBundlePath`, and `runtimeBundleSha256`
together. If the bundle or source hash does not match, stop without starting any episode.

## 3. Episode request

Open-loop requests follow [`schemas/episode-run-request.v0.schema.json`](schemas/episode-run-request.v0.schema.json).

```js
const request = {
  schema_version: 0,
  game_id: "example-game",
  gameplay_seed: 42001,
  input_sequence: {
    schema_version: 1,
    duration_ticks: 600,
    transitions: [
      { tick: 0, pressed: false },
      { tick: 30, pressed: true },
      { tick: 45, pressed: false },
    ],
  },
  timeout_ms: 30000,
  capture_canvas: false,
};
```

- `gameplay_seed` is a uint32.
- `duration_ticks` is the tick budget of the input sequence.
- Ticks without a transition keep the previous `pressed` state.
- Edges are derived by the runtime and are not stored in the request.
- `capture_canvas` is always `false`; `true` is a schema error.
- `timeout_ms` is a technical wall-clock limit, not gameplay time.

## 4. Baseline episode: complete example

The following is an example to place at `generated/example-game/run-smoke.mjs`.

```js
import fs from "node:fs";
import adapter from "./adapter.mjs";
import {
  createSimulator,
  generateBaselinePolicy,
  hashCanonicalJson,
} from "../../runtime/index.mjs";

const { inputSequence, provenance } = generateBaselinePolicy({
  role: "periodic",
  durationTicks: 600,
  periodTicks: 30,
  pressedTicks: 10,
});

const simulator = createSimulator({
  runtimeBundleSha256: "6aa6b18a3ff3fd75866c3e758b4b1758aa234da1d72116e1fb5ed59164f558a4",
  adapters: [adapter],
});

const privateSteps = [];
const [result] = await simulator.runEpisodes([{
  schema_version: 0,
  game_id: adapter.game_id,
  gameplay_seed: 42001,
  input_sequence: inputSequence,
  timeout_ms: 30000,
  capture_canvas: false,
}], {
  onPrivateFrame(step, requestIndex) {
    privateSteps.push({ request_index: requestIndex, step });
  },
});

const privateArtifact = {
  format_version: 1,
  artifact_class: "private_runtime",
  game_id: adapter.game_id,
  policy_provenance: provenance,
  steps: privateSteps,
};
const artifactDirectory = new URL("./artifacts/", import.meta.url);
fs.mkdirSync(artifactDirectory, { recursive: true });
fs.writeFileSync(
  new URL("baseline-private-steps.json", artifactDirectory),
  `${JSON.stringify(privateArtifact, null, 2)}\n`
);
fs.writeFileSync(
  new URL("baseline-result.json", artifactDirectory),
  `${JSON.stringify({
    result,
    private_annotation_sha256: hashCanonicalJson(privateArtifact),
  }, null, 2)}\n`
);
```

Run:

```bash
node generated/example-game/run-smoke.mjs
```

The `step.privateDrawing` received by `onPrivateFrame` is private instrumentation. Do not repurpose it as a
blind package, public observation, or a substitute for the screen a human would see. Record the storage
location, artifact format version, and hash reference in the game manifest and result.

## 5. Baseline roles

The canonical roles accepted by `generateBaselinePolicy()` are as follows.

| role | Required options | Behavior |
| --- | --- | --- |
| `idle` | none | Released on all ticks |
| `hold` | none | Pressed on all ticks from tick 0 |
| `periodic` | `periodTicks`, `pressedTicks` | Press/release at a fixed period |
| `seeded_random` | `meanSegmentTicks`, `policySeed` | Seeded random toggle |

`role: "random"` is also accepted for compatibility, but provenance records `seeded_random`. Use
`seeded_random` in formal artifacts.

## 6. `runEpisodes()` options

```js
await simulator.runEpisodes(requests, options);
```

| option | default | Meaning |
| --- | --- | --- |
| `concurrency` | `1` | Number of fresh-VM episodes to run concurrently. Positive integers only |
| `retainFrames` | `true` | Retain per-tick summary hashes in the result |
| `onPrivateFrame(step, requestIndex)` | none | Pass raw private steps to an external sink per episode |

In formal conformance, keep `retainFrames: true` and check `result.frames.length === result.executed_ticks`.
With `concurrency > 1`, callback order may interleave across requests, so always separate by `requestIndex`.

The return value is an array of results in the same order as the requests, following
[`schemas/private-episode-result.v0.schema.json`](schemas/private-episode-result.v0.schema.json). Do not
convert technical failures to score 0; preserve `termination.kind` and diagnostics.

`result.view_size` is the logical view rectangle observed from the runtime (`options.viewSize`, defaulting to
100x100), or `null` when the episode failed before initialization. Use it for any boundary reasoning instead
of assuming a 100x100 view.

## 7. Closed-loop policy

For cases such as a private policy, where the next button state is decided from the previous tick's allowlist
observation, use `runClosedLoopEpisodes()`. The request shape differs from open-loop and specifies
`duration_ticks` directly.

```js
const requests = [{
  game_id: adapter.game_id,
  gameplay_seed: 42001,
  duration_ticks: 600,
  timeout_ms: 30000,
}];

const results = await simulator.runClosedLoopEpisodes(
  requests,
  () => ({
    nextPressed({ logical_tick }) {
      return logical_tick % 30 < 10;
    },
    observe(observation) {
      // Update only the policy state used from the next tick onward.
    },
  }),
  {
    toClosedLoopObservation(step, input) {
      return {
        logical_tick: step.logicalTick,
        score: step.score,
        phase: step.phase,
        input,
        private_drawing: step.privateDrawing,
      };
    },
    onClosedLoopObservation(observation, requestIndex) {},
    onClosedLoopActionSequence(inputSequence, requestIndex) {},
  }
);
```

For a game's own `private-policy.mjs`, the shared Stage 8–13 executor requires the module shape defined in
[WORKFLOW.md](WORKFLOW.md) Stage 7: named exports `toObservation(step, input, requestIndex)` and
`createController(parameters)`, where the controller exposes `nextPressed({ logical_tick })` and
`observe(observation)`. `npm run intake:batch` writes that skeleton. The example below is the underlying
runtime API those exports are wired into.

`toClosedLoopObservation` is required. Return only the pre-fixed allowlist fields to game-specific policies;
do not pass source objects, functions, future state, or the runtime RNG. `nextPressed()` returns a boolean, and
`observe()` completes before the next tick. Save the generated actual input sequence via
`onClosedLoopActionSequence`, and exact-replay it open-loop with the same seed.

## 8. Game-specific conformance

In addition to the shared `npm test`, check at least the following in
`generated/<game-id>/tests/simulator.test.mjs`.

1. idle, hold, periodic, and seeded_random run to the specified tick or a legitimate terminal.
2. The same adapter, seed, and input produce an identical full result.
3. `result.frames.length` matches `executed_ticks`.
4. `step.privateDrawing.records` exists for the required subjects.
5. Zero nested scopes, unterminated scopes, and runtime errors.
6. Changing the source or bundle hash is rejected before any episode.
7. The runtime rejects additional steps after terminal.

Use [`tests/runtime-conformance.test.mjs`](tests/runtime-conformance.test.mjs) as the reference implementation.

The shared gates for baseline execution, frame count, diagnostics, annotation presence, and exact replay can be
run together with `runAdapterConformance()`.

```js
import { runAdapterConformance } from "../../runtime/index.mjs";

const conformance = await runAdapterConformance({
  simulator,
  gameId: adapter.game_id,
  gameplaySeed: 41001,
  durationTicks: 120,
});
if (!conformance.passed) throw new Error("adapter conformance failed");
```

This helper checks up to the presence of annotation records. Which subjects are required and whether
unannotated geometry is acceptable must be checked additionally based on the game-specific annotation plan.

```bash
node --test generated/example-game/tests/simulator.test.mjs
```

On gate failure, stop as `technical_failure`, `annotation_incomplete`, or `unsupported_simulator_only`; do not
convert the failure into a game-quality conclusion or an overall score.

## 9. Common baseline matrix

Use `buildBaselineMatrix()` to generate requests for multiple seeds × common baselines under the same order and
conditions, and `runBaselineMatrix()` to execute them directly.

```js
import { runBaselineMatrix } from "../../runtime/index.mjs";

const records = await runBaselineMatrix(simulator, {
  gameId: adapter.game_id,
  gameplaySeeds: [42001, 42002],
  durationTicks: 600,
  timeoutMs: 30000,
  policies: [
    { role: "idle" },
    { role: "hold" },
    { role: "periodic", conditionId: "periodic-30-10", periodTicks: 30, pressedTicks: 10 },
    { role: "seeded_random", meanSegmentTicks: 12, policySeed: 70001 },
  ],
});
```

The return value is an array combining condition, policy provenance, request, and result. Do not mix policy
seeds and gameplay seeds into the same field.

## 10. Artifact validation and quality rendering

Machine-verify the contents of game-specific artifacts created by the agent against the shared schemas.

```bash
npm run validate:artifact -- game_manifest generated/example-game/game.manifest.json
npm run validate:artifact -- annotation_plan generated/example-game/annotation-plan.private.json
npm run validate:artifact -- play_log_quality_plan generated/example-game/play-log-quality-plan.private.json
npm run validate:artifact -- play_log_analysis_result generated/example-game/artifacts/play-log-analysis/analysis-result.json
npm run validate:artifact -- play_log_quality_result generated/example-game/play-log-quality-result.json
```

Generate the per-game ANALYSIS from the validated quality result.

```bash
npm run render:play-log-quality -- generated/example-game/play-log-quality-result.json generated/example-game/ANALYSIS.md
```

The formal hash sidecar for multiple games is generated at ranking time. Legacy report results, metric
applicability, and preregistration are not part of the current artifact contracts; they are kept only as past
reproduction material inside `archive/`.
