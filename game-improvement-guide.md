# One-Button Game Improvement Guide

A guide for analyzing simulation logs and implementing fundamental game improvements beyond simple parameter adjustments.

## Important: The Primary Metric is GA Ratio

Evaluate using the ratio of **GA Score / Monotonous Max Score**. Do not use absolute values (10 points, 50 points, etc.).

- **GA Ratio ≤ 1.0**: Fail (monotonous input is optimal)
- **GA Ratio > 1.5**: Pass (skilled input is rewarded)

Survival time is not included in evaluation criteria. Long survival without scoring is not a problem.

## 1. Purpose of This Guide

Analyze the **simulation logs from GA-optimized patterns** output by `scripts/ga_tester.js --verbose` to achieve the following:

- **Root Cause Identification**: Identify design flaws, not just surface symptoms
- **Structural Improvement Proposals**: Propose rule/logic changes, not parameter adjustments
- **Field Generation Optimization**: Improve dynamic generation algorithms for obstacles/enemies/terrain

## 2. Log Analysis Perspectives

**Important**: The analysis target is the **GA-optimized pattern detailed log** (`ga.detailedLog`). Monotonous input logs (NoInput, HoldOnly, SpamPress) are not used for analysis. Monotonous inputs represent "inappropriate play," so analyzing their death causes or input patterns does not lead to improvement.

### 2.1 Death Analysis

Read the following from the `ga.detailedLog.deathAnalysis` section:

| Metric | Problem Indication | Possible Root Cause |
| :--- | :--- | :--- |
| Many deaths at same position | Deaths concentrated at specific coordinates | Unavoidable placement patterns, lack of safe zones |
| High velocity before collision | Large `approachAnalysis.playerVelocity` | Insufficient reaction time, lack of deceleration means |
| Death immediately after input | Death 1-3 frames after input | Input delay, unpredictable placement |
| Bias toward specific obstacle type | `collidedWith` concentrated on single type | Design problem with that obstacle's behavior |

### 2.2 Spawn Analysis

Read the following from the `ga.detailedLog.spawnAnalysis` section:

| Metric | Problem Indication | Possible Root Cause |
| :--- | :--- | :--- |
| Extremely small `minInterval` | Unavoidable due to consecutive spawns | Defect in interval control logic |
| Biased `spatialDistribution` | Only appears in specific areas | Random seed or generation range issue |
| Uneven `spawnTypes` distribution | Single type is dominant | Bias in type selection logic |

### 2.3 Scoring Analysis

Read the following from the `ga.detailedLog.scoringAnalysis` section:

| Metric | Problem Indication | Possible Root Cause |
| :--- | :--- | :--- |
| Single `triggers` | Limited score acquisition methods | Lack of risk/reward diversity |
| `scoringRate` uncorrelated with time | Survival time not reflected in score | Lack of time-based rewards |
| Extremely low/high `averageScore` | Balance breakdown | Design issue with score multiplier or acquisition opportunities |

### 2.4 Input Analysis

Read the following from the `ga.detailedLog.inputAnalysis` section:

| Metric | Problem Indication | Possible Root Cause |
| :--- | :--- | :--- |
| `pattern: "spam"` | Button mashing is optimal | Lack of penalty for input |
| `pattern: "hold_heavy"` | Holding is optimal | Lack of constraints on holding |
| Extreme `maxHoldDuration` | Hold time balance issue | Reward/risk design of hold mechanics |

## 3. Problem Patterns and Fundamental Solutions

### 3.1 Unavoidable Patterns

**Symptoms**:

- Deaths concentrated at specific positions
- Zero or extremely few near misses (`nearMisses`)
- Cannot avoid even with input in frames before death

**Parameter Adjustment (Insufficient)**:

```javascript
// ❌ Simple speed adjustment
obstacleSpeed = obstacleSpeed * 0.8;
```

**Fundamental Solution**:

