# Local tester fork contract

The files in this directory are vendored project infrastructure, not a cache.
Do not replace them from the upstream archive without reapplying and verifying
the compatibility points below.

`crisp_game_adapter.js` intentionally differs from the archived upstream
tester in three browser-parity behaviors:

1. `rndi(max)` normalizes to `min = 0`, `max = max` before calling the
   simulator's inclusive `randomInt(min, max - 1)`.
2. Objects returned by `vec()` implement mutating, chainable
   `.clamp(xLow, xHigh, yLow, yHigh)` and
   `.wrap(xLow, xHigh, yLow, yHigh)` methods.
3. Adapter/game/global `difficulty` starts at `1` and evolves as
   `1 + floor(ticks / 3600)`, matching crisp-game-lib. It must never start at
   zero.

After any tester download, merge, or replacement, run from the project root:

```bash
node scripts/verify_tester_patches.js
```

The guard executes a one-frame fixture through the real adapter and simulator;
it is not a source-text check. A failure blocks Stage 1 until the behavior in
`crisp_game_adapter.js` is restored. The canonical API expectations are in
`.agents/skills/developing-with-crisp-game-lib/references/api.md`.
