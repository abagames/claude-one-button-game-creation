# One-Button Game Implementation Guide (Human-LLM Collaborative Version)

This guide shows the step-by-step implementation and verification process from idea to completion through strategic human-LLM collaboration.

## Chapter 0: How to Use This Guide

### 🤝 Human-LLM Collaboration Protocol

**Strategic Collaboration:**

- **LLM Strengths**: Technical implementation, crisp-game-lib API usage, parameter adjustment execution
- **Human Strengths**: Play experience evaluation, feedback-based direction guidance, final validation
- **Collaboration Style**: Single implementation → Experience feedback → Adjustment execution cycle

**Session Time**: 30-45 minutes | LLM autonomous: ~70% | Human validation: ~30%

**Universal Execution Protocol (All Phases):**

```markdown
🤖 LLM AUTO: Implementation/Enhancement → Present for testing
🤝 HUMAN: Experience feedback → Specific adjustment requests
🤖 LLM AUTO: Parameter adjustment → Next cycle preparation
🚫 FORBIDDEN: Multiple implementation options, complex parameter choices
✅ REQUIRED: Single implementation → Feedback → Adjustment → Validation flow
```

**Essential Human Checkpoints:**

1. **Phase 1**: Basic functionality and reachability validation
2. **Phase 2**: Core mechanics understanding and balance feedback
3. **Phase 3**: Final experience evaluation and completion approval

### Prerequisites

- **Input**: Game concept from the idea generation guide
- **Output**: Balanced, fully playable game
- **Approach**: Start with minimal implementation, improve progressively through feedback cycles
- **Tech Stack**: crisp-game-lib (see `crisp-game-lib-guide.md` for details)

### Standardized Input Format

At implementation start, expect to receive ideas in this format:

```markdown
# Game Title: [Name]

## Core Mechanics

- Button action: [What happens when pressed]
- World response: [How the world changes as a result]
- Input pattern: [Which combination of Press/Hold/Release]
- Environment type: [Central fixed point/Defined path/Open space/Scrolling/Lane/Dynamic surface]
- Movement pattern: [Static/Auto/Controlled trajectory/Gravity propulsion/Path following/Point-to-point/Physics floating/State dependent]

## Game Loop

- Objective: [Specifically what to achieve]
- Action: [Actions player takes]
- Obstacle: [What interferes]
- Reward: [Payoff for success]

## Failure Conditions (Clear Game Over)

- Primary failure condition: [Single, understandable condition]
- Visual feedback: [How failure is displayed]
- Avoidance: [Avoidable through player skill]

## Innovative Elements

[Unique mechanics inspired by SCAMPER method or natural phenomena]

## Mechanics Integration

- Number of mechanics used: [Single (recommended)/Multiple]
- Mechanics compatibility: [Mutually enhancing/Independent/Points of concern]
- Control evaluation: [Richness of choices/Predictability/Visual clarity]

## Implementation Priority

- Phase 1: [Minimal implementation (core mechanics only)]
- Phase 2: [Basic expansion (enhanced visual feedback)]
- Phase 3: [Optimization (performance/balance adjustment)]

## Additional Game Rules for Implementation
```

This format enables comprehensive understanding of required elements for the implementation phase.

### Basic Principles

```markdown
1. Create moving things first (implementation over discussion)
2. Verify only one element at a time
3. Quantify player experience
4. Discover and fix failures early
```

### Coding Requirements

All implementations based on this guide must use crisp-game-lib and strictly adhere to the following. For detailed API reference of crisp-game-lib, refer to `crisp-game-lib-guide.md`.

```markdown
【Required Elements】
□ Use crisp-game-lib's functional API
□ Prohibit use of classes (crisp-game-lib uses functional design)
□ Prohibit use of this
□ Manage state with global variables (crisp-game-lib recommended pattern)
□ Implement all game logic within update() function
□ Perform drawing and collision detection simultaneously (crisp-game-lib feature)

【Tech Stack】

- Library: crisp-game-lib
- Drawing: box(), rect(), arc() functions
- Input: input.isPressed, input.isJustPressed
- Audio: play() function
- Effects: particle() function

【Bad Example (vanilla JavaScript)】
class Player {
constructor() {
this.x = 0;
this.y = 0;
}
move() {
this.x += 5;
}
}

【Good Example (crisp-game-lib)】
let player;

function update() {
if (!ticks) {
player = { pos: vec(50, 50) };
}

if (input.isPressed) {
player.pos.x += 5;
}

color("blue");
box(player.pos, 10);
}
```

