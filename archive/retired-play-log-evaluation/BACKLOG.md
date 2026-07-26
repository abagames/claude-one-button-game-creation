# Backlog

Working notes for this workflow. Not normative: the normative documents are `AGENTS.md`, `WORKFLOW.md`,
`RUNTIME_CONTRACT.md`, `CONTRACTS.md`, and `PLAY_LOG_ANALYSIS.md`.

## How to update this file

**When an item here is finished, record its status in this file as part of the same change.** A backlog item
is not done until the outcome is written down here — an unrecorded completion is indistinguishable from work
that never happened, and the next session will re-derive it.

Four mechanisms, by item shape:

- **Binary items** (a thing to do) carry a checkbox. Mark `- [x]` and append `— done YYYY-MM-DD:` with the
  one-line outcome and, where it exists, the artifact path or commit that carries it.
- **Decisions and open questions** (the items under "After the run") do not resolve to done/not-done. Leave
  the prose in place and append a `**Resolved YYYY-MM-DD:**` line under the item stating the decision *and its
  basis*. The basis is the part that matters — these are the items whose reasoning must survive.
- **The seven-game run** is tracked in the status table below, not by checkbox: a game can stop at the
  feasibility gate, which is a legitimate terminal state and not a failure to complete.
- **Pre-registrations** — a prediction, a decision rule, or a set of expectations written down before the thing
  it governs is run — are marked as pre-registered with their date and are **not edited afterwards**, not even
  to correct them. The result is appended below, and a pre-registration that turned out wrong is left standing
  as the record that it was wrong: that is the whole of its value. "Pre-registered expectations" and "The
  measurement that precedes the freeze checkpoint", "Pre-registered ranking expectations" and "Gate S — the
  screening kill gate" are the four sections under this rule. Added 2026-07-26, when the second of them was
  written — the first had been operating under it implicitly.

Update "Current state" whenever a status change makes it stale. Do not delete completed items — this file is
the only place the run's history is kept, and a removed item reads as an item that was never raised.

## Current state

- Shared runtime and 71 conformance tests pass from a clean checkout (`npm ci --ignore-scripts && npm test`).
  Six of the 71 are `tests/control-dominance.test.mjs`, added 2026-07-26 with the Gate S diagnostic.
- One game evaluated: `bore-comet`. Record round `docs-v6` (analysis seeds 93001-93005) and its stability
  replication `docs-v7` (94001-94005) both returned `completed` `[2,1,2,1]`, weighted 16/20.
- `docs-v1` … `docs-v5` are earlier instrument versions, retained as provenance only. Their numbers are not
  comparable to `docs-v6`/`docs-v7` and must not be mixed into a ranking.
- No ranking exists yet: ranking needs two or more `completed` games.
- All three "Before the run starts" items are settled as of 2026-07-26, and **Phase A is complete**: all six
  new games are through Stages 0-8 under batch `docs-v8`. `bridgecross`, `bladedancer` and `cleaner` passed
  the feasibility gate; `pulse-stream`, `feedingfrenzy` and `hoardspout` stopped at it as
  `instrument_insufficient`, all three on the same single reason
  (`risk_reward_coupling:finite_source_risk_sample_missing`) with every other criterion `ready`. A stop there
  is a terminal state and a result about the instrument, not a failure to finish. No analysis seed has been
  opened by any of the six: `analysis_seed_accessed` is `false` in all six feasibility artifacts.
- **The deliverable is a screen, not a ranking.** Decided 2026-07-26 — see "The screening reframe". Two things
  are settled there: this instrument cannot evaluate game quality (structurally, and the labels measured how
  much of the quality lies in the excluded region), and a ranked list is the wrong output shape whatever its
  resolution. Resolution itself was left to Phase B rather than concluded; Phase B did not run, so it is
  unmeasured and stays a prediction. *(Amended 2026-07-26 after Gate S: the screen is not the deliverable
  either — see below. The two settled conclusions are unaffected, because neither depended on the screen
  working.)*
- **Gate S failed, and the run is over.** Measured 2026-07-26 — see "Gate S — the result". `bladedancer`, the
  gate's one honest test, clusters with `bore-comet` under one reading of Signal 1 and with `cleaner` under the
  other, because the signal's name ("monotonic-control dominance") and its formula (`best_control_final_score`,
  bound to the executor's all-control metric) disagree, and the two readings coincide on the two games the
  signal was built from. Resolved as a fail on the pre-registered basis that an ambiguous honest test shows no
  precision, and because the gate can only kill and never confirm. A second defect is independent of the
  reading: the ratio's denominator is the private policy, so a weak policy and an unresponsive game produce the
  same flag.
- **Nothing downstream of Gate S was run**, as pre-registered: no indicator-selection probe, no instrument
  freeze checkpoint, no Phase B, no ranking. Pools 95-100 stay frozen and unopened and pools 101+ stay free; no
  plan was re-frozen and no instrument change was adopted. The run's output is the negative result plus Phase
  A's instrument findings, which stand on their own and are the substantive part of what this run produced.
- The one part of Gate S that survives is the **sensitivity probe: it passed.** The control-dominance ratio
  moves by about a quarter when `cleaner`'s difficulty is scaled 1.5× and the game underneath it changes by
  multiples, so per-tick normalisation works and the signal is not a tuning artifact. That is a reusable result
  for any successor signal, and it is the only positive finding the gate produced.
- **The run now has ground truth.** `DESIGNER_LABELS.md` (tracked) holds the author's /10 rating and stated
  reason for all seven games, recorded before any `docs-v8` quality result exists. It was **not** sealed — see
  its "Provenance" section and "Pre-registered ranking expectations". Four of the seven reasons fall outside
  what the instrument claims to measure, so it supports pair-level statements and not a rank correlation; the
  one clean in-scope test is `bore-comet` (8) against `cleaner` (4), which the instrument is predicted to tie.
- `generated/` is 102 MB: the bulk private evidence of `docs-v1` … `docs-v5` is pruned, and all seven rounds
  are archived in `records/` (untracked, like `generated/` and `batches/`). Burned seed pools are listed in
  `SEED_LEDGER.md`, which is tracked; the next free analysis pool is 101.

## Before the run starts

Three items must be settled before any new game enters Stage 0. Each is cheap now and expensive to decide in
the middle of a seven-game run. **All three are settled as of 2026-07-26**; the prose and its resolutions are
kept below.

- [x] **Artifact retention policy.** 253 MB for one game means seven games with a record and a replication
  round each will not stay manageable. Decide the policy now — for example, retain private frames only for the
  current instrument version's record and replication rounds, and prune superseded versions. Archiving
  `docs-v1` … `docs-v5` is the first application of whatever policy is chosen.
  — done 2026-07-26: policy decided, implemented as `runtime/round-retention.mjs` + `npm run retain:round`
  (`scripts/retain-round.mjs`, `tests/round-retention.test.mjs`), and applied. `generated/bore-comet` went from
  253 MB to 102 MB; all seven rounds are archived under `records/bore-comet/<eval-id>/` (1.2 MB), which is
  **not** version-controlled. Documented in `README.md` "Retention of finished rounds", `WORKFLOW.md` Stage 13,
  and `.gitignore`.

  **Resolved 2026-07-26 (on-disk side).** A round's files split into two kinds, and the split is what the
  policy turns on: work only an agent could produce, and bulk evidence the shared executor derives from it.
  `retain:round -- archive` curates the first kind into `records/`; `retain:round -- prune` deletes the five
  bulk private files and nothing else, and refuses to run until the archive exists and its hashes match.
  Basis: the pruned files' SHA-256 values are already recorded inside the retained `analysis-result.json`, and
  are written again into `records/<game>/<eval>/round-retention-record.json`, so pruning removes bytes without
  removing the ability to say what those bytes were. Superseded rounds are pruned; the current instrument
  version's rounds keep their evidence.

  **Resolved 2026-07-26 (the curated-location question this item deferred).** `records/` exists, and the
  curated set is wider than the four files named above: it adds `game.manifest.json` and `intake.json` as
  required, and `annotation-plan.private.json`, `ANALYSIS.md`, `play-log-quality-result.json`,
  `artifacts/annotation-diff.json`, `artifacts/simulator-conformance.json`, `artifacts/qualification-runtime.json`,
  `artifacts/play-log-feasibility.private.json`, `artifacts/technical-failure.json`, and
  `artifacts/play-log-analysis/analysis-result.json` where the round produced them. Two deviations from the
  earlier sketch, with their basis:
  - `instrumented/main.js` is in the required set. The four-file list omitted it, but the annotation-only copy
    is the single least reproducible artifact in the round — the annotation plan describes it, it does not
    regenerate it.
  - `analysis-result.json` is kept even though it is ~124 KB per round and dominates the record's size. It is
    what the quality result's `evidence_ids` resolve into; a record that keeps the verdict and drops its
    evidence would not be a record of a measurement. Seven rounds cost 1.2 MB, and the full seven-game run is
    projected at roughly 2.5 MB.
  - `original/main.js` is excluded: it is a byte copy of `../docs/<game>/main.js`, and its SHA-256 is pinned in
    `intake.json` and `game.manifest.json` (verified identical for `bore-comet`).

  The round-retention record is deliberately **not** registered as an artifact contract kind. It is a local
  retention record, not play-log evidence, and `artifactContractKinds` is meant to stay play-log-only.

  **Resolved 2026-07-26 (version control, superseding the same-day decision above).** `records/` is
  **gitignored** alongside `generated/` and `batches/`. It was briefly committed to version control on the
  argument that the agent work should survive a lost working copy; that is not this repository's job. What is
  tracked is the instrument, and a curated run output is still a run output — tracking it would put a growing
  per-run tree (~2.5 MB for this run alone, more with every later run) into a repository whose stated contract
  is that a clean clone plus `npm ci --ignore-scripts && npm test` is enough to use the workflow.

  What the curation is still for, unchanged: it is the check `retain:round -- prune` runs against, so the bulk
  evidence can be deleted without deleting the work behind it. Durability is now explicitly out of scope and
  handled outside git — `README.md` says so in one place. `SEED_LEDGER.md` stays tracked, because it is the one
  part of a run that a machine which never held the run still has to consult: a burned pool must not be
  re-drawn.

  **Partly decided 2026-07-26 (version-control side only):** `evaluation/.gitignore` ignores `generated/` and
  `batches/` wholesale. What the repository tracks is the instrument, not the runs: a clean clone plus
  `npm ci --ignore-scripts && npm test` is enough to use the workflow, since the test suite depends only on
  `tests/fixtures/` and `npm run intake:batch` scaffolds `batches/<batch-id>/evaluation-config.mjs` itself.
  This matches `README.md`, which already lists both directories under "Not required (artifacts and temporary
  files)". Tracked total: 107 files, 1.1 MB.

  **Consequence to be aware of:** per-round agent work — the annotation plan, `adapter.mjs`,
  `private-policy.mjs`, and the frozen `play-log-quality-plan.private.json` — is *not* regenerable and is now
  untracked, so `bore-comet`'s `docs-v6`/`docs-v7` exist on one machine only. The `docs-v8` re-run in Phase B
  reuses them. If that work should survive a lost working copy, it needs a curated tracked location (for
  example `evaluation/records/<game>/<eval-id>/`) holding those four files per round and nothing else; that is
  a separate decision from this one and has not been taken. *(Taken 2026-07-26: the location exists as
  `records/`, but it is not tracked, so this consequence stands — per-round agent work lives on one machine.
  See the version-control resolution above.)*

  **Still open:** the on-disk policy. `.gitignore` does not prune anything, so `generated/` is still 253 MB
  locally and grows per game. *(Closed 2026-07-26 by `retain:round -- prune`; 253 MB → 102 MB.)*
- [x] **Seed ledger location.** Burned analysis seed pools are a correctness matter across rounds, not
  bookkeeping: reusing a pool breaks the freeze. Keep one ledger at `evaluation/SEED_LEDGER.md`, one section
  per game, appended when a pool is consumed. Existing entries for `bore-comet`: analysis pools 61xxx, 71xxx,
  81xxx, 91xxx, 92xxx, 93xxx, 94xxx; development seeds 51xxx.
  — done 2026-07-26: `evaluation/SEED_LEDGER.md` created, with the seven `bore-comet` pools read back from the
  frozen plans rather than from this note (all confirmed as `P001…P005`). Referenced from `README.md`,
  `WORKFLOW.md` Stage 9, and `CONTRACTS.md`.

  **Resolved 2026-07-26 (allocation rule).** A pool number `P` expands to seeds `P*1000 + 1 … P*1000 + n`, so
  the seven historical pools are exactly 61, 71, 81, 91, 92, 93, 94 under a rule the existing rounds already
  followed — no renumbering, and the next free analysis pool is 95. Development pools are declared per game
  (51-57 for the seven-game run) and are explicitly *not* burned, because reusing them across rounds of the
  same game is what development seeds are for. The pool is written into the ledger **at the Stage 8 freeze**,
  not after the round runs: a pool is burned by being frozen into a plan, whether the round completed, stopped
  at the gate, or failed technically. That is also what makes the retirement of `retry_count` enforceable.

- [x] **`execution.retry_count`.** It is a reserved plan field with no implementation. Either implement it or
  remove it, and in the same change state the procedure for a game that fails a round technically — per
  `AGENTS.md`, that is a new evaluation ID with unused analysis seeds, not a silent re-run.
  — done 2026-07-26: retired, not implemented. `schemas/play-log-quality-plan.private.v2.schema.json` no longer
  requires it and now accepts it only as `0`; `CONTRACTS.md` carries the retirement and the technical-failure
  procedure; `WORKFLOW.md` Stage 9 states that episodes are never retried; the `causal-lane-runner` fixture
  plan drops the field and `inert-timer` keeps it, so both shapes stay under test
  (`tests/workflow-contracts.test.mjs`).

  **Resolved 2026-07-26 (why retire rather than implement).** A retry inside a round would re-run an episode
  that is part of a frozen pool, which is the one thing the seed freeze exists to prevent — and it would do it
  silently, since nothing in the artifacts would show that the recorded episode was not the first one. The
  procedure for a technical failure is therefore the only one there is: the game stops with the failure
  recorded, and a re-run is a new evaluation ID, an unused analysis pool from `SEED_LEDGER.md`, and a new
  config hash. The field is not deleted from the schema outright because plans frozen before this decision
  (`bore-comet` `docs-v1`…`docs-v7`) must keep validating; `const: 0` lets them validate while making any
  non-zero value an error rather than a silently ignored setting.

