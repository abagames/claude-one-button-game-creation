# Zero-Touch README Redesign Validation Plan

## Purpose

Validate whether the refreshed README design format improves generated one-button games, independent of simply giving the agent a second attempt or leaking the human-revised answer.

The useful question is:

> Given the same game seed or same zero-touch brief, does the refreshed README format produce implementations with better balance, clearer mechanics, and no readability/fairness regression compared with the old format?

## Core Threats To Validity

This plan explicitly controls for these risks:

- **Second-attempt effect**: a second implementation might improve even without the new format.
- **Answer leakage**: seeing `docs/-revised/` would make similarity to the human revision unsurprising.
- **Repair inertia**: editing old code measures repair behavior, not README sufficiency.
- **Stale baseline ratios**: recorded README ratios may come from older tester settings.
- **GA overfitting**: a higher ratio can still produce an unfair or unreadable game.

## Hard Rules

- Do not overwrite `docs/-zero-touch/` or `docs/-revised/`.
- Do not use `docs/-revised/<game>/README.md` or `docs/-revised/<game>/main.js` during redesign or implementation.
- Do not repair from existing zero-touch `main.js` in the first pass. Generate from scratch.
- Use the same current `scripts/check_generated_game.js` for all measured outputs.
- Treat recorded ratios in old READMEs as historical context only, not as the experiment baseline.
- Use separate agents or fresh contexts for treatment spec writing, treatment implementation, and evaluation. The treatment spec writer and implementer must receive only their assigned README/design-guide inputs and must not receive `docs/-revised` content or summaries.

## Experiment Design

### Primary A/B Design

For each selected game, create two fresh implementation branches or output directories:

| Arm | Design Input | Implementation Source | Purpose |
| :--- | :--- | :--- | :--- |
| Control | Original zero-touch README format/content | Fresh implementation from README only | Measures second-attempt effect under old spec. |
| Treatment | Redesigned README using refreshed format | Fresh implementation from redesigned README only | Measures effect of stronger spec format. |

Both arms must be run with the same model/session policy as much as practical. The implementer must not read `docs/-revised/`.

### Optional Stronger Design

For a cleaner future experiment, use fresh random tag sets:

1. Pick N tag sets.
2. For each tag set, generate an old-format README and a new-format README.
3. Implement both from scratch.
4. Compare GA ratio, diagnostic, and human review.

This avoids hindsight from known zero-touch failures, but costs roughly twice as much generation work.

## Recommended Experiment Set

Use a small but mixed set:

| Category | Game | Historical Ratio Context | Why Include It |
| :--- | :--- | :--- | :--- |
| Mono-dominant rescue | `pressbound` | 0.18 -> 5.2 | Clear failure where old scoring/charge allowed monotonous dominance. |
| Mono-dominant rescue | `splitzig` | 0.04 -> 6.25 | Clear idle-friendly failure; tests whether the spec forces essential input. |
| Tied/design rewrite | `ghost_hop` | 1.0x -> 3.31x | Tests whether the format helps when the mechanic needs redesign, not just tuning. |
| Negative control | `phaserun` | 2.0 recorded pass | Checks that the new format does not degrade an already passing design. |
| Negative control | `tongue-hunter` | 2.0 recorded pass | Checks that added structure does not overcomplicate a viable hold/release design. |

Interpret `pressbound` and `splitzig` separately from `ghost_hop`; they test different failure modes.

## Directory Layout

Keep experiment artifacts separate:

```text
docs/
  validation/
    zero-touch-redesign/
      specs/
        control/
          pressbound/README.md
          splitzig/README.md
          ghost_hop/README.md
          phaserun/README.md
          tongue-hunter/README.md
        treatment/
          pressbound/README.md
          splitzig/README.md
          ghost_hop/README.md
          phaserun/README.md
          tongue-hunter/README.md
      reports/
        pressbound.md
        splitzig.md
        ghost_hop.md
        phaserun.md
        tongue-hunter.md
        summary.md

tmp/games/validation/
  baseline/<slug>/
  control/<slug>/
  treatment/<slug>/
```

Directory roles:

