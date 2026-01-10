# Game Generation Workflow (Integrated Version)

## Overview

This document defines a practical workflow that integrates technical automation with human-LLM collaboration in tag-based automated game generation.

**Core Principles of Integration:**

- Maximize technical automation (novelty assurance, quality evaluation, balance adjustment)
- Focus human intervention on strategic points (creative judgment, experience evaluation)
- Efficient feedback loops (70% LLM autonomy / 30% human validation)
- Clear completion criteria and gate management at each phase

**Prerequisite Knowledge:**

- This workflow is built upon the technical foundations of `novelty_game_generation.md` (novelty assurance mechanisms) and `game_evaluation_system.md` (quality evaluation system)
- Design philosophy inherits the collaborative approach from `one-button-game-design-guide.md` and `one-button-game-implementation-guide.md`
- Implementation conforms to the API reference in `crisp-game-lib-guide.md`

## Basic Flow Overview

```
Phase 0: Tag Selection and Initial Validation (10 min)
  ↓ ✅ Tag Approval
Phase 1: Problem-Solution Structuring (15 min)
  ↓ ✅ Logic Verification
Phase 2: Creative Synthesis and Novelty Assurance (15 min)
  ↓ ✅ Creativity Confirmation
Phase 3: Implementation and Prototyping (20-30 min)
  ↓ ✅ Basic Functionality Confirmation
Phase 4: Validation and Balance Adjustment (30-45 min)
  ↓ ✅ Balance Approval
Phase 5: Final Validation and Completion Approval (10 min)
  ↓ ✅ Final Approval
Completion & Metrics Recording
```

**Estimated Time:** 100-125 minutes (1.5-2 hours)
**Actual Human Work:** Approximately 30 minutes (feedback and judgment only)

---

## Universal Execution Protocol (Common to All Phases)

All phases follow this protocol:

### Basic Cycle

```markdown
【Standard Flow for Each Phase】

1. 🤖 LLM AUTO-EXECUTE: Execute automated processing → Present results
2. 🤝 HUMAN CHECKPOINT: Provide feedback (using templates)
3. 🤖 LLM AUTO-ADJUST: Execute adjustments (as needed)
4. ✅ COMPLETION CHECK: Verify completion criteria → Next phase or iterate

【Iteration Conditions】

- Repeat Steps 2-4 until completion criteria are met
- Do not proceed until human explicitly says "proceed"
```

### Prohibited and Required Actions

```markdown
🚫 FORBIDDEN:

- Presenting multiple options ("Which is better, Option A or B?")
- Implementation with assumptions (leaving ambiguities unresolved)
- Proceeding without feedback (skipping validation)
- Moving to next phase before meeting completion criteria

✅ REQUIRED:

- Ask one clear question at a time when ambiguity detected
- Single implementation → Test → Feedback → Adjustment cycle
- Do not proceed until completion criteria are met
- Obtain human approval at all Checkpoints
```

---

## Question Management System (Applied to All Phases)

Defines how to respond when ambiguity is detected.

### Level 1: Blocker Question (Critical unknown that stops implementation)

```markdown
【Response Procedure】

1. 🤖 Immediately halt implementation
2. 🤖 Present one clear question
   - Yes/No format or specific options
   - Attach brief background information
3. 🤝 Wait for human response
4. 🤖 Continue implementation after receiving answer

【Good Example】
"Confirmation: When colliding with enemies, does the game immediately end?
Or does health decrease?
(This decision affects the game loop design)"

【Bad Example】
"Please tell me details about enemy behavior" (scope too broad)
```

### Level 2: Assumption Clarification (When assumption is needed)

```markdown
【Response Procedure】

1. 🤖 Explicitly state "Assumption: [specific content]"
2. 🤖 Explain reason for assumption
3. 🤝 Wait for human approval
4. 🤖 After approval, implement and record assumption in code comments

【Example】
"Assumption: When reaching screen edge, player warps to opposite side

Reason: Tag 'field:wrap' is selected, which is a typical implementation pattern.
May I proceed with implementation based on this assumption?"
```

### Level 3: Parameter Question (Resolvable through feedback)

```markdown
【Response Policy】

- Do not ask about parameter values (speed, timing, etc.) before implementing
- Implement with standard values → Present → Collect feedback
- Wait for specific adjustment instructions based on human experience

【Good Flow】
🤖 "Implemented with MOVE_SPEED = 1.0. Please test"
🤝 "Movement is too slow"
🤖 "Adjusting MOVE_SPEED to 1.5"

【Bad Flow】
🤖 "Which MOVE_SPEED would be better: 0.5, 1.0, or 1.5?"
```

---

## Phase 0: Tag Selection and Initial Validation

**Purpose:** Auto-select high-novelty tag combinations and obtain human approval
**Estimated Time:** 10 minutes
**Main Processing:** Cross-category constraints, novelty score calculation, initial validity check

### 🤖 LLM AUTO-EXECUTE

```bash
# Automatic selection via cross-category constraints
npm run generate-constraints

# Example output:
# player:multiple + field:roughness + weapon:explosion + rule:physics + obstacle:penalty
# → 5 categories, 40% dominance rate, good complexity balance
```

**Automated Processing Content:**

1. Execute `scripts/generate_cross_category_constraints.js`
2. Validate cross-category constraints:
   - Minimum categories: 3 or more categories
   - Dominance prevention: Single category exceeding 50% prohibited
   - Complexity balance: Mix of minimal/low/medium levels
3. Calculate novelty score for tag combinations (using `knowledge/tag_categories_enhanced.csv`)
4. Format constraint violation check results

**Presentation Format:**

```markdown
【Selection Results】

- Tags: player:multiple, field:roughness, weapon:explosion, rule:physics, obstacle:penalty
- Categories: 5 (player, field, weapon, rule, obstacle)
- Dominance rate: player 20%, field 20%, weapon 20%, rule 20%, obstacle 20%
- Complexity balance: medium 60%, low 40%
- Novelty score: 0.78 (tag pair novelty rate)

【Constraint Check】
✅ Minimum categories: 5 >= 3
✅ Dominance prevention: max 20% <= 50%
✅ Complexity balance: medium + low mix
```

### 🤝 HUMAN CHECKPOINT

**Feedback Collection Questions:**

