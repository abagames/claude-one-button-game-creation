# PHASERUN (phaserun)

**Seeds**: #on_pressed-reverse_state, #on_pressed-select_route, #rule-shelter

## 1. Core Mechanics

### Controls

| Phase | Action | Notes |
| :--- | :--- | :--- |
| Press | Toggle between SOLID and GHOST phase. | This is the only active input. Each press reverses the current collision state. |
| Hold | Intentionally unused. | Holding after a press only leaves the player in the chosen phase; it does not add power or movement. |
| Release | Intentionally unused. | Release has no separate action so the game stays focused on readable phase timing. |

- Behavior: The player stays fixed near the left side of a single horizontal lane while coins and obstacles scroll from right to left. In SOLID phase, the player can collect coins but is vulnerable to obstacles. In GHOST phase, obstacles pass through harmlessly, but coins also pass through without scoring.
- Game-over: Touching an obstacle while in SOLID phase. This is fair to read because obstacles always travel in the same lane toward the fixed player, and the current phase determines whether collision is dangerous.
- Scoring: +1 point for each coin collected while in SOLID phase. Missed coins leave the screen without scoring.

### Difficulty Scaling

| Quantity | Scaling | Reason |
| :--- | :--- | :--- |
| Scroll speed | Increases gradually with `sqrt(difficulty)`, with a readable upper bound. | Later objects arrive faster, asking for earlier phase decisions without making the lane unreadable. |
| Obstacle spawn interval | Decreases gradually with `sqrt(difficulty)`, capped so obstacles remain individually readable. | Safe GHOST windows become more frequent, increasing pressure. |
| Coin spawn interval | Decreases slightly with `sqrt(difficulty)`, capped separately from obstacles. | More scoring chances appear, but they still compete with obstacle timing. |

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback | Decision Purpose |
| :--- | :--- | :--- | :--- |
| `phase` | Press toggles SOLID to GHOST or GHOST to SOLID. | Player shape/color/opacity visibly changes between the two phases. | Choose between vulnerable scoring and safe non-scoring. |
| Incoming object spacing | Advanced by time and difficulty-scaled spawns. | Coins and obstacles approach from the right in the same lane. | Read whether the next commitment should prioritize collection or survival. |

- Concrete behavior pair: stay or switch to GHOST before an obstacle for safety vs. stay or switch to SOLID before a coin for score.
- Tradeoff explanation: SOLID is the only scoring state, but it makes obstacle collision lethal. GHOST is the shelter state, but using it too early or too long sacrifices coins.
- Idle weakness: If the player never presses, they remain SOLID, may collect an early coin, and then die to the first obstacle.
- Hold-only weakness: If the player presses once and keeps holding, they stay in GHOST, survive longer, and score poorly because coins cannot be collected.
- Mashing weakness: Rapid repeated tapping gives an unpredictable phase at contact time, often turning SOLID into obstacles or GHOST through coins.
- Skilled play: The player watches the next incoming object, enters GHOST only for obstacle contact, and returns to SOLID in time to collect nearby coins.
- Persistent consequence or safety cost: There is no extra persistent world state; the safety cost is immediate missed scoring while sheltered in GHOST.

## 2. Object Specifications

| Object | Shape / Role | Behavior | Collision Handling |
| :--- | :--- | :--- | :--- |
| Player | Small fixed avatar with a clear SOLID/GHOST phase indicator. | Holds position near the left side of the lane; only phase changes. | Uses current phase to decide obstacle death or coin collection. |
| Obstacle | Large red block or spike-like hazard. | Scrolls left through the player's lane. | Ends the game on contact only while the player is SOLID; passes through GHOST. |
| Coin | Small yellow collectible. | Scrolls left through the same lane as hazards. | Adds +1 and disappears on contact only while the player is SOLID; passes through GHOST. |

## 3. Design Principle Analysis

### (1) Simplicity and Intuitiveness

The game uses one lane, one fixed player, one danger object, and one scoring object. Pressing flips the player's phase, and every object interaction follows from whether the player is currently solid enough to touch the world.

### (2) Visual Feedback and Game Over

The player's phase must be visible at all times through color, opacity, or shape change. Coin collection disappears the coin and awards score; obstacle contact in SOLID phase causes the single game-over condition.

### (3) Skill-Based Scoring and Risk/Reward

Score comes from collecting coins, not from pressing or merely surviving. The risk/reward is direct: SOLID enables score but exposes the player to death, while GHOST prevents death but forfeits coins.

### (4) Novel Mechanics

The core rule is selective collision. The player is not dodging objects by moving; they are choosing which class of contact exists at each moment.

## 4. Relationship with Seeds

- **on_pressed-reverse_state**: Each press reverses the player between SOLID and GHOST.
- **on_pressed-select_route**: The phase choice acts like selecting the dangerous scoring route or the sheltered non-scoring route within the same lane.
- **rule-shelter**: GHOST is the shelter state, protecting the player from obstacles at the cost of missed coins.

## 5. Basis for Novelty

- Selective vulnerability replaces spatial dodging with timed collision permission.
- Safety and scoring are mutually exclusive at contact time.
- The player must predict the upcoming object sequence and time phase windows rather than simply staying safe.

## 6. Similarity Check

- **Auto-runner avoidance games**: Similar because hazards scroll toward a fixed or forward-moving player, but PHASERUN removes lane movement and makes survival depend on collision state.
- **Polarity or phase-switching games**: Similar because state changes alter object interaction, but PHASERUN keeps the rule to two readable contacts: SOLID collects and risks death, GHOST shelters and misses score.
