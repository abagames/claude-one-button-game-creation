# Play-Log Evaluation Workflow (Optional, Post-Batch)

How to run the simulator-only play-log mechanical evaluation over games that a
batch already produced. This is an **optional activity that requires an explicit
user request**. It is never a gate on generation, and its result never
retroactively changes whether a batch is complete.

The normative documents are under `evaluation/`: `AGENTS.md`, `WORKFLOW.md`,
`RUNTIME_CONTRACT.md`, `CONTRACTS.md`, `SIMULATOR_USAGE.md`,
`PLAY_LOG_ANALYSIS.md`. This file only describes how a batch of this project
enters that workflow and what the deliverable is here.

---

## What this evaluation is and is not

It measures four mechanical criteria from private play logs executed in a fresh
Node VM: `causal_input_control`, `risk_reward_coupling`, `failure_agency`,
`outcome_coherence`. The trust class is always `simulator_only_unverified`.

It does **not** evaluate fun, fairness, intuitiveness, rendered appearance,
perceptual clarity, audio, or distribution-runtime compatibility. A ranking
produced here is a play-log mechanical quality ranking, not an overall quality
ranking, and it must never be presented as one.

A game the instrument could not measure leaves the ranking as `not_rankable`.
That is not a low score, and it must not be reported as one. Raising annotation
coverage is the way to bring such a game back in; loosening the criteria is not.

---

## Prerequisites

```bash
npm run eval:setup   # npm ci + npm test inside evaluation/
```

`evaluation/` is a self-contained package with its own `package.json` and
lockfile (only `ajv`). Do not merge it into the root dependency tree: its
guarantee is that it runs from a clean checkout on its own.

Node.js 20.11+ is required (verified on Node 24).

---

## Scope selection

Evaluating one game costs roughly a full working session: the annotation plan,
the annotation-only instrumented copy, the private policy, and the frozen
quality plan are all per-game agent work that cannot be scripted.

Start with **two or three games** from one batch, complete them end to end, and
only then decide whether to scale to the whole batch. Two completed games are
already enough to produce a ranking.

Prefer games whose `main.js` has a clear controllable subject, a clear hazard,
and a clear scoring object; those are the ones whose annotation plan is
unambiguous. Record which games were skipped and why.

---

## Step 1: Intake freeze (scripted)

```bash
cd evaluation
npm run intake:batch -- <batch-id> ../tmp/games <game-id> [<game-id> ...]
```

`<batch-id>` is a stable kebab-case id for this evaluation round (for example
`batch11-v1`). The source directory is `../tmp/games` for a freshly generated
batch, or `../docs` for published games.

The script freezes `original/main.js`, seeds `instrumented/main.js` as a
byte-identical copy, and scaffolds `game.manifest.json`, `adapter.mjs`,
`intake.json`, and a `batches/<batch-id>/evaluation-config.mjs` skeleton with
correct hashes. Re-run it after editing an instrumented copy to refresh hashes.

Games are frozen under `evaluation/generated/<game-id>/<batch-id>/`, so a later
regeneration of `tmp/games/` cannot silently change what was evaluated.

## Step 2: Per-game agent work

Follow `evaluation/WORKFLOW.md` Stages 1-8 for each game, and
`evaluation/GAME_ADAPTER_TEMPLATE.md` as the task template:

1. Static runtime qualification (Stage 1) and the private mechanical inventory
   (Stage 2)
2. Annotation plan (Stage 3), then annotation-only scopes (Stage 4), verified by
   `npm run check:annotation-diff -- <original> <instrumented> <result.json>`
3. Simulator conformance with the generated adapter (Stage 6)
4. `private-policy.mjs` and its qualification on development seeds only
   (Stage 7), followed by the development-only feasibility gate
5. `play-log-quality-plan.private.json` frozen before any analysis seed is
   opened (Stage 8), with `output_directory` set to
   `generated/<game-id>/<batch-id>/artifacts/play-log-analysis`

Fill in `requiredCoverage` in `batches/<batch-id>/evaluation-config.mjs` from
the annotation plan, then record the config's SHA-256 before executing.

## Step 3: Evaluate and rank (scripted)

```bash
npm run evaluate:play-log-quality -- batches/<batch-id>/evaluation-config.mjs
npm run validate:artifact -- play_log_ranking_contract batches/<batch-id>/play-log-ranking-contract.json
npm run rank:play-logs -- batches/<batch-id>/play-log-ranking-contract.json batches/<batch-id>
npm run verify:play-log-ranking-hashes -- batches/<batch-id>/play-log-ranking-hashes.json
```

The ranking contract must be written and validated **before** reading any
quality result. A per-game failure does not stop the batch; that game becomes
`not_rankable` and the rest continue.

---

## Known intake constraints

- **crisp-game-lib version**: the bundled runtime is upstream `v1.5.0` plus
  annotation extensions, which matches the version this project's games load.
  A game generated against a different version must be re-checked.
- **Audio**: games that declare `audioFiles` run normally. The evaluation
  runtime provides an inert audio host layer, and audio remains an omitted
  observation channel.
- **Host APIs and fetched data**: a game whose mechanics need capabilities
  outside the runtime contract stops as `unsupported_simulator_only` at static
  qualification. It is not worked around by rewriting the source.
- **Source is immutable**: the only permitted difference between `original` and
  `instrumented` is added `beginDrawing(...)` / `endDrawing();` lines, each a
  single call statement on its own line. The diff gate rejects anything else.

---

## Deliverable

```text
evaluation/generated/<game-id>/<batch-id>/
├── original/main.js
├── instrumented/main.js
├── game.manifest.json
├── annotation-plan.private.json
├── adapter.mjs
├── private-policy.mjs
├── play-log-quality-plan.private.json
├── play-log-quality-result.json
├── ANALYSIS.md
└── artifacts/

evaluation/batches/<batch-id>/
├── evaluation-config.mjs
├── play-log-ranking-contract.json
├── play-log-ranking-result.json
├── play-log-ranking-hashes.json
└── PLAY_LOG_RANKING.md
```

Report per `evaluation/AGENTS.md` "Completion report": changed files, input
hashes, executed commands, test results, trust class, null or not-applicable
criteria with their `not_rankable_reasons`, unresolved evidence, and which
channels were not evaluated.
