#!/usr/bin/env node

/**
 * Novelty Metrics Calculator
 *
 * Calculates quantitative novelty metrics for game prototypes:
 * - Tag Novelty Ratio: proportion of novel tag combinations
 * - Mechanical Coherence: compatibility score between selected tags
 * - Basic Code Similarity: AST-independent similarity estimation
 */

const fs = require('fs');
const path = require('path');

/**
 * Calculate Tag Novelty Ratio
 * @param {string[]} selectedTags - Tags used in the proposed game
 * @param {string} historyFile - Path to tag_combo_history.csv
 * @returns {number} Ratio of novel tag combinations (0.0 - 1.0)
 */
function calculateTagNoveltyRatio(selectedTags, historyFile) {
  if (!selectedTags || selectedTags.length === 0) {
    return 0;
  }

  let historicalCombos = [];
  if (fs.existsSync(historyFile)) {
    const content = fs.readFileSync(historyFile, 'utf8');
    const lines = content.trim().split('\n');

    // Skip header, parse tag combinations
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length >= 2) {
        // Assuming format: slug,tags,"other fields"
        const tags = parts[1].replace(/"/g, '').split(';').map(t => t.trim());
        historicalCombos.push(new Set(tags));
      }
    }
  }

  // Generate all possible pairs from selected tags
  const selectedPairs = [];
  for (let i = 0; i < selectedTags.length; i++) {
    for (let j = i + 1; j < selectedTags.length; j++) {
      selectedPairs.push([selectedTags[i], selectedTags[j]].sort().join('+'));
    }
  }

  if (selectedPairs.length === 0) {
    return selectedTags.length > 0 ? 1.0 : 0;
  }

  // Count how many pairs are novel (not seen in history)
  let novelPairs = 0;
  selectedPairs.forEach(pair => {
    const [tag1, tag2] = pair.split('+');
    let isNovel = true;

    historicalCombos.forEach(historicalSet => {
      if (historicalSet.has(tag1) && historicalSet.has(tag2)) {
        isNovel = false;
      }
    });

    if (isNovel) {
      novelPairs++;
    }
  });

  return novelPairs / selectedPairs.length;
}

/**
 * Calculate Mechanical Coherence Score
 * @param {string[]} selectedTags - Tags used in the proposed game
 * @param {string} categoriesFile - Path to tag_categories_enhanced.csv
 * @returns {number} Coherence score (0.0 - 1.0)
 */
function calculateMechanicalCoherence(selectedTags, categoriesFile) {
  if (!selectedTags || selectedTags.length === 0) {
    return 0;
  }

  if (!fs.existsSync(categoriesFile)) {
    console.warn(`Categories file not found: ${categoriesFile}`);
    return 0;
  }

  // Load tag metadata
  const content = fs.readFileSync(categoriesFile, 'utf8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');

  const tagIndex = headers.indexOf('tag');
  const categoryIndex = headers.indexOf('category');
  const compatibleIndex = headers.indexOf('compatible_categories');

  const tagMetadata = new Map();
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length > Math.max(tagIndex, categoryIndex, compatibleIndex)) {
      const tag = parts[tagIndex];
      const category = parts[categoryIndex];
      const compatible = parts[compatibleIndex] ? parts[compatibleIndex].split('+') : [];
      tagMetadata.set(tag, { category, compatible });
    }
  }

  // Extract categories from selected tags
  const selectedCategories = selectedTags
    .map(tag => {
      const metadata = tagMetadata.get(tag);
      return metadata ? metadata.category : null;
    })
    .filter(cat => cat !== null);

  if (selectedCategories.length === 0) {
    return 0;
  }

  // Count compatibility matches
  let compatibilityScore = 0;
  let totalChecks = 0;

  selectedTags.forEach(tag => {
    const metadata = tagMetadata.get(tag);
    if (!metadata || !metadata.compatible) return;

    const compatibleCategories = metadata.compatible;

    // Check how many other selected tags fall into compatible categories
    selectedTags.forEach(otherTag => {
      if (tag === otherTag) return;

      const otherMetadata = tagMetadata.get(otherTag);
      if (!otherMetadata) return;

      totalChecks++;
      if (compatibleCategories.includes(otherMetadata.category)) {
        compatibilityScore++;
      }
    });
  });

  return totalChecks > 0 ? compatibilityScore / totalChecks : 0;
}

/**
 * Estimate basic code similarity (keyword-based)
 * @param {string} proposedCode - Code content of proposed game
 * @param {string[]} existingGamePaths - Paths to existing game files
 * @returns {Object} Similarity metrics
 */
