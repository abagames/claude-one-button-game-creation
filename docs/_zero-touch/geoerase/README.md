# GEOERASE (geoerase)

**Tags**: #on_holding-shoot, #on_released-erase, #rule-geometry

## 1. Core Mechanics

**Input**: 
- **Hold**: Rotate a laser beam clockwise around your central position
- **Release**: Erase/destroy all enemies currently touched by the laser beam

**Behavior**: 
- Player is a fixed point at the center of the screen
- Enemies (geometric shapes: triangles, squares) spawn from edges and move toward center
- While holding, a laser line rotates around the player, "marking" enemies it touches
- On release, all marked enemies are destroyed simultaneously

**End Condition**: An enemy reaches the player (center point)

**Scoring System**: 
- Points = number of enemies erased in single release × combo multiplier
- Erasing 3+ enemies at once grants bonus points (geometric bonus)
- Consecutive multi-kills increase multiplier

**Difficulty Increase**: 
- Enemy spawn rate increases
- Enemies move faster
- Different geometric shapes worth different points

## 2. Object Specifications

| Object | Shape | Color | Behavior | Collision |
|:-------|:------|:------|:---------|:----------|
| Player | Small circle | cyan | Fixed at center | Game over if enemy touches |
| Laser | Rotating line | yellow | Rotates while held, marks enemies | Marks enemies for erase |
| Triangle Enemy | Triangle | red | Moves toward center, slow | Worth 1 point |
| Square Enemy | Box | purple | Moves toward center, fast | Worth 2 points |

## 3. Design Guide Analysis

| Principle | Evaluation |
|:----------|:-----------|
| **Simplicity and Intuitiveness** | ✅ One button: hold to aim, release to fire. Very intuitive. |
| **Visual Feedback and Game Over** | ✅ Enemies clearly approach center. Death is obvious when enemy overlaps player. |
| **Skill-Based Scoring** | ✅ Timing release to catch multiple enemies requires skill. Button mashing = low scores. |
| **Novel Mechanics** | ✅ Rotating laser + batch erase is unique. Geometry theme reinforces cohesion. |

## 4. Relationship with Tags

- **on_holding-shoot**: Holding rotates the laser beam (continuous aiming)
- **on_released-erase**: Releasing triggers simultaneous destruction of all touched enemies
- **rule-geometry**: Enemies are geometric shapes, laser creates radial sweep pattern, spatial reasoning required

## 5. Basis for Novelty

- Unlike typical shooters where you fire individual bullets, you "sweep" and "batch erase"
- The tension of waiting vs releasing creates risk/reward: wait longer = more targets, but risk getting hit
- Rotation mechanic makes positioning intuitive without movement controls
