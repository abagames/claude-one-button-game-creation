# Game Selection Workflow — Decision History

Rationale and validation data behind the current rules in
`workflows/game-selection.md`. Historical only — nothing here gates or
directs execution of a batch; see the workflow file for that.

## Stage 2 ranking method: abstract criteria → taste-corpus calibration (2026-07-04)

Backtest (leave-one-batch-out: batches 1–4 calibrated a blind batch-5
ranking, de-polished builds): abstract-criteria
judges ρ = +0.20; taste-calibrated judges ρ = +0.41…+0.65, 4-judge
ensemble +0.54; 3 of 4 put the human's #1 at #1–2. This is what justified
switching Stage 2 to "predict by examples via `state/taste-corpus.md`"
(workflow A+F).

## Stage 3: top-3+spot-check → full-batch human play (2026-07-04)

The former top-3 + spot-check protocol (used 2026-07-02 → 2026-07-04) was
retired after its inversion log (`tmp/eval/spot-checks.md`) hit 6/6
inversions across 3 batches — spot checks kept beating the predicted
top-3, meaning the predicted ranking wasn't reliable enough to gate what
the human actually played. Replaced with full-batch human play (Stage 3
now plays every game; the ranking is informational only).

## Criteria / prediction-accuracy trend (batches 1–5)

- Batch-1: full calibration ρ = −0.30 (criteria v1, generator-judged).
- Batch-2: ρ = +0.38 full / +0.68 excluding anchor (criteria v2, isolated
  judge panel).
- Criteria v3 (surface-loop discoverability, control authority) applied
  after batch 2.
- Batch-3 (v3): top3+2 ρ = +0.08, both spot checks inverted → trigger
  fired → full-batch ρ = −0.10 (judge A −0.14, judge B −0.03). Control
  authority itself was confirmed (B ≫ A on the played-5), but v3 as a
  whole did not transfer.
- Criteria v4 (waiting-pacing hard check, visible cause→effect,
  discoverable death pressure, rule-subversion payoff, difficulty-is-
  tuning default, skillGain caveat) adopted 2026-07-03.
- Batch-4 (v4, 2 judges): top3+2 ρ = −0.18, both spot checks inverted →
  trigger → full-batch ρ = +0.20 (A +0.20 / B +0.14). Error concentrated
  in wiper-rink (reactive shallowness) and spin-cell (authority
  misdiagnosis).
- Criteria v5 (decision density, authority-as-expressiveness, real-
  economy code check) + 3-judge median panel adopted 2026-07-04.
- Batch-5 (v5, 3 judges, median): top3+2 ρ = −0.60, both spot checks beat
  ALL top-3 → full-batch ρ = +0.20 — plateau confirmed; abstract-criteria
  distillation abandoned.
- Backtest (2026-07-04, leave-one-batch-out on batch 5): taste-corpus-
  calibrated judges ρ = +0.41…+0.65, ensemble +0.54 → workflow A+F
  adopted (full-batch human play; Stage 2 = annotation + calibrated
  informational ranking).

Details in `tmp/eval/stage3*.md`, `tmp/backtest-b5/RESULTS.md`.

## Batch-6: two-pass rule added

Batch-6 confound: pre-fix predictions scored ρ +0.15 against post-fix
play — the biggest judge misses rested on implementation bugs that no
longer existed after Polish fixed them. This is why Stage-2 annotation
now fixes found bugs and re-measures BEFORE collecting the predicted
ranking (the "two-pass rule" in the batch runbook).

## Batch-7: retrospective step added

After batch 7, added step 9 (batch retrospective) to the runbook — a
checkpoint to read the ρ trend across batches (not just one batch's
number), self-critique generation variance, and decide whether the
SELECTION process (not generation) needs a change.

## Process review corrections adopted (2026-07-10)

- **Document ownership:** `workflows/game-selection.md` is the only
  normative selection-policy source. `state/BACKLOG.md` is open work only;
  `state/batch-retrospective.md` is evidence/hypotheses; this file preserves
  rationale. This removed conflicting live instructions from the backlog.
- **Generation context isolation:** batch-7 game READMEs explicitly reused
  past human notes, proving that selection-derived context could bypass the
  document-level one-way rule. Fresh per-game generation contexts that cannot
  read selection state now enforce that boundary. The causal claim that this
  leakage made batch 7 weak remains unproven; isolation is a process boundary,
  not a taste or quality constraint.
- **Prediction-hidden Stage 3:** predicted order is no longer a suggested
  play order. The human sees an independently randomized/counterbalanced list,
  then the prediction is revealed after ranking. This removes avoidable order
  bias from the quantity used to evaluate Stage-2 prediction.
- **No in-batch core-verb gate:** rejected as overconstraint. The four
  batch-7 games cited as one cluster did not repeat a core verb, so the proposed
  redraw rule would not have detected the observed pattern.
- **No automatic batch-9 drop rule:** a single n≈10 Spearman value is weak
  evidence. Predicted ranking remains informational until a predeclared pooled
  checkpoint over clean post-fix, prediction-hidden batches evaluates whether
  it earns its judge cost.

## Stage-1 GA timeout fallback (2026-07-11)

Batch 8 spent 20 minutes on two repeat GA timeouts in both pre/post-fix runs;
winner polish reproduced a third 10-minute timeout for `nearshift-706354`,
while `--no-ga` returned its monotonous telemetry immediately. The evaluator
now reruns only a timed-out game with monotonous probes, marks the result
`ga_timeout_fallback`, and preserves timeout metadata. This recovers partial
coverage without turning missing GA evidence into a gameplay verdict; other
tester errors still require manual review.

