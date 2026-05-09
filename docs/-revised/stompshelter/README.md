# STOMPSHELTER (stompshelter)

**Seeds**: #player-step_on, #player-scaffold, #rule-shelter

## 1. Core Mechanics

- **Input**: Tap to jump, with up to a double jump. Hold to increase horizontal drift speed.
- **Behavior**: The player climbs by jumping between crumbling platforms while lava rises from below. The camera scrolls upward when the player climbs high enough. Enemies walk on platforms and debris falls from above.
- **End Condition**: Touching lava, debris, an enemy from the side/below, or falling into hazards ends the game.
- **Scoring**: Upward scrolling adds survival/climb score. Stomping enemies from above adds a combo-based bonus.
- **Difficulty Increase**: Enemy spacing shortens and debris frequency increases with difficulty. Lava rises continuously.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `jumpCount` | Increases on jump, resets on landing | Available jumps inferred from movement state |
| `player.grounded` | Set by platform landing | Player rests on platform |
| `platform.hp` | Decreases while standing and from debris | Platform color changes and eventually disappears |
| `lavaY` | Rises over time and shifts with scroll | Yellow hazard field |
| `combo` | Increases on enemy stomps, resets on platform landing | Stomp bonus grows |

- **Idle weakness**: Platforms crumble and lava eventually reaches the player.
- **Hold-only weakness**: Holding only speeds horizontal drift; without timed jumps the player cannot climb.
- **Mashing weakness**: Random double jumps waste air control and can leave no jump for the next platform.
- **Skilled play**: Time jumps, use hold for controlled horizontal drift, stomp enemies from above, and keep moving before platforms collapse.

## 2. Object Specifications

- **Player**: Cyan climber with gravity, horizontal drift, and up to two jumps.
- **Platforms**: Temporary scaffolds with hit points that degrade from standing and debris.
- **Enemies**: Red walkers; stompable from above, lethal otherwise.
- **Debris**: Falling purple hazards that damage platforms and kill the player.
- **Lava**: Rising bottom hazard.

## 3. Design Principle Analysis

- **Simplicity**: Tap jumps; hold modifies horizontal drift.
- **Visual Feedback and Game Over**: Lava, enemies, debris, and platform wear are explicit.
- **Skill-Based Scoring**: Upward movement and enemy stomps reward deliberate routing.
- **Novel Mechanics**: The shelter platforms are temporary and are also damaged by falling debris.

## 4. Relationship with Seeds

- `player-step_on`: Enemy stomps and platform landings are central.
- `player-scaffold`: Platforms serve as temporary scaffolding.
- `rule-shelter`: Platforms shelter the player from lava but decay under use.

## 5. Basis for Novelty

The player must treat platforms as both safety and a consumed resource while deciding when to stomp enemies for bonus score.

## 6. Similarity Check

It resembles vertical platform survival, but platform HP and debris damage make the route unstable rather than static.

