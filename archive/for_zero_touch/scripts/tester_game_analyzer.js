/**
 * Game analyzer for testing and evaluation
 * Orchestrates monotonous and GA-optimized pattern testing
 */

const { setGlobalSeed } = require("./tester_random");
const { InputPatternGenerator } = require("./tester_input_patterns");
const { GAInputGenerator } = require("./tester_ga_input");

// ===== Game Analyzer =====

/**
 * Analyzes game test results to evaluate game quality
 */
class GameAnalyzer {
  /**
   * Test the game concept against predefined monotonous input patterns
   * to check for exploitability or lack of engagement.
   *
   * @param {GameSimulator} simulator Game simulator instance
   * @param {object} gameConcept Loaded game concept module
   * @param {Object} simulationParams Parameters for the game simulation
   * @param {Object} options Test options { verbose: boolean }
   * @returns {Object} Results including pattern scores and optional detailed logs
   */
  static testMonotonousPatterns(simulator, gameConcept, simulationParams = {}, options = {}) {
    const { verbose = false } = options;

    // Regenerate patterns using the new flat format
    const patterns = {
      NoInput: InputPatternGenerator.generateNoInputPattern(),
      HoldOnly: InputPatternGenerator.generateHoldOnlyPattern(),
      SpamPress: InputPatternGenerator.generateSpamPattern(),
    };
    const patternResults = {};
    let maxDuration = 0;
    let detailedLogs = verbose ? {} : null;

    Object.entries(patterns).forEach(([name, pattern]) => {
      try {
        const result = simulator.simulateGame(
          gameConcept.init,
          gameConcept.update,
          gameConcept.isGameOver,
          gameConcept.getScore,
          simulationParams,
          pattern.length,
          pattern,
          gameConcept,
          verbose ? { enabled: true } : null
        );
        patternResults[name] = {
          survivalTime: result.duration / 60.0,
          score: typeof result.score === "number" ? result.score : 0,
        };
        if (result.duration > maxDuration) {
          maxDuration = result.duration;
        }
        // Store detailed log if verbose mode
        if (verbose && result.log) {
          detailedLogs[name] = result.log;
        }
      } catch (simError) {
        patternResults[name] = { survivalTime: 0, score: 0, error: simError.message };
      }
    });

    // Calculate summary statistics
    const scores = Object.values(patternResults).map((r) => r.score);
    const survivalTimes = Object.values(patternResults).map((r) => r.survivalTime);

    const result = {
      patterns: patternResults,
      summary: {
        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        maxScore: Math.max(...scores),
        avgSurvivalTime: survivalTimes.reduce((a, b) => a + b, 0) / survivalTimes.length,
        maxSurvivalTime: Math.max(...survivalTimes),
      },
    };

    if (verbose && detailedLogs) {
      result.detailedLogs = detailedLogs;
    }

    return result;
  }

