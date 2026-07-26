# Meta-Workflow

## Stage 0: Intake freeze

Fix the input game before making any changes.

Required records:

- `game_id`
- Source path and SHA-256
- crisp-game-lib version/bundle SHA-256
- Acquisition source and acquisition date/time
- Input style candidates: `tap`, `hold`, `release`, `mixed`
- External assets that appear necessary for gameplay

Assign a `pair_id` to fixed versions or variants of the same game, and do not automatically count them as
independent samples.

Gate:

- If the source cannot be uniquely re-identified, stop as `technical_failure`
- If the game depends on a runtime other than crisp-game-lib, stop as `unsupported_simulator_only`

## Stage 1: Static runtime qualification

The coding agent reads `main.js` and enumerates the dependencies required in the Node VM.

Check targets:

- `update()` entrypoint
- `title`, `description`, `characters`, `options`
- `input.isPressed`, `input.isJustPressed`, `input.isJustReleased`
- Score updates and `end()`
- crisp drawing primitives and collision return values
- Dependencies on host APIs, external services, real time, or asynchronous processing outside the capability
  class of [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md)
- Whether game initialization completes per episode, e.g. via `ticks === 0`

If features that cannot be provided in the Node VM are essential to the mechanics, stop as
`unsupported_simulator_only` instead of working around them with a source rewrite.

## Stage 2: Mechanical model inventory

Record semantic candidates from the source into a private inventory.

- Controllable subject candidates
- Hazard, target, item, projectile, and zone candidates
- Score event candidates
- Terminal event candidates
- Tap/hold/release and state transition candidates
- Correspondence between collision carriers and visible drawings
- Transparent or drawing-order-dependent collisions

This is private material for adapter development, not observational evidence for the evaluation report.
Mark targets whose meaning cannot be determined as `unresolved`.

## Stage 3: Annotation plan

Plan annotation scopes in units of existing calls that generate drawing or collision geometry.

```js
beginDrawing({ type: "private-role", object: entity });
const collision = box(position, size);
endDrawing();
```

Rules:

- Place scopes only immediately before and after existing drawing calls
- Put `beginDrawing(...)` and `endDrawing();` each on their own single line, as a single call statement.
  The shared diff checker accepts only this form: a line that appends any further statement after the
  annotation call (for example `beginDrawing({...}); addScore(1);`) is rejected, not silently removed
- Keep collision return values in the same variables
- A subject drawn with multiple primitives may be grouped into a single scope
- Follow the Annotation sink rules of [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md) for subject identity,
  WeakMap-based `episodeRef`, object property non-retention, and the prohibition on assembling `{type, id}`.
  For targets whose object reference cannot be passed safely, do not guess the identity; mark them `unresolved`
- Leave out-of-scope geometry unlabeled
- Record geometry that cannot be annotated, with reasons

The output is `annotation-plan.private.json`. Do not instrument before the plan is finalized.

## Stage 4: Annotation-only copy

Save the original to `original/main.js`, and add only the planned scopes to `instrumented/main.js`.

Static gate:

1. No token differences other than the added scopes
2. Identical crisp primitive arguments
3. Identical use of collision return values
4. Identical order of random, score, input, and array mutations
5. No nested scopes
6. Every scope closes within the same synchronous block

On violation, stop as `annotation_incomplete` or `technical_failure`.

Run the mechanical gate between the original and the instrumented copy as follows, and save the result JSON
as an artifact.

```bash
npm run check:annotation-diff -- generated/<game-id>/original/main.js generated/<game-id>/instrumented/main.js generated/<game-id>/artifacts/annotation-diff.json
```

## Stage 5: Simulator adapter

Use the bundled `runtime/index.mjs`, which satisfies [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md), and separate
game-specific information into `adapter.mjs`. Do not copy the shared executor into game output.
Use the open-loop example in [SIMULATOR_USAGE.md](SIMULATOR_USAGE.md) as the baseline for game-specific runners.

Adapter responsibilities:

- Game ID and instrumented source path
- Source hash and, if present, source commit
- Annotation contract version

Logical ticks, score, terminal state, private drawing callbacks, unsupported globals, and the fresh VM are the
shared executor's responsibilities. Do not add game-specific hooks to the adapter to imitate games outside the
standard lifecycle. The adapter must not directly expose source variable names to external evaluation schemas.
Do not use source rewrites, wall-clock sleeps, or shared VM resets.

## Stage 6: Simulator conformance

Follow the Conformance checks section of [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md) for the inspection items,
and verify them using only the Node VM.

This gate shows only the internal self-consistency of the simulator. It does not show agreement with the actual
distribution runtime.

