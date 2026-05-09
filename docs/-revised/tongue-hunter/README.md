# TONGUE HUNTER (tongue-hunter)

**Seeds**: #weapon-chase, #on_holding-extend, #on_holding-defend

## 1. Core Mechanics

- **Input**: Hold to aim and extend the tongue toward the nearest prey; release lets it retract.
- **Behavior**: The frog is fixed near the bottom. Prey cross the screen horizontally while hazards fall from above. The tongue rotates toward the nearest prey and extends only while held.
- **End Condition**: A falling hazard touching the extended tongue ends the game.
- **Scoring**: Catching prey with the tongue tip scores `ceil(tongueLength) * combo`, then increases combo. Retracting fully resets combo to 1.
- **Difficulty Increase**: Prey spawn faster and move faster; hazards spawn faster and fall faster as difficulty rises.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `tongueLength` | Extends while aligned and holding, retracts every frame | Visible tongue line |
| `tongueAngle` | Rotates toward nearest prey while holding | Tongue direction |
| `combo` | Increases on prey catch, resets when tongue retracts below active length | Multiplier text |
| `prey` / `hazards` | Spawn over time | Black prey and red falling hazards |

- **Idle weakness**: The tongue stays retracted and no prey can be caught.
- **Hold-only weakness**: Long extension raises score but exposes the tongue to falling hazards.
- **Mashing weakness**: Frequent retraction resets combo and prevents long catches.
- **Skilled play**: Extend only when the auto-aim path is clear, catch at longer range for higher score, then retract before hazards intersect the tongue.

## 2. Object Specifications

- **Frog**: Fixed green player at bottom.
- **Tongue**: Extending line with a collision tip; vulnerable while extended.
- **Prey**: Black targets moving horizontally.
- **Hazards**: Red falling objects that kill on tongue contact.

## 3. Design Principle Analysis

- **Simplicity**: Hold extends, release retracts.
- **Visual Feedback and Game Over**: The exposed tongue and falling hazards show risk clearly.
- **Skill-Based Scoring**: Longer catches and combo preservation reward timing.
- **Novel Mechanics**: The weapon itself becomes the vulnerable body.

## 4. Relationship with Seeds

- `weapon-chase`: The tongue tracks the nearest prey.
- `on_holding-extend`: Holding extends the tongue.
- `on_holding-defend`: Releasing retracts the vulnerable tongue, functioning as defense.

## 5. Basis for Novelty

The safest state scores nothing, while the scoring state creates a long hazard-sensitive body.

## 6. Similarity Check

It resembles target-catching games, but auto-aim and tongue vulnerability make the main decision about exposure duration rather than aiming manually.

