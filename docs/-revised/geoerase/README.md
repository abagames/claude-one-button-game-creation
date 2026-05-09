# GEOERASE (geoerase)

**Seeds**: #on_holding-shoot, #on_released-erase, #rule-geometry

## 1. Core Mechanics

- **Input**: Hold to mark enemies with a rotating laser. Release to erase all marked enemies.
- **Behavior**: The player remains at the center while enemies approach from screen edges. The laser rotates continuously; holding slows it enough to aim and marks enemies aligned with the beam.
- **End Condition**: Any enemy touching the player ends the game.
- **Scoring**: Releasing erases marked enemies. Triangles score 1 point times combo, squares score 2 points times combo. Erasing multiple enemies at once increases combo; weak releases reduce it.
- **Difficulty Increase**: Enemy spawn intervals shorten and enemy speed scales with `sqrt(difficulty)`. The laser rotation speed also scales with difficulty.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `laserAngle` | Rotates constantly, faster while not holding | Beam direction around the player |
| `enemy.marked` | Set while a held beam passes over an enemy, cleared on release | Marked enemies turn yellow |
| `combo` | Increases after multi-erase, decreases after single/empty erase | Multiplier text |

- **Idle weakness**: The laser rotates too fast to mark intentionally and enemies eventually reach the player.
- **Hold-only weakness**: Holding marks targets but never erases them, so marked enemies can still collide with the player.
- **Mashing weakness**: Frequent releases erase too few enemies and decay combo.
- **Skilled play**: Hold long enough to line up several enemies, then release before they reach the center.

## 2. Object Specifications

- **Player**: Central cyan body; stationary and vulnerable to contact.
- **Laser**: Rotating yellow line. Holding activates marking.
- **Enemies**: Red triangles and purple squares moving toward the player. Squares are worth more.
- **Marks**: Temporary enemy state consumed by release.

## 3. Design Principle Analysis

- **Simplicity**: Hold marks, release resolves.
- **Visual Feedback and Game Over**: Marked enemies visibly change color; collision with the center is the only death.
- **Skill-Based Scoring**: Score depends on geometric alignment and batching, not input rate.
- **Novel Mechanics**: The attack is a rotating selection tool with deferred execution.

## 4. Relationship with Seeds

- `on_holding-shoot`: Holding uses the beam to select targets.
- `on_released-erase`: Release removes selected targets.
- `rule-geometry`: Angle alignment is the core skill.

## 5. Basis for Novelty

The player does not shoot projectiles; they create a temporary geometric set and choose the moment to erase it.

## 6. Similarity Check

It shares tension with center-defense games, but the delayed mark-and-erase mechanic makes the main action closer to geometric editing.

