#!/usr/bin/env node

/**
 * Game Similarity Checker
 *
 * Analyzes proposed games against existing games to prevent excessive similarity
 * Uses tag overlap, mechanic patterns, and design elements for comparison
 */

const fs = require('fs');
const path = require('path');

// Load existing game data
function loadExistingGames() {
  const gamesDir = path.join(__dirname, '../knowledge/games/');
  const games = [];

  if (!fs.existsSync(gamesDir)) {
    console.warn(`Games directory not found: ${gamesDir}`);
    return games;
  }

  const gameFiles = fs.readdirSync(gamesDir).filter(file => file.endsWith('.md'));

  gameFiles.forEach(file => {
    const filePath = path.join(gamesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const game = parseGameMetadata(content, file);
    if (game) {
      games.push(game);
    }
  });

  return games;
}

// Parse game metadata from markdown files
function parseGameMetadata(content, filename) {
  const lines = content.split('\n');
  const game = {
    slug: filename.replace('.md', ''),
    title: '',
    tags: [],
    mechanics: [],
    victoryCondition: '',
    playerControl: '',
    obstacles: []
  };

  let currentSection = '';

  lines.forEach(line => {
    const trimmed = line.trim();

    // Extract title
    if (trimmed.startsWith('# ') && !game.title) {
      game.title = trimmed.substring(2);
    }

    // Extract tags
    if (trimmed.includes('Tags:') || trimmed.includes('tags:')) {
      const tagMatch = trimmed.match(/tags?:\s*(.+)/i);
      if (tagMatch) {
        game.tags = tagMatch[1].split(',').map(tag => tag.trim());
      }
    }

    // Extract key mechanics from common patterns
    if (trimmed.includes('player') || trimmed.includes('Player')) {
      game.mechanics.push(extractMechanicKeywords(trimmed));
    }

    if (trimmed.includes('victory') || trimmed.includes('win') || trimmed.includes('goal')) {
      game.victoryCondition = trimmed;
    }

    if (trimmed.includes('control') || trimmed.includes('input') || trimmed.includes('button')) {
      game.playerControl = trimmed;
    }
  });

  return game.title ? game : null;
}

function extractMechanicKeywords(text) {
  const keywords = [
    'jump', 'bounce', 'rotate', 'move', 'shoot', 'explode', 'fall', 'climb',
    'collect', 'avoid', 'destroy', 'spawn', 'scroll', 'gravity', 'collision',
    'timer', 'score', 'health', 'power', 'speed', 'angle', 'direction'
  ];

  const found = [];
  keywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword)) {
      found.push(keyword);
    }
  });

  return found;
}

// Calculate similarity between two games
function calculateSimilarity(proposedGame, existingGame) {
  const similarities = {
    tagOverlap: calculateTagOverlap(proposedGame.tags, existingGame.tags),
    mechanicOverlap: calculateMechanicOverlap(proposedGame.mechanics, existingGame.mechanics),
    victoryConditionSimilarity: calculateTextSimilarity(proposedGame.victoryCondition, existingGame.victoryCondition),
    controlSimilarity: calculateTextSimilarity(proposedGame.playerControl, existingGame.playerControl)
  };

  // Weighted similarity score
  const weights = {
    tagOverlap: 0.4,
    mechanicOverlap: 0.3,
    victoryConditionSimilarity: 0.2,
    controlSimilarity: 0.1
  };

  const totalScore = Object.keys(similarities).reduce((total, key) => {
    return total + (similarities[key] * weights[key]);
  }, 0);

  return {
    totalScore,
    details: similarities,
    isHighSimilarity: totalScore > 0.7,
    isMediumSimilarity: totalScore > 0.4
  };
}

function calculateTagOverlap(tags1, tags2) {
  if (!tags1.length || !tags2.length) return 0;

  const set1 = new Set(tags1.map(tag => tag.toLowerCase()));
  const set2 = new Set(tags2.map(tag => tag.toLowerCase()));

  const intersection = [...set1].filter(tag => set2.has(tag));
  const union = [...new Set([...set1, ...set2])];

  return intersection.length / union.length; // Jaccard similarity
}

function calculateMechanicOverlap(mechanics1, mechanics2) {
  if (!mechanics1.length || !mechanics2.length) return 0;

  const flat1 = mechanics1.flat().map(m => m.toLowerCase());
  const flat2 = mechanics2.flat().map(m => m.toLowerCase());

  const set1 = new Set(flat1);
  const set2 = new Set(flat2);

  const intersection = [...set1].filter(mechanic => set2.has(mechanic));
  const union = [...new Set([...set1, ...set2])];

  return intersection.length / union.length;
}

