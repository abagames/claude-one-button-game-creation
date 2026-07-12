# Game Selection Workflow (Generate Many, Human Selects)

This file is the **only normative source** for the current selection,
human-play, polish, and retrospective procedure. `state/BACKLOG.md` contains
open work only; `state/batch-retrospective.md` contains observations and
hypotheses; `history/game-selection-workflow-history.md` records why rules were
adopted or retired. Neither of those files changes how a batch is run.

Generation optimizes for variance (diverse, novel games); selection optimizes
for quality. Keep them separate: the generation workflow in
`workflows/game-generation.md` stays unchanged and gate-free. This file's
runbook orchestrates its isolated execution, then runs every selection stage
downstream, one-way.

```
Stage 0  Generate N games        (workflows/game-generation.md, unchanged)
Stage 1  Automated measurement   (node scripts/evaluate_games.js)
Stage 2  LLM annotation          (defect notes + informational taste-calibrated
                                  ranking; gates NOTHING)
Stage 3  Human play              (FULL batch — the human is the selector)
Polish   Bounded tuning          (winners only, human-chosen)
```

## Principles

- **Measurement outputs raw facts; judgment happens later.** Stage-1 verdicts
  and flags are detectors, never optimization targets and never automatic
  rejections fed back into generation.
- **Tester anomalies are routed to review, not discarded.** The simulator
  (`scripts/tester/crisp_game_adapter.js`) mocks crisp-game-lib and guesses
  entities from variable names; the most novel games are the most likely to
  break it. `needs_manual_review` means "the instrument failed", not "the game
  failed".
- **Rank potential, not current polish.** Distinguish design-level defects
  (no meaningful choice, monotonous input structurally optimal → discard) from
  tuning-level defects (bad constants: too fast, sparse spawns, short grace
  windows → keep, flag `fixable_by_constants`).
- **Tune only after selection.** Tuning a weak core has a hard ceiling; invest
  telemetry-driven tuning iterations (with an iteration cap) only in games
  that survived ranking.

## Stage 1: Automated measurement

**Pre-check — browser smoke test (all candidates, before simulation):**

```bash
for g in tmp/games/*/index.html; do
  node .agents/skills/smoke-testing-web-games/scripts/smoke-test.mjs "$g" || echo "FAIL: $g"
done
```

Loads each game in headless Chromium (load → idle → input bursts) and
fails on console errors, uncaught exceptions, or crashes. Closes the
"passes mock, crashes in browser" gap (`sign` bug class) — the simulator
below cannot catch it. A FAIL means the game is broken in the real
browser: fix the API misuse (see Tester Compatibility in
`workflows/game-generation.md`) before measuring it. Requires the
project-local Playwright install (`npm i -D playwright && npx playwright
install chromium`, already set up).

**Measurement:**

```bash
node scripts/verify_tester_patches.js     # vendored-fork parity guard
node scripts/evaluate_games.js            # all games under tmp/games/
node scripts/evaluate_games.js --no-ga    # quick pass, monotonous probes only
```

Writes `tmp/eval/stage1.json` (facts for Stage 2) and `tmp/eval/stage1.md`
(summary table). Per game: NoInput / HoldOnly / SpamPress scores and survival,
GA-optimized best score, `skillGain` (best known play ÷ best monotonous play),
verdict (`skill_rewarding` / `weak_skill_gain` / `mono_dominant` /
`needs_manual_review`) and flags (`idle_scoring`, `hold_scoring`,
`spam_scoring`, `no_scoring_path`, `tester_error`, `ga_timeout_fallback`).
If a game's GA process reaches its 10-minute cap, the evaluator immediately
reruns that game with monotonous probes only. The row remains measurable as
`monotonous_only`, carries `ga_timeout_fallback`, and records the timeout and
fallback under `instrument`; missing GA evidence must not be inferred as weak
or broken play. Other tester failures remain `needs_manual_review`.

Games whose `main.js` defines helper functions outside `update()` cannot be
simulated (the adapter extracts only `update()`); keep generation inlining
logic as `workflows/game-generation.md` already requires.

