# STAR EATER (star-eater)

**Seeds**: #player-automatic, #on_holding-inhale, #weapon-explosion

## 1. Core Mechanics

- **Input**: Hold to charge and grow; release to blast if enough charge has accumulated.
- **Behavior**: The player drifts automatically across the screen and wraps horizontally. Asteroids enter from all edges. Holding increases charge, player size, movement speed, and eventual blast radius.
- **End Condition**: Touching an asteroid ends the game.
- **Scoring**: A release blast destroys asteroids inside the radius. Each asteroid destroyed in the same blast increases `destroyedCount`, and score uses `destroyedCount * destroyedCount`, rewarding large clears.
- **Difficulty Increase**: Asteroids spawn more frequently and move faster with difficulty. Player movement also speeds up with `sqrt(difficulty)`.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `charge` | Increases while holding, decays when released/not holding, resets on blast | Player grows and charge ring appears |
| `player.size` | Grows with charge | Larger collision body |
| `explosion` | Created on release after sufficient charge | Temporary blast circle |
| `destroyedCount` | Increments per asteroid destroyed by the blast | Quadratic scoring during one blast |

- **Idle weakness**: The player has no blast and eventually collides with asteroids.
- **Hold-only weakness**: The player becomes larger and faster without clearing hazards.
- **Mashing weakness**: Releases before the charge threshold do nothing or create weak blasts.
- **Skilled play**: Charge long enough to clear multiple asteroids, then release before the enlarged player is hit.

## 2. Object Specifications

- **Player**: Cyan drifting body with charge-dependent size.
- **Asteroids**: Red hazards moving inward from screen edges.
- **Blast**: Temporary radial explosion centered on the player.

## 3. Design Principle Analysis

- **Simplicity**: Hold builds blast, release spends it.
- **Visual Feedback and Game Over**: Bigger player and blast radius communicate risk and power.
- **Skill-Based Scoring**: Quadratic blast scoring rewards grouping and timing.
- **Novel Mechanics**: The player becomes both more powerful and easier to kill while charging.

## 4. Relationship with Seeds

- `player-automatic`: The player drifts without directional input.
- `on_holding-inhale`: Holding gathers energy into the player.
- `weapon-explosion`: Release produces the area blast.

## 5. Basis for Novelty

The charge action is self-endangering: it increases attack radius by enlarging the collision target.

## 6. Similarity Check

It resembles charge-and-burst survival, but the automatic drift and quadratic multi-kill scoring make the best play about asteroid clustering.

