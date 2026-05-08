# claude-one-button-game-creation

Automatic one-button game generation using crisp-game-lib. LLMs design, implement, test, and improve compact browser games from random tags used as creative seeds.

`AGENTS.md` is a symlink to this file.

## Workflow Entrypoint

For the normal "create a one-button game" flow, follow this sequence:

1. Select tags:

   ```bash
   node scripts/random_tag_selector.js
   ```

2. Design the game with `.agents/skills/designing-one-button-games/SKILL.md`.
3. Implement it with `.agents/skills/developing-with-crisp-game-lib/SKILL.md`.
4. Validate and evaluate it. Run the static checks first (cheap, catches artifact issues before paying for GA):

   ```bash
   node scripts/check_generated_game.js tmp/games/<slug> --no-ga
   ```

   When static passes, run the full GA gate:

   ```bash
   node scripts/check_generated_game.js tmp/games/<slug>
   ```

5. If the checker reports `needs_improvement`, inspect the verbose GA log and improve the game with `.agents/skills/evaluating-gameplay-balance/SKILL.md`.
6. Repeat evaluation and improvement up to 3 total improvement attempts. Stop when the checker passes or after the third attempt.

Use `.agents/skills/designing-mini-games/SKILL.md` only when the task explicitly allows multiple inputs. Use `.agents/skills/maximizing-game-feel/SKILL.md` after core rules and balance are stable, or when visual polish/readability changes could affect play.

## Stable Project Constraints

- Generated games live in `tmp/games/<slug>/`.
- Required deliverables are `README.md`, `index.html`, and `main.js`.
- Tags are seeds for inspiration, not design specifications. Contradicting tags should create design tension rather than forcing literal implementation.
- The default game must use exactly one binary input: tap, hold, and/or release.
- Use crisp-game-lib only for generated browser games.
- For this repository, generated `index.html` files must pin `crisp-game-lib@1.5.0`; do not use `@latest`.
- Generated `main.js` must include `title`, `description`, `characters`, `options`, and `update()`.
- Avoid white as a visible gameplay color.

For crisp-game-lib coding constraints (helper placement for tester compatibility, draw-before-collide order, automatic score display), see `.agents/skills/developing-with-crisp-game-lib/SKILL.md`.

## Validation And Balance Gate

`scripts/check_generated_game.js` is the runtime gate for generated games. It checks required files and common tester constraints, runs the same GA harness used by `scripts/ga_tester.js` (with a fixed seed so iteration-to-iteration ratio diffs reflect real changes, not GA noise), and computes:

```bash
node scripts/check_generated_game.js tmp/games/<slug>
```

```text
GA ratio = ga.bestScore / monotonous.summary.maxScore
```

Status and diagnostic meanings (`status` is the exit-code state; `ratio.diagnostic` further classifies a `needs_improvement` outcome):

- `pass`: GA ratio is greater than `1.5`.
- `needs_improvement` + `diagnostic: mono_dominant` (ratio < 0.85): a monotonous-input pattern outscores the GA. Apply input-tradeoff or scoring patterns from `evaluating-gameplay-balance`.
- `needs_improvement` + `diagnostic: tied` (0.85 ≤ ratio ≤ 1.15): GA cannot exceed the monotonous baseline. Either the mechanic needs more search than the GA budget allows, or the design has a skill ceiling. Revisit `designing-one-button-games` rather than applying another balance pattern.
- `needs_improvement` + `diagnostic: marginal` (1.15 < ratio ≤ 1.5): close to passing; apply risk-based scoring or scoring-scale patterns.
- `fail`: required artifacts, static constraints, tester execution, or JSON output are invalid.

When improvement is needed, run:

```bash
node scripts/check_generated_game.js tmp/games/<slug> --verbose
```

Analyze `ga.detailedLog` only. Monotonous pattern logs are inappropriate-play baselines and should not drive improvement choices.

## Design Deliverable

Write `tmp/games/<slug>/README.md` with:

```markdown
# <GAME_NAME> (<slug>)

**Seeds**: #tag1, #tag2, #tag3

## 1. Core Mechanics

## 1.5 State Model and Tradeoff

## 2. Object Specifications

## 3. Design Principle Analysis

## 4. Relationship with Seeds

## 5. Basis for Novelty

## 6. Similarity Check
```

For per-section design content guidance (including why idle play, hold-only play, and mashing must each be worse than skilled play), see `.agents/skills/designing-one-button-games/references/one-button-design-guide.md`.

## Implementation Notes

For the HTML template, `main.js` skeleton, and crisp-game-lib API usage, see `.agents/skills/developing-with-crisp-game-lib/SKILL.md`. In this repository, `options` should set `audioSeed` (not `seed`) for reproducible BGM, matching existing games under `tmp/games/`.

Use `difficulty` for automatic scaling, for example:

```javascript
let count = 3 * sqrt(difficulty);
let speed = 1.0 + difficulty;
```

Prefer player placement that gives reaction time: vertical scrollers usually place the player near `y = 80`; side scrollers usually place the player near `x = 20`.

## Improvement Rules

If the GA ratio is `1.5` or lower:

1. Read the verbose checker output and inspect `ratio.diagnostic`.
2. Use `.agents/skills/evaluating-gameplay-balance/references/balance-patterns.md` before the legacy `balance-pattern-guide.md`.
3. Apply one structural improvement.
4. Rerun `scripts/check_generated_game.js`.

If an iteration's GA ratio strictly worsens versus the previous iteration, revert that change and try a different pattern; a clear regression is a wrong-direction signal, not a spent attempt against the 3-iteration limit.

If `diagnostic` is `tied` (or the GA score does not exceed the monotonous score across two consecutive attempts), revisit `designing-one-button-games` instead of applying another balance pattern — the mechanic likely has a skill ceiling that balance patterns cannot raise.

For anti-pattern improvements to avoid (numeric-only tuning, branch-only fixes, randomness as the primary answer), see `.agents/skills/evaluating-gameplay-balance/SKILL.md`.

If an improvement changes core rules or the input tradeoff, revisit the design with `designing-one-button-games`.

## Final Report

End game-generation tasks with:

```markdown
# Game Generation Report: <GAME_NAME>

## Selected Tags

- tag1, tag2, tag3

## Simulation Results

| Metric | Initial | After Improvement |
| :-- | :-- | :-- |
| Status | pass/needs_improvement/fail | pass/needs_improvement/fail |
| GA vs Monotonous | X.Xx | Y.Yx |

## Improvements Made

1. <Improvement content and reason>
```