## Stage 2: LLM annotation (defects + informational ranking)

Input per game: `README.md`, `main.js`, and its `stage1.json` entry. Judge
from code and telemetry, not from how well the README sells the idea.

**Two deliverables, different status:**

1. **Defect annotation (the load-bearing output).** Per game: defects
   classified design-level vs tuning-level, `fixable_by_constants`
   flags, dead-code/economy-integrity findings from reading `main.js`
   (this is where judges have been consistently right: bead-gate's
   dead pierce check, dim-lance's cosmetic darkness, idle-safe
   geometries). These feed Polish and the human's play notes.
2. **Informational predicted ranking (gates nothing).** Predict the
   HUMAN's ordering, primarily by analogy to the example corpus below.
   Used only to track prediction accuracy (ρ) per batch. Keep it hidden
   from the human until their ordering is final so the prediction cannot
   bias the measurement it is compared against.

**Calibration:** judges predict by EXAMPLES, not by abstract criteria.
Give every judge:

- `state/taste-corpus.md` — all past batches' human orderings with
  verbatim notes. Instruct: learn the player's pattern from the
  examples; any derived summary is orientation only.

**Independent Batch 1 fallback:** a freshly initialized lineage has no taste
examples. For that first batch only, judges still perform the full defect
annotation and produce an explicitly `uncalibrated` informational prediction
using the defect taxonomy and expected player-facing fun/novelty below. Do not
invent preferences or import another lineage's state. After Stage 3, the
human's ordering becomes the first calibration example; Batch 2 and later use
the normal example-based method.

Residual error classes to stay humble about even after calibration:
busywork overrating and indirect+hard underrating. (Rationale and
backtest numbers: `history/game-selection-workflow-history.md`.)

**Judge isolation (unchanged):** judges run in fresh contexts that did
not generate the games; 2–3 judges, aggregate by median rank; a
per-game rank spread ≥5 is an uncertainty note in the report. Append
each new batch's human ordering + notes to `state/taste-corpus.md` after
Stage 3.

The criteria below (v5) remain as the **defect taxonomy for
annotation** — the vocabulary for classifying what's wrong and what's
tunable — not as the ranking method:

- _Novelty_: is the core mechanic structurally different from well-known
  games and from the other games in this batch?
