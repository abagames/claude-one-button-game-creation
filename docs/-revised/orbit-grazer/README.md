# ORBIT GRAZER (orbit-grazer)

**Tags**: #on_pressed-select_route, #field-gravity, #rule-proximity_bonus

## 1. Core Mechanics

- **Input**: Tap to reverse orbit direction, Hold to speed up
- **Behavior**: Player automatically orbits around center point. Asteroids spawn and target the player's orbit path.
- **Scoring**: Graze asteroids (get close without collision) to score. Closer = more points. Holding (faster) = 2x points. Multiplier builds with consecutive grazes.
- **End Condition**: Collision with asteroid
- **Difficulty**: Spawn rate and asteroid speed increase over time (sqrt scaling)

## 2. Object Specifications

- **Player**: 6x6 cyan box, orbits at radius 25 from center
- **Asteroids**: 6-11 size red boxes, spawn from edges and target orbit path
- **Center**: 4x4 yellow box (visual reference only)
- **Orbit Path**: Light black arc showing player's trajectory

## 3. Balance Patterns Applied

This game was balanced using `balance-pattern-guide.md`:

| Pattern | Application |
|:--|:--|
| 1.1 sqrt Scaling | Spawn rate, asteroid speed use sqrt(difficulty) |
| 2.1 Risk-Based Scoring | Hold = 2x points, proximity bonus |
| 2.4 Combo Multiplier | Graze builds multiplier (max 8x) |
| 4.3 Spam Penalty | 20-frame cooldown on direction change, spam reduces multiplier |
| 5.3 Hold Danger | Holding increases orbit speed (faster but harder to dodge) |
| 6.3 Adaptive Spawn | 60% of asteroids target player's predicted position |

## 4. Balance Test Results

### Initial Version (Before Patterns)
| Pattern | Survival | Score |
|:--|:--|:--|
| NoInput | 1.78s | 2 |
| HoldOnly | 7.1s | 8 |
| **SpamPress** | 10s | **10** |

**Problem**: Spam was optimal

### After Balance Patterns
| Pattern | Survival | Score |
|:--|:--|:--|
| NoInput | 1.88s | 1 |
| HoldOnly | 7.37s | 0 |
| SpamPress | 2.43s | 0 |

**Result**: All monotonous patterns score nearly 0, requiring skilled timing for points.

## 5. Relationship with Tags

- **on_pressed-select_route**: Tap reverses orbit direction (route selection)
- **field-gravity**: Player is held in orbit by implied gravity toward center
- **rule-proximity_bonus**: Graze mechanic rewards getting close to danger
