# AGENTS.md

This file guides coding agents (e.g., Codex CLI, Cursor, Claude, etc.) working in this repository. It replaces brand-specific instructions and unifies the workflow for one‑button game design and implementation.

## Scope

- Applies to the entire repository rooted here. If a directory contains its own `AGENTS.md`, that file takes precedence within that sub-tree.

## Read Before Execution

Primary references (read in order):

- `cc_knowledge/one-button-game-design-guide.md`
- `cc_knowledge/one-button-game-implementation-guide.md`
- `cc_knowledge/crisp-game-lib-guide.md`

Supplemental references (use for API details and examples):

- `cursor_knowledge/game-design-guide.md`
- `cursor_knowledge/crisp-game-lib.d.ts`
- `cursor_knowledge/crisp-game-lib-readme.md`
- `cursor_knowledge/crisp-game-lib-index.html`
- `cursor_knowledge/crisp-game-lib-main.js`
- `cursor_knowledge/sample-games/pinclimb.md` (patterns only; do not constrain creativity)

Guides are the source of truth: prefer `cc_knowledge` and use `cursor_knowledge` for API specifics and examples.

Verification before proceeding:

- You can explain one‑button control patterns (press/hold/release) and their applications.
- You understand environment types and movement patterns from the design guides.
- You can outline the crisp‑game‑lib update loop, input API, drawing APIs, collision flow, and vectors.

## Core Principles

- One‑button constraint: input is button state only (details in Technical Constraints); do not use pointer position.
- 3‑second rule: core mechanic is understandable within 3 seconds.
- Problem‑first: start with a clear player problem and solution logic.
- Innovation via SCAMPER and intuitive physical phenomena.
- Human experience validation through quick playtests at defined checkpoints.

## Collaboration Protocol

Design (concept to implementation‑ready spec):

- LLM auto‑processes templates and constraints; human validates at key checkpoints: problem definition, innovation scope, walkthrough, and readiness.

Implementation (code to polish):

- Avoid timeboxing language; optimize for clarity and quick iteration instead.

### Mandatory Human Checkpoints (Blocking Gates)

- Gate A — Theme Validation (Design Guide Phase 0 / §0.2.1):
  - Agent MUST present the Phase 0 validation prompts and STOP until human explicitly approves a theme.
- Gate B — Problem–Solution Validation (Phase 1 / Steps B & D):
  - Agent MUST present the problem template and simple solution logic prompts and STOP until human confirms.
- Gate C — Control Mapping Confirmation (Phase 1 / Step E):
  - Agent MUST propose exact press/hold/release mapping and STOP until human confirms.
- Gate D — Minimal Implementation Start:
  - Only after A–C approved may the agent scaffold files or write code.

Notes:

- If human requests to “skip and proceed”, agent records this explicitly in the conversation and continues.
- Use concise prompts lifted from `cc_knowledge/one-button-game-design-guide.md`.

## Implementation Workflow

Directory layout for games:

- `tmp/games/<game-name>/index.html` (complete setup with crisp‑game‑lib)
- `tmp/games/<game-name>/main.js` (game logic)

Phases:

1. Minimal implementation (prove reachability and basic loop)
2. Core mechanics (objective, feedback, fail/success loop)
3. Final polish (readability, juice, minor balance)

Rules:

- Keep a single active version; adjust parameters from play feedback. Avoid presenting multiple competing versions.
- Ensure each created game is directly playable in a browser.

### HTML Template (crisp‑game‑lib)

- `tmp/games/<game-name>/index.html` must be a verbatim copy of `cursor_knowledge/crisp-game-lib-index.html`.
- The only allowed change is the `<title>`. Do not change script order, attributes, or styles.
- Required script order (fixed, do not alter):
  1. `https://unpkg.com/sounds-some-sounds@3.1.1/build/index.js`
  2. `https://unpkg.com/pixi.js@5.3.0/dist/pixi.min.js`
  3. `https://unpkg.com/pixi-filters@3.1.1/dist/pixi-filters.js`
  4. `https://unpkg.com/crisp-game-lib@1.4.0/docs/bundle.js`
  5. `main.js`
  6. `window.addEventListener("load", onLoad);`
- Keep the body empty (`<body style="background: #ddd"></body>`). Do not add your own `<canvas>` or hint DOM; the library creates and manages canvas.
- Do not swap CDNs or versions (e.g., `abagames.github.io/.../main.js`). Library updates require human approval and must update the template and games together.

#### HTML Template Compliance Check

- Before development: verify script list and order, `onLoad`, and empty `<body>`.
- At Gate D (scaffold time): re‑check compliance; if non‑compliant, do not proceed.

Plan usage:

- Maintain a visible plan listing Gates A–D. Mark A–C as approved before “Scaffold” and “Minimal loop”.

## Technical Constraints (crisp‑game‑lib)

- Input: use `input.isPressed`, `input.isJustPressed`, `input.isJustReleased`. Do not use `input.pos`.
- Drawing/collision: draw first, then use returned collision info (e.g., `box(...).isColliding.rect.<color>`). There are no `isColliding.circle/arc/line` keys.
- Vectors/utilities: use `vec()`, `rnd()/rndi()/rnds()`, `clamp()`, `wrap()`, and math helpers as documented.
- Style: functional approach, no classes; manage state globally as per guides.
- Names: avoid variable names that shadow library identifiers (e.g., `rect`, `arc`, `box`, `line`, `text`, `color`, `input`, `vec`).
- Defaults: library provides `score` and `difficulty`; declare only if the guide requires overrides.
- Frame model: 60fps update; treat screen as 100×100 unless guide specifies otherwise.

### HTML Template Constraints (Do Nots)

- Do not add `<script type="module">` or `defer` (stick to the template).
- Do not add custom loaders or other frameworks.
- Do not add UI text in DOM; if needed, draw instructions using the game drawing APIs (e.g., `text()`).

Forbidden complexity for mini‑games (keep rules simple):

- Power‑ups; rhythm systems; mazes
- Energy/fuel/time limits; dynamic difficulty
- Elaborate scoring or win/lose meta‑systems beyond basics

## Design Checklist (per game)

- Distinct control mechanic and environment type (avoid duplicating recent games in a set).
- Clear objective verb (avoid, collect, match, traverse, etc.).
- Max 3 object types, each with properties, initial state, shape, color, behavior, collisions, spawn/scroll rules.
- One‑button controls mapped explicitly to press/hold/release.

## Documentation Editing

- Preserve numbered sections.
- Keep examples and checklists actionable; maintain cross‑references.
- When updating, prefer clarifying edits over adding new concepts.

## When In Doubt

- Prefer a single, testable implementation with quick play feedback over branching ideas.
- Ask for human checkpoints when problem clarity or feasibility is uncertain.
