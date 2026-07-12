---
name: designing-mini-games
description: "Designs original, compact mini-games — rules, controls, scoring, hazards, and difficulty curves — for any input scheme, including one-button (tap / hold / release) games. Use when defining a new mini-game concept, converting creative constraints or seeds into mechanics, choosing an input scheme, checking state-variable necessity, or preventing idle, hold-only, or mashing play from becoming optimal."
---

# Designing Mini-Games

A library-agnostic guide for designing mini-games. The aim is an intuitive, visually self-explanatory game that rewards skilled play and contains at least one mechanic the player has never seen before. It covers every input scheme from a single binary button to multi-button layouts; rules that apply only to one-button games are marked as such.

## When to Use

- Invent a new mini-game from a theme, prompt, or set of inspiration tags.
- Audit an existing mini-game design for monotonous-input dominance, unfair death, or lack of novelty.
- Decide between competing mechanic ideas before implementation.

This skill covers **design only**. Implementation details (rendering, collision, audio) belong to engine-specific skills such as `developing-with-crisp-game-lib` or the target engine's implementation skill.

Design deliverables should still name implementation-facing invariants when balance depends on them. An invariant is a testable rule the later implementation must preserve, such as "repeated taps within 12 frames cannot create another scoring pulse." Do not write engine code here; write the rule that implementation must uphold.

At design time, keep constants qualitative unless the balance claim depends on a threshold. It is acceptable to write "minimum-age bloom" or "short cooldown" here, then defer choosing frame counts to the implementation pass, derived from the intended action cycle. If a deterministic seed or generator does not exist yet, state the seed/precheck invariant now and mark the actual first-case check as an implementation-time validation item.

## Companion skills

- `implementing-gameplay-invariants` — use after or alongside this skill when turning idle / hold-only / mashing weaknesses into code-level invariants and validation checks.
- `maximizing-game-feel` — use after core rules and balance are stable, or when readability/polish could affect play.

## Core Rules

- Keep the core experience expressible in one sentence.
- Choose the input scheme first — button count and the role of each press / hold / release phase or button — and design controls before adding secondary systems. If the brief fixes a button count, design within it.
- Game-over is single, visually obvious, and follows from a hazard or world-state collapse — never from a "did not press" punishment.
- Every monotonous input policy available under the chosen scheme must be strictly worse than skilled play: idle and mashing always; hold-only for one-button games; single-button-spam and hold-everything for multi-button games.
- Score must come from in-world causality (close calls, precise timing, chain reactions), not raw input facts (taps per second). Prefer causal scoring events such as stomp, graze, batch erase, precise catch, cluster clear, route selection, or pressure cash-out. Survival score is acceptable only when survival itself is the core mastery signal; if used, explicitly state what skilled survival pattern separates good play from the monotonous policies.
- Add a state variable only when it creates a player decision that existing rules cannot express. Every important state variable must have a trigger, visible in-world feedback (behavior, terrain, shape, speed, sound, color, or animation — never a HUD number alone), and a decision purpose. Do not add bookkeeping state that does not change player decisions.
- Designs with zero state variables are valid when complexity emerges purely from geometric or physical interaction. If no state variables are used, justify why the interaction space alone creates decisions.
- If an input phase or button grants safety or power, pair it with a readable cost: lost scoring, resource drain, exposure, larger hitbox, speed, pressure, or recovery time.
- State which quantities scale with difficulty and why. Use `sqrt(difficulty)` as the default for smooth motion/spawn pressure, and use steeper scaling only when the design intentionally needs escalating pressure.
- For each monotonous-input weakness that balance depends on, state at least one implementation invariant. The invariant should be testable without naming a specific engine API.

One-button-specific rules:

- One binary input only — tap (press), hold, or release. No second key, no chord, no swipe.
- If an input phase (press / hold / release) is intentionally unused, say so explicitly and explain why the remaining phases still create skill. Do not invent a meaningless hold or release just to fill the table.

## Design Procedure

Phase 1: Idea generation

