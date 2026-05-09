# GHOST HOP (ghost_hop)

**Seeds**: #on_pressed-jump_into_another, #on_holding-stop, #weapon-interference

## 1. Core Mechanics

- **Input**: Tap to hop to the next platform in a fixed cycle.
- **Behavior**: The player normally rides the current drifting platform. Tapping starts a jump toward the next platform. Bullets spawn from screen edges and aim at the player's current platform.
- **End Condition**: A bullet touching the player during a jump ends the game.
- **Scoring**: Landing on the next platform scores the current multiplier, then doubles it. The multiplier slowly decays over time.
- **Difficulty Increase**: Bullet speed, bullet spawn rate, platform drift speed, and jump speed increase with difficulty.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `player.idx` | Updated when landing | Current platform |
| `jumping` / `jumpT` | Set by tap, advances until landing | Player travels between platforms |
| `jumpTargetIdx` | Next cyclic platform | Highlighted next destination |
| `multiplier` | Doubles on landing, decays each frame | Multiplier text |

- **Idle weakness**: Staying on one platform earns no landing score and lets bullets accumulate around the current position.
- **Hold-only weakness**: Holding has no mechanical effect in the revised version.
- **Mashing weakness**: Tapping whenever possible forces jumps without regard to bullet paths, making the only vulnerable state occur at bad times.
- **Skilled play**: Wait on platforms until the jump path is clear, then hop to the next platform to preserve and grow the landing multiplier.

## 2. Object Specifications

- **Player**: Cyan while riding a platform, yellow while jumping. Only the jumping state is vulnerable to bullets.
- **Platforms**: Five drifting targets. The current and next platforms indicate routing.
- **Bullets**: Red projectiles fired from edges toward the player's current position.
- **Multiplier**: Landing reward that grows with consecutive successful hops.

## 3. Design Principle Analysis

- **Simplicity**: Tap advances to the next platform.
- **Visual Feedback and Game Over**: The vulnerable jump state is distinct from platform riding.
- **Skill-Based Scoring**: Score comes from timed traversal through bullet pressure.
- **Novel Mechanics**: The player is safe while stationary on platforms but must become vulnerable to score.

## 4. Relationship with Seeds

- `on_pressed-jump_into_another`: Tap hops to another platform.
- `on_holding-stop`: The revised code removed the hold-stop rule; platform riding is the default safe state.
- `weapon-interference`: Bullets interfere with jump timing and route choice.

## 5. Basis for Novelty

The scoring action is also the vulnerable action: the player can survive by waiting, but must jump through danger to build score.

## 6. Similarity Check

It resembles a platform-hopping dodger, but the cyclic destination rule and jump-only vulnerability make timing more important than free movement.

