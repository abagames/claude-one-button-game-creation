# Designer quality labels

Absolute quality ratings for the seven games of the `docs-v8` run, given by the games' author on a 10-point
scale, with the author's stated reason for each. Recorded **before any `docs-v8` quality result exists**: at the
time of writing, analysis pools 95-100 are frozen and unopened, no game among the six new ones has a
`play_log_quality_result.json`, and `bore-comet`'s `docs-v8` round has not been run.

This file is tracked, for the same reason `SEED_LEDGER.md` is: it is not regenerable from anything in the
repository, and a machine that never held the run still has to consult it to interpret the ranking.

## What this file is, and what it is not

It is the run's **ground truth for the discrimination question**, and it is the only such labelling the project
has. Without it a ranking of `16, 16, 17, 19` cannot be read at all — there is no way to tell correct
discrimination from a failure to discriminate, and no way to tell a *correct* tie (two games the author rates
equally) from a *failed* one.

It is **not** a target the instrument is to be tuned against. Adding or reweighting criteria until the ranking
reproduces this table would make the ranking a restatement of this file and a measurement of nothing. The
instrument for this run is frozen at the checkpoint on grounds recorded in `BACKLOG.md`, and the comparison
against this table is *reported*, not optimised.

It is also **not** commensurable with `weighted_total`. These ratings are overall game quality on the author's
own scale. `weighted_total` is `play_log_mechanical_quality_only` out of 20 and its contract forbids claims
about rendered appearance, perceptual clarity, audio, human experience, and distribution runtime. A rating and
a total disagreeing is therefore not automatically an instrument defect — which is exactly why each rating
below carries a reason.

## Provenance, stated exactly

**The labels were not sealed, and could not be.** The plan of record was to hash the file, withhold its
contents until the ranking result was hashed, and open it afterwards — the mirror of the ranking contract's
`frozen_before_quality_result_access`. That is not what happened: the author disclosed all seven ratings in
conversation on 2026-07-26 while the method was being agreed, so the analyst held them before the instrument
freeze checkpoint was taken. Two of the seven (`cleaner` low, `bore-comet` high) had already been disclosed
earlier in the same conversation, before the full set was requested.

**What still protects the run, and it is not the seal.**
- Phase B admits no judgement. Stages 9-13 run frozen plans on frozen seeds through the shared executor; the
  criterion values are produced by `classifyCriteria`, not by an agent. Knowing the labels cannot move them.
- The instrument freeze checkpoint *is* judgement, and it is nonetheless bound by a rule written **before**
  these labels existed. `BACKLOG.md` "The measurement that precedes the freeze checkpoint" fixes the decision
  as a function of the probe's output (both games ready → fix the selector; neither → remove the mode; one →
  fix it anyway), and `hazard_conditions` was already resolved for removal. Every checkpoint decision is
  therefore determined by material predating this file.
- The ranking prediction in `BACKLOG.md` "Pre-registered ranking expectations" was written **label-blind**, in
  the same conversation but before any rating was disclosed.

**What is not protected, and is owed to the report:** any discretionary choice made from here — how the selector
fix is implemented, what the report emphasises — is made by an analyst who has read this table. The report says
so.

## The labels

Ratings and reasons are the author's, quoted verbatim. The English is a gloss for readers of this repository,
not the author's wording.

