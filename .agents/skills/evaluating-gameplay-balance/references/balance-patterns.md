# Balance Pattern Catalog

This catalog is engine-neutral. Use the patterns to decide what kind of rule or system change to make; translate implementation details into the project's engine and architecture.

## 1. Difficulty Scaling

### 1.1 Diminishing Difficulty Growth

Use when linear growth makes late play unreadable or creates unavoidable failures.

Pattern:

```text
effective_difficulty = sqrt(raw_difficulty)
speed = base_speed * effective_difficulty
spawn_interval = base_interval / effective_difficulty
```

### 1.2 Multiplicative Difficulty Layers

Use when difficulty should affect several systems gently rather than one system harshly.

Pattern:

```text
movement_pressure = base_movement * layer_a(raw_difficulty)
spawn_pressure = base_spawn * layer_b(raw_difficulty)
reward_pressure = base_reward * layer_c(raw_difficulty)
```

### 1.3 Spawn Interval Floor

Use when spawns become faster than human reaction time.

Pattern:

```text
spawn_interval = max(min_reactable_interval, scaled_interval)
```

## 2. Scoring

### 2.1 Risk-Based Scoring

Reward events that require exposure to danger, precise timing, or constrained movement.

Pattern:

```text
score = base_event_score + risk_bonus(distance_to_danger, timing_precision, route_cost)
```

### 2.2 Score Scale Reduction

Use smaller point ranges when huge values hide balance problems.

Pattern:

```text
common_success = 1
risky_success = 2 or 3
rare_mastery = 5
```

### 2.3 Combo With Reset Cause

Use combos only when failure causes are visible and recoverable.

Pattern:

```text
on_success: combo += 1
on_visible_miss_or_damage: combo = 0
score += base_score * combo_multiplier(combo)
```

## 3. Boundary And Failure

### 3.1 Replace Instant Death With World Consequence

Use when boundary contact is too punishing or unclear.

Pattern:

```text
on_boundary_contact:
  push_player_back
  reduce_resource_or_combo
  show_world_feedback
```

### 3.2 Moving Boundaries

Use when safe play is static.

Pattern:

```text
safe_region changes position or shape over time
player must reposition before scoring remains possible
```

## 4. Input Response

### 4.1 Input State Tradeoff

Use when holding, mashing, or idling dominates.

Pattern:

```text
holding: improves one capability, worsens exposure
tapping: creates short opportunity, adds recovery
idle: may be safe briefly, but world state advances
```

### 4.2 Contextual Input Semantics

Use when the same input should demand judgment across phases.

Pattern:

```text
if phase_a: input changes position
if phase_b: input changes state or timing
both outcomes are visible in the world
```

## 5. Spawn And Spatial Fairness

### 5.1 Safety Distance

Use when hazards appear too close to the player.

Pattern:

```text
candidate_spawn is accepted only if distance_to_player >= minimum_clearance
fallback: skip or delay spawn rather than force an unfair spawn
```

### 5.2 Cell Cooldowns

Use when one screen area receives repeated pressure.

Pattern:

```text
divide space into cells
track last_spawn_time per cell
exclude cells whose cooldown has not expired
```

### 5.3 Adaptive Opposite-Side Spawn

Use when spawn side should respond to player position.

Pattern:

```text
spawn from the side that creates travel/readability pressure without instant collision
```

## 6. State And Territory

### 6.1 State Decay

Use when accumulated advantage makes play trivial.

Pattern:

```text
valuable_state decays unless refreshed through risky or skillful events
```

### 6.2 Multi-Resource Tension

Use when one resource explains too much.

Pattern:

```text
resource_a supports safety
resource_b supports score
actions shift value between them
```

### 6.3 Spatial Historization

Use when previous actions should affect future choices.

Pattern:

```text
player action leaves a world trace
trace changes later movement, scoring, spawn, or hazard behavior
```

## 7. Construction And Puzzle

### 7.1 Placement Quality Scoring

Use when placement should reward structure, not raw placement count.

Pattern:

```text
score placement by adjacency, alignment, coverage, route creation, or constraint satisfaction
```

### 7.2 Time Pressure With Grace

Use when a timer creates pressure but should not end play arbitrarily.

Pattern:

```text
deadline approaches
successful play extends or softens the deadline through visible world events
```

## Quick Problem Map

| Problem | Candidate patterns |
| :--- | :--- |
| Monotonous input wins | 2.1, 4.1, 4.2, 6.1 |
| Deaths feel unfair | 3.1, 5.1, 5.2 |
| Difficulty feels flat | 1.1, 1.2, 3.2 |
| One area is overused | 5.2, 5.3, 6.3 |
| Score lacks skill signal | 2.1, 2.3, 7.1 |

## Application Checklist

- Identify the root cause before applying a pattern.
- Prefer one structural change at a time.
- Re-test with the same monotonous and exploratory policies.
- Reject KPI gains that make the game less readable, less fair, or less satisfying.