```markdown
Please verify the validity of the selected tag combination:

1. Is this tag combination attractive?

   - Are there interesting interactions you can imagine?
   - Are there any awkward combinations?

2. Is the category balance appropriate?

   - Do you feel any categories are insufficient/excessive?

3. What problem category is anticipated from these tags?
   - Movement/Navigation
   - Resource/Collection
   - Timing/Coordination
   - Information/Visibility
   - State/Balance
   - Physics/Forces
   - Pattern/Signal

【Response Options】
✅ "Approved, proceed" + indicate anticipated problem category
🔄 "Change tag X to tag Y" → Re-select
❌ "Overall lacking appeal" → Complete re-selection
```

**Expected Human Response:**

- If approved: "Approved. Physics/Forces problem anticipated"
- If change: "Change weapon:explosion to weapon:beam"
- If rejected: "Combination is mediocre. Re-select"

### ✅ COMPLETION CRITERIA

```markdown
□ Tag selection script execution completed
□ No constraint violations (category count, dominance rate, complexity balance)
□ Human approval obtained
□ Anticipated problem category identified (human indicated or LLM proposed)

→ If all met, proceed to Phase 1
```

---

## Phase 1: Problem-Solution Structuring

**Purpose:** Design clear problem-solution pair from tag characteristics and verify logic
**Estimated Time:** 15 minutes
**Main Processing:** Problem category selection, template completion, simple verb design, logic verification

### 🤖 LLM AUTO-EXECUTE

**Step 1: Tag Characteristics Analysis and Problem Category Selection**

```markdown
【Tag Mechanics Analysis】
Extract core behavior patterns from tags selected in Phase 0:

Example: player:multiple, field:gravity, weapon:explosion

- player:multiple → Simultaneous control of multiple objects, individual state management
- field:gravity → Gravitational pull toward center, force changes with distance
- weapon:explosion → Area effect, timing element

【Problem Category Selection】
Select one optimal category based on category anticipated by human in Phase 0, or from tag characteristics:

Selection: Physics/Forces
Reason: Dealing with physical force of gravity from field:gravity is the central challenge
```

**Step 2: Problem Template Completion**

```markdown
SELECTED TAGS: player:multiple, field:gravity, weapon:explosion
SELECTED CATEGORY: Physics/Forces

Player wants to: Place multiple objects in safe zones
Current obstacle: Gravity pulls them toward center
Environmental constraint: Cannot control individually (one button only)
```

**Step 3: Baseline Verb Identification + Light Improvement**

```markdown
STAGE 1: BASELINE VERB IDENTIFICATION

- Basic verb candidates: Push, Explode, Repel
- REVERSE CHECK: "Can this verb solve [obstacle] to achieve [goal]?"
  → "Explode" can push back against gravity ✅

BASELINE VERB: "Tap to explode"

STAGE 2: LIGHT IMPROVEMENT (Maintain 3-second rule)

- Add one simple refinement: Explosion radius changes with charge time
- Improved verb: "Hold to charge explosion radius"

STAGE 3: ONE-BUTTON COMPATIBILITY CHECK
□ Achievable with Press/Hold/Release only? ✅
□ No hidden position selection or directional input? ✅
□ Satisfies 3-second rule? ✅
```

**Step 4: One-Button Control Design**

```markdown
CONTROL DESIGN:

- Press (Tap): Execute small-scale explosion immediately
- Hold (1-3 sec): Explosion radius charges (visual indicator)
- Release (after hold): Execute explosion with charged radius

VALIDATION:
□ Achievable with one button only? ✅
□ No position selection needed? ✅ (explosion is omnidirectional from center)
□ Player can achieve goal? ✅ (push out with timed explosion)
```

### 🤝 HUMAN CHECKPOINT

**Feedback Collection Questions:**

```markdown
Please verify the validity of the problem-solution logic:

【Problem Definition】

- Player wants to: Place multiple objects in safe zones
- Current obstacle: Gravity pulls them toward center
- Environmental constraint: Cannot control individually (one button only)

Is this problem definition clear and attractive?

【Solution】

- Baseline verb: "Tap to explode"
- Light improvement: "Hold to charge explosion radius"
- Control: Press=small explosion, Hold=charge, Release=large explosion

Is this solution intuitive? Can it be understood within 3 seconds?

【Logic Chain】
Problem (pulled by gravity)
↓
Solution (push back with explosion, adjust timing with charge)
↓
Goal (place in safe zones)

Is this logical flow natural? Any contradictions?

【Response Options】
✅ "Approved, logical and interesting"
🔄 "Adjust problem definition: [specific suggestion]"
🔄 "Adjust solution: [specific suggestion]"
❌ "Fundamental contradiction: [reason]" → Redesign Phase 1
```

**Ambiguity Detection:**

If LLM detects unclear points:

```markdown
🤖 Question (Level 1 Blocker):
"Confirmation: Are safe zones fixed positions on screen?
Or do they move dynamically?
(This decision affects explosion timing design)"

🤝 Human Answer:
"Fixed positions"

🤖 Acknowledgment:
"Understood. Will proceed with design as fixed-position safe zones"
```

### ✅ COMPLETION CRITERIA

```markdown
□ Problem category selection completed
□ Problem template completed (Player wants to / Obstacle / Constraint)
□ Baseline verb + Light improvement design completed
□ One-button compatibility verified (Press/Hold/Release)
□ Human logic confirmation obtained
□ All ambiguities resolved

→ If all met, proceed to Phase 2
```

---

## Phase 2: Creative Synthesis and Novelty Assurance

**Purpose:** Clarify differentiation from existing games and verify implementation feasibility
**Estimated Time:** 15 minutes
**Main Processing:** Exclusion filtering, logical walkthrough, warning sign detection, visual communication design

### 🤖 LLM AUTO-EXECUTE

**Step 5: Exclusion Filtering (Clarification of Differentiation Elements)**

```markdown
【Analysis of Dominant Patterns in Existing Games】
Research existing implementations of corresponding tags from `knowledge/tag_code_map.json` and `knowledge/games/`:

Example: Existing games with "gravity" tag → Use attraction to collect
Example: Existing games with "explosion" tag → Attack means to defeat enemies

【Explicit Exclusion Targets】
□ Victory condition: "Push back with explosions" instead of existing "collect using attraction"
□ Control method: "Charge-based timed explosion" instead of existing "continuous explosions"
□ Visual representation: "Defensive pushing back" instead of existing "attack effects"
□ Game loop: "Placement optimization" instead of existing "enemy elimination"

【Code Reuse Constraints】

- Code reuse rate: 30% or less
- Prohibited to reuse function/variable names
- Prohibited to directly reuse existing victory condition logic
```

