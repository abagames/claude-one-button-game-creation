# GHOST HOP (ghost_hop)

**Tags**: #on_pressed-jump_into_another, #on_holding-stop, #weapon-interference

## 1. Core Mechanics

- **Input**: Tap to jump to the next target platform; Hold to activate shield (invulnerable but frozen)
- **Behavior**: Player occupies one of 5 floating platforms that drift slowly. Bullets fire from screen edges toward player's current position.
- **End condition**: Hit by a bullet while not shielding
- **Scoring**: +1 point per second survived (when not shielding), +10 for reflecting bullets by landing on a platform at the right moment
- **Difficulty increase**: Bullets spawn faster and move faster over time

## 2. Object Specifications

- **Player (cyan/yellow/blue)**: Small box that follows current platform or travels between them. Yellow while jumping, blue while shielding.
- **Platforms (green/cyan)**: 5 floating targets that drift randomly. Current platform is cyan and larger.
- **Bullets (red)**: Spawn from edges, travel toward player's current position
- **Reflected bullets (yellow)**: Bounce back after player lands near them

## 3. Design Guide Analysis

- **Simplicity**: Single button - tap cycles through platforms, hold shields
- **Visual Feedback**: Clear color states (blue=shielded, yellow=jumping, cyan=normal), shield bar shows remaining energy
- **Skill-Based Scoring**: Timing jumps to reflect bullets gives +10 bonus; shield stops scoring
- **Novel Mechanics**: Platform cycling combined with reflect-on-landing timing creates unique tactical decisions

## 4. Relationship with Tags

- `on_pressed-jump_into_another`: Core mechanic - hopping between platforms
- `on_holding-stop`: Shield ability freezes player and bullets but drains energy
- `weapon-interference`: Landing at the right moment reflects nearby bullets

## 5. Basis for Novelty

Combines platform-hopping with projectile reflection timing. The shield mechanic creates risk/reward - safety vs. scoring opportunity. Predictable platform cycling allows strategic positioning.

## 6. Similarity Check

Different from typical dodge games because the player cycles through fixed positions rather than free movement, and the reflect-on-land mechanic rewards precise timing rather than pure avoidance.

---

# Game Generation Report: GHOST HOP

## Selected Tags

- on_pressed-jump_into_another, on_holding-stop, weapon-interference

## Simulation Results

| Metric           | Initial | After Improvement |
| :--------------- | :------ | :---------------- |
| GA vs Monotonous | 1.0x    | 3.31x             |
| GA Best Score    | 3       | 53                |
| Monotonous Max   | 3       | 16                |

## Improvements Made

1. **Added shield energy limit**: Prevents infinite holding by draining energy when shielding
2. **Added jump cooldown**: Prevents button mashing from being optimal
3. **Made player vulnerable while jumping**: Adds risk to jumping, requiring timing
4. **Changed to predictable platform cycling**: Allows strategic planning vs random nearest-target
5. **Balanced bullet speed and spawn rate**: Made early game more survivable while still challenging