```javascript
// ✅ Improvement of placement logic: guarantee safe routes
function spawnObstacle() {
  // Check distance from existing obstacles
  const safeDistance = playerSpeed * reactionFrames;
  let pos;
  let attempts = 0;

  do {
    pos = generateRandomPosition();
    attempts++;
  } while (!hasEscapeRoute(pos, safeDistance) && attempts < maxAttempts);

  // Skip spawn if no safe route exists
  if (attempts >= maxAttempts) return null;

  return createObstacle(pos);
}

// Validate safe route
function hasEscapeRoute(obstaclePos, minGap) {
  const playerY = player.pos.y;
  const escapeZones = [
    { min: 0, max: obstaclePos.y - minGap },
    { min: obstaclePos.y + obstacleSize + minGap, max: screenHeight },
  ];

  return escapeZones.some(
    (zone) =>
      zone.max - zone.min >= playerSize &&
      isReachable(playerY, zone, availableFrames)
  );
}
```

### 3.2 Monotonous Input Dominance

**Symptoms**:

- `inputAnalysis.pattern` is "spam" or "hold_heavy"
- High scores achievable even with monotonous input patterns

**Parameter Adjustment (Insufficient)**:

```javascript
// ❌ Simple cooldown addition
if (inputCooldown > 0) return;
inputCooldown = 10;
```

**Fundamental Solution**:

```javascript
// ✅ Rule change based on input rhythm
const inputHistory = [];
const RHYTHM_WINDOW = 60; // 1 second of input history

function processInput() {
  inputHistory.push({ tick: ticks, pressed: input.isJustPressed });

  // Remove old history
  while (
    inputHistory.length > 0 &&
    inputHistory[0].tick < ticks - RHYTHM_WINDOW
  ) {
    inputHistory.shift();
  }

  // Analyze input pattern
  const pattern = analyzePattern(inputHistory);

  if (pattern === "spam") {
    // Penalty for mashing: reduce input effectiveness
    inputEffectiveness *= 0.5;
    // Or make environment harsher
    spawnHostileObstacle();
  } else if (pattern === "rhythmic") {
    // Bonus for rhythmic input
    addScore(bonusPoints);
    // Or generate favorable environment
    spawnPowerUp();
  }
}

function analyzePattern(history) {
  const intervals = [];
  for (let i = 1; i < history.length; i++) {
    if (history[i].pressed && history[i - 1].pressed) {
      intervals.push(history[i].tick - history[i - 1].tick);
    }
  }

  if (intervals.length < 3) return "varied";

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) /
    intervals.length;

  if (avgInterval < 5) return "spam";
  if (Math.sqrt(variance) < avgInterval * 0.3) return "rhythmic";
  return "varied";
}
```

### 3.3 Lack of Difficulty Curve

**Symptoms**:

- `scoringAnalysis.scoringRate` is constant over time
- Game experience doesn't change even with long survival
- `spawnAnalysis.averageInterval` is constant

**Parameter Adjustment (Insufficient)**:

```javascript
// ❌ Simple linear difficulty increase
spawnInterval = baseInterval - ticks / 100;
```

**Fundamental Solution**:

```javascript
// ✅ Phase-based difficulty system
const PHASES = [
  {
    name: "tutorial",
    duration: 300, // 5 seconds
    rules: {
      obstacleTypes: ["slow_block"],
      spawnPattern: "single",
      safeZoneSize: 0.4, // 40% of screen
    },
  },
  {
    name: "ramp_up",
    duration: 600,
    rules: {
      obstacleTypes: ["slow_block", "fast_block"],
      spawnPattern: "pair",
      safeZoneSize: 0.3,
    },
  },
  {
    name: "challenge",
    duration: Infinity,
    rules: {
      obstacleTypes: ["slow_block", "fast_block", "homing"],
      spawnPattern: "wave",
      safeZoneSize: 0.2,
      // Introduce new mechanics
      newMechanic: "screen_shake_warning",
    },
  },
];

function getCurrentPhase() {
  let elapsed = 0;
  for (const phase of PHASES) {
    elapsed += phase.duration;
    if (ticks < elapsed) return phase;
  }
  return PHASES[PHASES.length - 1];
}

function spawnWithRules(rules) {
  const availableTypes = rules.obstacleTypes;
  const type = availableTypes[floor(rnd(0, availableTypes.length))];

  if (rules.newMechanic === "screen_shake_warning") {
    showWarning(spawnPosition);
    setTimeout(() => actuallySpawn(type), warningFrames);
  } else {
    actuallySpawn(type);
  }
}
```

