#!/usr/bin/env node
/**
 * Test a Crisp game using the game-testing-framework.js
 *
 * Integrates the monotonous input testing system for game quality evaluation.
 */

const path = require('path');
const fs = require('fs');
const { GameSimulator, GameAnalyzer } = require('./game-testing-framework.js');
const { createCrispGameAdapter } = require('./crisp_game_adapter.js');

function parseArgs(argv) {
  const opts = { useGA: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slug') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --slug');
      }
      opts.slug = argv[i + 1];
      i += 1;
    } else if (arg === '--game-path') {
      if (i + 1 >= argv.length) {
        throw new Error('Missing value for --game-path');
      }
      opts.gamePath = argv[i + 1];
      i += 1;
    } else if (arg === '--use-ga') {
      opts.useGA = true;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      throw new Error(`Unexpected argument: ${arg}`);
    }
  }
  if (!opts.slug && !opts.gamePath) {
    throw new Error('Expected --slug <slug> or --game-path <path>');
  }
  return opts;
}

function main() {
  const argv = process.argv.slice(2);
  let options;

  try {
    options = parseArgs(argv);
  } catch (err) {
    console.error(`Argument error: ${err.message}`);
    console.error('Usage: node test_game_framework.js --slug <slug>');
    console.error('   or: node test_game_framework.js --game-path <path>');
    process.exit(1);
  }

  // Determine game path
  let gamePath;
  let gameName;
  if (options.gamePath) {
    gamePath = path.resolve(options.gamePath);
    gameName = path.basename(gamePath, '.js');
  } else {
    const ROOT = path.join(__dirname, '..');
    const protoDir = path.join(ROOT, 'tmp', 'prototypes', options.slug);
    gamePath = path.join(protoDir, 'game.js');
    gameName = options.slug;
  }

  // Verify game file exists
  if (!fs.existsSync(gamePath)) {
    console.error(`Game file not found: ${gamePath}`);
    process.exit(1);
  }

  console.log(`Testing game: ${gameName}`);
  console.log(`Game path: ${gamePath}`);

  try {
    // Create adapter for the Crisp game
    const gameAdapter = createCrispGameAdapter(gamePath);

    // Create simulator instance
    const simulator = new GameSimulator();

    // Run comprehensive evaluation (monotonous tests + optional GA)
    const results = GameAnalyzer.evaluateGameComprehensive(
      simulator,
      gameAdapter,
      gameName,
      { includeGA: options.useGA }
    );

    // Output JSON result for programmatic consumption
    const jsonOutput = {
      gameName: results.gameName,
      monotonousResults: {
        isHighlyVulnerable: results.monotonousResults.isHighlyVulnerable,
        isModeratelyVulnerable: results.monotonousResults.isModeratelyVulnerable,
        averageMonotonousScore: results.monotonousResults.averageMonotonousScore,
        maxSurvivalTime: results.monotonousResults.maxSurvivalTime,
        patterns: results.monotonousResults.patternResults,
      },
      gaResults: results.gaResults ? {
        isHighlyVulnerable: results.gaResults.isHighlyVulnerable,
        isModeratelyVulnerable: results.gaResults.isModeratelyVulnerable,
        bestScore: results.gaResults.bestScore,
        bestSurvivalTime: results.gaResults.bestSurvivalTime,
        bestGenomeLength: results.gaResults.bestGenome.length,
        generationsRun: results.gaResults.generationsRun,
      } : null,
      evaluation: {
        monotonousInputScore: results.evaluation.monotonousInputScore,
        gaResistanceScore: results.evaluation.gaResistanceScore,
        totalScore: results.evaluation.totalScore,
        maxScore: results.evaluation.maxScore,
        rating: results.evaluation.rating,
        strengths: results.evaluation.strengths,
        weaknesses: results.evaluation.weaknesses,
      },
      recommendations: results.recommendations,
    };

    console.log('\n===== JSON Output =====');
    console.log(JSON.stringify(jsonOutput, null, 2));

    // Exit with status based on rating
    if (results.evaluation.rating === 'ERROR') {
      process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error(`\n### ERROR during testing ###`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