**Step 6: Logical Walkthrough (Implementation Feasibility Verification)**

```markdown
WALKTHROUGH SEQUENCE:

Start: Multiple objects being pulled by gravity toward center
↓
Action 1: Player presses button (Tap)
Result 1: Small explosion executed
Feedback 1: Explosion effect, objects move slightly outward
↓
Action 2: Player holds button
Result 2: Charge indicator displayed enlarging
Feedback 2: Charge range visually expands, charge sound
↓
Action 3: Player releases button
Result 3: Explosion executed with charged range
Feedback 3: Large explosion effect, objects pushed out significantly
↓
Action 4: Player waits
Result 4: Gravity pulls objects toward center again
Feedback 4: Objects move toward center
↓
Action 5: Player times explosion correctly
Result 5: Objects reach safe zones
Feedback 5: Score added, achievement sound, visual effect
↓
End: Goal achieved with all objects placed in safe zones

VALIDATION CHECK:
□ Every action uses only press/hold/release? ✅
□ Goal logically achievable? ✅
□ No directional input required? ✅
□ No position selection required? ✅
□ Problem-solution logic maintained? ✅
```

**Step 7: Warning Sign Detection (Automatic Defect Check)**

```markdown
🚫 RED FLAGS CHECK:

【One-Button Constraint Violations】
□ Description includes "player chooses", "player aims", "player selects"? ❌
□ Requires position selection beyond press/hold/release timing? ❌
□ Multiple control schemes or input modes needed? ❌

【Problem Definition Issues】
□ Abstract expressions ("use," "utilize") cannot be concretized? ❌
□ Forces/actions needed for goal achievement don't exist in system? ❌
□ Phenomena violating physics laws occur without basis? ❌

【Gameplay Depth Issues】
□ Player can clear by ignoring one mechanic entirely? ❌
□ Game reduces to simple parameter optimization (hold time only)? ❌
□ Only one strategy exists for success? ❌

RESULT: ✅ No red flags detected
```

**Step 8: Visual Communication Design**

```markdown
VISUAL COMMUNICATION SPECIFICATION:

【Problem Indication】

- How: Highlight safe zones (green border), display dangerous center area in red
- Example: Red danger zone in screen center, green safe zones on outer perimeter

【Solution Availability】

- How: Flash button icon when charge available, audio cue at optimal timing
- Example: Button icon at screen bottom, white flash when charge available

【Action Feedback】

- Press: Small explosion effect (particles), short explosion sound
- Hold: Charge circle expands (center to outside), charge sound loop
- Release: Large explosion effect, shockwave circle expands, explosion sound
- Example:
  - Press: play("hit"), particle(center, {count: 10})
  - Hold: Circle expands from radius 10→30 over 1 second
  - Release: play("explosion"), particle(center, {count: 30, speed: 5})

【Progress Indicators】

- How: Display number of objects placed in safe zones / total
- Example: "3/5 SAVED" text at top of screen

【Failure Warning】

- How: Objects flash warning color when approaching center, play danger sound
- Example: Objects within center radius 10 flash red + play("hit")
```

### 🤝 HUMAN CHECKPOINT

**Feedback Collection Questions:**

```markdown
Please verify creativity and implementation feasibility:

【Concept Evaluation】

- Is this game concept fresh and attractive?
- Is the difference from existing games clear?
- Would you want to play this?

【Differentiation Elements】
Explicitly stated exclusion targets:

- Victory condition: "Push back with explosions" (not existing "collect with attraction")
- Control method: "Charge-based timed explosion" (not existing "continuous explosions")

Do these differentiations feel sufficient?

【Implementation Feasibility】
Please review the logical walkthrough:

1. Objects pulled by gravity
2. Player pushes back with charged explosion
3. Place in safe zones with good timing

Are there any impossibilities or contradictions in this flow?

【Visual Communication】
Are the presented visual feedback specifications appropriate?

- Problem recognition ease
- Immediate action feedback
- Progress clarity

【Response Options】
✅ "Approved, implementable and attractive"
🔄 "Adjust concept: [specific suggestion]"
🔄 "Add differentiation elements: [specific suggestion]"
🔄 "Adjust visual feedback: [specific suggestion]"
❌ "Fundamental problem: [reason]" → Return to Phase 1
```

**Warning Signs Collaborative Check:**

```markdown
🤖 LLM automatic detection result:
✅ No red flags detected in automated check

🤝 HUMAN judgment request:
Please provide human intuitive judgment on the following:

【Engagement Depth】

- Does this mechanic seem to generate strategic depth?
- Is there risk of falling into simple repetition?

【Innovation Genuineness】

- Does this "light refinement" (charge-based explosion) contribute to essential fun?
- Is it just a superficial gimmick?

Please point out any issues specifically.
```

### ✅ COMPLETION CRITERIA

```markdown
□ Exclusion filtering completed (differentiation elements clarified)
□ Logical walkthrough verified (implementation feasibility confirmed)
□ Warning sign automatic check passed (0 Red Flags)
□ Visual communication specification completed
□ Human creativity confirmation obtained
□ Human Engagement/Innovation judgment obtained

→ If all met, proceed to Phase 3
```

---

## Phase 3: Implementation and Prototyping

**Purpose:** Generate Crisp Game Library compliant code and verify basic functionality
**Estimated Time:** 20-30 minutes
**Main Processing:** Code implementation, similarity check, prototyping, basic functionality verification

### 🤖 LLM AUTO-EXECUTE

**Step 1: Crisp Game Library Compliant Code Generation**

