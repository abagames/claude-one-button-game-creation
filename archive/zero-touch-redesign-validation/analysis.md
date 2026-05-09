# Revised vs Zero-Touch Analysis

This document compares the agent-generated games in `docs/-zero-touch/` with the human-revised games in `docs/-revised/`. It focuses on mechanics, not visual polish.

## Scope And Method

This is not a random sample of all zero-touch outputs. The comparison set is the 16 games that have both a zero-touch version and a human-revised version under `docs/-zero-touch/` and `docs/-revised/`. Therefore the findings should be read as: **what changed in games selected for revision**, not as a complete estimate of zero-touch quality across the whole repository.

The analysis uses three evidence sources:

- Zero-touch README/design text.
- Revised `main.js` mechanics, summarized into revised README files.
- GA ratio values already recorded in existing READMEs where available. These values were not re-run for this document.

## Evidence Snapshot

The repository already uses `GA ratio = ga.bestScore / monotonous.summary.maxScore` in `scripts/check_generated_game.js`. Existing READMEs record ratios for only some games, but those records are enough to support the main pattern: failing or marginal games improved when the design created a clearer skilled-action advantage over monotonous input.

| Game | Recorded Zero-Touch Ratio | Recorded After/Revision Ratio | Inferred Diagnostic | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `ghost_hop` | 1.0x | 3.31x | tied -> pass | Revised scoring made timed hops outperform monotonous play. |
| `pressbound` | 0.18 | 5.2 | mono_dominant -> pass | Charge/release was reworked into a pressure cash-out. |
| `splitzig` | 0.04 | 6.25 | mono_dominant -> pass | Idle-friendly auto-bounce was replaced by essential turn timing. |
| `stompshelter` | N/A | 18.8x | unknown -> pass | Revised version strongly rewards climb/stomp routing. |
| `phaserun` | 2.0 | not recorded here | pass | Already passed, but revised mechanics added hold-to-grow risk/reward. |
| `tongue-hunter` | 2.0 | not recorded here | pass | Already passed, but revised scoring tied reward to tongue exposure length. |
| `missile_guide` | 2.8 | not recorded here | pass | Already passed, but revised spec clarifies fuel/outpost tradeoff. |
| `cling-hop` | Infinity | not recorded here | pass | Monotonous max was recorded as 0; revised spec clarifies state-dependent collision. |
| `geyser-hop` | Infinity | not recorded here | pass | Monotonous max was recorded as 0; revised spec clarifies ceiling pressure and stomp reward. |

Missing ratios are a limitation of this document. A stronger follow-up would run `scripts/check_generated_game.js` on archived before/after game directories with the same seed and report `ratio.diagnostic` directly.

## Summary

The largest repeated gap in revised games was not syntax or crisp-game-lib usage. It was under-specified play logic: the original design often described controls and objects, but not the state model that makes one-button decisions meaningful. The revised versions usually introduce or sharpen:

- A visible state variable that changes decisions: `combo`, `charge`, `fuel`, `wallPress`, `orbitRadius`, `jumping`, `tongueLength`, `platform.hp`.
- A concrete input tradeoff: holding gives power but increases danger, tapping changes route but can create vulnerability, releasing cashes out but resets a resource.
- A scoring event caused by play: stomp, graze, erase marked targets, catch at range, collect in the dangerous state, multi-kill during a wipe.
- A structural anti-monotony rule: hold drains fuel, idle collides or misses score, mashing wastes cooldown / resets combo / forces unsafe state changes.
- A deliberate difficulty curve, often using `sqrt(difficulty)` for movement and spawn pressure.

## Repeated Improvement Patterns

### 1. State Model Before Implementation

The revised specs are more actionable when they name the state that drives decisions:

- `fuel` in `missile_guide`: holding is safe only until fuel runs out.
- `wallPress` and `charge` in `pressbound`: pressure and reward grow together.
- `orbitRadius` in `orbit-grazer`: damage shrinks the safe play space instead of ending immediately.
- `platform.hp` in `stompshelter`: safe ground becomes a consumable resource.

Observation: every important state variable needs a trigger, an in-world feedback channel, and a decision purpose.

### 2. Contextual One-Button Input

Several revised games use the same input differently depending on state:

