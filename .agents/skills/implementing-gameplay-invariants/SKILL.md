---
name: implementing-gameplay-invariants
description: "Translates game design prose into engine-neutral implementation invariants and validation checks. Use when implementing or reviewing game mechanics where idle, hold-only, mashing, spam, safe waiting, or repeated scoring pulses must be prevented from dominating skilled play."
---

# Implementing Gameplay Invariants

## Purpose

Turn design intent into concrete implementation constraints. This skill sits between game design and engine-specific coding: it converts statements such as "mashing should be worse than timed play" into invariants, implementation patterns, and validation checks that can be applied in any engine.

Use this skill even without `designing-one-button-games` when a game spec contains risk/reward prose but does not say how the code will enforce it.

If the game has no design spec yet, start with `designing-one-button-games` for one-button briefs or `designing-mini-games` for multi-input briefs.

## When to Use

- Implementing a game mechanic from a design spec or README.
- Reviewing code against a design spec before running a balance test.
- A checker or simulation shows `mono_dominant`, `tied`, or repeated-input dominance, and you already know which design promise needs a code-level invariant.
- The design mentions idle weakness, hold-only weakness, mashing weakness, safe waiting, cooldowns, combos, scoring pulses, shields, charges, or invulnerability.
- The implementation is engine-specific, but the failure mode is rule-level rather than API-level.

## When Not to Use

- Pure rendering, asset, UI, audio, build, or engine API work.
- Numeric tuning after the rule-level invariants are already enforced.
- Open-ended game design before the core rules and scoring events are known.
- Choosing a balance-repair strategy from telemetry. Start with `evaluating-gameplay-balance` when a failure has occurred and you need to diagnose the cause or choose a balance pattern; use this skill after that when the chosen fix needs a new code-level invariant.

## Required Inputs

- The design spec or README.
- The input policies that must be worse than skilled play: idle, hold-only, mashing, always-left/right, alternating spam, safe waiting, or equivalent.
- The intended skilled pattern.
- The scoring event, game-over condition, and any safety/power state.
- Any deterministic validation seed or known initial random sequence used by the project checker.
- Optional telemetry or checker output.

## Procedure

1. Extract each design promise that must be true in code:
   - "Idle is weak"
   - "Hold-only is weak"
   - "Mashing is weak"
   - "Score comes from timing"
   - "Shield is safe but costly"
   - "Landing / pulse / reflection rewards precision"

2. Rewrite each promise as an invariant:
   - Use testable language: "A tap within 12 frames of the previous tap cannot score", not "mashing is bad".
   - Include the scope: per input, per target, per hazard, per landing, per combo, per second, or per resource unit.
   - Include the consequence: no score, cooldown, exposure, resource drain, combo reset, missed aim, or visible positional cost.
   - When a scoring object can persist across frames or inputs, define its lifecycle explicitly: spawn/start, active scoring window, scored/consumed state, expiry/removal, and whether a new lifecycle can score again.
   - For repeated pulse, reflection, AoE, shield, or release scoring, require per-opportunity identity in validation logs when possible (`targetId`, `pulseId`, or equivalent) so duplicate scoring is detectable.

3. Run a policy-specific precheck before coding when the mechanic can be reasoned about from the spec:
   - For each bad policy, write whether it should die, time out safely, or survive with capped score.
   - If a bad policy can survive indefinitely, the invariant must cap or starve its score; death cannot be the weakness.
   - If random first hazards, gaps, spawns, or routes affect survivability, preview the project's deterministic validation seed and confirm the first 5-10 outcomes match the invariant assumptions.

4. Choose an implementation pattern from `references/invariant-patterns.md` if needed.

5. Check for scoring loopholes:
   - No raw score per input.
   - No reusable pulse that can score repeatedly without a new hazard/opportunity.
   - No survival scoring while the player is in a safe/low-skill state unless survival is the main mastery signal.
   - No permanent safety state with uncapped scoring.
   - No long-lived scored object that remains eligible for future score unless its lifecycle visibly resets.
   - No total-score-only validation for spam fixes; also compare score per unique opportunity or unique target when the mechanic can rescore the same object.

6. Add or review the implementation:
   - Engine-specific code belongs in the engine skill or project code.
   - This skill defines what must be true, not the exact rendering or API calls.

7. Validate:
   - Run available monotonous policies and exploratory/skilled policies.
   - Prefer invariant-specific probes before the full global ratio check: `NoInput` score/death, `HoldOnly` score/death, `SpamPress` scoring events, entity counts, resource drain, and score-per-opportunity caps.
   - For pulse/reflection/AoE fixes, log accepted/rejected inputs, pulse age or cooldown state, target/opportunity id, already-scored state, score delta, and max active entity count.
   - Define the probe's pass/fail bound before editing when possible, such as `SpamPress` score per unique target below a scripted skilled cycle, `HoldOnly` score capped below a stated rate, or max active entities below a fixed limit.
   - Confirm the known bad policy scores lower than skilled play.
   - If no simulator exists, write a short human-readable validation checklist and mark the gap.

## Invariant Template

Use this compact form in specs, PR notes, or code reviews:

```markdown
- Design promise: <prose from spec>
- Implementation invariant: <testable rule>
- Pattern: <pattern ID from references/invariant-patterns.md, e.g. cooldown, per-target-cap, resource-drain>
- Precheck: <whether the bad policy dies, survives safely, or must be score-capped>
- Validation: <policy, telemetry, or seeded scenario that should fail if the invariant is broken>
```

## Common Failure Modes

- Prose-only weakness: the README says mashing is bad, but the code gives every tap a scoring chance.
- Reusable scoring pulse: a landing, shield, AoE, or reflection pulse can score many times from repeated input.
- Safe scoring: the safest state also earns points or preserves a multiplier.
- Hidden tester patch: code special-cases a bad policy instead of creating visible game rules.
- Numeric-only fix: spawn rates or score values are changed without enforcing the missing invariant.
- Unbounded entities: scoring or hazard objects live too long, causing slow validation and spam score loops.
- Seed-specific surprise: the validation seed creates early hazards/gaps that violate design assumptions, and the issue is found only after a full GA run.

## Validation

A change is valid when:

- Each design promise has at least one implementation invariant.
- Each monotonous policy has a visible cost or score cap.
- Any indefinitely surviving monotonous policy has a scoring cap or score starvation rule.
- Seeded early-game random sequences have been checked when random initial hazards or gaps determine survivability.
- Skilled play has a causal route to higher score or longer meaningful survival.
- The implementation can be tested by policy comparison, telemetry, or a concrete manual checklist.

If validation is impossible, report that the invariant is specified but unverified.

## References

- `references/invariant-patterns.md` — reusable patterns for mashing, hold-only, idle, safe waiting, pulse scoring, combos, and resource states.
