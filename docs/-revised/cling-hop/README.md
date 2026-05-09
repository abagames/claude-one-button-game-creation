# CLING HOP (cling-hop)

**Seeds**: #on_pressed-flap, #obstacle-bounce, #player-scaffold

## 1. Core Mechanics

- **Input**: Tap to flap upward. When clinging to a platform, tap releases and jumps away.
- **Behavior**: The player falls under gravity, flaps to stay aloft, and automatically clings when falling onto a moving platform. Platforms scroll downward while bouncing obstacles patrol the playfield.
- **End Condition**: Falling below the screen or touching a bouncing obstacle while clinging ends the game.
- **Scoring**: Clinging awards score continuously. Landing on a new platform adds a bonus equal to the number of active obstacles. Hitting an obstacle while airborne destroys it.
- **Difficulty Increase**: Platform width shrinks, platform and obstacle speeds rise, and spawn intervals shorten with `sqrt(difficulty)`.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `clingTarget` | Set by landing on a platform, cleared by tapping or platform removal | Player attaches to the moving platform |
| `obstacles.length` | Obstacles spawn over time and are removed by airborne contact | Bonus multiplier text |
| `lastPlatformId` | Updated when landing on a new platform | Prevents repeated landing bonus on the same platform |

- **Idle weakness**: Gravity eventually drops the player below the screen.
- **Hold-only weakness**: Holding has no special effect; timed taps are required.
- **Mashing weakness**: Repeated taps release good platform holds early and make obstacle contact less deliberate.
- **Skilled play**: Time flaps to land on new platforms, leave at useful moments, and strike obstacles while airborne for safer routes and higher landing bonuses.

## 2. Object Specifications

- **Player**: Yellow while airborne, cyan while clinging. Airborne contact destroys obstacles; clinging contact with obstacles is fatal.
- **Platforms**: Green horizontal bars that drift sideways while scrolling down. Falling onto one starts clinging.
- **Obstacles**: Red bouncing bodies that patrol the playfield.

## 3. Design Principle Analysis

- **Simplicity**: One tap both flaps and releases, depending on attachment state.
- **Visual Feedback and Game Over**: Player state is color-coded, and deaths come from falling or obstacle contact.
- **Skill-Based Scoring**: Score comes from maintaining platform chains under obstacle pressure, not raw taps.
- **Novel Mechanics**: The same obstacle is lethal while clinging and removable while airborne.

## 4. Relationship with Seeds

- `on_pressed-flap`: Tap produces the upward impulse.
- `obstacle-bounce`: Hazards bounce around the playfield.
- `player-scaffold`: Platforms act as temporary scaffolds.

## 5. Basis for Novelty

The core decision is whether to stay attached for stable score or jump into danger to clear obstacles and improve future landing bonuses.

## 6. Similarity Check

It resembles a vertical survival platformer, but the cling/release state and airborne obstacle-clearing rule make the platform itself part of the risk/reward loop.

