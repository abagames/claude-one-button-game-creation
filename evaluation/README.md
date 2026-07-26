# crisp-game-lib Play-Log Quality Evaluation Workflow

This document defines a workflow for coding agents that converts one-button action
mini-games built with crisp-game-lib into private mechanical evaluation targets executable in a fresh Node VM,
and evaluates their play-log mechanical quality.

It bundles an extended crisp-game-lib, a generic Node VM executor, schemas, baseline policies, and conformance tests.
It does not assume a runner in another directory or the implementation of any specific game.

Evaluation observes only `runtime_result` and `private_drawing_annotation`. Therefore, the only output this
workflow can produce is a `simulator_only_unverified` private mechanical evaluation. Distribution runtimes,
rendered presentation, perception, audio, on-screen instructions, and human experience are out of scope.

Working notes on the next steps and known open items live in [BACKLOG.md](BACKLOG.md) (non-normative).

## Reading order

1. [AGENTS.md](AGENTS.md)
2. [WORKFLOW.md](WORKFLOW.md)
3. [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md)
4. [SIMULATOR_USAGE.md](SIMULATOR_USAGE.md)
5. [CONTRACTS.md](CONTRACTS.md)
6. [GLOSSARY.md](GLOSSARY.md)
7. [GAME_ADAPTER_TEMPLATE.md](GAME_ADAPTER_TEMPLATE.md)
8. [PLAY_LOG_ANALYSIS.md](PLAY_LOG_ANALYSIS.md)

## Included runtime

```text
runtime/
  simulator.mjs          adapter-registry-based fresh-VM executor
  episode-contracts.mjs  request/result validation
  artifact-contracts.mjs shared artifact validation
  annotation-diff.mjs    annotation-only source gate
  input-sequence.mjs     logical-tick input and canonical hash
  baseline-policies.mjs  idle/hold/periodic/seeded-random
  baseline-matrix.mjs    matched-seed baseline request/execution
  adapter-conformance.mjs game-agnostic smoke/exact-replay gate
  counterfactual-evaluation.mjs counterfactual equivalence and divergence evaluation
  play-log-analysis.mjs  derived event generation and counterfactual input construction
  play-log-feasibility.mjs development-only feasibility gate
  play-log-quality-evaluator.mjs shared Stage 8–13 executor
  play-log-ranking.mjs play-log quality ordinal ranking
  play-log-ranking-renderer.mjs deterministic ranking report renderer
  play-log-ranking-hashes.mjs ranking hash sidecar
  index.mjs              public module entrypoint
schemas/                 versioned JSON Schemas for the runtime
scripts/                 diff, artifact validation, and quality/ranking CLIs
vendor/crisp-game-lib/   fixed bundle with annotation/manual-step extensions
tests/                   game-independent conformance tests and controlled fixtures
```

## Files required to run

The following files are required to run this workflow in a fresh environment. Prerequisites are Node.js 20.11+
(uses `import.meta.dirname`; verified on Node 24) and running `npm ci --ignore-scripts` and `npm test`.
For artifacts and temporary files, see "Not required" below.

### Normative documents

- `AGENTS.md`, `WORKFLOW.md`, `RUNTIME_CONTRACT.md`, `SIMULATOR_USAGE.md`, `CONTRACTS.md`, `GLOSSARY.md`,
  `GAME_ADAPTER_TEMPLATE.md`, `PLAY_LOG_ANALYSIS.md`, `README.md`

### Package definition

- `package.json`, `package-lock.json` (the only dependency is `ajv`; both files are included so `npm ci`
  reproduces the exact dependency tree, and `node_modules/` need not be shipped)

### Shared runtime and CLI

- `runtime/` — the 16 files listed under "Included runtime" above
- `scripts/check-annotation-diff.mjs`
- `scripts/intake-batch-games.mjs` — Stage 0 intake freeze and artifact scaffolding for a batch
- `scripts/evaluate-play-log-quality.mjs` — CLI entrypoint for the shared Stage 8–13 executor
- `scripts/evaluate-batch8-v3.mjs` — reference implementation of the current batch driver (its structure is
  checked by tests). It points at an `evaluation-config.mjs` under `batches/`, which lives outside this
  workflow snapshot; copy it when starting a new batch rather than running it as shipped
