# PRESSBOUND (pressbound)

**Seeds**: #player-bounce, #field-press, #player-multiple

## 1. Core Mechanics

### Controls

| Phase | Action | Notes |
| :--- | :--- | :--- |
| Press | Begins charging wall-pressure energy. | Press has no separate tap action; its purpose is to enter the risky charge state cleanly. |
| Hold | Charge builds while every player ball freezes in place. | Longer holds create stronger pushback, but frozen balls cannot bounce away from the inward walls. |
| Release | Discharges the stored energy, pushing all four walls outward and re-launching the balls. | The pushback scales with charge. The balls resume motion with a short speed burst, so release timing changes the next bounce pattern. |

- Behavior: Three to five player balls continuously bounce inside a rectangular arena while four boundary walls press inward from the edges. The only way to recover space is to hold for charge, accepting that the balls stop moving and become easier for the walls to crush. Releasing converts the charge into a simultaneous outward shove on the walls and restarts the balls' bouncing motion.
- Game-over: The game ends when any ball is crushed by a pressing wall. This is fair to read because the threat is visible as shrinking space around every ball, and the losing ball is visibly pinned against the wall.
- Scoring: Survival is the core mastery signal, with bonus score for pressure cash-outs: releasing a meaningful charge while a wall is dangerously close to at least one ball. The bonus rewards waiting under real compression instead of pressing on a timer.

### Difficulty Scaling

| Quantity | Scaling | Reason |
| :--- | :--- | :--- |
| Wall press speed | Starts slow, then increases with `difficulty` while capped before motion becomes unreadable. | The arena must steadily demand stronger timing without making the walls appear to teleport. |
| Ball count | Starts at 3 and rises toward 5 as difficulty increases. | More balls make the same wall pressure harder because every release must protect multiple positions. |
| Ball rebound speed | Increases gently with `sqrt(difficulty)`, plus a short release burst. | Faster bounces create changing risk positions while keeping trajectories trackable. |
| Danger bonus window | The wall-distance threshold stays readable, but reaching it happens more often as wall speed rises. | Skilled play should be about judging closeness, not learning a hidden scoring timer. |

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback | Decision Purpose |
| :--- | :--- | :--- | :--- |
| Charge | Increases while the button is held; resets to zero on release. | A top charge bar fills from green toward yellow as stored pushback grows. | Choose a small, safe wall shove now or a larger delayed shove after accepting more crush risk. |
| Wall compression | Increases continuously as the four walls press inward; decreases when charge is released. | The playable rectangle visibly shrinks, and walls flash danger colors when close to crushing space. | Decide when the arena is tight enough to justify cashing out the stored charge. |
| Ball motion state | Balls bounce normally when not holding; they freeze while holding; they receive a short burst on release. | Frozen balls change color and stop moving; released balls visibly jump back into fast motion. | Choose whether to preserve a safer moving trajectory or freeze a risky position to build wall relief. |
| Multi-ball risk | Rises when any ball is near a wall or when balls are spread across the arena; falls after a well-timed pushback. | Several balls remain visible at once, making the most threatened ball apparent without a separate UI marker. | Force the player to release for the worst-positioned ball, not just the average arena size. |

- Concrete behavior pair: Release early for a small, safe push that preserves ball motion vs. hold longer for a stronger wall reset while the frozen balls sit closer to being crushed.
- Tradeoff explanation: The same action that creates future safety also creates immediate danger. Holding improves charge and eventual wall pushback, but it removes the balls' ability to bounce away from closing walls. Releasing restores motion and space, but spending charge too soon leaves the arena compressed again almost immediately.
- Idle weakness: If the player never presses, the balls keep bouncing while all four walls press inward until one ball is inevitably crushed.
- Hold-only weakness: Permanent holding builds charge but never spends it, so the frozen balls are crushed by the advancing walls.
- Mashing weakness: Rapid press/release cycles produce tiny pushbacks and repeated motion bursts without enough stored charge to recover meaningful space.
- Skilled play: The player watches both wall compression and the worst-positioned ball, holds only long enough to build useful pressure, then releases when the arena is tight but before a frozen ball is trapped.
- Persistent consequence or safety cost: Poor releases leave the arena more compressed for the next cycle, making the next charge window shorter and more dangerous.

## 2. Object Specifications