```javascript
// Generate as tmp/games/<slug>.js
// Required:
// - 2-space indent, trailing semicolons
// - Global variables: title, description, options, update()
// - Balance adjustment target parameters in const UPPER_SNAKE_CASE = value; format
// - Reflect visual communication specification (Phase 2 Step 8) in implementation

title = "GRAVITY OUTPOST";

description = `[Hold] Charge explosion
Push objects to safe zone`;

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

// Balance adjustment target parameters (cooperative evolution system compatible)
const GRAVITY_STRENGTH = 0.1;
const SMALL_EXPLOSION_FORCE = 2;
const CHARGE_RATE = 0.5;
const MAX_CHARGE_RADIUS = 30;
const OBJECT_COUNT = 5;
const SAFE_ZONE_RADIUS = 15;

let objects;
let chargeLevel;
let centerPos;

function update() {
  if (!ticks) {
    // Initialization
    centerPos = vec(50, 50);
    objects = [];
    times(OBJECT_COUNT, () => {
      objects.push({
        pos: vec(rnd(30, 70), rnd(30, 70)),
        vel: vec(0, 0),
        safe: false,
      });
    });
    chargeLevel = 0;
  }

  // Draw center area (danger zone)
  color("light_red");
  arc(centerPos, SAFE_ZONE_RADIUS, 3);

  // Draw safe zones (4 locations on perimeter)
  color("light_green");
  const safeZones = [vec(15, 15), vec(85, 15), vec(15, 85), vec(85, 85)];
  safeZones.forEach((zone) => {
    arc(zone, 10, 2);
  });

  // Explosion control
  if (input.isPressed) {
    chargeLevel = min(MAX_CHARGE_RADIUS, chargeLevel + CHARGE_RATE);

    // Display charge indicator
    color("light_cyan");
    arc(centerPos, chargeLevel, 2);
  }

  if (input.isJustReleased && chargeLevel > 0) {
    // Execute explosion
    play("explosion");
    particle(centerPos, { count: 30, speed: chargeLevel * 0.2 });

    // Apply force to objects
    objects.forEach((obj) => {
      const diff = vec(obj.pos).sub(centerPos);
      const dist = diff.length;
      if (dist < chargeLevel) {
        const force = diff.normalize().mul((chargeLevel - dist) * 0.3);
        obj.vel.add(force);
      }
    });

    chargeLevel = 0;
  }

  if (input.isJustPressed) {
    // Small explosion
    play("hit");
    particle(centerPos, { count: 10, speed: 2 });
    objects.forEach((obj) => {
      const diff = vec(obj.pos).sub(centerPos);
      const dist = diff.length;
      if (dist < 15) {
        const force = diff.normalize().mul(SMALL_EXPLOSION_FORCE);
        obj.vel.add(force);
      }
    });
  }

  // Update objects
  let savedCount = 0;
  objects.forEach((obj) => {
    // Gravity (attraction to center)
    const toCenter = vec(centerPos).sub(obj.pos);
    const dist = toCenter.length;
    obj.vel.add(toCenter.normalize().mul(GRAVITY_STRENGTH));

    // Velocity damping
    obj.vel.mul(0.98);

    // Position update
    obj.pos.add(obj.vel);
    obj.pos.clamp(5, 95, 5, 95);

    // Safe zone check
    obj.safe = false;
    safeZones.forEach((zone) => {
      if (obj.pos.distanceTo(zone) < 10) {
        obj.safe = true;
      }
    });

    // Danger warning
    if (dist < SAFE_ZONE_RADIUS) {
      color("red");
      if (ticks % 10 < 5) {
        box(obj.pos, 6);
      }
    } else {
      color(obj.safe ? "green" : "blue");
      box(obj.pos, 6);
    }

    if (obj.safe) savedCount++;
  });

  // Progress display
  color("black");
  text(`${savedCount}/${OBJECT_COUNT} SAVED`, 3, 10);

  // Goal check
  if (savedCount === OBJECT_COUNT) {
    play("powerUp");
    addScore(savedCount * 100, 50, 50);
  }

  // Game over check (all objects absorbed into center)
  const allTrapped = objects.every((obj) => obj.pos.distanceTo(centerPos) < 5);
  if (allTrapped) {
    end();
  }
}
```

**Step 2: Create Game Proposal JSON**

```bash
# Create tmp/prototypes/<slug>/proposed_game.json
mkdir -p tmp/prototypes/gravity_outpost
cat > tmp/prototypes/gravity_outpost/proposed_game.json <<'EOF'
{
  "slug": "gravity_outpost",
  "title": "GRAVITY OUTPOST",
  "description": "Push objects to safe zones using charged explosions while fighting gravity",
  "tags": ["player:multiple", "field:gravity", "weapon:explosion", "rule:physics", "obstacle:penalty"],
  "mechanics": ["explosion", "charge", "gravity", "timing"],
  "victoryCondition": "Save all objects by placing them in safe zones before they get trapped in center"
}
EOF
```

**Step 3: Execute Similarity Check**

```bash
npm run similarity-check -- tmp/prototypes/gravity_outpost/proposed_game.json

# Automatic judgment:
# - Over 70% → ❌ Immediately reject, return to Phase 2
# - 40-70% → ⚠️ Caution level, ask human judgment
# - Under 40% → ✅ Acceptable, proceed to next step
```

**Similarity Judgment Branching:**

```markdown
【Case A: Over 70% (Automatic Rejection)】
🤖 "Similarity check: 75% - Overlap with existing games too high"
🤖 "Returning to Phase 2 to strengthen differentiation elements"
→ Re-execute from Phase 2 Step 5 (Exclusion Filtering)

【Case B: 40-70% (Human Judgment)】
🤖 "Similarity check: 55% - Moderate similarity detected"
🤖 "Most similar game: [slug] (similarity 60%)"
🤖 "Main commonalities: [tag overlap, mechanic similarity]"
🤝 HUMAN DECISION:
✅ "Acceptable range, sufficient uniqueness" → Next step
🔄 "Need stronger differentiation" → Return to Phase 2

【Case C: Under 40% (Automatic Approval)】
🤖 "Similarity check: 32% - Novelty assured, proceeding to next step"
→ Next step
```

**Step 4: Create Prototype Directory**

```bash
# Auto-generate with scaffold command (recommended)
npm run scaffold -- --slug gravity_outpost \
  --tags "player:multiple,field:gravity,weapon:explosion,rule:physics,obstacle:penalty" \
  --novelty-check

# Or manual creation
mkdir -p tmp/prototypes/gravity_outpost
cp tmp/games/gravity_outpost.js tmp/prototypes/gravity_outpost/game.js

# Important: Must create context.md (required input for novelty evaluation)
cat > tmp/prototypes/gravity_outpost/context.md <<'EOF'
# Game Context: gravity_outpost

- Tags: player:multiple, field:gravity, weapon:explosion, rule:physics, obstacle:penalty
- Categories: player, field, weapon, rule, obstacle
- Generated: 2025-01-09
- Description: Push objects to safe zones using charged explosions while fighting gravity
- Problem Category: Physics/Forces
- Core Verb: Charge explosion to repel objects
EOF
```

### 🤝 HUMAN CHECKPOINT

**Feedback Collection Questions (Phase 3 Focus):**