- `docs/-zero-touch/`: immutable original reference data.
- `docs/-revised/`: immutable human-revised reference data; forbidden during redesign and implementation.
- `docs/validation/zero-touch-redesign/specs/control/`: old-format README inputs copied from zero-touch for control implementations.
- `docs/validation/zero-touch-redesign/specs/treatment/`: redesigned README inputs using the refreshed format.
- `docs/validation/zero-touch-redesign/reports/`: long-lived experiment reports.
- `tmp/games/validation/baseline/`: rehosted copies of zero-touch artifacts when needed for current checker measurement.
- `tmp/games/validation/control/`: fresh implementations from control READMEs.
- `tmp/games/validation/treatment/`: fresh implementations from treatment READMEs.

Avoid names such as `docs/-zero-touch-redesigned/`; they look like part of the immutable zero-touch corpus and make provenance harder to read.

## Agent / Context Separation

Use sub-agents or fresh contexts to reduce leakage. The purpose is role isolation more than parallelism.

| Role | Inputs Allowed | Forbidden Inputs | Outputs |
| :--- | :--- | :--- | :--- |
| Main experiment manager | Plan, file paths, checker commands, zero-touch for baseline measurement | Do not pass revised details to spec/implementation agents | Orchestrates directories, runs checks, integrates reports |
| Control implementer | Control README only | `docs/-revised`, treatment README, zero-touch `main.js` | `tmp/games/validation/control/<slug>/` |
| Treatment spec writer | Zero-touch README, seed tags, design guide | `docs/-revised`, summaries of revised mechanics | `docs/validation/zero-touch-redesign/specs/treatment/<slug>/README.md` |
| Treatment implementer | Treatment README only | `docs/-zero-touch/<slug>/main.js`, `docs/-revised`, control implementation | `tmp/games/validation/treatment/<slug>/` |
| Evaluator | Generated games, checker outputs, rubrics | Avoid revised until after control/treatment outputs are fixed | Reports and final comparison |

If the environment supports context forking, do not fork a context that has already inspected `docs/-revised` into treatment spec or treatment implementation agents. Pass only the minimal files or text they are allowed to see.

## Procedure

### 1. Re-measure Original Baseline

Before generating anything, run the current checker on the original zero-touch implementations where possible:

```bash
node scripts/check_generated_game.js docs/-zero-touch/<game>/main.js
```

Record:

- `status`
- `ga.bestScore`
- `monotonous.summary.maxScore`
- `ratio.ratioLabel`
- `ratio.diagnostic`

If a `docs/-zero-touch/<game>/main.js` target cannot pass current static artifact checks because it lacks per-game `index.html`, copy the artifacts to a temporary complete directory and record that the baseline was rehosted for measurement.

### 2. Create Control Spec

For each game, copy the original zero-touch README into `docs/validation/zero-touch-redesign/specs/control/<slug>/README.md` without upgrading the structure.

Do not edit it except for path metadata needed by the experiment.

### 3. Create Treatment Spec

Rewrite the zero-touch README using the refreshed structure from `.agents/skills/designing-one-button-games/references/one-button-design-guide.md`.

Allowed inputs:

- Original zero-touch README.
- Original seed tags.
- General design rules from `designing-one-button-games`.

Forbidden inputs:

- `docs/-revised/<game>/README.md`
- `docs/-revised/<game>/main.js`
- Any manual summary of the human-revised mechanics

### 4. Generate From Scratch

For both control and treatment:

- Implement from the assigned README only.
- Do not start from zero-touch `main.js`.
- Do not start from revised `main.js`.
- Keep visual polish secondary; only add it when it conveys gameplay state.

### 5. Run Static Checks

Run:

```bash
node scripts/check_generated_game.js tmp/games/validation/<arm>/<slug> --no-ga
```

Treatment outputs must pass the refreshed README checks:

- `## 1.5 State Model and Tradeoff`
- `Idle weakness`
- `Hold-only weakness`
- `Mashing weakness`
- `Skilled play`
- At least one state table row

Control outputs may fail these new README checks if they intentionally use old-format README input. If they fail only because of README format, record the failure and optionally run GA with a copied static-compliant wrapper README for measurement. Keep that workaround explicit.

### 6. Run GA Gate

Run:

```bash
node scripts/check_generated_game.js tmp/games/validation/<arm>/<slug>
```

Record:

- `status`
- `ga.bestScore`
- `monotonous.summary.maxScore`
- `ratio.ratioLabel`
- `ratio.diagnostic`
- relevant verbose telemetry if `needs_improvement`

