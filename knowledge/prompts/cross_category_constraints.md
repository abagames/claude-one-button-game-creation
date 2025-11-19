
## Cross-Category Selection Constraints (Auto-Generated)

### Mandatory Requirements
- **Core Categories**: player, field, weapon, rule (minimum 1 tag each)
- **Category Diversity**: Minimum 3 different categories
- **Balance Constraint**: No single category exceeds 50% of total selection

### Selection Algorithm
1. **Phase 1**: Select 1-2 tags from each core category (player, field, weapon, rule)
2. **Phase 2**: Add tags from support categories to reach minimum diversity requirement
3. **Phase 3**: Validate balance constraints and adjust if necessary

### Quality Metrics
- **Category Diversity Score**: Number of unique categories selected / Total available categories
- **Complexity Balance**: Mix of minimal, low, medium complexity levels
- **Dominance Check**: Maximum single-category ratio < 0.5

### Example Valid Selections
- player:bounce + field:holes + weapon:artillery + rule:physics (4 categories, balanced)
- player:multiple + field:lanes + weapon:explosion + rule:match + obstacle:penalty (5 categories, high diversity)

### Rejection Criteria
- Single category exceeds 50% of total tags
- Fewer than 3 categories represented
- Only minimal complexity tags selected
- Missing any core category (player, field, weapon, rule)
