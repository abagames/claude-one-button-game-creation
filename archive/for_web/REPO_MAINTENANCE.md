# Repository Maintenance Guide

This document consolidates repository-wide maintenance tasks extracted from `AGENTS.md`. For game development processes in `dev/`, refer to `AGENTS.md`. This focuses on maintaining tags, metadata, knowledge base, and scripts.

## Primary Information and Directory Structure

- `reference/`: Primary source containing existing game implementations (`games/<slug>.js`) and CSV files (`tags.csv`, `games.csv`, `categories*.csv`). Do not edit.
- `knowledge/`: Manages confirmed knowledge such as tag_code_map, snippets, workflows, and prompts. Guidelines (`crisp-game-lib-guide.md`, `snippets/README.md`, etc.) are also placed here.
- `scripts/`: CLI tools for metadata generation (`generate_metadata.js`), tag snippet extraction (`fetch_tag_snippets.js`), etc. When updating, document usage and verification procedures.
- `tmp/`: Stores work-in-progress assets like prototypes, test outputs, and agent context. Not under Git control, freely creatable, but promote important insights to `knowledge/`.

## Phase 1: Metadata Maintenance (Tag Reverse Index Foundation)

- Purpose: Maintain state where tags can reverse-index to corresponding games, functions, and comments.
- Procedure: Run `node scripts/generate_metadata.js` to regenerate `knowledge/tag_code_map.json` and `knowledge/games/<slug>.md`. Must re-run after CSV updates or tag additions.
- Quality Control: Verify no omissions or corruption in generated files, document rationale in diff reviews.

> Metadata updated in this phase becomes the primary reference when selecting tags in "design preparation" in `AGENTS.md`.

## Phase 2: Snippet Extraction/Normalization (Reusable Part Maintenance)

- Purpose: Convert 20-40 line reusable snippets to Markdown and clarify dependency conditions.
- Procedure: Create based on `knowledge/snippets/_template.md`. Reference `knowledge/tag_code_map.json` and `reference/games/*`.
- Variants: Follow `<tag>_<variant>.md` naming; add only when differences are clear.
- One-Button Adaptation: Exclude or annotate if assuming multiple inputs, link to relevant guide (`one-button-game-design-guide.md`).

> Snippets maintained here are supplied as copy-paste "materials" to `AGENTS.md` flow during dev/ implementation.

## Phase 3: Reference Workflow Construction (Tool and Procedure Maintenance)

- CLI: `npm run fetch-tag-snippets -- --tags "player:bounce,field:gravity" [--format ... --out ...]`
- Purpose: Generate snippet collection from required tags, automate input context for LLM.
- Quality Assurance: Run `node scripts/test_fetch_tag_snippets_output.js` etc. for structure verification after CLI changes.
- Documentation: Append specifications and changes to `knowledge/workflows/fetch-tag-snippets.md`.

> Ensures automation of generation prompts and agent inputs, supporting smooth design preparation through implementation in `AGENTS.md`.

## Prompt Assets and Novelty Mechanisms

- Templatize `knowledge/prompts/main*.md`, maintain tag constraints and novelty check procedures in latest state.
- Document usage of cross-category constraints (`scripts/generate_cross_category_constraints.js`) and similarity check (`scripts/similarity_checker.js`) with update history.
- Align agent self-verification flow with `game_generation_workflow.md`.

## Recording and Review

- Record change reasons and background in related documents or `coding_agent_game_project.md`.
- When updating scripts or templates, include usage examples and rollback procedures.
- Summarize maintenance results (e.g., new tag additions, snippet updates) in PR descriptions or release notes.

Update both documents simultaneously when affecting the development flow documented in `AGENTS.md` to maintain consistency.
