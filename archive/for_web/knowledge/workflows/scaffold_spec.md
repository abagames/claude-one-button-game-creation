# Scaffold CLI Specification (Draft)

## Command
`npm run scaffold -- --slug <slug> [--tags tag1,tag2] [--force]`

## Responsibilities
1. Validate slug: lowercase, underscores only, non-empty, and not conflicting with existing `tmp/prototypes/<slug>/game.js` unless `--force`.
2. Derive tags: from `--tags` option or fallback to reading `tmp/trials/<latest>-<slug>.md` to extract `Primary Tags` line.
3. Create directories/files:
   - `tmp/prototypes/<slug>/game.js` seeded from `knowledge/templates/game_base.js`.
   - `tmp/prototypes/<slug>/context.md` containing tag summary, source prompt file, scaffold timestamp.
   - `tmp/prototypes/<slug>/scaffold.log` capturing command parameters and file actions.
4. Update `knowledge/metrics/tag_combo_history.csv` by appending a row flagged `status=scaffolded`.

## Template Requirements
- `knowledge/templates/game_base.js` must expose `title`, `description`, `characters`, `options`, and `update()` skeleton using 2-space indent and semicolons.
- Include placeholder comments for tag-driven sections (e.g., `// TODO: field:bottomless integration`).

## Error Handling
- Missing template file ⇒ abort with instruction to create `knowledge/templates/game_base.js`.
- Existing game file without `--force` ⇒ abort to prevent overwrite.
- Missing prompt trial file when no tags provided ⇒ abort with guidance to supply `--tags`.

## Logging
- Append run details to `knowledge/logs/<YYYYMMDD>-scaffold.md`.
- Include timestamp, slug, tags, created files, and next steps (e.g., "run verify-prototype when ready").

## Initial Target Slugs
- `skyward_pinball` (from 20251001-bounce_pit trial).
- `ricochet_watch` (from 20251001-outpost_reflector trial).
- `orbital_relay` (from 20251001-rotary_relay trial).

## Outstanding Decisions
- Whether to auto-register new game in `knowledge/games.csv`.
- Integration with future `npm run verify-prototype` exit codes.
