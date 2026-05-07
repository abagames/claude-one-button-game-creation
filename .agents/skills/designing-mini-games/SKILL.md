---
name: designing-mini-games
description: "Designs compact, playable game rules and controls. Use when defining a new mini-game concept, converting creative constraints into mechanics, checking state-variable necessity, or preventing idle/mashing from becoming optimal."
---

Use this skill to turn a small game idea or creative constraints into clear mechanics.

Core rules:
- Keep the core experience expressible in one sentence.
- Design controls before adding secondary systems.
- Add a state variable only when it creates a player decision that existing rules cannot express.
- Every state variable needs a non-HUD manifestation in the world: behavior, terrain, shape, speed, sound, color, or animation.
- Scoring must come from in-world event causality, not raw input facts.
- Game-over should follow from hazards or world-state collapse, not direct punishment for non-action.

Workflow:
1. Free-associate from constraints or tags if provided, then deliberately deviate from the obvious interpretation.
2. Define controls and the player decision loop.
3. Specify objects, hazards, rewards, and state variables.
4. Check that idle, holding, and button-mashing are not dominant.
5. Document tradeoffs and novelty rationale.

Read `references/mini-game-design-guide.md` when you need detailed interaction patterns, output templates, or the design checklist.