### 3.4 Spatial Distribution Bias

**Symptoms**:

- `spatialDistribution.xRange` or `yRange` is narrow
- Deaths concentrated in specific areas
- Score acquisition positions are uniform

**Fundamental Solution**:

```javascript
// ✅ Grid-based spawn management
class SpawnGrid {
  constructor(cellSize = 20) {
    this.cellSize = cellSize;
    this.gridSize = Math.ceil(100 / cellSize);
    this.cellWidth = 100 / this.gridSize;
    this.cellHeight = 100 / this.gridSize;
    this.recentSpawns = new Map(); // cellId -> lastSpawnTick
    this.cellCooldown = 60; // Minimum interval between same cell spawns
  }

  getCell(x, y) {
    const cellX = floor(x / this.cellWidth);
    const cellY = floor(y / this.cellHeight);
    return `${cellX},${cellY}`;
  }

  getAvailableCells() {
    const available = [];
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        const cellId = `${x},${y}`;
        const lastSpawn = this.recentSpawns.get(cellId) || -Infinity;

        if (ticks - lastSpawn > this.cellCooldown) {
          available.push({
            id: cellId,
            center: {
              x: (x + 0.5) * this.cellWidth,
              y: (y + 0.5) * this.cellHeight,
            },
            weight: this.calculateWeight(x, y),
          });
        }
      }
    }
    return available;
  }

  calculateWeight(cellX, cellY) {
    // Prioritize cells far from player (improve predictability)
    const playerCell = this.getCell(player.pos.x, player.pos.y);
    const [px, py] = playerCell.split(",").map(Number);
    const distance = Math.abs(cellX - px) + Math.abs(cellY - py);

    // Weight based on distance
    return Math.max(1, distance);
  }

  spawn() {
    const available = this.getAvailableCells();
    if (available.length === 0) return null;

    // Weighted random selection
    const totalWeight = available.reduce((sum, c) => sum + c.weight, 0);
    let random = rnd(0, totalWeight);

    for (const cell of available) {
      random -= cell.weight;
      if (random <= 0) {
        // Random offset within cell
        const pos = {
          x: cell.center.x + rnds(this.cellWidth * 0.3),
          y: cell.center.y + rnds(this.cellHeight * 0.3),
        };

        this.recentSpawns.set(cell.id, ticks);
        return pos;
      }
    }

    return available[0].center;
  }
}
```

## 4. Improvement Process

### 4.1 Log Acquisition

```javascript
const {
  GameSimulator,
  createCrispGameAdapter,
} = require("./scripts/one_button_game_tester");

const simulator = new GameSimulator();
const gameConcept = createCrispGameAdapter("./games/src/my_game.js");

// Simulate with logging enabled
const result = simulator.simulateGame(
  gameConcept.init,
  gameConcept.update,
  gameConcept.isGameOver,
  gameConcept.getScore,
  {}, // simulationParams
  3600, // maxTicks (60 seconds)
  inputPattern, // GA-optimized pattern or test pattern
  gameConcept, // for crash detection
  { enabled: true, verboseMode: false } // logging options
);

// Output report in Markdown format
console.log(result.logMarkdown);
```

### 4.2 Analysis and Improvement Proposal Generation

