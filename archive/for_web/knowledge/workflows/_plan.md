# Prototype Loop Preparation Plan

## Objectives
- Establish a repeatable path from prompt output to playable prototype stored under `knowledge/prototypes/<slug>/`.
- Define CLI utilities for scaffolding and verification so every run emits comparable logs.

## Immediate Tasks
1. Design `npm run scaffold -- --slug <slug>` to clone a boilerplate game file into `reference/games/<slug>.js` and seed metadata in `knowledge/prototypes/<slug>/context.md`.
2. Outline required stub assets (e.g., options defaults, sprite placeholders) and document them in the scaffold command help.
3. Draft `npm run verify-prototype -- --slug <slug>` to run linting/static checks plus lightweight simulation hooks.
4. Specify log format for `knowledge/prototypes/<slug>/verify_report.md` including timestamp, command output summary, and pass/fail verdict.
5. Identify first prototype candidate tags based on recent prompt trials and record rationale.

## Open Questions
- Should scaffold reuse an existing game as a base or start from a blank Crisp template?
- Minimum validation required before human review (lint only vs. scripted playtest).
- How to snapshot game state diffs for knowledge reuse without polluting `reference/games/` history.

## Next Checkpoint
- Produce draft CLI specs and review them alongside prompt outputs.
- Once approved, implement scaffold script followed by verification script.
