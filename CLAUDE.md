# claude-one-button-game-creation

Automatic one-button game generation using crisp-game-lib. LLMs design, implement, test, and improve compact browser games from random tags used as creative seeds.

`AGENTS.md` is a symlink to this file.

## Workflow Entrypoint

For the normal "create a one-button game" flow:

1. Select tags:

   ```bash
   node scripts/random_tag_selector.js
   ```

2. Design the game with `.agents/skills/designing-one-button-games/SKILL.md`.
3. Convert balance-critical idle / hold-only / mashing / skilled-play claims into implementation invariants with `.agents/skills/implementing-gameplay-invariants/SKILL.md`.
4. Implement with `.agents/skills/developing-with-crisp-game-lib/SKILL.md`, preserving the invariants.
5. Run static checks, then the full GA gate:

   ```bash
   node scripts/check_generated_game.js tmp/games/<slug> --no-ga
   node scripts/check_generated_game.js tmp/games/<slug>
   ```

6. If the checker reports `needs_improvement`, run verbose output, diagnose with `.agents/skills/evaluating-gameplay-balance/SKILL.md`, then apply the Improvement Rules triage to decide the repair path:

   ```bash
   node scripts/check_generated_game.js tmp/games/<slug> --verbose
   ```

7. Repeat evaluation and improvement up to 3 total improvement attempts. Stop when the checker passes or after the third attempt.

Use `.agents/skills/designing-mini-games/SKILL.md` only when the task explicitly allows multiple inputs. Use `.agents/skills/maximizing-game-feel/SKILL.md` after core rules and balance are stable, or when visual polish/readability changes could affect play.

## Stable Project Constraints

- Generated games live in `tmp/games/<slug>/`.
- Required deliverables are `README.md`, `index.html`, and `main.js`.
- Tags are seeds for inspiration, not design specifications. Contradicting tags should create design tension rather than forcing literal implementation.
- The default game must use exactly one binary input: tap, hold, and/or release.
- Use crisp-game-lib only for generated browser games.
- Generated `index.html` files must pin `crisp-game-lib@1.5.0`; do not use `@latest`.
- Generated `main.js` must include `title`, `description`, `characters`, `options`, and `update()`.
- `options` should set `audioSeed` for reproducible BGM, matching existing games under `tmp/games/`.
- Avoid white as a visible gameplay color.

For crisp-game-lib coding constraints such as helper placement, draw-before-collide order, automatic score display, templates, and API usage, use `.agents/skills/developing-with-crisp-game-lib/SKILL.md`.

## Validation Gate

`scripts/check_generated_game.js` is the runtime gate. It checks required artifacts and tester constraints, then runs the fixed-seed GA harness:

```text
GA ratio = ga.bestScore / monotonous.summary.maxScore
```

Outcome summary:

- `pass`: GA ratio is greater than `1.5`.
- `needs_improvement`: use `.agents/skills/evaluating-gameplay-balance/SKILL.md` for diagnosis, then apply the Improvement Rules triage to decide the repair path (design issue or implementation issue).
- `fail`: required artifacts, static constraints, tester execution, or JSON output are invalid.

For `needs_improvement`, use verbose output. Analyze GA exploratory behavior first; monotonous logs are baselines, not improvement instructions. If verbose output is too large or insufficient, add a small invariant-specific probe instead of guessing from the global ratio alone.

## Design Deliverable

Write `tmp/games/<slug>/README.md` with the required checker-facing structure:

```markdown
# <GAME_NAME> (<slug>)

**Seeds**: #tag1, #tag2, #tag3

## 1. Core Mechanics

## 1.5 State Model and Tradeoff

### Implementation Invariants

## 2. Object Specifications

## 3. Design Principle Analysis

## 4. Relationship with Seeds

## 5. Basis for Novelty

## 6. Similarity Check
```

For section content, including idle / hold-only / mashing weakness and skilled-play requirements, use `.agents/skills/designing-one-button-games/references/one-button-design-guide.md`.

## Improvement Rules

When `needs_improvement` is reported, triage the root cause before acting.

**Design issue — revise README, then re-implement `main.js` from scratch:**
- `diagnostic` is `tied`.
- `diagnostic` is `mono_dominant` and telemetry shows idle, hold-only, or safe-waiting dominance that the current README invariants do not prevent.
- Any second improvement attempt after a code-only fix did not improve the ratio.

**Implementation issue — fix `main.js` directly:**
- The README invariants correctly predict the expected behavior but the code violates them.
- `diagnostic` is `marginal` on a first attempt and a specific code-level cause is identifiable from telemetry.

**Design-issue path:**
1. Revise README sections "State Model and Tradeoff" and "Implementation Invariants" using `.agents/skills/designing-one-button-games/SKILL.md` to address the root cause.
2. Update implementation invariants with `.agents/skills/implementing-gameplay-invariants/SKILL.md`.
3. Discard the existing `main.js` and re-implement from scratch with `.agents/skills/developing-with-crisp-game-lib/SKILL.md`.

**Implementation-issue path:**
1. Use `.agents/skills/evaluating-gameplay-balance/SKILL.md` to identify the specific code-level cause from telemetry.
2. Apply one structural improvement at a time, then rerun `scripts/check_generated_game.js`.
3. If a fix changes idle / hold-only / mashing behavior, safe states, scoring pulses, combos, cooldowns, resource drains, or seeded early hazards/gaps, update invariants with `.agents/skills/implementing-gameplay-invariants/SKILL.md` before editing code.

**Both paths:**
- If the GA ratio strictly worsens, revert that change; a clear regression is not a spent attempt.
- Avoid numeric-only tuning, branch-only fixes, hidden tester-specific behavior, and randomness as the primary answer.

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
