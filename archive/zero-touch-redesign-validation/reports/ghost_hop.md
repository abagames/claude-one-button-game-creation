# Zero-Touch Redesign Validation Report: ghost_hop

## Inputs

- Baseline zero-touch implementation: `tmp/games/validation/baseline/ghost_hop/`
- Control README: `docs/validation/zero-touch-redesign/specs/control/ghost_hop/README.md`
- Treatment README: `docs/validation/zero-touch-redesign/specs/treatment/ghost_hop/README.md`
- Control generated implementation: `tmp/games/validation/control/ghost_hop/`
- Treatment generated implementation: `tmp/games/validation/treatment/ghost_hop/`

## Simulation Results

| Metric | Current Zero-Touch Baseline | Control Generated | Treatment Generated |
| :--- | :--- | :--- | :--- |
| Status | needs_improvement | pass | needs_improvement |
| GA Best Score | 26 | 38 | 52 |
| Monotonous Max | 40 | 9 | 88 |
| GA Ratio | 0.650 | 4.222 | 0.591 |
| Diagnostic | mono_dominant | pass | mono_dominant |

Baseline note: the zero-touch code was rehosted under `tmp/games/validation/baseline/ghost_hop/` with a checker-compliant wrapper README and pinned `index.html`; `main.js` was copied from `docs/-zero-touch/ghost_hop/main.js` unchanged. The current checker baseline is close to the historical failure shape: monotonous `SpamPress` is too strong.

Treatment runtime note: the treatment full GA took about 1844 seconds with `--progress`, far longer than the other validation cases. This is both a practical regression for the validation loop and a mechanics smell: the implementation created enough long-lived entities and repeated scoring interactions to make the simulation unusually expensive.

## Human Review

- Failure readability: Baseline and control use readable red-bullet collision. Treatment is visually readable at the object level, but its pulse/reflection system creates many scoring events that are harder to reason about than simple landing reflection.
- Fairness: Control is fairer in measured play because spam remains low-scoring. Treatment lets spam produce high reflected-score output, so intentional timing is not rewarded enough over repeated hopping.
- Scoring causality: Treatment score is causally tied to landing pulses reflecting bullets, but that causal rule also rewards spam because repeated hops create many pulses.
- Monotonous-input behavior: Treatment fails. `SpamPress` reaches 88 while GA reaches 52. Control succeeds with `SpamPress` capped at 9 and GA at 38.
- GA exploit concerns: High. Treatment creates a high-score surface for repeated hopping, and the checker took unusually long because the game can sustain many active entities and scoring interactions.

## Mechanics Rubric

- [x] Safe waiting is low-scoring.
- [x] Scoring requires entering a vulnerable transition or risky timing window.
- [ ] Repeated tapping without reading hazards is worse than timed hops.
- [x] The route or target choice is predictable enough for planning.

The treatment spec addresses all four items on paper, but the implementation fails the anti-mashing item. The repeated creation of landing pulses makes spam a scoring strategy.

## Interpretation

- `ghost_hop` confirms why tied/design-rewrite cases should be analyzed separately from numeric balance cases.
- A fresh control implementation from the old README passed strongly (`4.222`), so the second-attempt effect is large here.
- The refreshed treatment README did not help this implementation. It produced a more explicit design, but the generated code made landing pulses too easy to trigger repeatedly, so mashing dominated.
- The failure is not just a ratio issue. The full GA runtime was roughly 30 minutes, which makes this implementation unsuitable for the normal validation workflow even before balance repair.
- The likely spec-to-code failure is that "scoring requires entering a vulnerable transition" was implemented as reusable per-landing pulses. Without a score cap, cooldown, or requirement that the landing align with a specific incoming bullet, repeated tapping became both the best scoring strategy and the source of excessive simulation cost.

## Verdict

- Pass/fail/inconclusive: Fail for treatment; useful negative evidence for the broader hypothesis.
- Reason: Treatment improved the written spec but failed to enforce the implementation invariant that repeated hopping must be worse than timed hopping. This case supports adding implementation-facing constraints for cooldown, pulse frequency, and spam scoring caps rather than relying on README prose alone.