- `cling-hop`: tap flaps in air, but releases from a platform while clinging.
- `phaserun`: tap toggles collision state, hold changes reward/risk size.
- `geoerase`: hold marks targets, release resolves the selected set.
- `pressbound`: hold freezes/charges, release cashes out and starts a new round.

Observation: a one-button mapping is incomplete if it says only what the button does, without explaining when that action is safe, risky, profitable, or wasteful.

### 3. Causal Scoring Instead Of Survival Drip

Zero-touch versions often used flat pickup values or survival score. Revised mechanics more often score caused events:

- `geoerase`: score comes from releasing a marked set, with multi-erase combo growth.
- `star-eater`: score grows quadratically with asteroids destroyed by one blast.
- `tongue-hunter`: score scales with tongue length and combo, tying reward to exposure.
- `stormveil`: coin streaks increase a multiplier; missed coins reset it.

Observation: scoring is more useful when it measures mastery of the mechanic, not elapsed time or input frequency.

### 4. Explicit Monotony Defeat

The revised READMEs now state why each monotonous policy is inferior:

- Idle loses to gravity, rising lava, closing walls, missed score, or incoming hazards.
- Hold-only loses to fuel drain, overextension, larger hitboxes, ceiling collision, or frozen crush.
- Mashing loses to cooldown, combo reset, missed alignment, wasted jumps, or unsafe state changes.

Observation: if idle, hold-only, and mashing cannot each be explained as worse than skilled play, the design is probably not ready for implementation.

### 5. Deliberate Difficulty Scaling

Revised code repeatedly replaces brittle linear rates with formulas such as:

- `speed * sqrt(difficulty)`
- `spawnInterval / sqrt(difficulty)`
- `spawnInterval / difficulty` for intentionally steeper pressure
- bounded timers rather than one-off clamps

Observation: the design should name what scales and why. `sqrt(difficulty)` is a good default for smooth pressure, but not a universal law.

### 6. Mechanics First, Game Feel Second

The revised code contains many useful visual upgrades: particles, eyes, squash/stretch, trails. This analysis does not claim visual polish is bad or irrelevant. It only separates two concerns:

- The reusable design signal in this comparison is mostly rule/state/scoring change.
- Game feel belongs after the core loop is stable, matching the existing workflow that uses `maximizing-game-feel` after core rules and balance are stable.

Examples:

- `ghost_hop` became jump-only vulnerability plus landing multiplier; animation supports the rule.
- `orbit-grazer` became radius-collapse damage plus graze scoring; trails support readability.
- `pressbound` became freeze/charge/crush/cash-out; bounce effects support feel.

## Per-Game Findings

### CLING HOP

- **Zero-touch issue**: The zero-touch report says monotonous input scored 0 and GA scored 195, so the concept was viable. The missing design detail was the rule-level meaning of clinging vs airborne collision.
- **Revised mechanic**: Airborne contact can destroy obstacles; clinging contact kills. Landing on new platforms scores based on active obstacle count.
- **Improvement category**: Contextual state, state-dependent collision, risk-based platform transfer.
- **Prompt/design rule to extract**: If a player has an attached/free state, specify how collision and scoring differ in each state.

### DARK SORT

- **Zero-touch issue**: It described classification but not the anti-monotony implications of binary color state.
- **Revised mechanic**: Hold makes the gate white, release makes it black, and falling objects are visible only inside a reveal radius.
- **Improvement category**: Binary classifier, limited information, explicit idle/hold failure.
- **Prompt/design rule to extract**: For classify games, state what each constant input policy misclassifies.

### GEOERASE

- **Zero-touch issue**: The mark/release idea existed, but scoring was too flat and did not strongly reward batching.
- **Revised mechanic**: Holding marks aligned enemies; release erases all marked enemies. Multi-erase increases combo; weak releases decay it.
- **Improvement category**: Deferred action, batching reward, combo pressure.
- **Prompt/design rule to extract**: For hold/release attacks, reward the quality of the selected set, not merely the release event.

### GEYSER HOP

- **Zero-touch issue**: The recorded GA ratio was already a pass, but the README did not clearly connect successful stomps to pressure relief.
- **Revised mechanic**: Stomps score a multiplier, bounce the player, collapse the geyser, and lower a rising ceiling.
- **Improvement category**: Pressure reset, directional collision, score plus survival coupling.
- **Prompt/design rule to extract**: A successful skill action should often relieve one accumulating danger, not just add points.

### GHOST HOP