```markdown
Please verify basic functionality:

【Comprehension Test】

- Can you understand the game's purpose within 3 seconds?
- Is it clear what you should do?

【Achievability Test】

- Can you reach the goal with button controls only?
- Are there any awkward or impossible aspects to the controls?

【Control Feel Test】

- Is the response when pressing the button immediate and clear?
- Is the effect of holding (charging) easy to understand?
- Is the feedback from releasing (explosion) appropriate?

【Visual Feedback Test】
Are the visual communication specifications designed in Phase 2 implemented?

- Problem recognition (clear danger zone, safe zones)
- Action feedback (explosion effects, charge display)
- Progress display (saved object count)
- Failure warning (warning when approaching center)

【Specific Feedback Examples】
✅ Good: "Understood, interesting"
🔄 Needs Adjustment: "Movement too slow" → Parameter adjustment
🔄 Needs Adjustment: "Explosion too weak" → Parameter adjustment
🔄 Needs Adjustment: "Charge display hard to see" → Visual adjustment
❌ Problem: "Cannot reach goal" → Logic review

Please provide specific feedback.
```

**Feedback-Driven Adjustment:**

```markdown
【Adjustment Cycle Example】

🤝 HUMAN: "Object movement too slow, boring"
🤖 LLM: "Adjusting GRAVITY_STRENGTH from 0.1 → 0.15"
[Code update]
🤖 LLM: "Please re-test"

🤝 HUMAN: "Now too fast, can't control"
🤖 LLM: "Adjusting GRAVITY_STRENGTH from 0.15 → 0.12"
[Code update]

🤝 HUMAN: "Better. Want explosion force slightly stronger too"
🤖 LLM: "Adjusting SMALL_EXPLOSION_FORCE from 2 → 2.5"
[Code update]

🤝 HUMAN: "Perfect. Proceed"
```

### ✅ COMPLETION CRITERIA

```markdown
□ Crisp Game Library compliant code generation completed
□ Balance parameters declared in const UPPER_SNAKE_CASE format
□ proposed_game.json creation completed
□ Similarity check execution completed (< 70% or human approval)
□ Prototype directory creation completed
□ context.md created (required input for novelty evaluation)
□ Human basic functionality confirmation obtained
□ Visual communication specification reflected in implementation
□ Feedback-based adjustments completed (human satisfied)

→ If all met, proceed to Phase 4
```

---

## Phase 4: Validation and Balance Adjustment

**Purpose:** Perform quality evaluation and vulnerability diagnostics, adjust balance as needed
**Estimated Time:** 30-45 minutes
**Main Processing:** Basic validation, GA diagnostics, quality score calculation, cooperative evolution balance adjustment

### 🤖 LLM AUTO-EXECUTE (Step 1: Basic Validation)

```bash
# Basic validation (syntax & style)
npm run verify-prototype -- --slug gravity_outpost --mode lint

# Example output:
# ✅ ESLint passed
# ✅ Required elements present (title, description, options, update)
# ✅ Coding style compliant (2-space indent, semicolons)
```

**Syntax Error Handling:**

```markdown
【Case A: No Errors】
✅ Lint check passed → Proceed to GA diagnostics

【Case B: Errors Detected】
🤖 "Syntax errors detected: [error details]"
🤖 "Attempting automatic fix"
[Code fix]
🤖 "Re-executing validation"
→ Iterate until errors resolved
```

### 🤖 LLM AUTO-EXECUTE (Step 2: GA Diagnostics)

```bash
# GA optimization input pattern evaluation
npm run verify-prototype -- --slug gravity_outpost --mode ga

# Example output:
# GA Best Score: 450
# GA Survival Time: 38.5s
# Monotonous Best: 180 (HoldOnly)
# GA Resistance: Moderate (75 points)
# Technical Score: 85/100
# Design Score: 65/100
# Novelty Score: 78/100
# Overall Score: 76/100
```

**Diagnostic Result Interpretation:**

```markdown
【Quality Score Evaluation】

- Technical Score (85): Good syntax accuracy, execution stability
- Design Score (65): Balance needs improvement (38.5s vs target 30-60s)
- Novelty Score (78): Novelty assured
- Overall Score (76): Overall good

【GA Resistance Evaluation】

- GA Resistance: Moderate (75 points)
  → 50-100 point range: Moderate vulnerability, adjustment recommended

【Normalized Score Evaluation】

- Normalized GA score: 450/(450+180) = 0.71
- Normalized monotonous score: 180/(450+180) = 0.29
  → Normalized monotonous score ≤ 0.5 and normalized GA score < 0.75
  → Judgment: "Needs verification" (human judgment required)
```

### Diagnostic Result Branching Decision

```markdown
【Decision Flowchart】

Normalized monotonous score > 0.5?
YES → ❌ Needs improvement (vulnerability) → Balance adjustment required
NO → Next judgment

Normalized GA score > 0.75?
YES → ✅ Ideal (skill-based) → Proceed to Phase 5
NO → ⚠️ Needs verification → Human judgment
```

### 🤝 HUMAN CHECKPOINT (Diagnostic Result Judgment)

**Feedback Collection Questions:**

```markdown
Please review GA diagnostic results:

【Diagnostic Summary】

- GA Best Score: 450
- Monotonous Best: 180 (HoldOnly)
- Normalized GA score: 0.71 (71%)
- Normalized monotonous score: 0.29 (29%)
- GA Resistance: Moderate (75 points)

【Judgment Result】
Normalized monotonous score ≤ 0.5: ✅ Monotonous input not dominant
Normalized GA score 0.71: ⚠️ Under 0.75, "needs verification"

【Questions】

1. Is this vulnerability level (Moderate) acceptable?

   - Is 2.5x score with skill-based play a sufficient difference?

2. Should balance adjustment be performed?

   - Target score: What would be appropriate? (Recommended: 100-150)
   - Target survival time: How many seconds appropriate? (Recommended: 30-60s)

3. Or should game design be reviewed?
   - Return to Phase 2 to strengthen differentiation elements?

【Response Options】
✅ "Acceptable range, proceed to Phase 5"
🔧 "Perform balance adjustment: target score 100, survival time 45s"
🔄 "Review design: [specific improvement plan]" → Return to Phase 2
```

**Expected Human Response:**

```markdown
Example 1: "Perform balance adjustment: target score 100, survival time 45s"
→ To balance adjustment phase

Example 2: "Acceptable range, proceed to Phase 5 as is"
→ Skip to Phase 5

Example 3: "HoldOnly scoring 180 is problematic. Need adjustment"
→ To balance adjustment phase
```