- `scripts/rank-play-log-quality.mjs`
- `scripts/render-play-log-analysis.mjs`
- `scripts/validate-artifact.mjs`
- `scripts/verify-play-log-ranking-hashes.mjs`

### Schemas

The 15 files in `schemas/`:

- `annotation-plan.private.v1.schema.json`
- `episode-run-request.v0.schema.json`
- `game-manifest.v1.schema.json`
- `input-sequence.v1.schema.json`
- `play-log-analysis-result.v1.schema.json` / `play-log-analysis-result.v2.schema.json`
- `play-log-evaluation-stop.v1.schema.json`
- `play-log-feasibility.private.v1.schema.json`
- `play-log-quality-plan.private.v1.schema.json` / `play-log-quality-plan.private.v2.schema.json`
- `play-log-quality-result.v1.schema.json`
- `play-log-ranking-contract.v1.schema.json` / `play-log-ranking-result.v1.schema.json` / `play-log-ranking-hashes.v1.schema.json`
- `private-episode-result.v0.schema.json`

### Fixed bundle

- `vendor/crisp-game-lib/docs/bundle.js` — fixed bundle with annotation/manual-step extensions. Its content hash
  is verified in every evaluation. The rest of `vendor/crisp-game-lib/` (`src/`, build configuration, etc.) is only
  for regenerating the bundle and is not required to run the workflow.

### Tests and fixtures

- The 6 tests in `tests/` (`annotation-diff.test.mjs`, `play-log-evidence.test.mjs`,
  `play-log-quality-evaluator.test.mjs`, `play-log-quality-fixtures.test.mjs`, `runtime-conformance.test.mjs`,
  `workflow-contracts.test.mjs`)
- `tests/fixtures/annotated-one-button.js`, `tests/fixtures/wide-view-one-button.js`,
  `tests/fixtures/legacy-play-log-quality-plan.private.v1.json`
- `tests/fixtures/games/` — two self-contained control games with a known mechanical ground truth, each
  shipped as an `original/` + `instrumented/` annotation-only pair with its adapter, private policy, and
  frozen quality plan:
  - `causal-lane-runner/` — positive control: input drives reward, hazard exposure, and death
  - `inert-timer/` — negative control: input changes nothing and the terminal cannot be mapped to annotations

The test suite is self-contained: it does not read `generated/` or `batches/`. `npm test` runs both control
games end to end through the shared Stage 8–13 executor and asserts their criterion values, so the classifier
itself — not only the games — stays under test. Fixture evaluation artifacts are written under
`tmp/play-log-quality-fixtures/`.

### Input games

The user provides the `main.js` of each crisp-game-lib one-button game to be evaluated. In this repository
those live in `../tmp/games/<slug>/main.js` (a freshly generated batch) or `../docs/<slug>/main.js`
(published games). `npm run intake:batch -- <batch-id> <source-directory> [game-id ...]` performs the Stage 0
freeze and scaffolds the manifest, adapter, intake record, and batch evaluation-config skeleton with correct
hashes; annotation planning, the instrumented copy, the private policy, and the quality plan remain agent
work. See `../workflows/game-evaluation.md` for the surrounding procedure.

### Not required (artifacts and temporary files)

- Evaluation artifacts under `generated/` (the test suite no longer depends on any of them)
- Ranking outputs and executed evaluation-config records under `batches/`
- `archive/` (retired material from past workflows)
- `tmp/`, `node_modules/`, `.git`

Setup and runtime conformance check:

```bash
cd evaluation
npm ci --ignore-scripts
npm test
```

`npm test` checks determinism inside the Node VM, annotation capture, the annotation-only diff gate
(including its bypass attempts), hash fail-closed behavior, image-capture rejection, and the criterion
classification of the two control games. It does not replace per-game qualification.

Shared CLI:

