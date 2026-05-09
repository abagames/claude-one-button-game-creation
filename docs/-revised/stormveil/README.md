# STORMVEIL (stormveil)

**Seeds**: #field-weather, #on_pressed-turn, #weapon-smoke

## 1. Core Mechanics

- **Input**: Tap to switch to the next lane in a three-lane field.
- **Behavior**: The player stays near the bottom while obstacles and coins descend in lanes. Each wave blocks one or two lanes and places a coin in one remaining safe lane.
- **End Condition**: Touching a red obstacle ends the game.
- **Scoring**: Collecting a coin scores the current multiplier and increases it. Missing a coin resets the multiplier to 1.
- **Difficulty Increase**: Descent speed and wave frequency increase with `sqrt(difficulty)` / `difficulty`; later waves can block two lanes.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `lane` | Advances cyclically on tap | Player moves between three lane guides |
| `multiplier` | Increases on coin pickup, resets on missed coin | Multiplier text |
| `obstacles` / `coins` | Spawn as lane waves | Red blocked lanes and yellow reward lane |

- **Idle weakness**: Staying in one lane eventually collides with a blocked lane or misses coins.
- **Hold-only weakness**: Holding has no effect; it cannot switch lanes.
- **Mashing weakness**: Cycling lanes blindly often overshoots the safe coin lane.
- **Skilled play**: Read each wave, tap the exact number of times needed to reach the safe/reward lane, and preserve the multiplier.

## 2. Object Specifications

- **Player**: Cyan lane runner positioned near the bottom.
- **Lanes**: Three fixed x positions.
- **Obstacles**: Red descending lane blockers.
- **Coins**: Yellow descending collectibles placed in an unblocked lane.

## 3. Design Principle Analysis

- **Simplicity**: Tap cycles lanes.
- **Visual Feedback and Game Over**: Red lane blockers make collision danger direct.
- **Skill-Based Scoring**: Coin streaks reward correct lane selection under pressure.
- **Novel Mechanics**: Each wave is a small lane-selection puzzle rather than pure avoidance.

## 4. Relationship with Seeds

- `field-weather`: The storm is represented as descending lane threats.
- `on_pressed-turn`: Tap changes course by moving to the next lane.
- `weapon-smoke`: The revised mechanics no longer use smoke as a rule; it became a lane-dodging storm field.

## 5. Basis for Novelty

The player must select the only profitable safe lane in a cyclic one-button lane system.

## 6. Similarity Check

It resembles lane runners, but cyclic lane switching means the cost of changing lanes depends on the current lane, not direct left/right input.

