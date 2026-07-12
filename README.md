# Claude One-Button Game Creation

This project explores how far LLM agents can automate the creation of compact,
browser-playable one-button games built with
[crisp-game-lib](https://github.com/abagames/crisp-game-lib). Agents turn
random tags into game designs and implementations, measure whether skilled
input outperforms monotonous play, then leave final selection to a human and
polish only the selected winners.

See [GAMES.md](./GAMES.md) for playable examples and screenshots. Published
builds under `docs/` are curated separately from the disposable batch
workspace and may be added only by explicit human instruction.

This file is for an agent **running the pipeline**: generate a batch
of one-button games, then measure/rank/play/select them, then polish
the winners. Current pipeline/selection rules live only in
`workflows/game-selection.md` (the one-game generation specification remains
in `workflows/game-generation.md`);
rationale lives in `history/game-selection-workflow-history.md`; observations
live in `state/batch-retrospective.md`; open work lives in `state/BACKLOG.md`.
Only the workflow is normative when executing a batch.

## Fresh-clone setup

```bash
npm ci
npm run playwright:install
npm run init:state
```

`init:state` copies tracked blank templates into the gitignored `state/`
directory and starts an independent lineage at Batch 1. It refuses to
overwrite any existing state file. This repository's current working copy can
therefore continue its local batches while every fresh clone starts without
its game-production history.

## Top-level flow

```
1. Generate 10 games      workflows/game-generation.md, once per game
2. Select the winners     workflows/game-selection.md, Stages 1–3
3. Polish winners only    workflows/game-selection.md, Polish section
```

`AGENTS.md` states this in one page, plus the **one-way rule**:
lessons from step 2/3 may only change Stage-2 judging practice inside
`workflows/game-selection.md` — never the rules in
`workflows/game-generation.md`. Read `AGENTS.md` first; it's short and
frames everything below.

## Repository layout

| Directory | Role | Persistence |
| :-- | :-- | :-- |
| `workflows/` | Normative generation and selection procedures | Required |
| `state/` | Local mutable cross-batch source of truth | Required after initialization; gitignored |
| `templates/state/` | Blank Batch-1 state copied by `npm run init:state` | Required and tracked |
| `history/` | Adopted decision rationale | Required for maintenance |
| `data/` | Static generation inputs such as tags | Required |
| `scripts/` | Evaluators, tag selection, and tester fork | Required |
| `.agents/skills/` | Delegated design, implementation, smoke, and polish craft | Required |
| `docs/` | Human-directed curated/published builds | Optional; outside the batch workflow; never written automatically |
| `archive/` | Retired guides and historical transfers | Optional; never normative |
| `tmp/` | Current-batch builds and reproducible evidence | Disposable after batch close |

Continuation without past-game revive requires `state/`, not old `tmp/`
artifacts. Before discarding a closed batch's `tmp/` evidence, complete the
runbook transfers into the taste corpus, retrospective, winners ledger,
prediction-validation input, and backlog. Preserve `tmp/games-batchN/` only
when explicit revive work is desired.

---

## Step 1 — Generate (`workflows/game-generation.md`)

**Before generating anything**, initialize state with `npm run init:state` if
this is a fresh clone, then run the Batch runbook's step 1
(`workflows/game-selection.md`): create the disposable workspace, deal with
any retained previous batch, AND read `state/BACKLOG.md`'s section for this
batch — items marked **DECIDE (user)**
there must be resolved with the user first, because they can change
how generation is run. This is operator context. Each game is then
generated in a fresh context that has not read `state/BACKLOG.md`, the taste
corpus, retrospective, winners, or Stage-2/3 results; see runbook step 2.

Read the file in full: Phase 1 (tag selection) → Phase 2 (design) →
Phase 3 (implementation), the exact README/HTML/JS output format, and
the "Tester Compatibility" constraints (inline all logic inside
`update()`, draw collision targets before detectors, lethal checks via
`box`/`rect` only, `addScore(points, x, y)` for positioned events,
conventional names like `player`/`enemies`). These constraints aren't
style — violating them makes the game unmeasurable in Step 2.

Delegated craft skills (read when you reach the matching phase):

- `.agents/skills/designing-mini-games/` — Phase 2 design procedure. Use it
  with `button_types = 1`: one binary input expressed only through press,
  hold, and release; no second key, chord, swipe, or auxiliary input. Follow
  the **generation profile** in the workflow file: Phase-1 ideation + the four
  core principles only; skip the guide's §8 hardening/invariant machinery and
  §9 extended checklist (those belong to Polish, not generation — using them
  here narrows variance).
- `.agents/skills/developing-with-crisp-game-lib/` — Phase 3 API and
  patterns. `references/api.md` is the **only** allowed API surface;
  the Step-2 tester mock accepts a few globals the real browser
  doesn't, so "the tester accepts it" is not evidence an API exists.

Script (run once **per game**, not per batch):

```bash
node scripts/random_tag_selector.js -n 3 -f text
```

Output per game:

```
tmp/games/<slug>/
├── index.html    # HTML template
├── main.js       # ~150-line update() loop
└── README.md     # 6-section design doc
```

Repeat until `tmp/games/` holds 10 games, then move to Step 2.

---

## Step 2 — Select (`workflows/game-selection.md`)

Read the file in full — its **"Batch runbook" section is the
operational checklist**; follow its numbered steps directly rather
than improvising. Summary of what each stage needs:

**Stage 1 — automated measurement**

```bash
for g in tmp/games/*/index.html; do
  node .agents/skills/smoke-testing-web-games/scripts/smoke-test.mjs "$g" || echo "FAIL: $g"
done
node scripts/verify_tester_patches.js
node scripts/evaluate_games.js
```

Smoke test first (catches real-browser crashes the simulator can't);
fix any FAIL before measuring. The tester-patch guard prevents a replaced
vendored adapter from silently losing browser-parity behavior.
`evaluate_games.js` writes
`tmp/eval/stage1.json` / `.md` (per-game verdicts/flags). It calls
`scripts/tester/*.js` internally — you shouldn't need to touch those
directly. See the workflow file's "Instrument caveats" section if a
game won't measure (`needs_manual_review` means the instrument failed,
not the game).

**Stage 2 — LLM annotation (defects + informational ranking)**

Launch 2–3 isolated judge agents (fresh context, did not generate the
games). Give each judge: `tmp/games/<slug>/{README.md,main.js}`,
`tmp/eval/stage1.json`, and `state/taste-corpus.md` (every past
batch's human ordering + verbatim notes — judges predict THIS
player's taste by analogy to these examples, not from abstract
criteria). Judges produce (a) defect annotations — design-level vs
tuning-level, `fixable_by_constants` flags, dead-code findings from
reading `main.js` — and (b) an informational predicted ranking that
**gates nothing and stays hidden from the human until their ordering is
final**. The workflow file's **two-pass rule**: if
annotation finds implementation bugs, fix them, re-smoke, re-measure,
*then* collect the prediction against the fixed builds.

**Stage 3 — human play (full batch)**

Create `tmp/eval/stage3-batchN.md` (game list in an independently
randomized/counterbalanced order, an ordering form, per-game note slots).
The human plays **all** games without seeing the prediction;
their ordering is the selection — there is no top-k gate. After play,
compute ρ against the Stage-2 prediction, record it, and append the
batch's ordering + notes to `state/taste-corpus.md`.

**Polish** (workflow file's Polish section): bounded tuning for the
human's winners only, capped at ~3 iterations. Re-run Stage 1 on just
the winners via `node scripts/evaluate_games.js --games-dir <dir>`
(e.g. a symlink dir of winners) and snapshot as `stage1-polishN.*`
without disturbing the batch's `stage1.json`.
Polish completion stops at the local build and `state/winners.md`; it does not
authorize promotion to `docs/`.

**Batch retrospective** (runbook's final step): update
`state/batch-retrospective.md` with this batch's ρ and any
process-level observations before starting the next batch.

---

## Files this flow creates or reads across a batch

| File | Written by | Read by |
| :-- | :-- | :-- |
| `tmp/games/<slug>/{index.html,main.js,README.md}` | Step 1 | Step 2 (Stages 1–2), the human (Stage 3) |
| `tmp/eval/stage1.json` / `.md` | Stage 1 | Stage 2 judges |
| `tmp/eval/stage2-batchN*.md` | Stage 2 judges | Post-play ρ calculation (hidden during Stage 3) |
| `tmp/eval/stage3-batchN.md` | Human, during Stage 3 | ρ calculation, `state/taste-corpus.md` append |
| `state/taste-corpus.md` | Appended after every Stage 3 | Every future batch's Stage 2 judges |
| `state/batch-retrospective.md` | Runbook's final step | Next batch's retrospective step |
| `history/game-selection-workflow-history.md` | Workflow maintainers | Rationale lookup only |
| `state/BACKLOG.md` | Operator / retrospective | Operator; open work only |
| `state/winners.md` | Stage 3 | Polish and revive work |
| `state/prediction-validation.json` | Post-play close | Pooled prediction checkpoint |
| `tmp/games-batchN/` | Archived at the start of the next batch | Reference only, if a game is revived |

`tmp/games/` holds only the *current* batch. After durable state is closed,
archive it to `tmp/games-batchN/` only when revive retention is desired;
otherwise it may be discarded before starting the next batch.
Everything under `state/` is durable continuation state, not per-batch
scratch output. `tmp/eval/` reports are evidence and may be discarded after
the batch-close transfers above. `history/` preserves rationale but does not
gate execution.

---

## What not to do

- Never feed Stage 2/3 results back into `workflows/game-generation.md`
  as new rules or gates — the one-way rule (`AGENTS.md`) means
  lessons only change Stage-2 judging practice.
- Never treat the Stage-2 predicted ranking as a gate — the human
  plays the full batch regardless of what it says.
- Never skip the browser smoke test before automated measurement.
- Never copy, move, or sync a winner into `docs/` without an explicit human
  instruction naming that publication/promotion action.

---

## Archived approaches

Earlier workflow experiments remain under `archive/` for historical reference;
they are never normative for a current batch.

- `archive/for_chat/` — a checkpoint-heavy human/LLM collaboration workflow.
- `archive/for_web/` — a mobile-first Web development and deployment workflow.
- `archive/for_zero_touch/` — the retired per-game generate→GA-tune workflow
  that preceded the current generate-many/human-select pipeline.

The former root README describing the zero-touch workflow is preserved as
`archive/README-legacy.md`.
