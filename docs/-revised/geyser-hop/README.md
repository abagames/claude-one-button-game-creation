# GEYSER HOP (geyser-hop)

**Seeds**: #obstacle-well_up, #rule-find, #player-step_on

## 1. Core Mechanics

- **Input**: Hold to rise; release to fall.
- **Behavior**: The player has fixed horizontal placement and must manage vertical velocity between a rising ceiling and the ground. Geysers scroll in from the right and must be stomped from above.
- **End Condition**: Touching the ceiling, ground, geyser body, or hitting a geyser top while moving upward ends the game.
- **Scoring**: Stomping the yellow top of a geyser while falling scores the current multiplier, increases the multiplier, bounces the player upward, lowers the ceiling, and collapses that geyser.
- **Difficulty Increase**: Geysers move and spawn faster with `sqrt(difficulty)`. The ceiling starts rising if the player goes too long without stomping.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `player.vy` | Holding accelerates upward, releasing accelerates downward | Player vertical movement |
| `ceiling` | Rises after long no-stomp periods, lowered by successful stomps | Red danger band at top |
| `stompTimer` | Resets on stomp, otherwise increases | Ceiling pressure starts after delay |
| `multiplier` | Increases on consecutive stomps, decreases when geysers pass unstomped | Multiplier text |

- **Idle weakness**: The player falls into the ground.
- **Hold-only weakness**: The player rises into the ceiling.
- **Mashing weakness**: Rapid toggling does not guarantee downward contact on geyser tops and can cause upward top hits.
- **Skilled play**: Shape the vertical arc so contact with each geyser top occurs while falling.

## 2. Object Specifications

- **Player**: Cyan body with vertical velocity.
- **Geyser Body**: Blue column; touching it is fatal.
- **Geyser Top**: Yellow stomp zone; only safe and scoring while the player is descending.
- **Ceiling and Ground**: Red top boundary and green floor.

## 3. Design Principle Analysis

- **Simplicity**: Hold rises, release falls.
- **Visual Feedback and Game Over**: Boundaries and geyser body are clear hazards.
- **Skill-Based Scoring**: Stomps require precise vertical timing.
- **Novel Mechanics**: Successful stomps are both score events and pressure relief against the ceiling.

## 4. Relationship with Seeds

- `obstacle-well_up`: Geysers are vertical hazards rising from the floor.
- `rule-find`: The player must find the safe stomp timing.
- `player-step_on`: Stomping is the only scoring action.

## 5. Basis for Novelty

The same obstacle is deadly from the side or below but beneficial from above, and repeated stomps push back a rising ceiling.

## 6. Similarity Check

It resembles bounce survival, but the one-button vertical thrust and ceiling-pressure reset create a tighter timing loop than ordinary platform hopping.

