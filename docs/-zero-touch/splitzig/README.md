# SPLITZIG (splitzig)

**Tags**: #obstacle-split, #on_pressed-turn, #obstacle-stack

## 1. Core Mechanics

**Input**: Press button to reverse horizontal movement direction (turn 180°)

**Behavior**:
- Player moves horizontally at constant speed - **hitting walls = game over**
- Player auto-fires bullets upward at regular intervals
- Blocks fall from the top of the screen
- When a bullet hits a block, it SPLITS into 2 smaller blocks moving diagonally outward
- Block sizes: Large (3 hits to destroy) → Medium (2) → Small (1)
- When smallest blocks are destroyed, debris falls and STACKS at the bottom
- Stack height gradually rises as more debris accumulates

**End Condition**: Game over when:
- Player hits a wall (must turn before reaching edge)
- Player collides with a block
- Stack height reaches the player's Y position

**Scoring**:
- Destroying Large block: 10 points
- Destroying Medium block: 20 points
- Destroying Small block: 30 points
- Bonus for destroying blocks before they fall below mid-screen

**Difficulty Increase**:
- Block spawn rate increases with `difficulty`
- Block fall speed increases with `difficulty`
- Stack rises faster as game progresses

## 2. Object Specifications

### Player
- Shape: Small cyan box (6x6)
- Position: Y = 80 (near bottom, above stack)
- Movement: Horizontal auto-movement at speed 1.5, **wall collision = death**
- Input: Press reverses direction (essential for survival!)

### Bullets
- Shape: Yellow vertical line (2x4)
- Spawned: Every 10 ticks from player position
- Movement: Upward at speed 3
- Collision: Destroys on contact with blocks

### Blocks (3 sizes)
- Large: Red box 12x12, spawns from top
- Medium: Purple box 8x8, created when large splits
- Small: Blue box 5x5, created when medium splits
- Movement: Fall downward, split blocks also move diagonally
- On bullet hit: Split into 2 smaller, or if smallest, become debris

### Debris/Stack
- Shape: Green rectangles at bottom
- Behavior: Accumulates when small blocks destroyed
- Each destroyed small block adds 2-3 pixels to stack height
- Visual: Rising green floor

## 3. Design Guide Analysis

### (1) Simplicity and Intuitiveness
- Single button: turn direction
- Clear visual hierarchy: player (cyan), bullets (yellow), enemies (red/purple/blue), stack (green)
- Rules understood through play: shoot blocks, they split, debris piles up

### (2) Visual Feedback and Game Over
- Blocks visually shrink when split (size change = progress)
- Stack rises visibly as debris accumulates
- Game over is obvious: green stack touches player
- Particle effects on block destruction

### (3) Skill-Based Scoring and Risk/Reward
- Destroying blocks quickly (before falling) = higher score potential
- Small blocks worth more but harder to hit
- Positioning matters: being under blocks is risky but efficient
- Strategic turning to intercept falling blocks

### (4) Novel Mechanics
- The combination of splitting + stacking creates escalating pressure
- Player must balance offense (shooting) with positioning (turning)
- Rising floor creates dynamic difficulty - playable area shrinks
- Unlike typical shooters, destruction has consequences (debris)

## 4. Relationship with Tags

- **obstacle-split**: Blocks split into smaller pieces when shot, creating chain-reaction chaos
- **on_pressed-turn**: Player's only control is turning - must position strategically
- **obstacle-stack**: Destroyed blocks become debris that stacks, shrinking play area

Creative tension: Destroying obstacles (good) creates stacking debris (bad), forcing player to be strategic.

## 5. Basis for Novelty

1. **Destruction has consequences**: Unlike typical shooters where destroying enemies is purely positive, here it creates stacking debris
2. **Shrinking playfield**: The rising stack creates dynamic difficulty without artificial speed increases
3. **Split-cascade pressure**: One block becomes many, creating exponential threat growth
4. **Position-based strategy**: Single-button turning forces thoughtful positioning rather than reactive movement
5. **Essential input**: Wall collision = death makes turning mandatory, not optional

---

# Game Generation Report: SPLITZIG

## Selected Tags

- obstacle-split, on_pressed-turn, obstacle-stack

## Simulation Results

| Metric           | Initial | After Improvement |
| :--------------- | :------ | :---------------- |
| NoInput Score    | 220     | 0                 |
| HoldOnly Score   | 250     | 0                 |
| SpamPress Score  | 110     | 40-90             |
| GA Best Score    | 10      | **250**           |
| GA Ratio         | 0.04    | **6.25**          |
| Evaluation       | Fail    | **Pass**          |

## Improvements Made

1. **Removed auto-bounce, made wall collision fatal**: The initial design allowed the player to bounce off walls automatically, meaning no input was needed to survive. This made idle play optimal (GA ratio = 0.04). By making wall collision end the game, the turn button became essential for survival, dramatically improving skill-based gameplay (GA ratio = 6.25).

## Design Insight

The key learning: in one-button games, the single input must be **essential**, not optional. If the game can be played effectively without pressing the button, the design fails the skill-based scoring principle.
