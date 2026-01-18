# PHASERUN (polarun)

**Tags**: #on_pressed-reverse_state, #on_pressed-select_route, #rule-shelter

## 1. Core Mechanics

**Input**: Tap to toggle between SOLID and GHOST phase

**Behavior**:
- Player is fixed at left side of screen
- Obstacles and coins scroll from right to left
- **SOLID phase**: Can collect coins, but obstacles kill you
- **GHOST phase**: Obstacles pass through harmlessly, but can't collect coins

**End Condition**: Collision with obstacle while in SOLID phase

**Scoring**: +1 point per coin collected (must be SOLID to collect)

**Difficulty Increase**: Obstacles and coins spawn faster as difficulty rises

## 2. Object Specifications

| Object | Color | Size | Behavior |
|:-------|:------|:-----|:---------|
| Player | Cyan (collision) + Blue/Light Blue (phase indicator) | 8x8 | Fixed at x=20, y=50 |
| Obstacle | Red | 10x10 | Scrolls left, kills SOLID player |
| Coin | Yellow | 6x6 | Scrolls left, collected by SOLID player |

**Collision Handling**:
- Player (SOLID) + Obstacle → `end()` (game over)
- Player (SOLID) + Coin → `addScore(1)`, remove coin
- Player (GHOST) + anything → passes through

## 3. Design Guide Analysis

| Principle | Implementation |
|:----------|:---------------|
| **Simplicity and Intuitiveness** | One button toggles phase. Clear visual feedback (solid vs translucent). |
| **Visual Feedback and Game Over** | Death is instant on obstacle collision when solid. Phase change has particle effect. |
| **Skill-Based Scoring** | Must time phase switches: GHOST to survive obstacles, SOLID to collect coins. Risk/reward tradeoff. |
| **Novel Mechanics** | Phase-shifting creates "selective collision" - choose when you're vulnerable vs when you can score. |

## 4. Relationship with Tags

- **on_pressed-reverse_state**: Button press inverts collision state (SOLID↔GHOST)
- **on_pressed-select_route**: Choosing phase is like choosing which "reality" to exist in - dangerous or safe
- **rule-shelter**: GHOST phase is effectively a "shelter" state where obstacles can't hurt you

## 5. Basis for Novelty

- **Selective vulnerability**: Unlike dodge games where you're always vulnerable, you choose when to be at risk
- **Opportunity cost**: Being safe (GHOST) means missing coins; collecting coins means risking death
- **Prediction**: Must anticipate when obstacles and coins arrive to maximize score while surviving

---

# Game Generation Report: PHASERUN

## Selected Tags

- on_pressed-reverse_state, on_pressed-select_route, rule-shelter

## Simulation Results

| Metric | Result |
|:-------|:-------|
| GA Best Score | 2 |
| Monotonous Max Score | 1 |
| GA Ratio | 2.0 |
| Evaluation | **Pass** (>1.5) |

### Pattern Analysis

| Pattern | Survival Time | Score | Analysis |
|:--------|:--------------|:------|:---------|
| NoInput | 2.47s | 1 | Stays SOLID, dies to first obstacle, may collect one coin |
| HoldOnly | 60s | 0 | Toggles to GHOST immediately, survives but can't score |
| SpamPress | 2.52s | 1 | Rapid toggling, similar to NoInput |
| **GA Best** | 5.8s | 2 | Strategic toggling: GHOST for obstacles, SOLID for coins |

## Design Evolution

1. **Initial design (POLARUN)**: Color-matching polarity system - too complex, collision detection issues with same-color objects
2. **Final design (PHASERUN)**: Simple SOLID/GHOST phase toggle - clear mechanics, reliable collision detection, satisfying risk/reward gameplay

## Key Design Decisions

- **Fixed spawn Y-position (50)**: Guarantees collision paths, removes luck element
- **Separate spawn timers**: Obstacles spawn more frequently than coins, creating tension
- **Grace period**: 90 frames before first obstacle, allowing player to understand mechanics
- **Cyan collision color**: Dedicated color for player collision detection avoids same-color issues
