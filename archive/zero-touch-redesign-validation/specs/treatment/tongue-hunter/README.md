# TONGUE HUNTER (tongue-hunter)

**Seeds**: #weapon-chase, #on_holding-extend, #on_holding-defend

## 1. Core Mechanics

### Controls

| Phase | Action | Notes |
| :--- | :--- | :--- |
| Press | Begin extending the frog's tongue toward the nearest prey. | Press has no separate tap effect; it starts the hold action. |
| Hold | Tongue extends and gently auto-tracks the nearest prey. | Holding is the scoring phase, but the extended tongue exposes the frog to falling hazards. |
| Release | Tongue retracts quickly and the frog returns to its defended state. | Release gives up immediate catch range in exchange for safety. |

- Behavior: The frog stays near the bottom of the screen. Flies move across the play area, and rocks fall from above. Holding extends the tongue toward the nearest fly; releasing retracts it before falling rocks reach the exposed frog.
- Game-over: A falling rock hits the frog while the tongue is extended. This is fair to read because the danger falls from above and the vulnerable state is visible as an extended tongue.
- Scoring: Catching a fly with the tongue tip awards points. Consecutive catches without a miss or defensive release build a small combo multiplier; releasing resets the active catch attempt and pauses combo growth.

### Difficulty Scaling

| Quantity | Scaling | Reason |
| :--- | :--- | :--- |
| Fly speed | Increases with `sqrt(difficulty)`, capped for readability. | Later flies are harder to line up, but remain catchable by timing holds. |
| Rock spawn rate | Increases with `sqrt(difficulty)`, with a minimum spacing cap. | More rocks create pressure to release, without making defense unreadable. |
| Rock fall speed | Increases with `sqrt(difficulty)`. | The player has less time to stay extended as difficulty rises. |
| Fly count | Adds occasional extra flies as difficulty rises. | More prey gives tempting targets and keeps the chase readable. |

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback | Decision Purpose |
| :--- | :--- | :--- | :--- |
| Tongue extension | Increases while holding; decreases quickly after release. | Tongue line grows from the frog toward prey, then shrinks back. | Choose catch reach versus exposed danger time. |
| Vulnerability | Active whenever the tongue is extended; inactive when fully retracted. | Frog appears connected to the long tongue while vulnerable; compact frog is defended. | Decide when to abandon an attack for safety. |
| Combo chain | Increases on consecutive fly catches; resets after a defensive release, miss, or game-over. | Catch flashes or multiplier feedback appears near the caught fly. | Reward sustained accurate attacks without making constant holding safe. |

- Concrete behavior pair: `release early to defend` vs `hold longer to catch a fly before the next rock lands`
- Tradeoff explanation: Extending the tongue creates score opportunities and combo growth, but also makes rocks lethal. Retracting removes that danger, but costs reach and interrupts scoring momentum.
- Idle weakness: If the player never presses, no flies are caught, so the score stays low while the field keeps getting faster.
- Hold-only weakness: Permanent holding may catch a few flies, but eventually a falling rock hits the exposed frog.
- Mashing weakness: Repeated press/release cycles keep the tongue too short to reach many flies and repeatedly interrupt combo growth.
- Skilled play: The player watches rock lanes, begins holds when a fly is reachable, stays extended just long enough for the tongue tip to connect, and releases before danger reaches the frog.
- Persistent consequence or safety cost: Defensive releases reset the active combo opportunity, so safety has a clear scoring cost.

## 2. Object Specifications

| Object | Shape | Behavior | Collision Handling |
| :--- | :--- | :--- | :--- |
| Frog | Green compact block or circle at bottom center | Stays fixed in place; alternates between defended and exposed states based on tongue extension. | Rock collision causes game-over only while exposed. |
| Tongue | Bright line or chain extending from frog | Extends toward the nearest fly while held; retracts on release. | Tongue tip catches flies; tongue body does not destroy rocks. |
| Fly | Small dark moving target | Drifts horizontally or diagonally across the play area. | Tongue-tip contact awards score and removes the fly. |
| Rock | Red falling hazard | Falls from the top toward the frog's area. | Hits the exposed frog for game-over; passes harmlessly while the frog is defended. |

## 3. Design Principle Analysis

### (1) Simplicity and Intuitiveness

The screen uses one fixed frog, one extending tongue, flies as targets, and rocks as danger. The input maps directly to the visible state: hold makes the tongue longer, release makes the frog compact and defended.

### (2) Visual Feedback and Game Over

Success is shown by the tongue tip touching and removing a fly. Danger is shown by falling red rocks. The single failure condition is a rock hitting the exposed frog, which is readable because the exposed state is the visible extended tongue.

### (3) Skill-Based Scoring and Risk/Reward

Score comes from a causal in-world event: catching prey with the tongue tip. The player earns better scores by choosing long enough holds for catches and combos, while releasing early enough to avoid rocks.

### (4) Novel Mechanics

The tongue is both the weapon and the source of vulnerability. The same hold that creates reach and score also removes safety, creating a simple attack-defend inversion from one button.

## 4. Relationship with Seeds

- `weapon-chase`: The tongue acts as a chasing weapon that steers toward nearby prey.
- `on_holding-extend`: Holding extends the tongue and creates catch range.
- `on_holding-defend`: Defense is expressed through the release state; not holding retracts the tongue and protects the frog from rocks.

## 5. Basis for Novelty

The design keeps the familiar frog tongue image but gives it a clear one-button cost: attacking makes the frog vulnerable. The player is not moving around the screen or aiming manually; the main skill is choosing how long to stay exposed while an auto-chasing weapon tries to finish the catch.

## 6. Similarity Check

- Frogger: Different because this game has a stationary frog, no lane-crossing movement, and a hold/release vulnerability tradeoff.
- Yoshi-style tongue attacks: Different because the tongue auto-chases prey and extended attack time creates a lethal exposure state.
