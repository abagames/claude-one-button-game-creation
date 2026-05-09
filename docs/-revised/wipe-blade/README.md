# WIPE BLADE (wipe-blade)

**Seeds**: #weapon-wipe, #rule-gauge_management, #player-bar

## 1. Core Mechanics

- **Input**: Tap to perform a short wipe attack when cooldown is ready.
- **Behavior**: A two-sided blade rotates around a central core. Enemies spawn around the edges and move toward the core. Tapping starts a brief wipe arc centered on the current blade angle and reverses blade rotation direction.
- **End Condition**: Any enemy touching the central core ends the game.
- **Scoring**: Enemies destroyed during the wipe score 1 each. The wipe also tracks combo count; at the end of the wipe, destroying at least two enemies grants bonus score, with a larger bonus at three or more.
- **Difficulty Increase**: Enemy spawn rate increases and blade rotation/enemy movement scale with `sqrt(difficulty)`.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `bladeAngle` | Rotates constantly, direction reverses after wipe start | Rotating blade line |
| `isWiping` / `wipeTimer` | Set by tap, counts down over a short duration | Wipe arc appears |
| `cooldown` | Set after a wipe, reduced over time; shorter after stronger combos | Cooldown gauge |
| `comboCount` | Counts enemies destroyed during one wipe | End-of-wipe bonus |

- **Idle weakness**: Enemies eventually reach the core.
- **Hold-only weakness**: Holding has no effect and cannot attack.
- **Mashing weakness**: Cooldown blocks repeated attacks; poorly timed wipes miss enemies and waste the gauge.
- **Skilled play**: Wait until the rotating blade aligns with multiple incoming enemies, then wipe to clear a cluster and reduce future cooldown.

## 2. Object Specifications

- **Core**: Cyan center object that must be defended.
- **Blade**: Two-sided rotating bar.
- **Wipe Arc**: Temporary attack sector around the blade angle.
- **Enemies**: Red bodies moving from edges toward the core.
- **Cooldown Gauge**: Shows when the next wipe can be used.

## 3. Design Principle Analysis

- **Simplicity**: Tap triggers the only attack.
- **Visual Feedback and Game Over**: Enemies visibly converge on the core; contact with the core is fatal.
- **Skill-Based Scoring**: Cluster timing and angular alignment determine score.
- **Novel Mechanics**: The attack is constrained by a rotating bar and rewards choosing one precise instant.

## 4. Relationship with Seeds

- `weapon-wipe`: The wipe arc is the main attack.
- `rule-gauge_management`: Cooldown governs attack timing.
- `player-bar`: The rotating blade is the player-controlled weapon form.

## 5. Basis for Novelty

The player cannot aim freely; they must read a rotating weapon's future angle and spend a scarce wipe at the right moment.

## 6. Similarity Check

It resembles radial defense, but the one-button attack depends on blade alignment and combo-based cooldown recovery.

