# Simulator-Only Play-Log Analysis Procedure

## 1. Purpose

This document records methodological details supplementing [WORKFLOW.md](WORKFLOW.md) Stages 8–14 for play-log
analysis of instrumented crisp-game-lib one-button games. The normative definitions of the execution procedure,
freeze rules, formal criteria, and ranking constants follow [WORKFLOW.md](WORKFLOW.md),
[CONTRACTS.md](CONTRACTS.md), [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md), and `schemas/`. The metric candidates
and signal lists in this document are non-normative reference notes; do not carry them directly into formal
judgments.

The main questions are as follows.

- Do important inputs have local causal effects on reward, collision, and terminal?
- Were scoring opportunities accompanied by mechanical risk, such as approaching hazards, input timing, or
  reduced survival margin?
- Do scores, collisions, and terminals consistently correspond to observed world events?
- Is death tied to the immediately preceding input and world state, and was it avoidable by the tested policy?

This analysis is a private mechanical diagnostic. It does not evaluate rendered appearance, perceptual risk,
audio, human fun, fairness, intuitiveness, or distribution-runtime compatibility. The trust class is always
`simulator_only_unverified`.

## 2. Normative boundary

Follow [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md) for the execution and observation boundary.

Store raw private frames only as private artifacts. Do not treat them as public evidence, the screen a human
would see, or a substitute for perceptual quality.

## 3. Selection, freeze, and exact replay

The normative sources are the following sections.

- Episode selection rules (best/median/low-or-failure/same-seed control/failure-source-private):
  [WORKFLOW.md](WORKFLOW.md) Stage 10
- Freeze items before analysis starts: [WORKFLOW.md](WORKFLOW.md) Stage 8
- Replay gate modes and exceptions for annotation-only migration: [CONTRACTS.md](CONTRACTS.md) Play-log
  analysis artifacts
- Separation of technical failures: [WORKFLOW.md](WORKFLOW.md) Stages 9 and 13

Non-normative note for when a default is needed for tie ordering of best episodes: final score descending,
survival ticks descending, release count ascending, gameplay seed ascending. Fix the adopted order in the
quality plan.

## 4. Building a derived event log from frames

Do not aggregate raw frames directly; convert them into versioned derived events with the shared analyzer. Do
not re-implement equivalent functionality per game.

### 4.1 Geometry projection

Use only allowlist fields from each record.

- Logical tick
- Private group label, descriptor, or role-tagged episode-local object reference
- Primitive source
- Color (only when explicitly permitted by the analysis contract)
- Position and size
- Input state/edge
- Runtime score and phase

Derive center, bounding box, overlap, and edge-to-edge clearance from the record geometry.

### 4.2 Episode-local tracking

Follow the Annotation sink rules of [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md) for the role-tagged object
identity mechanism (`beginDrawing({ type, object })`, WeakMap, episode-local `episodeRef`) and property
non-retention. The same `episodeRef` counts as one object even if its role changes.

Only for scopes whose role-tagged object reference cannot be passed safely, correspond consecutive frames by
geometry nearest-neighbor. Always attach a confidence to that tracking.

- `confirmed`: The descriptor or object identity continues.
- `probable`: Velocity, distance, and size match uniquely.
- `ambiguous`: Multiple candidates are equally plausible.
- `unresolved`: Cannot be safely corresponded.

Do not force `ambiguous` or `unresolved` targets into unique opportunity counts. Follow the Play-log analysis
artifacts section of [CONTRACTS.md](CONTRACTS.md) for identity coverage, `unique_reward_objects_observed`, and
the `unresolved` rule for causal attribution metrics.

### 4.3 Event candidates

Shared derived event candidates:

- `input_press`, `input_release`, pressed/released run
- `score_delta`
- `terminal`
- `subject_spawn_candidate`, `subject_despawn_candidate`
- `overlap_begin`, `overlap_end`
- `clearance_minimum`
- `hazard_exposure_begin`, `hazard_exposure_end`
- `opportunity_enter`, `opportunity_success`, `opportunity_miss`
- `near_terminal_state`