### Player Balls

- Shape and color: Small cyan or blue square-like balls, all treated as player-owned bodies.
- Count: Begin with 3 balls, with difficulty allowing up to 5.
- Movement: Each ball auto-bounces inside the current wall bounds and keeps a minimum readable speed.
- Holding behavior: During hold, all balls freeze exactly where they are and become vulnerable to the still-advancing walls.
- Release behavior: On release, balls resume their previous bounce directions with a brief speed boost so the cash-out visibly reactivates the field.
- Collision handling: A ball reflecting from a safe wall bounces normally; a ball contacted by the inward crush boundary causes game over.

### Pressing Walls

- Shape and color: Four thick purple rectangular walls forming the active arena boundary.
- Movement: Each wall continuously presses inward toward the center.
- Pushback: Releasing charge moves all four walls outward by an amount proportional to stored charge.
- Danger feedback: Walls shift toward a warning color when they have pressed deeply inward or when the crush margin around a ball is small.
- Collision handling: The wall is the single lethal hazard. If any wall overlaps a ball beyond the safe boundary, the run ends.

### Charge Bar

- Shape and location: A slim bar near the top edge of the screen.
- Behavior: Fills while holding and empties on release.
- Feedback: Green indicates low to moderate charge; yellow indicates a larger pushback is ready.
- Purpose: Shows stored wall relief, but does not replace reading the actual wall and ball positions.

### Arena Space

- Shape: A rectangular play field defined by the current positions of the four walls.
- Behavior: Shrinks continuously and expands only through player release.
- Purpose: Turns time into pressure and makes every ball position meaningful.

## 3. Design Principle Analysis

### (1) Simplicity and Intuitiveness

The design uses only bouncing balls, four moving walls, and one charge bar. The player can infer the rule by watching the walls close in, seeing balls freeze during hold, and seeing the release push the walls back. Each visible object has one role: balls must survive, walls crush, and charge stores the next pushback.

### (2) Visual Feedback and Game Over

Success is shown by the walls being shoved outward and balls restarting their motion. Danger is shown by reduced arena size, warning wall colors, and frozen balls sitting near crush boundaries. The single failure condition is any ball being crushed by a wall, which keeps the cause of death immediate and visible.

### (3) Skill-Based Scoring and Risk/Reward

Survival score reflects the central skill because the player is maintaining a shrinking arena for multiple bouncing bodies. Bonus points come from pressure cash-outs near danger, an in-world event caused by waiting longer under compression. The safe choice is a short hold with low reward; the risky choice is a longer hold that can reset the arena more strongly but may freeze a ball in a lethal spot.

### (4) Novel Mechanics

The core inversion is that holding the button does not protect the player. It creates the only tool for survival while temporarily making every player body helpless. The game combines a field-level defensive release with multiple autonomous player bodies, so the player is managing a pressure system rather than steering a single avatar.

## 4. Relationship with Seeds

- **player-bounce**: The player presence is expressed through bouncing balls rather than direct steering.
- **field-press**: The whole arena is the hazard, with walls constantly compressing the play field.
- **player-multiple**: Several player balls share one survival state, so the weakest position determines when to release.

The seeds combine into a pressure-management game: bouncing creates changing risk positions, pressing creates urgency, and multiple player bodies turn a single hold/release decision into a spatial judgment.

## 5. Basis for Novelty

- Holding is both preparation and self-endangerment because it charges the rescue action while freezing the balls.
- The release acts on the environment instead of directly controlling a player character.
- Multiple autonomous player bodies make the player protect a distributed self with one input.
- The score bonus is tied to visible pressure cash-out, not to input count or arbitrary timing.

## 6. Similarity Check

- **Super Hexagon**: Both involve enclosing pressure, but PRESSBOUND has no direct dodging or rotation. The player manipulates wall pressure through charge and release.
- **Flappy Bird**: Both rely on one-button timing, but PRESSBOUND does not move one avatar through gates. The button freezes multiple bodies and resets the arena boundary.
- **Breakout-style bounce games**: Both use bouncing objects, but PRESSBOUND makes the bouncing objects the vulnerable player bodies rather than projectiles used to clear bricks.

The key difference is the charge-freeze-release cycle: the player survives by temporarily immobilizing multiple bouncing bodies to build enough force to push the crushing field back.
