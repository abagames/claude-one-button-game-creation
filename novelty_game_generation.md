# Novel Game Automatic Generation System

## Overview

A system that leverages existing tag assets from one-button action mini-games to automatically generate novel and diverse games through novelty assurance mechanisms. By limiting similarity to existing games below 70% and enforcing cross-category tag combinations, the system continuously produces unprecedented creative works.

**Relationship with Integrated Workflow:**
- This document provides detailed specifications of the **technical foundation**
- Actual game generation uses the 6-phase process (Phase 0-5) in **`game_generation_workflow.md`**
- Refer to **`collaboration_guidelines.md`** for practical Human-LLM collaboration guidelines

### Integrated Design Approach

This system integrates **tag-based novelty assurance** with a **problem-solution framework** to generate games that LLMs can autonomously implement:

```
Phase 1: Tag Selection and Analysis
├─ Automatic selection through cross-category constraints
└─ Mechanic characteristic extraction

Phase 2: Problem-Solution Structuring
├─ Problem category selection (choose from 7 types)
├─ Problem template completion
├─ Solution design (maintain 3-second rule)
└─ One-button constraint verification

Phase 3: Novelty Assurance
├─ Exclusion filtering (clarify differentiation elements)
├─ Logical walkthrough (verify implementability)
├─ Warning sign detection (automatic defect checking)
└─ Similarity check (<70%)

Phase 4: Implementation and Verification
├─ Visual communication design
├─ Code implementation (Crisp Game Library compliant)
└─ Balance adjustment (co-evolutionary system)
```

**Critical Design Principles**:
- **3-Second Rule**: Players must understand mechanics within 3 seconds
- **One-Button Constraint**: Achievable only with Press/Hold/Release
- **Novelty Assurance**: Similarity <70%, code reuse rate ≤30%
- **Implementability**: Guaranteed by logical walkthrough and warning sign detection

## Novelty Assurance Architecture

### 3-Phase Generation Process

#### Phase 1: Mechanic Analysis

- **Purpose**: Extract core motion patterns, state variables, and interactions from provided tags
- **Output**: Mechanic summary table per tag, list of dominant patterns in existing games
- **Constraint**: Explicitly prohibit direct reuse of existing patterns

#### Phase 2: Exclusion Filtering

- **Purpose**: Clarify differentiation elements from existing games
- **Exclusion Targets**: Victory conditions, control schemes, visual representations, game loop structures
- **Constraint**: Code reuse rate ≤30%, prohibit reuse of function/variable names

#### Phase 3: Creative Synthesis

- **Purpose**: Completely new victory/defeat conditions and surprising mechanic fusion
- **Required Elements**: Cross-category combinations (player+field+weapon+rule)
- **Verification**: Automatic similarity check, balance constraint confirmation

### Cross-Category Enforced Selection System

#### Mandatory Selection from Core Categories

- **player**: 15 tags (motion_control, shape_modifier, perception_modifier, etc.)
- **field**: 20 tags (hazard_zone, physics_modifier, dimension_constraint, etc.)
- **weapon**: 15 tags (projectile_physics, area_effect, target_tracking, etc.)
- **rule**: 18 tags (simulation_core, pattern_recognition, temporal_constraint, etc.)

#### Diversity Constraints

- **Minimum category count**: 3 or more categories
- **Dominance prevention**: Single category must not exceed 50% of total
- **Complexity balance**: Must mix minimal/low/medium levels

## Similarity Check Feature

### Multi-faceted Similarity Analysis

- **Tag Overlap**: Jaccard similarity for tag set comparison with existing games
- **Mechanic Overlap**: Commonality of action keywords (jump, shoot, rotate, etc.)
- **Victory Condition Similarity**: Text analysis of goal setting proximity
- **Control Scheme Similarity**: Input pattern and player control similarity

### Automatic Judgment Criteria

- **>70%**: Immediately rejected, regeneration required
- **40-70%**: Caution level, additional unique elements recommended
- **<40%**: Acceptable, novelty confirmed

### Existing Game Database

Analyzes metadata of 159 existing games (`reference/games/*.js` + `reference/games.csv`). When new games are added, regenerates derived data (`knowledge/games/<slug>.md` and `knowledge/tag_code_map.json`) with `scripts/generate_metadata.js`.

## Implementation Workflow

### 1. Tag Selection Automation

```bash
# Automatic selection based on category constraints
npm run generate-constraints

# Example result:
# player:multiple + field:roughness + weapon:explosion + rule:physics + obstacle:penalty
# → 5 categories, 40% dominance rate, good complexity balance
```

### 2. Tag Context Generation (Optional)

Collects implementation examples of selected tags. Can reference snippets if they exist, but not required.

