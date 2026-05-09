# Zero-Touch Redesign Validation Summary

## Scope

This summary covers the first validation pass run under `docs/zero-touch-redesign-validation-plan.md`.

This pass should be read as a smoke test and failure-mode discovery pass, not as rigorous evidence of the refreshed README format's causal effect. Each arm was implemented once, and the observed fresh-implementation variance is large enough to swamp most treatment deltas.

Completed games:

- `pressbound`: mono-dominant rescue candidate.
- `splitzig`: mono-dominant rescue candidate by historical record, but current baseline already passes.
- `ghost_hop`: design-rewrite / tied-skill-ceiling case.
- `phaserun`: negative control.
- `tongue-hunter`: negative control by historical record, but current baseline is marginal.

All treatment spec and implementation work used isolated sub-agents/fresh contexts with instructions not to read `docs/-revised/` or existing zero-touch `main.js` files. Baselines were rehosted only to satisfy current checker artifact requirements; copied baseline `main.js` files were not modified.

## Results

| Game | Category | Baseline Ratio | Control Ratio | Treatment Ratio | Treatment Status | Main Signal |
| :--- | :--- | ---: | ---: | ---: | :--- | :--- |
| `pressbound` | historical rescue candidate | 5.400 | 6.556 | 16.686 | pass | Treatment outperformed control, but baseline was already pass and treatment scoring may amplify GA score. |
| `splitzig` | historical rescue candidate | 42.000 | 2.727 | 0.619 | needs_improvement | Treatment regressed to `mono_dominant`; refreshed README did not prevent mashing dominance. |
| `ghost_hop` | design rewrite | 0.650 | 4.222 | 0.591 | needs_improvement | Fresh control fixed the case; treatment regressed to spam-dominant and made GA very slow. |
| `phaserun` | negative control | 2.000 | 31.000 | 3.000 | pass | Treatment did not break pass status, but underperformed fresh control. |
| `tongue-hunter` | negative control / hold-only risk | 1.500 | 0.500 | 9.333 | pass | Treatment suppressed hold-only dominance and produced the clearest positive signal. |

## Delta View

| Game | Control vs Baseline | Treatment vs Control | Interpretation |
| :--- | ---: | ---: | :--- |
| `pressbound` | +1.156 | +10.130 | Positive treatment signal, but baseline and control were already pass. |
| `splitzig` | -39.273 | -2.108 | Fresh implementation variance dominates; treatment also regressed. |
| `ghost_hop` | +3.572 | -3.631 | Fresh control solved the case; treatment failed. |
| `phaserun` | +29.000 | -28.000 | Negative-control regression despite pass status. |
| `tongue-hunter` | -1.000 | +8.833 | Clearest positive treatment signal against hold-only dominance. |

## Findings

1. Historical README ratios are not reliable baselines.

   `pressbound` and `splitzig` both had historical failure records, but their rehosted zero-touch implementations pass under the current checker. `tongue-hunter` had a historical pass record, but now lands exactly at `1.500`, which is `needs_improvement` because the checker requires greater than `1.5`. The plan's requirement to remeasure baselines was necessary.

2. Fresh implementation effect is large.

   Control implementations often moved ratios substantially without the refreshed README format. `phaserun` control jumped from `2.000` to `31.000`; `pressbound` control improved from `5.400` to `6.556`; `splitzig` control dropped from `42.000` to `2.727` while still passing; `ghost_hop` control improved from `0.650` to `4.222`; `tongue-hunter` control dropped to `0.500` because hold-only dominated. This makes treatment-only testing invalid.

   It also makes this first pass underpowered as an A/B test. With `n=1` per arm, the treatment effect cannot be separated from implementation noise except in narrow qualitative cases such as `tongue-hunter`, where the failure mode and the refreshed README slot directly align.

