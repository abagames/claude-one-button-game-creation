# CLING HOP (cling-hop)

**Tags**: #on_pressed-flap, #obstacle-bounce, #player-scaffold

## Game Generation Report

### Simulation Results

| Metric | Value |
|:-------|:------|
| GA Best Score | 195 |
| Monotonous Max Score | 0 |
| GA Ratio | ∞ (Pass) |
| GA Survival Time | 6.58s |

**Evaluation**: Pass - Monotonous input (no input, hold, spam) all score 0 points, while skilled GA-optimized input achieves 195 points. The clinging mechanic requires precise timing.

---

## 1. Core Mechanics

**Input → Behavior:**
- Player automatically falls with gravity
- **Press**: Flap upward (small impulse) - used to reach and stick to platforms
- While touching a platform from below or side, player "clings" and moves with it
- Releasing from platform happens automatically when flapping

**End Condition:**
- Player falls below screen (Y > 100)
- Player collides with bouncing obstacle

**Scoring System:**
- +1 point per frame while clinging to a platform
- +10 bonus when successfully transferring between platforms
- Higher platforms give multiplier bonus

**Difficulty Increase:**
- Platforms move faster and become smaller over time
- More bouncing obstacles spawn
- Obstacles bounce faster

## 2. Object Specifications

**Player (cyan box, 5x5):**
- Falls with gravity (vy += 0.1)
- Flap gives upward impulse (vy = -2)
- Can "cling" to platforms - inherits platform velocity
- Clings when touching platform while falling (vy > 0)

**Platforms (green bars, various widths):**
- Spawn from top, move downward
- Move horizontally with sine wave pattern
- Player can cling to bottom/sides

**Bouncing Obstacles (red circles, 6x6):**
- Spawn periodically from edges
- Bounce off all screen boundaries
- Unpredictable trajectories

## 3. Design Guide Analysis

**(1) Simplicity and Intuitiveness:** Single button flaps. Clinging is automatic on contact. Visual distinction: cyan=player, green=safe platforms, red=danger.

**(2) Visual Feedback and Game Over:** Clear death conditions - fall off screen or hit red obstacle. Particle effects on scoring events.

**(3) Skill-Based Scoring:** Staying attached to platforms requires timing flaps precisely. Transferring between platforms rewards skill. Can't score by mashing (wastes flaps) or idle (falls off).

**(4) Novel Mechanics:** "Clinging" mechanic - player becomes temporarily attached to moving platforms, creating a parasite-like relationship. Must time releases and re-attachments.

## 4. Relationship with Tags

- **on_pressed-flap**: Core upward movement
- **player-scaffold**: Clinging to platforms, dependent on them for survival and scoring
- **obstacle-bounce**: Chaotic bouncing threats that force platform-hopping decisions

## 5. Basis for Novelty

The "clinging" mechanic is novel - player doesn't just land on platforms but attaches to them like a parasite, moving with them. This creates tension between staying safe (clinging) and needing to move (platforms exit screen). The bouncing obstacles add chaos that forces strategic uncoupling.
