# MISSILE GUIDE (missile_guide)

**Seeds**: #on_holding-stop, #rule-control_weapons, #field-outpost

## 1. Core Mechanics

- **Input**: Hold to freeze the missile in place.
- **Behavior**: When not frozen, the missile automatically homes toward nearby outposts as the world scrolls downward. Holding freezes the missile, allowing obstacles and outposts to scroll past.
- **End Condition**: Fuel depletion or collision with an obstacle while not frozen ends the game.
- **Scoring**: Collecting outposts while moving adds score, increases combo, and restores fuel. Missed outposts reset combo.
- **Difficulty Increase**: Scroll speed increases with difficulty and spawn intervals shorten.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `frozen` | True while holding | Missile stops moving and gains a freeze field |
| `fuel` | Drains while frozen, regenerates slowly when moving, restored by outposts | Fuel bar |
| `combo` | Increases on outpost pickup, resets when outposts pass | Pickup score grows after chains |
| `lastOutpostX` | Updated by new outpost spawn | Outpost path remains spatially coherent |

- **Idle weakness**: The missile homes into hazards without player timing and can miss fuel pickups.
- **Hold-only weakness**: Fuel drains to zero.
- **Mashing weakness**: Frequent freezes interrupt homing and reduce outpost collection consistency.
- **Skilled play**: Freeze only to let obstacle walls pass, then release so homing can collect outposts and refill fuel.

## 2. Object Specifications

- **Missile**: Cyan player object with automatic homing when not frozen.
- **Outposts**: Yellow pickups that restore fuel and score.
- **Obstacle Gates**: Red horizontal barriers with gaps. Collision is fatal while moving.
- **Fuel Gauge**: Resource limiting freeze duration.

## 3. Design Principle Analysis

- **Simplicity**: Hold stops the missile; release lets guidance resume.
- **Visual Feedback and Game Over**: Freeze, fuel, pickups, and gates are distinct.
- **Skill-Based Scoring**: Score depends on releasing at the right time to chain outposts.
- **Novel Mechanics**: The player controls when not to control a guided missile.

## 4. Relationship with Seeds

- `on_holding-stop`: Holding freezes the missile.
- `rule-control_weapons`: The player indirectly controls a weapon-like missile.
- `field-outpost`: Outposts define the route and refuel loop.

## 5. Basis for Novelty

The risk is not steering manually, but deciding when to suspend automatic guidance.

## 6. Similarity Check

It has auto-runner pressure, but the stop/resume homing rule makes the main skill temporal rather than directional.

