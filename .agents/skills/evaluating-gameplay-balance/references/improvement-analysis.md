# Gameplay Balance Improvement Analysis

Guide for improving action mini-games based on repeatable simulation or playtest telemetry.
The purpose is structural improvement of rules, generation logic, and state transitions, not numeric micro-tuning.

## Important: Canonical Guardrails

Project-specific execution rules remain outside this reference. This reference covers reusable improvement analysis and implementation patterns.

Notes:

- Even when this guide uses exploratory ratio, treat the metric as a detector rather than the target.
- Treat survival time as a supporting metric and prioritize experience quality.

## 1. Purpose of This Guide

Analyze output logs from a repeatable test harness and perform the following.

- **Root Cause Identification**: identify design defects, not just surface symptoms
- **Structural Improvement**: change rules and generation algorithms
- **Verification Loop**: Re-compare before and after with the same metric set

## 2. Log Input Contract

The preferred engine-neutral contract is defined in `log-contract.md`. The analysis target is the structure below.

```json
{
  "version": "1.0",
  "timestamp_utc": "2026-03-05T12:00:00",
  "run_config": {
    "seed_set": [2001, 2002, 2003],
    "fixed_dt": 0.0166667,
    "max_ticks": 3600,
    "policy_budget": "same before and after",
    "input_schema": {
      "primary": {"type": "boolean", "timing": ["pressed", "held", "released"]}
    },
    "visible_state_schema": ["player_position", "hazards", "rewards"],
    "policy_visibility": {
      "hold_action": [],
      "exploratory": ["player_position", "hazards", "rewards"]
    }
  },
  "monotonous": {
    "cases": {
      "no_input":     {"score": 0,  "elapsed": 4.2,  "ended": true},
      "hold_action":  {"score": 30, "elapsed": 16.7, "ended": true},
      "spam_action":  {"score": 42, "elapsed": 18.1, "ended": true}
    },
    "max_score": 42
  },
  "exploratory": {
    "best": {"score": 95, "elapsed": 24.9, "ended": true},
    "best_seed": 2001,
    "best_variant": 3
  },
  "exploratory_ratio": 2.26,
  "telemetry": {
    "death_analysis": {},
    "spawn_analysis": {},
    "scoring_analysis": {},
    "input_analysis": {}
  }
}
```

- Default keys for `monotonous.cases` are `no_input` / `hold_action` / `spam_action`; custom policies are allowed when they match the game's controls.
- `run_config` records the comparison conditions that must stay fixed across before/after runs, including policy visibility.
- `exploratory_ratio` is placed at top level (`exploratory.best.score / monotonous.max_score`).
- `telemetry` details may vary by game implementation, but the following four perspectives must be preserved.

## 3. Log Analysis Perspectives

### 3.1 Death Analysis

Check items:

- Death-position bias (clustered near the same coordinates)
- Frequent deaths within 1-3 frames right after input
- Only specific hazards have disproportionately high death rates

Typical causes:

- Unavoidable spawns
- High-speed entry without telegraph
- Insufficient failure-recovery design such as i-frames/knockback

Related balance patterns: `balance-patterns.md` difficulty scaling, boundary/failure, and spawn safety patterns.

### 3.2 Spawn Analysis

Check items:

- Minimum spawn interval is below reaction limit
- Spawn positions are biased toward part of the screen
- Hazard type distribution is overly concentrated

Typical causes:

- Insufficient spawn cooldown design
- Pure random spawning without spatial-cell management
- Constraint release during difficulty increase is too abrupt

Related balance patterns: `balance-patterns.md` spawn interval floor, safety distance, cell cooldown, and adaptive spawn patterns.

### 3.3 Scoring Analysis

Check items:

- Only one scoring route exists
- No reward differentiation for risky actions (near misses, etc.)
- Late-game difficulty only reduces scoring opportunities
- Input amount should not correlate excessively with score (do not reward raw input count itself)

Typical causes:

- Fixed-score only
- No risk-linked multiplier
- Insufficient per-phase reward redesign

Related balance patterns: `balance-patterns.md` risk-based scoring, combo reset, and placement/timing quality patterns.

### 3.4 Input Analysis

Check items:

- `hold_primary` / `pulse_primary` are always optimal
- A single custom-policy pattern is always optimal
- Exploratory input barely gains advantage (exploratory ratio does not improve)

Typical causes:

