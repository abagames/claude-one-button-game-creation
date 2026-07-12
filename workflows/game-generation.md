# Game Generation Workflow (One Game)

How to create ONE one-button game: Phase 1 (tag selection) → Phase 2
(design) → Phase 3 (implementation). Run it once per game; a batch is just
this workflow repeated with fresh tag seeds (see `AGENTS.md` for the
batch → selection flow).

This workflow is **deliberately gate-free**: it optimizes for variance
(diverse, novel games). Quality control happens downstream in
`workflows/game-selection.md` and never feeds rules back into this file.

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

**Reference**: `.agents/skills/designing-mini-games/` — the canonical source
for mini-game design craft. Bind its general input-scheme support to this
project's fixed brief: `button_types = 1`; one binary input expressed only
through press, hold, and release; no second key, chord, swipe, or auxiliary
input. **Use it with the generation profile below**: this workflow secures
diversity by generating many games without gates and selecting afterwards
(`workflows/game-selection.md`), so verification machinery that would narrow
the design space stays OUT of generation.

Generation profile (what to use at generation time):

- USE: the skill's Phase-1 ideation procedure (free association → record the
  first association and forbid it → deviation exploration → core experience →
  construct mechanics with the already-fixed `button_types = 1` scheme), the
  reference guide's four core principles (§2), contradiction-as-tension table
  (§7), and abstract-question prompts (§6).
- DO NOT USE at generation time: the skill's Phase-2 hardening steps 5–8,
  the reference guide's §8 machinery (state/tradeoff tables,
  monotonous-input invariant proofs, seed prechecks), or its §9 extended
  checklist. Exploit-resistance is
  measured by Stage 1 and fixed in Polish for winners only — requiring
  design-time proofs steers designs toward easily-provable archetypes and
  reduces batch variance (validated across batches 1–2: mono-flagged
  games ranked top-3 in human play).
- Output format: keep this file's 6-section README below (it is the
  stable Stage-2 input contract), not the skill's Appendix A.

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
- [ ] Is this NOT a clone or minor variation of a widely-known existing game?

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

## 6. Similarity Check

<List any known games with similar mechanics. Explain key differences that make this design distinct.>
```

---

## Phase 3: Implementation

**Reference**: `.agents/skills/developing-with-crisp-game-lib/` — read
`SKILL.md` (setup, implementation flow, mandatory rules, patterns) and its
`references/api.md` (complete API) / `references/examples.md` (working
loops). This skill is the canonical source for crisp-game-lib knowledge.

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

Make the increase perceptible within a short arcade session while keeping the
first interactions readable; cap rates before visual or control legibility
collapses.

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
    <script src="https://unpkg.com/crisp-game-lib@1.5.0/docs/bundle.js"></script>
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
  audioSeed: 0,
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

Generated games are batch-measured by the testers in `scripts/tester/`
(`one_button_game_tester.js`, `ga_tester.js`). They extract and execute only
the `update()` function.
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

Additional constraints so games run in BOTH the browser and the tester:

- **Use only the API documented in
  `.agents/skills/developing-with-crisp-game-lib/references/api.md`.** The
  tester mock exposes some globals the real library lacks (e.g. `sign`) —
  such a game passes simulation but crashes in the browser. "The tester
  accepts it" is not evidence the API exists.
- **Do lethal/score collision checks with `box`/`rect` or coordinate
  math.** `line`, `bar`, and `arc` have no collision detection in the
  simulator — a game whose game-over depends on them cannot be measured
  (use them for visuals only).
- **Score with `addScore(points, x, y)` (or `addScore(points, pos)`) when
  the event has a world position.** The tester logs score-event positions;
  prefer the `x, y` form for accurate coordinates in tester logs, and
  reserve positionless `addScore(points)` for events with no meaningful
  location.
- **Name the player object `player` and hazard arrays with keywords**
  (`enemies`, `obstacles`, `bullets`, `hazards`, `rocks`, `spikes`...).
  The tester identifies entities by variable name; unrecognized names
  degrade its analysis. Give entities a `pos` property (`vec`).

---

## Deliverables

```
tmp/games/<slug>/
├── index.html    # HTML template
├── main.js       # Game code
└── README.md     # Game description
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
