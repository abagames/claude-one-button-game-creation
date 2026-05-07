---
name: designing-one-button-games
description: "Designs original one-button mini-games using tap, hold, and release controls, with emphasis on novelty, risk/reward, and a short difficulty curve. Use when planning mechanics, scoring, game-over conditions, and difficulty curves for games controlled by a single binary input. For multi-button mini-games, use `designing-mini-games` instead."
---

# Designing One-Button Mini-Games

A library-agnostic guide for designing one-button mini-games. The aim is an intuitive, visually self-explanatory game that rewards skilled play and contains at least one mechanic the player has never seen before.

## When to Use

- Invent a new one-button game from a theme, prompt, or set of inspiration tags.
- Audit an existing one-button design for monotonous-input dominance, unfair death, or lack of novelty.
- Decide between competing mechanic ideas before implementation.

This skill covers **design only**. Implementation details (rendering, collision, audio) belong to engine-specific skills such as `developing-with-crisp-game-lib` or `scaffolding-godot-mini-games`.

## Companion skills

- `designing-mini-games` — use instead when the brief allows two or more buttons.
- `directing-game-visuals` — the next step once mechanics are stable.

## Core Rules (one-button-specific)

- One binary input only — tap (press), hold, or release. No second key, no chord, no swipe.
- Game-over is single, visually obvious, and follows from a hazard or world-state collapse — never from a "did not press" punishment.
- Mashing, hold-only, and idle play must each be strictly worse than skilled play.
- Score must come from in-world causality (close calls, precise timing, chain reactions), not raw input facts (taps per second).

## Design Procedure

1. **Free Association**: verbalize the first images and sensations the input or seeds evoke. *If the seeds visibly contradict each other (e.g. `on_pressed:jump` + `on_pressed:shoot`), read `references/one-button-design-guide.md` §7 (Tag / Prompt Contradiction = Creative Tension) before continuing — do not pick one and discard the other.*
2. **Deviation Exploration**: consider opposites, negations, and extremes; push toward unexpected directions.
3. **Core Experience Decision**: define the momentary sensation the player should feel, in a single phrase.
4. **Mechanics Construction**: design the single tap / hold / release that realizes that sensation.
5. **Consistency Verification**: run the checklist below.

> Treat seeds as stimulus for steps 1–2. From step 3 onward, do not be bound by them. A finished design that no longer references the original tags is fine.

## Design Quality Checklist

- [ ] Does it complete with one button (no second input required)?
- [ ] Is the game-over condition single and visually obvious?
- [ ] Is button mashing / hold-only / idle play strictly suboptimal? **The deliverable should state, per input mode, why that mode is suboptimal — this is content for the implementer, not a self-check the designer keeps in their head.**
- [ ] Can you give a reasoned answer to all four principles in §2 of the reference guide?
- [ ] Did the idea start from the seed but contain elements beyond it?
- [ ] Is there a "I've never seen this before" moment?
- [ ] Is this **not** a clone or minor variation of a widely-known existing game?
- [ ] **For new-design tasks**, does the document follow the structure in `references/one-button-design-guide.md` §8 (name + slug, seeds, core mechanics, state/tradeoff, object specs, design principle analysis, basis for novelty, similarity check)?

## References

- `references/one-button-design-guide.md` — self-contained design vocabulary for one-button games: four core principles, input/movement/environment tables, state/tradeoff checks, abstract-question prompts, contradiction-as-tension table, recommended output format, and SCAMPER appendix.
