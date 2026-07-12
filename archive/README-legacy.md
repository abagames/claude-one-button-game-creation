# Claude One-Button Game Creation — Legacy README

> Historical document. This describes the retired zero-touch workflow and is
> not an instruction for current batches. See the repository root `README.md`
> and `workflows/` for the active pipeline.

This project explores how far LLM agents can automate the creation of compact
one-button action mini-games.

The target game format is deliberately small: browser-playable games built with
[crisp-game-lib](https://github.com/abagames/crisp-game-lib), controlled by one
binary input such as tap, hold, or release. The research goal is not only to
generate code, but to make agents design rules, implement them, test whether
skilled play beats monotonous input, and improve weak designs from simulation
feedback.

See [GAMES.md](../GAMES.md) for playable examples and screenshots.

## Retired zero-touch workflow

The active pipeline at the time was the zero-touch workflow documented in
[`for_zero_touch/README.md`](./for_zero_touch/README.md).

1. Select random tags from `for_zero_touch/tags.csv` as creative seeds.
2. Design a one-button action game from those seeds.
3. Implement the game in `tmp/games/<slug>/` using crisp-game-lib (~150 lines).
4. Evaluate with GA-based simulation via
   `for_zero_touch/scripts/ga_tester.js`.
5. If the GA ratio is below threshold, diagnose from the verbose log and
   improve; repeat up to three times.

All generation scripts and reference guides for that workflow lived under
`for_zero_touch/`.

## Earlier approaches

### `for_chat/`

The human-LLM collaboration approach framed one-button game creation as a
guided conversation. The LLM proposed and implemented while the human
validated problem definitions, novelty, playability, balance, and final
experience at explicit checkpoints.

### `for_web/`

The mobile-first Web development approach centered on a `dev/` workspace,
TypeScript, Vite, Netlify branch deploys, and GitHub Pages publication. It was
designed for rapid browser deployment and real-device playtesting.