### 🤖 LLM AUTO-EXECUTE (Balance Adjustment: Only if Human Selected)

**Step 1: Parameter Extraction**

```bash
# Generate parameter extraction prompt
npm run extract-balance-params -- --slug gravity_outpost

# Output: tmp/prompts/extract_params_gravity_outpost.md
```

**Step 2: Generate balance_params.json**

```json
{
  "gameSlug": "gravity_outpost",
  "parameters": [
    {
      "path": "GRAVITY_STRENGTH",
      "currentValue": 0.1,
      "suggestedMin": 0.05,
      "suggestedMax": 0.3,
      "description": "Strength of gravitational pull toward center",
      "balanceImpact": "high",
      "location": "line 15"
    },
    {
      "path": "SMALL_EXPLOSION_FORCE",
      "currentValue": 2,
      "suggestedMin": 1,
      "suggestedMax": 5,
      "description": "Force of small explosion on tap",
      "balanceImpact": "medium",
      "location": "line 16"
    },
    {
      "path": "CHARGE_RATE",
      "currentValue": 0.5,
      "suggestedMin": 0.3,
      "suggestedMax": 1.5,
      "description": "Charge speed",
      "balanceImpact": "medium",
      "location": "line 17"
    },
    {
      "path": "MAX_CHARGE_RADIUS",
      "currentValue": 30,
      "suggestedMin": 20,
      "suggestedMax": 50,
      "description": "Maximum charge range",
      "balanceImpact": "high",
      "location": "line 18"
    }
  ]
}
```

**Step 3: Execute Cooperative Evolution**

```bash
# Execute with target metrics specified by human
npm run balance-game -- --slug gravity_outpost \
  --target-score 100 \
  --target-time 45 \
  --max-iterations 5 \
  --player-gens 30 \
  --balance-gens 20

# Process:
# 1. Player GA: Evolve high-score input patterns with fixed parameters
# 2. Evaluate: Calculate difference between achieved score/time and target
# 3. Balance GA: Adjust parameters to approach target metrics by optimizing score gap
#    - Fitness = gapWeight * -scoreGap + scoreWeight * scoreDiff + timeWeight * timeDiff
#    - gapWeight: 2.0 promotes skill-based play
#    - Auto-evaluate monotonous input tests (NoInput/HoldOnly/SpamPress)
# 4. Convergence check: If difference below threshold, finish; otherwise return to 1

# Output:
# - tmp/prototypes/gravity_outpost/adjusted_game.js
# - tmp/prototypes/gravity_outpost/adjusted_params.json
```

**Step 4: Re-diagnose After Adjustment**

```bash
# Vulnerability evaluation of adjusted game
npm run verify-prototype -- --slug gravity_outpost \
  --file tmp/prototypes/gravity_outpost/adjusted_game.js \
  --mode ga

# Example output:
# GA Best Score: 385
# Monotonous Best: 95 (HoldOnly)
# GA Resistance: Low (45 points) ← Improved from Moderate (75)
# Technical Score: 85/100
# Design Score: 78/100 ← Improved from 65
# Overall Score: 81/100 ← Improved from 76
```

**Adjustment Result Evaluation:**

```markdown
【Vulnerability Change Evaluation】
Before adjustment: Moderate (75 points)
After adjustment: Low (45 points)
→ ✅ Improvement (Moderate to Low transition)

【Acceptance Criteria】
✅ Maintained: Same Resistance category
✅ Improved: Transition to better category
❌ Degraded: Transition to worse category → Re-adjust or redesign game

Current: ✅ Improvement confirmed
```

### 🤝 HUMAN CHECKPOINT (Post-Adjustment Confirmation)

**Feedback Collection Questions (Phase 4 Focus):**

```markdown
Please test the game after balance adjustment:

【Core Mechanics Understanding】

- Can you understand the unique system (charged explosion vs gravity) behavior?
- Are the mechanic interactions interesting?

【Difficulty Evaluation】

- Is the difficulty appropriate? (Too easy/too hard)
- Is the learning curve natural?

【Parameter Feel】
Verify feel of adjusted parameters:

- Is gravity strength appropriate? (Too fast/too slow)
- Is explosion force appropriate? (Too strong/too weak)
- Is charge speed appropriate? (Too fast/too slow)

【Risk-Reward Balance】

- Do you feel it's worth taking risks?
- Is the balance between safe and adventurous strategies attractive?

【Specific Feedback Examples】
✅ "Perfect, proceed"
🔄 "Gravity still too strong" → Parameter re-adjustment
🔄 "Charging too slow" → Parameter re-adjustment
❌ "Too monotonous" → Return to Phase 2

Will repeat adjustments until satisfied. Please provide specific feedback.
```

**Iterative Adjustment Cycle:**

```markdown
【Adjustment Cycle】
Repeat until satisfied:

1. 🤝 HUMAN: Specific feedback
   Example: "Gravity still a bit strong"

2. 🤖 LLM: Manually adjust adjusted_params.json
   GRAVITY_STRENGTH: 0.12 → 0.10

3. 🤖 LLM: Inject into adjusted_game.js
   [Use dynamic_game_injector.js]

4. 🤖 LLM: Re-diagnose
   npm run verify-prototype --file adjusted_game.js --mode ga

5. 🤖 LLM: Present results
   "Adjusted GRAVITY_STRENGTH to 0.10. Please re-test"

6. 🤝 HUMAN: Evaluate
   "Better" or "Still needs adjustment"

→ Repeat until human satisfied
```

### ✅ COMPLETION CRITERIA

```markdown
□ Lint validation completed (no syntax errors)
□ GA diagnostics execution completed
□ Quality score calculation completed
□ GA Resistance evaluation completed
□ Human judgment obtained (accept or perform adjustment or review design)

【If Balance Adjustment Performed】
□ Parameter extraction completed
□ balance_params.json generation completed
□ Cooperative evolution execution completed
□ adjusted_game.js generation completed
□ Post-adjustment re-diagnosis completed
□ Vulnerability change evaluation completed (maintained/improved/degraded)
□ Human balance confirmation obtained (iterate until satisfied)

【Acceptance Criteria】
□ GA Resistance: Low maintained or Moderate→Low improvement or human accepts
□ Quality scores: Each item meets criteria or human satisfied
□ Normalized scores: Normalized monotonous score ≤ 0.5 or human accepts

→ If all met, proceed to Phase 5
```