```bash
npm run intake:batch -- <batch-id> <source-directory> [game-id ...]
npm run check:annotation-diff -- <original.js> <instrumented.js> [result.json]
npm run validate:artifact -- <artifact-kind> <artifact.json>
npm run rank:play-logs -- batches/<ranking-id>/play-log-ranking-contract.json batches/<ranking-id>
npm run verify:play-log-ranking-hashes -- batches/<ranking-id>/play-log-ranking-hashes.json
npm run render:play-log-quality -- generated/<game-id>/play-log-quality-result.json generated/<game-id>/ANALYSIS.md
```

The only formal output paths of the current workflow are the play-log quality result and `rank:play-logs`.
The legacy aggregate report, legacy no-rank batch, and legacy held-out preparation pipeline have been retired
to `archive/` and are not invoked from the current CLI.

The agent creates the annotation targets, private policy, criterion evidence rules, and seed/budget contents for
each game. Schemas, diff judgment, the diagnostic control matrix, artifact validation, and ranking use the bundled
shared implementations; do not re-implement them per game.

Follow [PLAY_LOG_ANALYSIS.md](PLAY_LOG_ANALYSIS.md) for how to fix the best/median/failure/same-seed diagnostic
controls from the analysis episode pool and analyze raw private frames, counterfactuals, and mechanical
risk–reward. Fix `play-log-quality-plan.private.json` before accessing results, and do not use legacy
preregistration, held-out aggregates, or evaluation plans as input.
Follow the Annotation sink rules in [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md) for annotation identity and object
references, and [CONTRACTS.md](CONTRACTS.md) for the distinction between observed object counts and causal
attribution, the replay gate, and the formal criteria.
Keep idle/hold/periodic/seeded-random as diagnostic controls, but do not use their scores or input monotonicity
as quality points. When using an LLM, limit it to non-formal advisory notes such as position summaries, alternative
explanations, and additional verification ideas; do not let it fill in formal criteria, verdicts, rankings,
missing telemetry, or unevaluated perceptual channels.

To rank multiple games, list each `play-log-quality-result.json` in a `play-log-ranking-contract.json` that is
fixed before accessing results. Follow the Play-log ranking contract and result section of
[CONTRACTS.md](CONTRACTS.md) for ordinal values, weights, tie rules, and the `not_rankable` rule for missing data.

Follow [SIMULATOR_USAGE.md](SIMULATOR_USAGE.md) for usage from adapter registration through baseline episode
execution, private annotation storage, and closed-loop policy connection.

## Input

Each game has at least the following. Ranking requires two or more game directories prepared with these.

- `main.js`
- The version or content hash of the crisp-game-lib used
- Source that confirms one-button input

A game's `README.md` and design documents may be referenced as private material for adapter development,
but must not be treated as observational evidence in the evaluation report.

## Output

The following is generated per game.

```text
generated/<game-id>/
  original/main.js
  instrumented/main.js
  game.manifest.json
  annotation-plan.private.json
  adapter.mjs
  private-policy.mjs
  play-log-quality-plan.private.json
  play-log-quality-result.json
  tests/
  artifacts/play-log-analysis/
  ANALYSIS.md
```

`adapter.mjs` is a data module that registers the game source and hash with the bundled executor;
it is not a copy of the executor itself.

Output per ranking:

```text
batches/<ranking-id>/
  play-log-ranking-contract.json
  play-log-ranking-result.json
  play-log-ranking-hashes.json
  PLAY_LOG_RANKING.md
```

`batches/` is used only as the location name for ranking outputs. It is unrelated to the legacy
`batch-manifest.json`, `batch-result.json`, and `BATCH_REPORT.md` formats.

## Terminal outcomes

Terminal status per game:

- `completed`: Passed Stages 0–13 and has a schema-valid `play-log-quality-result.json`
- `not_rankable`: No rank is produced, e.g. due to a null mandatory criterion or insufficient instrumentation
- `instrument_insufficient`: The instrument or policy could not engage with the mechanics, so quality judgment was stopped
- `technical_failure`: Failed a technical gate for reproduction, schema, seed, or execution
- `unsupported_simulator_only`: Required game/runtime features cannot be reproduced in the Node VM
- `annotation_incomplete`: Required collision geometry cannot be annotated safely

Do not convert failure states into game verdicts such as low quality, boring, unintuitive, or unplayable.