| game | rating /10 | author's reason (verbatim) | gloss |
| --- | --- | --- | --- |
| `bore-comet` | **8** | 押しっぱなしで固い岩を破壊する感覚がうまく表現されている | The sensation of holding the button to break through hard rock is well expressed |
| `bladedancer` | **7** | 障害物の中に飛び込んでまとめて破壊するリスク・リワードが良くできている | The risk/reward of diving into the obstacles to destroy several at once is well made |
| `pulse-stream` | **6** | 複数レーンを一度に見なければいけないパニック感が良い | The panic of having to watch several lanes at once is good |
| `bridgecross` | **4** | よくあるジャンプゲームからあまり差分がない | Not much different from a common jump game |
| `cleaner` | **4** | スコアの入り方がプレイヤー技量に依存しておらず、操作感が悪くプレイヤーが画面端に寄りがち | How score accrues does not depend on player skill; the controls feel bad and the player tends to drift to the screen edge |
| `feedingfrenzy` | **4** | プレイヤーが狙って魚を取るのが難しく、ストレスが貯まる | It is hard for the player to take fish deliberately, which builds stress |
| `hoardspout` | **3** | 画面が赤と青のアイテムでランダムに埋まり、プレイヤーが意図的に収集するのが困難 | The screen fills randomly with red and blue items, making deliberate collection difficult |

Author's ordering: `bore-comet` 8 > `bladedancer` 7 > `pulse-stream` 6 > `bridgecross` = `cleaner` =
`feedingfrenzy` 4 > `hoardspout` 3.

## Which reasons the instrument can be judged against

**This section is the analyst's classification, not the author's.** It is separated because the distinction it
draws decides whether a disagreement counts as an instrument defect, and attributing it to the author would put
a judgement in their mouth that they did not make. Each reason is placed against the four frozen criteria and
the contract's `forbidden_claims`.

| game | reason's axis | inside the instrument's declared scope? |
| --- | --- | --- |
| `bore-comet` | tactile game feel — the *sensation* of breaking rock | **No.** "Human experience" is a forbidden claim. Its 8 does not validate a high mechanical total |
| `bladedancer` | risk taken for concentrated reward | **Yes** — this is `risk_reward_coupling` almost by definition |
| `pulse-stream` | divided attention, cognitive panic | **No.** Nothing in the play log observes attention |
| `bridgecross` | derivativeness — insufficiently different from a familiar genre | **No.** Novelty is not a play-log property and no criterion approximates it |
| `cleaner` | score does not depend on player skill; degenerate positioning | **Yes, primarily** — this is `causal_input_control`'s subject. "操作感が悪く" (controls feel bad) is out of scope; the skill-dependence claim is not |
| `feedingfrenzy` | deliberate aiming is hard | **Partly.** Input→outcome precision is in scope; "stress" is not. Untestable regardless: stopped at the gate |
| `hoardspout` | randomness defeats deliberate collection | **Yes** in substance, and the same axis as `cleaner`. Untestable: stopped at the gate |

**Three of seven reasons fall outside what the instrument claims to measure, and they include the highest and
the lowest of the rankable games.** That is the single most consequential fact in this table, and it is a
finding about the *validation*, not about either the games or the instrument: the author's quality axis is
substantially orthogonal to play-log mechanical quality. It follows that most disagreements between this table
and the ranking cannot be charged to the instrument, and the report must not present a rank comparison over all
seven as though it were a validity check.

**One clean test survives, and it is `cleaner`.** Its stated reason is that score does not track player skill.
That is the subject of `causal_input_control`, the instrument's heaviest criterion at weight 4. The measured
evidence already agrees with the author: on the same seed a `hold` control scores 903 while `bore-comet`'s
scores 0. If the instrument nonetheless awards `cleaner` a 2 there, the disagreement is inside the instrument's
own declared scope and is a defect, not a scope mismatch. See `BACKLOG.md` "Pre-registered ranking
expectations" for the mechanism and the prediction.

## How this file may be used

- **Permitted:** naming specific pairs the instrument inverted or tied, where both games' reasons are in scope.
- **Permitted:** reporting that a disagreement is out of scope, with the reason quoted.
- **Not permitted:** a rank correlation over the seven, or over the rankable subset. At most four games are
  rankable; a correlation coefficient on n=4 carries no information and would dress a pair-level observation as
  a validity statistic.
- **Not permitted:** revising this file after any `docs-v8` quality result is read. If the author's view of a
  game changes, that is a new dated entry appended below, never an edit above.
