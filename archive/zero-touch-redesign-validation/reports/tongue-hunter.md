# Zero-Touch Redesign Validation Report: tongue-hunter

## Inputs

- Baseline zero-touch implementation: `tmp/games/validation/baseline/tongue-hunter/`
- Control README: `docs/validation/zero-touch-redesign/specs/control/tongue-hunter/README.md`
- Treatment README: `docs/validation/zero-touch-redesign/specs/treatment/tongue-hunter/README.md`
- Control generated implementation: `tmp/games/validation/control/tongue-hunter/`
- Treatment generated implementation: `tmp/games/validation/treatment/tongue-hunter/`

## Simulation Results

| Metric | Current Zero-Touch Baseline | Control Generated | Treatment Generated |
| :--- | :--- | :--- | :--- |
| Status | needs_improvement | needs_improvement | pass |
| GA Best Score | 30 | 50 | 28 |
| Monotonous Max | 20 | 100 | 3 |
| GA Ratio | 1.500 | 0.500 | 9.333 |
| Diagnostic | marginal | mono_dominant | pass |

Baseline note: the zero-touch code was rehosted under `tmp/games/validation/baseline/tongue-hunter/` with a checker-compliant wrapper README and pinned `index.html`; `main.js` was copied from `docs/-zero-touch/tongue-hunter/main.js` unchanged. The historical README records `2.0` and `Pass`, but the current checker requires ratio greater than `1.5`, so the remeasured `1.500` is `needs_improvement` with `marginal` diagnostic.

## Human Review

- Failure readability: Pass. Hazards are red falling objects, and the frog is only vulnerable while the tongue is extended.
- Fairness: Treatment is fairer than control. Control lets hold-only collect too much before dying, while treatment makes long holds quickly risky and low-scoring compared with timed holds.
- Scoring causality: Pass. Treatment score comes from tongue-tip catches and a small combo sequence; survival alone does not score.
- Monotonous-input behavior: Treatment passes strongly. Hold-only drops from baseline 20 and control 100 to treatment 3, while GA reaches 28.
- GA exploit concerns: Low to moderate. The GA best survives only 3.57 seconds, so the ratio mostly reflects early efficient catch timing rather than long-term mastery. Still, the monotonous baselines are clearly worse.

## Mechanics Rubric

- [x] Treatment does not reduce GA ratio below pass threshold.
- [x] Treatment does not add unnecessary state that makes the game harder to read.
- [x] Treatment preserves the original core appeal while clarifying tradeoffs.

## Interpretation

- `tongue-hunter` is the strongest positive signal for the refreshed format in this validation pass.
- The old-format control implementation failed badly because hold-only reached 100 points. This is exactly the type of failure the refreshed README bullets are intended to prevent.
- The treatment implementation preserved the same core mechanic but made hold-only weak enough for skilled timing to dominate (`9.333`, pass).
- This does not prove the README format alone caused the improvement, but it is consistent with the hypothesis that explicit Hold-only weakness and Skilled play requirements help implementation agents avoid obvious monotonous-input failures.
- The short GA best survival time means this should be replicated before treating it as durable long-run mastery. The evidence is strongest for "hold-only was suppressed", not for long-term depth.

## Verdict

- Pass/fail/inconclusive: Pass for this negative/control-adjacent case, positive but unreplicated evidence for the broader hypothesis.
- Reason: Treatment converted a current borderline baseline and a failed fresh control into a passing implementation while preserving the hold-to-attack, release-to-defend mechanic. This is the clearest case so far where the refreshed specification appears to shape better input-tradeoff implementation, but it should be replicated before being used as a format-effect claim.