---

## Phase 5: Final Validation and Completion Approval

**Purpose:** Perform comprehensive evaluation and obtain final completion approval
**Estimated Time:** 10 minutes
**Main Processing:** Comprehensive evaluation, novelty metrics calculation, comprehensive report generation, metrics recording

### 🤖 LLM AUTO-EXECUTE

**Step 1: Execute Comprehensive Evaluation**

```bash
# Comprehensive evaluation (lint + sim + novelty metrics)
npm run verify-prototype -- --slug gravity_outpost --mode full

# Example output:
# === Lint Check ===
# ✅ ESLint passed
# ✅ Required elements present
# ✅ Coding style compliant
#
# === Simulation Check ===
# ✅ Game runs without crash
# ✅ Input response confirmed
# ✅ Game over condition working
# ✅ Average survival time: 42.3s
#
# === Novelty Metrics ===
# Tag Novelty Ratio: 0.65 (threshold: 0.3) ✅
# Mechanical Coherence: 0.82 (threshold: 0.7) ✅
# Estimated Code Originality: 0.76 (threshold: 0.7) ✅
# Overall Novelty: 0.74 (threshold: 0.5) ✅
#
# === Quality Scores ===
# Technical Score: 85/100
# Design Score: 78/100
# Novelty Score: 78/100
# Overall Score: 81/100
```

**Step 2: Generate Comprehensive Report**

```markdown
# Comprehensive Evaluation Report: gravity_outpost

Generated: 2025-01-09 14:30:00

## Tag Information

- Tags: player:multiple, field:gravity, weapon:explosion, rule:physics, obstacle:penalty
- Categories: 5 (player, field, weapon, rule, obstacle)
- Tag Novelty Ratio: 0.65

## Problem-Solution Structure

- Problem Category: Physics/Forces
- Player wants to: Place multiple objects in safe zones
- Current obstacle: Gravity pulls them toward center
- Solution: Push back with charged explosion, timing adjustment

## Technical Quality

- Technical Score: 85/100
  - Syntax accuracy: 40/40
  - Execution stability: 30/30
  - Vulnerability resistance: 15/30 (GA Resistance: Low 45 points)

## Design Quality

- Design Score: 78/100
  - Game balance: 45/50 (survival time 42.3s, within target 30-60s range)
  - Difficulty appropriateness: 23/30 (provisional full score)
  - Control feel: 10/20 (provisional half)

## Novelty

- Novelty Score: 78/100
  - Tag Novelty Ratio: 0.65 (new tag pair rate 65%)
  - Mechanical Coherence: 0.82 (good tag compatibility)
  - Estimated Code Originality: 0.76 (high code originality)

## Overall Evaluation

- Overall Score: 81/100
- Judgment: GOOD (70-85 point range)

## Differentiation Elements

- Victory condition: "Push back with explosions" (not existing "collect with attraction")
- Control method: "Charge-based timed explosion" (not existing "continuous explosions")
- Game loop: "Placement optimization" (not existing "enemy elimination")

## Balance Adjustment History

- Initial diagnosis: GA Resistance Moderate (75 points)
- Adjustment performed: Cooperative evolution 5 iterations
- After adjustment: GA Resistance Low (45 points)
- Improvement confirmed: ✅

## Recommendations

- Sufficient quality achieved in current state
- Metrics recording recommended after final approval
```

### 🤝 HUMAN FINAL VALIDATION

**Feedback Collection Questions (Phase 5 Focus):**

```markdown
Please provide final experience evaluation:

【Replay Motivation】

- Do you want to play this game repeatedly?
- Does it create an "one more time" feeling?
- Can you feel improvement after playing several times?

【Remaining Issues Confirmation】

- Are there any remaining balance or control issues?
- Are there any visually unclear parts?
- Is the game over condition fair and clear?

【Completeness Evaluation】

- Can you call this state "complete"?
- Has it reached a level where others could play it?

【Comprehensive Report Review】
Please review the presented comprehensive evaluation report:

- Overall Score: 81/100
- Are each scores reasonable?
- Are differentiation elements clear?

【Response Options】
✅ "Approved & Complete" → Record metrics, save logs
🔄 "Minor adjustment: [specific content]" → Return to Phase 4
❌ "Fundamental problem: [reason]" → Return to Phase 2 or Phase 1 (human specifies)

Please provide final judgment.
```

**Final Approval Decision:**

```markdown
【Processing Based on Human Response】

✅ Approved & Complete:
→ Proceed to metrics recording and log saving

🔄 Minor adjustment:
Example: "Want charge sound emphasized more"
→ 🤖 Execute adjustment
→ 🤖 Re-present
→ 🤝 Re-evaluate
(Repeat until satisfied)

❌ Fundamental problem:
Example: "Still too similar to existing games"
→ Return to Phase 2 (Creative Synthesis)

Example: "Contradiction in problem-solution logic"
→ Return to Phase 1 (Problem-Solution Structuring)
```

### 🤖 LLM AUTO-EXECUTE (Post-Approval Recording)

**Step 1: Record Metrics**

```csv
# Append to knowledge/metrics/tag_combo_history.csv

date,tags,slug,outcome,notes,ga_best_score,ga_resistance,technical_score,design_score,novelty_score,overall_score
2025-01-09,"player:multiple|field:gravity|weapon:explosion|rule:physics|obstacle:penalty",gravity_outpost,pass,mode=full+balance_adjusted,385,Low,85,78,78,81
```

**Step 2: Save Log**

