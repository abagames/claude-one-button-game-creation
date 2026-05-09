# SPLITZIG (splitzig)

**Seeds**: #obstacle-split, #on_pressed-turn, #obstacle-stack

## 1. Core Mechanics

### Controls

| Phase | Action | Notes |
| :--- | :--- | :--- |
| Press | Reverse the player's horizontal travel direction. | This is the only intentional control. Timing turns keeps the player in the firing lane without touching the sides. |
| Hold | Intentionally unused. | Holding is equivalent to not pressing; it grants no shield, slowdown, aim lock, or scoring advantage. |
| Release | Intentionally unused. | Releasing has no action because the design is about committing to discrete turns under pressure. |

- Behavior: The player moves horizontally near the lower part of the screen and auto-fires upward at a steady rhythm. Blocks fall from above; a shot does not simply erase a block, it splits it into smaller angled pieces until the smallest pieces are destroyed. Destroyed small pieces become debris that raises the floor, so every successful attack also compresses the remaining play space.
- Game-over: The player is crushed by a solid object: a side wall, a falling/splitting block, or the rising debris stack. Each case is readable as the player's body touching an occupied solid region.
- Scoring: Score comes from clearing block material through the split chain. Later-stage clears are worth more, and clearing pieces while they are still high on the screen awards a height bonus because the player had to align early instead of waiting safely near the bottom.

### Difficulty Scaling

| Quantity | Scaling | Reason |
| :--- | :--- | :--- |
| Block spawn interval | Decreases with `sqrt(difficulty)`, capped before overlaps become unreadable. | More falling material increases routing pressure while keeping individual threats legible. |
| Block fall speed | Increases with `sqrt(difficulty)`. | The player has less time to align under targets, but block motion still remains readable. |
| Split-piece horizontal drift | Increases slightly with `sqrt(difficulty)`. | Split cascades occupy more lateral space and make careless shooting riskier. |
| Stack rise per small clear | Increases slowly with `difficulty`. | The consequence of destruction becomes more severe over time, forcing better target choice. |
| Auto-fire interval | Mostly stable, with only a small late-game decrease if needed. | The core skill should be positioning and timing turns, not managing a rapidly changing fire rate. |

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback | Decision Purpose |
| :--- | :--- | :--- | :--- |
| Player direction | Flips on each press; persists until the next press. | The player visibly travels left or right. | Choose when to commit to a lane before the wall or a falling block closes it. |
| Split depth | A block advances from large to medium to small as shots hit it; small pieces disappear into debris when cleared. | Blocks visibly become smaller and more numerous, with angled drift after each split. | Decide whether continuing to shoot the same threat is worth creating extra moving pieces. |
| Debris stack height | Increases when small pieces are destroyed; never decreases during the run. | The bottom floor rises and visibly reduces vertical clearance. | Balance clearing threats for score against preserving future survival space. |
| Block altitude | Decreases as blocks fall; reset only by spawning new blocks. | Threats move downward toward the player and stack. | Choose early risky clears for bonus score or later safer clears with less reward and more crowding. |

- Concrete behavior pair: stay near open space and take low-value late clears vs. turn under high falling blocks for early split-chain clears.
- Tradeoff explanation: Shooting blocks is necessary for score and threat removal, but complete destruction creates permanent stack growth. The best play clears selected chains early while avoiding unnecessary over-clearing that spends too much vertical space.
- Idle weakness: If the player never presses, horizontal movement eventually carries them into a side wall or leaves them misaligned while falling blocks and the stack close the lane.
- Hold-only weakness: Holding has no distinct effect, so it collapses to idle behavior and cannot steer, dodge, or improve scoring.
- Mashing weakness: Rapid repeated presses keep flipping direction, causing jitter near the same lane. This misses early alignment windows, makes wall timing erratic, and often leaves split pieces spreading into the player's path.
- Skilled play: The player times sparse turns to sweep under valuable targets, retreats before split pieces fan out, and avoids clearing low-value material when the stack cost would make the next sequence worse.
- Persistent consequence or safety cost: Destroyed small pieces permanently raise the stack, so every completed split chain trades immediate score for less future play space.

## 2. Object Specifications

### Player

- Shape: Small, solid, high-contrast box.
- Position: Lower screen, above the debris stack and below the falling block field.
- Behavior: Moves horizontally at constant speed. Pressing reverses direction immediately.
- Collision handling: Touching a side wall, block, split piece, or debris stack causes game over.

### Shots

- Shape: Thin upward projectile emitted from the player's current position.
- Behavior: Auto-fires at a steady interval and travels straight upward.
- Collision handling: On first contact with a block piece, the shot disappears and applies one split/clear step to that piece.

### Blocks

- Shape: Solid squares in three readable sizes: large, medium, and small.
- Behavior: Large blocks fall from the top. When hit, larger blocks split into two smaller pieces that continue falling while drifting diagonally away from the split point.
- Collision handling: Touching the player causes game over. Hits from shots split large and medium blocks, while hits on small blocks clear them into debris.

### Debris Stack

- Shape: Solid floor rising from the bottom of the screen.
- Behavior: Grows when small block pieces are cleared.
- Collision handling: Touching the player causes game over. It is the persistent cost of successful destruction, not a collectible or resource.

## 3. Design Principle Analysis

### (1) Simplicity and Intuitiveness

The screen uses one moving player, upward shots, falling blocks, and a rising floor. The player learns the rule from cause and effect: shots split blocks, split pieces become smaller, and cleared small pieces add to the stack.

### (2) Visual Feedback and Game Over

Success is visible as block size reduction and eventual debris growth. Danger is visible as occupied space approaching the player from above, the sides, and below. Game over is consistently communicated as the player touching solid occupied space.

### (3) Skill-Based Scoring and Risk/Reward

Score rewards intentional positioning under falling targets and early completion of split chains. The safe choice is to stay away from crowded cascades and accept fewer points; the risky choice is to enter the firing lane early, create more pieces, and escape before the fan-out and stack cost become fatal.

### (4) Novel Mechanics

The central twist is that successful destruction creates a permanent environmental penalty. The player is not just shooting obstacles away; they are deciding how much future space to spend for immediate score and safety.

## 4. Relationship with Seeds

- **obstacle-split**: Blocks split into smaller falling pieces when shot, turning one threat into multiple readable threats.
- **on_pressed-turn**: The only control is a press-triggered direction reversal, making route commitment and wall timing the main movement skill.
- **obstacle-stack**: Cleared small pieces become a rising debris stack, shrinking the play area as a direct result of player success.

The creative tension is that shooting is both necessary and costly: the action that removes a falling obstacle also builds the obstacle that will eventually crush the player from below.

## 5. Basis for Novelty

1. Destruction is not purely beneficial; it converts falling danger into permanent terrain pressure.
2. Splitting blocks create short-term chaos before they become long-term stack growth.
3. The one-button turn control makes targeting and dodging the same positioning problem.
4. High-score play is a space-budgeting problem: clear early enough to score, but not so much that the stack removes future options.

## 6. Similarity Check

- **Asteroids-style splitting enemies**: Splitzig also breaks large objects into smaller threats, but the player is constrained to one-button horizontal reversal and cleared fragments permanently raise the floor.
- **Fixed-lane shooters**: Splitzig has automatic firing and falling targets, but the main decision is not when to shoot; it is when to turn into or away from a lane as split consequences accumulate.
- **Rising-floor survival games**: Splitzig includes a rising floor, but the floor rises because of successful clears rather than a purely timed hazard.