## Next step: seven-game run

### Run status

Updated as each game moves. `stage reached` is the highest stage whose artifact exists; `result` stays empty
until a round of record completes. A game that stops at the Stage 8 feasibility gate is recorded as
`stopped at gate` with its reason — that is a terminal state and a result about the instrument, not a failure
to finish the work.

| game | stage reached | eval IDs | result | notes |
| --- | --- | --- | --- | --- |
| `bore-comet` | 13 | `docs-v6`, `docs-v7` | `completed` 16/20 `[2,1,2,1]` | re-run pending as `docs-v8` in Phase B |
| `bridgecross` | 8 | `docs-v8` | — | **Phase A complete 2026-07-26**: feasibility `passed`, all three criteria `ready`, analysis pool 95 frozen and unopened |
| `bladedancer` | 8 | `docs-v8` | — | **Phase A complete 2026-07-26**: feasibility `passed`, all three criteria `ready` at 6/6 cases on 5/5 development episodes, analysis pool 96 frozen and unopened |
| `cleaner` | 8 | `docs-v8` | — | **Phase A complete 2026-07-26**: feasibility `passed`, all three criteria `ready` at 6/6 cases, analysis pool 97 frozen and unopened |
| `pulse-stream` | 8 | `docs-v8` | **stopped at gate** | `instrument_insufficient` 2026-07-26: `risk_reward_coupling:finite_source_risk_sample_missing`, the only failing check. Analysis pool 98 frozen and never opened |
| `feedingfrenzy` | 8 | `docs-v8` | **stopped at gate** | `instrument_insufficient` 2026-07-26: `risk_reward_coupling:finite_source_risk_sample_missing`, the only failing check. **Contradicts the pre-registered expectation.** Analysis pool 99 frozen and never opened |
| `hoardspout` | 8 | `docs-v8` | **stopped at gate** | `instrument_insufficient` 2026-07-26: `risk_reward_coupling:finite_source_risk_sample_missing`. Stops as predicted, but **for none of the predicted reasons**. Analysis pool 100 frozen and never opened |

The run's round of record is `docs-v8` for all seven games — one evaluation ID per instrument version, which is
also the ID `bore-comet` re-runs under in Phase B. The stability replication round will take the next ID.

**Two of the three `stopped at gate` rows are provisional as of 2026-07-26.** `pulse-stream` and
`feedingfrenzy` both stopped against `indicator_displacement`'s record selection, which the probe under "The
measurement that precedes the freeze checkpoint" may repair; if it does, they re-enter from Stage 8 with new
evaluation IDs and pools 101-102, and this table changes. `hoardspout` stopped for an annotation reason no
risk-mode decision reaches, so its row is terminal. The rows stay as written until the probe has run — a status
is what is true now, and a possible future status is not a result.

***Resolved 2026-07-26: all three rows are terminal, and every `stage reached` in this table is final.*** Gate S
failed, so the indicator-selection probe was never run and the repair that could have re-opened `pulse-stream`
and `feedingfrenzy` was never adopted. Their stops stand as recorded, on the reason recorded. Nothing in the
table advances past stage 8 for the six new games, and `bore-comet`'s `docs-v8` re-run does not happen — its
result of record stays `docs-v6` with `docs-v7` as its replication, which is what the "Current state" section
has said throughout. The instrument defect that stopped three games is left unrepaired and filed, not fixed:
repairing it now would be repairing an instrument for a run that has already stopped.

**`bridgecross` Phase A, done 2026-07-26.** Roles: `brigade` controllable, `bridge_deck` reward,
`bridge_body` hazard — the deck and the below-deck body of the *same* bridge object, annotated as two scopes,
because riding the deck is what scores and hitting the body at ground level is what kills. The terminal is
`!isJumping && y > 32 && horizontal overlap`, which is exactly edge-to-edge contact between the brigade box
(y 37-40 on the ground) and the body box (y 40-50), so `contact_tolerance` stays 0; every `game_over` episode
in the development probe ended with `bodyContact=true` and clearance `0.00`. Riding sits at clearance 5.0, so
the exposure threshold is 4 — riding is the safe, scoring state and must not read as exposure. The private
policy jumps when the next deck is within 14 units, holds through the flight (holding lowers gravity), and
releases while riding (so the multiplier climbs and a press edge stays available); it scored 819-1465 over
1800 ticks on development seeds against controls that die at tick 112, terminated on 4 of 5 seeds, and replayed
exactly. Feasibility: 6 generated cases per criterion per episode, replication-ready on 5/5 seeds for causal
input and risk-reward and 4/5 for failure agency.

**`bladedancer` Phase A, done 2026-07-26.** Roles: `player_body` controllable, `enemy` **both hazard and
reward**, `sword` and `ground_segment` as zones. The enemy is one drawn red box that scores when it meets the
cyan sword and ends the run when it meets the blue body, and `role_mapping` does not require the lists to be
disjoint, so the same role sits in `hazards` and `rewards` — which is the honest description and the reason
this game was selected. The sword is deliberately **not** `controllable`: it is the scoring instrument, and
putting it there would make `hazard_clearance` measure how close the *blade* is to an enemy when what ends the
run is how close the *body* is. `contact_tolerance` stays 0 — the terminal is an exact AABB overlap of drawn
boxes (`isColliding.rect.blue`) and all five development terminals landed at clearance 0.00. The exposure
threshold is 4: at ~1.2 units/tick that is about 3 ticks from contact, the band a jump started now can no
longer lift the 8-tall body clear of, and it sits near p3 of the development clearance distribution (p5 =
5.10, p50 = 26.68) so exposure stays a distinguishing measurement. `press_edit_ticks` is **2, not
bridgecross's 5**: press runs here are median 1 tick and p75 = 2 (the jump is a press edge; only the
gap-clearing holds are long, up to 28), so a 5-tick edit would have generated no truncation candidates at
all. Stage 7 lists `press_edit_ticks` as a per-game pre-freeze adaptation, and this is that case. The policy
spends the press edge on whichever terminal is arriving — the gap about to pass underneath, or an enemy
closing on the body line — holds while there is nothing to land on, and releases before landing so the next
press edge survives; it scored 12-59 over 360-1585 ticks on development seeds against controls that die at
164-436, terminated on 5/5 seeds, and replayed exactly. Feasibility: 6 generated cases per criterion per
episode, replication-ready on 5/5 seeds for all three criteria.

**The finding this game produced, needed at the instrument freeze checkpoint.** bladedancer has *two* terminal
paths and only one of them is a contact: an enemy reaching the body is `hazard_contact`, but falling into a
gap is the **absence** of a ground segment under the player, and an absence has no drawing call to annotate.
`terminalSignature()` reads such an ending as `unmapped`, which sends `outcome_coherence` to `unresolved` and
would take the game out of the ranking for an instrument reason. This was checked on development seeds before
the freeze rather than discovered at Stage 12: the diagnostic controls die by gap constantly (`idle` and
`hold` at 164-228 ticks with no ground under them), but the private policy — which jumps for gaps because
that is what the game asks — ended all five development episodes on `hazard_contact` with ground underneath.
So the plan is frozen expecting resolvable terminals, and `run-policy.mjs` prints the signature per episode so
the same check is repeatable. This makes bladedancer the **third** game with a non-contact terminal path,
alongside the two the run pre-registered (`feedingfrenzy`, `hoardspout`), and unlike those two its
non-contact path is avoidable by skilled play — which is itself the evidence that the instrument's terminal
vocabulary, not the game, is what is narrow here.

**`cleaner` Phase A, done 2026-07-26.** Roles: `cleaner_base` controllable, `hole` hazard, `dust` reward,
`cleaner_arm` and `cleaner_head` as zones. Same decision as `bladedancer`'s sword, for the same reason: the
arm and head are what sweep dust into a score, but the only thing that can die is the blue probe arc under the
base, so `controllable` holds the base alone and `hazard_clearance` measures the distance that actually ends
the run. Five scopes; the `cleaner_base` scope wraps an `if (...)` block whose body calls `end()`, which is
safe only because crisp's `end()` returns normally rather than unwinding — otherwise the frame would carry a
`scope_left_open` diagnostic and `derivePlayLogEvents` throws on any diagnostic. That is checked, not assumed:
the smoke and qualification runs both report `diagnostics=0`. All 25 control episodes and all 4 terminal
policy episodes ended on `hazard_contact` at clearance 0.00, so this game has no unmapped terminal path.
`press_edit_ticks` stays at **5**, unlike `bladedancer`: press runs here have median 107 ticks and reach 1741,
because holding is the default posture and releasing is a 1-tick escape burst (released-run median is 1).
This is a hold-dominant game like `bore-comet`, and the release-timing ladder is exactly what probes it.

  **The threshold rule this game forced, and it is retrospective for the whole run.** Rather than copy
  `bridgecross`'s exposure threshold of 4 a third time, it is now derived: *the exposure threshold is the
  clearance the hazard closes in about three ticks at its own approach speed*. Holes fall at
  `sqrt(difficulty)` ≈ 1-1.35 units/tick, so three ticks ≈ 4 units; `bladedancer`'s enemies scroll at ≈ 1.2,
  also ≈ 4; `bridgecross` closes at `difficulty` ≈ 1, also ≈ 4. The rule reproduces the value already frozen
  in every plan, so nothing is re-frozen — but the number now has a basis instead of being an inherited
  constant, and the next game with a different approach speed will get a different threshold on purpose. For
  `cleaner` that lands near p1.5 of the development clearance distribution (p1 = 3.16, p5 = 8.06, p50 =
  36.12), so exposure stays a distinguishing measurement rather than a near-constant.

  **The adversarial case fired as predicted, and is worth watching into Phase B.** The `hold` control scores
  903 in 600 ticks where `idle` scores 28, and `idle` and `hold` die on the *same tick* on every seed that
  terminates (357, 244, 345) — because the base moves only while released, so both controls are stationary
  and meet the same hole. The private policy scores 218-9601 over 456-1800 ticks. Nothing in the criterion
  machinery reads control scores, so this should not move a verdict; if any `cleaner` criterion nonetheless
  tracks the control gap in Phase B, that is the violation this game was added to detect.

  **Two corrections to what this file said about `cleaner` before it was read.** Neither changes the frozen
  set — the selection rule forbids that — but both were stated as fact and are not.
  - The Selection table calls `cleaner` "press, hold **and release** edges … all three input edges". The
    *release edge* is cosmetic: `input.isJustReleased` runs `play("click")` and nothing else. The press edge
    is mechanical (it resets the multiplier to 1) and the pressed/released *state* is what drives the arm and
    the base. So the game covers the press edge and both states, not three live edges. Its Axis A
    contribution — the tall 100×150 view and a hold-dominant scheme where releasing costs score — stands.
  - The "starting points already known from source reading" list says "cleaner head (controllable)". The head
    is not what the plan freezes as controllable; the base is, because the head cannot die. The same note's
    advice to include `truncate_press_by_k` / `extend_press_by_k` was right, and for a better reason than the
    one given: not because the release edge is used, but because the game is hold-dominant and the release
    boundary is the only decision there is to move.

**`pulse-stream` Phase A, done 2026-07-26 — the run's first `instrument_insufficient` stop, and it is not
the game the run predicted would stop.** The gate's verdict is narrow and that is what makes it useful:

| criterion | status | cases | replication-ready | reason |
| --- | --- | --- | --- | --- |
| `causal_input_control` | `ready` | 6 | 5/5 | — |
| `risk_reward_coupling` | **`insufficient`** | 6 | 5/5 | `finite_source_risk_sample_missing` (0 risk samples) |
| `failure_agency` | `ready` | 6 | 3/5 | — |

Everything about this game is measurable except its risk. The cause is structural: **`pulse-stream` has no
controllable subject.** There is no avatar — `input.isJustPressed` sets `tapExpansion` on every pulse wave at
once and advances recovery on every disabled lane at once — so `role_mapping.controllable` is frozen empty,
`derivePlayLogEvents` produces no `hazard_clearance` samples, and `countRiskSamples` returns 0. The
annotation is not the problem: all five drawn subjects are labelled (`pulse_wave`, `drifting_object`,
`lane_active`, `lane_disabled`, `lane_recovered`), coverage is complete, and conformance is 28/28 with zero
annotation diagnostics.

Both ways of rescuing it were tried and both were rejected as dishonest or unusable, with the basis measured
rather than argued:
- **`controllable: ["pulse_wave"]` + `hazards: ["drifting_object"]`.** This makes the gate pass, and it is
  wrong. The game's scoring test is `obj.pos.distanceTo(pulse.pos) < pulse.amplitude * 6` — pulse-to-object
  proximity *is* the reward condition. Declaring it hazard clearance would make `risk_reward_coupling`
  correlate reward with itself and report `confirmed` by construction. A criterion that cannot fail is not a
  measurement.
- **`indicator_displacement` with `drifting_object` as the indicator, axis x, neutral at the right edge.**
  Semantically right — risk here really is "how far left an object has drifted" — but the mode reads one
  record per frame via `records.find`, which returns the *first-drawn* object, not the most endangered one.
  Measured over 18322 development frames: up to 11 objects coexist, and **the first-drawn object is not the
  leftmost in 32.5% of frames**. An indicator that reports the wrong object a third of the time is not a risk
  measure, so this was not frozen.

**What this settles for the instrument freeze checkpoint.** The frozen risk vocabulary assumes a *geometric
relationship between a player-controlled subject and a hazard*. It has two modes and both require a single
distinguished subject: `hazard_clearance` needs a controllable one, `indicator_displacement` needs a unique
meter. A game whose danger is a **count of game state** — three disabled lanes here, `player.size < 1` in
`hoardspout` — has neither. This is the same gap the pre-registered `hoardspout` expectation names, arriving
a game early and from a different direction, which makes it a property of the instrument rather than of the
one game chosen to provoke it. Note also that `indicator_displacement` is used by **no** plan and no fixture
in this repository — its only exercise is one synthetic unit test (`tests/play-log-evidence.test.mjs:177`,
a "tilt-meter"). It is in exactly the position `hazard_conditions` was flagged for: speculative surface. The
difference is that `pulse-stream` is the first real game that *wanted* it and still could not use it, which
is evidence about its design (`records.find`), not merely about its disuse.

