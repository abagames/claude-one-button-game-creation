# PRESSBOUND (pressbound)

**Seeds**: #player-bounce, #field-press, #player-multiple

## 1. Core Mechanics

- **Input**: Hold to freeze the balls and charge; release to reset the walls and spawn a new ball set.
- **Behavior**: Multiple balls bounce inside walls that steadily press inward. Holding accelerates the wall press, freezes the balls, and charges a release score. Releasing clears the pressure and starts a new round with more balls.
- **End Condition**: If walls close too far while not frozen, or if a frozen ball is crushed by the walls, the game ends.
- **Scoring**: Release score scales with charge squared and number of balls squared. Longer holds and more balls are worth more but are more dangerous.
- **Difficulty Increase**: Ball speed and wall pressure scale with `sqrt(difficulty)`.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `wallPress` | Always increases, faster while holding; resets on release | Walls move inward |
| `frozen` | Set on press, cleared on release | Balls stop moving |
| `charge` | Increases while holding frozen | Pending score text |
| `balls.length` | New set spawned on release | More balls in arena |

- **Idle weakness**: Walls close until the game ends.
- **Hold-only weakness**: Frozen balls are eventually crushed and holding accelerates wall pressure.
- **Mashing weakness**: Short charges produce little or no score and reset before the squared reward grows.
- **Skilled play**: Let balls bounce while space remains, then freeze long enough for a valuable charge and release before crush.

## 2. Object Specifications

- **Balls**: Cyan bouncing player objects; multiple can exist.
- **Walls**: Four inward-pressing boundary bands.
- **Charge State**: Active while holding; freezes balls and raises release value.

## 3. Design Principle Analysis

- **Simplicity**: Hold freezes/charges, release cashes out.
- **Visual Feedback and Game Over**: Inward walls make pressure and failure obvious.
- **Skill-Based Scoring**: Reward depends on how long pressure is safely tolerated.
- **Novel Mechanics**: The player manages a group survival field instead of one avatar.

## 4. Relationship with Seeds

- `player-bounce`: Balls bounce inside the shrinking field.
- `field-press`: Walls continuously press inward.
- `player-multiple`: Release creates multiple player-like balls.

## 5. Basis for Novelty

The score action is a cash-out under spatial compression: more balls and longer freezes multiply both reward and risk.

## 6. Similarity Check

It has arena-bounce elements, but the press/freeze/release economy makes it closer to a pressure-management game.