Do not automatically confirm causality when a score delta and geometry exist on the same tick. If there is one
candidate cause, mark `probable`; if several, `ambiguous`; if the required internal state is unobserved,
`unresolved`.

## 5. Risk metrics (non-normative notes)

Do not collapse risk into a single value common to all games; fix the observable risk measure and threshold in
each game's quality plan first. The normative shared modes are the two `hazard_clearance` and
`indicator_displacement`, fixed in `schemas/play-log-quality-plan.private.v2.schema.json`. Both modes are
normalized by executed ticks, and changing the mode/role/axis/neutral/threshold after reviewing results is
forbidden. If a change is needed, re-run from Stage 8 with a new evaluation ID, unused analysis seeds, and a
new config hash.

The following candidate list is a non-normative reference note for plan creation.

- Minimum edge-to-edge clearance to hazards
- Number of ticks within the hazard exposure threshold
- Number of hazards approached simultaneously
- Time-to-overlap estimated from position differences
- Clearance changes around score events
- Terminal rate per scoring opportunity
- Near-terminal/terminal occurring within a fixed window after input
- Survival ticks and terminal kind

Normalize thresholds against target size, or pre-fix them as game-specific metrics. Do not move thresholds
after reviewing results to manufacture conclusions.

Thresholds are absolute view units and are not auto-normalized by the runtime, while view sizes differ per
game (`view_size` is observed per episode). Choose each threshold as an explicit multiple of the controllable
subject's annotated size and record that multiple and the observed subject size in the plan's replay-gate
`reason` or the criterion rules, so a reader can tell whether two games were measured at comparable
strictness. Two games with different view sizes and unrelated absolute thresholds are not comparable on
exposure magnitude; only their ordinal criterion values are.

Approaching a hazard is not always risk. For example, on ticks where a beam reliably removes a hazard, the
effective risk may be low even at short distances. If removal zones, invulnerability, filled hazards, etc. can
be confirmed from annotations, separate the states. If they cannot be confirmed, mark `unresolved`.

Three frozen fields express that separation: `hazard_active_when` (`always` / `input_pressed` /
`input_released`), `hazard_suppressed_while_overlapping` (shelter roles), and `hazard_conditions`, which sets
both per hazard role when a game mixes hazard kinds. A drill-into-rock game where the rock scores and shelters
while the button is held and kills the moment it is released is modelled with the rock as
`active_when: "input_released"`, the enemies as `suppressed_while_overlapping: ["rock"]`, and the sea as
always active. Modelling such a rock as an unconditional hazard inverts the measurement: the safest, highest
scoring state would be recorded as maximum exposure, and `risk_reward_coupling` would be confirmed for the
wrong reason.

Neither risk mode expresses commitment risk — the cost of being locked into a state until a safe exit exists.
A game whose danger is "you must keep holding and time the exit" can therefore show reward rising while
clearance-based exposure falls, and the honest reading is `mixed` with the coupling recorded as inverse, not a
claim that the reward is risk-free. Say so in the analysis rather than reaching for a threshold that would
manufacture alignment.

## 6. Reward metrics (non-normative notes)

Available candidates:

- Final score
- Number of score delta events
- Score per unique reward object observed (not causal attribution)
- Opportunity success rate
- Score per release or effective input edge
- Logical ticks to a score event
- Input window before a score event
- Hazard exposure required to obtain the same score

Do not make the raw input count itself a reward. If repeated scoring from the same target or the same safe
pulse is suspected, prioritize unique opportunity tracking.

For games where score causes cannot be uniquely classified, do not guess per-cause scores. Use only the total
score delta, and set game-specific metrics to `unavailable`.

## 7. Evaluating risk–reward relationships (non-normative notes)

Criterion judgment rules are fixed in the quality plan ([WORKFLOW.md](WORKFLOW.md) Stage 8). The following is a
non-normative reference for plan creation and interpretation.

### 7.1 Policy comparison

Compare at least the following between the private policy and each diagnostic control.

