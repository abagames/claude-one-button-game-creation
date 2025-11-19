# dev/ Game Development Operations Guide

This document focuses on the flow "from designing, implementing, and validating new one-button games in the `dev/` directory to final publication." For repository-wide maintenance tasks (tags, snippets, etc.), refer to `REPO_MAINTENANCE.md`.

## Response Language

Follow the language of the user's first message and maintain consistency in subsequent responses.

## Flow Overview (6 Phases)

**Phase 0: Tag Selection and Initial Validation**: Review `reference/tags.csv`, `reference/games.csv`, and `knowledge/tag_code_map.json` to select game topic tags, and verify cross-category constraints and novelty scores.

**Phase 1: Problem-Solution Structuring**: Select problem categories from tag characteristics and design Baseline verb + Light improvement. Verify one-button compatibility.

**Phase 2: Creative Synthesis and Novelty Assurance**: Clarify differentiation elements from existing games, conduct exclusion filtering, logical walkthrough, and warning sign detection. Design visual communication specifications.

**Phase 3: Prototype in dev/**: Implement the game in `dev/index.html` + `dev/main.ts`. Pass similarity check (<70%) and verify basic operation. Complete any auxiliary modules within `dev/` only.

**Phase 4: Validation and Balance Tuning**: Consolidate tuning parameters as `const UPPER_SNAKE_CASE`, use `npm run verify-prototype` for lint, simulation, and GA diagnosis. Apply co-evolutionary balance tuning if necessary.

**Phase 5: Final Validation and Publication Decision**: Verify quality scores and novelty metrics with comprehensive evaluation (mode=full). Once approved, copy to `docs/<slug>/` and run `npm run build:game -- --game <slug>`. After publication, clean `dev/` for the next game.

## Pre-Work Checklist

- Review latest content of `game_generation_workflow.md`, `novelty_game_generation.md`, `game_evaluation_system.md`.
- In `one-button-game-design-guide.md`, select and fix one input type (press / hold / release), noting the reason.
- Re-confirm Netlify dual-build notes (`BUILD_MODE=dev`, `npm run build:dev` auto-execution) in `using_netlify.md`.
- Reference API and Balance Parameter Guidelines in `knowledge/crisp-game-lib-guide.md`.

## dev/ Workspace Rules

- Keep only one game in `dev/` at a time, always clean up after development completion.
- Entry points are `dev/index.html` and `dev/main.ts`. Complete any additional files within `dev/`.
- Rely on Netlify branch deploy; do not run `npm run dev` or `npm run build:dev` locally (unless user instructs).
- Do not directly modify `reference/` or `docs/`; only copy to `docs/` when publication is confirmed.
- `tmp/` is freely available for prototypes and experiment logs, but code under review must be consolidated in `dev/`.

## One-Button & Balance Parameters

- Use only one system: `input.isJustPressed` / `input.isPressed` / `input.isReleased`. Multi-button or pointer operations are prohibited.
- Self-check feedback and difficulty in the Evaluation section of `one-button-game-design-guide.md`; reconsider design if criteria are not met.
- Declare tuning targets such as speed, gravity, generation interval as top-level `const PARAM_NAME = value;` with concise usage comments.

## Detailed Workflow

### Phase 0: Tag Selection and Initial Validation
- Tags are metadata representing game elements (e.g., player behavior, enemies, background gimmicks). Consult `reference/tags.csv`, `reference/games.csv`, `knowledge/tag_code_map.json` for usage examples.
- Run `npm run generate-constraints` for automatic selection via cross-category constraints. Verify minimum category count (≥3), dominance prevention (single category ≤50%), and complexity balance.
- Calculate novelty score and obtain human approval. Identify anticipated problem category (Physics/Forces, Timing/Coordination, etc.).

### Phase 1: Problem-Solution Structuring
- Extract core movement patterns from tags selected in Phase 0 and choose problem category.
- Complete problem template: Clarify in "Player wants to / Current obstacle / Environmental constraint" format.
- Baseline verb identification + Light improvement: Maintain 3-second rule and verify one-button compatibility (Press/Hold/Release).
- Obtain human logic confirmation and resolve all ambiguities.

### Phase 2: Creative Synthesis and Novelty Assurance
- Investigate existing implementations from `knowledge/tag_code_map.json` and `knowledge/games/`, specify exclusions (victory condition, control method, visual representation, game loop).
- Verify implementation feasibility via logical walkthrough (Start → Action → Result → Feedback → End).
- Warning sign detection: Check for one-button constraint violations, problem definition defects, insufficient gameplay depth.
- Visual communication design: Specify 5 elements - problem presentation, action affordance, immediate feedback, progress display, failure warning.

### Phase 3: Implementation in dev/main.ts
- Adhere to Crisp Game Library structure (`title`, `description`, `options`, `update()`), use 2-space + semicolon formatting.
- **CRITICAL: Always end main.ts with `init({ update, title, description, characters, options });`** - This initialization call is REQUIRED to start the game. Forgetting this line will cause the game to not run.
- For complex state management, define types with TypeScript `type` and annotate variables (avoid JSDoc `@typedef` as TypeScript cannot infer).
- Place new functions/classes within `dev/` to avoid global naming collisions.
- Similarity check: If `npm run similarity-check` exceeds 70%, return to Phase 2. 40-70% requires human judgment, <40% is auto-approved.
- After implementation, always run `npx tsc --noEmit dev/main.ts` to confirm no TypeScript errors.

### Phase 4: Validation and Balance Tuning
- **TypeScript Check**: First run `npx tsc --noEmit dev/main.ts` to ensure all type errors are resolved.
- **Basic Validation**: Use `npm run verify-prototype -- --slug dev --file dev/main.ts --mode lint` for syntax/style checks.
- **GA Diagnosis**: Evaluate GA Resistance with `--mode ga`. Normalized monotonous score > 0.5 requires improvement, normalized GA score > 0.75 is ideal, intermediate requires human judgment.
- **Balance Tuning** (only if human selects): Parameter extraction → `balance_params.json` generation → co-evolution execution → re-diagnosis after tuning.
- Iterate until GA Resistance is maintained or improved. Fine-tune parameters until human satisfaction.

### Phase 5: Final Validation and Publication Decision
- **Comprehensive Evaluation**: Run `npm run verify-prototype -- --slug dev --file dev/main.ts --mode full` for lint + sim + novelty metrics.
- Verify quality scores: Technical (syntax, stability, vulnerability resistance), Design (balance, difficulty, control feel), Novelty (tag novelty, mechanic coherence, code originality), Overall.
- Obtain human final approval: Replay motivation, remaining issues, completion level.
- **Publication Gate** (only after approval):
  1. `mkdir -p docs/<slug>`
  2. `cp dev/index.html docs/<slug>/` and `cp dev/main.ts docs/<slug>/`
  3. `npm run build:game -- --game <slug>` → `docs/<slug>/dist/`
  4. Add link to `docs/index.html`
  5. `rm -rf dev/*` to empty `dev/`, recommended commit message `"Publish <slug> and clean dev/"`

Execute this procedure only when GitHub Pages publication is confirmed. When reusing `dev/` after publication, create a new branch from clean master.

## Branch Strategy

- Always empty `dev/` after publication before creating the next branch.
- For parallel development, use `tmp/games/<slug>/`; limit `dev/` modification to one branch.
- Prohibited example: Edit in another branch while `dev/` is filled → modify/delete conflicts occur at publication.
- Recommended flow:
  1. Publication and `dev/` cleanup on master
  2. Create new branch from clean master
  3. Complete 6 phases of this guide within branch
  4. Merge PR

## Human-LLM Collaboration Checkpoints

- **Universal Execution Protocol**: Apply `LLM AUTO-EXECUTE → HUMAN CHECKPOINT → LLM AUTO-ADJUST → COMPLETION CHECK` to each of the 6 phases.
- **Question Management**:
  - Blockers: Confirm with one clear question, resume work after response.
  - Assumptions: Explicitly state `Assumption: ...` and obtain approval.
  - Parameter questions: Adjust via post-implementation feedback.
- **Prohibited**: Dumping multiple choices, implementing with vague assumptions, advancing without feedback, moving to next phase below completion criteria.
- **Completion Criteria**:
  - Design preparation complete: Novelty review and One-Button policy approved, warning signs = 0.
  - Final confirmation: Clear basic operation and similarity check (<70%), evidence of GA Resistance within acceptable range.

## Reference Documents

- Flow details: `game_generation_workflow.md`, `novelty_game_generation.md`, `game_evaluation_system.md`
- Constraints and operations: `one-button-game-design-guide.md`, `knowledge/crisp-game-lib-guide.md`
- Collaboration protocol: `collaboration_guidelines.md`
- Netlify / dual build: `using_netlify.md`
- Repository maintenance tasks: `REPO_MAINTENANCE.md`

Update both documents simultaneously when consistency between development flow and maintenance guide breaks.