function estimateCodeSimilarity(proposedCode, existingGamePaths) {
  // Extract function names and key variables
  const extractIdentifiers = (code) => {
    const functionPattern = /function\s+(\w+)|const\s+(\w+)\s*=/g;
    const identifiers = new Set();
    let match;
    while ((match = functionPattern.exec(code)) !== null) {
      identifiers.add(match[1] || match[2]);
    }
    return identifiers;
  };

  const proposedIdentifiers = extractIdentifiers(proposedCode);

  let maxSimilarity = 0;
  let mostSimilarGame = null;

  existingGamePaths.forEach(gamePath => {
    if (!fs.existsSync(gamePath)) return;

    const existingCode = fs.readFileSync(gamePath, 'utf8');
    const existingIdentifiers = extractIdentifiers(existingCode);

    // Calculate Jaccard similarity
    const intersection = [...proposedIdentifiers].filter(id => existingIdentifiers.has(id));
    const union = new Set([...proposedIdentifiers, ...existingIdentifiers]);

    const similarity = union.size > 0 ? intersection.length / union.size : 0;

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilarGame = path.basename(gamePath, '.js');
    }
  });

  // Estimate originality (inverse of similarity)
  const originalityRate = 1 - maxSimilarity;

  return {
    maxSimilarity,
    mostSimilarGame,
    estimatedOriginality: originalityRate,
    uniqueIdentifiers: proposedIdentifiers.size
  };
}

/**
 * Calculate all novelty metrics for a game
 * @param {Object} gameData - Game metadata and code
 * @param {Object} options - File paths and configuration
 * @returns {Object} Complete novelty metrics
 */
function calculateAllMetrics(gameData, options = {}) {
  const {
    historyFile = path.join(__dirname, '../knowledge/metrics/tag_combo_history.csv'),
    categoriesFile = path.join(__dirname, '../knowledge/tag_categories_enhanced.csv'),
    existingGamesDir = path.join(__dirname, '../reference/games')
  } = options;

  const selectedTags = gameData.tags || [];
  const proposedCode = gameData.code || '';

  // Calculate individual metrics
  const tagNoveltyRatio = calculateTagNoveltyRatio(selectedTags, historyFile);
  const mechanicalCoherence = calculateMechanicalCoherence(selectedTags, categoriesFile);

  // Get list of existing games for code comparison
  const existingGamePaths = [];
  if (fs.existsSync(existingGamesDir)) {
    const gameFiles = fs.readdirSync(existingGamesDir)
      .filter(file => file.endsWith('.js'))
      .map(file => path.join(existingGamesDir, file));
    existingGamePaths.push(...gameFiles);
  }

  const codeSimilarity = estimateCodeSimilarity(proposedCode, existingGamePaths);

  // Compile final metrics
  const metrics = {
    tagNoveltyRatio: {
      value: tagNoveltyRatio,
      threshold: 0.3,
      passed: tagNoveltyRatio >= 0.3,
      description: 'Proportion of novel tag combinations'
    },
    mechanicalCoherence: {
      value: mechanicalCoherence,
      threshold: 0.7,
      passed: mechanicalCoherence >= 0.7,
      description: 'Tag compatibility score'
    },
    estimatedCodeOriginality: {
      value: codeSimilarity.estimatedOriginality,
      threshold: 0.7,
      passed: codeSimilarity.estimatedOriginality >= 0.7,
      description: 'Estimated proportion of original code',
      details: codeSimilarity
    },
    overallNovelty: {
      value: (tagNoveltyRatio + mechanicalCoherence + codeSimilarity.estimatedOriginality) / 3,
      threshold: 0.5,
      description: 'Weighted average of all novelty metrics'
    }
  };

  metrics.overallNovelty.passed = metrics.overallNovelty.value >= metrics.overallNovelty.threshold;

  return metrics;
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log('Novelty Metrics Calculator');
    console.log('Usage: node calculate_novelty_metrics.js <game_data.json>');
    console.log('       node calculate_novelty_metrics.js --test');
    console.log('');
    console.log('Game data JSON format:');
    console.log('{');
    console.log('  "slug": "game_name",');
    console.log('  "tags": ["player:bounce", "field:holes"],');
    console.log('  "code": "... game code ..."');
    console.log('}');
    return;
  }

  if (args[0] === '--test') {
    const testGame = {
      slug: 'test_game',
      tags: ['player:rotate', 'field:spike', 'weapon:explosion', 'rule:physics'],
      code: `
        function updatePlayer() {
          player.angle += 0.1;
        }
        function checkCollision() {
          // collision logic
        }
      `
    };

    console.log('Testing novelty metrics calculator...\n');
    const metrics = calculateAllMetrics(testGame);
    console.log(JSON.stringify(metrics, null, 2));
    return;
  }

  // Load game data from file
  const inputFile = args[0];
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  try {
    const gameData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    const metrics = calculateAllMetrics(gameData);
    console.log(JSON.stringify(metrics, null, 2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  calculateTagNoveltyRatio,
  calculateMechanicalCoherence,
  estimateCodeSimilarity,
  calculateAllMetrics
};
