---
name: smoke-testing-web-games
description: "Smoke-tests a browser game build by loading it in a headless browser, letting it idle, then sending input bursts, and failing on any console error, uncaught exception, or page crash. Use as a machine gate after implementing or changing a web game, especially to catch code that passes mock or simulator tests but crashes in a real browser. Checks runtime health only — it does not evaluate gameplay quality or balance. Requires Node 18+ and Playwright with Chromium available in the target project."
---

# Smoke-Testing Web Games

Use this skill to machine-check that a web game actually runs in a real browser: no console errors, no uncaught exceptions, no crashes — while idle and while receiving input.

## Why This Gate Exists

Mock- or simulator-based tests share an environment gap with the browser: a mock may define helper globals the browser lacks, stub out APIs, or never execute input handlers. Code can pass every simulated test and still throw on the first real frame or the first real tap. The input phase matters: a bug living in an input handler is invisible to idle-only checks (the bundled fixtures demonstrate exactly this).

## Scope

- **In scope**: page loads, runs idle without errors, and survives taps, holds, and key presses.
- **Out of scope**: gameplay quality, balance, difficulty, visual correctness, and performance. A PASS means "the build runs", not "the game is good". For spec-conformance checks of individual mechanics (state transitions, scoring formulas), use `probing-web-game-mechanics` instead; silent failures that produce no error (e.g. audio that no-ops when a dependency is missing) also pass this gate and need their own runtime check.

## Requirements

- Node 18+.
- Playwright with Chromium, installed in the project under test (the script resolves `playwright` from the directory it is run in): `npm i -D playwright && npx playwright install chromium`.
- Network access if the page loads scripts from a CDN; a failed script load surfaces as a captured console error.

## Usage

Run from the game project directory:

```bash
node <skill-dir>/scripts/smoke-test.mjs path/to/index.html            # defaults: 3s idle, 6s input
node <skill-dir>/scripts/smoke-test.mjs http://localhost:5173 --idle 5 --input 10
```

Phases, in order:

1. **load** — navigate and wait for the `load` event; a navigation failure is an immediate FAIL.
2. **idle** — run untouched, catching startup and per-frame errors.
3. **input** — repeated bursts of scattered taps, a Space key press, and a hold-and-release, with pauses between bursts so timers and spawns advance.

Each captured error is printed with its phase (`[input] pageerror: sign is not defined`), which localizes the bug class: `load` failures are setup/dependency problems, `idle` failures are startup or frame-loop bugs, `input` failures live in input handlers or the states they trigger.

Exit codes: `0` pass, `1` errors detected or page failed to load, `2` harness problem (Playwright missing, bad arguments).

## Notes and Failure Modes

- Serve over HTTP instead of `file://` if the game uses ES modules, fetch, or other origin-restricted features (e.g. `npx serve` or the project dev server).
- The input schedule is generic (pointer + Space + arrow-key taps and a short arrow hold). If the game only reacts to other keys, extend the input phase or treat key coverage as untested.
- A clean PASS on a page that failed to start its game loop is possible only if the page also emitted no errors; pair this gate with whatever gameplay-level checks the project already has.
- Flaky CDN or ad-hoc network errors show up as `console.error` in the `load`/`idle` phase; rerun before treating them as game bugs.

## Self-Test

The fixtures under `assets/fixtures/` verify the harness itself:

```bash
node scripts/smoke-test.mjs assets/fixtures/fixture-ok.html                        # expect PASS, exit 0
node scripts/smoke-test.mjs assets/fixtures/fixture-input-crash.html               # expect FAIL, exit 1
node scripts/smoke-test.mjs assets/fixtures/fixture-input-crash.html --input 0     # expect PASS: idle-only misses input bugs
```

`fixture-input-crash.html` reproduces the "passes idle, crashes on input" class: its input handler calls a global only a test mock would define.

## Origin

The approach — a Playwright-driven check using short input bursts with intentional pauses and console-error inspection — is adapted from the `develop-web-game` skill in [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates), narrowed here to a hook-free smoke gate.