## Chapter 1: Idea Analysis and Prioritization

### 1.1 Extract Elements from Ideas

Break down input ideas into these elements:

```markdown
□ Objective: What the player should achieve
□ Basic action: What happens when button is pressed
□ Core mechanics: Unique system specific to this game
□ Obstacles/risks: What interferes with the player
□ Rewards: Feedback on success
```

### 1.2 Implementation Priority Decision (Systematic Design Principles)

```markdown
Essential (Phase 1): Without these, the game cannot function

- Objective visualization (including clear game over conditions)
- Basic implementation of input patterns (Press/Hold/Release)
- Basic setup according to environment type
- Basic physics for movement patterns
- Success/failure judgment and immediate feedback

Important (Phase 2): Makes the game fun

- Implementation of core mechanics (SCAMPER/natural phenomena based)
- Detailed implementation of environmental interactions
- Addition of risk elements
- Enhancement of implicit visual feedback
- Action-based scoring

Improvement (Phase 3): Refines the experience

- Parameter adjustment (applying control evaluation criteria)
- Quality verification with comprehensive evaluation criteria
- Difficulty curve (playable game standards)
- Completion improvement of endgame conditions
```

### 1.3 Implementation Process Management

#### 1.3.1 Collaborative Implementation Protocol

_Refer to Universal Execution Protocol in Chapter 0 for all phases_

#### Ambiguity Detection & Question Management System

When specification uncertainties arise during implementation, respond according to these principles:

#### Ambiguity Detection Mode (Default)

```markdown
【Response to Specification Uncertainties】

1. Never make assumptions
2. Ask only one closed question at a time
3. Stop related implementation until receiving an answer

【Bad Example】
"I think this is probably like this, so I'll implement it for now"

【Good Example】
"Confirmation: When colliding with enemies, does the player immediately get game over?
Or does health decrease?"
```

#### Assumption Clarification Mode

When implementation requires making some assumption:

```markdown
【Format】
Assumption: [Specific content]

【Example】
Assumption: When reaching screen edge, player warps to opposite side

【Approval Process】

1. Clarify assumption
2. Seek human approval
3. Start implementation after approval
4. Record assumption in comments
```

#### Human Feedback Collection System

**Primary Implementation Approach: Feedback-Driven Adjustment**

```markdown
【Feedback Collection Protocol】

1. LLM completes single implementation
2. LLM presents specific feedback collection questions
3. Human provides experiential feedback
4. LLM executes targeted adjustments
5. Cycle repeats until satisfaction

【Feedback Collection Templates】

Phase 1: "Implementation completed. Please test and provide feedback:

- Can you understand the objective within 3 seconds?
- Can you reach the goal using the button?
- Any aspect of controls that feels uncomfortable?"

Phase 2: "Core mechanics added. Please test and provide feedback:

- Do you understand how the unique system works?
- Does the difficulty feel appropriate?
- Any parameters that feel too fast/slow/strong/weak?"

Phase 3: "Final version ready. Please test and provide feedback:

- Does this feel fun to replay?
- Any remaining issues with balance or controls?
- Does the experience feel complete?"
```

#### Question Management System

For critical specification uncertainties that block implementation:

```markdown
【Response When Blocker Questions Arise】

All blocker questions should pause implementation for immediate confirmation

- Blocker questions: Critical matters preventing implementation continuation
- Parameter questions: Use feedback cycle instead of asking

【Example】
"Confirmation: When colliding with enemies, does the player immediately get game over?"
→ Continue implementation after receiving answer
```

#### 1.3.2 Work Plan Approval Process

Always execute the following steps before starting implementation:

```markdown
【Work Plan Template】

## [Game Name] Implementation Plan

### Phase 1

□ [Specific task 1]
□ [Specific task 2]
□ [Specific task 3]

### Phase 2

□ [Specific task 1]
□ [Specific task 2]

### Expected Technical Decision Points

1. [Decision point 1]
2. [Decision point 2]

【Approval Confirmation】
"May I start implementation with this plan?"
```

#### 1.3.3 Process Recording System

```markdown
【Implementation Log Template】

## [Date] [Game Name] Implementation Record

### Completed Tasks

- [Task 1] - [Time taken] - [Result/Issues]
- [Task 2] - [Time taken] - [Result/Issues]

### Specification Decisions Made

- [Decision 1] → [Decision content and reason]
- [Decision 2] → [Decision content and reason]

### Technical Insights

- [Notes on crisp-game-lib usage]

### Handover to Next Session

- [Incomplete tasks]
- [Additional confirmation items needed]
```

