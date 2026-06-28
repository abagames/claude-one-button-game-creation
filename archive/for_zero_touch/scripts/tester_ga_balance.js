/**
 * Genetic Algorithm for game balance parameter optimization
 * Optimizes game parameters to achieve target score and survival time
 */

const path = require("path");
const fs = require("fs");
const { injectParameters } = require("./dynamic_game_injector.js");
const { createCrispGameAdapter } = require("./crisp_game_adapter.js");

// ===== Game Balance GA =====

/**
 * Represents an individual game balance parameter set
 */
class GameBalanceIndividual {
  /**
   * @param {Array} parameterSpec - Array of parameter definitions from balance_params.json
   * @param {Object} values - Optional initial parameter values { path: value }
   */
  constructor(parameterSpec, values = null) {
    this.parameterSpec = parameterSpec;
    this.genome = new Map();
    this.fitness = Infinity; // Minimize fitness (distance from target)

    if (values) {
      // Use provided values
      for (const param of parameterSpec) {
        this.genome.set(param.path, values[param.path] || param.currentValue);
      }
    } else {
      // Initialize with current values
      for (const param of parameterSpec) {
        this.genome.set(param.path, param.currentValue);
      }
    }
  }

  /**
   * Create a random individual with values within suggested ranges
   */
  static createRandom(parameterSpec) {
    const values = {};
    for (const param of parameterSpec) {
      const range = param.suggestedMax - param.suggestedMin;
      values[param.path] = param.suggestedMin + Math.random() * range;
    }
    return new GameBalanceIndividual(parameterSpec, values);
  }

  /**
   * Create a clone of this individual
   */
  clone() {
    const values = {};
    for (const [path, value] of this.genome.entries()) {
      values[path] = value;
    }
    const cloned = new GameBalanceIndividual(this.parameterSpec, values);
    cloned.fitness = this.fitness;
    return cloned;
  }

  /**
   * Mutate one random parameter within its suggested range
   */
  mutate() {
    const params = Array.from(this.genome.keys());
    const mutateIndex = Math.floor(Math.random() * params.length);
    const mutatePath = params[mutateIndex];

    const paramSpec = this.parameterSpec.find((p) => p.path === mutatePath);
    if (!paramSpec) return;

    const range = paramSpec.suggestedMax - paramSpec.suggestedMin;
    const currentValue = this.genome.get(mutatePath);

    // Gaussian mutation with standard deviation = 10% of range
    const sigma = range * 0.1;
    let newValue = currentValue + (Math.random() - 0.5) * 2 * sigma;

    // Clamp to valid range
    newValue = Math.max(
      paramSpec.suggestedMin,
      Math.min(paramSpec.suggestedMax, newValue)
    );

    this.genome.set(mutatePath, newValue);
  }

  /**
   * Get parameter values as a plain object
   */
  getValues() {
    const obj = {};
    for (const [path, value] of this.genome.entries()) {
      obj[path] = value;
    }
    return obj;
  }
}

/**
 * Genetic Algorithm for game balance parameter optimization
 */
