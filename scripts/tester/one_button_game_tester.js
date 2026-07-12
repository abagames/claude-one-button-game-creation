/**
 * One-Button Game Testing Framework
 *
 * A data-driven approach to evaluate one-button game designs
 * through automated input pattern simulation and metrics analysis.
 *
 * This file re-exports all components from split modules for backward compatibility.
 */

const path = require("path");
const fs = require("fs");

// Import from split modules
const { Xorshift128, setGlobalSeed, getRandom } = require("./tester_random");
const { Vector } = require("./tester_vector");
const { EventType, EventLogger } = require("./tester_events");
const { GameSimulator } = require("./tester_simulator");
const { InputPatternGenerator } = require("./tester_input_patterns");
const { GAIndividual } = require("./tester_ga_individual");
const { GAInputGenerator } = require("./tester_ga_input");
const { GameBalanceIndividual, GameBalanceGA } = require("./tester_ga_balance");
const { GameAnalyzer } = require("./tester_game_analyzer");
const { createCrispGameAdapter } = require("./crisp_game_adapter.js");

// ===== Main Execution =====

// Only run main execution if this file is run directly (not when imported as module)
if (require.main === module) {
  const args = process.argv.slice(2);
  const verbose = args.includes("--verbose") || args.includes("-v");
  const gamePaths = args.filter((a) => !a.startsWith("-"));

  if (gamePaths.length < 1) {
    console.error("Usage: node one_button_game_tester.js <path_to_game.js> [--verbose]");
    console.error("  --verbose, -v  Output detailed logs for game improvement analysis");
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

    // Run monotonous input test (GA test uses ga_tester.js)
    const result = GameAnalyzer.testGame(simulator, gameConcept, gameName, {
      includeGA: false,
      verbose,
    });

    // Output JSON to stdout
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

// Export all classes for external use
module.exports = {
  GameSimulator,
  InputPatternGenerator,
  GAInputGenerator,
  GAIndividual,
  GameBalanceIndividual,
  GameBalanceGA,
  GameAnalyzer,
  EventLogger,
  EventType,
  setGlobalSeed,
  getRandom,
};
