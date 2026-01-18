# INKSUCKER (inksucker)

**Tags**: #player-paint, #on_holding-move, #on_holding-inhale

## 1. Core Mechanics

- **Input**: Hold button to thrust forward and activate suction field
- **Behavior**: Player auto-rotates constantly. Holding thrusts in current direction with inertia. Suction field pulls nearby orbs toward player.
- **End Condition**: Collision with red obstacles = Game Over
- **Scoring**: Combo system - collect orbs quickly for multiplied points (+1, +2, +3...)
- **Difficulty Increase**: Obstacles spawn faster and move quicker

## 2. Object Specifications

| Object | Shape | Color | Behavior |
|:-------|:------|:------|:---------|
| Player | box(6) | cyan | Auto-rotates, thrust on hold, inertia-based movement |
| Orbs | box(4-6) | yellow | Spawn in play area, fade over time, pulled when suctioning |
| Obstacles | box(7) | red | Spawn from top, scroll downward |
| Suction Field | arc | light_black | Visual indicator when holding |

## 3. Design Guide Analysis

- **Simplicity and Intuitiveness**: Single button controls thrust + suction
- **Visual Feedback and Game Over**: Clear collision, suction arc visible, combo counter
- **Skill-Based Scoring**: Must time thrusts to navigate and collect; combo rewards rapid collection
- **Novel Mechanics**: Inertia + auto-rotation + suction creates timing-based precision gameplay

## 4. Relationship with Tags

- `player-paint`: Collecting orbs (abstracting "painting" as territory coverage via collection)
- `on_holding-move`: Thrust movement while holding
- `on_holding-inhale`: Suction field pulls orbs while holding

## 5. Basis for Novelty

The combination of constant rotation, inertial thrust, and magnetic suction creates a unique "orbital vacuum" feel where players must predict their trajectory and time button presses precisely to scoop up orbs while avoiding obstacles.