## Chapter 2: Phase 1 - Minimal Implementation

**Phase Input:** Game concept from design guide
**Phase Output:** Working minimal implementation with basic functionality
**Completion Criteria:** ✅ LLM completes implementation, ✅ Human validates basic functionality, ✅ Feedback cycle executed

### ⚠️ Phase 1 Execution Protocol

**EXECUTION ORDER:**

```markdown
🤖 LLM AUTO: Basic implementation completion → Environment setup → Input pattern implementation
🤝 HUMAN: Functionality validation → Reachability feedback → Control comfort assessment
🤖 LLM AUTO: Parameter adjustment based on feedback → Cycle preparation
```

### 2.1 Basic Implementation by Input Pattern (LLM Autonomous)

Perform basic implementation according to the pattern specified in input format (Press/Hold/Release). See Chapter 6 for detailed templates.

```javascript
// Basic implementation example
if (input.isPressed) {
  // Continuous effect during Hold
  player.pos.x += moveSpeed;
}
```

### 2.2 Basic Setup by Environment Type (LLM Autonomous)

Perform initial setup according to environment type specified in input format (central fixed point/open space etc.). See Chapter 6 for specific implementation examples.

### 2.3 Objective Visualization Test

```javascript
// Minimal implementation example with crisp-game-lib
title = "REACH GOAL";
description = `[Hold] Move right`;
options = { viewSize: { x: 100, y: 100 } };

let player, goal;

function update() {
  if (!ticks) {
    // Initialize: confirm objective is visible and achievable
    player = { pos: vec(20, 50) };
    goal = { pos: vec(80, 50), reached: false };
  }

  // Draw goal first (detection target)
  color("yellow");
  box(goal.pos, 15);

  // Draw player and detect collision
  color("blue");
  if (box(player.pos, 10).isColliding.rect.yellow) {
    goal.reached = true;
    addScore(100, goal.pos);
    play("coin");
  }
}
```

### 2.2 Phase 1 Human Feedback Collection (COLLABORATIVE)

_Use Universal Feedback Template (see Section 5.3) with Phase 1 focus:_

- Can you understand the objective within 3 seconds?
- Can you reach the goal using only the button?
- Do the controls feel responsive?

### 2.3 Basic Action Implementation

```javascript
// Add input processing within update() for crisp-game-lib
function update() {
  if (!ticks) {
    player = { pos: vec(20, 50) };
    goal = { pos: vec(80, 50), reached: false };
  }

  // Button input processing (crisp-game-lib unified input)
  if (input.isPressed) {
    // Example: while pressing, move right
    player.pos.x += 1;
  } else {
    // Example: when releasing, fall down (gravity)
    player.pos.y += 0.5;
  }

  // Limit to screen bounds
  player.pos.clamp(5, 95, 5, 95);

  // Drawing and collision detection
  color("yellow");
  let goalCol = box(goal.pos, 15);

  color("blue");
  box(player.pos, 10);

  if (goalCol.isColliding.rect.blue) {
    addScore(100, goal.pos);
    play("coin");
  }
}
```

### 2.4 Reachability Feedback

Question: "What happened when you tried to achieve the objective? Where did you struggle?"

Expected response: "Succeeded on the third try" "Can achieve it once you get the hang of it"

### 2.5 Phase 1 Completion Comprehensive Evaluation Check

**Control & Feedback (Phase 1 Standards):**

```markdown
□ Button actions (specified input patterns) and game responses are immediate and clear
□ Basic visual feedback for player actions implemented
□ Success/failure differences clearly distinguishable
□ Basic results of input patterns are predictable
```

**Visual Design & Simplicity (Phase 1 Standards):**

```markdown
□ Player, objectives, obstacles easily distinguishable by shape and color
□ Objective visually understandable within 3 seconds
□ Basic game state (energy, position, etc.) visualized
□ Background doesn't hinder gameplay visibility
```

**Basic Gameplay (Phase 1 Standards):**

```markdown
□ Clear victory conditions (foundation of endgame conditions) implemented
□ Fair and understandable failure conditions implemented
□ Basic achievement possible within 30 seconds
□ Immediate retry possible
```

### 2.5 Implementation Decision Framework

#### 2.5.1 Trade-off Analysis Template

When multiple implementation options exist, analyze using this template:

