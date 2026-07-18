# Claude One-Button Game Creation

This project generates batches of compact, browser-playable one-button games
with [crisp-game-lib](https://github.com/abagames/crisp-game-lib). Agents turn
random tag combinations into ten independent game designs and implementations,
verify that each game runs in a browser, and present the batch without ranking
it.

See [GAMES.md](./GAMES.md) for published examples and screenshots. Published
builds under `docs/` are curated separately and may be changed only by explicit
human instruction.

## Setup

```bash
npm ci
npm run skills:install
npm run playwright:install
```

The skills command copies this project's three required skills from
[`abagames/agentic-gamedev-skills`](https://github.com/abagames/agentic-gamedev-skills)
into `.agents/skills/`. That directory is local setup output and is not tracked.
Run `npm run skills:check` to verify the installation. To intentionally use a
different upstream revision, set `AGENT_SKILLS_REF` to its commit SHA when
running `npm run skills:install`.

No batch state needs to be initialized for generation.

## Generate a batch

The normative one-game procedure is
[`workflows/game-generation.md`](./workflows/game-generation.md). Read it in
full, then execute it ten times.

Before starting, confirm that `tmp/games/` does not contain a batch that must
be preserved. Do not delete, replace, or archive existing games without user
direction.

For each game:

1. Start a fresh generation context.
2. Select three fresh tags:

   ```bash
   node scripts/random_tag_selector.js -n 3 -f text
   ```

3. Design and implement one game according to the workflow.
4. Write its three deliverables under `tmp/games/<slug>/`.

Repeat until the batch contains exactly ten new games. Each context works only
on its own game; it does not read or rank the rest of the batch.

## Verify the batch

Run the real-browser smoke test for all ten games:

```bash
for g in tmp/games/*/index.html; do
  node .agents/skills/smoke-testing-web-games/scripts/smoke-test.mjs "$g" || echo "FAIL: $g"
done
```

Repair any runtime failure and re-run its smoke test. Smoke testing verifies
that the games can be presented; it does not measure quality or compare games.

## Present and stop

Present an unranked list of the ten slugs and their `README.md` files. The
standard workflow ends there.

The following require a separate, explicit request and are not automatic
continuation steps:

- comparative evaluation or defect annotation;
- human ranking, comments, selection, or winner records;
- tuning or Polish;
- retrospective analysis;
- copying or publishing a game under `docs/`.

## Output contract

```text
tmp/games/<slug>/
├── index.html    # Browser entry point
├── main.js       # Game implementation
└── README.md     # Six-section design description
```

The batch is complete when `tmp/games/` contains ten new game directories and
all ten browser smoke tests pass.

## Repository layout

| Directory | Role |
| :-- | :-- |
| `workflows/` | Normative one-game generation procedure |
| `data/` | Static tag inputs |
| `scripts/` | Tag selection and supporting utilities |
| `.agents/skills/` | Locally installed design, implementation, and smoke-test skills |
| `scripts/install_agent_skills.sh` | Installer for the required upstream skills |
| `tmp/games/` | Current generated batch |
| `docs/` | Human-directed published builds; outside generation |
| `archive/` | Retired, non-normative workflows and historical material |

## Archived workflow

The former generate→evaluate→human-select→Polish process is preserved under
[`archive/retired-batch-selection/`](./archive/retired-batch-selection/) for
historical reference. It is not part of the current generation flow and must
not be started automatically after a batch is presented.
