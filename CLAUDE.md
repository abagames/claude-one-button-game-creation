# claude-one-button-game-creation

An automatic one-button game generation project using crisp-game-lib. LLM designs, implements, and improves games using tags as seeds for inspiration.

---

## Workflow Overview

- Phase 1: Tag Selection → Phase 2: Design → Phase 3: Implementation → Phase 4: Test → Phase 5: Improvement
- Phase 4 to Phase 5 iterates up to 3 times

---

## Phase 1: Tag Selection

```bash
node scripts/random_tag_selector.js
```

| Option         | Description                    | Default      |
| :------------- | :----------------------------- | :----------- |
| `-n, --count`  | Number of tags to select       | 3            |
| `-s, --seed`   | Random seed (for reproduction) | Current time |
| `-f, --format` | text/json/markdown             | markdown     |

**Important**: Tags are "seeds for inspiration," not "design specifications." Use contradicting tags as creative tension.

---

## Phase 2: Game Design

**Reference**: `one-button-game-design-guide.md` §7

### Design Procedure

1. **Free Association**: Verbalize images that come to mind from tags
2. **Deviation Exploration**: Consider the "opposite," "negation," or "extreme" of tags
3. **Core Experience Decision**: Define the "momentary sensation" you want to give the player in one phrase
4. **Mechanics Construction**: Design one-button operation that realizes the core experience
5. **Consistency Verification**: Confirm with checklist below

### Design Checklist

- [ ] Does it complete with one button?
- [ ] Is the game over condition single and visually obvious?
- [ ] Cannot achieve high scores with button mashing or idle play?
- [ ] Is skilled input rewarded in the design?
- [ ] Are there moments of feeling "I've never seen this before"?

### Output Format

Write the following to `tmp/games/<slug>/README.md`:

```markdown
# <GAME_NAME> (<slug>)

**Tags**: #tag1, #tag2, #tag3

## 1. Core Mechanics

<Input → Behavior → End condition, scoring system, difficulty increase mechanism>

## 2. Object Specifications

<Each object's shape, behavior, collision handling>

## 3. Design Guide Analysis

<Evaluation against four core design principles (Simplicity and Intuitiveness, Visual Feedback and Game Over, Skill-Based Scoring and Risk/Reward, Novel Mechanics)>

## 4. Relationship with Tags

<Idea development from tags>

## 5. Basis for Novelty

<Elements beyond existing patterns>
```

---

## Phase 3: Implementation

**Reference**: `crisp-game-lib-guide.md`

### Constraints

- **Lines**: About 150 lines
- **Dependencies**: crisp-game-lib only
- **Structure**: Include `title`, `description`, `characters`, `options`, `update()`

### Difficulty Settings

Use `difficulty` variable (auto-increasing) for difficulty increase:

```javascript
let count = 3 * sqrt(difficulty); // Gradually increases
let speed = 1.0 + difficulty; // Gradually accelerates
```

### Output Location

Place the following in `tmp/games/<slug>/`:

- `index.html` - HTML template
- `main.js` - Game code

### HTML Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>GAME_NAME</title>
    <meta
      name="viewport"
      content="width=device-width, height=device-height, user-scalable=no, initial-scale=1, maximum-scale=1"
    />
    <script src="https://unpkg.com/algo-chip@1.0.2/packages/core/dist/algo-chip.umd.js"></script>
    <script src="https://unpkg.com/algo-chip@1.0.2/packages/util/dist/algo-chip-util.umd.js"></script>
    <script src="https://unpkg.com/crisp-game-lib@latest/docs/bundle.js"></script>
    <script src="./main.js"></script>
    <script>
      window.addEventListener("load", onLoad);
    </script>
  </head>
  <body style="background: #ddd"></body>
</html>
```

### Implementation Template

```javascript
title = "GAME_NAME";

description = `
[Hold] Action
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let player;
let obstacles;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 80) };
    obstacles = [];
  }

  // Input handling
  if (input.isJustPressed) {
    // On button press
  }
  if (input.isPressed) {
    // While button held
  }

  // ★Important: Drawing order for collision detection
  // Draw detection targets "first" (cannot detect objects drawn later)

  // 1. Draw player first
  color("cyan");
  box(player.pos, 6);

  // 2. Draw obstacles later and detect collision with player (cyan)
  color("red");
  obstacles.forEach((obs) => {
    if (box(obs.pos, 8).isColliding.rect.cyan) {
      end(); // Collision with player
    }
  });
}
```

