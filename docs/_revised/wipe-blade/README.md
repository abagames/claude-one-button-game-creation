# WIPE BLADE (wipe-blade)

**Tags**: #weapon-wipe, #rule-gauge_management, #player-bar

## 1. Core Mechanics

**Input**: 
- Hold button → Charge power gauge and rotate blade
- Release button → Execute wipe attack (blade extends outward in a sweep)

**Behavior**:
- Player is a rotating bar/blade at screen center
- Holding charges a gauge (0-100%) and slowly rotates the blade
- Releasing triggers a sweeping attack - blade extends outward proportional to charge
- Higher charge = longer reach, wider arc sweep

**End Condition**: Enemy touches the center point (player core)

**Scoring**: 
- Points per enemy destroyed
- Bonus multiplier for destroying multiple enemies in one wipe

**Difficulty Increase**: 
- More enemies spawn over time
- Enemies move faster
- Some enemies require higher charge to destroy

## 2. Object Specifications

**Player Core** (center point):
- Fixed at screen center (50, 50)
- Small circle, collision = game over

**Blade** (bar):
- Rotates around center while holding
- Length = base + (charge * multiplier)
- Visual: cyan colored bar

**Power Gauge**:
- Fills while holding (0-100%)
- Displayed as bar at bottom
- Resets after attack

**Enemies**:
- Spawn from screen edges
- Move toward center
- Red colored
- Destroyed when hit by blade during wipe

**Wipe Effect**:
- Arc sweep animation on release
- Yellow/white flash effect

## 3. Design Guide Analysis

| Principle | Implementation |
|:----------|:---------------|
| Simplicity and Intuitiveness | Single button: hold to charge, release to attack |
| Visual Feedback and Game Over | Gauge visible, enemies clear on center touch |
| Skill-Based Scoring | Timing charge vs enemy approach, multi-kill combos |
| Novel Mechanics | Rotating bar + charge-release wipe mechanic |

## 4. Relationship with Tags

- **weapon-wipe**: The core attack is a sweeping wipe that clears enemies in an arc
- **rule-gauge_management**: Must manage charge gauge - too short = weak attack, too long = enemies reach center
- **player-bar**: Player is literally a bar that rotates and extends

## 5. Basis for Novelty

Combines rhythm of charge-release timing with spatial awareness of rotating blade position. Unlike typical shooters, attack direction is determined by when you release during rotation, creating a unique aiming mechanic through timing rather than pointing.