```markdown
【Implementation Choice Requiring Decision】

## Option A: [Implementation Method Name]

### Advantages

- [Specific benefit 1]
- [Specific benefit 2]

### Disadvantages

- [Specific drawback 1]
- [Specific drawback 2]

### crisp-game-lib Implementation Difficulty

- Difficulty: [Easy/Medium/Hard]

## Option B: [Implementation Method Name]

### Advantages

- [Specific benefit 1]
- [Specific benefit 2]

### Disadvantages

- [Specific drawback 1]
- [Specific drawback 2]

### crisp-game-lib Implementation Difficulty

- Difficulty: [Easy/Medium/Hard]

## Recommended Proposal

Recommend [Option X] for these reasons:

1. [Reason 1]
2. [Reason 2]

【Confirmation】
"May I implement [Option X] with this analysis?"
```

#### 2.5.2 Pre-Implementation Checklist

```markdown
【Pre-Implementation Confirmation Items】

□ All specification ambiguities resolved?
□ crisp-game-lib APIs to be used confirmed?
□ Areas requiring trade-off analysis identified?
□ Work plan approved by human?
□ Ready to confirm questions immediately?

【Implementation Behavioral Principles】

□ Don't implement based on assumptions
□ Stop work when decision points arise
□ Always clarify assumptions when necessary
□ Utilize trade-off analysis template
□ Update implementation log regularly

【Post-Implementation Confirmation】

□ Implementation log completed?
□ All unresolved questions confirmed?
□ Handover items for next phase documented?
```

## Chapter 3: Phase 2 - Core Mechanics Implementation

**Phase Input:** Working minimal implementation from Phase 1
**Phase Output:** Complete game with unique mechanics implemented
**Completion Criteria:** ✅ LLM implements core mechanics, ✅ Human validates understanding and balance, ✅ Feedback cycle executed

_Follow Universal Execution Protocol from Chapter 0_

### 3.1 Adding Unique Mechanics (LLM Autonomous)

Implement the "innovative elements" from ideas with crisp-game-lib:

```javascript
// Example: "Stop time and use enemies as platforms"
title = "TIME STOP JUMP";
description = `[Hold] Stop time`;
options = { viewSize: { x: 100, y: 100 } };

let player, enemies, timeStopActive, timeStopEnergy;

function update() {
  if (!ticks) {
    player = { pos: vec(20, 80), vy: 0 };
    enemies = [];
    timeStopActive = false;
    timeStopEnergy = 100;

    // Generate enemies
    times(3, (i) => {
      enemies.push({
        pos: vec(30 + i * 20, 50),
        vel: vec(rnd(-1, 1), rnd(-1, 1)),
        frozen: false,
      });
    });
  }

  // Time stop control
  if (input.isPressed && timeStopEnergy > 0) {
    timeStopActive = true;
    timeStopEnergy -= 1;
  } else {
    timeStopActive = false;
  }

  // Natural energy recovery
  if (!input.isPressed && timeStopEnergy < 100) {
    timeStopEnergy += 0.5;
  }

  // Enemy update and drawing
  enemies.forEach((enemy) => {
    if (!timeStopActive) {
      enemy.pos.add(enemy.vel);
      enemy.pos.wrap(0, 100, 0, 100);
    }

    color(timeStopActive ? "cyan" : "red");
    box(enemy.pos, 12);
  });

  // Player physics (gravity always applies)
  player.vy += 0.3;
  player.pos.y += player.vy;

  if (player.pos.y > 90) {
    player.pos.y = 90;
    player.vy = 0;
  }

  // Player drawing
  color("blue");
  let playerCol = box(player.pos, 10);

  // Use stopped enemies as platforms during time stop
  if (timeStopActive && playerCol.isColliding.rect.cyan) {
    player.vy = -4; // Jump
    play("jump");
  }

  // Energy bar display
  color("green");
  rect(10, 10, timeStopEnergy, 5);
}
```

### 3.2 Composite Mechanics Implementation Notes

When combining multiple mechanics:

- Design single input to trigger multiple effects
- Control complexity with energy/timer conditional branching
- Expand mechanics through gradual evolution

### 3.3 Phase 2 Human Feedback Collection (COLLABORATIVE)

_Use Universal Feedback Template (see Section 5.3) with Phase 2 focus:_

- Do you understand how the unique system works?
- Does the difficulty feel appropriate?
- Are there any parameters that feel too fast/slow/strong/weak?

### 3.4 Risk Element Implementation