- **Zero-touch issue**: Recorded ratio improved from 1.0x to 3.31x. The original shield/reflection rules did not create a strong enough skilled advantage over monotonous play.
- **Revised mechanic**: Tap hops cyclically between platforms; bullets only kill during jumps; landing doubles a decaying multiplier.
- **Improvement category**: Vulnerable scoring state, simplified input, route commitment.
- **Prompt/design rule to extract**: If the safe state exists, make it low-scoring; the scoring action should expose the player to a readable danger.

### INKINH

- **Zero-touch issue**: The premise was accurate but lacked state/tradeoff detail.
- **Revised mechanic**: Holding both thrusts and inhales, making collection and movement risk inseparable. Combo requires timed orb collection.
- **Improvement category**: Coupled benefit/risk input, inertia, combo timer.
- **Prompt/design rule to extract**: When one input grants two benefits, at least one should create a positional risk.

### MISSILE GUIDE

- **Zero-touch issue**: Recorded ratio was already pass at 2.8, but the route/fuel/outpost loop needed sharper decision framing for reuse.
- **Revised mechanic**: Freeze avoids obstacle timing but drains fuel; release resumes homing to outposts, restoring fuel and score.
- **Improvement category**: Resource-limited safety, automatic guidance, pickup chain.
- **Prompt/design rule to extract**: Defensive hold actions need an explicit depletion resource and a scoring reason to release.

### ORBIT GRAZER

- **Zero-touch issue**: Earlier spec emphasized hold speed, cooldown, and multiplier patterns that were absent from the revised code.
- **Revised mechanic**: Tap reverses orbit direction. Asteroid hits shrink orbit radius and grant invincibility; close passes score.
- **Improvement category**: Gradual failure state, proximity scoring, spatial damage.
- **Prompt/design rule to extract**: For graze games, consider damage that reduces maneuvering space rather than immediate death.

### PHASERUN

- **Zero-touch issue**: Recorded ratio was already pass at 2.0. The remaining design gap was flat coin scoring and unused hold input.
- **Revised mechanic**: Tap toggles collision state; hold grows the player. Larger solid form gives bigger coin scores but higher obstacle risk.
- **Improvement category**: Safe/non-scoring vs dangerous/scoring state, voluntary hitbox risk.
- **Prompt/design rule to extract**: If a phase state removes danger, it should also remove or reduce scoring opportunity.

### PRESSBOUND

- **Zero-touch issue**: Recorded ratio improved from 0.18 to 5.2. The original charge/pushback loop let monotonous strategies dominate.
- **Revised mechanic**: Holding freezes balls and charges score while walls press faster. Release scores by charge squared and ball-count squared, resets walls, and spawns a new set.
- **Improvement category**: Cash-out economy, squared reward, compression pressure.
- **Prompt/design rule to extract**: Charge mechanics should make the player choose when to cash out before an irreversible spatial failure.

### SPLITZIG

- **Zero-touch issue**: Recorded ratio improved from 0.04 to 6.25. The old behavior allowed idle-friendly survival; the revised behavior makes turn timing essential.
- **Revised mechanic**: Auto-fire splits falling blocks; missed blocks add to a rising stack that can push the player off the top.
- **Improvement category**: Persistent miss consequence, split hazard management, aim through movement.
- **Prompt/design rule to extract**: Missed obstacles should leave world-side consequences when the design is about area control.

### STAR EATER

- **Zero-touch issue**: Charge/blast existed, but score and risk needed stronger coupling.
- **Revised mechanic**: Holding increases charge, player size, speed, and blast radius. Release destroys grouped asteroids with quadratic multi-kill score.
- **Improvement category**: Self-endangering charge, area burst, multi-kill reward.
- **Prompt/design rule to extract**: If holding charges an attack, holding should visibly increase vulnerability, and release should reward timing against grouped targets.

### STOMPSHELTER

- **Zero-touch issue**: Recorded final ratio was 18.8x after improvement. The reusable design lesson is not just "add platforms", but make shelter consumable and contested.
- **Revised mechanic**: Platforms crumble from standing and debris, lava rises, tap supports double jump, and hold increases horizontal drift.
- **Improvement category**: Consumable shelter, layered hazards, stomp bonus.
- **Prompt/design rule to extract**: Shelter objects should degrade or be contested so safety requires movement.

### STORMVEIL