  /**
   * Test the game using GA-optimized input patterns
   * Evolves input patterns to maximize score and detect exploitability
   *
   * @param {GameSimulator} simulator Game simulator instance
   * @param {object} gameConcept Loaded game concept module
   * @param {Object} simulationParams Parameters for the game simulation
   * @param {Object} gaConfig GA configuration options
   * @param {Object} options Test options { verbose: boolean }
   * @returns {Object} Results including best score, pattern, and evolution history
   */
  static testGAOptimizedPatterns(
    simulator,
    gameConcept,
    simulationParams = {},
    gaConfig = {},
    options = {}
  ) {
    const { verbose = false } = options;
    const defaultGAConfig = {
      populationSize: 30,
      generations: 20,
      tournamentSize: 3,
      crossoverRate: 0.7,
      mutationRate: 0.1,
      penaltyCoefficient: 0.1, // Reduced from 0.5 to allow longer genomes
      eliteCount: 2,
      seed: 42, // Default fixed seed for deterministic evaluation
      minLength: 5, // Increased from 3 to allow more diverse patterns
      maxLength: 30, // Increased from 15 to allow longer patterns
      timeRanges: null, // Optional: array of {minValue, maxValue} objects for multi-range search
      survivalWeight: 0.1, // Weight for survival time in fitness (0.1 = 1 second = 10% of 1 score point)
    };

    const config = { ...defaultGAConfig, ...gaConfig };

    // Set fixed seed for deterministic evaluation
    if (config.seed !== null && config.seed !== undefined) {
      simulator.setSeed(config.seed);
      setGlobalSeed(config.seed);
    }

    try {
      // If timeRanges is specified, run multiple GA searches with different time ranges
      const timeRanges = config.timeRanges || [
        { minValue: 50, maxValue: 2000 },
      ];

      let bestOverallResult = null;
      let bestOverallScore = -Infinity;

      for (let i = 0; i < timeRanges.length; i++) {
        const range = timeRanges[i];

        const rangeConfig = {
          ...config,
          minValue: range.minValue,
          maxValue: range.maxValue,
          minLength: config.minLength,
          maxLength: config.maxLength,
        };

        const evolutionResult = GAInputGenerator.evolve(
          simulator,
          gameConcept,
          simulationParams,
          rangeConfig
        );

        // Simulate one more time with best pattern to get survival time and detailed log
        const bestPattern = evolutionResult.bestIndividual.toInputPattern();
        const finalResult = simulator.simulateGame(
          gameConcept.init,
          gameConcept.update,
          gameConcept.isGameOver,
          gameConcept.getScore,
          simulationParams,
          bestPattern.length,
          bestPattern,
          gameConcept,
          verbose ? { enabled: true } : null
        );

        // Track best result across all ranges
        if (finalResult.score > bestOverallScore) {
          bestOverallScore = finalResult.score;
          bestOverallResult = {
            score: finalResult.score,
            survivalTime: finalResult.duration / 60.0,
            genome: evolutionResult.bestIndividual.genome,
            fitness: evolutionResult.bestFitness,
            evolutionHistory: evolutionResult.history,
            rangeUsed: range,
            rangeIndex: i,
            detailedLog: verbose ? finalResult.log : null,
          };
        }
      }

      // If no successful result found, return error
      if (bestOverallResult === null) {
        throw new Error("All time ranges failed to produce valid results");
      }

      const result = {
        bestScore: bestOverallResult.score,
        bestSurvivalTime: bestOverallResult.survivalTime,
        bestGenomeLength: bestOverallResult.genome.length,
        generationsRun: config.generations,
        populationSize: config.populationSize,
      };

      // Include detailed log if verbose mode
      if (verbose && bestOverallResult.detailedLog) {
        result.detailedLog = bestOverallResult.detailedLog;
      }

      return result;
    } catch (error) {
      console.error("Error during GA evolution:", error.message);
      return {
        bestScore: 0,
        bestSurvivalTime: 0,
        bestGenomeLength: 0,
        generationsRun: 0,
        error: error.message,
      };
    }
  }

  /**
   * Run game test and return raw simulation data (facts only, no evaluation)
   * @param {GameSimulator} simulator Game simulator instance
   * @param {object} gameConcept Loaded game concept module { init, update, isGameOver, getScore }
   * @param {string} gameName Name of the game (derived from file path)
   * @param {Object} options Test options { includeGA: boolean, gaConfig: object, verbose: boolean }
   * @returns {Object} Raw test results
   */
  static testGame(simulator, gameConcept, gameName, options = {}) {
    const { includeGA = false, gaConfig = {}, verbose = false } = options;

    const standardSimulationParams = {
      worldWidth: 100,
      worldHeight: 100,
    };

    const result = {
      gameName,
      monotonous: null,
      ga: null,
      error: null,
    };

    try {
      // Test monotonous input patterns
      result.monotonous = this.testMonotonousPatterns(
        simulator,
        gameConcept,
        standardSimulationParams,
        { verbose }
      );

      // Test GA-optimized input patterns (if enabled)
      if (includeGA) {
        result.ga = this.testGAOptimizedPatterns(
          simulator,
          gameConcept,
          standardSimulationParams,
          gaConfig,
          { verbose }
        );
      }
    } catch (error) {
      result.error = error.message;
    }

    return result;
  }
}

module.exports = { GameAnalyzer };
