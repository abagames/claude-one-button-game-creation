# MISSILE GUIDE (missile_guide)

**Tags**: #on_holding-stop, #rule-control_weapons, #field-outpost

## 1. Core Mechanics

- **Input**: Hold button to freeze missile in place; release to resume movement
- **Behavior**: Missile auto-scrolls upward and slightly homes toward nearest target. When frozen, missile is invulnerable but consumes fuel and cannot collect targets
- **End Condition**: Collision with obstacle while moving, or fuel runs out
- **Scoring**: +1 base for each outpost, bonus for consecutive hits (combo/3)
- **Difficulty Increase**: Faster scroll, smaller gaps in obstacles, more frequent spawns

## 2. Object Specifications

| Object | Shape | Color | Behavior |
|:-------|:------|:------|:---------|
| Missile | Small box | Cyan | Moves up with slight homing; freezes when held (shows arc) |
| Outpost | Box | Yellow | Scroll down; collect for points and fuel refill |
| Obstacle | Horizontal bars with gap | Red | Scroll down; must navigate through gap |
| Fuel bar | Thin rectangle | Gray | Depletes while frozen, refills when moving/collecting |

## 3. Design Guide Analysis

- **Simplicity and Intuitiveness**: Single hold/release mechanic is immediately clear
- **Visual Feedback and Game Over**: Missile with arc effect when frozen; explosion on death
- **Skill-Based Scoring**: Timing freezes to avoid obstacles while collecting targets; fuel management
- **Novel Mechanics**: Freezing costs fuel, collecting refills it - creates risk/reward decisions

## 4. Relationship with Tags

- **on_holding-stop**: Hold freezes the missile completely
- **rule-control_weapons**: You control the missile/weapon, not a character
- **field-outpost**: Outposts are targets to reach and collect for points

## 5. Basis for Novelty

Fuel-based freeze system where freezing is safe but costly. Players must balance freezing to avoid obstacles vs. staying mobile to collect targets and refuel.

---

# Game Generation Report: MISSILE GUIDE

## Selected Tags

- on_holding-stop, rule-control_weapons, field-outpost

## Simulation Results

| Metric | Final |
|:-------|:------|
| GA Score | 14 |
| Monotonous Max | 5 |
| GA Ratio | 2.8 |
| Evaluation | Pass (>1.5) |

## Key Design Decisions

1. **Fuel mechanic**: Freezing consumes fuel, collecting targets refills it - prevents hold-only strategy
2. **Combo system**: Consecutive hits score more, missing resets combo - rewards active play
3. **Aligned gaps**: Obstacle gaps spawn near recent outpost positions - creates learnable patterns
4. **Weak homing**: Missile homes slowly, requiring player positioning decisions
