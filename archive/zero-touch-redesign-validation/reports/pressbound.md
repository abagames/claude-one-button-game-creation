# Zero-Touch Redesign Validation Report: pressbound

## Inputs

- Baseline zero-touch implementation: `tmp/games/validation/baseline/pressbound/`
- Control README: `docs/validation/zero-touch-redesign/specs/control/pressbound/README.md`
- Treatment README: `docs/validation/zero-touch-redesign/specs/treatment/pressbound/README.md`
- Control generated implementation: `tmp/games/validation/control/pressbound/`
- Treatment generated implementation: `tmp/games/validation/treatment/pressbound/`

## Simulation Results

| Metric | Current Zero-Touch Baseline | Control Generated | Treatment Generated |
| :--- | :--- | :--- | :--- |
| Status | pass | pass | pass |
| GA Best Score | 27 | 59 | 584 |
| Monotonous Max | 5 | 9 | 35 |
| GA Ratio | 5.400 | 6.556 | 16.686 |
| Diagnostic | pass | pass | pass |

Baseline note: the zero-touch code was rehosted under `tmp/games/validation/baseline/pressbound/` with a checker-compliant wrapper README and pinned `index.html`; `main.js` was copied from `docs/-zero-touch/pressbound/main.js` unchanged. The current checker baseline differs from the historical README record (`0.18`), so comparisons in this report use the current `5.400` baseline.

## Human Review

- Failure readability: Pass. Both generated versions use visibly closing walls and ball-wall crush as the failure condition.
- Fairness: Pass with caution. The crush condition is readable, though treatment survival scoring is frequent enough that score can rise quickly once the GA finds a stable release rhythm.
- Scoring causality: Control is partly causal but still includes survival score. Treatment has stronger pressure cash-out scoring, but also awards survival score every 20 frames, so the high GA score is not purely cash-out mastery.
- Monotonous-input behavior: Pass. Treatment monotonous max is 35 versus GA best 584; control monotonous max is 9 versus GA best 59.
- GA exploit concerns: Moderate. Treatment's large score gap may be partly amplified by frequent survival scoring over 60 seconds. It still appears playable, but a follow-up should inspect verbose telemetry before treating the ratio as pure mechanics quality.

## Mechanics Rubric

- [x] Holding accumulates potential reward.
- [x] Holding also increases pressure/risk.
- [x] Release cashes out or resets pressure.
- [x] Waiting too long creates a visible failure path.

## Interpretation

- Current checker baseline is already `pass`, unlike the historical `0.18` record. This confirms the plan's concern that historical ratios are stale and should not be used as the live baseline.
- Control generation from the old README improved over the current baseline (`5.400` -> `6.556`), so a second fresh implementation alone can improve results.
- Treatment generation improved further (`6.556` -> `16.686`) and satisfied the rubric. This is positive evidence for the refreshed README format, but not conclusive without additional games and negative controls.
- Because treatment still uses substantial survival scoring, its high ratio should be interpreted as "strong pass with review needed", not proof that all improvement came from pressure cash-out design.

## Verdict

- Pass/fail/inconclusive: Inconclusive but promising.
- Reason: Treatment outperformed both current baseline and control, passed static checks, and satisfied the mechanics rubric. However, control also improved over baseline, and treatment's high GA score may be amplified by frequent survival scoring. Continue with `splitzig` and one negative control before drawing conclusions about the refreshed format.
