# claude-one-button-game-creation

An automatic one-button game generation project using crisp-game-lib. Agents
use random tags as inspiration to design and implement a varied batch of ten
browser-playable games.

The standard workflow ends when ten runnable games are presented. Ranking,
selection, human review, Polish, retrospective, publication, and play-log
mechanical evaluation are separate activities and require an explicit user
request.

---

## Working Directory

Run all commands from the project root (the directory containing this file).

- Generation workflow: `./workflows/game-generation.md`
- Scripts: `./scripts/`
- Static tag inputs: `./data/`
- Generated games: `./tmp/games/`

On a fresh clone, run:

```bash
npm ci
npm run skills:install
npm run playwright:install
npm test
```

`skills:install` copies only the skills required by this project from
[`abagames/agentic-gamedev-skills`](https://github.com/abagames/agentic-gamedev-skills)
into the ignored local `.agents/skills/` directory. It replaces only those
three skill directories and preserves other content under `.agents/`. To
refresh intentionally, run the command again; set `AGENT_SKILLS_REF` to the
desired upstream commit. The generation workflow has no durable-state
initialization requirement.

---

## Standard Flow: Generate and Present Ten Games

1. Confirm `tmp/games/` is absent or empty. If it contains anything, stop and
   ask the user what to do. Do not delete, overwrite, move, or archive existing
   output without explicit user direction.
2. Run `workflows/game-generation.md` once per game with a fresh generation
   context and fresh tag seed.
3. Repeat until `tmp/games/` contains exactly ten new games.
4. Smoke-test every game's `index.html` in a real browser. Repair runtime
   failures and re-run the failed smoke test.
5. Present the ten games as an unranked list and stop.

Each game must be generated independently. A game-generation context may read
the generation workflow, the relevant skills, its own tags, and its own output,
but must not compare against other games in the batch or attempt to select a
winner.

Use this command once per game to obtain tags:

```bash
node scripts/random_tag_selector.js -n 3 -f text
```

Validate the completed batch and smoke-test every game with:

```bash
npm run batch:check
```

The command must exit successfully. It enforces exactly ten game directories,
the three required files in each directory, and a passing real-browser smoke
test for every `index.html`.

Smoke testing is part of generation completion because the presented games
must run. Comparative measurement, defect panels, ranking, winner ledgers, and
Polish are not part of this flow.

**Publication is always separate and human-authorized.** Never copy, move, or
sync a generated game into `docs/` unless the user explicitly requests that
publication action.

---

## Optional: Play-Log Mechanical Evaluation

`evaluation/` is a self-contained workflow that measures four mechanical
criteria from private play logs executed in a fresh Node VM. It is **optional,
runs only on explicit user request, and is never a gate on generation.** Never
start it as a follow-up to finishing a batch.

- Procedure: `workflows/game-evaluation.md`
- Setup: `npm run eval:setup` (installs and tests inside `evaluation/`)
- `evaluation/` keeps its own `package.json` and lockfile; do not merge it into
  the root dependency tree

Its output is play-log mechanical quality only. It says nothing about fun,
fairness, intuitiveness, appearance, audio, or runtime compatibility, and a game
the instrument could not measure is reported as `not_rankable`, never as a low
score. Evaluating one game costs about a full working session, so evaluate two
or three games first and scale only after that.

---

## Documents

| File | Purpose |
| :--- | :--- |
| `README.md` | Operational entry point for generating and presenting a batch |
| `workflows/game-generation.md` | Normative procedure for creating one game |
| `workflows/game-evaluation.md` | Optional post-batch play-log mechanical evaluation |
| `data/tags.csv` | Static tag seed catalog |
| `scripts/install_agent_skills.sh` | Install the three required upstream skills into local `.agents/skills/` |
| `scripts/check_batch.js` | Enforce the ten-game deliverable contract and run every browser smoke test |
| `evaluation/` | Self-contained simulator-only play-log evaluation workflow (normative docs inside) |
| `archive/retired-batch-selection/` | Non-normative former selection and Polish workflow |

Archived material is historical context only. It must not be treated as a
continuation step after generating a batch.

---

## Deliverables

```text
tmp/games/<slug>/
├── index.html
├── main.js
└── README.md
```

The complete batch deliverable is ten directories in `tmp/games/`, plus a
successful browser smoke test for each game. `tmp/` is working output and does
not authorize publication.