```javascript
// Risk element implementation with crisp-game-lib
// Example: Overheating from excessive time stop use

let player, enemies, timeStopEnergy, overheated;

function update() {
  if (!ticks) {
    player = { pos: vec(20, 80) };
    enemies = [];
    timeStopEnergy = 100;
    overheated = false;
  }

  // Risk management: energy consumption and overheating
  if (input.isPressed && timeStopEnergy > 0 && !overheated) {
    timeStopActive = true;
    timeStopEnergy -= 2; // Consumption rate

    // Overheating risk
    if (timeStopEnergy <= 0) {
      overheated = true;
      play("hit"); // Danger sound
      particle(player.pos, { count: 15, speed: 3 }); // Explosion effect
    }
  } else {
    timeStopActive = false;

    // Slow recovery during overheat (risk penalty)
    if (overheated) {
      timeStopEnergy += 0.2; // Slow recovery
      if (timeStopEnergy >= 30) {
        overheated = false; // Recovery complete
      }
    } else {
      timeStopEnergy += 1; // Normal recovery
    }
  }

  timeStopEnergy = clamp(timeStopEnergy, 0, 100);

  // Risk display: dangerous state visualization
  color(overheated ? "red" : timeStopEnergy < 20 ? "yellow" : "green");
  rect(10, 10, timeStopEnergy, 5);

  if (overheated) {
    color("red");
    text("OVERHEATED!", vec(50, 20));
  }
}
```

### 3.5 Risk-Reward Balance Feedback

Question: "When you took risks versus played safe, which gave better results? Why do you think so?"

Expected response: "Played safe in easy situations, took risks in difficult situations"

**If problems exist → See Chapter 5 "Feedback Response Methods"**

## Chapter 4: Phase 3 - Final Adjustment and Polish

**Phase Input:** Complete game with core mechanics from Phase 2
**Phase Output:** Polished, balanced game ready for play
**Completion Criteria:** ✅ LLM implements final adjustments, ✅ Human validates final experience, ✅ Completion confirmed

_Follow Universal Execution Protocol from Chapter 0_

### 4.1 Identifying Mechanics-Specific Parameters (LLM Autonomous)

_Refer to Parameter Adjustment Guidelines in Section 4.2 for implementation patterns_

### 4.2 Parameter Adjustment Guidelines

**Basic Adjustment Policy:**

1. **Change only 1 parameter at a time**
2. **Small incremental changes** (±10-20%)
3. **Experiential confirmation through play testing**
4. **Feedback collection and reflection**

**Standard Adjustment Order:**

```markdown
1. Movement speed/responsiveness (establish control feel)
2. Gravity/jump power (adjust physical sensation)
3. Energy consumption/recovery (risk-reward balance)
4. Enemy speed/placement (difficulty adjustment)
```

**Parameter Management Pattern:**

```javascript
// Centralized parameter management
let gameParams = {
  playerSpeed: 1.2, // Movement (0.5-3)
  gravity: 0.4, // Physics (0.1-0.8)
  energyCost: 1.5, // Resource (1-5)
  recoveryRate: 0.6, // Recovery (0.5-2)
  enemySpeed: 1, // Challenge (0.5-3)
};

function update() {
  // Use centralized parameters
  if (input.isPressed) {
    player.pos.x += gameParams.playerSpeed;
    energy -= gameParams.energyCost;
  }
}
```

### 4.3 Phase 3 Human Feedback Collection (COLLABORATIVE)

_Use Universal Feedback Template (see Section 5.3) with Phase 3 focus:_

- Does this feel fun to replay?
- Are there any remaining issues with balance or controls?
- Does the experience feel complete and polished?

### 4.4 Phase 3 Completion Comprehensive Evaluation Check (Playable Game Standards)

**Control & Feedback (Completion Standards):**

```markdown
□ Button actions (tap, hold, release) and responses immediate, clear, consistent
□ Rich implicit feedback for actions, state changes, collisions, scoring, hazards
□ Timing requirements fair and learnable, clearly signal when action needed
□ Easy to distinguish results of different input patterns
□ Visual effects enhance understanding without confusion
```

**Balance & Progression (Completion Standards):**

```markdown
□ Risk-reward relationships attractive, motivate calculated risk-taking
□ Difficulty increases smoothly and perceptibly, balance of new challenges and speed/density
□ Monotony resistance: Cannot easily clear with simple repetitive input
□ Players feel meaningful agency within constraints
□ Game over conditions fair, result of player error not random unclear mechanics
```

**Scoring & Motivation (Completion Standards):**

```markdown
□ Scoring directly tied to skillful execution of core mechanics
□ High-risk operations and difficult achievements appropriately rewarded
□ Scoring system intuitive with immediate feedback
□ Scoring promotes replayability and mastery
□ Path to high scores involves skill development, not grinding
```

