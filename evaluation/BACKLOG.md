# Backlog

Working notes for this workflow. Not normative: the normative documents are `AGENTS.md`, `WORKFLOW.md`,
`RUNTIME_CONTRACT.md`, `CONTRACTS.md`, and `PLAY_LOG_ANALYSIS.md`.

## How to update this file

**When an item here is finished, record its status in this file as part of the same change.** A backlog item
is not done until the outcome is written down here — an unrecorded completion is indistinguishable from work
that never happened, and the next session will re-derive it.

Three mechanisms, by item shape:

- **Binary items** (a thing to do) carry a checkbox. Mark `- [x]` and append `— done YYYY-MM-DD:` with the
  one-line outcome and, where it exists, the artifact path or commit that carries it.
- **Decisions and open questions** (the items under "After the run") do not resolve to done/not-done. Leave
  the prose in place and append a `**Resolved YYYY-MM-DD:**` line under the item stating the decision *and its
  basis*. The basis is the part that matters — these are the items whose reasoning must survive.
- **The seven-game run** is tracked in the status table below, not by checkbox: a game can stop at the
  feasibility gate, which is a legitimate terminal state and not a failure to complete.

Update "Current state" whenever a status change makes it stale. Do not delete completed items — this file is
the only place the run's history is kept, and a removed item reads as an item that was never raised.

## Current state

- Shared runtime and 60 conformance tests pass from a clean checkout (`npm ci --ignore-scripts && npm test`).
- One game evaluated: `bore-comet`. Record round `docs-v6` (analysis seeds 93001-93005) and its stability
  replication `docs-v7` (94001-94005) both returned `completed` `[2,1,2,1]`, weighted 16/20.
- `docs-v1` … `docs-v5` are earlier instrument versions, retained as provenance only. Their numbers are not
  comparable to `docs-v6`/`docs-v7` and must not be mixed into a ranking.
- No ranking exists yet: ranking needs two or more `completed` games.
- `generated/` is 253 MB for that one game across seven rounds, because private frames are retained per round.

## Before the run starts

Three items must be settled before any new game enters Stage 0. Each is cheap now and expensive to decide in
the middle of a seven-game run.

- [ ] **Artifact retention policy.** 253 MB for one game means seven games with a record and a replication
  round each will not stay manageable. Decide the policy now — for example, retain private frames only for the
  current instrument version's record and replication rounds, and prune superseded versions. Archiving
  `docs-v1` … `docs-v5` is the first application of whatever policy is chosen.

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
  a separate decision from this one and has not been taken.

  **Still open:** the on-disk policy. `.gitignore` does not prune anything, so `generated/` is still 253 MB
  locally and grows per game.
- [ ] **Seed ledger location.** Burned analysis seed pools are a correctness matter across rounds, not
  bookkeeping: reusing a pool breaks the freeze. Keep one ledger at `evaluation/SEED_LEDGER.md`, one section
  per game, appended when a pool is consumed. Existing entries for `bore-comet`: analysis pools 61xxx, 71xxx,
  81xxx, 91xxx, 92xxx, 93xxx, 94xxx; development seeds 51xxx.
- [ ] **`execution.retry_count`.** It is a reserved plan field with no implementation. Either implement it or
  remove it, and in the same change state the procedure for a game that fails a round technically — per
  `AGENTS.md`, that is a new evaluation ID with unused analysis seeds, not a silent re-run.

## Next step: seven-game run

### Run status

Updated as each game moves. `stage reached` is the highest stage whose artifact exists; `result` stays empty
until a round of record completes. A game that stops at the Stage 8 feasibility gate is recorded as
`stopped at gate` with its reason — that is a terminal state and a result about the instrument, not a failure
to finish the work.

| game | stage reached | eval IDs | result | notes |
| --- | --- | --- | --- | --- |
| `bore-comet` | 13 | `docs-v6`, `docs-v7` | `completed` 16/20 `[2,1,2,1]` | re-run pending as `docs-v8` in Phase B |
| `bridgecross` | — | — | — | not started |
| `bladedancer` | — | — | — | not started |
| `cleaner` | — | — | — | not started |
| `pulse-stream` | — | — | — | not started |
| `feedingfrenzy` | — | — | — | not started |
| `hoardspout` | — | — | — | not started |