First pass `npm test` at the workflow root (`evaluation/`), then run game-specific conformance with the generated
adapter registered. Follow [SIMULATOR_USAGE.md](SIMULATOR_USAGE.md) for request construction, annotation
collection, and exact replay tests. Run the shared parts with `runAdapterConformance()`, and add only coverage
assertions for required subjects to the game-specific tests.

## Stage 7: Policy construction

Fix the shared diagnostic controls first.

- `idle`
- `hold`
- `periodic`
- `seeded_random`

Use `buildBaselineMatrix()` / `runBaselineMatrix()` to generate and execute matched-seed control requests.
These are diagnostics for checking simulator response, event attribution, risk exposure differences, and
counterfactual hypotheses; do not use monotonic-input scores or differences from the private policy as
quality points.

Next, implement a game-specific `private_policy` that uses only the annotation inventory. Policy input is a
versioned allowlist; do not pass source objects, functions, future state, or the RNG directly.

This is the one step that encodes game-specific operating skill — how the button must actually be used in
this game — and it cannot be scaffolded. `generated/<game-id>/<evaluation-id>/private-policy.mjs` is a module
with exactly two named exports, and the shared executor requires this shape:

```js
export function toObservation(step, input, requestIndex) { /* versioned allowlist only */ }
export function createController(parameters) {
  return {
    nextPressed({ logical_tick }) { return false; }, // boolean, deterministic
    observe(observation) {},
  };
}
```

- `observe()` runs after the step it describes, so the decision for tick `t` may use observations only up to
  tick `t-1`. Design for that one-tick lag; do not try to remove it.
- `nextPressed()` must be deterministic. Exact replay of the recorded input sequence is a hard gate, so no
  `Math.random`, no `Date`, no wall-clock, no shared state across episodes.
- `parameters` comes from the frozen evaluation config and shares the plan's freeze boundary.
- `npm run intake:batch` writes this module's skeleton with the contract in its header.

Qualification:

- Select parameter candidates using development seeds only
- Reach at least one of the score, hazard, opportunity, or terminal candidates
- Obtain an exact result when replaying the same input
- Do not touch analysis seeds

### Reading the feasibility report before freezing

The feasibility artifact reports, per criterion, `probeable_development_episodes`: how many bounded edits each
development episode could generate, and `replication_ready_episode_count`. Read it before freezing the plan.
This is the last point where the instrument may still be adapted to the game, and it is the intended place to
do so — the shared rules are not loosened afterwards to rescue a game.

If a criterion is probeable in too few development episodes, the fixes are, in order of preference:

1. **Annotation plan.** Is the subject that causes the outcome actually annotated? An unannotated hazard makes
   terminals unmappable and an unannotated reward makes score attribution impossible.
2. **Private policy.** A policy that plays in very long uniform runs leaves little to edit. It does not need
   to play worse, but it should express the game's decisions rather than settle into one posture. Never tune
   it against analysis seeds, and never tune it toward a criterion's answer.
3. **Operation set and `press_edit_ticks`.** A hold-and-release game needs the release-timing operations; a
   tap game needs `insert_press_window` and the shift operations. A mismatch here looks like "no agency"
   when the truth is "the instrument never tried the input this game is made of".
4. **`lookback_ticks` and `local_window_ticks`.** Too short a lookback near a passive death yields nothing to
   edit.

Changing these on development seeds before the freeze is legitimate; changing them after analysis seeds are
opened requires a new evaluation ID and a disjoint analysis seed pool.

After qualification and before running any analysis episode, run the shared development-only feasibility gate.
From only the frozen v2 plan and development episodes, confirm (a) that causal/risk anchors exist at tick 1 or
later and that input changes within the lookback actually produce divergent series, (b) that the number of
generated cases per criterion is at least `minimum_eligible_cases`, (c) that finite samples of the frozen risk
measure exist within the risk window, (d) that a terminal private source for failure exists, and (e) that the
required annotation coverage is satisfied. Save the result to the non-formal private artifact
`artifacts/play-log-feasibility.private.json`, without analysis seeds, ordinals, or formal verdicts.
On deficiency, stop as `instrument_insufficient` before Stage 9 without converting to zero points.

To reach that gate without running a single analysis episode — the intended shape when several games are taken
through Stages 0-8 before any of them is measured — run the shared executor with `--feasibility-only`.

```bash
npm run evaluate:play-log-quality -- <evaluation-config.mjs> --feasibility-only [game-id ...]
```

