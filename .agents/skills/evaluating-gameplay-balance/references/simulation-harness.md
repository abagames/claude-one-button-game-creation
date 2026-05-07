# Simulation Harness Design

Use this when a project does not already produce the balance telemetry required by `log-contract.md`.

The harness should make game runs comparable. It does not need to be a full copy of the renderer, physics engine, or UI; it needs a deterministic forward model that can run the same game rules under several input policies and emit the same event categories every run.

## 1. Required Pieces

Build or locate these pieces before balance analysis.

- **Game adapter**: a thin wrapper around the game loop exposing `init(seed)`, `step(input, dt)`, `get_score()`, `is_game_over()`, and optional `get_state_snapshot()`.
- **Deterministic random source**: all spawn, hazard, reward, and AI randomness must use a seeded generator controlled by the harness.
- **Public input schema**: the buttons, axes, touch regions, or action states a player can actually use, including ranges, neutral values, timing semantics, and simultaneous-input constraints when relevant.
- **Visible-state schema**: the world facts policies may read, limited to what a player could infer from the screen unless the run is explicitly marked as an oracle upper bound.
- **Policy visibility map**: the visible-state features each policy can read.
- **Input policies**: at minimum include idle/no-input and simple repeated-action policies; add game-specific monotonous policies when the control scheme differs.
- **Exploratory policy runner**: random search, heuristic search, replay search, or genetic search that tries multiple input sequences with fixed seeds.
- **Event logger**: records death, spawn, scoring, and input events during each simulated run.
- **Reporter**: writes a JSON object matching `log-contract.md`; stdout is acceptable, and files may be written under the project's normal `logs/`, `reports/`, `artifacts/`, or `test-results/` directory.

## 2. Adapter Contract

Keep the adapter small and engine-local.

```text
create_adapter(game, seed):
  reset game state
  install seeded RNG
  define public_input_schema
  define visible_state_schema
  return:
    step(input_frame) -> events
    score() -> number
    elapsed() -> seconds
    ended() -> bool
    snapshot() -> optional serializable state
```

For engines with a real-time update loop, run fixed ticks rather than wall-clock time. For render-dependent games, separate rule updates from drawing enough that the harness can advance the world headlessly.

If exact engine simulation is too expensive, implement the smallest faithful forward model for the systems being evaluated: player movement, hazards, rewards, scoring, damage, game-over, and spawn generation.

## 3. Input Policy Set

Policies should be explicit, reproducible functions from tick/state to input.

Recommended baseline policies:

- `no_input`: never presses the primary action.
- `hold_action`: holds the primary action for the whole run.
- `spam_action`: presses/releases on a short fixed cadence.
- `periodic_action`: presses on one or more slower cadences when timing matters.
- `random_action`: samples input from a seeded distribution.
- `exploratory`: searches over sequences or state-based choices and reports the best run.

One-button games usually need press, hold, and release timing. Multi-input games should define equivalent monotonous policies for each dominant simple strategy, such as always-left, always-fire, always-boost, or shortest-path greed.

Do not hard-code a policy that knows hidden internals unavailable to a player unless the goal is explicitly to test an upper bound. Prefer state features a player could infer from the screen.

When the control scheme is unknown, first write the public input schema, then derive policies from it:

```text
input_schema:
  move_x: axis -1..1
  move_y: axis -1..1
  primary: boolean
  secondary: boolean
  simultaneous: move axes plus at most one action

monotonous_candidates:
  no_input
  fixed_direction(move_x=1)
  hold_primary
  spam_primary(period=8 ticks)
  greedy_nearest_reward using visible positions
```

For each policy, record its visibility:

```text
policy_visibility:
  no_input: []
  fixed_direction: []
  hold_primary: []
  greedy_nearest_reward: [player_position, reward_positions]
  exploratory: [player_position, hazard_positions, reward_positions]
```

## 4. Exploratory Runner

The exploratory runner exists to detect whether skillful or varied play can outperform monotony.

Acceptable approaches:

- Random input sequence search over many seeds.
- Heuristics using visible state, such as distance to hazards, reward positions, or resource levels.
- Genetic search over input timings or compact action genomes.
- Replay mutation: mutate the best previous sequence and keep improvements.

Report the best score, elapsed time, seed, and variant. Keep the same search budget before and after changes so comparisons remain meaningful.

Record the exploratory runner's budget in the report: number of seeds, variants, generations, random samples, replay mutations, max ticks, and visible-state features. If this budget changes after a gameplay fix, rerun the baseline with the new budget before comparing.

## 5. Telemetry Events

Log raw events first, then aggregate them into `log-contract.md`.

Recommended raw event shapes:

```json
{"tick": 120, "type": "input", "pressed": true, "held": false}
{"tick": 184, "type": "spawn", "kind": "hazard", "x": 92, "y": 38}
{"tick": 240, "type": "score", "amount": 2, "reason": "near_miss", "x": 41, "y": 62}
{"tick": 301, "type": "death", "cause": "collision", "object": "hazard", "x": 47, "y": 65}
```

Aggregate at least:

- Death clusters, causes, position distribution, and deaths shortly after input.
- Spawn intervals, position distribution, type distribution, and minimum distance to player when available.
- Scoring triggers, score amounts, score timing, and whether score correlates with raw input count.
- Input pattern summaries such as hold duration, press interval distribution, and dominant simple pattern.

## 6. Output And Discovery

The skill does not require a universal file path. Prefer the project's existing convention.

Reasonable output targets:

- stdout JSON for CLI tools and CI.
- `logs/balance/*.json`
- `reports/balance/*.json`
- `artifacts/balance/*.json`
- `test-results/balance/*.json`

If adding a new harness to a project, document the command that produces the report and the expected output path near the harness. The evaluator should be able to rerun the same command after a gameplay change.

## 7. Incomplete Reports

Score, elapsed time, and `exploratory_ratio` are useful summary signals, but they are not enough to diagnose balance.

If any of the four telemetry perspectives are missing:

1. Mark the report as insufficient for root-cause balance judgment.
2. Keep the existing summary metrics as baseline signals.
3. Add raw event logging or aggregation for the missing perspective.
4. Rerun the same monotonous and exploratory policies with deterministic seeds.
5. Only then propose structural gameplay fixes.

## 8. Failure Modes

Reject or revise the harness when:

- The renderer and simulator use different gameplay constants.
- Randomness is not seeded.
- Monotonous and exploratory runs use different game settings.
- The exploratory runner gets hidden information that a player cannot perceive.
- The public input schema or visible-state schema is undocumented.
- The logger awards score from input facts rather than in-game causal events.
- The report only contains summary score and elapsed time, with no death/spawn/scoring/input breakdown.
- Before/after comparisons use different seeds, budgets, policies, or max ticks without explanation.
