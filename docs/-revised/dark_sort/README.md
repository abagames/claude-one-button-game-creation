# DARK SORT (dark_sort)

**Seeds**: #rule-classify, #player-limited_vision, #obstacle-chase

## 1. Core Mechanics

- **Input**: Hold to make the moving gate light; release to make it dark.
- **Behavior**: A gate moves horizontally near the bottom. White and black orbs fall from above, but are only visible inside the gate's circular vision area.
- **End Condition**: If an orb reaches the gate while the gate color does not match the orb color, the game ends.
- **Scoring**: Correctly sorting an orb adds score equal to the current combo, then increases the combo. Missing an orb resets the combo.
- **Difficulty Increase**: Spawn intervals shorten and orb speed increases with difficulty. Later waves can spawn multiple orbs.

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| `gate.isLight` | True while holding, false while released | Gate color changes between white and black |
| `combo` | Increases on correct sort, resets on missed orb | Score reward grows after consecutive correct decisions |
| `visionRadius` | Constant | Only nearby orbs are drawn inside the visible circle |

- **Idle weakness**: The gate stays dark and fails on white orbs.
- **Hold-only weakness**: The gate stays light and fails on black orbs.
- **Mashing weakness**: Rapid switching without reading the visible orb color causes mismatches at the gate.
- **Skilled play**: Watch the limited vision window and hold only for white orbs that will intersect the gate.

## 2. Object Specifications

- **Gate**: Horizontal bar near the bottom that moves side to side and changes color with input.
- **Orbs**: Falling white or black objects. They are invisible until inside the vision radius.
- **Vision Field**: Circular reveal zone centered above the gate.

## 3. Design Principle Analysis

- **Simplicity**: The only decision is whether the gate should be light or dark.
- **Visual Feedback and Game Over**: A wrong color match at the gate is the only lethal mistake.
- **Skill-Based Scoring**: Combo rewards correct classification under limited information.
- **Novel Mechanics**: The player controls a moving classifier rather than a character.

## 4. Relationship with Seeds

- `rule-classify`: The game is entirely about matching orb color to gate state.
- `player-limited_vision`: Orbs appear only inside the vision area.
- `obstacle-chase`: Falling orbs pressure the moving gate.

## 5. Basis for Novelty

The game turns a binary button into a real-time sorting gate with incomplete information.

## 6. Similarity Check

It is closer to a timing classifier than a shooter or dodger; the player does not move directly and must read hidden information as it enters range.