It performs conformance, the development-seed qualification pool, and the feasibility gate, then returns before
the first analysis episode, so the frozen analysis pool stays unburned and the plan may still be adapted. Do not
rebuild the qualification pool in a game-specific script to get the same report.

Scoring higher than controls, being non-spam, or using complex input are not qualification conditions. If the
policy cannot fire mechanics, cannot replay, or uses information outside the observation channels, stop quality
judgment as `instrument_insufficient`.

## Stage 8: Play-log analysis freeze

Fix the following in `play-log-quality-plan.private.json` before episode execution.

Fix new evaluations with `schemas/play-log-quality-plan.private.v2.schema.json`. v1 plans/analysis artifacts
are for verifying and displaying past runs only; do not feed them into new executions from Stage 9 onward.

- Policy/adapter/source/runtime hashes
- Development seeds and unused analysis seeds
- Episode count, tick budget, timeout, technical exclusions
- Best/median/low-or-failure selection rules
- Same-seed diagnostic controls
- Role mapping, risk mode, and thresholds. Freeze everything: controllable/hazard geometry for
  `hazard_clearance`, and indicator role/axis/neutral/exposure threshold for `indicator_displacement`
- `contact_tolerance` (default 0): the edge-to-edge tolerance used for contact judgements. Exact touching
  always counts as contact; raise the tolerance only to express a collision margin or radius that the source
  applies but the drawn geometry does not show, and state the source basis in the plan
- `hazard_active_when` (default `always`) and `hazard_suppressed_while_overlapping` (default none), when a
  hazard is lethal only while the button is held or released, or is neutralized while the controllable
  subject sits inside a shelter role. Ticks where the hazard is inert contribute no clearance sample, so
  exposure is not counted where the annotations show there is no risk. Do not model a shelter as a hazard
- `hazard_conditions`, when one game mixes hazard kinds: it maps a hazard role to its own `active_when` and
  `suppressed_while_overlapping`, overriding the plan-wide defaults for that role. A drill-into-rock game
  freezes the rock as `input_released`, the enemies as suppressed while overlapping the rock, and the sea as
  always active
- Per-criterion counterfactual source selection, anchor event, lookback, local window, bounded operation, and
  minimum eligible cases. Failure agency uses `first_terminal_private_by_gameplay_seed`; do not select sources
  by score or control performance
- For a hold-and-release game, include `truncate_press_by_k` / `extend_press_by_k` with `press_edit_ticks`.
  These move the release boundary, which is the decision the game actually tests. `remove_press` deletes a
  whole press run, so on a long hold it is not a local edit and it proves little beyond "releasing here ends
  the run". The two release-timing operations expand into a ladder of `k`, `2k`, `3k` … ticks, and the shared
  resolver draws round-robin across the frozen operation kinds, so `max_cases` is shared rather than consumed
  by whichever kind is listed first
- `anchor_ordinals` (default `["first"]`) chooses which reward moments are probed, by ordinal among the
  episode's reward events. A single anchor makes the criterion a statement about one instant of one episode;
  `["first", "median", "last"]` makes it a statement about the episode. Anchors are drawn round-robin, so the
  case budget is shared instead of being spent on the earliest anchor
- `source_count` (default 1) and `minimum_replication_seeds` (default 1) turn a criterion into a replicated
  claim. `source_count` draws additional source episodes in the frozen selection order (best, then median,
  then low-or-failure; terminal rules take the next qualifying terminal episode by seed), and
  `minimum_replication_seeds` requires evidence on that many distinct analysis seeds before a criterion may
  take **any** value. Several edits inside one episode are one seed, not several. The requirement is
  symmetric: a `contradicted` resting on one seed is a statement about that seed, so it stays `unresolved`
- `contact_tolerance` above 0 must be justified by a source-level margin, and the result reports
  `tolerance_dependent_contacts_<selection>`: how many contact decisions were true only because of it. A
  tolerance that never changes a decision is an unused tuning knob and should be removed from the plan
- Failure agency takes its sources in ascending gameplay-seed order and never filters them by how much they
  offer to edit. An episode whose final ticks are released is not skipped: passive deaths are exactly the
  population this criterion must include, and selecting sources by probe-ability would condition the sample
  on something correlated with the answer. If those sources cannot carry the frozen edits, the criterion is
  `unresolved` and the fix belongs in the annotation plan, the policy, or the operation set
- Judgment rules for the four quality criteria
- Allowed/forbidden claims
- `output_directory`, which owns where every evaluation artifact is written. The shared executor derives the
  game output root from it by stripping the trailing `/artifacts/play-log-analysis`, and stops if the frozen
  path does not have that shape

