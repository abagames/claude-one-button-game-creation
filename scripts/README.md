# scripts/ Directory

This directory contains automation scripts for game generation, verification, and analysis.

## Overview

All 22 scripts are classified by role:

- **Group A (10)**: Main scripts directly executable from npm commands
- **Group B (3)**: Library scripts depended on by other scripts
- **Group C (2)**: Subcommands of verify_prototype
- **Group D (5)**: Manual execution or one-off tools
- **Group E (2)**: Internal testing and verification

## A. Main Scripts Executable from npm Commands

### Game Generation & Verification Workflow

#### `scaffold.js`
```bash
npm run scaffold -- --slug <slug> --tags "tag1,tag2"
```
- Generates boilerplate for new game prototypes
- Uses `knowledge/templates/game_base.js` as base template
- Creates directory in `tmp/prototypes/<slug>/`
- Tag-based snippet integration

#### `verify_prototype.js`
```bash
npm run verify-prototype -- --slug <slug> [--mode lint|sim|full|ga|comprehensive]
```
- Comprehensive prototype verification
- Modes: lint (syntax), sim (monotonic input), full (includes novelty), ga (GA diagnostics), comprehensive (all)
- See `game_evaluation_system.md` for details

#### `extract_balance_params.js`
```bash
npm run extract-balance-params -- --slug <slug>
```
- Extracts balance-adjustable parameters from game code
- Outputs to `tmp/prototypes/<slug>/balance_params.json`
- Detects parameters in `const UPPER_SNAKE_CASE` format

#### `coevolve_balance.js`
```bash
npm run balance-game -- --slug <slug> [--target-score 100] [--target-time 60]
```
- Automatic game balance adjustment using coevolutionary algorithm
- Alternates between Player GA (input optimization) and Balance GA (parameter adjustment)
- See `game_evaluation_system.md` "Automatic Balance Adjustment System" for details

### Novelty & Similarity Checks

#### `calculate_novelty_metrics.js`
```bash
npm run calculate-novelty -- --slug <slug>
```
- Calculates novelty metrics
- Analyzes tag overlap and mechanics differences with existing games
- See `novelty_game_generation.md` for details

#### `similarity_checker.js`
```bash
npm run similarity-check -- --slug <slug> [--threshold 0.7]
```
- Checks similarity with existing games
- Warns if tag similarity exceeds threshold (default 70%)
- See `novelty_game_generation.md` "Similarity Check" for details

#### `generate_cross_category_constraints.js`
```bash
npm run generate-constraints
```
- Generates cross-category constraint file
- Outputs to `knowledge/cross_category_constraints.json`
- Defines tag selection constraints for ensuring novelty

### Tag & Snippet Related

#### `fetch_tag_snippets.js`
```bash
npm run fetch-tag-snippets -- --tags "player:bounce,field:gravity" [--format markdown|json] [--out <path>]
```
- Extracts code snippets for specified tags
- Collects related snippets from `knowledge/snippets/`
- Generates context for LLM prompts

#### `test_fetch_tag_snippets_output.js`
```bash
npm run test:fetch-tag-snippets
```
- Validates output structure of fetch_tag_snippets
- Checks snippet consistency

#### `validate_tag_assignment.js`
```bash
npm run validate-tag -- --slug <slug>
```
- Validates appropriateness of tags assigned to games
- Confirms correspondence between tags and code implementation

## B. Library Scripts (Depended on by Others)

### `game-testing-framework.js`
**Used by**: test_game_framework.js, coevolve_balance.js

Core library for game testing. Provides the following classes:

- **GameSimulator**: Game state simulation
- **GAInputGenerator**: Input pattern generation using genetic algorithm
- **GameBalanceGA**: Balance parameter optimization
- **GameAnalyzer**: Comprehensive evaluation and metrics calculation

See `game_evaluation_system.md` for details

### `crisp_game_adapter.js`
**Used by**: game-testing-framework.js, coevolve_balance.js, test_game_framework.js

Adapts Crisp Game Library games to unified interface:

```javascript
const { createCrispGameAdapter } = require('./crisp_game_adapter.js');
const adapter = createCrispGameAdapter(gamePath);
// adapter.init(), adapter.update(), adapter.isGameOver(), adapter.getScore()
```

### `dynamic_game_injector.js`
**Used by**: game-testing-framework.js, coevolve_balance.js

Dynamic parameter injection into game code:

```javascript
const { injectParameters } = require('./dynamic_game_injector.js');
const result = injectParameters(gameCode, params, paramSpec, options);
```

## C. Subcommands of verify_prototype

### `check_game_style.js`
**Called by**: verify_prototype.js (lint mode)

```bash
node scripts/check_game_style.js --slug <slug>
```
- Syntax and style validation
- Checks 2-space indentation, semicolons, naming conventions

### `simulate_game.js`
**Called by**: verify_prototype.js (sim mode)

```bash
node scripts/simulate_game.js --slug <slug> [--frames 600] [--seed 0]
```
- Behavior simulation with monotonic input patterns
- Reproducible testing with fixed seed

