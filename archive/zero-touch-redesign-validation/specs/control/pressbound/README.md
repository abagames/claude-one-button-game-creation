# PRESSBOUND (pressbound)

**Tags**: #player-bounce, #field-press, #player-multiple

## 1. Core Mechanics

**Input**: Hold to charge, release to push walls back

**Behavior**:
- 3-5 balls continuously auto-bounce around the screen
- Walls from all four sides constantly press inward
- HOLD: Charges energy (but balls freeze and become more vulnerable!)
- RELEASE: Pushes walls back proportional to charge time
- Balls unfreeze and get a speed boost on release

**End Condition**: Any ball crushed by walls = Game Over

**Scoring**:
- +1 point per second survived
- Bonus points for well-timed releases (charge > 30 when walls are close)
- Difficulty increases: walls press faster over time

## 2. Object Specifications

### Balls (cyan boxes, 5px)
- Start: 3 balls near center with random velocities
- Auto-bounce: reflect off walls, maintain minimum speed
- When frozen (charging): stationary, vulnerable to crush
- On release: speed boost in current direction

### Walls (purple rectangles)
- Four walls constantly press from edges toward center
- Press speed: 0.12 + difficulty * 0.02 per frame
- Flash red when dangerously close (> 35px in)
- Maximum press: 43px (game over if reached)

### Charge Bar (top of screen)
- Green bar fills while holding
- Turns yellow when > 75% charged
- Release pushes walls back by charge * 0.5 pixels

## 3. Design Guide Analysis

### (1) Simplicity and Intuitiveness
- Simple shapes: boxes for balls, rectangles for walls
- Hold/release is immediately understandable
- Visual charge bar shows state clearly

### (2) Visual Feedback and Game Over
- Walls flash red when dangerous
- Balls flash blue/light_blue when frozen
- Crushing is visually obvious game over

### (3) Skill-Based Scoring and Risk/Reward
- Charging longer = bigger pushback BUT balls are frozen longer
- Well-timed releases near danger give bonus points
- Can't button mash (spam = 0.8s survival) or idle (no input = 4.5s survival)

### (4) Novel Mechanics
- Charge-release mechanic with frozen vulnerability
- "Press vs press" duality (walls press in, player pushes back)
- Multiple bouncing entities create spatial awareness challenge

## 4. Relationship with Tags

- **player-bounce**: Balls constantly auto-bounce, creating unpredictable patterns
- **field-press**: Walls relentlessly press inward, core threat of the game
- **player-multiple**: 3-5 balls must all survive, amplifying the challenge

The tags combine into a unique tension: bouncing creates chaos, pressing creates urgency, multiple entities require spatial awareness during the charge-freeze phase.

## 5. Basis for Novelty

- Inverting the typical "action button" - holding is risky (freeze), releasing is defensive
- The charge-pushback mechanic tied to freeze vulnerability
- Managing multiple bouncing entities with unified input
- Walls as both threat AND the thing you're fighting against

## 6. Similarity Check

- **Super Hexagon**: Walls close in but player actively dodges
- **Flappy Bird**: Charge-release timing but single entity, no pushback
- **Katamari**: Multiple objects but player collects, doesn't avoid

Key difference: The charge-freeze-release cycle where holding creates vulnerability while building defense is novel.

---

# Game Generation Report: PRESSBOUND

## Selected Tags
- player-bounce, field-press, player-multiple

## Simulation Results

| Metric           | Initial (v1) | After Improvement (v3) |
| :--------------- | :----------- | :--------------------- |
| GA Best Score    | 58           | 26                     |
| Monotonous Max   | 330          | 5                      |
| GA Ratio         | 0.18 (Fail)  | 5.2 (Pass)             |
| Evaluation       | Fail         | Pass (> 1.5)           |

## Improvements Made

1. **v1 → v2**: Changed from "hold freezes walls" to "hold freezes walls + stamina system"
   - Problem: HoldOnly still optimal (ratio 0.77)

2. **v2 → v3**: Redesigned to "charge-release pushback with frozen vulnerability"
   - Walls always press in (can't stop them)
   - Holding charges but freezes balls (makes them vulnerable)
   - Release pushes walls back proportional to charge
   - Result: GA ratio 5.2 - skilled timing rewards significantly better than monotonous input