- Score difference
- Survival difference
- Hazard exposure difference
- Minimum clearance difference
- Opportunity count/success-rate difference
- Release count and effective input rate

Signals supporting mechanical causality:

- Input timing just before scoring separates success from failure.
- Scores tie to observed world events.
- An option to avoid risk exists, and taking it forfeits the reward opportunity.

Signals contradicting mechanical causality:

- Changing important inputs in a counterfactual does not change the local outcome.
- Scores, collisions, and terminals do not correspond to observed world events.
- No relationship with reward holds even as risk exposure changes.
- The terminal is unrelated to input or world-state changes, or is unavoidable by the tested policy.

### 7.2 Conditional comparison

Save the following conditional values as derived evidence when needed.

- `P(score_event | hazard_exposure)`
- `P(terminal | hazard_exposure)`
- `P(score_event | input_edge within k ticks)`
- `P(opportunity_success | adaptive action)`
- Clearance distributions of windows with/without score events

These are not independent statistical quality axes. Preserve sample counts, nulls, negatives, technical
failures, and not applicable, and do not claim stable general rules from few events.

## 8. Counterfactual replay

Follow [WORKFLOW.md](WORKFLOW.md) Stages 8, 10, and 11 for the norms on counterfactual source selection,
anchors, lookbacks, operations, and recorded items. The bounded operation enum follows
`schemas/play-log-quality-plan.private.v2.schema.json`.

A branch is executed for the frozen tick budget, not for the length of the source input sequence: the edited
prefix is forced tick by tick and the frozen private policy continues afterwards. Without this, a branch that
survives one tick past the source terminal is indistinguishable from a replay that simply ran out of input,
and "the terminal was avoided" becomes an artifact of truncation. Local windows are likewise observed in full
instead of being cut short at the source terminal.

## 8.1 Stability replication

Criterion values that come from one anchor of one episode move with the analysis seed pool. Two frozen fields
bound that: `anchor_ordinals` spreads the case budget over reward moments, and `source_count` with
`minimum_replication_seeds` requires the same edit family to hold on more than one analysis seed before a
criterion may be `confirmed`.

To demonstrate that a game's values are stable rather than assume it, run one replication round: the same
instrument, the same frozen plan settings, a new evaluation ID, and a disjoint analysis seed pool. Report both
rounds. Matching ordinals across disjoint pools is the evidence that the criteria are not a seed lottery;
diverging ordinals are a finding about the instrument, not about the game, and must be reported as such.

Never pick the round with the better numbers. The round of record is the first one run under the current
instrument, and the replication is reported alongside it whatever it shows.

## 9. Instrument confidence gate

Follow [WORKFLOW.md](WORKFLOW.md) Stage 12 for the check items and the `instrument_insufficient` stop rule.
Do not reinterpret a private policy failure as a game design failure.

## 10. Quality criteria and verdict

Follow the Play-log quality result section of [CONTRACTS.md](CONTRACTS.md) for the formal criterion set,
ordinal mapping, and evidence requirements. The mechanical profile verdict enum follows
`schemas/play-log-quality-result.v1.schema.json`.
Verdicts carry no ranking order. Rankings are generated only from the schema-valid ordinal values of the 4
criteria.

### 10.1 LLM role and evaluation authority

Do not use an LLM as a formal evaluator. Formal metrics, instrument confidence, and mechanical verdicts are
determined only from schema-validated exact replays, derived events, matched comparisons, counterfactuals, and
predefined judgment rules. LLM output must not be used to fill in missing numeric values, determine unresolved
object roles, guess perceptual channels, or overwrite formal verdicts.

When an LLM is used, limit its role to the following auxiliary interpretation.

- Summaries of characteristic positions and event sequences
- Tactical hypotheses derivable from telemetry
- Pointing out confounds, alternative explanations, and unmeasured factors
- Proposals for additional probes, counterfactuals, and verification with unused seeds