## D. Manual Execution Tools

### `generate_metadata.js`
```bash
node scripts/generate_metadata.js
```
- **Execution timing**: When `reference/games.csv` or `reference/tags.csv` is updated
- Generates reverse lookup map from tags to games/functions/comments
- Output: `knowledge/tag_code_map.json`, `knowledge/games/<slug>.md`
- See `CLAUDE.md` Phase 1 for details

### `fetch_games.js`
```bash
node scripts/fetch_games.js
```
- **Execution timing**: Repository initialization or when updating existing games
- Fetches existing Crisp Game Library games to `reference/games/`
- References source URLs from `reference/game_urls.csv`

### `list_priority_tags.js`
```bash
node scripts/list_priority_tags.js [--min-priority medium] [--output tags.txt]
```
- **Execution timing**: Tag analysis/investigation
- Outputs tag list by priority
- Filters by `priority` column in `reference/tags.csv`

### `verify_mechanics.js`
```bash
node scripts/verify_mechanics.js --slug <slug>
```
- **Execution timing**: Quality checks
- Verifies that mechanics corresponding to tags are implemented
- Confirms correspondence between tags and code implementation

### `batch_validate_tags.js`
```bash
node scripts/batch_validate_tags.js --tags "tag1,tag2,tag3" [--parallel 3]
```
- **Execution timing**: Large-scale validation
- Parallel validation of multiple tags
- Batch validation of variant candidates

## E. Internal Testing & Verification

### `test_game_framework.js`
```bash
node scripts/test_game_framework.js --slug <slug> [--use-ga]
```
- Unit test for game-testing-framework.js
- Monotonic input test + optional GA diagnostics
- Outputs detailed results in JSON format

### `calculate_quality_scores.js`
```bash
node scripts/calculate_quality_scores.js --slug <slug>
```
- Validates quality score calculation
- Tests metrics calculation logic

## Dependency Diagram

```
【Entry Points】
scaffold.js
verify_prototype.js ─┬─ check_game_style.js
                      └─ simulate_game.js
extract_balance_params.js
coevolve_balance.js ─────┬─ game-testing-framework.js ─┬─ crisp_game_adapter.js
                         │                              └─ dynamic_game_injector.js
                         └─ crisp_game_adapter.js

test_game_framework.js ──┬─ game-testing-framework.js
                          └─ crisp_game_adapter.js

calculate_novelty_metrics.js
similarity_checker.js
generate_cross_category_constraints.js
fetch_tag_snippets.js
validate_tag_assignment.js

【Libraries】
game-testing-framework.js
crisp_game_adapter.js
dynamic_game_injector.js

【One-off Tools】
generate_metadata.js
fetch_games.js
list_priority_tags.js
verify_mechanics.js
batch_validate_tags.js
```

## Common Command Examples

### New Game Generation (Phase 3)
```bash
# 1. Scaffold
npm run scaffold -- --slug my_game --tags "player:bounce,field:gravity"

# 2. Verify (syntax only)
npm run verify-prototype -- --slug my_game --mode lint

# 3. Verify (comprehensive)
npm run verify-prototype -- --slug my_game --mode comprehensive
```

### Balance Adjustment (Phase 4)
```bash
# 1. Extract parameters
npm run extract-balance-params -- --slug my_game

# 2. Auto-adjust
npm run balance-game -- --slug my_game --target-score 100 --target-time 60

# 3. Re-verify
npm run verify-prototype -- --slug my_game --mode ga
```

### Ensuring Novelty (Phase 2)
```bash
# 1. Similarity check
npm run similarity-check -- --slug my_game

# 2. Novelty metrics
npm run calculate-novelty -- --slug my_game
```

### Metadata Update
```bash
# After CSV updates
node scripts/generate_metadata.js

# Re-fetch existing games
node scripts/fetch_games.js
```

## Related Documentation

- **`CLAUDE.md`**: Operations guide, phase-by-phase task guidelines
- **`game_generation_workflow.md`**: Integrated workflow (Phase 0-5)
- **`game_evaluation_system.md`**: Verification system, balance adjustment details
- **`novelty_game_generation.md`**: Novelty assurance mechanism, similarity checks
- **`collaboration_guidelines.md`**: Human-LLM collaboration, feedback templates
- **`knowledge/crisp-game-lib-guide.md`**: Crisp Game Library API reference

## Troubleshooting

### Script not found
```bash
# Check scripts section in package.json
cat package.json | grep -A 20 '"scripts"'
```

### Parameter extraction fails
- Verify game code uses `const UPPER_SNAKE_CASE = value;` format
- See `knowledge/crisp-game-lib-guide.md` "Balance Parameter Guidelines"

### Balance adjustment doesn't converge
- Increase `--max-iterations`
- Relax `--convergence` threshold
- See `game_evaluation_system.md` "Automatic Balance Adjustment System"

### Similarity check errors
- Run `node scripts/generate_metadata.js` to update `knowledge/tag_code_map.json`
- Verify consistency of `reference/games.csv`
