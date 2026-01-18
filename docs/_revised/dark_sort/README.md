# DARK SORT (dark_sort)

**Tags**: #rule-classify, #player-limited_vision, #obstacle-chase

## 1. Core Mechanics

**Input**: Hold button to open "light gate" (white), release to close it (switch to dark gate/black)

**Behavior**: 
- Player controls a gate at the bottom center of screen
- Falling objects come in two types: white orbs and black orbs
- The gate has two states: LIGHT (white, when holding) and DARK (black, when released)
- White orbs must pass through the light gate, black orbs through the dark gate
- A chaser enemy pursues orbs - if it catches one before it reaches the gate, game over

**Scoring**: +1 point for each correctly sorted orb. Wrong color = game over.

**Difficulty Increase**: More orbs spawn faster, chaser becomes quicker.

## 2. Object Specifications

| Object | Shape | Color | Behavior |
|:-------|:------|:------|:---------|
| Gate | rect 30x6 | white/black | Bottom center, toggles with input |
| White Orb | circle r=5 | white | Falls down, must match light gate |
| Black Orb | circle r=5 | black | Falls down, must match dark gate |
| Chaser | box 8x8 | red | Pursues nearest orb, destroys on contact |
| Vision Mask | overlay | transparent/dark | Only area around gate is visible |

## 3. Design Guide Analysis

- **Simplicity**: One button toggles gate state - intuitive
- **Visual Feedback**: Clear color matching, instant game over on mismatch
- **Skill-Based**: Must read falling pattern, time gate switches, manage chaser threat
- **Risk/Reward**: Holding for white orbs leaves you vulnerable if black orb approaches

## 4. Relationship with Tags

- **rule-classify**: Core mechanic of sorting white/black orbs through matching gates
- **player-limited_vision**: Spotlight around gate, can't see full screen
- **obstacle-chase**: Chaser enemy adds pressure, must sort before it catches orbs

## 5. Basis for Novelty

The combination of a binary gate-switching mechanic with limited vision creates tension - you must anticipate what's coming from the darkness while managing the immediate sorting task. The chaser adds urgency beyond just accuracy.