**Innovation & Engagement (Completion Standards):**

```markdown
□ Unique twist on one-button concept, novel combination of familiar mechanics
□ Core mechanics instantly satisfying and engaging
□ Single button input yields surprisingly deep/varied gameplay results
□ Creates memorable moments of tension, success, near-misses
□ Challenging yet feels "fair"
```

**Playable Game Completion Standards:**

```markdown
□ Clear endgame conditions with sense of achievement
□ 30 seconds to 2 minutes play time per session
□ Natural "one more time" motivation induction
□ Confirmed improvement sensation and replay value
□ Technical stability (60FPS, no input delay)
```

## Chapter 5: Feedback Response Methods

### 5.1 Common Problems and Solutions

【Understanding Problem Patterns】
❌ "Nothing happens" "Makes no sense"
→ Check basic display/actions, enhance objective visualization

【Control Problem Patterns】
❌ "Too fast to control" "Timing is difficult"
→ Basic parameter adjustment (speed, responsiveness)

【Balance Problem Patterns】
❌ "Too easy/too hard" "Risk and reward don't match"
→ Parameter adjustment, risk-reward redesign

【Feedback Shortage Patterns】
❌ "Don't know what's happening" "Can't see effects"
→ Enhance visual effects, audio feedback, UI display

### 5.2 Gradual Improvement Approach

1. **Fundamental design review** (for critical issues)
2. **Visual representation enhancement** (for understanding problems)
3. **Parameter adjustment** (for balance problems)
4. **Feedback enhancement** (for detailed experience improvement)

### 5.3 Universal Feedback Template

**LLM Feedback Request Format:**

```markdown
"Phase [X] implementation completed. Please test and provide feedback:

[Phase-specific questions]

Please respond with specific feedback like:

- '[Parameter] too fast/slow/strong/weak'
- '[Feature] works well'
- 'Need more [visual/audio] feedback for [state]'

What needs adjustment?"
```

**Expected Response Patterns:**

```markdown
✅ Good feedback examples:
"Movement feels too slow" → Increase moveSpeed parameter
"Energy drains quickly" → Reduce energyCost parameter
"Jump power perfect" → Maintain current setting
"Need energy warning" → Add visual warning system

❌ Problem Indicators:
"Too easy/hard" → Parameter adjustment needed
"Gets repetitive" → Variation/progression needed
"Feels unfair" → Predictability improvement needed

✅ Completion Indicators:
"Fun to replay" → Good balance achieved
"Almost got it" → Appropriate challenge level
"Want to try again" → Engagement successful
```

## Chapter 6: Implementation Template Collection

All code examples in this chapter use crisp-game-lib. For API details, refer to `crisp-game-lib-guide.md`.

### 6.1 Input Pattern Implementation Templates

**Press (Tap) Type Implementation Pattern:**

```javascript
// Basic template: immediate action
function update() {
  if (input.isJustPressed) {
    // Direction change
    player.direction *= -1;

    // Jump (gravity system)
    if (player.onGround) {
      player.vy = jumpPower;
    }

    // State toggle
    gameState = gameState === "mode1" ? "mode2" : "mode1";

    // Move to next point
    currentTargetIndex = (currentTargetIndex + 1) % targets.length;
  }
}
```

**Hold (Long Press) Type Implementation Pattern:**

```javascript
// Basic template: parameter adjustment/state maintenance
let chargeLevel = 0;
let maxCharge = 100;

function update() {
  if (input.isPressed) {
    // Parameter adjustment (angle/power/range)
    chargeLevel = min(maxCharge, chargeLevel + 2);

    // State maintenance (propulsion/defense/slow fall)
    player.vy -= thrustPower; // Upward propulsion
    player.shieldActive = true;

    // Growth/expansion
    player.size = min(maxSize, player.size + 0.5);
  } else {
    // Natural recovery/state cancellation
    chargeLevel = max(0, chargeLevel - 1);
    player.shieldActive = false;
    player.size = max(minSize, player.size - 0.2);
  }
}
```

**Release Type Implementation Pattern:**

```javascript
// Basic template: action execution/state cancellation
function update() {
  if (input.isPressed) {
    // Charging display
    chargeLevel += 1;
    drawChargingEffect(player.pos, chargeLevel);
  }

  if (input.isJustReleased) {
    // Launch/shoot (according to charge level)
    let projectile = {
      pos: vec(player.pos),
      vel: vec(chargeLevel * 0.1, 0),
      power: chargeLevel,
    };
    projectiles.push(projectile);

    // Shrink/contract
    player.size = normalSize;

    // Reset charge
    chargeLevel = 0;

    play("shoot");
  }
}
```