- **Zero-touch issue**: The spec included survival score and smoke-theme language that was not central to the revised code.
- **Revised mechanic**: Tap cycles through three lanes. Each wave blocks lanes and places a coin in a safe lane; coin streaks increase multiplier and misses reset it.
- **Improvement category**: Cyclic lane selection, streak reward, no passive scoring.
- **Prompt/design rule to extract**: In lane games, avoid passive survival score unless survival itself is the measured skill; reward correct lane choice under timing pressure.

### TONGUE HUNTER

- **Zero-touch issue**: Recorded ratio was already pass at 2.0, but the attack/defend tradeoff needed stronger scoring specificity.
- **Revised mechanic**: Tongue extends toward prey while held; catch score scales with tongue length and combo; hazards kill the exposed tongue.
- **Improvement category**: Exposed weapon body, range-based reward, retract-to-defend.
- **Prompt/design rule to extract**: Long-range attacks should increase exposure and should score more only when the added exposure matters.

### WIPE BLADE

- **Zero-touch issue**: The wipe idea was present, but the timing economy needed clearer cooldown and combo structure.
- **Revised mechanic**: A rotating two-sided blade can perform a short wipe on tap. Multi-kills grant bonus score and reduce effective downtime.
- **Improvement category**: Angular timing, cooldown management, cluster reward.
- **Prompt/design rule to extract**: For radial attacks, make the player wait for geometric alignment and reward clearing clusters, not just pressing on cooldown.

## Prompt Rules To Feed Back Into Generation

Use these as direct requirements in future game-generation prompts or in `designing-one-button-games`:

1. **State model**: Include `## 1.5 State Model and Tradeoff` with state variables, triggers, in-world feedback, and decision purpose. Do not add bookkeeping state that does not change player decisions.
2. **Input tradeoff**: Explain what press, hold, and release do in context, then state why idle, hold-only, and mashing are each worse than skilled play. If an input phase is intentionally unused, say so and explain why the remaining phases still create skill.
3. **Causal scoring**: Tie score to an in-world skill event such as stomp, graze, batch erase, precise catch, cluster clear, route selection, or pressure cash-out. Survival score is acceptable only when survival itself is the core mastery signal.
4. **Persistent consequence**: Give missed hazards or overused safety a consequence such as rising stack, crumbling platforms, shrinking orbit, closing walls, lost multiplier, missed fuel, or exposed hitbox. Skip this only for very short score-attack games where immediate collision pressure is sufficient.
5. **Difficulty intent**: State which quantities scale and why. Default to `sqrt(difficulty)` for smooth movement/spawn pressure; use steeper `difficulty` scaling only when the game needs intentionally escalating pressure, and cap rates where readability would collapse.

## Anti-Patterns Found In Zero-Touch Outputs

- **Premise without decision model**: The README explains what appears on screen, but not what decision the player is making each second.
- **Input mapping without tradeoff**: It says "hold to X" or "tap to Y" but does not say why always doing that loses.
- **Flat scoring**: Pickups or survival grant points without measuring risk, precision, timing, or chain quality.
- **Unspecified failure fairness**: Death exists, but the spec does not explain how the player reads and avoids it.
- **Theme-as-mechanic drift**: Seeds are named, but the implemented loop does not convert the seed into an actual decision.
- **Post-hoc balance notes instead of design constraints**: Some zero-touch READMEs include simulation results, but the reusable lesson is not folded back into the core mechanics.

## Static Checker Integration

The existing static-check phase in `scripts/check_generated_game.js --no-ga` has been extended rather than adding a separate checker. It already validated README section headings; it now also requires:

- `Idle weakness`
- `Hold-only weakness`
- `Mashing weakness`
- `Skilled play`
- At least one state table row under `## 1.5 State Model and Tradeoff`

This makes the generation workflow fail fast before paying for GA evaluation. `designing-one-button-games` now mirrors these checks as design requirements, and `maximizing-game-feel` should continue to be used only after core rules and balance are stable.

## Cross-Skill Follow-Up

Consider a separate update to `designing-mini-games`. The one-button-specific monotonous-input checks should not be copied directly, but these rules likely transfer to multi-input design:

- State variables need decision purpose.
- Score should come from causal in-world events.
- Difficulty scaling should state intent, including when to use `sqrt(difficulty)`.
- Persistent consequences or safety costs should be specified when the game needs them.