```bash
# Collect tag snippets (retrieves only existing snippets)
npm run fetch-tag-snippets -- --tags "player:multiple,field:roughness,weapon:explosion"
# → Generates integrated context in tmp/agent_context/agent_context.md
# → Skips if snippets don't exist, errors displayed but processing continues
```

**Note**: Game generation is possible even when snippet files are insufficient. Ignore error messages and proceed to the next step.

### 3. Game Design and Implementation

#### 3-1. Game Concept Design

Design by integrating the 3-phase process (analysis→exclusion→creation) with the problem-solution framework:

##### Step 1: Tag-Based Mechanic Analysis (Phase 1)

**Purpose**: Extract core motion patterns, state variables, and interactions from selected tags

```markdown
Mechanic Analysis per Tag:
- player:multiple → Simultaneous control of multiple objects, individual state management
- field:gravity → Attraction to center, force variation by distance
- weapon:explosion → Area effect, timing element

Dominant Patterns in Existing Games (to avoid):
- Existing games with "gravity" tag → Use attraction to collect
- Existing games with "explosion" tag → Attack method to defeat enemies
```

##### Step 2: Problem Category Selection

Select one appropriate problem category based on tag characteristics:

```markdown
PROBLEM CATEGORIES:
□ Movement/Navigation: Cannot reach destination due to obstacles or constraints
□ Resource/Collection: Resource collection/use inefficient due to constraints
□ Timing/Coordination: Synchronization with dynamic elements difficult due to restrictions
□ Information/Visibility: Cannot perceive important information due to occlusion
□ State/Balance: Maintain beneficial state while avoiding harmful state
□ Physics/Forces: Cannot directly control forces due to physical laws
□ Pattern/Signal: Pattern recognition/generation/transmission difficult due to interference
```

**Selection Example**: player:multiple + field:gravity + weapon:explosion
→ Select **Physics/Forces** (dealing with gravitational physical force)

##### Step 3: Problem Template Completion

```markdown
SELECTED TAGS: [Tags analyzed in Step 1]
SELECTED CATEGORY: [Category selected in Step 2]

Player wants to: [Specific goal - considering tag context]
Current obstacle: [What prevents the goal - derived from tags]
Environmental constraint: [Why normal methods don't work - one-button constraint]

Example:
Player wants to: Place multiple objects in safe zones
Current obstacle: Gravity pulls them toward center
Environmental constraint: Cannot control individually (one-button only)
```

##### Step 4: Solution Design (Add Light Improvement)

**3-Second Rule**: Players must understand mechanics within 3 seconds

```markdown
STAGE 1: BASELINE VERB IDENTIFICATION
- Identify basic verb expected from tags
- REVERSE CHECK: "Can this verb solve [obstacle] to achieve [goal]?"

BASELINE VERB CANDIDATES:
- Basic: Push, pull, rotate, stop, launch, release, activate, charge, time
- Simple variations: Hold to charge, tap to release, time the action

Example: explosion → "Tap to explode" (baseline verb)

STAGE 2: LIGHT IMPROVEMENT (maintain 3-second rule)
- Add only one simple twist to baseline verb
- Example: "Tap to explode" → "Hold to charge explosion radius"

STAGE 3: ONE-BUTTON COMPATIBILITY CHECK
□ Achievable with Press/Hold/Release only?
□ No hidden position selection or directional input?
□ Satisfies 3-second rule?
```

##### Step 5: Exclusion Filtering (Phase 2)

**Purpose**: Clarify differentiation elements from existing games

```markdown
Explicit Exclusion Targets:
□ Victory Condition: Not existing "collect using attraction" but "push back with explosion"
□ Control Scheme: Not existing "continuous explosion" but "charged timing explosion"
□ Visual Representation: Not existing "attack effect" but "defensive push-back"
□ Game Loop: Not existing "enemy defeat" but "placement optimization"

Constraints:
- Code reuse rate ≤30%
- Prohibit reuse of function/variable names
```

##### Step 6: Logical Walkthrough (Implementability Verification)

**Purpose**: Verify design is actually achievable with one-button

```markdown
WALKTHROUGH REQUIREMENTS:
□ Describe action sequence using Press/Hold/Release only
□ Verify each action logically connects to next state
□ Verify goal achievement is logically possible
□ Verify no "impossible actions" included

EXAMPLE WALKTHROUGH:
Start: Multiple objects being pulled by central gravity
Action 1: Player holds → Explosion charges (visual feedback)
Result 1: Charge indicator expands visually
Action 2: Player releases → Explosion executes with timing
Result 2: Objects pushed outward
Action 3: Player waits → Gravity pulls again
Result 3: If timing correct, successfully placed in safe zone
End: All objects placed in safe zones, goal achieved

VALIDATION CHECK:
□ Every action uses only press/hold/release? ✅
□ Goal logically achievable? ✅
□ No directional input required? ✅
□ No position selection required? ✅
□ Problem-solution logic maintained? ✅
```

