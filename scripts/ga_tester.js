#!/usr/bin/env node
/**
 * GA-enabled game tester
 * Runs simulation with genetic algorithm optimization
 * Outputs raw facts only (no evaluation/judgment)
 */

const path = require("path");
const fs = require("fs");
const {
  GameSimulator,
  GameAnalyzer,
} = require("./one_button_game_tester.js");
const { createCrispGameAdapter } = require("./crisp_game_adapter.js");

// Configuration
const GA_CONFIG = {
  populationSize: 50,
  generations: 30,
  timeRanges: [
    { minValue: 30, maxValue: 500 },
    { minValue: 100, maxValue: 1500 },
  ],
};

function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes("--verbose") || args.includes("-v");
  const progress = args.includes("--progress") || args.includes("-p");
  const gamePaths = args.filter((a) => !a.startsWith("-"));

  if (gamePaths.length < 1) {
    console.error("Usage: node ga_tester.js <path_to_game.js> [--verbose] [--progress]");
    console.error("  --verbose, -v  Output detailed logs for game improvement analysis");
    console.error("  --progress, -p Output GA progress logs to stderr");
    process.exit(1);
  }

  const gamePath = path.resolve(gamePaths[0]);
  const gameName = path.basename(gamePath, ".js");

  if (!fs.existsSync(gamePath)) {
    console.error(JSON.stringify({ error: `File not found: ${gamePath}` }));
    process.exit(1);
  }

  try {
    const simulator = new GameSimulator();
    const gameConcept = createCrispGameAdapter(gamePath);
    const startedAt = Date.now();
    const progressCallback = progress
      ? ({ generation, generations, bestFitness, avgFitness, rangeIndex, totalRanges }) => {
          const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
          console.error(
            `[GA] range ${rangeIndex + 1}/${totalRanges} gen ${generation + 1}/${generations}` +
              ` best=${bestFitness.toFixed(3)} avg=${avgFitness.toFixed(3)} elapsed=${elapsedSec}s`
          );
        }
      : null;

    // Run test with GA enabled
    const result = GameAnalyzer.testGame(simulator, gameConcept, gameName, {
      includeGA: true,
      gaConfig: GA_CONFIG,
      verbose,
      progressCallback,
    });

    // Output JSON to stdout
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

main();
