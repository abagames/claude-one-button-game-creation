# Game Evaluation and Verification System

## Overview

A system that evaluates auto-generated games from multiple perspectives—quality, playability, and technical completeness—and provides feedback for continuous improvement. Through static analysis, dynamic simulation, and metrics collection, it achieves objective evaluation of generated outputs and accumulates insights for future generation.

**Relationship with Integrated Workflow:**
- This document provides detailed specifications for the **evaluation and verification infrastructure**
- For actual game generation, use the 6-phase process (Phase 0-5) in **`game_generation_workflow.md`**
- This system's capabilities are utilized in Phase 4 (Verification and Balance Tuning)
- For practical Human-LLM collaboration guidelines, see **`collaboration_guidelines.md`**

## Evaluation Framework

### 3-Tier Evaluation Architecture

#### Level 1: Static Analysis (lint)

- **Syntax & Style Verification**: ESLint compliance, 2-space indentation, trailing semicolons
- **Required Elements Check**: Presence of `title`, `description`, `options`, `update()` function
- **Dependency Analysis**: Detection of undefined variables, unused variables, circular references
- **Crisp Game Library Compliance**: Verification of API usage, naming conventions, structural patterns

#### Level 2: Simulation Verification (sim)

- **Operability**: Game loop execution, crash/infinite loop detection
- **Input Response**: Reaction to button presses, state transition normality
- **Game End Conditions**: Appropriateness of end() calls, win/loss determination
- **Performance**: Measurement of frame rate, memory usage, rendering load

#### Level 3: Comprehensive Evaluation (full)

- **Basic Verification**: lint (syntax & style) + sim (operation verification with monotonous input patterns)
- **Novelty Metrics**: Automatic calculation of tag combination novelty, mechanic consistency, code originality
- **Playability Indicators**: Quantification of difficulty curve, learnability, control feel
- **Note**: GA-optimized input pattern evaluation is not included. Use `--mode ga` for vulnerability diagnosis.

## Verification Toolset

### Basic Verification Scripts

#### `scripts/verify_prototype.js`

##### Mode List

| Mode            | Execution Content                                           | Purpose                                              |
| --------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| `lint`          | Syntax & style verification only                            | Basic code quality check                             |
| `sim`           | Operation verification with monotonous input patterns       | Game operation check and basic vulnerability detection |
| `full`          | lint + sim + novelty metrics + quality scores               | Comprehensive quality evaluation (excluding GA)      |
| `ga`            | lint + sim-ga (GA-optimized input) + quality scores         | Advanced vulnerability diagnosis                     |
| `comprehensive` | lint + sim + sim-ga + novelty metrics + quality scores      | Complete quality & vulnerability evaluation (most time-consuming) |

**Note**: The `novelty` mode was documented but doesn't exist in the implementation. Novelty evaluation is integrated into `full` and `comprehensive` modes.

##### Execution Examples

```bash
# Basic lint verification
npm run verify-prototype -- --slug <slug> --mode lint

# Simulation execution (monotonous patterns)
npm run verify-prototype -- --slug <slug> --mode sim

# Comprehensive quality evaluation (lint + sim + novelty metrics + quality scores)
npm run verify-prototype -- --slug <slug> --mode full

# Vulnerability evaluation with GA-optimized input patterns
npm run verify-prototype -- --slug <slug> --mode ga

# Complete evaluation (sim + sim-ga + novelty + quality scores)
npm run verify-prototype -- --slug <slug> --mode comprehensive

# Verification of adjusted game (using --file option)
npm run verify-prototype -- --slug <slug> --file tmp/prototypes/<slug>/adjusted_game.js --mode ga
```

##### TypeScript File Verification

**Automatic Transpilation Support** (implemented 2025-11-09):

verify_prototype.js automatically detects and transpiles `.ts` files:

```bash
# Specify TypeScript file directly
npm run verify-prototype -- --slug dev --file dev/main.ts --mode full

# Verification of published game
npm run verify-prototype -- --slug ricochet_pins --file docs/ricochet_pins/main.ts --mode sim
```