**`pulse-stream` stays in the contract as `not_rankable` with this reason.** Per the selection rule it may
not be removed or swapped, and per Stage 13 an `instrument_insufficient` stop is never converted to zero
points. *(Conditional as of 2026-07-26: the reason recorded here is the selector, and if the
indicator-selection probe repairs it, this game re-enters from Stage 8 on an unused pool under the re-entry rule
in "The measurement that precedes the freeze checkpoint". Its `not_rankable` status is the status until then,
not a settled one.)* It also discharges one validation item outright: it is the first `audioFiles` game taken through
conformance and a full development qualification pool rather than a load probe, and the inert audio host
layer held — 28/28 checks, no diagnostics, exact replay on 5/5 development episodes.

**`feedingfrenzy` Phase A, done 2026-07-26 — stopped at the gate, and the pre-registered expectation was
wrong.** The gate's breakdown is identical in shape to `pulse-stream`'s:

| criterion | status | cases | replication-ready | reason |
| --- | --- | --- | --- | --- |
| `causal_input_control` | `ready` | 6 | 5/5 | — |
| `risk_reward_coupling` | **`insufficient`** | 6 | 5/5 | `finite_source_risk_sample_missing` (0 risk samples) |
| `failure_agency` | `ready` | 6 | 3/5 | — |

**Why, and why it is not the reason the pre-registration gave.** This file predicted `feedingfrenzy` would
reach `completed`, and located the risk in `failure_agency`: "its terminal source is an annotated fish leaving
the field, so `failure_agency` has a terminal private source that is not a hazard contact. If the criterion
resolves, it generalises past contact deaths. If it does not, the limit is in
`first_terminal_private_by_gameplay_seed` presuming a contact, and that is the finding." **`failure_agency` is
`ready`.** The prediction's stated failure mode did not occur: the terminal-source rule does not presume a
contact, it presumes a `game_over` episode, and this game supplies five of them. The stop came from the
criterion nobody flagged.

The cause is that **`feedingfrenzy` has no hazard at all**. Nothing in the game can harm the shark — there is
no state in which the shark is damaged, blocked or killed. The run ends when a *reward* object leaves the
view. So `role_mapping.hazards` is frozen empty, no `hazard_clearance` sample is ever produced, and
`countRiskSamples` returns 0. As with `pulse-stream`, both escapes were tried and rejected on measured
grounds, not on taste:
- **`hazards: ["fish"]`.** Passes the gate, and is circular. Shark-to-fish contact *is* the scoring test
  (`char("a", …).isColliding.rect.black`), so shark-to-fish clearance is the reward-proximity measure.
  `risk_reward_coupling` would then be correlating reward with itself and could only ever return `confirmed`.
- **`indicator_displacement` on `fish`.** Measured across 21851 development frames: up to **30** fish coexist
  (median ≈ 15), and the first-drawn fish — the only one `records.find` returns — **is not the outermost in
  77.5% of frames**, against 32.5% for `pulse-stream`. The mode reads one record per frame, so it would be
  reporting a risk value about a fish in no danger roughly four times in five.
- **`hazards: ["seabed"]`, to reach commitment risk.** Rejected, and this one is worth stating because it is
  the run's designated test of the third open instrument question. A dart cannot be aborted — it runs until
  the shark crosses the rim — so "distance from the rim" really is "how far from a safe exit", and the seabed
  arc is annotated. But `hazard_clearance` counts exposure when clearance is *small*, i.e. when the shark is
  **at** the rim, which is the moment of least commitment. The measure would be exactly inverted, which is the
  same inverse coupling `bore-comet` reports. Freezing it would have manufactured the agreement the open
  question was hoping to observe.

**A second, separable defect this game exposes, in `terminalSignature()`.** With no hazards declared, the
classifier falls through to `view_boundary`, which asks whether the *controllable* subject sits on the view
edge. The shark orbits at radius 45 from centre and its triangle reaches 5 further, so it touches the 100×100
edge as a matter of course: `sharkAtViewEdge` was true on **3 of 5** development terminal frames. Had the game
reached Stage 12, `outcome_coherence` would have been scored *coherent* on those three for a positional
coincidence with no causal connection to the terminal — a fish left the field on the other side of the screen.
`view_boundary` is a coincidence test, not a causal one, and it is only safe for games whose controllable
subject does not normally travel along the view edge. This is not what stopped the game and it would not have
been visible from the feasibility artifact; it was found by printing the signature during qualification, the
same check `bladedancer` needed.

**What this costs the run, stated plainly.** `feedingfrenzy` was the matched pair for `bore-comet` — same
100×100 view, same input family — and this file says of it: "If those two do not separate, the run has not
demonstrated downward discrimination, whatever the other totals do." They now cannot be compared at all,
because one of them cannot be measured. **The seven-game run can no longer answer the discrimination question
it was built to answer.** That has to be reported as the run's outcome rather than replaced with a
substitute pair chosen after the fact; the selection rule forbids swapping a game once its evaluation has
begun, and choosing a new comparison after seeing which games survived would be exactly the conditioning the
rule exists to prevent. See the revised "Downward discrimination" item under "After the run".

*Qualified 2026-07-26.* The paragraph above is stated too flatly in one respect, corrected in the amendment to
"Downward discrimination": no *substitute* pair may be chosen, but **this** pair can return if the instrument
defect that removed it is repaired, which is what the indicator-selection probe tests. What cannot be undone by
a repair is the ordering — the defect was fixed after the stop was seen — and that is what the report owes.

**`hoardspout` Phase A, done 2026-07-26 — stops, as pre-registered, but for none of the reasons
pre-registered.** The prediction was: "expected to stop before Stage 9 at the development-only feasibility
gate, on two counts: the terminal is a scalar with no private source, and the reward/damage split follows the
player's colour state, which `hazard_conditions` can only express as `always` / `input_held` /
`input_released`." Both counts are wrong, and the actual cause is a third thing.

| criterion | status | cases | replication-ready | reason |
| --- | --- | --- | --- | --- |
| `causal_input_control` | `ready` | 6 | 5/5 | — |
| `risk_reward_coupling` | **`insufficient`** | 6 | 5/5 | `finite_source_risk_sample_missing` (0 risk samples) |
| `failure_agency` | `ready` | 6 | **5/5** | — |

- **Count 1 is false.** "The terminal is a scalar with no private source" does not stop anything.
  `failure_agency` is `ready` at 5/5 — the strongest replication of any criterion in any of the six games. The
  gate's terminal-source rule wants a `game_over` episode, not a hazard contact, and `player.size < 1`
  produces one on every development seed. Combined with `feedingfrenzy`, where the same count was predicted to
  be the danger and `failure_agency` was also `ready`, this settles the "Terminals without contact" question
  in the affirmative: **the terminal machinery is not contact-shaped.** Two games whose deaths are a scalar
  threshold and an escaping reward object both reached the criterion without difficulty.
- **Count 2 is moot, and the way it is moot answers the `hazard_conditions` question.** The colour-state split
  never needed `hazard_conditions`. It is expressible exactly, with no new plan vocabulary, by splitting the
  role at annotation time:
  `beginDrawing({ type: s.size < 5 ? "spark_inert" : s.color === player.color ? "spark_food" : "spark_hostile", object: s })`.
  This was built and the populations verified — 45803 `spark_food`, 72568 `spark_hostile`, 11554
  `spark_inert` across the development control matrix — before the scope had to be withdrawn for the reason
  below. So the answer to "is the `hazard_conditions` vocabulary wrong, or unnecessary?" is **unnecessary**:
  a condition on world state belongs in the annotation, where it can be arbitrary, not in a three-valued plan
  enum. See the resolution appended to that item under "After the run".
- **The real cause: the sparks cannot be annotated at all.** A spark's only geometry is
  `box(s.position, s.size)` at `main.js:138`, inside the condition of an `if` whose *both* branches
  `return true` from the `remove()` callback. No begin/end pair can bracket it. Closing before the returns
  needs two `endDrawing();` lines for one `beginDrawing(...)`, which the static gate rejects as an unmatched
  end. Closing after the `if` leaks the scope on precisely the ticks a spark is consumed — the ticks that
  carry the reward and the damage. With no spark annotation there is no reward role and no hazard role, so
  there are no clearance samples and `risk_reward_coupling` has nothing to measure. The sparks are recorded
  in `role_mapping.unresolved`.

**A defect in the Stage 4 static gate, found by measurement.** `WORKFLOW.md` Stage 4 lists as static gate
item 6: "Every scope closes within the same synchronous block." `runtime/annotation-diff.mjs` does not
implement it — `verifyAnnotationOnlyDiff` is a line matcher that counts `beginDrawing`/`endDrawing` lines and
has no view of control flow. The leaking form **passed** the static gate cleanly (`passed: true`,
`inserted_scope_count: 3`, `errors: []`) and only then produced `nested_begin` diagnostics on 126 of 13185
development frames, failing Stage 6 conformance at 24/28. So the documented gate item is really enforced one
stage later, by conformance, and the Stage 4 artifact can say `passed: true` about instrumentation that is
not valid. Worth deciding whether to state that Stage 4 is a syntactic gate and item 6 is Stage 6's job, or
to make the checker reject a `return` inside an open scope. Filed under "Workflow and operational items".

**A consequence worth naming: the annotation limit propagates into the policy.** Stage 7 requires the policy
to use only the annotation inventory, and for `hoardspout` that inventory is the player and nothing else — it
cannot see the sparks it is trying to eat. The frozen policy therefore steers by the one scalar it can read,
`player_core`'s box size, which is `trunc(player.size)` and rises only when a matching spark is eaten. It runs
a 70-tick hold / 1-tick release cycle (the release edge is the colour flip) and restarts the hold whenever
size increases. It scores 3-35 over 354-726 ticks against controls that score 0-2, terminates on 5/5 seeds and
replays exactly — so it qualifies — but it is a weaker policy than the game deserves, and the reason is
instrument reach, not the game. Note also that `coreAtViewEdge` was **false** on all five terminal frames, so
unlike `feedingfrenzy` this game does not trip the `view_boundary` false positive.

- [x] Phase A complete for all six new games (six feasibility reports in hand).
  — done 2026-07-26: 6 of 6. **Passed:** `bridgecross`, `bladedancer`, `cleaner`. **Stopped at the gate as
  `instrument_insufficient`:** `pulse-stream`, `feedingfrenzy`, `hoardspout` — all three on the identical
  single reason `risk_reward_coupling:finite_source_risk_sample_missing`, with every other criterion `ready`.
  See "What Phase A found" below.
  Phase A is now runnable without touching an analysis seed: `npm run evaluate:play-log-quality --
  <config> --feasibility-only [game-id ...]` stops the shared executor after the development-only feasibility
  gate (added 2026-07-26; `WORKFLOW.md` Stage 7, covered by `tests/play-log-quality-fixtures.test.mjs`). Before
  it existed there was no way to reach the gate except by running the analysis pool in the same call, which
  would have made the two-phase structure impossible to execute as written.
