# ORBIT GRAZER (orbit-grazer)

**Seeds**: #on_pressed-select_route, #field-gravity, #rule-proximity_bonus

## 1. Core Mechanics

- **Input**: Tap to reverse orbit direction.
- **Behavior**: The player orbits a central point. The orbit radius gradually expands up to a limit while asteroids spawn from the edge and cross the orbit field.
- **End Condition**: Asteroid collision shrinks the orbit radius and grants temporary invincibility; reaching the center and colliding with it ends the game.
- **Scoring**: Passing close to an asteroid while not invincible scores 1 point. This rewards sustained grazing near danger rather than direct collection.
- **Difficulty Increase**: Orbit speed, asteroid spawn rate, and asteroid speed scale with `sqrt(difficulty)`.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `orbitDir` | Reversed by tap | Orbit movement direction changes |
| `orbitRadius` | Slowly expands, shrinks sharply on asteroid hit | Orbit path radius |
| `invincibleTicks` | Set after asteroid collision, counts down | Player color changes while invincible |
| `asteroids` | Spawn from edges toward the orbit field | Incoming purple/red hazards |

- **Idle weakness**: A fixed orbit direction eventually takes the player through asteroid paths and repeated hits collapse the orbit.
- **Hold-only weakness**: Holding has no special effect in the revised version.
- **Mashing weakness**: Constant reversals keep the player near the same arc and make grazing routes unstable.
- **Skilled play**: Reverse direction to skim asteroid edges for score while avoiding direct hits that shrink the orbit.

## 2. Object Specifications

- **Player**: Cyan orbital body, blue during temporary invincibility.
- **Center**: Yellow gravity point and final collapse hazard.
- **Orbit Path**: Visual guide for current radius.
- **Asteroids**: Moving hazards; proximity scores, collision damages orbit radius.

## 3. Design Principle Analysis

- **Simplicity**: Tap reverses orbital direction.
- **Visual Feedback and Game Over**: Orbit radius shows remaining safety margin, and center collapse is clear.
- **Skill-Based Scoring**: Score comes from close passes near asteroids.
- **Novel Mechanics**: Failure is a spatial collapse of the orbit rather than immediate death.

## 4. Relationship with Seeds

- `on_pressed-select_route`: Tap selects clockwise vs counterclockwise route.
- `field-gravity`: The player is constrained to an orbit around a center.
- `rule-proximity_bonus`: Scoring is based on grazing asteroids.

## 5. Basis for Novelty

The player is allowed to survive hits, but each hit compresses the orbital play space and makes future grazing harder.

## 6. Similarity Check

It resembles orbital dodging, but the shrinking radius damage model creates a gradual failure state tied to the gravity field.