### Implementation Notes

#### Collision Detection Drawing Order (Important)

In crisp-game-lib, **collision detection only works with objects drawn earlier**.

```javascript
// ❌ Doesn't work: player (cyan) doesn't exist yet when drawing obstacles
obstacles.forEach(o => box(o.pos, 8));  // red
box(player.pos, 6);                      // cyan (later)

// ✅ Correct: Draw detection targets first
box(player.pos, 6);                      // cyan (first)
obstacles.forEach(o => {
  if (box(o.pos, 8).isColliding.rect.cyan) { ... }  // red
});
```

#### Tester Compatibility (Important)

Testers (`one_button_game_tester.js`, `ga_tester.js`) extract and execute only the `update()` function.
**Helper functions defined outside `update()` are not recognized.**

```javascript
// ❌ Doesn't work in tester
function spawnEnemies() { ... }  // Function outside update
function update() {
  spawnEnemies();  // ReferenceError: spawnEnemies is not defined
}

// ✅ Tester compatible: Inline logic within update
function update() {
  if (!ticks) {
    // Write initialization logic directly here
  }
  // Write spawn logic directly here
}
```

---

## Phase 4: Simulation (GA Relative Evaluation)

Evaluate using **GA Score / Monotonous Score** ratio only.

```bash
node scripts/ga_tester.js tmp/games/<slug>/main.js
```

### Output Format

```json
{
  "gameName": "example",
  "monotonous": {
    "patterns": {
      "NoInput": { "survivalTime": 2.3, "score": 0 },
      "HoldOnly": { "survivalTime": 1.8, "score": 5 },
      "SpamPress": { "survivalTime": 3.1, "score": 12 }
    },
    "summary": {
      "avgScore": 5.67,
      "maxScore": 12,
      "avgSurvivalTime": 2.4,
      "maxSurvivalTime": 3.1
    }
  },
  "ga": {
    "bestScore": 87,
    "bestSurvivalTime": 15.2,
    "bestGenomeLength": 42,
    "generationsRun": 30,
    "populationSize": 50
  },
  "error": null
}
```

### Evaluation Metrics (LLM calculates and judges)

```
GA Ratio = ga.bestScore / monotonous.summary.maxScore
```

| GA Ratio  | Evaluation   | Meaning                                         |
| :-------- | :----------- | :---------------------------------------------- |
| ≤ 1.0     | Fail         | Monotonous input is optimal (no skill required) |
| 1.0 - 1.5 | Needs review | Skill reflection is insufficient                |
| > 1.5     | Pass         | Skilled input is rewarded                       |

### Condition to Proceed to Phase 5

- GA ratio ≤ approximately 1.5

---

## Phase 5: Improvement

**Reference**: `game-improvement-guide.md`

### 5a: Get Detailed Log

```bash
node scripts/ga_tester.js tmp/games/<slug>/main.js --verbose
```

Get **GA-optimized pattern detailed log** with `--verbose` option.

**Important**: Analysis target is `ga.detailedLog` only. Monotonous input logs (NoInput, HoldOnly, SpamPress) represent "inappropriate play" and are not used for improvement analysis.

#### Detailed Log Structure

```json
{
  "gameName": "example",
  "monotonous": {
    "patterns": { ... },
    "summary": { ... }
  },
  "ga": {
    "bestScore": 87,
    "bestSurvivalTime": 15.2,
    "bestGenomeLength": 42,
    "generationsRun": 30,
    "populationSize": 50,
    "detailedLog": {
      "summary": { "survivalTime": "15.20s", "totalScore": 87, ... },
      "deathAnalysis": {
        "cause": "game_logic",
        "position": { "x": 50, "y": 30 },
        "approachAnalysis": { "playerVelocity": { "x": "0.00", "y": "-1.50" } },
        "recentFrames": [ ... ]
      },
      "scoringAnalysis": {
        "totalEvents": 25,
        "triggers": { "enemy_destroy": 15, "item_collect": 10 },
        "scoringRate": { "0": 10, "1": 15, "2": 20 }
      },
      "spawnAnalysis": {
        "totalSpawns": 45,
        "averageInterval": "45.2",
        "minInterval": 20,
        "maxInterval": 80,
        "spatialDistribution": { "xRange": [10, 90], "yRange": [0, 100] }
      },
      "inputAnalysis": {
        "pattern": "varied",
        "totalPresses": 85,
        "maxHoldDuration": 30
      }
    }
  }
}
```