class GameBalanceGA {
  /**
   * Evolve game balance parameters to achieve target score and survival time
   *
   * @param {GameSimulator} simulator - Game simulator instance
   * @param {string} gameCode - Original game source code
   * @param {Array<number>} fixedInputPattern - Fixed player input pattern from Player GA
   * @param {Array} parameterSpec - Parameter specifications from balance_params.json
   * @param {Object} targetMetrics - Target metrics { score: number, survivalTime: number }
   * @param {Object} simulationParams - Base simulation parameters
   * @param {Object} gaConfig - GA configuration
   * @returns {Object} Evolution results
   */
  static evolve(
    simulator,
    gameCode,
    fixedInputPattern,
    parameterSpec,
    targetMetrics = { score: 100, survivalTime: 60 },
    simulationParams = {},
    gaConfig = {}
  ) {
    const config = {
      populationSize: gaConfig.populationSize || 30,
      generations: gaConfig.generations || 20,
      mutationRate: gaConfig.mutationRate || 0.3,
      tournamentSize: gaConfig.tournamentSize || 3,
      eliteCount: gaConfig.eliteCount || 2,
      gapWeight: gaConfig.gapWeight || 2.0, // Score gap between GA and monotonous
      scoreWeight: gaConfig.scoreWeight || 1.0, // Target score proximity
      timeWeight: gaConfig.timeWeight || 0.5, // Target time proximity
      minScoreGap: gaConfig.minScoreGap || 20, // Minimum required score gap
      ...gaConfig,
    };

    // Initialize population with random parameter sets
    let population = [];
    for (let i = 0; i < config.populationSize; i++) {
      if (i === 0) {
        // First individual uses current values as baseline
        population.push(new GameBalanceIndividual(parameterSpec));
      } else {
        population.push(GameBalanceIndividual.createRandom(parameterSpec));
      }
    }

    let bestIndividual = null;
    let bestFitness = Infinity;
    const history = [];

    for (let gen = 0; gen < config.generations; gen++) {
      // Evaluate fitness for all individuals
      for (const individual of population) {
        const paramValues = individual.getValues();

        try {
          // Inject parameters into game code (returns object when verifyChanges=true)
          const injectionResult = injectParameters(
            gameCode,
            paramValues,
            parameterSpec,
            {
              verbose: false,
              verifyChanges: true,
            }
          );

          // Check if injection was successful
          if (injectionResult.successCount < injectionResult.totalCount) {
            // Some parameters failed to inject - penalize heavily
            if (gen === 0 && population.indexOf(individual) === 0) {
              // First individual (baseline) should always succeed - log error if it fails
              console.warn(
                `Warning: Baseline individual injection failed (${injectionResult.successCount}/${injectionResult.totalCount})`
              );
            }
            individual.fitness = Infinity;
            continue;
          }

          const modifiedCode = injectionResult.code;

          // Create temporary file for modified game
          const tmpDir = path.join(__dirname, "tmp", "balance_ga");
          if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
          }
          const tmpGamePath = path.join(
            tmpDir,
            `gen${gen}_ind${population.indexOf(individual)}.js`
          );
          fs.writeFileSync(tmpGamePath, modifiedCode, "utf8");

          // Load modified game concept using Crisp Game Adapter
          const gameConcept = createCrispGameAdapter(tmpGamePath);

          // Simulate game with GA input pattern
          const gaResult = simulator.simulateGame(
            gameConcept.init,
            gameConcept.update,
            gameConcept.isGameOver,
            gameConcept.getScore,
            simulationParams,
            fixedInputPattern.length,
            fixedInputPattern
          );

          // Simulate game with monotonous input patterns
          const monotonousPatterns = {
            NoInput: [],
            HoldOnly: Array(600).fill(true), // 10 seconds hold
            SpamPress: Array(600)
              .fill(0)
              .map((_, i) => i % 2 === 0), // Alternating
          };

          let maxMonotonousScore = 0;
          for (const [patternName, pattern] of Object.entries(
            monotonousPatterns
          )) {
            try {
              const monoResult = simulator.simulateGame(
                gameConcept.init,
                gameConcept.update,
                gameConcept.isGameOver,
                gameConcept.getScore,
                simulationParams,
                pattern.length,
                pattern
              );
              maxMonotonousScore = Math.max(
                maxMonotonousScore,
                monoResult.score
              );
            } catch (err) {
              // Ignore failed monotonous tests
            }
          }

          // Calculate score gap (higher is better for skill-based gameplay)
          const scoreGap = gaResult.score - maxMonotonousScore;

          // Fitness components
          const gapFitness = -scoreGap; // Negative because we minimize fitness (larger gap = better)
          const scoreDiff = Math.abs(targetMetrics.score - gaResult.score);
          const timeDiff = Math.abs(
            targetMetrics.survivalTime - gaResult.duration / 60.0
          );

          // Multi-objective fitness (minimize)
          individual.fitness =
            config.gapWeight * gapFitness + // Prioritize score gap
            config.scoreWeight * scoreDiff + // Target score proximity
            config.timeWeight * timeDiff; // Target time proximity

          // Penalty for insufficient score gap
          if (scoreGap < config.minScoreGap) {
            individual.fitness += (config.minScoreGap - scoreGap) * 10;
          }

          // Clean up temp file
          fs.unlinkSync(tmpGamePath);
        } catch (error) {
          // Penalize failed simulations heavily
          individual.fitness = Infinity;
          console.warn(`Simulation failed for individual: ${error.message}`);
        }

        // Track best individual
        if (individual.fitness < bestFitness) {
          bestFitness = individual.fitness;
          bestIndividual = individual.clone();
        }
      }

      // Record generation statistics
      const avgFitness =
        population.reduce(
          (sum, ind) => sum + (ind.fitness === Infinity ? 1000 : ind.fitness),
          0
        ) / population.length;
      history.push({
        generation: gen,
        bestFitness,
        avgFitness,
      });

      // Check for convergence
      if (bestFitness < 1.0) {
        // Very close to target, can stop early
        break;
      }

      // Selection and reproduction
      const newPopulation = [];

      // Elitism: carry over best individuals
      const sorted = population.slice().sort((a, b) => a.fitness - b.fitness);
      for (let i = 0; i < config.eliteCount; i++) {
        newPopulation.push(sorted[i].clone());
      }

      // Generate rest of population through tournament selection and mutation
      while (newPopulation.length < config.populationSize) {
        // Tournament selection
        const parent = this.tournamentSelect(population, config.tournamentSize);
        const child = parent.clone();

        // Mutation
        if (Math.random() < config.mutationRate) {
          child.mutate();
        }

        newPopulation.push(child);
      }

      population = newPopulation;
    }

    return {
      bestIndividual,
      bestFitness,
      bestParameters: bestIndividual ? bestIndividual.getValues() : null,
      history,
      generationsRun: history.length,
    };
  }

  /**
   * Tournament selection
   */
  static tournamentSelect(population, tournamentSize) {
    let best = null;
    for (let i = 0; i < tournamentSize; i++) {
      const candidate =
        population[Math.floor(Math.random() * population.length)];
      if (!best || candidate.fitness < best.fitness) {
        best = candidate;
      }
    }
    return best;
  }
}

module.exports = {
  GameBalanceIndividual,
  GameBalanceGA,
};