- No tradeoff per input state
- No context dependency in action selection
- Player state machine is too simple

Related balance patterns: `balance-patterns.md` input state tradeoff, contextual input semantics, state decay, and multi-resource tension patterns.

### 3.5 Experience Integrity Gate

Before KPI checks, the following must hold.

- Failure causes are explainable as in-world hazards
- Score causes are explainable as in-game event causality
- No unfair instant-death or unexplained score change in at least 2 minutes of human play

## 4. Problem Patterns and Structural Fixes

### 4.1 Unavoidable Death Clusters

Symptoms:

- Deaths repeat in the same area
- Damage taken without warning

Insufficient response:

```text
# Insufficient: only lower speed
hazard_speed = hazard_speed * 0.8
```

Recommended response:

```text
# Better: spawn checks that preserve an escape route
spawn_hazard:
  repeat up to N candidates:
    candidate = random_spawn_point()
    if has_escape_route(candidate, player_position, player_radius):
      commit_spawn(candidate)
      stop
  if no candidate is fair:
    skip_or_delay_spawn

has_escape_route(candidate, player_position, player_radius):
  minimum_clearance = player_radius * 3
  return distance(candidate, player_position) >= minimum_clearance
```

### 4.2 Monotonous Input Dominance

Symptoms:

- Only mashing or holding yields high score

Insufficient response:

```text
# Insufficient: only add a fixed cooldown
if action_cooldown > 0:
  ignore_action
```

Recommended response:

```text
# Better: environment behavior changes by input state
apply_action_rule(action_mode):
  if action_mode is spam:
    heat += 0.25
    score_multiplier = 1.0
  if action_mode is rhythm:
    heat = max(0, heat - 0.1)
    score_multiplier = 1.5
  if action_mode is hold:
    charge += 0.2
    if charge exceeds safe_limit:
      expose_hitbox_or_reduce_mobility
```

### 4.3 Flat Difficulty Curve

`difficulty` convention: initial value `1`, then `+1` every elapsed minute (see `balance-patterns.md` §1).

Symptoms:

- Early and late-game feel the same
- Difficulty increase is "just faster"

Insufficient response:

```text
# Insufficient: linear increment only
difficulty += elapsed_delta * constant
```

Recommended response:

```text
# Better: add readable phase transitions
update_phase(elapsed_seconds):
  if elapsed_seconds < early_limit: phase = early
  else if elapsed_seconds < mid_limit: phase = middle
  else: phase = late

apply_phase_rules:
  early:
    complex_hazard = off
    warning_time = generous
  middle:
    complex_hazard = on
    warning_time = moderate
  late:
    complex_hazard = on
    mastery_bonus = on
    warning_time = short_but_reactable
```

### 4.4 Spatial Distribution Bias

Symptoms:

- Spawn points are biased to center or edges
- Unused screen areas become fixed

Recommended response:

```text
# Better: spawn with cell cooldown
last_spawn_time_by_cell = {}
cell_cooldown = fixed_reaction_window

choose_spawn_cell(cells, now):
  best_cell = none
  best_score = negative_infinity
  for each cell:
    if now - last_spawn_time_by_cell[cell.id] < cell_cooldown:
      continue
    score = distance_from_player(cell) + route_fairness(cell)
    if score > best_score:
      best_score = score
      best_cell = cell
  return best_cell
```

## 5. Improvement Process

### 5.1 Acquire Baseline Logs

Collect a baseline log from the project's repeatable test harness.

Minimum values to persist:

- `monotonous.max_score`
- `exploratory.best.score`
- `exploratory_ratio`
- `telemetry` (death_analysis / spawn_analysis / scoring_analysis / input_analysis)

### 5.2 Generate Improvement Proposal

Focus on one problem per improvement.

- Problem name
- Root cause (logic)
- Target module/script/system to change (by responsibility)
- Change details (rules/generation/state transitions)
- Expected effect (which metrics change and how)
- Experience hypothesis (what players learn and what feels good)
- Expected side effects (risk of unfairness/monotony)

### 5.3 Implement and Re-test

- Apply **one** applicable pattern from `balance-patterns.md`
- Re-test and compare exploratory ratio and supporting metrics again
- If worsened, apply another pattern rather than immediate rollback

### 5.4 State Snapshot Policy (Optional)

Treat generated screenshots or state summaries as **state-consistency evidence**, not exact final-render judgment.

