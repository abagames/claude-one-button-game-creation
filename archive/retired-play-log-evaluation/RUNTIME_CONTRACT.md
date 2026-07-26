# Simulator Runtime Contract

## Purpose

This document defines the shared runtime that executes the game adapters produced by this workflow. The
normative implementation is `runtime/simulator.mjs`, the module entrypoint is `runtime/index.mjs`, and the
fixed bundle is `vendor/crisp-game-lib/docs/bundle.js`. It does not assume a runner for any specific game or
external repository.

## Game adapter contract

Each `generated/<game-id>/adapter.mjs` returns the following data object as its default export.

```js
export default {
  game_id: "<stable-kebab-case-id>",
  source_path: "generated/<game-id>/instrumented/main.js",
  source_sha256: "<64 lowercase hex>",
  source_commit: null,
  annotation_contract_version: 1,
};
```

- Paths are relative to the workflow root (`evaluation/`); references outside the root are not allowed.
- `source_sha256` is verified against the actual file at executor initialization; on mismatch, stop before any
  episode.
- `source_commit` is a full 40-character commit or `null`. Do not invent history that does not exist in the
  snapshot.
- The adapter contains no game logic, policies, metrics, host shims, or source rewrites.
- A game that cannot run on the standard `onLoad()`, `startEpisode()`, `step({pressed})` lifecycle is stopped
  as `unsupported_simulator_only` rather than handled with game-specific executor modifications.

Registration example:

```js
import adapter from "../generated/<game-id>/adapter.mjs";
import { createSimulator } from "../runtime/index.mjs";

const simulator = createSimulator({ adapters: [adapter] });
const results = await simulator.runEpisodes(requests, {
  onPrivateFrame(step, requestIndex) {
    // Save as a private artifact. Do not flow into blind/public evidence.
  },
});
```

See [SIMULATOR_USAGE.md](SIMULATOR_USAGE.md) for complete request, baseline, artifact storage, and closed-loop
connection examples.

## Required inputs

- crisp-game-lib bundle with a fixed content hash
- Annotation-only instrumented game source
- Game manifest
- Logical-tick input sequence
- Gameplay seed
- Positive integer tick budget
- Timeout rule

The input sequence is a series of `pressed` state transitions starting at tick 0. The state is `false` before
the first transition, and ticks without a specified transition keep the previous state. `just_pressed` and
`just_released` are derived from differences against the previous tick and are not stored in input artifacts.

## Context lifecycle

1. Create a new Node `vm` context per episode.
2. Load the fixed crisp-game-lib bundle into the context.
3. Load the instrumented game source without source rewrites.
4. Set the gameplay seed and manual logical-tick mode.
5. Complete title/lifecycle initialization according to the adapter contract.
6. Apply the input state and edges for each tick.
7. Run the game update/draw exactly once.
8. Collect the score, terminal state, input projection, and private drawing annotations.
9. End the episode on terminal or tick budget.
10. Discard the context. Do not reuse contexts via resets.

Do not use wall-clock waits for logical-tick synchronization. Do not share globals, random, input, audio state,
or annotation scopes across episodes.

The executor's internal minimal 2D API shim is a host compatibility layer for executing crisp primitives and
character HitBox calculations. It generates no image artifacts, pixel features, or screenshots, and none are
exposed as evaluation observations. The inert audio host layer described under "Supported capability class"
is the same kind of layer and produces no audio observation.

## Supported capability class

Games included in formal evaluation must be able to execute their mechanics using only the following.

- The crisp-game-lib API provided by the fixed bundle
- Synchronous game updates
- Seeded runtime random
- One-button state and edges
- Runtime score and terminal state
- Private annotation via `beginDrawing(subject)` / `endDrawing()`
- Static data bundled with the game source that can be explicitly supplied to the Node VM

If host APIs, asynchronous services, external processes, or real-time dependencies outside this capability
class are essential to the mechanics, stop as `unsupported_simulator_only` instead of guessing and reproducing
them in the adapter.

The executor also provides an inert audio host layer (`AudioContext` / `webkitAudioContext` stubs whose nodes
are no-op sinks, and an audio asset fetch that never settles). Like the 2D shim it is a host compatibility
layer: it produces no artifact, exposes no observation, and cannot affect game state. Its purpose is that a
game declaring `audioFiles` or BGM — presentation, which is out of scope — stays mechanically evaluable
instead of being excluded, since removing the declaration would violate the annotation-only source rule.
`audio_output` remains an omitted observation channel. Games whose mechanics depend on fetched data are still
rejected at static qualification; the fetch stub must not be treated as data loading support.

Runtime initialization and game code are asynchronous, so a missing capability or a rejected promise inside
the VM surfaces asynchronously. The executor records the reason in `termination.message` and
`diagnostics.runtime_errors`, the remaining episodes of the batch still run, and the host process is never
terminated. A non-empty diagnostic still fails the episode closed at the evaluation gates.

## Annotation sink

Pass normalized copies of HitBoxes generated inside annotation scopes to the private sink. Do not change
drawing order, collision detection, or primitive return values. Subject objects are used only for reference
identity within the episode; their properties are not retained. Out-of-scope geometry is unlabeled. Nested
scopes are forbidden; unterminated scopes are reset at frame end or on exception, leaving a diagnostic.
This section is the normative definition of role-tagged subject identity (other documents refer to this
section).

When both a role and object identity are required, use this workflow-specific extension form
`beginDrawing({ type: "<private-role>", object: entity })`. The sink references `entity` only as a WeakMap key
and converts it to `{ kind: "object", type, episodeRef }`. Neither `entity` itself nor its properties are
stored in artifacts. This form is not part of the standard crisp-game-lib API; only the fixed instrumented
bundle provides it.

## Episode result

A result has at least the following.

- Identifiers and hashes of game, source, runtime, and input
- Gameplay seed and the episode seed derived by the runtime
- `view_size`: the logical view rectangle observed from the runtime after initialization (`options.viewSize`,
  defaulting to the crisp-game-lib 100x100), or `null` when initialization failed. It is a runtime
  observation, so downstream boundary reasoning never depends on an adapter- or plan-declared number
- Executed logical ticks
- Final score
- Terminal kind
- Per-tick input projection
- Hash or reference of the private annotation artifact
- Runtime diagnostics

Observation channels are fixed to `runtime_result` and `private_drawing_annotation`. Do not represent any other
information as having been acquired.

## Conformance checks

This section is the normative definition of the simulator conformance inspection items (other documents refer
to this section).

- Obtain identical result hashes from identical input/seed
- If the game uses randomness, required differences appear across different seeds
- Input edges follow tick order
- Private frame count matches executed tick count
- Steps after terminal are rejected
- No state remains between fresh contexts
- Unsupported capabilities fail closed
- Annotation scope inconsistencies are detected as technical failures
- Adapter source and runtime bundle hash mismatches are rejected before episode start
- `capture_canvas: true` is rejected

This conformance shows self-consistency inside the Node VM. It does not claim agreement with the distribution
runtime, rendered presentation, or perceptibility.

Run the shared implementation gates with `npm test`. For new games, additionally inspect same-seed/input exact
replay and annotation coverage using that game's adapter.
