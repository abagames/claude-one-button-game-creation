# Agent Instructions

A coding agent executing this workflow must observe the following.
Treat Stages 0–14 of [WORKFLOW.md](WORKFLOW.md) as the normative execution order, and do not skip Stages 0–13
of any game on the grounds of running a ranking.
The normative contracts for execution, observation, adapters, and annotation identity follow
[RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md); the normative definitions of formal criteria and ranking constants
follow [CONTRACTS.md](CONTRACTS.md). This document defines principles and fail-closed rules;
refer to each normative document for details of constants and procedures.

## Execution boundary

- Complete the evaluation inside a fresh Node VM context that loads the instrumented crisp-game-lib bundle,
  following [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md).
- Use the shared implementation in `runtime/` and the fixed bundle at `vendor/crisp-game-lib/docs/bundle.js`.
  Do not duplicate, fork, or modify the executor per game to match source variable names.
- If a runtime dependency that cannot be reproduced in the Node VM is required by the mechanics, stop as
  `unsupported_simulator_only` instead of imitating it with a source rewrite.
- Set the trust class of all results to `simulator_only_unverified`.
- Limit claims to mechanical behavior within the tested simulator, policy, seed, and tick budget.
- Record rendered appearance, perceptual clarity, audio, human experience, and distribution-runtime compatibility
  as out of scope.

## Source handling

- Preserve the input game as an immutable original.
- Do not mix any changes other than `beginDrawing(...)` / `endDrawing()` into the instrumented copy.
- Do not change drawing order, collision call order, return values, or random call order.
- Follow the Annotation sink rules of [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md) for subject identity,
  object references, and property non-retention inside annotation scopes. For targets whose object reference
  cannot be passed safely, or for ambiguous subject roles, do not guess; mark them `unresolved`.
- Do not create nested drawing scopes.
- Put only the adapter fields of [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md) in `adapter.mjs`; do not hide
  runtime source rewrites or added host capabilities.
- Validate artifacts with `runtime/artifact-contracts.mjs` and `schemas/`. Do not create game-specific lax
  substitute schemas.
- Use the shared implementations for shared gates; do not re-implement equivalent functionality per game.
  Use `runtime/annotation-diff.mjs` for the annotation-only gate, `runtime/baseline-matrix.mjs` for the
  diagnostic control matrix, `runtime/play-log-ranking.mjs` / `runtime/play-log-ranking-renderer.mjs` for
  play-log ranking, and `runAdapterConformance()` for the shared parts of control smoke, frame count,
  annotation diagnostics, and exact replay. Add only the semantic judgment of annotation coverage to
  game-specific tests. Do not invoke retired legacy renderers from the current workflow.

## Evaluation handling

- Separate development and analysis seeds, and fix them before accessing results.
- Run idle, hold, periodic, and seeded random as diagnostic controls under identical conditions.
- Do not use monotonic input, control scores, or private-policy advantage as a quality criterion or a
  reason for deduction.
- Do not reinterpret a private policy failure as a game failure.
- Follow the Play-log quality result section of [CONTRACTS.md](CONTRACTS.md) for the set of formal quality
  criteria and the ordinal mapping.
- Use game-specific metrics only as derived evidence, never as an independent quality axis.
- Do not compare score scales directly across different games.
- Preserve null, negative, technical failure, and not applicable.

## Play-log handling

Follow [WORKFLOW.md](WORKFLOW.md) Stages 8–13 for the normative definitions of the execution procedure and
freeze items. In particular, observe the following fail-closed rules.

- In Stage 8, fix a schema-valid `play-log-quality-plan.private.json` before accessing results, then collect
  the analysis episode pool in Stage 9 before analyzing. Do not generate any other aggregate statistical
  evaluation, p-values, confidence intervals, private-policy advantage, or seed stability scores.
- Require schema version 2 for new evaluation plans; use v1 only to verify and display past artifacts.
  Run Stages 8–13 through the shared `runtime/play-log-quality-evaluator.mjs` via
  `npm run evaluate:play-log-quality -- <evaluation-config.mjs> [game-id ...]`.
- Fix `evaluation-config.mjs` before episode execution and before accessing quality results, and record its
  SHA-256 in the execution record and completion report. List only adapters, policies, plan paths, policy
  parameters, and required annotation coverage in the config; do not embed hooks such as executors,
  classifiers, counterfactual generation, or artifact writers.
- Place policy parameters and required annotation coverage on the same freeze boundary as the plan and seeds.
  Do not change them after collecting the episode pool or accessing results. If a change is needed, re-run
  from Stage 8 with a new evaluation ID, unused analysis seeds, and a new config hash.
- After qualification and before running analysis episodes, run the shared development-only feasibility gate.
  Save deficiencies to `play-log-feasibility.private.json` and stop as `instrument_insufficient` without
  converting them to zero points.