- Purpose:
  - Record Scene A/B/C phase differences (low-density/high-density/pre-post damage) reproducibly
  - Verify separation of placement, density, and protagonist/danger/reward roles
- Non-purpose:
  - Judging final quality of glow, post effects, fonts, or final UI appearance
- Implementation recommendation:
  - From the test harness, call an API such as `capture_debug_frame(path)` to generate images from game state
  - Fix capture timing (encode Scene A/B/C conditions) and prioritize comparability
  - If the engine's render capture is unstable in automation, use the state-snapshot method as canonical
- Evaluation operation:
  - Web/manual-play screenshots are the source of truth for visual quality
  - Limit headless images to CI regression checks (composition/density/role breakdown detection)

#### Minimal Implementation Pattern

Provide an image-generation or state-summary API callable from tests.

```text
capture_debug_frame(path):
  snapshot = world.get_capture_snapshot()
  image = create_blank_image(render_width, render_height, background_color)
  for each hazard in snapshot.hazards:
    draw_rect(image, hazard.bounds, hazard_debug_color)
  draw_player_marker(image, snapshot.player_position)
  save_image(image, path)
```

Invoke from the automated test harness under fixed-scene conditions.

```text
# test harness pseudocode
capture_state_summaries(game):
  game.reset(seed_for_low_density)
  step_until_low_density_condition(game)
  game.capture_debug_frame("logs/screens/scene_a.png")

  game.reset(seed_for_high_density)
  step_until_high_density_condition(game)
  game.capture_debug_frame("logs/screens/scene_b.png")

  game.reset(seed_for_near_failure)
  step_until_near_failure_condition(game)
  game.capture_debug_frame("logs/screens/scene_c.png")
```

Fallback rules:

- If `capture_debug_frame` is not implemented, treat as failure (test fail), not a single-color placeholder
- Fix Scene A/B/C seed and frame conditions as constants so the comparison axis remains stable after improvements

## 6. Evaluation Criteria

### 6.1 Primary Metric

| Exploratory Ratio | Evaluation | Meaning |
| :--- | :--- | :--- |
| <= 1.0 | Fail | Monotonous input is optimal |
| 1.0 - 1.5 | Needs work | Skill differential is weak |
| > 1.5 | Pass | Skillful play is rewarded |

### 6.2 Auxiliary Metrics

| Metric | Good state | Problem state |
| :--- | :--- | :--- |
| Death diversity | Spread across multiple causes | Concentrated into one cause |
| Spawn fairness | Reactable minimum interval | Back-to-back instant-death interval |
| Scoring routes | Two or more scoring routes | Fixed action only |
| Input dominance | Exploratory is superior | Spam/hold always wins |

### 6.3 Mandatory Experience Gates

If any of the following is `No`, fail even if exploratory ratio is high.

| Gate | Pass condition |
| :--- | :--- |
| Scoring causality | Score ties to event causality, not raw input fact |
| Failure causality | Failure ties to in-world hazards, not non-action meta penalty |
| Human sanity check | At least 2 minutes of manual play does not increase unfairness |

## 7. Anti-patterns

### ❌ Parameter-Only Fix

```text
enemy_speed *= 0.8
spawn_interval += 0.2
```

### ❌ Branch-Only Fix

```text
if too_hard:
  make_easier()
```

### ❌ Randomness Creep

```text
spawn_position.y += random_range(-80, 80)
```

### ❌ UI-Only Compensation

- Only adding HUD text while leaving root issue unresolved
- Covering feedback defects with text explanation

### ❌ KPI Gaming

```text
# Awarding points for raw input facts (prohibited)
if input_pressed:
  score += 1

# Instant game over for non-movement fact alone (prohibited)
if idle_time > 1.5:
  trigger_game_over()
```

## 8. Recommended Change Set Template

```markdown
## Problem Analysis

### Problem 1: <name>
- Symptom:
- Root cause:
- Impact:

## Improvement Proposal

### Improvement 1: <name>
- Target script:
- Structural change:
- Why it should work:

## Expected Effect
- Exploratory ratio: <before> -> <after target>
- Secondary metrics:
```

## 9. Before/After Verification Template

```markdown
| Metric | Before | After |
|:---|:---|:---|
| monotonous.max_score |  |  |
| exploratory.best.score |  |  |
| exploratory_ratio |  |  |
| death diversity |  |  |
| spawn fairness |  |  |
```

Create this comparison table for each improvement and stop after at most 3 loops.