## Prediction-utility checkpoint predeclared (2026-07-11)

The checkpoint is fixed at four clean post-fix, prediction-hidden batches.
Its primary statistic is equal-batch-weighted within-batch pairwise
concordance, with predicted ties worth 0.5 and a deterministic two-stage
batch/pair bootstrap interval. Top-1/top-3 hits remain supplementary. Batch 8
is the first eligible batch; batch 7 used the prediction as its suggested play
order and is excluded. The checkpoint is a cost/utility review, not a fixed
numeric drop rule.

## Tester fork parity guard (2026-07-11)

The tester was already vendored locally, but its three adapter patches existed
only as comments and could be silently lost on replacement. The fork contract
is now recorded in `scripts/tester/LOCAL_PATCHES.md`; a one-frame behavioral
guard verifies `rndi(max)`, vector `clamp`/`wrap`, and difficulty starting at
1 through the real adapter and simulator. Stage 1 runs this guard first.

## GA blind-spot investigation: no pattern expansion (2026-07-11)

Batch 8 supplied the required winner-impact evidence: `nearshift-706354` hit
the GA cap and still crossed the human cutoff at #4. Code inspection showed
the optimizer can express only an open-loop sequence of press intervals and
hold durations; it cannot branch on entity positions or other observed game
state. Its configured 50 population × 30 generations × 2 time ranges already
costs up to 3000 simulated candidates per game. More fixed seeds would not
solve timing/multi-entity feedback control and would increase the timeout
risk, so the input-pattern space was not expanded. The adopted response is
partial telemetry via per-game timeout fallback plus load-bearing code
annotation and full-batch human play.

## Durable-state directory split (2026-07-11)

Normative procedures moved to `workflows/`, mutable cross-batch truth to
`state/`, adopted rationale to `history/`, and static tag inputs to `data/`.
Per-batch builds and reports remain under `tmp/`. The batch-close runbook now
requires all continuation data—including clean prediction ranks—to be copied
into `state/` before `tmp/` is considered disposable. This makes a new batch
restartable without retaining past games or detailed evaluation artifacts.

## Publication authority boundary (2026-07-12)

Winner selection and bounded Polish were clarified to stop at the local build
and `state/winners.md`. They do not imply publication. Agents must never copy,
move, or sync a winner into `docs/` unless the human separately and explicitly
requests that promotion. This prevents a quality-selection decision from being
misread as authorization to mutate the curated publication surface.

## Batch-10 prospective gate: agent taste prediction retired (2026-07-18)

### 1. Target

- Current workflow: `workflows/game-selection.md`
- Executed task: source-only Control versus direct-browser-observation
  Treatment for unordered human Top-3 prediction
- Produced artifact: `tmp/eval/top3-prospective-batch10/result.md`
- Inspection material: locked predictions, 30 observer schedules, full human
  ordering/notes, and the legacy three-judge full ranking

### 2. What worked

- Two-pass defect annotation plus targeted browser probes confirmed and fixed
  five implementation defects while leaving unverified claims unchanged.
- Independent full-batch human play remained the authoritative selector.
- Prospective hashes and a predeclared continuation gate prevented prompt
  repair or a same-batch rerun after the negative result.

### 3. Problems

- **Agent taste prediction — E, capability boundary.** Control and Treatment
  each hit 1/3, so 30 successful interaction schedules added zero lift.
- **Legacy full ranking — E, capability boundary.** Its predicted Top-3 had
  zero overlap with the human Top-3; aggregate rho was −0.382 and all three
  judge rhos were negative.
- **Normative workflow still mandated retired work — C, workflow-state
  mismatch.** The frozen Batch-10 rule said failure must retain only defect
  annotation and full-batch human selection.
- **Generation feedback — G, overconstraint.** Prediction failure supplies no
  evidence for restricting tags, mechanics, or `workflows/game-generation.md`.

### 4. Workflow diff

- Location: `workflows/game-selection.md`, Stage 2/3 and batch runbook.
- Before: defect annotation plus taste-calibrated full ranking, prediction
  conceal/reveal, rho/prediction-utility maintenance.
- After: defect-only Stage 2 with consolidated evidence/classification/status,
  targeted mechanic verification after fixes, and full-batch human selection.
  Taste corpus access and every full-order/Top-K prediction output are banned
  from normal annotation contexts.
- Reason: respect the demonstrated capability boundary rather than disguise a
  prompt retry as a new method.
- Expected side effect: lower judge/report cost; no automated preference
  metric accumulates. Human play time remains unchanged.

### 5. Deletion candidate

- Delete now: taste calibration, rank aggregation, prediction reveal ceremony,
  rho calculation, prediction-validation updates, and the pooled prediction
  checkpoint from the normative runbook.
- Observe next run: reducing 2–3 defect annotators to one. Batch 10 shows that
  preference aggregation is useless, not that independent code review has no
  defect-coverage value.

### 6. Next validation points

- Next batch's Stage-2 aggregate contains actionable per-game defect records,
  verification status, and `human_check` uncertainty, with no ranks or taste
  corpus access.
- Every implementation fix is re-smoked, re-measured, and directly verified
  where practical before human play.
- Record defect yield and annotator cost; reconsider panel size only if defect
  coverage is preserved.

### 7. Minimal conclusion

The workflow change to test next is defect-only Stage 2. Its main risk is
prematurely reducing independent defect coverage, so panel size is unchanged
for the next batch. The old four-clean-batch prediction checkpoint is retired
at 3/4: this decision comes from the separate, later, prospectively declared
Batch-10 A/B stop gate, not from the checkpoint's provisional statistic.