3. The refreshed README format improves specification clarity but does not guarantee balance.

   The treatment READMEs consistently documented controls, state model, difficulty, monotonous-input weaknesses, and skilled play. `tongue-hunter` treatment strongly improved hold-only behavior, but `splitzig` and `ghost_hop` treatments still failed with `mono_dominant`. The format improves what the agent is asked to think about; it does not ensure the implementation realizes the intended input tradeoff.

   The experiment also does not separate format effect from redesigner effect. Treatment READMEs include additional design reasoning written during redesign. Some of that may have been induced by the new slots, but some may simply be extra human/agent design effort. A stricter Phase 2 needs replicated implementations from fixed specs, and a separate ablation if we want to attribute gains to individual README fields.

4. Negative-control safety is partially supported.

   `phaserun` treatment remained above the pass threshold and did not add unreadable state. However, its ratio was far below the fresh control (`31.000` -> `3.000`). Under the original criterion that negative controls should not show a large ratio drop, this is a regression even though the diagnostic remains `pass`. `tongue-hunter` gives a better safety signal: treatment preserved the core mechanic and improved the diagnostic from current marginal/control failed to pass.

5. Static README checks are useful but insufficient.

   All treatment outputs passed static README checks. The `splitzig` and `ghost_hop` treatments then failed the GA gate. The checker should remain a fail-fast documentation gate, not a substitute for GA balance evaluation.

6. Implementation runtime can become a quality signal.

   `ghost_hop` treatment took about 1844 seconds to complete the full GA with `--progress`, far longer than the other cases. Even when a game is statically valid, designs that create long-lived entities or repeated scoring pulses can make the validation loop impractical.

   This is more than an operational concern. In `ghost_hop`, the treatment spec's "landing pulse" scoring was implemented as repeated per-hop pulse opportunities. That interpretation created both a spam-scoring route and a large number of long-lived scoring interactions. Runtime outliers should therefore be treated as potential mechanics failures, not only performance failures.

7. The rescue hypothesis was not actually tested for most selected rescue candidates.

   `pressbound` and `splitzig` were selected from stale historical failure records, but both remeasured baselines pass under the current checker. Only `ghost_hop` remained a current failure. Phase 1 therefore did not rigorously test whether the refreshed format rescues failed zero-touch games; it mostly tested how fresh control/treatment implementations behave after remeasurement.

## Current Verdict

Phase 1 remains useful, but its status should be downgraded:

> This pass was a smoke test and failure-mode discovery exercise. It did not rigorously validate the README format effect.

Fresh-implementation variance is too large, and `n=1` per arm is too small, to separate format effect from implementation noise. The first pass still produced useful findings: `tongue-hunter` is a clear positive case where explicit Hold-only weakness appears to have shaped better implementation, while `splitzig` and `ghost_hop` show that anti-mashing prose does not reliably become code-level behavior.

The strongest negative finding is now the main result: README format alone does not guarantee balance. A spec-to-code translation layer is needed.

## Recommended Next Steps

1. Replicate implementation arms before making any format-effect claim. For each fixed control/treatment spec, run `k=3` to `k=5` fresh implementations and report the ratio distribution, diagnostic distribution, and failure modes.
2. Define negative-control regression thresholds before reruns. Treat a negative control as regressed if treatment ratio is less than 50% of control, or if diagnostic class worsens. Under this threshold, `phaserun` is a regression despite remaining `pass`.
3. Build an implementation pattern dictionary between README prose and crisp-game-lib code invariants. Examples:
   - `Mashing weakness`: input intervals below `N` frames must reduce aim quality, block score, trigger cooldown, or create a visible positioning cost.
   - `Hold-only weakness`: continuous hold must cap score, increase hazard exposure, drain a resource, or eventually force release.
   - `Skilled play`: scoring should require a state transition near a hazard/opportunity, not merely repeated input.
4. For failing treatments, inspect verbose GA logs and compare implementation against the treatment README to identify missing implementation constraints, especially anti-mashing mechanics.
5. Reflect the implementation pattern dictionary into `developing-with-crisp-game-lib` or a dedicated implementation skill, not only the design README template.
6. Add a validation-time performance warning or timeout policy for games whose GA run takes far longer than the normal loop, and inspect runtime outliers as possible mechanics failures.
7. Consider a second-stage ablation only after replicated Phase 2 data exists; the current sample is too small and mixed for attribution.
