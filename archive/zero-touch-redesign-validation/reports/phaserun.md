# Zero-Touch Redesign Validation Report: phaserun

## Inputs

- Baseline zero-touch implementation: `tmp/games/validation/baseline/phaserun/`
- Control README: `docs/validation/zero-touch-redesign/specs/control/phaserun/README.md`
- Treatment README: `docs/validation/zero-touch-redesign/specs/treatment/phaserun/README.md`
- Control generated implementation: `tmp/games/validation/control/phaserun/`
- Treatment generated implementation: `tmp/games/validation/treatment/phaserun/`

## Simulation Results

| Metric | Current Zero-Touch Baseline | Control Generated | Treatment Generated |
| :--- | :--- | :--- | :--- |
| Status | pass | pass | pass |
| GA Best Score | 2 | 31 | 3 |
| Monotonous Max | 1 | 1 | 1 |
| GA Ratio | 2.000 | 31.000 | 3.000 |
| Diagnostic | pass | pass | pass |

Baseline note: the zero-touch code was rehosted under `tmp/games/validation/baseline/phaserun/` with a checker-compliant wrapper README and pinned `index.html`; `main.js` was copied from `docs/-zero-touch/phaserun/main.js` unchanged. The current checker baseline matches the historical pass record (`2.0`).

## Human Review

- Failure readability: Pass. All versions use a single readable failure: obstacle contact while SOLID.
- Fairness: Pass. The player is fixed in a single lane, and phase state is visible, so failure follows from a clear timing decision.
- Scoring causality: Pass. Score comes from collecting coins while SOLID, not from survival or raw input frequency.
- Monotonous-input behavior: Pass. No-input and spam reach 1 point, while hold-only survives but scores 0. Treatment and control both keep monotonous max at 1.
- GA exploit concerns: Low. The ratio is based on finding timed phase switches that collect coins; hold-only survival does not inflate score.

## Mechanics Rubric

- [x] Treatment does not reduce GA ratio below pass threshold.
- [x] Treatment does not add unnecessary state that makes the game harder to read.
- [x] Treatment preserves the original core appeal while clarifying tradeoffs.
- [ ] Treatment avoids a large ratio regression versus control.

## Interpretation

- `phaserun` works as a negative control: baseline, control, and treatment all pass under the current checker.
- Control generation greatly outperformed the baseline (`2.000` -> `31.000`), showing again that fresh implementation can dominate the measured result independent of README format.
- Treatment also passed (`3.000`) and preserved readability, so the refreshed README did not break the design. However, treatment underperformed control by a wide margin. The refreshed format therefore did not reliably improve this already viable design.
- The practical result is mixed but should be counted as a negative-control regression under a ratio-preservation criterion. If a negative control is considered regressed when treatment falls below 50% of control, `phaserun` fails that criterion (`3.000` is less than 10% of `31.000`).

## Verdict

- Pass/fail/inconclusive: Partial failure as a negative control; pass only at the coarse diagnostic threshold.
- Reason: Treatment remained playable, readable, and above the GA threshold, but it regressed heavily against the fresh control implementation. This supports using the refreshed README structure as a specification aid, not treating it as a guaranteed balance or ratio-preservation improvement.