Separate LLM observations from `analysis-result.json` and the formal `ANALYSIS.md`, and store them as a
non-formal advisory artifact such as `LLM-REVIEW.private.md`. Record in the observations: the hash of the
referenced artifact, the model used, the prompt or prompt hash, the generation date/time, and the fact that it
does not participate in the formal verdict or ranking. A new hypothesis proposed by an LLM is not evidence on
its own. To adopt one, verify it with a separate version of the quality plan, deterministic probes, or unused
analysis seeds before promoting it to formal evidence.

Disagreement between LLM observations does not change formal results; save the disagreement as a candidate for
additional verification. Also, even if an LLM reads raw frames, it cannot fill the gaps in rendered appearance,
audio, game feel, or human perception, fun, and fairness.

### 10.2 Multi-game ranking

Follow the Play-log ranking contract and result section of [CONTRACTS.md](CONTRACTS.md) and
[WORKFLOW.md](WORKFLOW.md) Stage 14 for the ranking contract, ordinal values, weights, tie-breaks, and
missing-data rules. Do not use raw scores, control performance, monotonic input, verdict taxonomy order, or
LLM observations for ranking.

The permitted representation is a play-log mechanical quality ranking within the fixed contract, tested
simulator, policy, analysis seeds, and tick budget. It is not an overall quality ranking that includes rendered
appearance, perceptual clarity, audio, fun, fairness, intuitiveness, human preference, or distribution-runtime
compatibility.

## 11. Legacy fixture examples

Applied example notes for the legacy fixture batch (blind-fuse-fall, gale-crater-stitch, shard-rail-859313,
stillfire-choir) have been retired to [archive/legacy-play-log-fixtures.md](archive/legacy-play-log-fixtures.md).
To use them in a new ranking, re-judge the 4 criteria of the new workflow for each game and generate
`play-log-quality-result.json`. Do not infer ordinal values from existing verdicts.

## 12. Artifact design

Recommended layout:

```text
generated/<game-id>/<evaluation-version>/artifacts/play-log-analysis/
  play-log-quality-plan.private.json
  replay-runtime.private.json
  derived-events.private.json
  counterfactuals.private.json
  analysis-result.json
  play-log-quality-result.json
  ANALYSIS.md
  LLM-REVIEW.private.md  # optional, non-formal advisory artifact
  hashes.json
```

Validate new quality plans against `schemas/play-log-quality-plan.private.v2.schema.json`, play-log evidence
results against `schemas/play-log-analysis-result.v2.schema.json`, and formal quality results against
`schemas/play-log-quality-result.v1.schema.json`.
Plan/analysis v1 is for verifying and displaying past artifacts only; do not use it for new episode collection.
Validate ranking artifacts against `schemas/play-log-ranking-contract.v1.schema.json`,
`schemas/play-log-ranking-result.v1.schema.json`, and `schemas/play-log-ranking-hashes.v1.schema.json`.
Do not create game-specific lax substitute schemas.
If you change schemas or the runtime, run `npm test`.

Fields to save at minimum:

- Hashes of source, runtime, adapter, policy, input, and quality plan
- Selection rules and target episodes
- Exact replay gate
- Derived event contract version
- Criterion judgment rules
- Matched comparisons of policy/diagnostic control/counterfactual
- Episode count
- Unresolved attribution
- Instrument confidence
- Status, ordinal value, and evidence ID of the 4 criteria
- Verdict and alternative explanations
- Allowed/forbidden claims

## 13. Analysis report structure

Generate `ANALYSIS.md` with the shared renderer, which takes the machine-readable
`play-log-quality-result.json` as the formal source and displays the evidence IDs of the referenced
`analysis-result.json`. Sections follow the shared renderer's output.

Even when creating LLM observations, do not mix their prose into this formal report. The only items that may be
moved from `LLM-REVIEW.private.md` into the formal report are those corroborated by subsequent deterministic
verification, whose evidence and provenance have been added to `analysis-result.json`.

## 14. Completion conditions

Follow [WORKFLOW.md](WORKFLOW.md) Stages 13 and 14 for the completion conditions of analysis and ranking.
Follow the Completion report section of [AGENTS.md](AGENTS.md) for the required records of the completion
report.