```bash
# Generate knowledge/logs/20250109-gravity_outpost.md

cat > knowledge/logs/20250109-gravity_outpost.md <<'EOF'
# Game Generation Log: gravity_outpost

Generated: 2025-01-09 14:30:00
Total time: 115 minutes

## Phase Summary

### Phase 0: Tag Selection and Initial Validation (10 min)
- Selected tags: player:multiple, field:gravity, weapon:explosion, rule:physics, obstacle:penalty
- Categories: 5
- Novelty score: 0.65
- Human approval: ✅

### Phase 1: Problem-Solution Structuring (12 min)
- Problem category: Physics/Forces
- Solution: Charged explosion counters gravity
- Human approval: ✅ (approved on 1st attempt)

### Phase 2: Creative Synthesis and Novelty Assurance (18 min)
- Differentiation elements: Push back with explosions, charge-based, placement optimization
- Warning signs: 0
- Human approval: ✅ (approved on 1st attempt)

### Phase 3: Implementation and Prototyping (25 min)
- Similarity: 32% ✅
- Adjustment count: 3 (movement speed, explosion force, charge speed)
- Human approval: ✅

### Phase 4: Validation and Balance Adjustment (40 min)
- Initial GA diagnosis: Moderate (75 points)
- Balance adjustment: Performed (cooperative evolution 5 iterations)
- Post-adjustment GA diagnosis: Low (45 points)
- Adjustment count: 2 (gravity strength fine-tuning)
- Human approval: ✅

### Phase 5: Final Validation and Completion Approval (10 min)
- Overall Score: 81/100
- Human approval: ✅

## Final Deliverables

### Files
- tmp/games/gravity_outpost.js
- tmp/prototypes/gravity_outpost/game.js
- tmp/prototypes/gravity_outpost/adjusted_game.js (balance-adjusted version)
- tmp/prototypes/gravity_outpost/proposed_game.json
- tmp/prototypes/gravity_outpost/context.md
- tmp/prototypes/gravity_outpost/balance_params.json
- tmp/prototypes/gravity_outpost/adjusted_params.json

### Metrics
- Technical Score: 85/100
- Design Score: 78/100
- Novelty Score: 78/100
- Overall Score: 81/100
- GA Resistance: Low (45 points)

## Learning Points

### Success Factors
- Human problem category indication in Phase 0 was accurate
- Logical problem-solution structure approved on 1st attempt in Phase 1
- Feedback-driven adjustment in Phase 3 was efficient (converged in 3 iterations)
- Cooperative evolution in Phase 4 significantly improved GA Resistance (75→45 points)

### Improvement Areas
- Balance adjustment in Phase 4 took 40 minutes (target 30 minutes)
  - Reason: Required 2 cycles of fine-tuning after cooperative evolution
  - Countermeasure: Set narrower recommended range in balance_params.json

### Implications for Next Time
- Physics/Forces category games work well with cooperative evolution
- Charge-type mechanics tend to require more adjustment iterations
- Finalizing visual feedback design early smooths later processes

EOF
```

**Step 3: Organize Deliverables**

```bash
# Organize prototype directory
ls tmp/prototypes/gravity_outpost/
# Output:
# - game.js (initial implementation)
# - adjusted_game.js (balance-adjusted version - recommended)
# - proposed_game.json
# - context.md
# - balance_params.json
# - adjusted_params.json
# - verify_report.md (verification report)
```

### ✅ COMPLETION CRITERIA

```markdown
□ Comprehensive evaluation execution completed (lint + sim + novelty metrics)
□ Novelty metrics calculation completed (Tag Novelty, Mechanical Coherence, Code Originality)
□ Quality score calculation completed (Technical, Design, Novelty, Overall)
□ Comprehensive report generation completed
□ Human final approval obtained
□ knowledge/metrics/tag_combo_history.csv updated
□ knowledge/logs/<YYYYMMDD>-<slug>.md generated
□ Deliverables organized (tmp/prototypes/<slug>/)

【Final Quality Criteria】
□ Overall Novelty >= 0.5 (novelty threshold)
□ Overall Score >= 60 (minimum quality standard)
□ GA Resistance: Low or Moderate (human accepts)
□ Human judges "complete"

→ If all met, complete
```

---

## Troubleshooting

### Similarity Check Repeatedly Exceeds 70%

**Symptom:** Similarity exceeds 70% 3+ times consecutively in Phase 3

**Solution:**

```markdown
1. Return to Phase 0 and completely re-select tag combination
2. Strengthen exclusion filtering in Phase 2:
   - Explicitly exclude more existing patterns
   - Add 2+ differentiation elements
   - Consider differentiation at visual representation level
3. Request creative breakthrough from human:
   - "With this tag combination, is there an interesting use not in existing games?"
```

### Balance Adjustment Does Not Converge

**Symptom:** Cooperative evolution in Phase 4 exceeds 10 iterations without reaching target

**Solution:**

```markdown
1. Confirm target metrics validity with human:
   - "Target score 100 may be too high. Lower to 80?"
2. Expand recommended range in balance_params.json:
   - After confirming with human, widen suggestedMin/Max
3. Fundamental review of game design:
   - Return to Phase 2, adjust mechanics
   - Possible structural problem not solvable by simple numerical adjustment
```

### Human Feedback Is Vague

**Symptom:** Feedback lacking specificity like "something's off" or "not quite right"

**Solution:**

```markdown
1. Narrow down with specific questions:
   - "Which is the problem: speed/timing/difficulty?"
   - "At what point do you feel the problem: first 10 seconds/midgame/endgame?"
2. Clarify through comparison:
   - "Compared to previous adjustment, is it better or worse?"
3. Step-by-step confirmation:
   - "First, is control feel okay? (Yes/No)"
   - "Is difficulty appropriate? (Yes/No)"
   - "Are there visually unclear parts? (Yes/No)"
```

### Frequent Rollbacks Between Phases

**Symptom:** Large rollbacks like Phase 3→Phase 1, Phase 4→Phase 2 occur frequently

**Solution:**

```markdown
1. Strictly apply completion criteria for each phase:
   - Do not proceed until obtaining clear "approval" from human
   - Resolve ambiguities immediately
2. Strengthen validation in Phase 1 and Phase 2:
   - Perform logical walkthrough in more detail
   - Don't miss warning signs
3. Request early review from human:
   - Upon Phase 1 completion: "Really okay to proceed as is?"
   - Upon Phase 2 completion: "Final confirmation before implementation"
```

---

## Reference Documents

### Technical Foundation (Detailed Specifications)

- `novelty_game_generation.md`: Novelty assurance mechanisms, tag selection, similarity check
- `game_evaluation_system.md`: Evaluation criteria, validation modes, balance adjustment system

### Implementation Reference

- `crisp-game-lib-guide.md`: Crisp Game Library API, patterns, best practices
- `knowledge/snippets/README.md`: Tag snippet notation and operational rules

### Collaboration Guidelines

- `collaboration_guidelines.md`: Feedback Collection Templates, best practices
- `CLAUDE.md`: Overall project operational policy, coding conventions

### Data & Configuration

- `knowledge/tag_categories_enhanced.csv`: Tag roles, interactions, complexity information
- `knowledge/prompts/main_v2_novelty.md`: Reference prompt templates
- `knowledge/metrics/tag_combo_history.csv`: Past generation history and metrics
