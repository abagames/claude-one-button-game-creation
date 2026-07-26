# Game Adapter Task Template

Pass this template to a new coding-agent session, filling in `<INPUT_GAME>` and `<OUTPUT_DIRECTORY>`.

## Task

Analyze the crisp-game-lib one-button game at `<INPUT_GAME>` and generate a simulator-only adapter package in
`<OUTPUT_DIRECTORY>`. [WORKFLOW.md](WORKFLOW.md), [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md), and
[CONTRACTS.md](CONTRACTS.md) are normative.

## Required procedure

1. Hash-fix the input source and runtime.
2. Statically investigate input edges, state initialization, score, terminal, and drawing/collision.
3. Create the private mechanical inventory and annotation plan first.
4. Preserve the original and create an annotation-only instrumented copy.
5. Mechanically verify with the shared `check:annotation-diff` that the non-annotation diff count is 0.
6. Create the data-only `adapter.mjs` from [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md) and register it with the
   bundled `runtime/index.mjs`.
7. Create deterministic smoke tests for idle, hold, periodic, and seeded random in the form of
   [SIMULATOR_USAGE.md](SIMULATOR_USAGE.md).
8. Create a game-specific private policy and allowlist observation. This is where the game's own operating
   skill is encoded (for example "never release while inside the rock"). Follow the module contract in
   [WORKFLOW.md](WORKFLOW.md) Stage 7; `npm run intake:batch` writes the skeleton.
9. Perform policy qualification using development seeds only.
10. Fix `play-log-quality-plan.private.json` before accessing analysis results, including `output_directory`,
    which owns where every artifact is written.
11. Run the development-only feasibility gate; stop as `instrument_insufficient` on deficiency instead of
    converting it into zero points.
12. Run Stages 8–13 through the shared executor
    (`npm run evaluate:play-log-quality -- <evaluation-config.mjs> [game-id ...]`), which collects the episode
    pool with unused analysis seeds, exact-replays selections, generates derived events and counterfactuals,
    derives instrument confidence, judges the 4 criteria, and writes `play-log-quality-result.json`. Do not
    re-implement any of these per game.
13. Render `ANALYSIS.md` with the shared renderer.

Pass `game.manifest.json`, `annotation-plan.private.json`, `play-log-quality-plan.private.json`,
`analysis-result.json`, and `play-log-quality-result.json` through the shared `validate:artifact`. Generate
per-game Markdown only with the shared `render:play-log-quality`.
Place each `beginDrawing(...)` and `endDrawing();` on its own single line, as a single call statement, so that
the shared diff checker can inspect the annotation calls. Appending any further statement to those lines is
rejected by the gate.

## Scope constraints

- Limit execution and observation to the capability class of [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md)
- Do not add host information outside the runtime contract as evaluation evidence
- Do not represent meaning obtained from the source as runtime observation
- Do not change mechanics for instrumentation convenience
- Do not convert policy failures into game defects
- Do not rank games by raw score
- Do not judge human fun, intuitiveness, or preference

## Required adapter shape

```js
export default {
  game_id: "<GAME_ID>",
  source_path: "<OUTPUT_DIRECTORY>/instrumented/main.js",
  source_sha256: "<INSTRUMENTED_SHA256>",
  source_commit: null,
  annotation_contract_version: 1,
};
```

Normalize `source_path` as a relative path from the workflow root (`evaluation/`). Do not embed executors, policies,
metrics, source rewrites, or additional host APIs in the adapter.

## Required final response

- Generated/changed files
- Original/instrumented/runtime hashes
- Annotation-only diff gate
- Simulator conformance result
- Policy qualification result
- Separation of development/analysis seeds
- The 4 criteria and referenced evidence IDs
- Null/not-applicable criteria and unresolved evidence
- Commands and test results
- Status and trust class
- Known limitations
