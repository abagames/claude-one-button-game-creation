/**
 * Genetic Algorithm for input pattern optimization
 * Evolves optimal input patterns to maximize game score
 */

const { getRandom, setGlobalSeed } = require("./tester_random");
const { GAIndividual } = require("./tester_ga_individual");

// ===== GA-based Input Pattern Generator =====

/**
 * Genetic Algorithm-based input pattern generator
 * Evolves optimal input patterns to maximize game score
 */
class GAInputGenerator {
  /**
   * Create initial population
   * @param {number} populationSize Number of individuals
   * @param {Object} config Configuration for genome generation
   * @returns {Array<GAIndividual>} Initial population
   */
  static createInitialPopulation(populationSize = 50, config = {}) {
    const {
      minLength = 3,
      maxLength = 15,
      minValue = 50,
      maxValue = 2000,
    } = config;

    const population = [];

    // Add diverse seed individuals (10% of population)
    const seedCount = Math.max(3, Math.floor(populationSize * 0.1));

    // Seed 1: Immediate press pattern (interval=0 first)
    const immediatePress = [];
    for (let j = 0; j < 5; j++) {
      immediatePress.push({
        interval: j === 0 ? 0 : Math.floor(minValue + getRandom() * (maxValue - minValue)),
        duration: Math.floor(minValue + getRandom() * (maxValue - minValue)),
      });
    }
    population.push(new GAIndividual(immediatePress));

    // Seed 2: Hold-heavy pattern (long durations)
    const holdHeavy = [];
    for (let j = 0; j < 3; j++) {
      holdHeavy.push({
        interval: Math.floor(50 + getRandom() * 200),
        duration: Math.floor(500 + getRandom() * 1500),
      });
    }
    population.push(new GAIndividual(holdHeavy));

    // Seed 3: Rhythmic pattern (balanced intervals)
    const rhythmic = [];
    const baseInterval = 200 + Math.floor(getRandom() * 300);
    for (let j = 0; j < 6; j++) {
      rhythmic.push({
        interval: baseInterval + Math.floor(getRandom() * 100 - 50),
        duration: baseInterval + Math.floor(getRandom() * 100 - 50),
      });
    }
    population.push(new GAIndividual(rhythmic));

    // Fill rest with random individuals
    for (let i = seedCount; i < populationSize; i++) {
      const individual = GAIndividual.createRandom(minLength, maxLength, minValue, maxValue);
      // 20% chance to have immediate press (interval=0 for first gene)
      if (getRandom() < 0.2 && individual.genome.length > 0) {
        individual.genome[0].interval = 0;
      }
      population.push(individual);
    }
    return population;
  }

  /**
   * Evaluate fitness of an individual
   * @param {GAIndividual} individual Individual to evaluate
   * @param {GameSimulator} simulator Game simulator instance
   * @param {Object} gameConcept Game concept module
   * @param {Object} simulationParams Simulation parameters
   * @param {number} penaltyCoefficient Penalty for genome length
   * @param {number} survivalWeight Weight for survival time component (default: 0.1)
   * @param {number|null} gameSeed Seed for deterministic game behavior (ensures fair comparison)
   * @returns {number} Fitness score
   */
  static evaluateFitness(
    individual,
    simulator,
    gameConcept,
    simulationParams = {},
    penaltyCoefficient = 1,
    survivalWeight = 0.1,
    gameSeed = null
  ) {
    // Reset both simulator and global RNG seed before each evaluation
    // This ensures identical game behavior for fair fitness comparison between individuals
    if (gameSeed !== null) {
      simulator.setSeed(gameSeed);
      setGlobalSeed(gameSeed);
    }

    const pattern = individual.toInputPattern();
    const result = simulator.simulateGame(
      gameConcept.init,
      gameConcept.update,
      gameConcept.isGameOver,
      gameConcept.getScore,
      simulationParams,
      pattern.length,
      pattern
    );

    // Composite fitness: Score + Survival bonus - Genome length penalty
    // Survival time is in ticks, convert to seconds (60 ticks = 1 second)
    const survivalTimeSeconds = result.duration / 60.0;
    const survivalBonus = survivalTimeSeconds * survivalWeight;

    // Fitness = Score + (survivalTime * survivalWeight) - (genome_length * penalty_coefficient)
    const fitness =
      result.score +
      survivalBonus -
      individual.genome.length * penaltyCoefficient;
    individual.fitness = fitness;
    return fitness;
  }

