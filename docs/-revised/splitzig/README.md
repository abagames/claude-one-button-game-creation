# SPLITZIG (splitzig)

**Seeds**: #obstacle-split, #on_pressed-turn, #obstacle-stack

## 1. Core Mechanics

- **Input**: Tap to reverse horizontal movement direction.
- **Behavior**: The player auto-moves along the bottom and continuously fires upward. Falling blocks split into smaller blocks when shot. Blocks that reach the floor add to a rising stack.
- **End Condition**: Touching a block or being pushed above the top by the stack ends the game.
- **Scoring**: Shooting blocks scores based on their size stage: large blocks score less, smaller split blocks score more.
- **Difficulty Increase**: Player speed, fire rate, block speed, and spawn frequency scale with `sqrt(difficulty)`.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `player.dir` | Reversed by tap | Player horizontal movement |
| `stackHeight` | Increases when blocks land, slowly decays | Green stack/floor rises |
| `block.size` | Decreases when shot; large blocks split into two smaller blocks | Block color and size change |
| `bullets` | Auto-fired from player | Upward yellow shots |

- **Idle weakness**: The player keeps moving in one direction and cannot aim across the field; blocks build the stack.
- **Hold-only weakness**: Holding has no effect.
- **Mashing weakness**: Constant reversals reduce aim stability and make it harder to keep bullets under falling blocks.
- **Skilled play**: Reverse direction to line up shots, split blocks safely, and prevent the stack from climbing.

## 2. Object Specifications

- **Player**: Cyan auto-moving shooter near the bottom.
- **Bullets**: Automatic upward shots.
- **Blocks**: Falling red/purple/blue blocks. Larger blocks split into smaller blocks when hit.
- **Stack**: Accumulated landed blocks that raise the player toward the top.

## 3. Design Principle Analysis

- **Simplicity**: Tap only changes direction; firing is automatic.
- **Visual Feedback and Game Over**: Falling blocks and rising stack show both immediate and long-term danger.
- **Skill-Based Scoring**: Better positioning yields more shots and controlled splitting.
- **Novel Mechanics**: Destroying a block can temporarily increase object count by splitting it.

## 4. Relationship with Seeds

- `obstacle-split`: Blocks split into smaller hazards when shot.
- `on_pressed-turn`: Tap reverses player direction.
- `obstacle-stack`: Missed blocks become a rising floor.

## 5. Basis for Novelty

The player must decide where to stand so automatic fire converts falling hazards into score without creating unmanageable fragments.

## 6. Similarity Check

It shares ideas with fixed shooters, but the split-and-stack consequence makes misses persistent and spatial.

