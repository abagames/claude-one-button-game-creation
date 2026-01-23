# TONGUE HUNTER (tongue-hunter)

**Tags**: #weapon-chase, #on_holding-extend, #on_holding-defend

## Simulation Results

| Metric           | Value |
| :--------------- | :---- |
| GA Best Score    | 20    |
| Monotonous Max   | 10    |
| GA Ratio         | 2.0   |
| Evaluation       | Pass  |

## 1. Core Mechanics

- **Input**: Hold button to extend tongue toward nearest prey; release to retract
- **Behavior**: Tongue auto-tracks nearest prey while extending. Player is a frog at screen bottom.
- **Scoring**: Catch prey with tongue tip (+points). Combo multiplier for consecutive catches.
- **End Condition**: Getting hit by falling hazards (rocks/predators) while tongue is extended
- **Difficulty Increase**: More hazards spawn, prey moves faster, hazard speed increases

## 2. Object Specifications

| Object | Shape | Behavior | Collision |
|--------|-------|----------|-----------|
| Frog (player) | Green box | Fixed at bottom center | Invulnerable when tongue retracted |
| Tongue | Cyan line | Extends from frog toward nearest prey, retracts when released | Tip catches prey |
| Prey (flies) | Black small box | Float across screen horizontally | Caught = score + despawn |
| Hazard (rocks) | Red box | Fall from top | Hit frog while extended = game over |

## 3. Design Guide Analysis

- **Simplicity**: One button - hold to attack, release to defend
- **Visual Feedback**: Tongue visibly extends/retracts; clear red hazards
- **Skill-Based**: Timing when to extend vs retract; risk/reward of catching prey while hazards fall
- **Novel**: Combines homing attack with vulnerability state toggle

## 4. Relationship with Tags

- `weapon-chase`: Tongue automatically tracks nearest prey
- `on_holding-extend`: Tongue elongates while holding
- `on_holding-defend`: Releasing retracts tongue, making frog invulnerable

## 5. Basis for Novelty

The "attack = vulnerable, idle = safe" inversion creates unique tension. Most games reward constant action; this punishes overextension.

## 6. Similarity Check

- Frogger: Different - movement-based, no tongue mechanic
- Yoshi's tongue: Different - no vulnerability trade-off, no homing