- _Expected fun_ — judged from the player's seat, not the designer's
  (batch-1 lesson: humans score legibility and immediacy, not systems
  cleverness). Score on:
  - Can a first-time player discover the **survival loop** (what moves,
    what kills, what the button visibly does) within ~10 seconds?
    Judge the surface loop, NOT full scoring depth — depth that unfolds
    on top of a readable surface is a plus on both axes (batch-2
    lesson: fuse-sum). Only depth _required for basic survival_ counts
    against discoverability.
  - **Control authority = EXPRESSIVENESS, not directness** (refined
    v5, batch-4 lesson): the defect is input that cannot express
    intent (lamp-stomp "操作自由度が低くて無理", phase-shaft,
    pachi-climb "操作不能"). Indirect control whose consequence is
    immediate, global, and visible is an ASSET, often paired with
    panic-novelty (spin-cell: judges called "player never steers the
    ball" design-level, human ranked it #1 "操作がとても斬新で
    パニック感が良い"; same error on bola-thread in batch 3). Do not
    auto-penalize indirection.
  - **DECISION density, not event density** (v5, batch-4 lesson:
    wiper-rink S2 #1 → human #10, split-parade #9, both
    "押すだけの単純作業"): trace one minute and ask what the player
    CHOOSES between. A single repeated stimulus→response loop is a
    floor-ranking fun defect even with continuous pressure and a
    clever meta-economy; it cannot be rescued by telegraph quality.
  - **Economies must be mechanically real** (v5, batch-4 lesson:
    dim-lance's "darkness" drew walls anyway and the human spotted it
    instantly, while glow-strand's real vision economy scored):
    verify in the CODE that a claimed resource actually gates
    perception or ability; cosmetic economies are caught and priced
    as fake.
  - Does input produce an immediate, visible, satisfying effect?
  - **Waiting-shaped pacing is a hard check** (batch-3 lesson:
    shell-bait, judged mid, human last, "ゲームになっていない"): trace
    one minute of play and write down what the player does between
    scoring events. An act→wait→act loop with dead time between
    meaningful decisions is a first-class fun defect, regardless of
    telegraph quality or measured skillGain.
  - **Visible cause→effect** (batch-3 lesson: blast radius,
    gem→amplitude link, possession jump-cut): every scoring or state
    change the player is supposed to exploit must be readable
    in-world when it happens. Invisible causality is a fun defect
    (usually fixable_by_constants/feedback); hidden depth on top of a
    readable surface remains a plus.
  - **Discoverable death pressure** (batch-3 lesson: soul-relay never
    reached game over → no tension → human #7 despite top novelty):
    if a competent-but-casual player plausibly cannot reach a game
    over in the first ~30–60 s, flag it as a fun defect.
  - **Rule-subversion payoff counts UP on both axes** (batch-3
    lesson: bola-thread, judged last-adjacent for "authority defect",
    human #2): a design that teaches a safe habit and then visibly
    outlaws it ("収縮していればOKと思わせてそれが通用しないパターンが出て
    くる") is a fun asset, not a difficulty problem.
  - Hidden causal chains that the player must understand _to survive_
    count against fun unless telegraphed visually; otherwise they count
    toward novelty.
  - Exploit/monotony flags (idle/hold/spam scoring) do NOT lower fun —
    humans don't play like optimizers; those flags gate the polish
    phase only.
  - High GA skillGain is NOT evidence of fun (batch-3: shell-bait had
    the batch-best skillGain 6.71 and ranked human-last). Telemetry
    detects exploits and measurability; it does not rank enjoyment.
- For every defect cited, classify it design-level or tuning-level.
  **"Too hard" is tuning-level by default** (batch-3: human ranked two
  "難しすぎる" games #2 and #3; batch-5: tar-spring human #2); call an
  authority/difficulty defect design-level only if NO constant (speed,
  window, spacing, slew rate) could restore intent expression.
- Deliverable per batch: per-game defect annotations +
  `fixable_by_constants` flags + uncertainty notes where the simulator
  could not measure, and the informational predicted ordering.

## Stage 3: Human play (full batch)

The human plays **all games in the batch** in a randomized or
counterbalanced order produced independently of Stage 2. Do not show the
Stage-2 predicted ranking until the human has finalized their ordering +
one-line notes in
`tmp/eval/stage3-batchN.md`. The human's ordering IS the selection.

**Winners cutoff (revised 2026-07-05 — `state/winners.md` is the source of
truth for this rule):** rank down from #1 as long as the human's
comment stays positive — not a fixed top-3. The cutoff is the human's
own explicit verdict where they state one directly, or, absent that,
the rank where the note turns from "fun despite X" to a real
complaint (busywork, illegibility, can't score/recover, rules
unclear).

After play: compute ρ (human vs Stage-2 prediction, per-judge and
aggregate) for the tracking history, append the batch's ordering +
notes to `state/taste-corpus.md`, apply the cutoff above and append the
result to `state/winners.md` (same append convention as `state/taste-corpus.md`),
and queue the winners for Polish. Human verdicts feed the taste corpus
and Stage-2 practice — never Stage-0 generation rules.

**Prediction-utility checkpoint:** after four clean batches whose predictions
were made on post-fix builds and hidden through final human ordering, run
`node scripts/evaluate_prediction_utility.js`. The primary measure is the
macro mean of within-batch pairwise concordance (correct pair 1, inversion 0,
predicted tie 0.5), with a deterministic two-stage batch/within-batch-pair
bootstrap interval. Top-1 and top-3 hits are supplementary. At the checkpoint,
compare the pooled evidence with actual judge cost; no fixed concordance,
single-batch ρ, or hit-rate threshold automatically retains or drops the
ranking deliverable. Add each eligible batch's aggregate prediction, human
order, and judge count to `state/prediction-validation.json`.

The former top-3 + spot-check protocol is retired in favor of full-batch
play. (Rationale, inversion log, and the full criteria-version/ρ trend
through batch 7: `history/game-selection-workflow-history.md`.)

## Batch runbook (self-contained — no session memory required)

Everything an operator (human or fresh agent) needs to run one batch:

1. **Initialize and prepare**: on a fresh clone, run `npm ci`,
   `npm run playwright:install`, and `npm run init:state`. The last command
   creates blank local state for an independent Batch 1 and refuses to
   overwrite an existing lineage. Then run `mkdir -p tmp/games tmp/eval`. If
   `tmp/games/` still contains the previous closed batch, archive it to
   `tmp/games-batchN/` only when revive retention is desired; otherwise the
   closed batch may be discarded after runbook step 10. If Stage-1 evidence
   is being retained, snapshot `tmp/eval/stage1.{json,md}` to
   `stage1-batchN.{json,md}` before a subset re-run overwrites it.
   **Then read `state/BACKLOG.md`'s section for THIS batch** (top of file):
   it carries open items from the previous close, and any item marked
   **DECIDE (user)** must be resolved with the user before step 2 —
   such items can change how generation or judging is run.
2. **Generate** 10 games per `workflows/game-generation.md` (fresh
   `node scripts/random_tag_selector.js` seeds per game), with one fresh
   generation context per game. A generation context may read `AGENTS.md`,
   `workflows/game-generation.md`, its referenced generation skills/API,
   and its own tag seed, but must NOT read selection-derived state:
   `state/taste-corpus.md`, `state/batch-retrospective.md`, `state/winners.md`, Stage-2/3
   reports, or `history/game-selection-workflow-history.md`. This context boundary
   enforces the one-way rule; it is not a content gate and does not change
   `workflows/game-generation.md`.
3. **Stage 1**: smoke-test all games, fix FAILs, then
   `node scripts/evaluate_games.js` (see above).
4. **Stage 2**: launch 2–3 isolated judge agents (fresh contexts that
   did not generate the games). Judge prompt must include:
   - allowed inputs: `tmp/games/<slug>/{README.md,main.js}`,
     `tmp/eval/stage1.json`, `state/taste-corpus.md`; forbid other
     eval files (`reference_corpus/` is not used);
   - instruction: "read the taste corpus FIRST and predict THIS
     player's ordering by analogy to the examples; derived summaries
     are orientation only; trust examples";
   - the instrument caveats (GA blind spots, tester_error = instrument
     failure, exploit flags don't lower fun, skillGain ≠ fun);
   - the defect-annotation task (design vs tuning, fixable_by_constants,
     dead-code/economy-integrity findings from `main.js`);
   - output: `tmp/eval/stage2-batchN-judgeX.md` + ranked list.
     Aggregate by median rank into `tmp/eval/stage2-batchN.md`; note
     per-game spreads ≥5.
     **Two-pass rule:** if annotation finds implementation bugs (rules
     that don't function as the README states — dead collision checks,
     inverted signs, always-true windows), FIX them first, re-smoke and
     re-measure, then collect the predicted ranking against the FIXED
     builds (fresh judge pass or explicit re-prediction). (Why: see
     the batch-6 entry in `history/game-selection-workflow-history.md`.)
5. **Stage 3**: create `tmp/eval/stage3-batchN.md` with the full game
   list in a random/counterbalanced order generated independently of
   Stage 2, a 1..N ordering form, and per-game note slots. Keep the
   predicted ranking hidden. Human plays ALL games and fills it in;
   reveal the prediction only after the ordering is final.
6. **After play**: compute Spearman ρ = 1 − 6Σd²/(n(n²−1)) between the
   human ordering and each judge's prediction + the aggregate (ties:
   average ranks). Record in `stage3-batchN.md`. Append the batch's
   ordering + verbatim notes to `state/taste-corpus.md` (same
   format as existing entries: mechanics one-liner + rank + note).
   Apply the winners cutoff (Stage 3, above) and append the result to
   `state/winners.md` (slug, rank, path, polish status, note).
   If the batch is post-fix and prediction-hidden, append its aggregate
   prediction ranks, final human order, and judge count to
   `state/prediction-validation.json`; then run
   `node scripts/evaluate_prediction_utility.js` to refresh the disposable
   `tmp/eval/prediction-utility.{json,md}` report.
7. **Polish** the winners recorded in `state/winners.md` (section below); re-run Stage 1 on
   them via a symlink dir (`--games-dir`) and snapshot results as
   `stage1-polishN.*`; restore `stage1.json` from the batch snapshot;
   add a "Tuning notes" section to each polished README. Update only the
   winners ledger and local `tmp/` builds. **Stop there:** winner selection or
   Polish never authorizes copying, moving, or syncing into `docs/`. Promotion
   to `docs/` occurs only after a separate, explicit human instruction.
8. Update `state/BACKLOG.md` (close the batch, queue non-winner fixes as
   revive-only items).
9. **Batch retrospective.** Before
   moving to the next batch, step back from the individual batch and
   check the PROCESS:
   - Append this batch's row to the ρ trend table in
     `state/batch-retrospective.md` (batch, method/panel, ρ).
     Read the trend, not just this batch's number. At n≈10 a single
     ρ is weak evidence; never trigger a workflow change from a fixed
     threshold on one or two batches. Only post-fix, prediction-hidden
     batches count as clean measurements for a pooled checkpoint.
   - **Generation self-critique, recorded but never enforced**: does
     this batch's design mix look skewed toward chasing a specific
     corpus lesson (e.g., over-indexing on "reward indirect control"
     after it won a past batch)? Write the observation in the
     retrospective file. Per the one-way rule, this NEVER becomes a
     rule or gate in `workflows/game-generation.md` — it is a note for
     the next retrospective to check whether the pattern recurs.
   - **Decide whether the SELECTION process needs a change** — not
     generation. Options actually available: adjust the judge
     prompt's guard rails, change panel size, drop or demote a
     deliverable that's stopped earning its cost (e.g., the predicted
     ranking, if it stays uninformative for several batches), or make
     no change. Write the decision and why.
   - **Update the Cross-batch patterns section** at the top of
     `state/taste-corpus.md` against this batch's evidence: confirm, refine,
     or flag a tension in an existing pattern (do not just append
     without reconciling). It is a living summary, not a per-batch log
     entry — it must never go stale the way the batch-1–4 version did
     until batch 7's retrospective caught it.
   - If the taste corpus or instrument caveats changed shape this
     batch (new bug class, new residual bias), confirm they are
     reflected in this document and in `state/BACKLOG.md`'s Instrument
     section — the retrospective is also the checkpoint for keeping
     this file self-contained (memory-independent) as new lessons
     accumulate.
   - Record instrument coverage as data, not as a vague design concern:
     count `needs_manual_review` games, group the causes, and note whether
     any such game crossed the human winner cutoff. Require recurrence
     before proposing a new tester constraint.
10. **Close durable state.** Confirm the final human evidence has been
    transferred to `state/taste-corpus.md`, `state/winners.md`,
    `state/prediction-validation.json`, `state/batch-retrospective.md`, and
    `state/BACKLOG.md` as applicable. At that point `tmp/` is not required to
    start the next batch. Keep `tmp/games-batchN/` only when explicit revive
    work is desired; other `tmp/eval/` files are reproducible evidence.

## Polish (winners only)

Bounded tuning pass per winner: fix `fixable_by_constants` items, re-run
Stage 1 to confirm flags cleared, optionally apply game-feel polish. Cap
iterations (e.g. 3) — if a game needs more, the defect is probably
design-level.

The output of this section is a polished local build plus its
`state/winners.md` entry. `docs/` is a publication surface outside this
workflow. Do not write there based on winner status, polish completion, or an
inferred desire to preserve the build; require an explicit human promotion
instruction.

Game-feel polish, if applied (`.agents/skills/maximizing-game-feel`),
runs in lightweight mode for these games:

- Skip the skill's document deliverables (`FEEL_TUNING.md`, project
  inventory) — a ~150-line game needs only a 2–3 line tuning note in its
  README.
- crisp-game-lib has no render/collision separation: drawn shapes ARE
  hitboxes. Do not sell impact by scaling or rotating gameplay shapes;
  use color changes, particles, and `play()` instead.

This is where exploit-proofing belongs: apply
`.agents/skills/implementing-gameplay-invariants` (and §8 of
`.agents/skills/designing-mini-games/references/mini-game-design-guide.md`) to
winners here — never at generation time, where invariant proofs would
narrow batch variance. Batch-2 lesson for constants work: if a nerf makes
a monotonous-probe score RISE, the defect is structural incentive, not
magnitude (tail-gunner: enemy-speed nerf pushed hold-camping 45 → 65 pts;
the fix was a structural rule, not a bigger nerf).

## Instrument caveats (durable — survives status-file archive)

- `scripts/tester/` is a vendored local fork; its contract and post-replacement
  check live in `scripts/tester/LOCAL_PATCHES.md` and
  `node scripts/verify_tester_patches.js`. The adapter carries patches not in
  the upstream GitHub archive: (1) `rndi(max)` single-argument form,
  (2) `vec.clamp`/`vec.wrap` methods, (3) `difficulty` starts at 1
  (browser parity; upstream mock started the first frame at 0, so any
  game whose spawn timer fires on tick 0 computed
  `rnd(...)/sqrt(difficulty)` = Infinity and never spawned again —
  batch-3: blast-buoy and flak-diver "survived" 60 s idle in an empty
  world). Re-downloading without restoring them makes the guard fail; games
  would otherwise crash or mismeasure (the missing `vec.clamp` manifests as
  `spawnSync ENOBUFS` from per-tick exception spam; the difficulty-0
  bug manifests as absurd idle survival with `enemiesSpawned: 0/1` in
  verbose logs).
- The adapter mock also exposes globals the real library lacks (e.g.
  `sign`): a game can pass simulation yet crash in the browser. Write
  games against
  `.agents/skills/developing-with-crisp-game-lib/references/api.md`, not
  against what the tester accepts.
- The GA input optimizer cannot play timing-precise or multi-entity
  feedback-control games: its genome is an open-loop sequence of press
  intervals and hold durations and cannot branch on observed state. The
  current 50-population × 30-generation × 2-range search may evaluate up to
  3000 candidate trajectories per game. Adding more fixed seed patterns was
  investigated after batch 8 and rejected: it cannot add feedback and would
  worsen the timeout cost. Treat `skillGain`/`mono_dominant` as informative
  only when GA best clearly exceeds mono best; retain code annotation and
  full-batch human play for these mechanics. `line`/`bar`/`arc` have no
  collision in the simulator — do lethal checks with coordinate math or
  `box`/`rect`.
- GA runs that hit the per-game 10-minute cap automatically fall back to the
  monotonous tester, preserving basic telemetry and emitting
  `ga_timeout_fallback`. This is partial instrument coverage, not evidence
  about whether skilled play exists. `--ga-timeout-ms` may shorten the cap for
  instrument testing; production batch runs use the 10-minute default.
- Helper functions outside `update()` break the tester (the
  "Tester Compatibility" section of `workflows/game-generation.md` is
  load-bearing).
- In the managed Codex sandbox used on 2026-07-10, a Node script launching
  the tester as a grandchild received empty stdout even though the same tester
  succeeded directly. `evaluate_games.js` now reports empty-output/exit
  diagnostics explicitly; run the evaluator with approved out-of-sandbox
  execution in that environment. This is an execution-environment failure,
  not ten simultaneous game failures.