### 6.2 Environment Type Implementation Templates

**Central Fixed Point/Orbital:**

```javascript
// Rotation/orbital mechanics
let centralPoint = vec(50, 50);
let orbitRadius = 30;
let angle = 0;
let rotationSpeed = 0.02;

function update() {
  if (input.isPressed) {
    rotationSpeed += 0.001; // Accelerate
  } else {
    rotationSpeed = max(0.01, rotationSpeed - 0.0005); // Decelerate
  }

  angle += rotationSpeed;

  // Calculate orbital position
  player.pos.x = centralPoint.x + cos(angle) * orbitRadius;
  player.pos.y = centralPoint.y + sin(angle) * orbitRadius;

  // Draw central point
  color("yellow");
  arc(centralPoint, 5);

  // Draw player
  color("blue");
  box(player.pos, 8);
}
```

**Open Space (Physics) System:**

```javascript
// Gravity/propulsion mechanics
let gravity = vec(0, 0.3);
let thrustPower = -0.8;

function update() {
  // Apply gravity
  player.vel.add(gravity);

  if (input.isPressed) {
    // Propulsion (counter gravity)
    player.vel.y += thrustPower;

    // Particle effect
    particle(player.pos, { count: 3, speed: 2, angle: PI / 2 });
  }

  // Update position
  player.pos.add(player.vel);

  // Boundary handling
  if (player.pos.y > 95) {
    player.pos.y = 95;
    player.vel.y = 0;
  }

  // Air resistance
  player.vel.mul(0.98);
}
```

**Scrolling Environment System:**

```javascript
// Scrolling and player relative movement
let scrollSpeed = vec(0, 1);
let obstacles = [];

function update() {
  // Obstacle scrolling
  obstacles.forEach((obstacle) => {
    obstacle.pos.sub(scrollSpeed);
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(
    (obstacle) => obstacle.pos.y < 105 && obstacle.pos.y > -5
  );

  // Generate new obstacles
  if (rnd() < 0.02) {
    obstacles.push({
      pos: vec(rnd(10, 90), -5),
      size: rnd(8, 15),
    });
  }

  // Player control (relative movement to scroll)
  if (input.isPressed) {
    player.pos.x += 1; // Move right
  }

  // Scrolling background effect
  color("gray");
  for (let y = 0; y < 100; y += 10) {
    let scrollY = (y + ticks * scrollSpeed.y) % 100;
    line(vec(0, scrollY), vec(100, scrollY));
  }
}
```

### 6.3 Movement Pattern Implementation Templates

**Auto Movement System:**

```javascript
// Constant speed auto movement with button actions
let autoMoveSpeed = vec(1, 0);

function update() {
  // Auto movement
  player.pos.add(autoMoveSpeed);

  // Screen edge wrapping
  if (player.pos.x > 95 || player.pos.x < 5) {
    autoMoveSpeed.x *= -1;
  }

  if (input.isJustPressed) {
    // Jump
    player.vy = -4;
    play("jump");
  }

  // Gravity and Y-axis movement
  player.vy += 0.3;
  player.pos.y += player.vy;

  if (player.pos.y > 90) {
    player.pos.y = 90;
    player.vy = 0;
  }
}
```

**Point-to-Point Movement System:**

```javascript
// Discrete point-to-point teleport movement
let waypoints = [vec(20, 80), vec(50, 50), vec(80, 80)];
let currentWaypoint = 0;

function update() {
  // Current target point
  let target = waypoints[currentWaypoint];

  if (input.isJustPressed) {
    // Move to next point
    currentWaypoint = (currentWaypoint + 1) % waypoints.length;
    target = waypoints[currentWaypoint];

    // Movement effect
    particle(player.pos, { count: 10, speed: 3 });
    play("teleport");
  }

  // Set player position to target point
  player.pos = vec(target);

  // Display all points
  waypoints.forEach((wp, i) => {
    color(i === currentWaypoint ? "yellow" : "gray");
    arc(wp, 5);
  });

  // Draw player
  color("blue");
  box(player.pos, 8);
}
```

### 6.4 Basic Implementation Pattern (3-Stage Evolution)

**Phase 1: Minimal Implementation**

