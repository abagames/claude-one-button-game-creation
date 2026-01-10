# Snippet & Variant Maintenance Plan

## Current Status (2025-01-05)

### Coverage Summary
| Metric | Count | Percentage |
|--------|-------|------------|
| **Total tags in taxonomy** | 107 | 100% |
| **Tags with implementation** | 107 | 100% |
| **Tags with snippet files** | 29 | 27.1% |
| **Variant files** | 2 | - |
| **Unmaintained tags** | 78 | 72.9% |

### Category-Level Coverage
| Category | Total Tags | Snippets | Coverage | Priority |
|----------|------------|----------|----------|----------|
| `input` | 28 | 8 | 28.6% | Medium |
| `field` | 20 | 8 | 40.0% | High |
| `player` | 15 | 6 | 40.0% | High |
| `weapon` | 15 | 2 | 13.3% | **Critical** |
| `rule` | 18 | 1 | 5.6% | **Critical** |
| `obstacle` | 8 | 1 | 12.5% | High |
| `item` | 3 | 0 | 0.0% | **Critical** |

### Existing Variants
- `player:bounce_horizontal` (variant of `player:bounce`)
- `player:rotate_roll_hold` (variant of `player:rotate`)

## Maintenance Strategy

### Phase 1: Fill Critical Gaps (Priority: HIGH)
**Goal**: Achieve 50%+ coverage in all categories

#### Target Categories
1. **`item` (0% → 100%)** - Only 3 tags, quick wins
   - `on_got_item:speed_up`
   - `on_got_item:jump_high`
   - `on_got_item:invincible`

2. **`rule` (5.6% → 30%+)** - High-impact mechanics
   - `rule:time_limit`, `rule:combo_multiplier`, `rule:chain`, `rule:bullet_hell`
   - `rule:match`, `rule:find`, `rule:hit_all`

3. **`weapon` (13.3% → 40%+)** - Core combat mechanics
   - `weapon:auto`, `weapon:spread`, `weapon:laser`, `weapon:beam`
   - `weapon:charge`, `weapon:chase`, `weapon:reflect`

#### Execution
- **Method**: Extract from `tag_code_map.json` references
- **Quality bar**: All snippets must satisfy `README.md` checklist
- **Timeline**: Complete within 2-3 work sessions

### Phase 2: Identify & Document Variants (Priority: MEDIUM)
**Goal**: Discover distinct implementation patterns for multi-reference tags

#### Variant Detection Process
1. **Query multi-reference tags**
   ```bash
   node scripts/find_variant_candidates.js > tmp/variant_candidates.md
   ```
   (Script to be created - lists tags with 2+ reference games)

2. **Manual inspection criteria** (per `README.md`):
   - ✅ **Create variant** if:
     - Implementation approach differs fundamentally
     - Dependencies differ significantly
     - Use cases are clearly distinct
   - ❌ **Do NOT create variant** if:
     - Only variable names or constants differ
     - Trivial refactoring variations
     - Small parameter tweaks

3. **Expected candidates** (examples to verify):
   - `player:rotate` - Already has `_roll_hold`, may have more
   - `on_holding:move` - Could have directional variants
   - `weapon:artillery` - Parabolic vs linear trajectories
   - `field:gravity` - Directional gravity variants

#### Documentation Requirements
Each variant must include (per `_variant_template.md`):
- `Variant Type`: What makes this different from base
- `Use When`: Scenario-specific guidance
- Cross-references in `Integration Notes`

### Phase 3: Systematic Base Coverage (Priority: MEDIUM)
**Goal**: Reach 80%+ coverage across all categories

#### Methodology
1. **Prioritize by reference count**
   - Tags used in 3+ games first
   - Single-reference tags last (may lack pattern generality)

2. **Batch extraction**
   ```bash
   npm run fetch-tag-snippets -- --tags "tag1,tag2,tag3" --extract
   ```
   (Future CLI enhancement for semi-automated extraction)

3. **Quality gates**
   - Minimum 2 reference games per snippet
   - All dependencies documented
   - Integration notes include tag compatibility info

### Phase 4: Validation & Refinement (Priority: LOW)
**Goal**: Elevate snippets from `draft` to `verified` status

#### Validation Workflow
1. **Automated checks** (existing):
   ```bash
   npm run validate-tag -- --tag player:bounce
   ```

2. **Manual review checklist**:
   - Code executes without errors in isolation
   - Dependencies are complete and correct
   - Integration notes tested with recommended tag combinations
   - No conflicts with documented incompatibilities

3. **Status promotion**:
   - Human reviewer updates `LLM Status: verified`
   - Record validation command and date in `## Validation` section

## Tactical Guidelines

### When to Create a Snippet
- ✅ Tag has 2+ reference games in `tag_code_map.json`
- ✅ Implementation pattern is reusable (not game-specific)
- ✅ Fits 20-40 line constraint (or can be refactored to fit)
- ❌ Skip if tag is purely metadata or has no code representation

### When to Create a Variant
- ✅ Base snippet already exists
- ✅ Alternative implementation has fundamentally different:
  - State management approach
  - Dependency requirements
  - Appropriate use cases
- ✅ At least 1 reference game demonstrates the variant pattern
- ❌ Do NOT create for cosmetic differences

### Naming Conventions
| Type | Format | Example |
|------|--------|---------|
| Base snippet | `<tag>.md` | `player:bounce.md` |
| Variant | `<tag>_<variant>.md` | `player:bounce_horizontal.md` |
| Template | `_<name>_template.md` | `_variant_template.md` |

### Cross-Reference Protocol
- Base snippets SHOULD mention known variants in `Integration Notes`
- Variants MUST reference base snippet and other variants
- Use relative decision criteria: "Use base for X, use variant_Y for Z"

## Measurement & Tracking

### Success Metrics
| Milestone | Target | Deadline |
|-----------|--------|----------|
| Item category complete | 3/3 snippets | Week 1 |
| Rule category 30% | 6/18 snippets | Week 2 |
| Weapon category 40% | 6/15 snippets | Week 2 |
| Overall 50% coverage | 54/107 snippets | Week 3 |
| Variant candidates identified | Report complete | Week 3 |
| Overall 80% coverage | 86/107 snippets | Week 6 |

### Progress Tracking
- **Daily log**: `knowledge/logs/<YYYYMMDD>-snippets.md`
- **Weekly summary**: Append to this document under `## Progress Log`
- **Automated audit**: Run quarterly to detect drift

## Tools & Automation

### Existing
- `scripts/generate_metadata.js` - Rebuilds `tag_code_map.json`
- `npm run fetch-tag-snippets` - Retrieves snippets for tag list
- `npm run validate-tag` - Validates individual tag snippet

### To Be Created
- `scripts/find_variant_candidates.js` - Lists tags with multiple implementations
- `scripts/snippet_coverage_report.js` - Generates coverage dashboard
- `scripts/extract_snippet_draft.js` - Semi-automated snippet extraction from reference games

## Progress Log

### 2025-01-05
- **Action**: Audited current coverage (29/107 = 27.1%)
- **Finding**: Critical gaps in `item` (0%), `rule` (5.6%), `weapon` (13.3%)
- **Decision**: Prioritize Phase 1 (fill critical gaps) before variant exploration
- **Next**: Extract all 3 `item` category snippets
