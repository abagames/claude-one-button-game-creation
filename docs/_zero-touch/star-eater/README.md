# STAR EATER (star-eater)

**Tags**: #player-automatic, #on_holding-inhale, #weapon-explosion

## 1. Core Mechanics

**Input**: Hold to charge, release to blast

**Behavior**:
- Player automatically drifts across space with gentle sine-wave motion
- Holding button charges energy - player grows larger (visible vulnerability increase)
- Releasing button creates explosion centered on player
- Explosion radius scales with charge level (more charge = bigger blast)
- Minimum charge threshold required to trigger blast (prevents spam)
- Asteroids spawn from all directions and move across screen

**End Condition**: Player collides with asteroid (player hitbox grows while charging)

**Scoring**:
- Points for each asteroid destroyed in explosion
- Bonus multiplier for larger explosions (bigger charge = more risk = more reward)

**Difficulty Increase**:
- Asteroids spawn faster
- Asteroids move faster

## 2. Object Specifications

**Player (cyan)**:
- Shape: Circle, grows while charging
- Base size: 5px radius
- Max size: 14px radius (at full charge)
- Auto-movement: 0.2 px/frame rightward + sine wave vertical drift
- Collision: Dies on asteroid contact

**Asteroids (red)**:
- Shape: Boxes (5-9px)
- Behavior: Move from edges toward screen center
- Spawn: From all 4 edges, rate increases with difficulty
- Collision: Destroyed by explosion, kills player on contact

**Explosion (light yellow)**:
- Triggered on button release (if charge > 10)
- Radius: 15 + (charge * 0.8) pixels
- Duration: 12 frames
- Destroys all asteroids within radius

**Charge Indicator (yellow)**:
- Ring around player showing charge buildup

## 3. Design Guide Analysis

**Simplicity and Intuitiveness**: Single button with clear visual feedback - player visibly grows while charging. 3-second rule satisfied.

**Visual Feedback and Game Over**: Growing player size = obvious danger indicator. Asteroid collision is clear death.

**Skill-Based Scoring and Risk/Reward**:
- Risk: Longer charge = bigger hitbox = higher death chance
- Reward: Bigger charge = larger explosion = more points
- Cannot spam: Charge threshold prevents quick releases
- Cannot idle: Asteroids approach from all sides

**Novel Mechanics**: The direct visual feedback of "growing = vulnerable" while charging creates intuitive risk/reward tension.

## 4. Relationship with Tags

- **player-automatic**: Player drifts automatically with sine-wave motion
- **on_holding-inhale**: Holding "inhales" energy/power (represented as charge)
- **weapon-explosion**: Release creates area-of-effect explosion

## 5. Basis for Novelty

The core innovation is the visible vulnerability scaling - as you charge, you physically see yourself becoming a bigger target. This creates moment-to-moment tension where every frame of charging is a calculated risk.

## 6. Similarity Check

- **Luftrausers**: Shooting mechanics, but weapon doesn't require charging vulnerability
- **Nuclear Throne**: Explosions, but player doesn't grow vulnerable while charging
- **Ikaruga**: Charging attacks, but no hitbox size penalty

Key difference: The visible, physical growth of the player during charge creates unique tension not found in typical charge-attack systems.

---

# Game Generation Report: STAR EATER

## Selected Tags
- player-automatic, on_holding-inhale, weapon-explosion

## Simulation Results

| Metric           | Initial | After Improvement |
| :--------------- | :------ | :---------------- |
| GA Score         | 4       | 48                |
| Monotonous Max   | 0       | 0                 |
| GA Ratio         | ∞       | ∞                 |

## Improvements Made

1. **Simplified core loop**: Removed orb collection complexity in favor of direct charge mechanic
2. **Added charge threshold**: Requires charge > 10 to blast, preventing spam scoring
3. **Added charge decay**: Prevents infinite charging without commitment
4. **Multi-directional asteroids**: Asteroids from all edges create more engagement opportunities
5. **Visual charge indicator**: Yellow ring shows charge level clearly
