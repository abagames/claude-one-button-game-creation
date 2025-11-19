#!/usr/bin/env node

/**
 * Cross-Category Tag Selection Constraint Generator
 *
 * Generates tag combinations that enforce diversity across categories
 * to prevent single-category dominated game designs
 */

const fs = require('fs');
const path = require('path');

// Read the enhanced tag categories
function loadTagCategories() {
  const csvPath = path.join(__dirname, '../knowledge/tag_categories_enhanced.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');

  const tags = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const tag = {};
    headers.forEach((header, index) => {
      tag[header] = values[index];
    });
    tags.push(tag);
  }

  return tags;
}

// Group tags by category
function groupByCategory(tags) {
  const categories = {};
  tags.forEach(tag => {
    const category = tag.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(tag);
  });
  return categories;
}

// Generate cross-category constraints
function generateConstraints(categories, options = {}) {
  const {
    minCategories = 3,
    maxTagsPerCategory = 2,
    priorityWeights = { high: 3, medium: 2, low: 1, minimal: 0.5 }
  } = options;

  const categoryNames = Object.keys(categories);
  const coreCategories = ['player', 'field', 'weapon', 'rule'];
  const supportCategories = ['obstacle', 'input'];

  const constraints = {
    mandatory: {
      description: "At least one tag from each core category must be selected",
      coreCategories,
      minPerCore: 1,
      maxPerCore: maxTagsPerCategory
    },
    diversity: {
      description: "Total selection must span minimum number of categories",
      minCategories,
      maxCategories: Math.min(categoryNames.length, 6)
    },
    balance: {
      description: "Prevent single category dominance",
      maxDominanceRatio: 0.5, // No category can exceed 50% of total tags
      minCategoryContribution: 0.15 // Each selected category must contribute at least 15%
    },
    complexity: {
      description: "Mix complexity levels for interesting interactions",
      complexityLevels: ['minimal', 'low', 'medium'],
      minComplexityDiversity: 2,
      maxHighComplexity: 2
    }
  };

  return constraints;
}

// Generate tag selection based on constraints
function selectTagsWithConstraints(categories, constraints, seed = null) {
  const selected = [];
  const usedCategories = new Set();

  // Phase 1: Mandatory core category selection
  constraints.mandatory.coreCategories.forEach(coreCategory => {
    if (categories[coreCategory]) {
      const categoryTags = categories[coreCategory];
      const selectedFromCategory = selectFromCategory(categoryTags, constraints.mandatory.minPerCore, constraints.mandatory.maxPerCore);
      selected.push(...selectedFromCategory);
      usedCategories.add(coreCategory);
    }
  });

  // Phase 2: Fill remaining slots with diversity constraints
  const remainingCategories = Object.keys(categories).filter(cat => !usedCategories.has(cat));
  const neededCategories = Math.max(0, constraints.diversity.minCategories - usedCategories.size);

  for (let i = 0; i < neededCategories && i < remainingCategories.length; i++) {
    const category = remainingCategories[i];
    const categoryTags = categories[category];
    const selectedFromCategory = selectFromCategory(categoryTags, 1, constraints.mandatory.maxPerCore);
    selected.push(...selectedFromCategory);
    usedCategories.add(category);
  }

  // Phase 3: Validate and adjust for balance
  const result = validateAndAdjustSelection(selected, constraints);

  return {
    tags: result,
    categories: Array.from(usedCategories),
    constraints: constraints,
    metrics: calculateSelectionMetrics(result, categories)
  };
}

function selectFromCategory(categoryTags, minCount, maxCount) {
  // Complete randomization for maximum novelty and unexpected combinations
  const shuffled = categoryTags.sort(() => Math.random() - 0.5);
  const count = Math.min(maxCount, Math.max(minCount, Math.ceil(Math.random() * maxCount)));
  return shuffled.slice(0, count);
}

function validateAndAdjustSelection(selected, constraints) {
  // Check dominance ratio
  const categoryCount = {};
  selected.forEach(tag => {
    categoryCount[tag.category] = (categoryCount[tag.category] || 0) + 1;
  });

  const totalTags = selected.length;
  const maxAllowedPerCategory = Math.floor(totalTags * constraints.balance.maxDominanceRatio);

  // Remove excess tags from dominant categories
  const result = [];
  Object.keys(categoryCount).forEach(category => {
    const tagsFromCategory = selected.filter(tag => tag.category === category);
    const allowedCount = Math.min(tagsFromCategory.length, maxAllowedPerCategory);
    result.push(...tagsFromCategory.slice(0, allowedCount));
  });

  return result;
}

