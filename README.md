# Claude One-Button Game Creation

This project explores how far LLM agents can automate the creation of compact
one-button action mini-games.

The target game format is deliberately small: browser-playable games built with
[crisp-game-lib](https://github.com/abagames/crisp-game-lib), controlled by one
binary input such as tap, hold, or release. The research goal is not only to
generate code, but to make agents design rules, implement them, test whether
skilled play beats monotonous input, and improve weak designs from simulation
feedback.

See [GAMES.md](./GAMES.md) for playable examples and screenshots.

## Current Workflow

The active pipeline is the zero-touch workflow documented in
[archive/for_zero_touch/CLAUDE.md](./archive/for_zero_touch/CLAUDE.md).

1. Select random tags from `archive/for_zero_touch/tags.csv` as creative seeds.
2. Design a one-button action game from those seeds.
3. Implement the game in `tmp/games/<slug>/` using crisp-game-lib (~150 lines).
4. Evaluate with GA-based simulation via `archive/for_zero_touch/scripts/ga_tester.js`.
5. If the GA ratio is below threshold, diagnose from the verbose log and improve;
   repeat up to 3 times.

All generation scripts and reference guides live under `archive/for_zero_touch/`.
To start a new game, instruct the agent: **"Create a game"**.

## Archived Approaches

Earlier workflow designs are preserved under `archive/`. They share the same
broad goal but explore different ways to automate or support one-button game
creation.

### [archive/for_chat/](./archive/for_chat/)

The human-LLM collaboration approach.

It frames one-button game creation as a guided conversation: the LLM proposes
and implements, while the human validates problem definitions, innovation level,
playability, balance, and final experience at explicit checkpoints. Its guides
emphasize problem-first design, SCAMPER-style ideation, conceptual walkthroughs,
and feedback-driven implementation.

This approach is useful when human judgment is part of the design loop and the
goal is to produce clearer ideas through discussion rather than fully automated
generation.

### [archive/for_web/](./archive/for_web/)

The mobile-first Web development approach.

It centers on a `dev/` workspace, TypeScript, Vite, Netlify branch deploys, and
GitHub Pages publication. The workflow is organized into six phases: tag
selection, problem-solution structuring, novelty assurance, prototype
implementation, validation and balance tuning, then publication. It was designed
so Claude Code on the web could create and test playable prototypes with minimal
typing from a smartphone, while still allowing later PC polish.

This approach is useful when the key problem is fast browser deployment and
real-device playtesting, not just local game generation.
