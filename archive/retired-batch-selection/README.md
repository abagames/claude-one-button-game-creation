# Retired Batch Selection Workflow

This directory preserves the former post-generation workflow for historical
reference. It was retired on 2026-07-18 when the project's standard flow was
simplified to generating, smoke-testing, and presenting a batch of ten games.

The files here are **not normative** and must not be used automatically after
generation. Ranking, winner selection, human comments, Polish, retrospective,
or publication are separate, explicitly requested work.

- `game-selection.md` preserves the former selection, human-play, Polish, and
  retrospective procedure.
- `game-selection-workflow-history.md` preserves the decisions and experiments
  that shaped that procedure.
- `templates/state/` and `scripts/init_state.js` preserve its former blank
  continuation-state contract and initializer. They are archived artifacts,
  not current project setup steps.
- `scripts/observe_game.mjs` preserves the deterministic browser interaction
  recorder used by the retired observation and mechanic-verification work.
- `scripts/evaluate_games.js`, `scripts/evaluate_prediction_utility.js`,
  `scripts/verify_tester_patches.js`, and `scripts/tester/` preserve the former
  Stage-1 evaluator, prediction checkpoint, simulator guard, and GA/tester
  implementation. They are not part of the current generation workflow.
