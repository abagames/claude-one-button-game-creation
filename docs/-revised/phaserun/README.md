# PHASERUN (phaserun)

**Seeds**: #on_pressed-reverse_state, #on_pressed-select_route, #rule-shelter

## 1. Core Mechanics

- **Input**: Tap to toggle solid/ghost state. Hold to grow larger.
- **Behavior**: Obstacles and coins scroll from right to left across a fixed player. In solid state, the player can collect coins but is killed by obstacles. In ghost state, the player passes through both obstacles and coins.
- **End Condition**: A solid-state collision with a red obstacle ends the game.
- **Scoring**: Coins score only while the player is solid. The score value is based on current player size, so holding before coin contact increases reward and collision risk.
- **Difficulty Increase**: Object speed increases with `difficulty`; spawn intervals shrink with `sqrt(difficulty)` or `difficulty`.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `isSolid` | Toggled by tap | Player color/state indicator |
| `player.size` | Grows while holding, returns toward base size when released | Player body grows/shrinks |
| `obstacles` / `coins` | Spawn from the right and scroll left | Incoming red hazards and yellow rewards |

- **Idle weakness**: Staying solid eventually collides with an obstacle.
- **Hold-only weakness**: A larger solid player scores more but is more likely to die; if ghost, holding only cannot collect.
- **Mashing weakness**: Random phase toggles easily miss coins or become solid at the wrong moment.
- **Skilled play**: Become ghost for obstacles, become solid for coins, and briefly hold to enlarge only when a coin can be safely collected.

## 2. Object Specifications

- **Player**: Fixed-position body with solid and ghost states plus variable size.
- **Obstacles**: Red rotating hazards; only collide in solid state.
- **Coins**: Yellow collectibles; only collect in solid state.

## 3. Design Principle Analysis

- **Simplicity**: Tap changes collision state; hold changes size.
- **Visual Feedback and Game Over**: Solid/ghost state and hazards are clearly separated.
- **Skill-Based Scoring**: Bigger solid form gives more score but increases danger.
- **Novel Mechanics**: The safe state is also non-scoring, forcing deliberate exposure.

## 4. Relationship with Seeds

- `on_pressed-reverse_state`: Tap reverses solid/ghost state.
- `on_pressed-select_route`: The player selects the collision route through timing.
- `rule-shelter`: Ghost state shelters the player from obstacles at the cost of rewards.

## 5. Basis for Novelty

The player trades collision vulnerability for coin value through state and size, without moving position.

## 6. Similarity Check

It resembles phase-shift runners, but the hold-to-grow scoring layer makes size a voluntary risk multiplier.