```javascript
// === Objective visualization and basic action ===
title = "REACH GOAL";
description = `[Hold] Move right and up`;
options = { viewSize: { x: 100, y: 100 } };

let player, goal, gameWon;

function update() {
  if (!ticks) {
    player = { pos: vec(20, 70) };
    goal = { pos: vec(80, 30) };
    gameWon = false;
  }

  if (input.isPressed) {
    player.pos.x += 1;
    player.pos.y -= 0.5;
  } else {
    player.pos.y += 1;
  }

  player.pos.clamp(5, 95, 5, 95);

  color("yellow");
  let goalCol = box(goal.pos, 15);
  color("blue");
  box(player.pos, 8);

  if (goalCol.isColliding.rect.blue && !gameWon) {
    gameWon = true;
    addScore(100, goal.pos);
    play("coin");
  }
}
```

**Phase 2: Core Mechanics Addition**

```javascript
// === Complete Time Stop Platform Game ===
title = "TIME STOP PLATFORM";
description = `[Hold] Stop time & use enemies as platforms`;

let player, goal, enemies, timeStopEnergy;

function update() {
  if (!ticks) {
    player = { pos: vec(20, 80), vy: 0 };
    goal = { pos: vec(80, 30) };
    timeStopEnergy = 100;
    enemies = [];
    times(3, (i) => {
      enemies.push({
        pos: vec(30 + i * 20, 40 + i * 10),
        vel: vec(rnd(-1, 1), rnd(-1, 1)),
      });
    });
  }

  let timeStopActive = input.isPressed && timeStopEnergy > 0;

  if (timeStopActive) {
    timeStopEnergy -= 1.5;
    player.pos.x += 1;
  } else {
    timeStopEnergy = min(100, timeStopEnergy + 0.5);
  }

  player.vy += 0.4; // Gravity
  player.pos.y += player.vy;

  if (player.pos.y > 90) {
    player.pos.y = 90;
    player.vy = 0;
  }

  // Enemy updates
  enemies.forEach((enemy) => {
    if (!timeStopActive) {
      enemy.pos.add(enemy.vel);
      enemy.pos.wrap(10, 90, 10, 90);
    }

    color(timeStopActive ? "cyan" : "red");
    let enemyCol = box(enemy.pos, 12);

    // Platform function during time stop
    if (timeStopActive && enemyCol.isColliding.rect.blue && player.vy > 0) {
      player.pos.y = enemy.pos.y - 10;
      player.vy = 0;
    }
  });

  color("blue");
  box(player.pos, 8);
  color("yellow");
  let goalCol = box(goal.pos, 15);

  if (goalCol.isColliding.rect.blue) {
    addScore(200, goal.pos);
    play("powerUp");
  }

  // Energy display
  color(timeStopEnergy < 20 ? "red" : "green");
  rect(10, 10, timeStopEnergy, 5);
}
```

_Phase 3 focuses on parameter adjustment using the centralized approach shown in Section 4.2_

### 6.5 Implementation Points

**Code Simplification Guidelines:**

- Focus on essential mechanics
- Properly use crisp-game-lib API
- Manage state with global variables
- Implement all logic within update() function

**Common Implementation Pattern:**

```javascript
function update() {
  if (!ticks) {
    // Initialization only
  }

  // Input processing
  if (input.isPressed) {
    // Action
  }

  // Physics update
  // Drawing and collision detection (simultaneous execution)
  // UI display
}
```

## Summary: Collaborative Implementation Principles

### 🎯 Optimized Human-LLM Partnership for Implementation

**Key Success Factors:**

1. **Single Implementation Approach**: No complex multiple choice presentations
2. **Feedback-Driven Adjustment**: Human provides direction, LLM executes changes
3. **Phase-Based Validation**: Clear checkpoints using Universal Feedback Template
4. **Immediate Adjustment Cycle**: Fast iteration based on play experience
5. **Experience-First Decision Making**: Human judgment drives parameter decisions

### Implementation Guidelines

**✅ Best Practices:**

- Start with minimal working version
- Use Universal Execution Protocol for all phases
- Apply Universal Feedback Template with phase-specific questions
- Make single parameter adjustments based on human feedback
- Focus on play experience over technical perfection

**❌ What to Avoid:**

- Multiple implementation options or complex parameter choices
- Assumption-based implementation without clarification
- Complex feedback collection processes
- Skipping human validation cycles

### Expected Outcomes

- **Efficient Development**: 30-45 minute sessions with 70% LLM autonomous work
- **Better Player Experience**: Human play-testing ensures engagement
- **Higher Success Rate**: Direct feedback prevents over-engineering
- **Replay Motivation**: Create games that make players say "One more time!"