- Do not duplicate pool collection, selection, counterfactual execution, metrics, criterion classification,
  or formal result generation into batch or game-specific executors. A batch driver only enumerates plans and
  adapter/policy configurations, invokes the shared executor, and continues past per-game failures.
- Do not judge from the best log alone. Fix the selection rules and counterfactual sources per criterion in
  the quality plan, and do not change them after accessing results.
- Do not convert failure agency below the minimum eligible cases, or the absence of a terminal source, into
  0 or mixed; mark it `unresolved`, and do not fill it in with diagnostic control scores or survival differences.
- Treat every criterion the instrument could not measure as `unresolved`, which makes the game `not_rankable`.
  `contradicted` requires positive counter-evidence. Record the reasons in `not_rankable_reasons` so an
  instrument-limited game is never reported as a measured low-quality game. Raising annotation coverage, not
  loosening the rules, is the way to bring such a game back into the ranking.
- Do not assert instrument confidence. The shared executor derives it, and `insufficient` is a stop state.
- When a criterion cannot be resolved, fix the game-specific layer — annotation coverage, the private policy,
  the operation set, the anchor and lookback settings — on development seeds before the freeze. Do not widen
  a shared rule, do not select sources by how probeable they are, and do not raise a tolerance until the game
  passes. Any rule whose selection criterion correlates with the answer it is used to produce is invalid even
  when it never inspects the answer directly.
- Follow the Play-log analysis artifacts section of [CONTRACTS.md](CONTRACTS.md) for replay gate modes and
  exceptions for annotation-only migration.
- Do not reinterpret unanalyzable play logs as zero points or low quality; stop as `instrument_insufficient`
  or `not_rankable`.
- Store the quality plan path/hash and the play-log analysis result path/hash in
  `play-log-quality-result.json`, and verify the referenced hashes fail-closed. Each criterion's
  `evidence_ids` must resolve to schema-valid selections, metrics, comparisons, and counterfactuals.
- An LLM may be used only for hash-recorded non-formal advisory notes. Do not use an LLM to overwrite or fill
  in formal metrics, instrument confidence, verdicts, rankings, unresolved roles, missing telemetry, or
  perceptual channels. For details, follow the LLM role and evaluation authority section of
  [PLAY_LOG_ANALYSIS.md](PLAY_LOG_ANALYSIS.md).

## Ranking handling

- Before ranking two or more games, run Stages 0–13 for each game through to terminal status determination.
  Use schema-valid `play-log-quality-result.json` files as ranking inputs, and keep any intermediate technical
  failure or missing data as `not_rankable`.
- List only unique game IDs and quality result paths in `play-log-ranking-contract.json`; do not embed
  arbitrary commands, game-specific executors, source rewrites, or host capabilities.
- Fix the ranking contract before accessing quality results, and validate it against the shared schema.
- Follow the Play-log ranking contract and result section of [CONTRACTS.md](CONTRACTS.md) for the ordinal
  mapping, weights, `tie_threshold`, shared ranks, and rules for missing games. Do not convert null required
  criteria, technical failure, or insufficient instrumentation into zero points or last place. Do not use raw
  scores, control performance, or monotonic input for ranking.
- After a preflight, hash, schema, or technical failure of one entry, still process the remaining games and
  mark only that game `not_rankable`.
- If a quality result cannot be read and an adjacent `artifacts/technical-failure.json` exists, carry its
  status, path, and hash over to the ranking result and Markdown. Do not replace the original preflight error
  with only the stop reason.
- Generate `play-log-ranking-result.json`, `PLAY_LOG_RANKING.md`, and `play-log-ranking-hashes.json` from the
  shared implementation. Follow [WORKFLOW.md](WORKFLOW.md) Stage 14 for the execution commands and
  verification procedure.

## Completion report

Report the changed files; the input hashes of source / adapter / policy / runtime bundle / quality plan /
evaluation config; the generated adapter; executed commands; test results; trust class; null /
not-applicable criteria; unresolved evidence; and known limitations.
State clearly which perceptual channels, runtime compatibility, and human experience were not evaluated,
and do not fill them in from mechanical results.

When a ranking was executed, report the ranking ID, requested/ranked/not-rankable counts, each game's
criterion values, weighted totals, ranks, contract/result/report hashes, and technical failures.

If you change the runtime, schemas, vendor, shared scripts, renderers, or artifact contracts, run `npm test`.
When adding an individual game, run the same tests and additionally inspect that game's control smoke, exact
replay, and annotation frame count. When adding or changing a ranking contract, run
`npm run rank:play-logs -- <ranking-contract> <output-directory>` and
`npm run verify:play-log-ranking-hashes -- <ranking-hashes>`, and verify quality result provenance, evidence
IDs, and ranking hashes.
