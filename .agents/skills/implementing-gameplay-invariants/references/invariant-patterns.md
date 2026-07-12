# Gameplay Invariant Patterns

Use this reference when a design promise needs to become enforceable game logic. The patterns are engine-neutral; adapt names and APIs to the target project.

Pattern IDs are stable shorthand for invariant tables and review notes.

## Mashing Weakness

Problem: repeated input creates too many scoring or safety opportunities.

Implementation invariants:

- Inputs inside a short interval cannot trigger a full-value scoring event.
- A repeated input commits the player to a vulnerable recovery, drift, aim error, or missed lane.
- A scoring pulse can fire once per hazard/opportunity, not once per tap.
- A combo increases only when a timed condition is met; mistimed input resets or stalls it.

Patterns:

- `cooldown`: `nextActionFrame > currentFrame` blocks repeat effects.
- `commitment-window`: after input, movement/state cannot be cancelled immediately.
- `minimum-interval`: inputs closer than `N` frames are ignored or produce a visible weak action.
- `per-target-cap`: a hazard, enemy, or opportunity has `scored = true`.
- `pulse-lifetime-cap`: AoE/reflection pulses are short and cannot overlap into repeated scoring.
- `aim-degradation`: rapid taps widen aim error or break target lock.

Validation:

- `SpamPress` / alternating spam max score is below skilled-play score.
- Score-event telemetry shows one reward per real opportunity, not per input.

## Hold-Only Weakness

Problem: permanent holding gives safety, power, or score without timing decisions.

Implementation invariants:

- Holding safety drains a visible resource or sacrifices score.
- Holding attack increases exposure, hitbox, hazard attraction, or recovery time.
- Hold-only cannot preserve or grow the best multiplier indefinitely.
- Release or timing is required to cash out meaningful score.

Patterns:

- `resource-drain`: shield/charge/fuel drains while held and recovers only when released or exposed.
- `score-lockout`: safe hold state cannot score or can score only low-value setup points.
- `exposure-curve`: longer hold increases size, slows movement, attracts hazards, or narrows escape.
- `forced-cashout`: score is awarded on release/timing, not raw hold duration.
- `overhold-pressure`: holding too long causes visible world pressure, not hidden punishment.

Validation:

- `HoldOnly` max score is below skilled-play score.
- Hold-only may survive, but it should miss score or eventually lose its safety.
- If `HoldOnly` can survive indefinitely, its score must be capped, starved, or grow slower than skilled play by a stated bound.

## Idle / Safe Waiting Weakness

Problem: doing nothing remains safe or competitive.

Implementation invariants:

- Idle play misses all meaningful scoring events.
- World pressure grows while idle: stack, closing wall, rhythm loss, missed fuel, lost multiplier, or path collapse.
- Safe waiting has an opportunity cost visible in the world.

Patterns:

- `decay`: multiplier, fuel, terrain, or opportunity value decreases over time.
- `pressure-accumulation`: hazards, space compression, or route cost grows without action.
- `moving-opportunity`: scoring windows pass by and cannot be recovered.

Validation:

- `NoInput` / safe-wait score is below skilled-play score.
- If idle survives long, its score should remain low unless survival is the game's core mastery metric.
- If idle can survive indefinitely, specify the score cap or missed-opportunity math before relying on the global ratio.

## Pulse, Reflection, and Area Scoring

Problem: a broad effect intended as a precision reward becomes repeatable spam.

Implementation invariants:

- A pulse scores only if it overlaps a specific active hazard/opportunity at the intended timing.
- Each hazard/opportunity can be scored once per lifecycle.
- Pulse creation has cooldown, commitment, or resource cost.
- Pulse score cannot exceed a bounded amount per second or per input cycle.

Patterns:

- `one-shot-opportunity`: object has `canScore` or `scored` state.
- `timing-gate`: score only if the pulse overlaps during a narrow age/distance window.
- `per-landing-cooldown`: landing rewards are disabled until the player has completed a non-trivial route or hazard changes.
- `score-per-cycle-cap`: total points from one landing/charge/release are capped.
- `entity-cleanup`: remove or expire reflected/projectile/scoring objects promptly.

Validation:

- Spam input cannot generate repeated pulses that outscore timed play.
- Entity counts stay bounded during long simulations.

## Combo and Multiplier Safety

Problem: the safest or most repetitive policy preserves a multiplier.

Implementation invariants:

- Multipliers advance only on skill events.
- Safe states pause, decay, or reset multipliers.
- Mistimed input or missed opportunity has a visible multiplier cost.

Patterns:

- `skill-event-gate`: combo increments only on precise catch/graze/cash-out.
- `decay-timer`: combo expires unless the player keeps taking risk.
- `safety-reset`: shield/idle/retract states reset combo after a short grace window.

Validation:

- Bad policies cannot keep the highest multiplier.
- Score logs show multiplier growth tied to risky events.

## Difficulty and Readability Bounds

Problem: a fix beats a policy by making the game unreadable or excessively slow to validate.

Implementation invariants:

- Spawn rates, object lifetimes, and entity counts are bounded.
- Difficulty scaling preserves readable reaction windows unless collapse is the intended endgame.
- Validation runtime remains within the project's normal loop.

Patterns:

- `max-entity-count`: cap active objects.
- `lifetime-expiry`: expire objects after a bounded lifetime.
- `spawn-interval-floor`: keep spawn cadence above a readable minimum.
- `score-object-cleanup`: remove score-producing objects promptly after use.
- `explicit-end-pressure`: use visible end-state pressure instead of infinite stable loops.

Validation:

- Full balance check completes within expected time.
- Runtime outliers are reviewed as possible mechanics failures, not only performance bugs.

## Seeded Early-Sequence Precheck

Problem: the validation seed produces an early hazard, gap, spawn, or route sequence that violates design assumptions.

Implementation invariants:

- The first few seeded hazards/gaps are survivable by the intended skilled policy.
- The first few seeded hazards/gaps do not allow a monotonous policy to score competitively by accident.
- A policy that survives all early seeded cases must have a score cap or missed-opportunity cost.

Patterns:

- `seed-preview`: enumerate the first 5-10 random outcomes used for initial hazards, gaps, spawns, or route choices.
- `early-case-table`: list each early case and expected result for `NoInput`, `HoldOnly`, `SpamPress`, and skilled play.
- `score-bound-math`: if a bad policy survives, compute its maximum score rate versus skilled play.

Validation:

- Run a short deterministic simulation or manual calculation for the validation seed before paying for a full GA.
- Record which invariant each bad policy is expected to satisfy: death, score starvation, score cap, resource drain, or missed opportunity.