function calculateSelectionMetrics(selected, allCategories) {
  const categoryCount = {};
  const complexityCount = {};

  selected.forEach(tag => {
    categoryCount[tag.category] = (categoryCount[tag.category] || 0) + 1;
    complexityCount[tag.complexity_level] = (complexityCount[tag.complexity_level] || 0) + 1;
  });

  const totalTags = selected.length;
  const categoryDiversity = Object.keys(categoryCount).length;
  const complexityDiversity = Object.keys(complexityCount).length;
  const dominanceRatio = Math.max(...Object.values(categoryCount)) / totalTags;

  return {
    totalTags,
    categoryDiversity,
    complexityDiversity,
    dominanceRatio,
    categoryBreakdown: categoryCount,
    complexityBreakdown: complexityCount
  };
}

// Generate prompt integration code
function generatePromptIntegration(constraints) {
  return `
## Cross-Category Selection Constraints (Auto-Generated)

### Mandatory Requirements
- **Core Categories**: ${constraints.mandatory.coreCategories.join(', ')} (minimum 1 tag each)
- **Category Diversity**: Minimum ${constraints.diversity.minCategories} different categories
- **Balance Constraint**: No single category exceeds ${Math.floor(constraints.balance.maxDominanceRatio * 100)}% of total selection

### Selection Algorithm
1. **Phase 1**: Select 1-${constraints.mandatory.maxPerCore} tags from each core category (${constraints.mandatory.coreCategories.join(', ')})
2. **Phase 2**: Add tags from support categories to reach minimum diversity requirement
3. **Phase 3**: Validate balance constraints and adjust if necessary

### Quality Metrics
- **Category Diversity Score**: Number of unique categories selected / Total available categories
- **Complexity Balance**: Mix of ${constraints.complexity.complexityLevels.join(', ')} complexity levels
- **Dominance Check**: Maximum single-category ratio < ${constraints.balance.maxDominanceRatio}

### Example Valid Selections
- player:bounce + field:holes + weapon:artillery + rule:physics (4 categories, balanced)
- player:multiple + field:lanes + weapon:explosion + rule:match + obstacle:penalty (5 categories, high diversity)

### Rejection Criteria
- Single category exceeds 50% of total tags
- Fewer than 3 categories represented
- Only minimal complexity tags selected
- Missing any core category (player, field, weapon, rule)
`;
}

// Main execution
function main() {
  const tags = loadTagCategories();
  const categories = groupByCategory(tags);
  const constraints = generateConstraints(categories);

  // Generate example selections
  console.log('Cross-Category Tag Selection System');
  console.log('================================');
  console.log();

  console.log('Available Categories:');
  Object.keys(categories).forEach(category => {
    console.log(`  ${category}: ${categories[category].length} tags`);
  });
  console.log();

  // Generate 3 example selections
  console.log('Example Constrained Selections:');
  for (let i = 1; i <= 3; i++) {
    const selection = selectTagsWithConstraints(categories, constraints);
    console.log(`\nExample ${i}:`);
    console.log(`  Tags: ${selection.tags.map(t => t.tag).join(', ')}`);
    console.log(`  Categories: ${selection.categories.join(', ')}`);
    console.log(`  Metrics: ${selection.metrics.categoryDiversity} categories, dominance ratio ${selection.metrics.dominanceRatio.toFixed(2)}`);
  }

  // Generate prompt integration
  const promptIntegration = generatePromptIntegration(constraints);

  // Save results
  const outputDir = path.join(__dirname, '../knowledge/prompts/');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outputDir, 'cross_category_constraints.md'), promptIntegration);

  const constraintsData = {
    constraints,
    categories: Object.keys(categories),
    totalTags: tags.length
  };

  fs.writeFileSync(path.join(outputDir, 'constraints_config.json'), JSON.stringify(constraintsData, null, 2));

  console.log('\nOutput files generated:');
  console.log('  knowledge/prompts/cross_category_constraints.md');
  console.log('  knowledge/prompts/constraints_config.json');
}

if (require.main === module) {
  main();
}

module.exports = {
  loadTagCategories,
  groupByCategory,
  generateConstraints,
  selectTagsWithConstraints,
  calculateSelectionMetrics
};