Follow the Play-log quality result section of [CONTRACTS.md](CONTRACTS.md) for the normative definitions of the
formal quality criteria and the ordinal mapping. Do not make monotonic-input tolerance, private-policy
advantage, seed stability, open-loop transfer, game-specific metrics, or raw scores independent quality axes.

## Stage 9: Analysis episode pool

Run the private policy and diagnostic controls under the same tick budget and timeout conditions with
analysis seeds unused in development. This is not an aggregate statistical evaluation; it is an episode pool
feeding the fixed selection rules.

Episodes are never retried: `execution.retry_count` is retired, and a technical termination stops the game with
the failure recorded. Re-running means a new evaluation ID, an analysis seed pool unused anywhere else, and a
new config hash — never the same round again. Record the burned pool in [SEED_LEDGER.md](SEED_LEDGER.md) before
the re-run, so the pool that produced the failure cannot be drawn a second time.

Save targets:

- Schema-valid runtime results
- Executed input sequences
- Raw private frames and annotation diagnostics
- Score, phase, terminal, executed ticks
- Source/runtime/policy/input hashes

Do not generate means, p-values, confidence intervals, or aggregate advantages as quality judgments. However,
preserve the episode counts, nulls, negatives, and technical failures needed for best/median/low selection and
`mixed_or_seed_dependent` judgment.

## Stage 10: Selection and exact replay

Select the following with the fixed rules.

1. Best private-policy episode
2. Median private-policy episode
3. Low-or-failure private-policy episode
4. Pre-specified diagnostic control with the same seed as best
5. Highest-score control with the same seed
6. Limited counterfactuals generated from the best episode for causal input/risk–reward
7. The first terminal private episode selected in ascending gameplay seed order from the analysis pool for
   failure agency
8. Limited counterfactuals anchored from the failure source to the terminal tick

Fix criterion-specific sources and anchors in Stage 8, and do not change them after reviewing results. Save the
failure source as `failure-source-private` in addition to the standard 5 selections, and exact-replay it. If
there is no terminal private episode, or if the minimum eligible cases cannot be obtained from bounded
candidates, mark it `unresolved` and do not fill it in with control scores or survival differences.

Do not evaluate only the best. Follow the Play-log analysis artifacts section of [CONTRACTS.md](CONTRACTS.md)
for replay gate modes and exceptions for annotation-only migration.

Run Stages 8–13 through the shared executor.

```bash
npm run evaluate:play-log-quality -- <evaluation-config.mjs> [game-id ...]
```

Batch/game-specific scripts only enumerate plans and adapter/policy configurations and invoke the shared
executor; they do not re-implement episode selection, counterfactual execution, metrics, criterion
classification, or formal artifact generation. Causal input, risk–reward, and failure agency each run their own
`counterfactual_plans` independently. Even for the same plan, do not substitute case duplicates that only
change the criterion ID.

## Stage 11: Derived events and local causality

Build derived events from raw frames with the shared analyzer, and compare same-seed controls against
criterion-specific local counterfactuals. In the counterfactual artifact, save the source selection,
anchor/edit tick, pre-edit equivalence, eligibility reason, first non-controllable structural divergence, and
baseline/branch terminal kind and tick. Limit claims to the point of first structural divergence.

Every counterfactual branch runs under the same frozen tick budget as its source episode: the edited input
prefix is forced tick by tick, and the frozen private policy keeps playing after that prefix ends. Never
replay a branch only for the length of the source input sequence — a branch that merely outlives the source
terminal would then be recorded as `terminal_avoided` when the replay input had simply run out.
`terminal_avoided` is therefore reserved for branches with no terminal inside the frozen tick budget.

For failure agency, count positive evidence only when an eligible terminal-window edit avoids or delays the
terminal. Do not use branches that hasten death, edits outside the terminal, or pre-edit mismatches as
confirmed evidence. Below the minimum eligible cases, record null, not 0.

Follow the Play-log analysis artifacts section of [CONTRACTS.md](CONTRACTS.md) for the distinction between
observed object counts and causal attribution metrics (`unique_reward_objects_observed` and `unresolved`
attribution). For risk verdicts, use a rate normalized by executed ticks, not raw exposure tick differences.

`runtime/counterfactual-evaluation.mjs` is the only current implementation for computing pre-edit equivalence,
first divergence of non-operated targets, and terminal differences; `runtime/play-log-quality-evaluator.mjs` is
the only current implementation for the orchestration and formal classification of Stages 8–13.

## Stage 12: Play-log quality result

Do not judge instrument confidence from score differences alone; confirm it with at least one of the following.

