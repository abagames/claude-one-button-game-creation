# STORMVEIL (stormveil)

**Tags**: #field-weather, #on_pressed-turn, #weapon-smoke

## 1. Core Mechanics

- **Input**: Tap button to switch to next lane (cycles through 3 lanes)
- **Behavior**: Player stays at bottom, obstacles scroll down from top
- **Obstacles**: Red obstacles spawn in 1-2 lanes (leaving safe lanes), coins appear in safe lanes
- **Scoring**: +5 points per coin collected, +1 point per second survived
- **Game Over**: Collision with red obstacle
- **Difficulty Increase**: Scroll speed increases, eventually 2 lanes blocked instead of 1

## 2. Object Specifications

| Object | Shape | Behavior | Collision |
|:-------|:------|:---------|:----------|
| Player | cyan box (6x6) | Fixed at bottom, smoothly moves between 3 lanes on tap | Dies on obstacle contact |
| Obstacle | red box (6x6) | Scrolls down at increasing speed | Kills player on contact |
| Coin | yellow box (5x5) | Scrolls down, gives 5 points when collected | Collected on player contact |
| Lane guides | light_black lines | Shows 3 lane positions | None |

## 3. Design Guide Analysis

- **Simplicity and Intuitiveness**: Single tap cycles lanes - very simple
- **Visual Feedback and Game Over**: Red = danger, yellow = reward, instant death on collision
- **Skill-Based Scoring and Risk/Reward**: Must switch lanes strategically to collect coins while avoiding obstacles
- **Novel Mechanics**: Weather theme with lane-based avoidance, always one safe lane

## 4. Relationship with Tags

- **field-weather**: Conceptually a storm with debris falling (obstacles represent storm hazards)
- **on_pressed-turn**: Tap switches lane direction/position
- **weapon-smoke**: Abstracted - the safe lane is like visibility through the storm

## 5. Basis for Novelty

3-lane runner where pressing cycles lanes instead of left/right control. Always exactly one safe lane guarantees survivable patterns with correct timing.

## 6. Similarity Check

- **Subway Surfer / Temple Run**: Similar lane concept, but cyclic single-button lane switching is distinct
- **Rhythm games**: Similar timing requirement, but no music sync