- [x] **Gate S — the screening kill gate.** This is now the next action, ahead of everything below it, because
  it is the cheapest thing that can end the approach: development compute only, no analysis pool, and one
  genuinely unknown datum (`bladedancer`'s control-dominance ratio) decides it. Pre-registered under "Gate S —
  the screening kill gate", including the threshold-free decision rule and the sensitivity probe. **A fail here
  stops the run** — the probe, the checkpoint and Phase B are not run, and the outcome is the negative result
  plus Phase A's instrument findings.
  — done 2026-07-26: **failed.** Four ratios measured on development seeds via the new
  `npm run measure:control-dominance`; `bladedancer` clusters with `bore-comet` under one reading of Signal 1
  and with `cleaner` under the other, because the signal's name says monotonic controls and its formula says
  best-of-all-controls. The sensitivity probe passed separately — the ratio survives a 1.5× difficulty change,
  so the signal is not a tuning artifact. Full numbers, both readings, and the basis for resolving the
  disagreement as a fail are in "Gate S — the result".
- [ ] ~~**The indicator-selection probe run, against a prediction written down before it.**~~ **Not run —
  Gate S failed 2026-07-26**, and the pre-registration makes this conditional on a pass. The prediction and the
  decision rule under "The measurement that precedes the freeze checkpoint" stand unedited and unresolved; the
  three games that stopped at the feasibility gate stay stopped, and `pulse-stream`'s and `feedingfrenzy`'s
  rows in the run status table stop being provisional and become terminal. Pools 101-102 are not consumed.
- [ ] ~~Instrument freeze checkpoint decided and its basis recorded here.~~ **Not taken — Gate S failed
  2026-07-26.** Two of its three questions are nonetheless answered by argument in this file and those
  resolutions stand on their own (`hazard_conditions`: unnecessary, remove; the operation sets: settled by
  Phase A). What is *not* decided is the risk-mode question, because that was the one the probe was to inform.
  No plan is re-frozen and no instrument change is adopted, which is the correct outcome of a stopped run: the
  instrument is left exactly as the seven games found it.
- [ ] ~~Phase B complete, including `bore-comet` as `docs-v8`.~~ **Not run — Gate S failed 2026-07-26.** No
  analysis pool was opened by this run beyond `bore-comet`'s pre-existing `docs-v6`/`docs-v7`; pools 95-100
  remain frozen and unopened, and pools 101+ remain free. Signal 2 (the reward-only decomposition) was to be
  emitted here and therefore has no measurement — its item under "Workflow and operational items" stays open.
- [ ] ~~Ranking produced and hashes verified.~~ **Not produced — Gate S failed 2026-07-26.** No game other than
  `bore-comet` has a quality result, so there is nothing to rank; the owed validation item "the `not_rankable`
  path on a real game" is therefore still owed and `hoardspout` has not exercised it.

### What Phase A found

Phase A is complete. Six games taken through Stages 0-8 on development seeds only; no analysis seed has been
opened, and `analysis_seed_accessed` is `false` in all six feasibility artifacts.

| game | gate | `causal_input_control` | `risk_reward_coupling` | `failure_agency` |
| --- | --- | --- | --- | --- |
| `bridgecross` | passed | ready 5/5 | ready 5/5 | ready 4/5 |
| `bladedancer` | passed | ready 5/5 | ready 5/5 | ready 5/5 |
| `cleaner` | passed | ready 5/5 | ready 5/5 | ready 4/5 |
| `pulse-stream` | **stopped** | ready 5/5 | **insufficient** | ready 3/5 |
| `feedingfrenzy` | **stopped** | ready 5/5 | **insufficient** | ready 3/5 |
| `hoardspout` | **stopped** | ready 5/5 | **insufficient** | ready 5/5 |

**Three of six stopped, all on one criterion, and never on any other.** Every stopped game reports
`risk_reward_coupling: finite_source_risk_sample_missing` — zero risk samples — while `causal_input_control`
is `ready` at 5/5 in all six games and `failure_agency` is `ready` in all six. This is not three games being
hard to measure; it is one part of the instrument failing on half the sample.

**The common cause: the risk vocabulary assumes a geometric relationship, and three games' risk is not one.**
Both frozen modes need a single distinguished subject — `hazard_clearance` needs a controllable subject and a
hazard role, `indicator_displacement` needs one meter record per frame. The three stopped games fail this in
three *different* ways, which is what makes it a property of the instrument rather than of any one game:

| game | what its risk actually is | why neither mode reaches it |
| --- | --- | --- |
| `pulse-stream` | how far left the drifting objects have got; three lost lanes ends it | no controllable subject at all — the button acts on the whole field. `indicator_displacement` would read the wrong object in 32.5% of frames |
| `feedingfrenzy` | how close any fish is to leaving the view; darting speeds every fish up | **no hazard exists** — nothing can harm the shark. `indicator_displacement` would read the wrong fish in 77.5% of frames (up to 30 coexist) |
| `hoardspout` | how close an opposite-coloured spark is to the player | the risk geometry is real and expressible, but the spark's only draw call **cannot be enclosed in a scope** |

In every case the honest short-cut — declaring the reward role as the hazard — was available and was rejected,
because in all three games reward proximity *is* the scoring test, so `risk_reward_coupling` would have been
correlating reward with itself and could only ever return `confirmed`. A criterion that cannot fail is not a
measurement. Each rejection is recorded with its measured basis in the per-game notes above.

**What this costs, and what has to be reported rather than repaired.** `feedingfrenzy` was the matched pair
for `bore-comet` on view size and input family, and this file states that if those two do not separate, the
run has not demonstrated downward discrimination. They cannot now be compared, so **the run cannot answer the
question the six games were added to answer.** Substituting a different pair after seeing which games survived
would condition the comparison on the outcome, which the selection rule exists to forbid. Phase B will produce
a ranking over at most four `completed` games — `bore-comet`, `bridgecross`, `bladedancer`, `cleaner` — and
three `not_rankable` entries, and that is the run's result.

*Qualified 2026-07-26, in one direction only.* "Rather than repaired" was written on the assumption that
repairing the instrument was not on the table. It is, for the narrowest of the three stops: two of the three
were recorded against `indicator_displacement`'s record selection, which is inconsistent with
`hazard_clearance`'s in the same function. The probe under "The measurement that precedes the freeze
checkpoint" decides it, and if it succeeds the ranking covers up to six games rather than four. `hoardspout`
stops regardless. Nothing here licenses repairing an instrument until a stop makes a repair convenient — the
test of that is whether the defect is arguable without reference to the game it rescues, and the ordering
disclosure is owed either way.

**Three findings that are separable from the stop and should not be lost in it.**
1. **`terminalSignature()`'s `view_boundary` case is a coincidence test, not a causal one.** It asks whether
   the controllable subject sits on the view edge, regardless of what caused the terminal. `feedingfrenzy`'s
   shark orbits at radius 45 with a triangle reaching 5 further, so it touches the 100×100 edge routinely:
   `sharkAtViewEdge` was true on 3 of 5 development terminal frames, every one of which ended because a fish
   left the field somewhere else entirely. Had that game reached Stage 12 it would have been scored *coherent*
   on those three. Measured false on 5/5 for `hoardspout` and on all of `bladedancer`'s and `cleaner`'s, so
   the defect is latent rather than general — but it is live for any game whose controllable subject travels
   along the view edge.
2. **The Stage 4 static gate cannot enforce its own item 6.** See the `hoardspout` note: instrumentation that
   leaks a scope on every consumed spark passed `check:annotation-diff` with `errors: []` and was caught two
   stages later by conformance.
3. **A state-dependent hazard belongs in the annotation, not in the plan.** `hoardspout` shows the split
   (`spark_food` / `spark_hostile` by a ternary on `s.color === player.color`) is exact and needs no plan
   vocabulary, which resolves the `hazard_conditions` question — see "After the run".

### The measurement that precedes the freeze checkpoint

**Pre-registered 2026-07-26, before the probe was run. Nothing in this section may be edited afterwards; the
result is appended below it.** The point of writing it first is that the probe decides whether to repair the
instrument, and a repair chosen after seeing which games it rescues is the same conditioning the selection rule
forbids everywhere else in this file.

**Why a measurement belongs before the checkpoint at all.** The checkpoint asks three questions.
`hazard_conditions` is already resolved by argument (unnecessary, remove). The operation sets are settled by
Phase A — every game generated its 6 cases per criterion. The third, "is a new risk mode warranted", is the one
that stopped half the run, and it cannot be answered by argument because the reason all three stops were
recorded is a *measured* count of zero risk samples. Taking the checkpoint decision without the probe means
freezing an instrument against the objection "an extremal selector would have measured these games" with no
answer.

**What is measured.** Both rejected `indicator_displacement` attempts failed for the same reason and it is not
a semantic one: `runtime/play-log-analysis.mjs:102` selects the indicator record with
`records.find((record) => record.label === plan.risk_measurement.indicator_role)`, which returns the
**first-drawn** record of that role, not the most endangered one. The probe replaces that selection with the
extremum along `indicator_axis` (the record whose displacement from `indicator_neutral` is greatest) and, on
`pulse-stream` and `feedingfrenzy` development episodes only, reports: the risk-sample count
`countRiskSamples` returns per criterion, and the resulting `risk_reward_coupling` gate status.

**The argument for the fix is independent of which game it rescues, and this is the part that makes the probe
legitimate.** `hazard_clearance` in the same function computes `Math.min(...clearances)` over *every*
controllable×hazard pair — the extremum, the most endangered pairing. `indicator_displacement` answers the same
per-tick question and takes the first record drawn. That is an internal inconsistency in one function, and it
would still be a defect if no game in this run had ever tripped it. The measured wrong-object rates (32.5% for
`pulse-stream` over 18322 frames, 77.5% for `feedingfrenzy` over 21851) are the evidence that it is live, not
the reason it is wrong.

**Prediction.** Both games produce risk samples above zero and `risk_reward_coupling` reaches `ready` on both.
For `pulse-stream` the extremal record is the leftmost `drifting_object`, and objects are on screen on nearly
every tick; for `feedingfrenzy` it is the outermost `fish`, with a median of ~15 coexisting. The wrong-object
rate goes to zero by construction, because the extremum *is* the definition of the endangered record. Stated so
it can be wrong: if either game still returns zero samples, the cause is not the selector and this prediction
was wrong about where the defect is.

**Non-circularity, checked in advance, because a passing gate is not the goal.** The rejected shortcuts were
rejected for making `risk_reward_coupling` correlate reward with itself. The extremal indicator does not,
in either game, and this must hold or the fix is worthless: `pulse-stream` scores on pulse-to-object *proximity*
(`obj.pos.distanceTo(pulse.pos) < pulse.amplitude * 6`) while the indicator measures an object's *leftward
drift* — different quantities; `feedingfrenzy` scores on shark-to-fish contact while the indicator measures a
fish's distance from the view edge. In `feedingfrenzy` darting speeds every fish up, so the scoring act raises
the indicator — risk and reward driven by one input, which is the pattern the criterion exists to detect, with
the criterion still free to report otherwise.

**Decision rule, fixed now.**
- **Both games reach `ready`** → adopt option (a): fix the selector. It is an instrument change; see the
  re-freeze scope in the checkpoint note.
- **Neither does** → adopt option (c): `indicator_displacement` is removed as speculative surface, on the same
  argument that removed `hazard_conditions` — no plan and no fixture uses it, and the one time a real game
  wanted it, correcting its worst defect still did not make it usable. Freeze, and report three stops.
- **Exactly one does** → adopt (a) anyway, because the selector inconsistency stands on its own, and record
  that only one game re-enters and why the other did not.

**Re-entry rule, decided here rather than left open, because otherwise the probe decides nothing.** An
**instrument-general** repair adopted at the checkpoint permits a game stopped at the gate to re-enter from
Stage 8 with a new evaluation ID and an unused analysis pool (101, 102, … per `SEED_LEDGER.md`). A
**game-specific** weakening never does — that is what the pre-registered "raising annotation coverage is the
only permitted way to bring a game back" is protecting, and it is untouched: the selector fix is not an
annotation change and applies to every game equally. Basis for the distinction: the selection rule exists to
stop the *set* and the *comparisons* being conditioned on results, and repairing a defect that is arguable from
one function's own inconsistency does neither. What re-entry costs is honesty about ordering, discharged by the
next paragraph.

**What must be reported if `feedingfrenzy` re-enters, and it does not fully restore what was lost.** The
`bore-comet`/`feedingfrenzy` matched pair is the run's only pre-registered discrimination test, so its return
would put that question back within reach. The report must nonetheless state that the repair was made **after**
seeing that the game stopped, and that the analyst therefore chose to fix an instrument defect knowing which
comparison the fix would restore. That is weaker than a pair measured under an instrument frozen before either
game was touched. The existing resolution under "Downward discrimination" stands as the record of what the run
looked like without the repair and is not deleted.

**What the probe does not settle.** `hoardspout` stays stopped whatever the probe shows. Its risk geometry is
real and expressible; what defeats it is that a spark's only draw call cannot be enclosed in a scope, which is
an annotation-and-static-gate problem with no bearing on record selection. Filed separately under "Workflow and
operational items" so the two are not resolved as one.

### Pre-registered ranking expectations

**Pre-registered 2026-07-26, before any `docs-v8` quality result exists. Not edited afterwards; results are
appended below.** At the time of writing, pools 95-100 are frozen and unopened, none of the six new games has a
`play_log_quality_result.json`, and `bore-comet`'s `docs-v8` round has not been run.

Two things are registered here, and their order of arrival matters because it is what makes the first one
usable: an instrument prediction made **label-blind**, and then the author's quality labels, which arrived
afterwards in the same conversation.

**Ground truth.** `DESIGNER_LABELS.md`, SHA-256
`40382350e9b521a052ff78fdf95ca229be8bff9c67152194b9dbcf41bb2efdc5`. Seven games rated /10 by their author with
a stated reason each. Read that file's "Provenance" section before using any comparison below: the labels were
**not** sealed — the author disclosed all seven in conversation before the freeze checkpoint was taken, so the
intended mirror of `frozen_before_quality_result_access` was not achieved. What substitutes for it is that every
checkpoint decision is already fixed by material predating the labels (the probe's decision rule above, and
`hazard_conditions` resolved for removal), and that Phase B admits no judgement at all.

#### The label-blind instrument prediction

Derived from the ranking implementation, `bore-comet`'s known vector, the frozen plans, and Phase A's
*development* observations. No analysis-pool data. Weights are 4/3/2/1 and all four criteria are
`required_criteria`, so a single `unresolved` value makes a game `not_rankable` with a null total rather than a
low one — the prediction is therefore mostly about resolution, not magnitude.

| game | causal (4) | risk (3) | failure (2) | outcome (1) | total |
| --- | --- | --- | --- | --- | --- |
| `bore-comet` | 2 | 1 | 2 | 1 | **16** (known from `docs-v6`/`docs-v7`) |
| `bridgecross` | 2 | 1 | 2 | 1-2 | 16-17 |
| `bladedancer` | 2 | 1-2 | 2 | 1 or **null** | 16-19, or `not_rankable` |
| `cleaner` | 2 | 1 | 2 | 1 | **16** |

Per-criterion confidence, stated because it is uneven: `causal_input_control` = 2 at high confidence, since
`confirmed` needs only two edits that change *any* relevant outcome; `failure_agency` = 2 at moderate-high, since
`minimum_replication_seeds` is 2 in all three plans against 4-5/5 development readiness; `outcome_coherence` low,
since `confirmed` demands `uniqueAttributionRate === 1` on every scored selection; `risk_reward_coupling`
lowest, since `confirmed` requires `reverse === 0` and one reverse-signed case drops it to 1.

Three predictions about the *shape*, which are held with more confidence than the ordering:
1. **Totals cluster at the top of the scale, not the middle.** With `causal` and `failure` near-certain 2s every
   game starts at 12, leaving only `risk` (0/3/6) and `outcome` (0/1/2) to move — an observable band of 16-20.
   This **corrects** the "Ranking resolution" note under "Design decisions the run cannot settle", which
   predicted bunching near the middle.
2. **A multi-way tie appears.** `bore-comet` and `cleaner` are both predicted `[2,1,2,1]`; identical vectors take
   a shared rank at `tie_threshold` 0.
3. **`bladedancer` carries the highest dropout risk of the four**, and it is the strongest candidate for the top
   total. Any private selection ending by gap-fall makes `terminalSignature()` return `unmapped`, and
   `classifyOutcomeCoherence` goes `unresolved` if *any* signature is unmapped. Development was 5/5
   `hazard_contact`; the analysis pool is five fresh seeds.

#### What the labels predict, once out-of-scope reasons are excluded

The author's ordering over the four rankable games is `bore-comet` 8 > `bladedancer` 7 > `bridgecross` 4 =
`cleaner` 4. Four of the seven reasons are outside what the instrument claims to measure — see the
classification in `DESIGNER_LABELS.md`, which is the analyst's and not the author's. So most pairs are not tests
of anything. Of the six rankable pairs:

| pair | author's gap | predicted instrument outcome | is it a test? |
| --- | --- | --- | --- |
| `bore-comet` / `cleaner` | 4 | **tie at 16** | **Yes — the run's one clean test.** `cleaner`'s reason is skill-independence of score, which is `causal_input_control`'s own subject |
| `bladedancer` / `cleaner` | 3 | `bladedancer` higher | Yes; both reasons in scope. Predicted **agreement** |
| `bridgecross` / `cleaner` | 0 | tie, or `bridgecross` +1 | A tie here would be **correct**, not a failure — the author rates them equal |
| `bore-comet` / `bladedancer` | 1 | **inverted** (`bladedancer` higher) | No. `bore-comet`'s 8 is for tactile feel, a forbidden claim. A mechanical instrument ranking `bladedancer` — whose reason *is* risk/reward — above it may be behaving correctly |
| `bore-comet` / `bridgecross` | 4 | tie or inverted | No. `bridgecross`'s 4 is for derivativeness, which no criterion approximates |
| `bladedancer` / `bridgecross` | 3 | `bladedancer` higher | Weak; `bridgecross`'s reason is out of scope. Predicted agreement by coincidence of direction |

**The one prediction that can convict the instrument, with its mechanism.** `cleaner` is predicted to score 2 on
`causal_input_control` while the author's reason for rating it 4 is that score does not depend on player skill.
The mechanism is the three-way disjunction at `runtime/play-log-quality-evaluator.mjs:740-744`: a case counts as
satisfied when local geometry diverged **and** (`reward_difference !== 0` **or** `survival_difference !== 0`
**or** the termination kind differs). `cleaner`'s base moves only while the button is released, so input edits
reliably change survival — `idle` and `hold` die on the same tick on every terminating seed because both are
stationary — and that alone yields `confirmed` with `reward_difference` identically zero. The independent
measured evidence is already in hand: on the same seed a `hold` control scores **903** on `cleaner` and **0** on
`bore-comet` (`final_score_best_control_same_seed`, recorded in
`records/bore-comet/docs-v6/artifacts/play-log-analysis/analysis-result.json`), and the instrument computes that
metric and then declines to let it reach any criterion.

**What would falsify each side.** If `cleaner` returns 0 or 1 on `causal_input_control`, this prediction is
wrong and the criterion discriminates better than its code suggests. If it returns 2, the criterion awards full
marks on the instrument's heaviest weight to a game the author faults on that exact axis, and the defect is
inside the declared scope. If `cleaner` instead leaves the ranking as `not_rankable`, the test does not run and
that is recorded as untested rather than as either outcome.

**What this may not become.** No criterion is added, reweighted, or removed to make the ranking reproduce
`DESIGNER_LABELS.md`. A ranking tuned to a supplied ordering restates the ordering and measures nothing; the
disagreement is the result. Any repair the `cleaner` test justifies is specified as a *later* instrument version,
declared with this run's outcome as its motivation.

### The screening reframe

**Decided 2026-07-26, after `DESIGNER_LABELS.md` was recorded.** The run's deliverable changes from a ranking to
a **screen**: a per-game predicate that flags games failing a mechanical property, plus per-game criterion
diagnostics, with no total ordering. Two conclusions are settled here and a third is deferred.

**Settled, and structural: this instrument cannot evaluate game quality, and no tuning will change that.** The
labels measured it. The reasons driving the author's ordering are tactile feel (`bore-comet` 8), cognitive panic
(`pulse-stream` 6), derivativeness (`bridgecross` 4) and stress (`feedingfrenzy` 4) — none of which exist in a
frame sequence. This is not a new discovery so much as a promotion: `claim_scope` was already
`play_log_mechanical_quality_only` and `forbidden_claims` already excluded appearance, perceptual clarity, audio
and human experience. What the labels add is the *quantity* — **four of seven reasons fall in the excluded
region, including the highest and lowest rated of the rankable games.** The exclusion clause excludes the
dominant factor. That is now a recorded finding rather than fine print.

**Settled: a ranked list is the wrong output shape, independent of resolution.** A rank table reads as a quality
ordering however many `limitations` accompany it, and a concrete misreading is already identified: a reader
comparing the final ranking to `DESIGNER_LABELS.md` would see `bladedancer` above `bore-comet` and conclude the
instrument is broken, when that inversion is plausibly the instrument correctly reporting that `bore-comet`'s
*mechanical* risk/reward is inverse-coupled — a measured finding — while its rank-1 standing rests on feel, a
forbidden claim. The honest shape is per-game diagnostics with no projection onto a one-dimensional axis.

**Deferred to measurement, not concluded: resolution.** "Two of four criteria are constant across all games, so
6 of 10 weight units carry no information" is a *prediction* under "Pre-registered ranking expectations", and
its two constant criteria are the ones held at high confidence while the two that move are held at low
confidence. Phase B costs minutes and converts it to measurement. Concluding it now would fix the weakest part
of the analysis as a finding to save nothing.

**Why a screen fits where a ranking did not.** Three structural reasons, none of which is about this
instrument's current accuracy:
1. **Asymmetric error tolerance.** A screen must be right when it fires and may miss; a ranking must be right in
   both directions. This instrument is trustworthy in at most one direction.
2. **No cross-game commensurability required.** A screen is a per-game predicate, so it sidesteps the problem
   that `bore-comet`'s 122 and `cleaner`'s 9601 are not the same scale — which is the stated reason the
   diagnostic-control metric was barred from the criteria in the first place. As a predicate the bar dissolves.
3. **`not_rankable` becomes coherent.** Under a screen an unmeasurable game is an **abstention**, which is
   correct behaviour; under a ranking it is a hole in the table. The exemption rule — a game that could not be
   measured is never screened out — is what makes the reframe sound, and it is adopted.

**What is kept.** The ranking machinery is not deleted. `rank:play-logs`, the contract and its
`frozen_before_quality_result_access` property stay, and the ranking is still produced as an internal artifact,
because "the `not_rankable` path on a real game" is an owed validation item and `hoardspout` is its first real
exercise. What changes is that the ranking stops being the run's headline output. Removing the machinery is a
schema change and belongs to a later instrument version, not to a run with frozen plans in flight.

### Gate S — the screening kill gate

**Pre-registered 2026-07-26, before it was run. Not edited afterwards; results appended below.** This is the
**earliest** gate the evidence allows, and it is placed **before** the indicator-selection probe and before the
freeze checkpoint, so that a failed screen costs nothing beyond development compute.

**What it can and cannot do, stated first because it governs how the result is read.** Gate S can **kill** the
screening approach and cannot confirm it. Two of its four data points — `cleaner` flagged, `bore-comet` not —
are the observations the signal was derived from, so their agreement is a restatement, not a test. Its value is
cheap disconfirmation before expensive work.

**Signal 1, the only signal this gate uses.** Monotonic-control dominance, per tick:

```
ratio = (best_control_final_score / control_executed_ticks) / (private_policy_final_score / policy_executed_ticks)
```

**Per-tick normalisation is load-bearing and is frozen here as part of the definition.** A per-episode ratio is
sensitive to how long passive play survives, which conflates "input does not affect score" with "passive play is
not punished quickly enough" — and the latter is fixable by a single difficulty parameter. Per-tick, the ratio is
invariant to parameters that scale numerator and denominator together (density, speed, difficulty ramp), which
is what makes it a structural measure rather than a tuning artifact. See "How much a parameter tweak can move
this" below.

**Data, and one asymmetry that must be stated.** `bridgecross`, `bladedancer` and `cleaner` each retain a
re-runnable `run-smoke.mjs` control matrix on development seeds — deterministic, no analysis pool touched.
`bore-comet` retains **no** control harness in any round; its only control datum is the
`best-control-same-seed` selection inside its already-accessed `docs-v6` result (`hold`, seed 93003, 0 points in
600 ticks against the policy's 122). That is legitimate to use — the round is already accessed and nothing is
burned — but it is an analysis-pool episode, not a development control matrix, so `bore-comet`'s point in this
gate is not the same kind of measurement as the other three. Phase B produces the uniform version for all four
via `final_score_best_control_same_seed`, and Gate S's verdict is revisited against it.

**What each game contributes, and which contributions are worth anything.**

| game | author | ratio | is it a test? |
| --- | --- | --- | --- |
| `bladedancer` | 7 | **unknown** | **Yes — the decisive datum.** Second-highest rated. If the screen flags it, the screen produces a false positive on a good game and the approach fails here |
| `bore-comet` | 8 | 0.00 (known) | No. The signal was derived partly from this value |
| `cleaner` | 4 | ≈0.28-3.15 (known) | No. Same reason. Its reason is in scope, which is why it is the intended positive |
| `bridgecross` | 4 | **unknown** | **No, either way.** Its 4 is for derivativeness, which no mechanical signal can see. A flag here would be a lucky hit and must not be counted as evidence; a miss is expected and is not a failure |

**Threshold-free decision rule, so the gate cannot be fitted to the labels.** No absolute cut is chosen — a
threshold drawn from `cleaner`'s 903 would be curve-fitting on one point. The gate asks only an **ordering**
question: is `bladedancer`'s ratio nearer `bore-comet`'s (low) or `cleaner`'s (high)?
- **`bladedancer` clusters with `bore-comet`, well below `cleaner`** → Gate S **passes**. The signal separates
  the author's 7-and-8 from the in-scope 4 on a datum that was not used to build it. Continue to the
  indicator-selection probe.
- **`bladedancer` clusters with `cleaner`** → Gate S **fails**. The signal flags the second-best game, and
  screening on it would discard good games. **Stop.** Do not run the probe, the checkpoint, or Phase B. The
  run's output becomes the negative result plus Phase A's instrument findings, which stand on their own.
- **`bladedancer` lands between with no clear separation** → treat as **fail**, not as inconclusive. A screen
  whose one honest test is ambiguous has no demonstrated precision, and the asymmetric-error argument that
  justified the reframe assumes precision.

**The sensitivity probe runs inside this gate, and it is the other genuinely unknown thing here.** It answers
directly how much a numeric tweak can move the signal: take `cleaner`'s difficulty parameter, perturb it
(≈1.5×), re-run the development control matrix and policy, and recompute the ratio. If the ratio is stable while
the game's difficulty changes materially, the signal measures structure. If the ratio collapses, it measures
tuning and the screen would cut games that a parameter fixes — which is a **fail** on its own, independently of
the ordering question.

This probe must run on a **throwaway copy outside the artifact chain**, explicitly labelled as a scratch
experiment. Changing a game parameter breaks the annotation-only diff, so its output is not a round artifact and
is never registered as one.

**How much a parameter tweak can move this, estimated in advance so the probe can contradict it.** Estimated
risk that the screen flags a game whose only defect is a numeric parameter: **low, on the order of 10-20%**,
concentrated in the difficulty-ramp mode that per-tick normalisation already removes. Estimated risk that it
flags a game fixable by a small *rule* change: **high** — but that is the signal working, not failing, and it is
why the flag must never be read as "discard". Risk that the instrument's own frozen parameters
(`press_edit_ticks`, `local_window_ticks`) manufacture a flag: **moderate and unquantified**, live for
hold-dominant games; it does not affect Signal 1, which reads absolute scores, but it is live for Signal 2 and
is recorded under "Workflow and operational items". These are estimates by argument; the probe measures the
first one.

**A risk this gate does not test, and no gate can.** The screen measures the artifact as published, not its
potential. Reading a flag as "discard this game" imports a claim about potential the instrument never made, and
the label set already contains the case: `feedingfrenzy`'s 4 is for aiming difficulty, which is plausibly a pure
parameter fix (fish speed, hitbox, dart angle). It escapes the screen only because it is exempt as
`not_rankable` — an accident, not a protection. The mitigation is not a better signal but an output format
requirement, filed under "Workflow and operational items": **the flag carries its measured numbers, never a
boolean.**

### Gate S — the result

**Ran 2026-07-26. Verdict: fail. The run stops here.** Per the pre-registered rule the indicator-selection
probe, the instrument freeze checkpoint and Phase B are **not** run, and the run's output is this negative
result plus Phase A's instrument findings, which stand on their own. Pools 95-100 stay frozen and unopened; no
analysis seed was touched by anything in this section.

**How it was measured.** `scripts/measure-control-dominance.mjs` — new, tracked, `npm run
measure:control-dominance -- <evaluation-config> [game-id ...]`. Development seeds and each plan's own tick
budget. Per game it re-runs the private policy exactly as the shared executor runs its pools, including the
exact-replay check, and re-runs the diagnostic control matrix beside it, so both sides of the ratio come from
one execution. Raw output is `tmp/gate-s/control-dominance-docs-v6.json` and `-docs-v8.json`, untracked like
every run output — the numbers below are the record. The arithmetic that decides the gate is separated as a
pure function and unit-tested in `tests/control-dominance.test.mjs` (6 tests).

**A correction to the pre-registration's data note, in the direction that strengthens the gate.** It states
that `bore-comet` "retains **no** control harness in any round", so its point would be an analysis-pool episode
rather than a development matrix — a stated asymmetry the gate had to be read around. That is wrong.
`buildBaselineMatrix` is game-agnostic, and `docs-v6` retains its adapter and its private policy, so a
development control matrix on the unburned 51xxx pool is reconstructible; it was reconstructed. All four points
are now the same kind of measurement and the asymmetry does not apply. `bore-comet`'s value is unchanged at
0.000, agreeing with the pre-registered `hold`/seed-93003 datum.

**The four ratios — and a column the pre-registration did not know it needed.** Median of the per-seed ratios,
with the pooled ratio (whole matrix as one episode) in parentheses.

| game | author | monotonic controls (idle, hold) | evaluator control set | smoke control set |
| --- | --- | --- | --- | --- |
| `bore-comet` | 8 | 0.000 (0.000) | 0.000 (0.000) | 0.000 (0.000) |
| `bridgecross` | 4 | 0.000 (0.000) | 0.176 (0.111) | 0.038 (0.030) |
| `bladedancer` | 7 | **0.000 (0.000)** | **1.221 (1.438)** | **1.528 (1.579)** |
| `cleaner` | 4 | 1.088 (1.485) | 1.088 (1.485) | 1.088 (1.485) |

`evaluator` is the four-control set the shared executor uses (`idle`, `hold`, `periodic-30-10`,
`seeded-random-12`), so it is the set Phase B's `final_score_best_control_same_seed` would have been comparable
to. `smoke` is the five-control set the per-game Stage 5-6 harnesses use. `monotonic` is `idle` and `hold`
alone — the controls whose input never changes.

**Why the gate fails: its decisive datum falls on both sides of an ambiguity in the gate's own definition.**
`bladedancer` clusters with `bore-comet` under one reading of Signal 1 and with `cleaner` under the other, and
the pre-registration contains both readings:
- The signal's **name and only statement of meaning** is "Monotonic-control dominance". Under that reading the
  control set is `idle` and `hold`, `bladedancer` scores **0.000 on every development seed**, it clusters with
  `bore-comet` far below `cleaner`, and the gate **passes**.
- The signal's **formula** says `best_control_final_score`, and the section binds it to
  `final_score_best_control_same_seed`, which the executor computes over its whole four-control set. Under that
  reading `bladedancer` is at 1.221, **above** `cleaner`'s 1.088, and the gate **fails**. Widening to the smoke
  set moves it further the same way (1.528).

The two coincide on the two games the signal was derived from and only diverge on the one game that was not,
which is why the ambiguity was invisible when the gate was written: `bore-comet`'s best control is `hold` with
0 points, and `cleaner`'s best control is `hold` on all five seeds in all three sets. `bladedancer` is the
first game where the best control is a *scripted tapper* — `periodic-30-10` and `seeded-random-12` score while
`idle` and `hold` score nothing at all, because the game requires taps to jump and slash and constant tapping
is a crude but real strategy.

**Basis for resolving the disagreement as a fail rather than choosing a reading.** Two independent arguments,
both settled before the numbers by material in the pre-registration itself:
- The third branch of the decision rule reads "**no clear separation** → treat as fail, not as inconclusive",
  and its stated basis is "a screen whose one honest test is ambiguous has no demonstrated precision". The
  literal trigger was written for a ratio landing between the anchors, and what happened instead is that the
  *definition* is ambiguous; the basis reaches this case unchanged, and it is the basis that carries the rule.
- The gate is asymmetric by construction: it "can **kill** the screening approach and cannot confirm it", and
  a pass is explicitly not confirmation because two of the four points were the signal's own source. So the
  passing reading offers nothing and the failing reading offers real disconfirmation. A disagreement between
  readings of an asymmetric gate resolves to the kill, whichever reading is later judged to have been intended.

Choosing the monotonic reading here would be choosing, after seeing the result, the reading that lets the run
continue. That is the conditioning this file forbids everywhere else, and the fact that the monotonic reading
may well be the one the author meant does not change what selecting it now would be.

**A second defect, independent of the reading, that the same data makes visible.** The ratio's denominator is
the private policy — agent work whose quality is uncontrolled and which is not held to any standard beyond the
Stage 7 qualification bar. On `bladedancer` an *unmodified scripted control* out-rates the policy outright on
4 of 5 seeds under the evaluator set, and on seed 53005 `seeded-random-12` simply outscores it (105 in 1800
ticks against the policy's 51 in 1564). Nothing distinguishes "this game does not reward input" from "this
policy is weaker than a masher", and the signal reports them identically. This is live under **every** reading,
including the monotonic one — `cleaner`'s 1.088 would fall if its policy were stronger — and it is invisible
on the two source games only because their monotonic controls score 0 and dominate respectively. A screen
whose flag can be produced by a weak denominator has no demonstrated precision either.

**A third defect, latent here, recorded so it is not rediscovered.** The formula selects the best control by
**total final score** and then divides by **that control's own tick count**, so it maximises one quantity and
reports another; the selected control need not be the one with the highest scoring rate. On the four baseline
games this changes almost nothing (medians move at most 1.221 → 1.247), but the sensitivity probe below fired
it: on perturbed `cleaner` seed 54004, `seeded-random-12` scored 162 to `hold`'s 153 and was therefore
selected, over 1673 ticks against 200, dropping that seed's ratio from 0.307 to 0.039. Both values are in the
artifact as `ratio` and `best_by_rate.ratio`. This is the same shape as the `indicator_displacement` selector
inconsistency filed under "The measurement that precedes the freeze checkpoint" — a selection rule that does
not maximise the quantity being reported — and it is worth noting that the run has now found the pattern twice
in unrelated code.

**The sensitivity probe: passed, and it is the one part of Gate S that survives.** `cleaner`'s `difficulty`
ramp was scaled by 1.5 in a throwaway copy of the instrumented source
(`tmp/gate-s/cleaner-difficulty-x15/`, outside the artifact chain, annotation-only diff deliberately broken,
never registered as an artifact), holding the private policy, its parameters, the development seeds and the
tick budget. The game changed materially — per-seed policy results moved from 9601/1800, 218/456, 1386/1164,
2133/1630, 466/757 to 1654/1021, 6870/1721, 980/942, 3010/1209, 2129/1121, so both scores and survival times
moved by large factors and in both directions. The ratio did not collapse:

| | monotonic median | monotonic pooled | range |
| --- | --- | --- | --- |
| `cleaner` as published | 1.088 | 1.485 | 0.285 - 1.791 |
| `cleaner` at 1.5× difficulty | 1.374 | 1.765 | 0.307 - 1.729 |

The flag survives a 1.5× difficulty change and moves by roughly a quarter while the game underneath it changes
by multiples. So per-tick normalisation does what it was frozen to do, and **the signal is not a tuning
artifact**. The pre-registered estimate — "risk that the screen flags a game whose only defect is a numeric
parameter: low, on the order of 10-20%" — is not contradicted. This result is about the ratio's *stability*,
not about its meaning, and it does not rescue the gate: a stable measurement of the wrong thing is still stable.

**What this does and does not conclude.** It kills *this* screening signal as pre-registered. It does not show
that no mechanical screen is possible, and it says nothing about the four games' quality — in particular
`bladedancer`'s high ratio is not a finding about `bladedancer`. What a successor signal would have to fix
before being worth pre-registering again: name its control set as part of the signal, not in its title; and
either remove the private policy from the denominator or state a policy-strength precondition that can be
checked, since the current denominator makes the signal partly a measurement of the analyst.

**One thing worth stating because it was nearly missable.** `bridgecross`, the other unknown, came in low
(0.176 / 0.038 / 0.000) against an author rating of 4. The pre-registration called this contribution worthless
in advance and in both directions — "a flag here would be a lucky hit and must not be counted as evidence; a
miss is expected and is not a failure" — and it is recorded here only so the row is not read later as a fourth
data point. It was a miss, it was predicted to be a miss, and it changes nothing.

### Selection

Frozen before any of the six new games is evaluated, on two declared axes.

**Axis A — instrument coverage.** View size, input scheme, and the structure of scoring and terminals.

**Axis B — discrimination.** Whether the instrument separates games that differ in quality, and whether it
reports a game it cannot measure as `not_rankable` rather than as low quality. Axis A alone cannot answer
either, because every game reachable through Axis A is a published game and the sample is truncated at the
top end.

| game | view size | input scheme | axis | what it covers that the others do not |
| --- | --- | --- | --- | --- |
| `bore-comet` | 100×100 | hold-dominant, release timing | A | already evaluated; the hold-and-release reference case |
| `bridgecross` | 150×50 | tap + hold | A | extreme aspect ratio; short episodes |
| `bladedancer` | 200×100 | tap + hold | A | wide view; two distinct terminal paths; crisp colour collision drives both scoring and death |
| `cleaner` | 100×150 | press, hold **and release** edges | A | all three input edges; tall view |
| `pulse-stream` | 100×100 | tap only | A | declares `audioFiles`, so it exercises the inert audio host layer end to end |
| `feedingfrenzy` | 100×100 | tap to commit, hold to steer | A + B | terminal fires when a **reward** object leaves the field, not on hazard contact; scoring carries a multiplier that resets per commitment |
| `hoardspout` | 100×100 | hold + release | A + B | attrition terminal (`player.size < 1`) with no terminal private source; a spark is reward or damage depending on the player's current colour, and contact damages rather than kills |

Four distinct view sizes across seven games, and every input-scheme family represented. Three deliberate
adversarial cases on Axis A:

- `cleaner`: the `hold` diagnostic control scored 136 in a 300-tick probe while `idle` scored 6. If any
  criterion moves because a control performs well, the rule that control performance is not a quality point
  is being violated somewhere.
- `bladedancer`: scoring and death both come from crisp colour collision against the same drawn shapes, so
  score attribution and terminal signature are tested on geometry that serves two purposes at once.
- `feedingfrenzy`: darting multiplies fish speed, so the act that scores is the act that raises the chance of
  the terminal. Risk and reward share one input, which is the pattern `risk_reward_coupling` exists to detect.

### Selection rule

The set is frozen before any game in it is evaluated. Games may be added because they are expected to score
low or to be unmeasurable — that direction is adversarial to the instrument and strengthens the run. What is
forbidden is changing the set after any result is accessed: no game may be removed, swapped, or replaced once
its evaluation has begun, and a game that turns out not to be evaluable is recorded as `not_rankable` with its
reason and stays in the contract.

If the run has to be shortened, the drop order is declared here in advance — `hoardspout`, then
`feedingfrenzy`, then `pulse-stream` — and a drop may only be exercised **before that game's Stage 0**, never
after any of its results exist.

### Pre-registered expectations

Written before any of the six is evaluated, so that the instrument questions in "After the run" are settled
against a stated prediction rather than after the fact. These are predictions to be tested, never licence to
do thinner work on a game whose stop is expected.

- `feedingfrenzy` is expected to reach `completed`. Its terminal source is an annotated fish leaving the
  field, so `failure_agency` has a terminal private source that is not a hazard contact. If the criterion
  resolves, it generalises past contact deaths. If it does not, the limit is in
  `first_terminal_private_by_gameplay_seed` presuming a contact, and that is the finding.
- `hoardspout` is expected to stop before Stage 9 at the development-only feasibility gate, on two counts:
  the terminal is a scalar with no private source, and the reward/damage split follows the player's colour
  state, which `hazard_conditions` can only express as `always` / `input_held` / `input_released`. Build its
  annotation plan to the same standard as every other game — raising annotation coverage is the only
  permitted way to bring a game back, and a stop reached through a thin plan proves nothing about the
  instrument.
- On discrimination: `feedingfrenzy` shares `bore-comet`'s view size and input family, so a difference
  between them cannot be attributed to coverage. If those two do not separate, the run has not demonstrated
  downward discrimination, whatever the other totals do.

### Execution in two phases

Do not run seven games end to end one after another. Half the purpose of this run is to find the instrument's
limits, but a ranking requires all seven to have been measured by the same instrument version. Run serially
and a defect found on game three forces a choice between finishing with a known-deficient instrument and
discarding the completed work.

Stages 0-8 use development seeds only and the feasibility gate is development-only, so the first phase cannot
contaminate any result.

**Phase A — Stages 0-8 for all six new games.** Annotation plan, annotation-only copy, adapter, conformance,
private policy, feasibility gate, and the frozen plan. `WORKFLOW.md` "Reading the feasibility report before
freezing" is the last point where the instrument may be adapted to a game, so this is where instrument
deficiencies surface. A game that stops here stops before the expensive part.

**Instrument freeze checkpoint.** With six feasibility reports in hand, decide the instrument version for the
whole run: whether `hazard_conditions` is needed by any game, whether the operation sets fit, whether a new
risk mode is warranted. Record the decision and its basis. Anything changed after this point restarts the
affected games from Stage 8 with a new evaluation ID and unused analysis seeds.

**Amended 2026-07-26, on two counts, both of which change how the decision is taken rather than what it is
about.**

*First: it is three decisions with three different re-freeze scopes, and recording it as one hides that the
costs are not comparable.* The blanket "anything changed after this point restarts the affected games" is
correct as a rule and misleading as a cost estimate for the two changes actually on the table:

| change | plans that must be re-frozen | real cost |
| --- | --- | --- |
| remove `hazard_conditions` | `bore-comet` only (`docs-v6`/`docs-v7` are the sole users) | none — that game is re-run as `docs-v8` in Phase B regardless |
| fix or remove `indicator_displacement` | **none** — no plan and no fixture in this repository uses the mode | none for the three games that passed; the three that stopped never froze a round that ran |
| add a third risk mode | every plan that would adopt it | high; the only genuinely expensive option |

So `bridgecross`, `bladedancer` and `cleaner` do not re-freeze under either of the first two, and their frozen
`docs-v8` plans and unopened pools 95-97 survive the checkpoint. The expensive option is the third one alone.

*Second: the third question is settled by measurement, not at this checkpoint by argument.* See "The
measurement that precedes the freeze checkpoint" — the probe runs first, and the checkpoint records its result.
The other two questions are decidable here and now.

**Phase B — Stage 9-13 for every game that passed Phase A**, plus `bore-comet` as `docs-v8`, then the record
and replication rounds and the ranking. This phase is scripted and cheap relative to Phase A.

### Ordering: re-running bore-comet

`play-log-ranking-contract.json` must be frozen **before** any quality result it references is accessed, and
`bore-comet`'s result is already known. Re-run `bore-comet` on a fresh analysis seed pool as `docs-v8` in
Phase B after the contract is frozen, so `frozen_before_quality_result_access: true` is truthful for all
seven entries. It costs about 25 seconds. The alternative — declaring bore-comet as pre-accessed — weakens the
contract for no saving.

State the limit of that guarantee in the report: the field is a formal property of the contract, and the
analyst has known `docs-v6`/`docs-v7` throughout. It does not claim that `bore-comet`'s annotation plan and
policy were built without knowledge of its earlier result.

### Per game (Stages 0-13)

Follow `../workflows/game-evaluation.md`. Per game, in order:

1. `npm run intake:batch -- <batch-id> ../docs <game-id>` — Stage 0 freeze and scaffolding.
2. Stage 1-2: static qualification and the private mechanical inventory.
3. Stage 3-4: annotation plan, then annotation-only scopes; `npm run check:annotation-diff`, then re-run
   intake to refresh hashes.
4. Stage 5-6: `adapter.mjs` from the scaffolded skeleton, then simulator conformance — control smoke, frame
   count, annotation diagnostics, exact replay — through `runAdapterConformance()`.
5. Stage 7: `private-policy.mjs` (contract in `WORKFLOW.md` Stage 7; the skeleton is scaffolded).
6. Stage 8: freeze the plan. **Read `probeable_development_episodes` in the feasibility artifact before
   freezing** and fix the annotation plan, the policy, the operation set, or the windows if a criterion is
   probeable in too few development episodes. This is the only place adaptation is allowed. — end of Phase A.
7. `npm run evaluate:play-log-quality -- batches/<batch-id>/evaluation-config.mjs`.
8. Stability replication: same instrument and settings, new evaluation ID, disjoint analysis seeds. Report
   both rounds whatever they show.

Starting points already known from source reading:

- `bridgecross`: roles are the brigade (controllable), bridge segments, and the gap below; single scoring
  site and a single terminal.
- `bladedancer`: player box plus a drawn sword; enemies score on sword contact and kill on body contact.
  The sword is a separate annotatable subject from the player — decide deliberately whether it is
  `controllable` or `projectiles_or_zones`, since that choice moves hazard clearance.
- `cleaner`: cleaner head (controllable), dirt as reward, arc hazards. Uses the release edge, so include
  `truncate_press_by_k` / `extend_press_by_k` in the operation set.
- `pulse-stream`: 370 lines, the largest annotation job of the seven. Tap-only, so the release-timing
  operations are unlikely to apply; use insertion and shift.
- `feedingfrenzy`: the shark is drawn as three `line()` calls, and the collision that scores is read from the
  fish's own `char("a")` against `rect.black` — so the controllable subject and the reward subject are drawn
  by different call families, and the annotation plan has to carry both. The terminal is a fish leaving
  `(0,0,100,100)`, so the "hazard" is the field boundary and the terminal source is a reward object.
- `hoardspout`: player bar (controllable), sparks as reward **and** damage depending on colour match. The
  release edge toggles the player's colour, which is what makes a given spark one or the other, so include
  the release-timing operations. Expect the terminal (`player.size < 1`) to have no private source.

### Ranking

```bash
npm run validate:artifact -- play_log_ranking_contract batches/<ranking-id>/play-log-ranking-contract.json
npm run rank:play-logs -- batches/<ranking-id>/play-log-ranking-contract.json batches/<ranking-id>
npm run verify:play-log-ranking-hashes -- batches/<ranking-id>/play-log-ranking-hashes.json
```

### Done when

**Amended 2026-07-26 for the screening reframe.** The deliverable is a screen plus per-game criterion
diagnostics; the ranking is produced as an internal artifact only, to exercise the owed `not_rankable` path. The
conditions below are unchanged except where marked, because they were written about the measurement and not about
the output shape.

- [x] **Gate S ran and its verdict is recorded with the four ratios.** Added 2026-07-26. If it failed, this is
  the last item: the remaining conditions do not apply, and the run's output is the negative result plus Phase A's
  instrument findings. If it passed, the record states plainly that a pass is *not* confirmation — two of the four
  data points were the ones the signal was built from.
  — done 2026-07-26: ran, **failed**, four ratios recorded under "Gate S — the result" across three control
  sets, plus the sensitivity probe. **It failed, so this is the last item and every condition below it does not
  apply.** They are left unticked and unedited rather than deleted: a condition that was never reached is part
  of the record of how far the run got, and rewriting them now would erase what the run was for. What the
  report owes instead is the single item at the end of this list.
- [ ] **The screen's output carries measured numbers per game, never a boolean.** Added 2026-07-26. A flag reads
  as "hold scores 1.505/tick against the policy's 0.478/tick", not as "cut". This is the only mitigation for the
  risk no gate can test — that the screen measures the artifact as published and says nothing about whether a
  parameter or rule change would fix it. A boolean output invites exactly the inference the instrument cannot
  support.
- [ ] **The report states which criteria may never contribute to a screen, and why.** Added 2026-07-26.
  `outcome_coherence` is barred: a low value there means the *instrument* could not attribute score or map a
  terminal, so screening on it penalises games for being hard to measure — the same failure the exemption rule
  excludes at the game level, one level down. `risk_reward_coupling` is barred alone: `bore-comet` scores 1 on it
  and the author rates that game highest, so inverse coupling is a design observation and not a quality defect.
  `causal_input_control` and `failure_agency` are predicted constant and carry no screening power as written.
- [ ] All seven games reached a terminal status, and the ones that stopped carry their `not_rankable_reasons`.
- [ ] The ranking contract was frozen before any referenced result was accessed.
- [ ] Every `completed` game has one replication round, and **both rounds are reported whatever they show**.
  Per `PLAY_LOG_ANALYSIS.md` 8.1, the round of record is the first one run under the current instrument;
  diverging ordinals are a finding about the instrument and are reported as such. Agreement is not a
  completion condition — making it one would create pressure to re-run until the rounds agree.
- [ ] The report states which games are `not_rankable` and why, and states in the same place that a play-log
  mechanical ranking is not an overall quality ranking and that a low total or a `not_rankable` verdict is not
  a statement that the game is bad. This matters more with `feedingfrenzy` and `hoardspout` in the set: they
  are published games, and a ranking that places them last must not be readable as this project judging its
  own catalogue.
- [ ] **The report states the run's claim at the width the run actually achieved, which is narrower than
  planned.** Added 2026-07-26, because until now this survived only inside a resolution paragraph under "After
  the run", and a completion condition that is not in this list is one the report can be written without. What
  must appear: that half the Phase A sample stopped on a single criterion; and either that the pre-registered
  `bore-comet`/`feedingfrenzy` discrimination test could not be run — so the totals of the `completed` games
  are comparable to each other with **no demonstration that the instrument separates games differing in
  quality within a matched coverage cell** — or, if the indicator-selection probe restores that pair, that the
  instrument defect it rests on was repaired after the stop was seen. Whichever holds, it is stated as the
  run's outcome and not as a caveat.
- [ ] **The report carries the `DESIGNER_LABELS.md` comparison, pair by pair, with the scope classification
  attached.** Added 2026-07-26. Required content: the `bore-comet`/`cleaner` result, since that is the run's one
  in-scope discrimination test; which pairs disagreed for reasons the instrument never claimed to measure, quoting
  the author's reason so the reader can check the classification; and the statement that the labels were not
  sealed. Forbidden content: any rank correlation over seven games or over the rankable subset — at most four are
  rankable and a coefficient on n=4 would present a pair-level observation as a validity statistic. The report
  also repeats that these ratings are overall game quality and `weighted_total` is not, so a disagreement is not
  by itself an instrument defect.

**The eight conditions above are not reached.** Added 2026-07-26 after Gate S failed. Each of them presupposes a
Phase B that ran: a screen with per-game numbers, criterion values to bar from a screen, seven terminal statuses,
a frozen ranking contract, replication rounds, and a `DESIGNER_LABELS.md` comparison over measured totals. None
of those exist and none will for this run. They are the conditions for the run that was planned, and keeping
them visible and unticked is the accurate record of the distance between that run and this one.

- [ ] **The report is a negative result about the screening approach, plus Phase A's instrument findings.**
  Added 2026-07-26, replacing the eight conditions above. What it must contain, and this is now the whole of the
  completion condition:
  - **Gate S's four ratios in all three control sets, and the fact that the verdict depends on which set the
    signal meant.** The numbers are the finding; a report that gives only the failing reading would be as
    selective as one that gives only the passing reading. Both are in "Gate S — the result" and both go in.
  - **That the gate was resolved as a fail on a rule fixed before the measurement**, together with the
    acknowledgement that the monotonic reading may well be what the author intended — and that adopting it
    after seeing that it lets the run continue is precisely what the pre-registration forbids.
  - **The sensitivity probe's pass**, stated as what it is: evidence that per-tick normalisation makes the ratio
    robust to a 1.5× difficulty change, which is a reusable result for a successor signal and not a rescue of
    this one.
  - **Phase A's findings**, which are the substantive output and do not depend on Gate S at all: three of six
    games stopped on `risk_reward_coupling` for three different structural reasons; the terminal machinery
    generalises past contact deaths while the coherence machinery does not; `terminalSignature()`'s
    `view_boundary` case is a positional coincidence test; the Stage 4 static gate cannot enforce its own item
    6; a state-dependent hazard belongs in the annotation rather than the plan; and a draw call inside a
    branching `remove()` callback has no annotation route.
  - **That no ranking exists and no game was screened**, so nothing in this run may be read as a judgement of
    any game. `bladedancer`'s high ratio in particular is a fact about the signal, not about the game — the
    author rates it 7, and it is flagged because crude constant tapping scores on it.
  - **That the labels were not sealed** (`DESIGNER_LABELS.md` "Provenance"), which matters more here than it
    would have in the planned report: Gate S's ordering question is stated in terms of the author's ratings, so
    the analyst knew the labels while resolving the gate. The countervailing fact is that the decision rule was
    fixed in writing before the ratios existed, and both readings' numbers are reported.

## After the run

### Instrument questions the run can settle

- **Commitment risk is not measurable.** Neither `hazard_clearance` nor `indicator_displacement` expresses
  "you are locked in until a safe exit exists", which is why `bore-comet` reports inverse coupling. A third
  risk mode (for example, ticks with no safe exit available) is the open design question. `feedingfrenzy` is
  the direct test: a dart is a commitment that cannot be aborted until the shark reaches the seabed edge. If
  it shows the same inverse pattern, two games from different mechanics agree and the mode is justified.

  **Resolved 2026-07-26 (the run cannot settle this, and Phase A explains why).** `feedingfrenzy` stopped at
  the gate, so it will never produce a coupling verdict to compare with `bore-comet`'s. But the attempt to
  make it produce one is the more informative result. The obvious encoding — freeze `hazards: ["seabed"]`, so
  clearance to the rim stands for "distance from a safe exit" — is available, the seabed *is* annotated, and
  it was rejected: `hazard_clearance` counts exposure when clearance is **small**, i.e. when the shark is at
  the rim, which is the moment of *least* commitment. The measure is exactly inverted. That is the same
  inversion `bore-comet` reports, and it is now clear it is not a coincidence of two mechanics agreeing: it is
  what necessarily happens when a commitment is encoded as a clearance, because commitment grows with distance
  from the exit and clearance-exposure grows with nearness to the hazard. **Basis for the design decision: a
  third risk mode is justified, and it cannot be a relabelling of `hazard_clearance`.** Freezing the seabed as
  a hazard would have manufactured the agreement this item was hoping to observe, which is why it was not
  done.

  **Filed as work 2026-07-26.** This resolution concluded that a mode is justified and stopped there, so it
  produced no item. It is now option (b) of "The risk vocabulary reaches only geometric risk" under "Workflow
  and operational items", where its cost is stated alongside the cheaper options. Note what the probe described
  under "The measurement that precedes the freeze checkpoint" does **not** touch: an extremal indicator
  selection is still a distance, so it cannot express commitment either. If the probe succeeds, this item
  survives it unchanged.
- **`hazard_conditions` is unvalidated.** Removing it did not change `bore-comet`'s verdict. This is settled
  in Phase A, not after the run: if no annotation plan among the six needs it, it is speculative surface and
  should be removed. `hoardspout` is the case that may instead show the vocabulary is wrong rather than
  unnecessary — its condition is a player **state**, not an input state.

  **Resolved 2026-07-26: unnecessary, and remove it.** Neither reading in the item is right. Of the six Phase
  A annotation plans, **none** needed `hazard_conditions`. `hoardspout` was the predicted hard case and it
  showed the opposite of "the vocabulary is wrong": its condition — a spark feeds or damages depending on
  whether its colour matches the player's current colour — is expressible *exactly*, with no plan vocabulary
  at all, by splitting the role at annotation time:
  `beginDrawing({ type: s.size < 5 ? "spark_inert" : s.color === player.color ? "spark_food" : "spark_hostile", object: s })`.
  The populations were verified before the scope had to be withdrawn for an unrelated reason: 45803
  `spark_food`, 72568 `spark_hostile`, 11554 `spark_inert`.

  **Basis, and it generalises past this one game.** A `beginDrawing` type is an arbitrary expression over
  private state evaluated at the draw call, so *any* condition a plan enum could express, and unboundedly many
  it could not, can be expressed by choosing the role. `hazard_conditions` is a three-valued enum
  (`always` / `input_pressed` / `input_released`) that duplicates the weakest corner of that capability while
  pretending the general case is out of reach. The one plan that uses it, `bore-comet` `docs-v6`/`docs-v7`,
  does not need it — removing it was already known not to change that game's verdict — and the same conditions
  are expressible as roles. Removal is an instrument change, so it belongs to the freeze checkpoint and would
  restart the affected games from Stage 8 with new evaluation IDs and unused pools; `bore-comet` is being
  re-run as `docs-v8` anyway. Note the cost to state honestly: role-splitting moves a condition from a
  declared, reviewable plan field into instrumented source, where it is checked only by the annotation diff.
  If it is removed, `WORKFLOW.md` Stage 3 should say that a state-dependent role split is the supported way to
  express a conditional hazard, so the capability is documented rather than folklore.
- **`contact_tolerance` decision.** It changed many contact decisions but no verdict in `bore-comet`. The
  audit metric `tolerance_dependent_contacts_<selection>` now makes that visible. Decide after the run:
  keep, or remove and accept unmapped terminals for margin-based collisions.
- **Terminals without contact.** `feedingfrenzy` (a reward object escapes) and `hoardspout` (a scalar reaches
  a threshold) are the first two games whose deaths are not hazard contact. Whether `failure_agency` reaches
  either of them tells us how much of the terminal machinery is contact-shaped by accident.
  **Third case found in Phase A 2026-07-26:** `bladedancer` has *two* terminal paths, one a contact and one
  not — falling into a gap is the absence of an annotated ground segment, which `terminalSignature()` reads as
  `unmapped`. It differs from the other two in that its non-contact path is avoidable by skilled play, so the
  game can still be measured; but three of seven games having a non-contact terminal makes the question
  structural rather than a property of the two games chosen to provoke it.

  **Resolved 2026-07-26: the terminal machinery is not contact-shaped, and this question is answered.**
  `failure_agency` reached `ready` in **all six** Phase A games, including both non-contact terminals it was
  filed against: `feedingfrenzy` (a reward object leaves the view) at 3/5 replication-ready, and `hoardspout`
  (`player.size < 1`, a scalar with no private source at all) at **5/5** — the strongest of any criterion in
  any game. Basis: `selectCounterfactualSource` and the gate's terminal rule key on
  `result.termination.kind === "game_over"`, not on a mapped contact, so a scalar death is an ordinary source.
  Both pre-registrations that predicted trouble here were wrong.

  **What is contact-shaped is `terminalSignature()`, which is a different function and a different problem.**
  It maps a terminal to `hazard_contact`, `view_boundary` or `unmapped`, and it feeds `outcome_coherence`, not
  `failure_agency`. All three non-contact terminals resolve to `unmapped` there — plus `bladedancer`'s gap
  path. So the honest split is: the *counterfactual* machinery generalises past contact deaths; the
  *coherence* machinery does not, and it additionally mis-fires positively via `view_boundary` (see finding 1
  under "What Phase A found").
- **Downward discrimination.** Whether the instrument separates `feedingfrenzy` from `bore-comet`, matched on
  view size and input family. This is the one question the added games exist to answer.

  **Resolved 2026-07-26: the run cannot answer it, and no substitute may be chosen.** `feedingfrenzy` stopped
  at the feasibility gate, so the matched pair does not exist. This item was written as the sharpest form of
  the question precisely because the pair controlled for coverage; picking a different comparison now — say
  `bladedancer` against `bore-comet` — would be choosing the comparison after seeing which games survived,
  which is the conditioning the selection rule forbids, and the two do not match on view size or input family
  in any case. **Basis for reporting rather than repairing:** an unanswered pre-registered question is a
  result; an answered post-registered one is not. The run's honest claim is narrower than planned and should
  be stated as such in the report — that four games were measured under one instrument version and their
  totals are comparable to each other, with no demonstration that the instrument separates games that differ
  in quality within a matched coverage cell. Restoring the question needs a *new* matched pair declared before
  either is evaluated, which is a future run, not this one.

  **Amended 2026-07-26 — one route back exists, and it is not the substitution this resolution forbids.** The
  sentence above is right that no *different* pair may be chosen. It overlooked that the pre-registered pair
  itself can return if the instrument defect that removed it is repaired: see "The measurement that precedes the
  freeze checkpoint". That is not choosing a comparison after seeing which games survived — the pair was
  declared in advance and the repair is arguable from one function's internal inconsistency, without reference
  to any game. The conclusion above therefore holds **conditionally**, as the record of what the run looks like
  if the probe fails or option (c) is adopted, and is kept for that purpose. If the pair does return, the
  report owes the ordering disclosure required in that section: the repair was made after the stop was seen,
  which is weaker than a pair measured under an instrument frozen before either game was touched.

### Design decisions the run cannot settle

Both were previously filed as things five games would resolve. They are not empirical questions and no number
of games will answer them; decide them by argument and record the reasoning.

- **`outcome_coherence` cannot reach `contradicted` in practice.** With two observation channels, "the
  annotation is missing" and "the world contradicts the outcome" are not separable — that is a consequence of
  the channel set, not of the sample. Either accept the criterion as three-valued in practice, or redefine
  it. Running seven games does not make the two cases separable.
- **Ranking resolution.** The previous note said four criteria in {0,1,2} with weights 4/3/2/1 "give few
  distinct totals". That is wrong: every total from 0 to 20 is reachable. The real concern is that realistic
  games cluster on 1 and 2 per criterion, so totals bunch near the middle, and with `tie_threshold` fixed at
  0 identical vectors take a shared rank. Seven games cannot estimate that distribution either. What this run
  can show is narrower and worth stating as the actual claim: whether two games in the same coverage cell
  that differ in quality end up at different totals.

  **Superseded in part 2026-07-26 by "The screening reframe".** The item is answered in the direction that made
  it moot: the run no longer produces a ranking as its deliverable, so the distribution of totals stops being the
  question. Two corrections to the prose above, both from structure rather than from a sample:
  - **"Totals bunch near the middle" is wrong; they bunch near the top.** With `causal_input_control` and
    `failure_agency` predicted at 2 for every game, all games start at 12 of 20 and only `risk` (0/3/6) and
    `outcome` (0/1/2) move — an observable band of 16-20. See "Pre-registered ranking expectations".
  - **The narrower claim the item proposed is now known to be unavailable in the form given.** "Two games in the
    same coverage cell that differ in quality" required a matched pair with a quality label; the pre-registered
    pair had the coverage match but no label, and it stopped at the gate. The label now exists
    (`DESIGNER_LABELS.md`) but for a pair that is not coverage-matched. What survives is the pair-level test
    named there.

  Resolution is still not settled and Phase B still measures it — the constant-criteria prediction is held at
  higher confidence than the two criteria that move, which is the wrong way round for concluding it by argument.

### Workflow and operational items

- [ ] **A control-dominance signal must name its control set, and must not put agent work in its denominator.**
  Filed 2026-07-26 from Gate S. It is listed first because it is what ended the run. Three defects, in
  descending order of how much they cost:
  - **The control set is not part of the signal.** "Best control" is a maximum over a set that was never
    declared, and the two candidate sets — monotonic (`idle`, `hold`) and the executor's four — give opposite
    verdicts on the one game that was not used to build the signal. Any successor states its set in the
    definition, not in the title. Note the trap this fell into and how cheaply: the two readings agree on every
    hold-dominant game, which is what the signal was derived from, so no amount of care applied to
    `bore-comet` and `cleaner` would have exposed it.
  - **The denominator is the private policy**, whose strength is uncontrolled agent work qualified only against
    a Stage 7 floor. `bladedancer`'s scripted controls out-rate its policy on 4 of 5 development seeds, and
    nothing in the signal separates "this game does not reward input" from "this policy is weaker than a
    masher". Options, none costed yet: remove the policy from the denominator (compare controls against each
    other, or against a fixed reference rate); state and check a policy-strength precondition; or accept the
    signal only where the policy demonstrably beats every control, which is a precondition dressed as a scope
    limit and should be written as the former.
  - **The formula maximises one quantity and reports another.** Best control is selected by total final score
    and the ratio then uses that control's per-tick rate, so the selected control need not be the fastest
    scorer. Latent on the four baseline games (medians move at most 1.221 → 1.247) and live on the perturbed
    `cleaner`, where the by-score winner dropped a seed's ratio from 0.307 to 0.039. `measure-control-dominance`
    already reports `best_by_rate` alongside so the divergence is visible rather than silent.

  **What survives and should be carried forward rather than re-derived:** per-tick normalisation works. The
  ratio moved by about a quarter under a 1.5× difficulty change that moved the game's scores and survival times
  by multiples, so a successor signal keeps the per-tick form and does not need to re-measure this.
- [ ] **Signal 2 — the reward-only decomposition of `causal_input_control` — emitted as a Phase B audit metric.**
  Filed 2026-07-26. The criterion's three-way disjunction at `play-log-quality-evaluator.mjs:740-744` counts a case
  as satisfied when local geometry diverged **and** (`reward_difference !== 0` **or** `survival_difference !== 0`
  **or** the termination kind differs), so a game whose input moves only survival scores full marks on the
  heaviest criterion. The reward-only fraction — what share of eligible causal cases have
  `reward_difference !== 0` — is computable from the counterfactual artifact the executor already produces, needs
  no new instrumentation, and is the direct measurement of "does input move the score". Emit it per game
  alongside the criterion value; do **not** let it change the criterion in this run.

  **A confound to record with it, because it can manufacture a false flag.** The measure depends on
  `press_edit_ticks` and `local_window_ticks` being large enough relative to the game's own timescale. For
  hold-dominant games the margin is thin: `cleaner`'s press runs are median 107 ticks against a 5-tick edit.
  Against its *release* runs — median 1 tick — the same edit is a large perturbation, so the confound may not
  bite; that is an argument, not a measurement, and it means the earlier claim that `cleaner` will show a
  near-zero reward-only fraction is **less certain than it was stated to be** under "Pre-registered ranking
  expectations". Report the fraction with the edit size and the game's press/release run medians beside it, so a
  low value cannot be read as a game property when it may be a probe-scale artifact.
- [ ] **The risk vocabulary reaches only geometric risk, and that stopped half of Phase A.** Filed 2026-07-26.
  It is listed first because it is the run's principal finding and, until now, the only Phase A finding with no
  item: the three *separable* defects below were each filed, while the one that actually stopped three games
  existed only as prose under "What Phase A found". By this file's own convention a finding that needs a
  decision gets an item, so its absence was an omission, not a judgement that nothing needs deciding. Four
  options, deliberately kept apart because they have different costs and different scopes:
  - **(a) Fix `indicator_displacement`'s record selection** — `runtime/play-log-analysis.mjs:102` takes the
    first-drawn record where `hazard_clearance` twelve lines earlier takes `Math.min(...)` over every pair. One
    function, two selection rules for the same per-tick question. Decided by the probe; see "The measurement
    that precedes the freeze checkpoint". No plan re-freezes.
  - **(b) Design a third risk mode** for risk that is a count of game state rather than a distance (three lost
    lanes; `player.size < 1`). This also subsumes the commitment-risk resolution under "After the run", which
    concluded a third mode is justified and cannot be a relabelling of `hazard_clearance`. The expensive
    option, and the only one that would need every adopting plan re-frozen.
  - **(c) Remove `indicator_displacement`** as speculative surface — no plan, no fixture, one synthetic unit
    test (`tests/play-log-evidence.test.mjs:177`). This is the same argument that retired
    `hazard_conditions`, and it is only honest if (a) has been tried, because the recorded reason for both
    rejections was the selector, not the mode.
  - **(d) `hoardspout`'s annotation limit is a different problem and must not be resolved with this one.** See
    the next item.
- [ ] **A draw call that cannot be enclosed in a scope has no annotation route.** Filed 2026-07-26, split out
  of the item above so the risk-mode decision cannot be mistaken for a fix for this. `hoardspout`'s spark is
  drawn by `box(s.position, s.size)` at `main.js:138`, inside the condition of an `if` whose both branches
  `return true` from a `remove()` callback: closing before the returns needs two `endDrawing()` for one
  `beginDrawing` and the static gate rejects it, and closing after the `if` leaks the scope on exactly the
  ticks that carry the reward and the damage. No option in the item above reaches this game. Decide whether the
  annotation contract needs a form for it (a single-call annotation that needs no closing scope would do it) or
  whether "some draw calls are unannotatable" is an accepted limit stated in `WORKFLOW.md` Stage 3.
- [ ] **Root integration, phase 2.** `evaluation/` is wired in as an optional post-batch step. Not yet done:
  running it against a freshly generated `tmp/games/` batch rather than published `docs/` games.
- [ ] **Scope guidance in `workflows/game-evaluation.md`.** It advises starting with two or three games and
  then deciding whether to scale. The two-phase structure above is the reconciliation — Phase A is that
  decision point, taken with six feasibility reports instead of two full evaluations. Update the workflow
  document to match once the structure has been used once.
- [ ] **`scripts/evaluate-batch8-v3.mjs`** still points at a batch config that does not exist in this
  snapshot. Either generalise it or drop it, and update the test that asserts its structure.
- [ ] **Stage 4's static gate does not enforce its own item 6.** `WORKFLOW.md` Stage 4 lists "Every scope
  closes within the same synchronous block" as a static gate check, but `runtime/annotation-diff.mjs` is a
  line matcher with no view of control flow. Found in Phase A on `hoardspout`: instrumentation whose scope
  leaks on every consumed spark passed `check:annotation-diff` with `passed: true` and `errors: []`, and was
  caught two stages later by conformance (`nested_begin` on 126 of 13185 frames, 24/28 checks). Decide one of:
  state in `WORKFLOW.md` that Stage 4 is syntactic and item 6 is Stage 6's job, or teach the checker to reject
  a `return` / `throw` / `break` / `continue` between a `beginDrawing` and its `endDrawing`. The first is
  cheap and honest; the second moves the failure to where the artifact claims it is checked.
- [ ] **`terminalSignature()`'s `view_boundary` case is a positional coincidence test.** It reports a terminal
  as coherent whenever the controllable subject happens to sit on the view edge, with no link to the cause.
  Measured live in Phase A on `feedingfrenzy` (true on 3 of 5 development terminal frames, all caused by a
  fish leaving the field elsewhere). Either require the boundary crossing to involve the subject the terminal
  is attributed to, or drop the case and let those terminals be `unmapped`.
- [ ] **`criterion_rules` is free text** that the executor never reads. Either bind it to the classifier (a
  rule table hash checked at execution) or keep it descriptive and say so in one place only.
- [ ] **LLM advisory artifact** (`LLM-REVIEW.private.md`) is specified but has never been produced. Either use
  it once to see whether the separation holds in practice, or drop the specification.

### Validation still owed

- [x] **Tap-only game sanity.** Confirm that the hold-oriented machinery (release-timing operations, the
  insertion ladder, `press_edit_ticks`) is inert or harmless on a tap-only game. `pulse-stream` and
  `bladedancer` in this run are the test.
  — done 2026-07-26: **harmless, and not merely inert.** `pulse-stream` is the only genuinely tap-only game in
  the set (no `isPressed`, no `isJustReleased`), and its plan froze the full four-operation set —
  `truncate_press_by_k`, `extend_press_by_k`, `shift_press_minus_one`, `insert_press_window` — with
  `press_edit_ticks: 2`. The gate generated the full **6 cases** for both `causal_input_control` and
  `failure_agency`, replication-ready on 5/5 and 3/5 development episodes. So the release-timing operations do
  not merely fail to break a tap game; on a game whose taps are discrete 1-tick presses separated by long
  released runs, `extend_press_by_k` and `insert_press_window` are the operations that carry the probe, and
  the ladder is what supplies the depth. The game stopped for an unrelated reason (no controllable subject),
  which does not weaken this: the case generation the item asks about happens at the gate and was observed.
  **Correction 2026-07-26: `bladedancer` is not a tap-only game and cannot serve as this test.** Its
  `description` says `[Tap] Jump & Slash`, but `player.jumpTicks -= input.isPressed ? 0.5 : 1` makes the hold
  mechanically live — holding doubles the airtime from 30 ticks to 60, which is what clears a wide gap. Its
  manifest now declares `["tap", "hold"]`. `pulse-stream` is the only remaining tap-only candidate in the set,
  so this item rests on one game; if `pulse-stream` also turns out to read `isPressed`, the run cannot settle
  this item at all and that should be recorded rather than papered over.
- [x] **Audio path.** `pulse-stream` is the first `audioFiles` game to go through a full evaluation rather
  than a load probe.
  — done 2026-07-26: the inert audio host layer holds. `pulse-stream` declares
  `audioFiles = { bgm: "./pulse-stream/Pixelated_Journey.mp3" }` and passed 28/28 conformance checks, a
  25-episode diagnostic control matrix and a 5-episode development qualification pool with zero annotation
  diagnostics and exact replay throughout. The game stopped at the feasibility gate for an unrelated reason
  (no controllable subject, so no risk samples), which does not weaken this result: the audio path was
  exercised end to end by everything up to and including the gate.
- [ ] **The `not_rankable` path on a real game.** `tests/fixtures/games/inert-timer` proves the negative
  control works on a fixture. `hoardspout` is the first published game expected to exercise it end to end,
  including how the reason reaches `PLAY_LOG_RANKING.md`.
- [ ] **Second evaluator fixture.** `tests/fixtures/games/` has a positive and a negative control. A third
  fixture reproducing a hold-and-release game would keep the release-timing operations under test without
  depending on `docs/` content.