##### Step 7: Warning Sign Detection (Automatic Defect Check)

```markdown
🚫 RED FLAGS - Redesign if detected:

One-Button Constraint Violations:
□ Description includes "player chooses", "player aims", "player selects"
□ Requires position selection beyond press/hold/release timing
□ Multiple control schemes or input modes needed

Problem Definition Issues:
□ Abstract expressions ("use," "utilize") cannot be concretized
□ Forces/actions needed for goal achievement don't exist in described system
□ Phenomena violating physics laws occur without basis

Gameplay Depth Issues:
□ Player can clear by ignoring one mechanic entirely
□ Game reduces to simple parameter optimization (hold time only)
□ Only one strategy exists for success

If ANY detected → Return to Step 3 or Step 4 for redesign
```

##### Step 8: Creative Synthesis (Phase 3)

**Purpose**: Completely new victory/defeat conditions and surprising mechanic fusion

```markdown
Required Elements:
□ Utilize cross-category combination (player+field+weapon+rule)
□ Reflect differentiation elements specified in Step 5
□ Step 6 walkthrough logically valid
□ Step 7 warning signs absent

Creative Direction:
- Light Innovation: [One simple twist]
- Physical Concept: [Inspiration from real physical phenomena]
- Engagement Factor: [Why more interesting than baseline verb]

Example:
- Light Innovation: Explosion radius varies with charge time
- Physical Concept: Push-back by explosion shockwave
- Engagement Factor: Timing judgment and risk management elements
```

Reference Prompt: `knowledge/prompts/main_v2_novelty.md`

#### 3-2. Visual Communication Design

Before implementation, clarify methods of information transmission to player:

```markdown
## Visual Communication Specification

### Problem Indication
- How: [Method for player to recognize the challenge]
- Example: Highlight safe zones, display dangerous center area in red

### Solution Availability
- How: [Method to show when/where player should act]
- Example: Blink button icon when chargeable, audio cue at optimal timing

### Action Feedback
- Press: [Immediate reaction when button pressed]
- Hold: [Visualization of parameter change during hold]
- Release: [Action execution expression on release]
- Example:
  - Press: Charge effect starts
  - Hold: Explosion radius circle expands (color changes)
  - Release: Explosion animation + shockwave

### Progress Indicators
- How: [Method to track goal achievement progress]
- Example: Display number of objects placed in safe zone / total

### Failure Warning
- How: [Method to show early signs of failure]
- Example: Objects blink in warning color as they approach center, play danger sound
```

#### 3-3. Game Code Implementation

Create game code compliant with Crisp Game Library and save to `tmp/games/<slug>.js`.

**Required Elements**:
- 2-space indent, trailing semicolons
- Global variables: `title`, `description`, `options`, `update()`
- All balance adjustment target parameters declared as `const UPPER_SNAKE_CASE = value;` format
- Implement visual communication specification (defined in 3-2) in code
- See `knowledge/crisp-game-lib-guide.md` for details

#### 3-4. Game Proposal JSON Creation

Describe game information in JSON format for similarity check:

```bash
# Create tmp/prototypes/<slug>/proposed_game.json
mkdir -p tmp/prototypes/<slug>
cat > tmp/prototypes/<slug>/proposed_game.json <<'EOF'
{
  "slug": "outpost_shield",
  "title": "OUTPOST SHIELD",
  "description": "Defend central outpost from sliding meteors using rotating bar shields and explosions",
  "tags": ["player:multiple", "player:bar", "field:slide", "field:outpost", "weapon:explosion", "rule:physics", "rule:shrink"],
  "mechanics": ["rotation", "explosion", "physics", "shrink"],
  "victoryCondition": "Survive by protecting the central outpost from meteor collisions"
}
EOF
```

**JSON Format**:
- `slug`: Game slug name (lowercase + underscores)
- `title`: Game title
- `description`: Concise game description
- `tags`: List of used tags
- `mechanics`: Key mechanic keywords
- `victoryCondition`: Victory condition description

### 4. Similarity Verification and Approval

```bash
# Automatic similarity check
npm run similarity-check -- tmp/prototypes/<slug>/proposed_game.json

# Example result:
{
  "overallVerdict": "ACCEPTED",
  "maxSimilarity": 0.32,
  "recommendations": ["ACCEPT: Game shows good novelty"]
}
```

**Judgment Criteria**:
- **>70%**: ❌ Immediately rejected, game redesign required
- **40-70%**: ⚠️ Caution level, additional unique elements recommended
- **<40%**: ✅ Acceptable, proceed to next step