Use the following prompt template to request improvements from LLM:

````
## Input

### Game Code
<game_code>
{Game JavaScript code}
</game_code>

### Simulation Log
<simulation_log>
{Contents of result.logMarkdown}
</simulation_log>

## Task

Analyze the above simulation log and perform the following:

1. **Problem Identification**: List 3 or more design issues readable from the log
2. **Root Cause Analysis**: Identify root cause of each problem (logic, not parameters)
3. **Improvement Code Generation**: Present specific code modifications for each problem

### Constraints
- Proposals with only parameter adjustments (speed, interval, size value changes) are not allowed
- Must include changes to field generation logic, rules, or mechanics
- Modified code must fit within 150 lines
- Must comply with crisp-game-lib API specifications

### Output Format

```markdown
## Problem Analysis

### Problem 1: [Problem Name]
- **Symptom**: [Symptom readable from log]
- **Root Cause**: [Why this problem occurs]
- **Impact**: [Impact on game experience]

## Improvement Proposals

### Improvement 1: [Improvement Name]
- **Target Problem**: Problem 1
- **Approach**: [How to solve]
- **Code Changes**:

\`\`\`javascript
// Before
{Original code}

// After
{Improved code}
\`\`\`

## Expected Effects After Improvement
- [Effect 1]
- [Effect 2]
````

````

### 4.3 Improvement Verification

After improvement, run simulation again to verify effects:

```javascript
// Before/after comparison
const beforeResult = runSimulation(originalGame);
const afterResult = runSimulation(improvedGame);

console.log('Before:', {
  score: beforeResult.score,
  survival: beforeResult.duration / 60,
  nearMisses: beforeResult.log?.summary?.nearMisses
});

console.log('After:', {
  score: afterResult.score,
  survival: afterResult.duration / 60,
  nearMisses: afterResult.log?.summary?.nearMisses
});
````

## 5. Improvement Evaluation Criteria

**Primary metric is GA ratio** (GA Score / Monotonous Max Score).

### Primary Metric

```
GA Ratio = ga.bestScore / monotonous.summary.maxScore
```

| GA Ratio | Evaluation | Meaning |
| :--- | :--- | :--- |
| ≤ 1.0 | Fail | Monotonous input is optimal (no skill required) |
| 1.0 - 1.5 | Needs review | Depends on game type |
| > 1.5 | Pass | Skilled input is rewarded |

### Auxiliary Metrics (from detailed log)

| Metric | Good State | Problematic State |
| :--- | :--- | :--- |
| Near miss rate | 10-30% | 0% or over 50% |
| Death cause diversity | 3+ types | Single type over 80% |
| Input pattern | "varied" | "spam" or "hold_heavy" |
| Spatial utilization | Distributed across all areas | Concentrated in specific areas |

## 6. Anti-patterns

Avoid the following improvements:

### ❌ Only Numerical Adjustments

```javascript
// Only hides the problem, doesn't solve it
speed *= 0.8;
interval += 10;
```

### ❌ Only Adding Conditions

```javascript
// Only increases complexity, doesn't solve root cause
if (tooHard) makeEasier();
```

### ❌ Increasing Randomness

```javascript
// Increasing unpredictability doesn't improve fairness
spawnY = rnd(0, 100) + rnd(-10, 10) * difficulty;
```

### ❌ Addressing Monotonous Input with Simple Time Constraints or Energy Systems

## 7. Recommended Patterns

### ✅ Structural Rule Changes

```javascript
// Environment changes based on player behavior
if (playerBehavior === "aggressive") {
  enableCounterMechanic();
}
```

### ✅ Improved Predictability

```javascript
// Introduce advance warning system
spawnWithWarning(position, warningDuration);
```

### ✅ Improved Spatial Design

```javascript
// Placement algorithm that guarantees safe routes
spawnWithEscapeRoute(obstacles);
```
