/**
 * GA Individual representation for input pattern optimization
 * Represents a single input pattern genome in the genetic algorithm
 */

const { getRandom } = require("./tester_random");

// ===== GA-based Input Pattern Generator =====

/**
 * Represents an individual (genome) in the genetic algorithm
 * Genome format: [(interval_ms, duration_ms), ...]
 */
class GAIndividual {
  /**
   * Create a new individual
   * @param {Array<{interval: number, duration: number}>} genome Array of input pairs
   */
  constructor(genome = []) {
    this.genome = genome;
    this.fitness = 0;
  }

  /**
   * Create a random individual
   * @param {number} minLength Minimum genome length
   * @param {number} maxLength Maximum genome length
   * @param {number} minValue Minimum value for interval/duration (ms)
   * @param {number} maxValue Maximum value for interval/duration (ms)
   * @returns {GAIndividual} New random individual
   */
  static createRandom(
    minLength = 3,
    maxLength = 15,
    minValue = 50,
    maxValue = 2000
  ) {
    const length = Math.floor(
      minLength + getRandom() * (maxLength - minLength + 1)
    );
    const genome = [];
    for (let i = 0; i < length; i++) {
      genome.push({
        interval: Math.floor(minValue + getRandom() * (maxValue - minValue)),
        duration: Math.floor(minValue + getRandom() * (maxValue - minValue)),
      });
    }
    return new GAIndividual(genome);
  }

  /**
   * Clone this individual
   * @returns {GAIndividual} Deep copy of this individual
   */
  clone() {
    return new GAIndividual(this.genome.map((g) => ({ ...g })));
  }

  /**
   * Convert genome to flat input pattern array
   * @param {number} maxTicks Maximum ticks to generate
   * @returns {Array<number>} Flat array [0,1,0,1,...] for simulation
   */
  toInputPattern(maxTicks = 3600) {
    const pattern = [];
    let genomeIndex = 0;

    while (pattern.length < maxTicks) {
      const gene = this.genome[genomeIndex % this.genome.length];

      // Convert ms to ticks (assuming 60 FPS, so 1 tick = 16.67ms)
      // Allow interval=0 for immediate button press at start
      const intervalTicks = Math.max(0, Math.round(gene.interval / 16.67));
      const durationTicks = Math.max(1, Math.round(gene.duration / 16.67));

      // Add interval (button not pressed)
      for (let i = 0; i < intervalTicks && pattern.length < maxTicks; i++) {
        pattern.push(0);
      }

      // Add duration (button pressed)
      for (let i = 0; i < durationTicks && pattern.length < maxTicks; i++) {
        pattern.push(1);
      }

      genomeIndex++;
    }

    return pattern;
  }
}

module.exports = { GAIndividual };