### 5b: Log Analysis and Improvement

Follow `game-improvement-guide.md` to identify problems from detailed log and improve.

#### Analysis Perspectives (refer to `ga.detailedLog`)

| Analysis Item        | What to Check                                                     | Problem Indication                    |
| :------------------- | :---------------------------------------------------------------- | :------------------------------------ |
| **Death Analysis**   | `ga.detailedLog.deathAnalysis.position`, `recentFrames`           | Deaths concentrated at same position  |
| **Spawn Analysis**   | `ga.detailedLog.spawnAnalysis.minInterval`, `spatialDistribution` | Interval or spatial distribution bias |
| **Scoring Analysis** | `ga.detailedLog.scoringAnalysis.triggers`, `scoringRate`          | Lack of acquisition method diversity  |
| **Input Analysis**   | `ga.detailedLog.inputAnalysis.pattern`                            | `spam` or `hold_heavy`                |

### Recommended Approaches

| Priority | Approach                 | Example                                |
| :------- | :----------------------- | :------------------------------------- |
| High     | Improve placement logic  | Spawn that guarantees safe routes      |
| High     | Introduce warning system | Visual warning before obstacle appears |
| Medium   | Phase-based difficulty   | Introduce new mechanics over time      |
| Medium   | Input pattern response   | Mashing penalty, rhythm bonus          |

### Prohibited Items

```javascript
// ❌ Only numerical adjustment
speed *= 0.8;

// ❌ Only adding conditions
if (tooHard) makeEasier();

// ❌ Increasing randomness
spawnY = rnd(0, 100) + rnd(-10, 10);
```

Return to Phase 4 after improvement (up to 3 times).

---

## Deliverables

```
tmp/games/<slug>/
├── index.html    # HTML template
├── main.js       # Game code
└── README.md     # Game description
```

### Final Report Format

```markdown
# Game Generation Report: <GAME_NAME>

## Selected Tags

- tag1, tag2, tag3

## Simulation Results

| Metric           | Initial | After Improvement |
| :--------------- | :------ | :---------------- |
| Evaluation       | X/6     | Y/6               |
| GA vs Monotonous | X.Xx    | Y.Yx              |

## Improvements Made

1. <Improvement content and reason>
```

---

## Project Structure

```
game-tags/
├── tmp/games/                      # Generated games
│   └── <slug>/
│       ├── index.html              # HTML template
│       ├── main.js                 # Game code
│       └── README.md               # Game description
├── scripts/
│   ├── random_tag_selector.js      # Tag selection
│   ├── one_button_game_tester.js   # 4a: Fast test (monotonous input)
│   ├── ga_tester.js                # 4b: Detailed test (GA enabled)
│   ├── crisp_game_adapter.js       # Library adapter
│   └── dynamic_game_injector.js    # Parameter injection
├── tags.csv                        # All tags (107)
├── one-button-game-design-guide.md # Design guide
├── game-improvement-guide.md       # Improvement guide
└── crisp-game-lib-guide.md         # API reference
```

---

## Tag Categories

| Category      | Description            | Examples                                |
| :------------ | :--------------------- | :-------------------------------------- |
| `player`      | Player characteristics | `player-rotate`, `player-multiple`      |
| `on_pressed`  | On button press        | `on_pressed-jump`, `on_pressed-turn`    |
| `on_holding`  | While button held      | `on_holding-move`, `on_holding-charge`  |
| `on_released` | On button release      | `on_released-throw`                     |
| `on_got_item` | On item acquisition    | `on_got_item-power_up`                  |
| `field`       | Field characteristics  | `field-auto_scroll`, `field-1D`         |
| `rule`        | Game rules             | `rule-physics`, `rule-combo_multiplier` |
| `weapon`      | Weapons/Attacks        | `weapon-explosion`, `weapon-reflect`    |
| `obstacle`    | Obstacles              | `obstacle-chase`, `obstacle-penalty`    |
