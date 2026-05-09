# INKINH (inkinh)

**Seeds**: #player-paint, #on_holding-move, #on_holding-inhale

## 1. Core Mechanics

- **Input**: Hold to thrust in the current facing direction and inhale nearby orbs.
- **Behavior**: The player auto-rotates. Holding adds inertia-based thrust and pulls nearby orbs toward the player.
- **End Condition**: Colliding with a falling red obstacle ends the game.
- **Scoring**: Collecting yellow orbs scores the current combo value, increments combo, and refreshes the combo timer. Letting the timer expire resets combo.
- **Difficulty Increase**: Obstacle spawn rate and obstacle speed scale with `sqrt(difficulty)`. Player movement and rotation also become faster.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `player.angle` | Auto-rotates, slower while holding | Direction indicator from player |
| `player.vel` | Holding applies thrust, friction decays it | Inertia-based movement |
| `combo` / `comboTimer` | Orb pickups increase and refresh combo, timer expiry resets it | Multiplier text |
| `orbs.timer` | Counts down after spawn | Orbs disappear if ignored |

- **Idle weakness**: The player cannot pursue or inhale orbs and obstacles eventually arrive.
- **Hold-only weakness**: Continuous thrust causes drift into hazards and weak steering control.
- **Mashing weakness**: Short bursts make suction unreliable and break combo timing.
- **Skilled play**: Time holds to align thrust, pull orbs into reachable paths, and avoid falling hazards while maintaining combo.

## 2. Object Specifications

- **Player**: Cyan body with facing direction and inertial velocity.
- **Orbs**: Yellow collectibles with limited lifetime. They are pulled only while holding.
- **Obstacles**: Red falling hazards with slight horizontal drift.
- **Suction Field**: Active only while holding and affects nearby orbs.

## 3. Design Principle Analysis

- **Simplicity**: One hold action combines movement and collection.
- **Visual Feedback and Game Over**: Direction, suction range, collectibles, and hazards are visually distinct.
- **Skill-Based Scoring**: Combo rewards planned collection routes rather than raw survival.
- **Novel Mechanics**: Movement and collection are inseparable; using suction also commits the player to motion.

## 4. Relationship with Seeds

- `player-paint`: Orb collection reads as spreading/absorbing ink marks.
- `on_holding-move`: Holding thrusts the player.
- `on_holding-inhale`: Holding pulls orbs inward.

## 5. Basis for Novelty

The same input both helps collect and increases movement risk, producing a vacuum-like route-planning challenge.

## 6. Similarity Check

It resembles inertia dodging, but the inhale field links score collection directly to the risky movement input.

