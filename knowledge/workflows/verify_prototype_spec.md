# Verify Prototype CLI Specification (Draft)

## Command
`npm run verify-prototype -- --slug <slug> [--mode lint|sim|full|novelty|ga] [--seed <number>]`

## Responsibilities
1. Resolve prototype directory: require `tmp/prototypes/<slug>/` and `tmp/prototypes/<slug>/game.js` to exist.
2. Mode handling:
   - `lint` (default): run `node scripts/check_game_style.js <slug>` focusing on syntax and style.
   - `sim`: execute monotonous input testing via `node scripts/test_game_framework.js <slug>` to capture telemetry.
   - `full`: run lint + sim sequentially and aggregate results.
   - `novelty`: run full + novelty metrics calculation.
   - `ga`: run lint + sim-ga (GA-optimized input pattern evaluation using genetic algorithm) and aggregate results.
3. Aggregate output:
   - Write concise summary to stdout.
   - Persist detailed log to `tmp/prototypes/<slug>/verify_report.md` including timestamp, command, mode, pass/fail, metrics snapshot.
4. Metrics capture:
   - Track `framesSimulated`, `avgScore`, `fallEvents`, `warnings` within simulation log (placeholder fields for now).
   - Append CSV row to `knowledge/metrics/tag_combo_history.csv` with columns `[date, tags, slug, outcome, notes, ga_best_score, ga_resistance]` when available.
   - GA mode automatically records `ga_best_score` (best score achieved by evolved pattern) and `ga_resistance` (Low/Moderate/High vulnerability level).

## Error Handling
- Missing prototype files ⇒ fail with actionable message.
- Unsupported mode ⇒ list valid options.
- Simulation failure ⇒ exit non-zero, note failure reason in report.

## Logging
- Append run meta to `knowledge/logs/<YYYYMMDD>-verify-prototype.md`.

## Prerequisites
- Implement helper scripts `scripts/check_game_style.js` and `scripts/simulate_game.js` (placeholders acceptable initially).
- Define telemetry JSON schema for simulator output to keep report formatting predictable.

## Outstanding Questions
- Can style lint reuse ESLint or should a lightweight custom checker be created?
- Simulation fidelity vs. cost; decide whether to stub random seeds or full physics.
- How to integrate human review feedback into verify report (append vs. separate file).