  /**
   * Tournament selection
   * @param {Array<GAIndividual>} population Population
   * @param {number} tournamentSize Tournament size
   * @returns {GAIndividual} Selected individual
   */
  static tournamentSelection(population, tournamentSize = 3) {
    const tournament = [];
    for (let i = 0; i < tournamentSize; i++) {
      const randomIndex = Math.floor(getRandom() * population.length);
      tournament.push(population[randomIndex]);
    }
    return tournament.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    );
  }

  /**
   * One-point crossover
   * @param {GAIndividual} parent1 First parent
   * @param {GAIndividual} parent2 Second parent
   * @returns {Array<GAIndividual>} Two offspring
   */
  static crossover(parent1, parent2) {
    const point1 = Math.floor(getRandom() * parent1.genome.length);
    const point2 = Math.floor(getRandom() * parent2.genome.length);

    const child1Genome = [
      ...parent1.genome.slice(0, point1),
      ...parent2.genome.slice(point2),
    ];
    const child2Genome = [
      ...parent2.genome.slice(0, point2),
      ...parent1.genome.slice(point1),
    ];

    return [new GAIndividual(child1Genome), new GAIndividual(child2Genome)];
  }

  /**
   * Mutate an individual
   * @param {GAIndividual} individual Individual to mutate
   * @param {number} mutationRate Mutation probability
   * @param {Object} config Configuration for mutation
   */
  static mutate(individual, mutationRate = 0.1, config = {}) {
    const { minValue = 50, maxValue = 2000, minLength = 1 } = config;

    if (getRandom() < mutationRate) {
      const mutationType = getRandom();

      if (mutationType < 0.4) {
        // Value mutation: modify one gene's values
        if (individual.genome.length > 0) {
          const index = Math.floor(getRandom() * individual.genome.length);
          const gene = individual.genome[index];

          if (getRandom() < 0.5) {
            gene.interval = Math.floor(
              minValue + getRandom() * (maxValue - minValue)
            );
          } else {
            gene.duration = Math.floor(
              minValue + getRandom() * (maxValue - minValue)
            );
          }
        }
      } else if (mutationType < 0.7) {
        // Insertion mutation: add a new gene
        const newGene = {
          interval: Math.floor(minValue + getRandom() * (maxValue - minValue)),
          duration: Math.floor(minValue + getRandom() * (maxValue - minValue)),
        };
        const insertPos = Math.floor(
          getRandom() * (individual.genome.length + 1)
        );
        individual.genome.splice(insertPos, 0, newGene);
      } else {
        // Deletion mutation: remove a gene (if length > minLength)
        if (individual.genome.length > minLength) {
          const deletePos = Math.floor(getRandom() * individual.genome.length);
          individual.genome.splice(deletePos, 1);
        }
      }
    }
  }

  /**
   * Evolve population to find optimal input pattern
   * @param {GameSimulator} simulator Game simulator instance
   * @param {Object} gameConcept Game concept module
   * @param {Object} simulationParams Simulation parameters
   * @param {Object} gaConfig GA configuration
   * @returns {Object} Evolution results with best individual
   */
  static evolve(simulator, gameConcept, simulationParams = {}, gaConfig = {}) {
    const {
      populationSize = 50,
      generations = 30,
      tournamentSize = 3,
      crossoverRate = 0.7,
      mutationRate = 0.1,
      penaltyCoefficient = 1,
      eliteCount = 2,
      minLength = 3,
      maxLength = 15,
      minValue = 50,
      maxValue = 2000,
      survivalWeight = 0.1, // Weight for survival time in fitness calculation
      seed = 42, // Default seed for deterministic game evaluation
    } = gaConfig;

    // Create initial population with configured ranges
    let population = this.createInitialPopulation(populationSize, {
      minLength,
      maxLength,
      minValue,
      maxValue,
    });

    // Evaluate initial population
    // Each individual is evaluated against the same game behavior (same seed)
    population.forEach((individual) => {
      try {
        this.evaluateFitness(
          individual,
          simulator,
          gameConcept,
          simulationParams,
          penaltyCoefficient,
          survivalWeight,
          seed
        );
      } catch (err) {
        individual.fitness = -Infinity; // Failed individuals get worst fitness
      }
    });

    let bestIndividual = population.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    );

    const history = {
      generations: [],
      bestFitness: [],
      avgFitness: [],
    };

    // Evolution loop
    for (let gen = 0; gen < generations; gen++) {
      // Sort by fitness
      population.sort((a, b) => b.fitness - a.fitness);

      // Record statistics
      const avgFitness =
        population.reduce((sum, ind) => sum + ind.fitness, 0) /
        population.length;
      history.generations.push(gen);
      history.bestFitness.push(population[0].fitness);
      history.avgFitness.push(avgFitness);

      // Update best individual
      if (population[0].fitness > bestIndividual.fitness) {
        bestIndividual = population[0].clone();
      }

      // Create next generation
      const nextGeneration = [];

      // Elitism: keep top individuals
      for (let i = 0; i < eliteCount; i++) {
        nextGeneration.push(population[i].clone());
      }

      // Generate offspring
      while (nextGeneration.length < populationSize) {
        const parent1 = this.tournamentSelection(population, tournamentSize);
        const parent2 = this.tournamentSelection(population, tournamentSize);

        let offspring;
        if (getRandom() < crossoverRate) {
          offspring = this.crossover(parent1, parent2);
        } else {
          offspring = [parent1.clone(), parent2.clone()];
        }

        // Mutate offspring with configured ranges
        offspring.forEach((child) => {
          this.mutate(child, mutationRate, {
            minValue,
            maxValue,
            minLength,
          });
        });

        nextGeneration.push(...offspring);
      }

      // Trim to population size
      nextGeneration.length = populationSize;

      // Evaluate new generation
      // Each individual is evaluated against the same game behavior (same seed)
      nextGeneration.forEach((individual) => {
        try {
          this.evaluateFitness(
            individual,
            simulator,
            gameConcept,
            simulationParams,
            penaltyCoefficient,
            survivalWeight,
            seed
          );
        } catch (err) {
          individual.fitness = -Infinity;
        }
      });

      population = nextGeneration;
    }

    return {
      bestIndividual,
      bestFitness: bestIndividual.fitness,
      history,
    };
  }
}

module.exports = { GAInputGenerator };
