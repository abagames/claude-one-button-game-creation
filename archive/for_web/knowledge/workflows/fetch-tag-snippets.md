# Fetch Tag Snippets CLI Design (Phase 3)

## Objective
Provide a repeatable command that collects snippet metadata and code blocks for one or more tags and writes an aggregated context file for downstream prompt assembly.

## Command Interface
- Package script: add `"fetch-tag-snippets": "node scripts/fetch_tag_snippets.js"` to `package.json` after implementation.
- Invocation: `npm run fetch-tag-snippets -- --tags "player:bounce,player:reflect" --out tmp/agent_context/agent_context.md --log fetch-tag-snippets`
- Required flag: `--tags` (comma separated, preserves colon casing).
- Optional flags:
  - `--out <path>` default `tmp/agent_context/agent_context.md` (directories auto-created).
  - `--format <markdown|json>` default `markdown`.
  - `--log <slug>` writes execution details to `knowledge/logs/<YYYYMMDD>-<slug>.md` (defaults to `fetch-tag-snippets`).
  - `--verbose` prints per-tag status to stdout.
  - `--force-partial` still writes successful tags even when some fail.

## Data Sources
1. `knowledge/tag_code_map.json` – authoritative mapping of tags → game files / function anchors.
2. `knowledge/snippets/<tag>.md` – base snippet file; if absent, fallback to auto extraction guidance.
3. `knowledge/snippets/<tag>/**` – variants aggregated when present (exclude `_template.md`).
4. `reference/games/<slug>.js` – optional inline extraction when snippet missing or `--include-source` (future flag).
5. `knowledge/snippets/high_priority_overview.md` – use to warn when a requested tag lacks a curated snippet.

## Current Snippet Inventory (2025-09-30)
| Tag | Snippet Path | Notes |
| --- | --- | --- |
| `field:bottomless` | `knowledge/snippets/field:bottomless.md` | 38-line JUJUMP scroll baseline |
| `field:outpost` | `knowledge/snippets/field:outpost.md` | Laser Fortress beam/ally collision guards |
| `rule:physics` | `knowledge/snippets/rule:physics.md` | Flip O continuous collision and reflection |
| `on pressed:turn` | `knowledge/snippets/on pressed:turn.md` | Direction flip with pellet loop |
| `on pressed:jump` | `knowledge/snippets/on pressed:jump.md` | Floater attach/launch handling |
| `on pressed:reverse state` | `knowledge/snippets/on pressed:reverse state.md` | Lane polarity switch rerouting |
| `on pressed:shoot` | `knowledge/snippets/on pressed:shoot.md` | Homing missile volley control |
| `on holding:move` | `knowledge/snippets/on holding:move.md` | Continuous boost and pickup cadence |

The CLI must confirm these files exist before emitting context; failures should name the missing path and advise running Phase 2 to backfill.

## Processing Steps
1. Parse CLI arguments and normalise tag list (trim whitespace, dedupe, preserve order).
2. Validate each tag:
   - Ensure string matches `/^[a-z]+:[a-z0-9_]+$/`.
   - Confirm presence in `reference/tags.csv`; otherwise, accumulate error.
   - Confirm mapping exists in `tag_code_map.json`; warn if missing functions.
   - Check curated snippet availability against the inventory table above; raise warning if absent.
3. For each validated tag:
   - Load base snippet Markdown and capture sections (`Primary Role`, `Reference Games`, etc.).
   - Detect variant subdirectory entries; append them under `### Variants` with relative paths.
   - Summarise reference games from `tag_code_map.json` (game title, file, first function line).
4. Render output:
   - **Markdown mode**: for each tag emit `## <tag>` headings with metadata table, snippet code block, dependencies, integration notes, validation summary, and variant references. Insert warnings block if snippet missing.
   - **JSON mode**: produce structured object with keys `tag`, `primaryRole`, `referenceGames`, `snippets` (array of `{path, codeBlock, dependencies}`), `notes`.
5. Write aggregated file to `--out` (create directories as needed).
6. Log completion with timestamp, command, number of tags processed, warnings/errors to `knowledge/logs/<YYYYMMDD>-<slug>.md`.
7. Exit with code:
   - `0` on full success.
   - `2` when some tags succeeded but at least one missing snippet (requires `--force-partial`).
   - `1` for argument or IO failures.

## Error Handling
- Missing `--tags`: exit 1 with usage message.
- Unknown tag: list offending tags, skip file write unless `--force-partial` provided.
- Missing snippet file: include placeholder section with TODO and mention in log; exit code 2 without `--force-partial`.
- Duplicate tag input: dedupe but log occurrence.
- File write failure: surface Node error and exit 1.

## Testing Strategy
- Unit-level: stub `process.argv` to cover happy path, unknown tag, missing snippet, partial success with `--force-partial`.
- Integration smoke test: run `npm run fetch-tag-snippets -- --tags "field:bottomless,on pressed:shoot"` and assert `tmp/agent_context/agent_context.md` contains both headers and code blocks.
- Validation check: ensure output Markdown respects 20-40 line constraint by counting lines from snippets (warn if violation).

## Implementation Notes
- Use `fs.promises` + `path` for async file IO.
- Parse snippet sections via simple regex splits anchored on `##` headers; fail fast if template order not met.
- Provide helper to read variant directories: `fs.readdir` filtering `.md` files.
- Maintain plain ASCII; avoid markdown tables reflow to protect original formatting.
- Reserve future flags: `--include-source` (raw game context), `--filter-status verified`.

## Rollout Checklist
1. Implement CLI under `scripts/fetch_tag_snippets.js` using the above flow.
2. Register npm script and document usage in upcoming repo README.
3. Backfill at least three snippet files to ensure demo coverage (already satisfied for high-priority tags listed above).
4. Capture first run log at `knowledge/logs/<date>-fetch-tag-snippets.md` with tag counts and warnings.
5. Update `tmp/agent_context/agent_context.md` sample and include in review package for human approval.