### 7. Human Fairness / Readability Review

A reviewer who did not implement the game should inspect the result. The review should answer:

- Is the primary failure condition visually readable?
- Is the game-over condition fair rather than arbitrary?
- Does score appear to follow the described mechanic?
- Are idle / hold-only / mashing visibly worse than intentional play?
- Did the implementation avoid hidden behavior that only helps the GA?

GA ratio improvement is not sufficient without this review.

## Mechanics Rubrics

Use explicit checkboxes for the expected improvement class. These are not copied from revised code; they describe the design problem each game should solve.

### `pressbound`

- [ ] Holding accumulates potential reward.
- [ ] Holding also increases pressure/risk.
- [ ] Release cashes out or resets pressure.
- [ ] Waiting too long creates a visible failure path.

### `splitzig`

- [ ] Idle or one-direction play is unsafe or low-scoring.
- [ ] Tap timing is required to aim or route effectively.
- [ ] Missed hazards leave persistent pressure, such as a stack or shrinking space.
- [ ] Destroying hazards can create a secondary management problem.

### `ghost_hop`

- [ ] Safe waiting is low-scoring.
- [ ] Scoring requires entering a vulnerable transition or risky timing window.
- [ ] Repeated tapping without reading hazards is worse than timed hops.
- [ ] The route or target choice is predictable enough for planning.

### Negative Controls: `phaserun`, `tongue-hunter`

- [ ] Treatment does not reduce GA ratio below pass threshold.
- [ ] Treatment does not add unnecessary state that makes the game harder to read.
- [ ] Treatment preserves the original core appeal while clarifying tradeoffs.

## Evaluation Criteria

### Primary Quantitative Criteria

- Treatment GA ratio is better than control GA ratio for mono-dominant rescue cases.
- Treatment `ratio.diagnostic` improves relative to control or remains `pass`.
- Negative controls remain `pass` and do not show a large ratio drop.

### Primary Qualitative Criteria

- Treatment passes the human fairness/readability review.
- Treatment satisfies the game-specific mechanics rubric.
- Treatment does not rely on revised-code leakage.

### Success Definition

For an initial validation pass:

- `pressbound` and `splitzig`: treatment should outperform control on ratio or diagnostic and pass human review.
- `ghost_hop`: treatment should improve over control or produce a clearer redesign path; failure here is less decisive because tied cases may need more than format changes.
- `phaserun` and `tongue-hunter`: treatment should not regress from pass to fail and should not become less readable.

Overall success requires:

- At least one mono-dominant rescue case clearly improves.
- No negative control regresses to fail.
- No treatment passes solely by exploiting unreadable or unfair behavior.

## Ablation Roadmap

If the A/B test shows promise, run a second-stage ablation to identify which README additions matter most:

1. Old format + Controls table only.
2. Old format + State Model table only.
3. Old format + Idle/Hold-only/Mashing/Skilled bullets only.
4. Old format + Difficulty Scaling table only.
5. Full refreshed format.

This is not required for the first validation pass, but it is necessary before claiming which individual template feature caused the improvement.

## Reporting Template

```markdown
# Zero-Touch Redesign Validation Report: <game>

## Inputs

- Baseline zero-touch implementation:
- Control README:
- Treatment README:
- Control generated implementation:
- Treatment generated implementation:

## Simulation Results

| Metric | Current Zero-Touch Baseline | Control Generated | Treatment Generated |
| :--- | :--- | :--- | :--- |
| Status |  |  |  |
| GA Best Score |  |  |  |
| Monotonous Max |  |  |  |
| GA Ratio |  |  |  |
| Diagnostic |  |  |  |

## Human Review

- Failure readability:
- Fairness:
- Scoring causality:
- Monotonous-input behavior:
- GA exploit concerns:

## Mechanics Rubric

- [ ] <rubric item 1>
- [ ] <rubric item 2>
- [ ] <rubric item 3>

## Verdict

- Pass/fail/inconclusive:
- Reason:
```

## Next Step

Do not run a treatment-only test. First prepare the control and treatment specs for `pressbound`, then run both from scratch under the same implementation conditions. Add `phaserun` or `tongue-hunter` as a negative control before drawing conclusions about the refreshed format.