- [ ] Phase A complete for all six new games (six feasibility reports in hand).
- [ ] Instrument freeze checkpoint decided and its basis recorded here.
- [ ] Phase B complete, including `bore-comet` as `docs-v8`.
- [ ] Ranking produced and hashes verified.

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

## After the run

### Instrument questions the run can settle

- **Commitment risk is not measurable.** Neither `hazard_clearance` nor `indicator_displacement` expresses
  "you are locked in until a safe exit exists", which is why `bore-comet` reports inverse coupling. A third
  risk mode (for example, ticks with no safe exit available) is the open design question. `feedingfrenzy` is
  the direct test: a dart is a commitment that cannot be aborted until the shark reaches the seabed edge. If
  it shows the same inverse pattern, two games from different mechanics agree and the mode is justified.
- **`hazard_conditions` is unvalidated.** Removing it did not change `bore-comet`'s verdict. This is settled
  in Phase A, not after the run: if no annotation plan among the six needs it, it is speculative surface and
  should be removed. `hoardspout` is the case that may instead show the vocabulary is wrong rather than
  unnecessary — its condition is a player **state**, not an input state.
- **`contact_tolerance` decision.** It changed many contact decisions but no verdict in `bore-comet`. The
  audit metric `tolerance_dependent_contacts_<selection>` now makes that visible. Decide after the run:
  keep, or remove and accept unmapped terminals for margin-based collisions.
- **Terminals without contact.** `feedingfrenzy` (a reward object escapes) and `hoardspout` (a scalar reaches
  a threshold) are the first two games whose deaths are not hazard contact. Whether `failure_agency` reaches
  either of them tells us how much of the terminal machinery is contact-shaped by accident.
- **Downward discrimination.** Whether the instrument separates `feedingfrenzy` from `bore-comet`, matched on
  view size and input family. This is the one question the added games exist to answer.

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

### Workflow and operational items

- [ ] **Root integration, phase 2.** `evaluation/` is wired in as an optional post-batch step. Not yet done:
  running it against a freshly generated `tmp/games/` batch rather than published `docs/` games.
- [ ] **Scope guidance in `workflows/game-evaluation.md`.** It advises starting with two or three games and
  then deciding whether to scale. The two-phase structure above is the reconciliation — Phase A is that
  decision point, taken with six feasibility reports instead of two full evaluations. Update the workflow
  document to match once the structure has been used once.
- [ ] **`scripts/evaluate-batch8-v3.mjs`** still points at a batch config that does not exist in this
  snapshot. Either generalise it or drop it, and update the test that asserts its structure.
- [ ] **`criterion_rules` is free text** that the executor never reads. Either bind it to the classifier (a
  rule table hash checked at execution) or keep it descriptive and say so in one place only.
- [ ] **LLM advisory artifact** (`LLM-REVIEW.private.md`) is specified but has never been produced. Either use
  it once to see whether the separation holds in practice, or drop the specification.

### Validation still owed

- [ ] **Tap-only game sanity.** Confirm that the hold-oriented machinery (release-timing operations, the
  insertion ladder, `press_edit_ticks`) is inert or harmless on a tap-only game. `pulse-stream` and
  `bladedancer` in this run are the test.
- [ ] **Audio path.** `pulse-stream` is the first `audioFiles` game to go through a full evaluation rather
  than a load probe.
- [ ] **The `not_rankable` path on a real game.** `tests/fixtures/games/inert-timer` proves the negative
  control works on a fixture. `hoardspout` is the first published game expected to exercise it end to end,
  including how the reason reaches `PLAY_LOG_RANKING.md`.
- [ ] **Second evaluator fixture.** `tests/fixtures/games/` has a positive and a negative control. A third
  fixture reproducing a hold-and-release game would keep the release-timing operations under test without
  depending on `docs/` content.