1. **Free Association**: verbalize the first images and sensations the input scheme or seeds evoke. *If the seeds visibly contradict each other (e.g. `on_pressed:jump` + `on_pressed:shoot`), read `references/mini-game-design-guide.md` §7 (Tag / Prompt Contradiction = Creative Tension) before continuing — do not pick one and discard the other.*
2. **Deviation Exploration**: verbalize the first mechanic that comes to mind, record it explicitly, then treat it as forbidden. Consider opposites, negations, and extremes; push toward unexpected directions. Do not proceed with the first association as the final design.
3. **Core Experience Decision**: define the momentary sensation the player should feel, in a single phrase.
4. **Input Scheme and Mechanics Construction**: fix the button count (or confirm the one given by the brief), then design the press / hold / release phases or per-button roles that realize that sensation.

Phase 2: Specification hardening

5. **State and Tradeoff Definition**: name the state variables that create decisions, their triggers, their in-world feedback, and the safe/risky behavior pair.
6. **Monotonous-Input Rejection**: write why each monotonous policy in the chosen scheme's policy set (idle and mashing always; hold-only for one-button; single-button-spam and hold-everything for multi-button) loses to skilled play. If an input phase or button is intentionally unused, say why the remaining inputs still create skill.
7. **Scoring and Difficulty Definition**: define the causal scoring event and the quantities that scale with difficulty.
8. **Implementation-Invariant Sketch**: for each risky weakness claim, add the implementation rule that must make it true. Expand this into a fuller invariant translation when the design has pulses, shields, charge, combos, or repeated scoring windows.

Phase 3: Verification

9. **Emergence Review**: if implementation revealed a behavior not in the original spec, document it and decide whether to preserve it as a design revision. Unintentional but interesting mechanics should be formalized rather than fixed away.
10. **Consistency Verification**: run the checklist below.

> Treat seeds as stimulus for steps 1–2. From step 3 onward, do not be bound by them. A finished design that no longer references the original tags is fine.

## Design Quality Checklist

- [ ] Is the input scheme within the button-count limit chosen in the project brief (for one-button briefs: completes with press, hold, release, or a combination — no second input required)?
- [ ] Is the game-over condition single and visually obvious?
- [ ] Is each monotonous policy in the scheme's policy set strictly suboptimal, and does the deliverable explicitly include an `Idle weakness`, `Mashing weakness`, and `Skilled play` bullet, plus `Hold-only weakness` (one-button) or the multi-button equivalents?
- [ ] Does each important monotonous-input weakness include at least one testable implementation invariant?
- [ ] Does the design document the state model and tradeoff, or explicitly justify the absence of state variables with a geometric/physical decision space?
- [ ] Does every state variable have a non-text in-world feedback channel?
- [ ] Can you give a reasoned answer to all four principles in §2 of the reference guide?
- [ ] Is score tied to an in-world causal event? If using survival score, is survival itself the central skill expression?
- [ ] Are persistent consequences or safety costs specified where needed (lost multiplier, shrinking space, fuel drain, crumbling platform, cooldown, exposed hitbox, etc.)?
- [ ] Does the design state what scales with difficulty and why?
- [ ] Does the design record the first association and an explicit reason for rejecting it (the Intentional Deviation content)?
- [ ] Did the idea start from the seed but contain elements beyond it?
- [ ] Is there a "I've never seen this before" moment?
- [ ] Is this **not** a clone or minor variation of a widely-known existing game?
- [ ] **For new-design tasks**, does the document capture the required content (name + slug, seeds, core mechanics, state/tradeoff, object specs, design principle analysis, basis for novelty, similarity check)? See `references/mini-game-design-guide.md` Appendix A for an example layout.

## References

- `references/mini-game-design-guide.md` — self-contained design vocabulary for mini-games: four core principles, input-pattern tables for one-button and multi-button schemes, movement/environment tables, state/tradeoff and monotonous-input checks, abstract-question prompts, contradiction-as-tension table, difficulty-intent defaults, recommended output format, and SCAMPER appendix.
