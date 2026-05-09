# Zero-Touch Redesign Validation Report: splitzig

## Inputs

- Baseline zero-touch implementation: `tmp/games/validation/baseline/splitzig/`
- Control README: `docs/validation/zero-touch-redesign/specs/control/splitzig/README.md`
- Treatment README: `docs/validation/zero-touch-redesign/specs/treatment/splitzig/README.md`
- Control generated implementation: `tmp/games/validation/control/splitzig/`
- Treatment generated implementation: `tmp/games/validation/treatment/splitzig/`

## Simulation Results

| Metric | Current Zero-Touch Baseline | Control Generated | Treatment Generated |
| :--- | :--- | :--- | :--- |
| Status | pass | pass | needs_improvement |
| GA Best Score | 420 | 150 | 26 |
| Monotonous Max | 10 | 55 | 42 |
| GA Ratio | 42.000 | 2.727 | 0.619 |
| Diagnostic | pass | pass | mono_dominant |

Baseline note: the zero-touch code was rehosted under `tmp/games/validation/baseline/splitzig/` with a checker-compliant wrapper README and pinned `index.html`; `main.js` was copied from `docs/-zero-touch/splitzig/main.js` unchanged. The current checker baseline differs sharply from the historical README record (`0.04`), so comparisons in this report use the current `42.000` baseline.

## Human Review

- Failure readability: Baseline and control are readable: the player dies by wall, block, or stack contact. Treatment is also readable at the object level, but the separate hard stop at high debris height is less directly communicated than contact with a solid stack.
- Fairness: Control is fair enough for the stated mechanic. Treatment is fair moment to moment, but the GA result shows that repeated pressing survives and scores better than found skilled play, so the practical input tradeoff is not fair to intentional sparse turns.
- Scoring causality: Control rewards block hits and small clears directly. Treatment also ties score to hits and small clears, with height bonus, but its scoring scale is too low for intentional play relative to spam survival and incidental hits.
- Monotonous-input behavior: Control passes despite `SpamPress` reaching 55. Treatment fails: `SpamPress` reaches 42 while the GA best is only 26.
- GA exploit concerns: High for treatment. The best GA genome length was 1, suggesting the search did not find a meaningful timed route and that the implemented tuning made simple input patterns competitive or dominant.

## Mechanics Rubric

- [ ] Idle or one-direction play is unsafe or low-scoring.
- [ ] Tap timing is required to aim or route effectively.
- [x] Missed hazards leave persistent pressure, such as a stack or shrinking space.
- [x] Destroying hazards can create a secondary management problem.

The treatment spec satisfies the rubric on paper, but the generated implementation does not realize the first two items strongly enough. Mashing remains too effective, and sparse timed turns do not reliably outperform it under the current checker.

## Interpretation

- Current checker baseline is already a strong `pass`, unlike the historical `0.04` record. This again confirms that old README ratio records are stale for validation purposes.
- The control fresh implementation passed but underperformed the current baseline (`42.000` -> `2.727`). This shows that fresh generation from the old README is not automatically better.
- The treatment fresh implementation regressed below both baseline and control (`0.619`, `mono_dominant`). The refreshed README structure did not prevent an implementation where mashing dominates.
- This is negative evidence for claiming that the refreshed README format alone reliably improves generated games. It may improve spec clarity, but implementation still needs either stronger anti-mashing constraints, better checker-aligned tuning, or a post-generation balance pass.

## Verdict

- Pass/fail/inconclusive: Fail for this game, inconclusive for the broader hypothesis.
- Reason: Treatment passed static README checks and used the intended mechanic slots, but the resulting implementation failed the GA gate with `mono_dominant`. Because baseline was stale and already passes under the current checker, `splitzig` no longer measures "rescuing a failed zero-touch game"; it measures whether the refreshed format resists regression during fresh generation, and here it did not.