If similarity is high, return to Step 3 to redesign the concept.

### 5. Prototyping and Verification

#### 5-1. Prototype Directory Creation

**Method A (Recommended)**: Auto-generate with scaffold command

```bash
# Auto-generate prototype structure with scaffold
npm run scaffold -- --slug <slug> --tags "player:multiple,player:bar,field:slide,field:outpost,weapon:explosion,rule:physics,rule:shrink" --novelty-check

# Generated files:
# - tmp/prototypes/<slug>/game.js (template - needs overwrite)
# - tmp/prototypes/<slug>/context.md (tag info - required input for novelty evaluation)
# - tmp/prototypes/<slug>/verify_report.md (verification results)
```

**Method B (Manual)**: When scaffold is unavailable

```bash
# Manually create directory and files
mkdir -p tmp/prototypes/<slug>
cp tmp/games/<slug>.js tmp/prototypes/<slug>/game.js

# ⚠️ Important: Must create context.md (required input for novelty evaluation)
cat > tmp/prototypes/<slug>/context.md <<'EOF'
# Game Context: <slug>

- Tags: player:multiple, player:bar, field:slide, field:outpost, weapon:explosion, rule:physics, rule:shrink
- Categories: player, field, weapon, rule
- Generated: 2025-10-14
- Description: Brief game description
EOF
```

**⚠️ Important**: If `context.md` doesn't exist, novelty metrics will score 0, and Overall Novelty will not meet threshold (0.5).

#### 5-2. Verification Execution

```bash
# Verify with novelty metrics
npm run verify-prototype -- --slug <slug> --mode full

# GA-optimized input pattern evaluation (vulnerability diagnosis)
npm run verify-prototype -- --slug <slug> --mode ga
```

**Note**:

- `--mode full` includes lint + sim (monotonic input) + novelty metrics calculation.
- `--mode ga` executes lint + sim-ga (GA-optimized input) for vulnerability diagnosis.
- Comprehensive evaluation recommends running both modes. See `game_evaluation_system.md` for details.

### 5. Balance Adjustment

If vulnerabilities are detected in GA diagnosis (step 4), or target metrics (score/play time) are not met, perform balance adjustment.

**Parameter Injection Requirements** (prerequisites to satisfy during generation):

- Declare all balance adjustment target parameters (gravity, speed, interval, timeout, etc.) with `const` in global scope
- Use `UPPER_SNAKE_CASE` naming convention (e.g., `PLAYER_GRAVITY`, `MISSILE_INTERVAL`)
- Don't embed literal values directly in `update()` or initialization objects
- Constantize arguments of `vec()` and `rnd()` calls

```bash
# Parameter extraction
npm run extract-balance-params -- --slug <slug>

# Balance adjustment through co-evolution
npm run balance-game -- --slug <slug> --target-score 100 --target-time 45

# Re-verification after adjustment (required)
npm run verify-prototype -- --slug <slug> --mode ga
```

See Phase 5 in `CLAUDE.md`, "Automatic Balance Adjustment System" section in `game_evaluation_system.md`, and "Balance Parameter Guidelines" in `knowledge/crisp-game-lib-guide.md` for details.

## Success Metrics

### Novelty Indicators (Automatically Calculated)

- **Tag Novelty Ratio**: Novel combination tag pairs / total tag pairs (threshold: 0.3)
- **Mechanical Coherence**: Compatibility score between tags (threshold: 0.7)
- **Estimated Code Originality**: Identifier-based code similarity estimation (threshold: 0.7)
- **Overall Novelty**: Average of above 3 indicators (threshold: 0.5)

### Indicators Requiring LLM Judgment

- **Code Originality Rate (Qualitative Evaluation)**: Creativity evaluation of implementation patterns
- **Game Concept Novelty**: Novelty of game concept
- **Mechanic Fusion Surprise**: Unexpectedness of mechanic fusion

## Reference Files

### Design & Prompts

- Prompt: `knowledge/prompts/main_v2_novelty.md`
- Constraint settings: `knowledge/prompts/cross_category_constraints.md`
- Tag classification: `knowledge/tag_categories_enhanced.csv` (used for cross-category constraints, complexity balance, compatibility score calculation)

### Implementation Scripts

- Similarity judgment: `scripts/similarity_checker.js` (implemented)
- Constraint generation: `scripts/generate_cross_category_constraints.js` (implemented)
- Novelty metrics: `scripts/calculate_novelty_metrics.js` (implemented)
- Scaffold: `scripts/scaffold.js` (supports --novelty-check)
- Verification: `scripts/verify_prototype.js` (full mode integrates novelty metrics)
