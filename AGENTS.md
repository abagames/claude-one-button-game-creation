# claude-one-button-game-creation

An automatic one-button game generation project using crisp-game-lib. LLM
designs, implements, and improves games using tags as seeds for
inspiration, then selects the best of each batch for human play.

---

## Working Directory

Run all commands from the **project root** (the directory containing `AGENTS.md`).

- Scripts: `./scripts/`
- Workflows: `./workflows/`
- Local durable state: `./state/` (gitignored; initialized from `./templates/state/`)
- Static inputs: `./data/`
- Generated games: `./tmp/games/`

On a fresh clone, run `npm ci`, `npm run playwright:install`, then
`npm run init:state`. This creates an independent lineage beginning at Batch 1.
The initializer never overwrites existing state, so this working copy keeps
continuing its own local batches while clones start cleanly.

---

## Top-Level Flow (Generate Many, Human Selects)

```
1. Generate a batch of 10 games    workflows/game-generation.md, once per game
2. Select the winners              workflows/game-selection.md (Stages 1–3)
3. Polish winners only             workflows/game-selection.md (Polish section)
4. Retrospective                   workflows/game-selection.md (Batch runbook, step 9)
```

1. **Generate**: run `workflows/game-generation.md` (tag selection → design
   → implementation) once per game with fresh tag seeds until the batch
   has **10 games**. Each game lands in `tmp/games/<slug>/`
   (`index.html`, `main.js`, `README.md`). Use a fresh generation context
   per game that has not read selection-derived state (`state/taste-corpus.md`,
   retrospectives, winners, or Stage-2/3 reports); this enforces the
   one-way rule without adding generation criteria.
2. **Select**: run `workflows/game-selection.md` — automated measurement
   (`node scripts/evaluate_games.js`), isolated LLM judges producing
   defect annotations + an informational taste-calibrated ranking
   (calibrated on `state/taste-corpus.md`), then the human plays the
   FULL batch in an order independent of Stage 2, without seeing its
   prediction; the human's ordering is the selection. Stage 2 runs
   **two-pass**: annotate for implementation bugs, fix them, re-measure,
   only then collect the predicted ranking against the fixed builds.
3. **Polish**: bounded tuning for the human-chosen winners only.
4. **Retrospective**: after every batch, close the runbook by checking
   the ρ trend (predicted ranking vs human ordering, across batches)
   and recording evidence/hypotheses in `state/batch-retrospective.md`.
   Adopted SELECTION changes go into `workflows/game-selection.md` with
   rationale in its history file. Per the one-way rule, this may change
   Stage-2 judging practice, never `workflows/game-generation.md`.

**Publication is a separate human-authorized action.** Selecting or polishing
a winner authorizes only the `state/winners.md` ledger update and local batch
work under `tmp/`. Never copy, move, or sync a game into `docs/` unless the
human explicitly instructs that promotion.

**The connection is one-way.** Generation optimizes for variance (diverse,
novel games); selection optimizes for quality, downstream. Selection
results — verdicts, flags, human feedback — feed Stage-2 judging criteria,
never gates or rules in the generation workflow.

This one-way rule bounds workflow refinement too: the
`refining-workflows-from-artifacts` skill may be applied to
`workflows/game-selection.md` (Polish section, Stage 1/2 procedures) and to
the skills themselves, but **never to `workflows/game-generation.md`**. If
the skill proposes a diff to the generation workflow, reject it as G
(overconstraint) — lessons flow into Stage-2 criteria only (validated
ρ = −0.30 → +0.68 across batches 1–2).

---

## Documents

| File | Purpose |
| :--- | :--- |
| `README.md` | Operational entry point — the full generate→select→polish→retrospective flow with the exact commands and files each step touches. Start there to run a batch. |
| `workflows/game-generation.md` | How to create ONE game (Phase 1 tags → Phase 2 design → Phase 3 implementation), incl. tester-compatibility constraints |
| `workflows/game-selection.md` | How to pick winners from a batch (measurement → LLM annotation → human play → polish → retrospective), incl. the Batch runbook and instrument caveats |
| `state/winners.md` | The winners ledger: which games cleared the cutoff each batch, polish status, and the cutoff rule itself (rank down from #1 while the human's comment stays positive) |
| `history/game-selection-workflow-history.md` | Decision history — rationale and validation data behind the current rules in `workflows/game-selection.md`; historical only, gates nothing |
| `state/BACKLOG.md` | Open operational tasks and unresolved decisions only; completed history belongs in eval artifacts/history |
| `state/prediction-validation.json` | Structured clean-batch input for the pooled prediction checkpoint |
| `templates/state/` | Tracked blank state used by `npm run init:state` for an independent Batch 1 |
| `data/tags.csv` | Static tag seed catalog used by `scripts/random_tag_selector.js` |
| `.agents/skills/designing-mini-games/` | Canonical mini-game design craft; this project always binds it to `button_types = 1` |
| `.agents/skills/developing-with-crisp-game-lib/` | Canonical crisp-game-lib knowledge; `references/api.md` is the ONLY API surface games may use |
| `.agents/skills/smoke-testing-web-games/` | Headless-browser smoke test used in Stage 1, before automated measurement |
| `.agents/skills/implementing-gameplay-invariants/` | Exploit-proofing (idle/hold/spam-proofing) applied to winners at Polish only — never at generation time |
| `.agents/skills/maximizing-game-feel/` | Game-feel polish for winners at Polish, run in lightweight mode (skip the skill's document deliverables) |

Former root guides (`one-button-game-design-guide.md`,
`crisp-game-lib-guide.md`) are archived in `./archive/` — the skills above
superseded them. Project-specific constraints (tester compatibility, output
contract) stay in the workflow files, NOT in the skills.

---

## Deliverables

```
tmp/games/<slug>/
├── index.html    # HTML template
├── main.js       # Game code
└── README.md     # Game description
```

Per-batch evaluation outputs land in `tmp/eval/` (`stage1.{json,md}`,
`stage2*.md` / `stage3*.md`). Durable cross-batch state lives only under
`state/`: `state/taste-corpus.md` (every past
batch's human ordering + notes — how Stage-2 judges are calibrated),
`state/batch-retrospective.md` (the ρ trend, observations, and hypotheses
from each batch's retrospective step), `state/winners.md` (the cutoff
decision and polish status per batch), `state/prediction-validation.json`
(clean-batch ranking validation input), and `state/BACKLOG.md` (open work).
The runtime `state/` is local and gitignored; `templates/state/` is the tracked
clean-start contract. Adopted rationale lives under `history/`. `tmp/` is working evidence, not
continuation state: after a batch is fully closed and the durable files above
are updated, deleting `tmp/` must not prevent starting the next batch. Past
game archives are needed only for explicit revive work.
