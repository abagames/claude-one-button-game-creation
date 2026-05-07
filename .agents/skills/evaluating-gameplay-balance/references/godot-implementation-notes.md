# Godot Implementation Notes

Use this reference after the engine-neutral balance analysis identifies a structural pattern to apply in a Godot/GDScript project. Keep the diagnosis in telemetry terms first, then translate the selected pattern into the project's actual scripts.

## Guardrails

- Project `AGENTS.md` remains the source of truth for commands, file layout, and validation.
- Validate balance changes with short human play as well as logs or simulator scores.
- Prefer structural fixes over numeric-only tuning: change risk, feedback, timing windows, spawn rules, or world consequences before merely changing constants.
- Keep formulas readable and stable at game start. If `difficulty` starts at `1`, `sqrt(difficulty)` preserves base values.

## Difficulty Scaling

Use diminishing growth when deaths cluster late or hazards become unreadable.

```gdscript
var effective_difficulty := sqrt(difficulty)
var speed := base_speed * effective_difficulty
var spawn_interval := base_interval / effective_difficulty
```

Use floors when spawn cadence can drop below human reaction time.

```gdscript
spawn_interval = max(min_reactable_interval, base_interval / sqrt(difficulty))
```

Apply difficulty across several gentle layers when one harshly scaled value dominates play.

```gdscript
player.position += player.velocity * sqrt(difficulty)
hazard_angle += rotate_speed * sqrt(difficulty)
```

## Scoring

Reward visible risk or precision, not raw input count.

```gdscript
add_score(close_call_bonus)
add_score(active_hazards.size())
add_score(combo_multiplier)
```

Use small score scales when large numbers hide whether one action is over-rewarded.

```gdscript
var points := {&"safe": 1, &"risky": 2, &"mastery": 5}
```

Combos need a visible reset cause.

```gdscript
multiplier = mini(multiplier + 1, max_multiplier)
add_score(base_points * multiplier)

# On visible miss, damage, or broken rhythm:
multiplier = 1
```

## Boundary And Failure

When boundary deaths dominate telemetry, consider a visible world consequence instead of instant game over.

```gdscript
if player.position.x < 0.0 or player.position.x > screen_size.x:
    player.position.x = wrapf(player.position.x, 0.0, screen_size.x)
    multiplier = 1
    show_boundary_feedback()
```

Use moving scoring zones or safe regions when idle or stationary play is too strong.

```gdscript
gate_pos.x += gate_vx * sqrt(difficulty)
if gate_pos.x > 90.0 or gate_pos.x < 10.0:
    gate_vx *= -1.0
```

## Input Response

For one-button or simple-input games, each input mode should improve one outcome while worsening another.

```gdscript
if Input.is_action_pressed("action"):
    player.scale += Vector2.ONE * grow_rate * delta
    danger_radius += danger_growth * delta
else:
    player.scale = player.scale.move_toward(Vector2.ONE, shrink_rate * delta)
```

Avoid making hold, mash, or idle globally best. Check telemetry for long press streaks, repeated taps, and no-input survival.

## Spawn Fairness

Reject spawns too close to the player. Skipping or delaying a spawn is usually better than forcing an unfair hazard.

```gdscript
func can_spawn(pos: Vector2) -> bool:
    return pos.distance_to(player.position) >= minimum_clearance
```

Use cell cooldowns when one screen region receives repeated pressure.

```gdscript
var cell := world_to_cell(candidate_pos)
if time - last_spawn_time_by_cell.get(cell, -INF) >= cell_cooldown:
    spawn_at(candidate_pos)
    last_spawn_time_by_cell[cell] = time
```

## State And Territory

Use decay when accumulated advantage makes play trivial.

```gdscript
resource = max(resource - decay_rate * delta, 0.0)
```

Use world traces when past player actions should shape later choices.

```gdscript
trail_cells[cell] = trail_lifetime
# Later: trails alter scoring, movement cost, or spawn eligibility.
```

## Validation Checklist

- The simulator rerun uses the same seeds, policies, tick rate, and aggregation as the baseline.
- Telemetry explains the changed outcome, not just the final score.
- Human play still has readable danger, fair failures, and a visible reason to choose risk.
- No hidden rule was added only to help or hurt the test policies.