function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 2);

  if (!words1.length || !words2.length) return 0;

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  const intersection = [...set1].filter(word => set2.has(word));
  const union = [...new Set([...set1, ...set2])];

  return intersection.length / union.length;
}

// Check if proposed game is too similar to existing games
function checkGameSimilarity(proposedGame, existingGames, threshold = 0.7) {
  const results = {
    isAcceptable: true,
    maxSimilarity: 0,
    similarGames: [],
    recommendations: []
  };

  existingGames.forEach(existingGame => {
    const similarity = calculateSimilarity(proposedGame, existingGame);

    if (similarity.totalScore > results.maxSimilarity) {
      results.maxSimilarity = similarity.totalScore;
    }

    if (similarity.isHighSimilarity) {
      results.isAcceptable = false;
      results.similarGames.push({
        game: existingGame,
        similarity: similarity
      });
    } else if (similarity.isMediumSimilarity) {
      results.similarGames.push({
        game: existingGame,
        similarity: similarity
      });
    }
  });

  // Generate recommendations
  if (!results.isAcceptable) {
    results.recommendations.push('REJECT: Game exceeds similarity threshold');
    results.recommendations.push('Suggestion: Modify core mechanics or victory condition');
  } else if (results.maxSimilarity > 0.4) {
    results.recommendations.push('CAUTION: Moderate similarity detected');
    results.recommendations.push('Suggestion: Add unique twist or additional mechanics');
  } else {
    results.recommendations.push('ACCEPT: Game shows good novelty');
  }

  return results;
}

// Generate similarity report
function generateSimilarityReport(proposedGame, existingGames) {
  const results = checkGameSimilarity(proposedGame, existingGames);

  const report = {
    gameTitle: proposedGame.title,
    timestamp: new Date().toISOString(),
    overallVerdict: results.isAcceptable ? 'ACCEPTED' : 'REJECTED',
    maxSimilarity: results.maxSimilarity,
    threshold: 0.7,
    similarityBreakdown: results.similarGames.map(item => ({
      existingGame: item.game.title,
      similarityScore: item.similarity.totalScore,
      tagOverlap: item.similarity.details.tagOverlap,
      mechanicOverlap: item.similarity.details.mechanicOverlap,
      victoryConditionSimilarity: item.similarity.details.victoryConditionSimilarity,
      controlSimilarity: item.similarity.details.controlSimilarity
    })),
    recommendations: results.recommendations,
    metrics: {
      totalExistingGames: existingGames.length,
      highSimilarityCount: results.similarGames.filter(item => item.similarity.isHighSimilarity).length,
      mediumSimilarityCount: results.similarGames.filter(item => item.similarity.isMediumSimilarity).length
    }
  };

  return report;
}

// Main API function
function checkProposedGame(proposedGameData) {
  const existingGames = loadExistingGames();

  // Normalize proposed game data
  const proposedGame = {
    title: proposedGameData.title || 'Untitled Game',
    tags: proposedGameData.tags || [],
    mechanics: proposedGameData.mechanics || [],
    victoryCondition: proposedGameData.victoryCondition || '',
    playerControl: proposedGameData.playerControl || ''
  };

  const report = generateSimilarityReport(proposedGame, existingGames);

  return report;
}

// CLI interface
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Game Similarity Checker');
    console.log('Usage: node similarity_checker.js <game_data.json>');
    console.log('       node similarity_checker.js --test');
    return;
  }

  if (args[0] === '--test') {
    // Test with sample data
    const testGame = {
      title: 'Test Bouncing Game',
      tags: ['player:bounce', 'field:holes', 'weapon:artillery'],
      mechanics: [['jump', 'bounce'], ['avoid', 'fall']],
      victoryCondition: 'Survive as long as possible while bouncing',
      playerControl: 'Press button to jump higher'
    };

    console.log('Testing similarity checker...');
    const report = checkProposedGame(testGame);
    console.log(JSON.stringify(report, null, 2));
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
    const report = checkProposedGame(gameData);
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(`Error processing input file: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  loadExistingGames,
  calculateSimilarity,
  checkGameSimilarity,
  checkProposedGame,
  generateSimilarityReport
};