- Removing the target input in a counterfactual eliminates the corresponding score event
- Hazard exposure or opportunity engagement clearly differs between the private policy and diagnostic controls
- Score, collision, and terminal events can be mapped to annotation-derived world events

The shared executor derives instrument confidence instead of assuming it, and records the deficiencies that
made it `insufficient`: no eligible bounded counterfactual case, zero reward identity coverage while reward
roles are declared, or no criterion resolved at all. `insufficient` stops the game as
`instrument_insufficient`; it is never a quality point.

Then ordinally classify the 4 criteria with the pre-fixed rules and save to `play-log-quality-result.json`.

- `causal_input_control`: Do important input changes alter local outcomes?
- `risk_reward_coupling`: Is reward coupled to risk or timing commitment?
- `failure_agency`: Can the terminal be avoided or delayed by input branching?
- `outcome_coherence`: Are score/collision/terminal consistent with observed world events?

Follow the Play-log quality result section of [CONTRACTS.md](CONTRACTS.md) for the ordinal mapping. Do not let
idle, hold, periodic, or seeded-random performance, input monotonicity, or score differences from the private
policy influence criterion values. Do not convert `unresolved`, `not_applicable`, or technical failures to 0.
Use `schemas/play-log-quality-result.v1.schema.json` as the schema.

`contradicted` requires positive counter-evidence; the absence of measurable evidence is always `unresolved`.

- `risk_reward_coupling`: when no eligible edit changed local reward at all, there is nothing to couple to
  exposure, so record `unresolved`, not `mixed`
- `outcome_coherence`: `contradicted` only when a terminal episode lacks a game-over annotation frame, or
  when reward objects are observed yet score events never coincide with any of them. A terminal that cannot
  be mapped to annotated roles, an undeclared reward role, unobserved reward records, and the absence of
  score events are all `unresolved`
- Terminal signatures are matched against the runtime-observed `view_size`, never against an assumed
  100x100 view

Record every reason a criterion stayed null in `not_rankable_reasons` of the quality result, so a game that
left the ranking for instrument reasons can be told apart from a game that was measured and scored low.

Generate per-game Markdown from the schema-valid quality result.

```bash
npm run render:play-log-quality -- generated/<game-id>/play-log-quality-result.json generated/<game-id>/ANALYSIS.md
```

## Stage 13: Promotion or stop

Conditions to promote to a rankable `completed`:

- Annotation-only diff gate passed
- Simulator conformance passed
- Exact replay passed for diagnostic controls and the private policy
- Play-log quality plan fixed before accessing results
- No unresolved technical failures in the analysis episode pool
- Instrument confidence is `sufficient`
- All four required criteria are one of 0, 1, or 2
- Evidence IDs, identity coverage, unresolved metrics, and claim limits remain in the formal result

If any one is missing, stop as `instrument_insufficient`, `technical_failure`, or `not_rankable`, and do not
generate quality points.

Whichever way the round terminates, archive it as soon as it is terminal. The bulk private evidence under
`generated/` is large and prunable, but the annotation-only copy, the adapter, the private policy, and the
frozen plan are agent work that no script regenerates; archiving separates the two so that pruning is safe.
Neither tree is tracked in version control.

```bash
npm run retain:round -- archive <game-id> <evaluation-id>
```

Prune the bulk evidence of rounds under a superseded instrument version with
`npm run retain:round -- prune <game-id> <evaluation-id> --apply`; it refuses to run until the archive exists
and matches. See "Retention of finished rounds" in [README.md](README.md).

## Stage 14: Cross-game ranking

Rank two or more `play-log-quality-result.json` files. Fix `play-log-ranking-contract.json` and validate it
against the shared schema before accessing the results.

```bash
npm run validate:artifact -- play_log_ranking_contract batches/<ranking-id>/play-log-ranking-contract.json
npm run rank:play-logs -- batches/<ranking-id>/play-log-ranking-contract.json batches/<ranking-id>
npm run verify:play-log-ranking-hashes -- batches/<ranking-id>/play-log-ranking-hashes.json
```

Follow the Play-log ranking contract and result section of [CONTRACTS.md](CONTRACTS.md) for the ordinal
mapping, weights, tie-breaks, `tie_threshold`, and the `not_rankable` rule for missing games. Do not place
games with null required criteria, insufficient instrumentation, or technical failures at last place or zero
points.
The outputs are `play-log-ranking-result.json`, `PLAY_LOG_RANKING.md`, and `play-log-ranking-hashes.json`.
This is a play-log mechanical quality ranking, not an overall quality ranking that includes fun, perceptual
quality, human preference, or distribution-runtime compatibility.
