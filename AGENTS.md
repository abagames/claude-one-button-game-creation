# claude-one-button-game-creation

An automatic one-button game generation project using crisp-game-lib. Agents
use random tags as inspiration to design and implement a varied batch of ten
browser-playable games.

The standard workflow ends when ten runnable games are presented. Ranking,
selection, human review, Polish, retrospective, and publication are separate
activities and require an explicit user request.

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
```

`skills:install` copies only the skills required by this project from
[`abagames/agentic-gamedev-skills`](https://github.com/abagames/agentic-gamedev-skills)
into the ignored local `.agents/skills/` directory. To refresh intentionally,
run the command again; set `AGENT_SKILLS_REF` to the desired upstream commit.
The generation workflow has no durable-state initialization requirement.

---

## Standard Flow: Generate and Present Ten Games

1. Confirm `tmp/games/` is available for a new batch. Do not delete or
   overwrite an existing batch without explicit user direction.
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

Smoke-test the completed batch with:

```bash
for g in tmp/games/*/index.html; do
  node .agents/skills/smoke-testing-web-games/scripts/smoke-test.mjs "$g" || echo "FAIL: $g"
done
```

Smoke testing is part of generation completion because the presented games
must run. Comparative measurement, defect panels, ranking, winner ledgers, and
Polish are not part of this flow.

**Publication is always separate and human-authorized.** Never copy, move, or
sync a generated game into `docs/` unless the user explicitly requests that
publication action.

---

## Documents

| File | Purpose |
| :--- | :--- |
| `README.md` | Operational entry point for generating and presenting a batch |
| `workflows/game-generation.md` | Normative procedure for creating one game |
| `data/tags.csv` | Static tag seed catalog |
| `scripts/install_agent_skills.sh` | Install the three required upstream skills into local `.agents/skills/` |
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
