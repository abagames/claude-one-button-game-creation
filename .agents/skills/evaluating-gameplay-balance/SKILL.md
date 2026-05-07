---
name: evaluating-gameplay-balance
description: "Evaluates and improves gameplay balance from telemetry in any engine. Use when comparing monotonous vs exploratory play, diagnosing death/spawn/scoring/input issues, or proposing structural balance fixes instead of numeric tuning."
---

Use this skill to analyze whether a game rewards skillful play and to propose structural improvements.

Engine-neutral contract:
- Produce comparable runs for monotonous policies and exploratory policies.
- Define the public input schema and visible-state features available to policies.
- Keep seeds, tick rate, max duration, policy definitions, search budget, and aggregation logic comparable across runs.
- Record score, elapsed time, end state, and telemetry for death, spawn, scoring, and input behavior.
- Compute `exploratory_ratio = exploratory.best.score / monotonous.max_score`.
- Treat the ratio as a quality detector, not an optimization target.

Experience guardrails:
- Reject changes that degrade play experience even if metrics improve.
- Score only in-game causal events; do not award points for raw input facts.
- Game-over should be tied to hazards or world-state collapse.
- Do not add hidden behavior that only helps or hurts test agents.
- Avoid numeric-only tuning, branch-only fixes, and added randomness as the primary answer.

Workflow:
1. Locate an existing simulation harness. If none exists, design one using the harness contract before judging balance.
2. Run comparable monotonous and exploratory policies with deterministic seeds.
3. Validate that the report includes run configuration plus death, spawn, scoring, and input telemetry.
4. If telemetry is incomplete, report the gap and request instrumentation/rerun instead of judging balance from score alone.
5. Analyze death, spawn, scoring, and input patterns.
6. Identify root causes in rules or generation logic.
7. Propose at least three candidate fixes with expected impact, risk, and complexity.
8. Re-test with the same policies, seeds, budgets, and aggregation after implementation.

Read these references as needed:
- `references/simulation-harness.md` for designing deterministic simulators, input policies, and telemetry emitters.
- `references/log-contract.md` for the engine-neutral telemetry schema.
- `references/improvement-analysis.md` for analysis perspectives and report templates.
- `references/balance-patterns.md` for structural balance patterns.
- `references/godot-implementation-notes.md` for translating common balance fixes into Godot/GDScript.

## Companion skills

- For Godot projects, use `scaffolding-godot-mini-games` for project setup and `running-headless-godot` for simulator execution, tests, logs, and export checks.
- Structural fixes that touch rules feed back into `designing-mini-games` / `designing-one-button-games`; do not silently re-tune numbers without revisiting the design.
