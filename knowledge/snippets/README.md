# Snippet Knowledge Base Guidelines

This directory stores reusable code excerpts grouped by tag so that the LLM can assemble new games without re-parsing entire sources each time. Files must follow the rules below.

## File Naming
- Base path: `knowledge/snippets/<tag>.md` (lowercase, use colon and underscores exactly as the tag key appears in `reference/tags.csv`).
- If multiple implementations exist, append a variant suffix: `knowledge/snippets/<tag>_<variant>.md` (e.g., `player:rotate_roll_hold.md`).

## Required Sections
Each snippet file MUST include the sections shown below and preserve the order. Use the `_template.md` as a starting point.
1. Heading `# <Tag>`.
2. Metadata table covering:
   - `Primary Role`: short summary of the mechanic.
   - `Reference Games`: comma separated list of **at least two** distinct game slugs with file paths and line hints (e.g., `slug - src/...:40-88`).
   - `LLM Status`: one of `draft`, `verified`, `deprecated`.
3. `## Snippet` with a fenced code block (JavaScript) between 20 and 40 lines. Keep original indentation and add inline comments only when necessary for context.
4. `## Dependencies` listing globals, helper functions, or assets required by the snippet.
5. `## Integration Notes` describing how to adapt the snippet (e.g., event hooks, collision expectations) **and** call out recommended tag combinations or conflicts so the LLM can plan multi-tag builds without guesswork.
6. `## Validation` capturing the date, command(s) run, and observed results.

## Generation Flow for the LLM
1. Load candidate games from `knowledge/tag_code_map.json` for the chosen tag.
2. Copy the minimal code block and sanitize variable names while preserving behavior.
3. Record dependency bullets and note any assumptions from comments or context.
4. Update the metadata table (`LLM Status` defaults to `draft`).
5. Save to the appropriate path and ping the reviewer if human approval is required.

## Variant Management
- **Base snippet**: `knowledge/snippets/<tag>.md` contains the most representative/general implementation for a tag.
- **Variant snippets**: When multiple distinct implementation patterns exist for the same tag, create additional files named `knowledge/snippets/<tag>_<variant>.md` in the same directory.
- **Variant detection criteria**:
  - Implementation approach differs fundamentally (e.g., array-based vs object-based state)
  - Dependencies differ significantly (e.g., requires gravity vs gravity-free)
  - Appropriate use cases are clearly distinct (e.g., single player vs multiplayer)
- **Do NOT create variants** for:
  - Minor variable name or magic number differences
  - Trivial refactoring variations
  - Small parameter tweaks to the same algorithm
- **Variant template**: Use `knowledge/snippets/_variant_template.md` as a starting point. Add a "Variant Type" and "Use When" row to the metadata table to clarify the distinction.
- **Cross-references**: In each variant's "Integration Notes", mention related variants and explain when to choose one over another.

## Quality Checklist
- Code block length between 20 and 40 lines inclusive.
- All referenced functions/global variables are listed under `Dependencies`.
- `Reference Games` lists two or more titles drawn from different code files, each with line hints.
- Integration notes highlight at least one synergy or incompatibility with other tags.
- File paths use forward slashes and include line numbers (e.g., `reference/games/paku_paku.js:95`).
- Validation step mentions at least one command or manual test (e.g., `npm run generate`).
- No trailing whitespace or tab characters.

The LLM should refuse to mark a snippet `verified` until a human reviewer changes the status or leaves a review note.