**Processing Flow**:
```
dev/main.ts
  ↓ [.ts extension detected]
esbuild transpilation (remove type information)
  ↓
preprocessing (remove imports, convert const/let→var, remove init())
  ↓
tmp/transpiled/main.js (eval-ready JavaScript)
  ↓
crisp_game_adapter.js (eval execution)
  ↓
simulation & evaluation
```

**Intermediate Files**:
- `tmp/transpiled/*.js` - Transpiled code (not tracked by Git)
- Can be checked with `cat tmp/transpiled/main.js` for debugging

**Limitations**:
- Type checking is not performed (use editor's TypeScript Language Server during development)
- Dynamic imports and other ESM module features cannot be used (due to eval execution)
- Error line numbers may reference intermediate files

#### `scripts/check_game_style.js`

- **File Format**: JavaScript syntax, file size, character encoding
- **Code Quality**: Function length, complexity, nesting level, comment ratio
- **Crisp Compliance**: Appropriate use of global variables, update function structure

#### `scripts/simulate_game.js`

- **Auto-Play**: Operation test with random/strategic input
- **State Tracking**: Recording game state changes and event occurrences
- **Anomaly Detection**: Error occurrence, unexpected termination, performance degradation

### Advanced Analysis Tools

#### Metrics Collection System

**CSV Schema** (`knowledge/metrics/tag_combo_history.csv`):

```csv
date,tags,slug,outcome,notes,ga_best_score,ga_resistance,technical_score,design_score,novelty_score,overall_score
2025-10-03,"player:rotate|field:outpost|rule:physics",rotor_outpost,pass,mode=comprehensive,85,Low,78,65,82,75
```

#### Quality Scoring (Implemented)

Automatically calculated scores on a 0-100 scale:

- **Technical Score (0-100)**: Syntax accuracy (40 points), execution stability (30 points), vulnerability resistance (30 points)

  - Syntax: ESLint pass/fail
  - Stability: Survival rate with monotonous input
  - Resistance: Resistance to GA-optimized input

- **Design Score (0-100)**: Game balance (50 points), difficulty appropriateness (30 points), control feel (20 points)

  - Balance: Evaluated based on deviation from target survival time (30-60 seconds)
  - Difficulty & control feel: Tentatively full marks (planned for future implementation)

- **Novelty Score (0-100)**: Tag novelty (40%), mechanic consistency (30%), code originality (30%)

  - Normalizes existing `calculateAllMetrics()` to 0-100 scale

- **Overall Score (0-100)**: Weighted composite score
  - GA mode: Technical 40%, Design 35%, Novelty 25%
  - Normal mode: Technical 35%, Design 35%, Novelty 30%

**Implementation**: `scripts/calculate_quality_scores.js`, automatically calculated in `full`/`ga`/`comprehensive` modes

## Evaluation Criteria and Benchmarks

### Technical Quality Standards

#### Mandatory Pass Items

- [ ] ESLint errors: 0
- [ ] Required global variables defined (`title`, `description`, `options`)
- [ ] `update()` function implementation
- [ ] Clear game end conditions
- [ ] Input processing responsiveness verified
- [ ] Unused variables/functions: 0

### Game Design Quality Standards

#### Playability Indicators

- **Learning Curve**: Time from first play to mastery (target: 30-120 seconds)
- **Difficulty Progression**: Appropriateness of difficulty adjustment with score increase
- **Engagement Factor**: Play continuation rate, replay motivation measurement
- **Feedback Quality**: Clarity of cause-and-effect between actions and results

#### Balance Evaluation

- **Success Rate**: Average player survival/clear rate (target: 20-80%)
- **Score Distribution**: Score variance, extreme value occurrence frequency
- **Input Responsiveness**: Delay from button press to screen response
- **Visual Clarity**: Object distinguishability, color contrast

### Novelty & Creativity Standards

#### Differentiation Indicators

- **Mechanic Novelty**: Degree of introducing operations/rules not in existing games
- **Tag Fusion Effectiveness**: Measurement of multi-tag combination effects
- **Surprise Factor**: Frequency of unexpected developments/discoveries for players
- **Replayability**: Existence of different strategies/approaches

#### Similarity Constraints

- **Tag Overlap**: Common tag rate with existing games < 60%
- **Mechanic Similarity**: Overlap degree of behavior patterns < 50%
- **Victory Condition**: Ensuring uniqueness of win conditions
- **Control Scheme**: Differentiation of control methods

## Automatic Balance Tuning System

### Overview

A system that uses coevolutionary genetic algorithms (GA) to converge balance parameters of auto-generated games toward target metrics (score, survival time).

### Positioning

**Treatment Tool**: Adjusts newly generated games, or games with detected vulnerabilities, to target metrics desired by the designer. Combined with the GA-optimized input pattern evaluation (diagnostic tool) described later, it creates an "adjust → verify" cycle.

### Architecture

#### 1. Parameter Extraction Prompt Generation

```bash
# Generate parameter extraction prompt for agent
npm run extract-balance-params -- --slug <slug>
```

- **Processing**: Reads game code and generates extraction instructions (prompt) for agent
- **Output**: `tmp/prompts/extract_params_<slug>.md`
- **Next Step**: Agent reads prompt, extracts parameters, and generates `tmp/prototypes/<slug>/balance_params.json`
- **JSON Contents**: Path, current value, suggested range, description, impact, code location

**Extraction Example**:

```json
{
  "gameSlug": "crater_dash",
  "parameters": [
    {
      "path": "buggy.hop.y",
      "currentValue": -3,
      "suggestedMin": -5,
      "suggestedMax": -1.5,
      "description": "Buggy jump vertical velocity",
      "balanceImpact": "high",
      "location": "line 65"
    }
  ]
}
```

#### 2. Dynamic Parameter Injection

- **Feature**: Dynamic injection of extracted parameter values into game code
- **Strategy**: 3-tier fallback (line-based → global-search → hierarchical)
- **Robustness**: Handles line number shifts and naming changes

#### 3. Coevolutionary Loop

```bash
# Alternating execution of Player GA and Balance GA
npm run balance-game -- --slug <slug> --target-score 100 --target-time 45
```

**Important**: Balance GA's fitness function adopts **score gap optimization** to ensure monotonous input resistance.

**Process**:

1. **Player GA**: Evolve high-score input patterns with fixed parameters (see GA Evolution Process below for details)
2. **Evaluation**: Calculate difference between achieved score/time and target
3. **Balance GA**: Evolve parameters to approach target metrics with fixed input pattern
4. **Convergence Check**: Exit if difference is below threshold, otherwise return to 1

**Output**:

- `tmp/prototypes/<slug>/adjusted_game.js` - Adjusted game code
- `tmp/prototypes/<slug>/adjusted_params.json` - Adjusted parameters

### Usage Example

```bash
# 1. Generate parameter extraction prompt
npm run extract-balance-params -- --slug crater_dash

# 2. Agent reads prompt and generates balance_params.json (manual verification)

# 3. Execute coevolution
npm run balance-game -- --slug crater_dash \
  --target-score 100 \
  --target-time 45 \
  --max-iterations 5 \
  --player-gens 30 \
  --balance-gens 20

# 4. Check adjustment results
cat tmp/prototypes/crater_dash/adjusted_params.json

# 5. Test adjusted game (verify with GA evaluation described later)
npm run verify-prototype -- --slug crater_dash \
  --file tmp/prototypes/crater_dash/adjusted_game.js \
  --mode ga
```

### GA Configuration Parameters

| Parameter          | Default | Description                    |
| ------------------ | ------- | ------------------------------ |
| `--target-score`   | 100     | Target score                   |
| `--target-time`    | 60      | Target survival time (seconds) |
| `--max-iterations` | 5       | Maximum coevolution iterations |
| `--player-gens`    | 30      | Player GA generations          |
| `--balance-gens`   | 20      | Balance GA generations         |
| `--convergence`    | 5.0     | Convergence threshold          |

### Technical Features

#### Player GA (Input Pattern Evolution)

- **Variable-Length Genome**: Simultaneously searches for optimal input pattern length
- **Bloat Prevention**: Genome length penalty (fitness = score - length × coefficient)
- **Tournament Selection**: Prevents elite domination
- **3 Types of Mutation**: Value change, insertion, deletion to maintain pattern diversity

#### Balance GA (Parameter Tuning)

- **Multi-Objective Fitness Function**:
  ```javascript
  scoreGap = gaResult.score - maxMonotonousScore;
  fitness =
    gapWeight * -scoreGap + scoreWeight * scoreDiff + timeWeight * timeDiff;
  ```
- **Score Gap Priority**: `gapWeight: 2.0` promotes skill-based play
- **Monotonous Input Test**: Automatically evaluates NoInput / HoldOnly / SpamPress
- **Minimum Gap Constraint**: Default 20-point gap ensured (`minScoreGap: 20`)
- **Automatic Vulnerability Reduction**: Monotonous input resistance built into fitness, improved as a byproduct of adjustment
- **Context-Preserving Injection**: Parent object search prevents misplacement

**Effects**:

- Conventional method: Vulnerability worsened (Moderate → High), monotonous input average +267%
- Score gap method: Vulnerability maintained, monotonous input average +26% (10× improvement)

### Limitations

- **Crisp Game Library Only**: Depends on global variable-based game structure
- **Numeric Parameters Only**: Strings, arrays, object structures not supported
- **Single File**: Parameters spanning multiple files not supported
- **Manual Verification Required**: Adjustment results must be verified by humans before application

## GA-Optimized Input Pattern Evaluation

### Overview

Using genetic algorithms (GA), automatically searches for input patterns that maximize game scores, detecting vulnerabilities from rhythmic inputs that cannot be found with monotonous patterns (no input, hold, spam).

### Positioning

**Diagnostic Tool**: Evaluates presence and degree of vulnerabilities for newly generated games or games after automatic balance tuning. GA Resistance (Low/Moderate/High) determines the need for adjustment.

### Relationship with Automatic Balance Tuning

**Same Mechanism, Different Purpose**:

- **Input Pattern Generation**: Both use `GAInputGenerator.evolve()` from `game-testing-framework.js` (variable-length genome, tournament selection, 3 types of mutation)
- **Execution Count**: GA evaluation runs once for diagnosis; automatic balance tuning re-runs at each iteration to track parameter changes
- **Evaluation Scope**: GA evaluation includes wide-range testing with random patterns; Balance GA tests only 3 types of monotonous input

**Why Re-Diagnosis is Needed After Tuning**:

Coevolution considers vulnerabilities but doesn't guarantee complete elimination:

1. **Weighting Tradeoff**: Gap prioritized with `gapWeight: 2.0` but may prioritize target score achievement in competition with `scoreWeight: 1.0`
2. **Parameter Space Constraints**: Game designs exist where gap assurance and target metric achievement cannot both be satisfied within suggested ranges in `balance_params.json`
3. **Evaluation Scope Difference**: Balance GA tests only 3 monotonous input types; GA evaluation further explores vulnerabilities with random patterns

**Track Record**: From game_evaluation_system.md:369-370, score gap method achieves vulnerability **maintenance** (prevention of worsening, not complete elimination)

### GA Evolution Process

※Same algorithm as Player GA in automatic balance tuning system

- **Gene Representation**: Variable-length array of `[(interval_ms, duration_ms), ...]`
- **Population Size**: 30 individuals (default)
- **Generations**: 20 generations (default)
- **Fitness**: `Game Score - (Gene Length × Penalty Coefficient)`
- **Evolution Operations**: Tournament selection, single-point crossover, 3 types of mutation (value change, insertion, deletion)
- **Seed Control**: Evaluation under fixed seed (details below)

### Multi-Range GA Search

**Overview**: Automatically discovers optimal input rhythm for each game by executing independent GA evolution across multiple time interval ranges according to game characteristics, and selecting the best result.

#### Background and Purpose

Optimal input timing varies greatly by game:

- **Short-Interval Games**: Require quick reactions (e.g., rapid tapping, high-speed dodging)
- **Long-Interval Games**: Long holds effective (e.g., timing-based, inertia control)

GA search with a single time range (e.g., 50-2000ms) tends to converge to intermediate solutions, potentially missing true optimal solutions. Multi-Range Search explores independently across multiple ranges and adopts the best result.

#### Implementation

**Parameter Specification**:

```javascript
// game-testing-framework.js testGAOptimizedPatterns
const gaConfig = {
  populationSize: 30,
  generations: 20,
  seed: 42,
  timeRanges: [
    { minValue: 30, maxValue: 500 },    // Short interval range
    { minValue: 500, maxValue: 2000 }   // Long interval range
  ]
};
```

**Search Process**:

1. Execute independent GA evolution for each time range (using fixed seed)
2. Compare best scores from each range
3. Adopt result from range achieving highest score
4. Record range usage information (`rangeUsed`, `rangeIndex`) in result

**Execution Example**:

```javascript
// pin_climb test results
Range 1 (30-500ms):   Best Score = 260, Survival = 12.82s
Range 2 (500-2000ms): Best Score = 412, Survival = 13.73s
→ Range 2 adopted (58% higher score)
```

#### Effects and Track Record

**pin_climb Verification Results**:

| Time Range  | Best Score | Survival Time | Genome Length | Typical Pattern                   |
| ----------- | ---------- | ------------- | ------------- | --------------------------------- |
| 30-500ms    | 260        | 12.82s        | 3             | interval=74ms, duration=465ms     |
| 500-2000ms  | **412**    | 13.73s        | 18            | interval=706ms, duration=1313ms   |

**Conclusion**: pin_climb was found to be optimal with long-interval long-hold patterns. Short-interval search alone achieved only 63% of optimal solution.

#### Recommended Time Ranges

Recommended ranges by game type:

| Game Type                | Recommended Range 1 | Recommended Range 2 | Reason                             |
| ------------------------ | ------------------- | ------------------- | ---------------------------------- |
| **General** (initial)    | 30-500ms            | 500-2000ms          | Cover both short/long extremes     |
| **Fast Action**          | 30-300ms            | 300-1000ms          | More granular short-interval search|
| **Timing-Focused**       | 300-1000ms          | 1000-3000ms         | Focus on longer intervals          |

#### Technical Details

**Implementation Location**: `game-testing-framework.js:1868-1922`

```javascript
// Default when timeRanges not specified
const timeRanges = config.timeRanges || [{ minValue: 50, maxValue: 2000 }];

// Independent evolution for each range
for (let i = 0; i < timeRanges.length; i++) {
  const range = timeRanges[i];
  const rangeConfig = { ...config, minValue: range.minValue, maxValue: range.maxValue };
  const evolutionResult = GAInputGenerator.evolve(simulator, gameConcept, {}, rangeConfig);

  // Track best result
  if (finalResult.score > bestOverallScore) {
    bestOverallResult = { ...finalResult, rangeUsed: range, rangeIndex: i };
  }
}
```

**Return Value**:

```javascript
{
  bestScore: 412,
  bestSurvivalTime: 13.73,
  bestGenome: [...],
  rangeUsed: { minValue: 500, maxValue: 2000 },
  rangeIndex: 1,
  totalRangesTested: 2
}
```

#### Limitations and Considerations

- **Computational Cost**: Execution time increases proportionally to number of ranges (2 ranges ≈ 2× time)
- **Range Design**: Too much overlap creates redundancy; too much separation may miss optimal solutions
- **Fixed Seed Required**: Fair comparison between ranges requires execution under fixed seed

#### Recommended Usage Scenarios

**Recommended Cases**:

- ✅ Initial evaluation (optimal rhythm for game unknown)
- ✅ Re-evaluation after tuning (optimal range may have changed with parameter changes)
- ✅ Games with multiple anticipated play styles

**Unnecessary Cases**:

- ❌ Games with known optimal range (use same range for retest)
- ❌ Strict time constraints (single range sufficient)
- ❌ Monotonous input testing only (not using GA)

### Seed Control Policy

**Important Design Decision**: All tests (GA evolution, monotonous input, random patterns) are conducted **under fixed seed**.

#### Reasoning

Essence of one-button games:
- Players cannot "operate in real-time according to game situation"
- Can only learn rhythm/timing of "when to press button"
- Success if "good rhythm" exceeds "bad rhythm (monotonous input)" in fixed game progression

Evaluation Goal:
```
Under fixed seed:
  GA-optimized input score > Monotonous input score
  → Success as skill-based design

  GA-optimized input score ≤ Monotonous input score
  → Needs improvement (player learning not rewarded)
```

#### Implementation

**Random Number Generator**: Self-implemented Xorshift128 algorithm
- Fast, lightweight, deterministic pseudo-random generation
- No external library dependencies
- Set seed with `GameSimulator.setSeed(seed)`

**Test Execution Order**:
1. Fix seed with `simulator.setSeed(42)`
2. GA evolution: Search optimal input pattern under fixed seed
3. Monotonous input test: Evaluate with same fixed seed
4. Random pattern test: Evaluate with same fixed seed
5. Result: Fair comparison under same game progression

**Code Example**:
```javascript
// game-testing-framework.js
const simulator = new GameSimulator();
simulator.setSeed(42);  // Set fixed seed

// GA evolution (under fixed seed)
const gaResult = GameAnalyzer.testGAOptimizedPatterns(
  simulator, gameConcept, params, { seed: 42 }
);

// Monotonous input test (execute with same seed)
const monotonousResult = GameAnalyzer.testMonotonousPatterns(
  simulator, gameConcept, params
);

// Fair comparison
console.log(`GA Score: ${gaResult.bestScore}`);
console.log(`Monotonous Score: ${monotonousResult.averageMonotonousScore}`);
```

#### Difference from Non-Fixed Seed

| Aspect                   | Fixed Seed (Adopted)                      | Non-Fixed Seed                              |
| ------------------------ | ----------------------------------------- | ------------------------------------------- |
| **Evaluation Target**    | "Optimal rhythm for this game progression"| "Generic strength across all progressions"  |
| **GA Convergence**       | High (clear search space)                 | Low (different progression each time)       |
| **Evaluation Fairness**  | High (all patterns same conditions)       | Low (luck element mixed in)                 |
| **One-Button Alignment** | High (essence of rhythm learning)         | Low (overvalues situation response)         |

### Evaluation Metrics

- **GA Best Score**: Best score found by evolution under fixed seed
- **GA Survival Time**: Survival time with best pattern
- **Genome Length**: Complexity of optimal pattern (number of pairs)
- **GA Resistance**:
  - **Low** (0-50 points): Good GA resistance, good game balance
  - **Moderate** (50-100 points): Medium vulnerability, tuning recommended
  - **High** (100+ points): High vulnerability, needs improvement

### Execution Examples

```bash
# GA-optimized evaluation (lint + sim-ga)
npm run verify-prototype -- --slug rotor_outpost --mode ga

# Re-diagnosis of adjusted game
npm run verify-prototype -- --slug rotor_outpost \
  --file tmp/prototypes/rotor_outpost/adjusted_game.js \
  --mode ga
```

### Composite Evaluation Score

- **Monotonous Input Resistance**: 0-3 points
- **GA Input Resistance**: 0-3 points
- **Total Score**: 0-6 points
- **Rating**: POOR / AVERAGE / GOOD / EXCELLENT

### Metrics Recording

Automatically recorded in `knowledge/metrics/tag_combo_history.csv`:

- `ga_best_score`: GA best score
- `ga_resistance`: Low / Moderate / High

### Improvement Recommendations

When GA vulnerability is detected:

- Difficulty design that doesn't depend on input timing
- Introduce penalties for monotonous repetitive patterns
- Add mechanics requiring diverse player behaviors
- Implement adaptive difficulty adjustment
- **Apply automatic balance tuning system** (when target metrics are clear)

## Utilizing Evaluation Results

### Feedback Loop

#### Immediate Improvement

- **Automatic Fixes**: Automatic correction of syntax errors, naming convention violations
- **Warning Display**: Notification to developers of potential issues
- **Recommendations**: Suggestions for better implementation methods

#### Mid-to-Long-Term Improvement

- **Pattern Analysis**: Extract common features of successful/failed games
- **Tag Effect Measurement**: Statistics on which tag combinations produce high quality
- **Generation Model Tuning**: Prompt improvement, constraint condition optimization

### Knowledge Accumulation System

#### Evaluation History Database

```json
{
  "slug": "sentinel_orbit",
  "evaluationDate": "2025-10-03T10:30:00Z",
  "scores": {
    "technical": 78,
    "design": 65,
    "novelty": 82,
    "overall": 75
  },
  "issues": [
    "Difficulty spike at score 500",
    "Color contrast insufficient for blue objects"
  ],
  "recommendations": [
    "Add gradual enemy speed increase",
    "Use light_blue instead of blue for visibility"
  ]
}
```

#### Learning Success Patterns

- **High-Rated Tag Combinations**: `player:rotate + field:outpost + weapon:artillery`
- **Effective Mechanics**: "Gradual difficulty increase", "Enhanced visual feedback"
- **Patterns to Avoid**: "Monotonous repetition", "Unclear victory conditions"

## Integrated Verification Flow

### Overview

A complete cycle of generation → diagnosis → judgment → tuning → re-diagnosis ensures generation of games meeting quality standards.

### Complete Verification Flow

```bash
# ========================================
# Step 1: Generation and Static Analysis
# ========================================
npm run scaffold -- --slug new_game
npm run verify-prototype -- --slug new_game --mode lint
# → Check syntax errors, required elements

# ========================================
# Step 2: Operation Verification and GA Diagnosis
# ========================================
npm run verify-prototype -- --slug new_game --mode ga
# → Operation check + GA vulnerability diagnosis
# Example output: GA Resistance: Moderate (75 points)

# ========================================
# Step 3: Judgment and Branching
# ========================================
# GA Resistance determination:
#   Low (0-50 points) → Go to Step 5 (no tuning needed)
#   Moderate/High (50+ points) → Go to Step 4 (tuning recommended/required)

# ========================================
# Step 4: Automatic Balance Tuning (Conditional)
# ========================================
# 4-1. Parameter Extraction
npm run extract-balance-params -- --slug new_game
# → Generate tmp/prompts/extract_params_new_game.md

# 4-2. Agent Parameter Definition
# → Generate tmp/prototypes/new_game/balance_params.json (manual verification)

# 4-3. Execute Coevolution
npm run balance-game -- --slug new_game \
  --target-score 100 \
  --target-time 45 \
  --max-iterations 5
# → Generate tmp/prototypes/new_game/adjusted_game.js

# 4-4. Re-Diagnosis After Tuning (Required)
npm run verify-prototype -- --slug new_game \
  --file tmp/prototypes/new_game/adjusted_game.js \
  --mode ga
# → Verify vulnerability hasn't worsened
# Acceptance criteria: Same or better than before tuning (Low maintained or Moderate→Low improvement)

# ========================================
# Step 5: Comprehensive Evaluation and Metrics Recording
# ========================================
npm run verify-prototype -- --slug new_game --mode full
# → Evaluate playability, novelty, overall score

# Metrics recording
node scripts/update_quality_metrics.js --slug new_game
```

### Judgment Criteria and Recommended Actions

**Evaluation Core: Normalized Scores (Scale-Independent)**

Since score scales differ by game, normalized scores are used:
- **Normalized GA Score** = GA Score / (GA Score + Monotonous Score)
- **Normalized Monotonous Score** = Monotonous Score / (GA Score + Monotonous Score)

| Normalized Monotonous Score | Normalized GA Score | Judgment              | Recommended Action                    | Reason                                                   |
| --------------------------- | ------------------- | --------------------- | ------------------------------------- | -------------------------------------------------------- |
| **> 0.5**                   | Any                 | Needs Improvement     | **Apply automatic balance tuning**    | Monotonous input dominant or nearly equal = true vulnerability |
| **≤ 0.5**                   | **> 0.75**          | Ideal (Skill-Based)   | Proceed to Step 5 (no tuning needed)  | GA overwhelmingly dominant = skill-based design          |
| **≤ 0.5**                   | **≤ 0.75**          | Needs Verification    | Human judgment (hold auto-tuning)     | Possible GA capability limit or balanced design          |

**Important**:
- Evaluate by **relative balance**, not absolute score values
- Normalization absorbs score scale differences
- Low-score games like lland (both 1 point) can be appropriately handled as "Needs Verification"

**Acceptance Criteria After Tuning**:

- ✅ **Maintained**: Same Resistance category as before tuning (e.g., Moderate → Moderate)
- ✅ **Improved**: Move to better category (e.g., High → Moderate)
- ❌ **Worsened**: Move to worse category (e.g., Moderate → High) → Re-adjust parameters or redesign game

### Cases Where Tuning Fails

In the following cases, vulnerabilities may remain even with automatic balance tuning:

1. **Parameter Space Limits**: Target metrics and gap assurance cannot both be satisfied within suggested ranges in `balance_params.json`
2. **Fundamental Game Design Issues**: Structural vulnerabilities that cannot be solved by simple numerical tuning (e.g., continuous invincibility, score calculation logic flaws)
3. **Multi-Objective Conflicts**: Gap assurance sacrificed as a result of prioritizing target score achievement (`scoreWeight` vs `gapWeight` tradeoff)

**Countermeasures**:

- Expand parameter ranges (manually adjust `suggestedMin/Max`)
- Review game logic (manual code fixes)
- Reset target metrics (change to more realistic values)

## Operational Workflow (Legacy Reference)

The following is a staged operational example. The integrated verification flow above is recommended.

### 1. Automatic Evaluation After Prototype Generation

```bash
# Immediate evaluation after scaffold
npm run scaffold -- --slug rotor_outpost
npm run verify-prototype -- --slug rotor_outpost --mode lint
# → Check basic syntax & structure
```

### 2. Staged Quality Improvement

```bash
# Re-evaluation after problem fixes
npm run verify-prototype -- --slug rotor_outpost --mode sim
# → Operation check, performance test

# Final quality check (metrics also auto-recorded)
npm run verify-prototype -- --slug rotor_outpost --mode full
# → Comprehensive evaluation of playability, balance, novelty
# → Automatically appends to knowledge/metrics/tag_combo_history.csv
```

**Note**: `full`, `ga`, and `comprehensive` modes automatically record metrics to `knowledge/metrics/tag_combo_history.csv`.

## Continuous Improvement Plan

### Improving Evaluation Accuracy

1. **Machine Learning Introduction**: Build quality prediction models from past evaluation data
2. **Player Feedback**: Collect and integrate actual playtest data
3. **Expert Evaluation**: Incorporate qualitative evaluations by game designers

### Automation Expansion

1. **Real-Time Evaluation**: Quality checks concurrent with code changes
2. **A/B Testing**: Automatic comparison and optimization of multiple variants
3. **Adaptive Generation**: Dynamic adjustment of generation parameters based on evaluation results

## Improvement Case Studies

- **Similarity Check Feature**: Introduction prevents duplication with existing games
- **Category Constraints**: Reduced games dominated by single category
- **3-Phase Prompt**: Novelty score improved by average 15%
- **GA Input Patterns**: Detected vulnerabilities not found by monotonous input with 6.4× higher efficiency
- **Coevolutionary Balance Tuning**: Reduced manual tuning effort through convergence to target metrics

## Reference Files

- Verification Scripts: `scripts/verify_prototype.js`, `scripts/check_game_style.js`
- Balance Tuning: `scripts/extract_balance_params.js`, `scripts/dynamic_game_injector.js`, `scripts/coevolve_balance.js`
- GA Framework: `game-testing-framework.js` (GameBalanceGA, GameBalanceIndividual)
- Metrics Recording: `knowledge/metrics/tag_combo_history.csv`
- Quality Reports: `knowledge/logs/YYYYMMDD-verify-prototype.md`
- Evaluation Settings: `knowledge/metrics/README.md`
