/**
 * Input pattern generators for game testing
 * Generates various monotonous input patterns for baseline testing
 */

// ===== Input Pattern Generator =====

/**
 * Generates various input patterns for testing
 */
class InputPatternGenerator {
  /**
   * Generate a pattern with no button presses
   * @param {number} duration Total duration
   * @returns {Array} Array of zeros
   */
  static generateNoInputPattern(duration = 3600) {
    return Array(duration).fill(0);
  }

  /**
   * Generate a pattern with constant button holding
   * @param {number} duration Total duration
   * @returns {Array} Array of ones
   */
  static generateHoldOnlyPattern(duration = 3600) {
    return Array(duration).fill(1);
  }

  /**
   * Generate a pattern with regular button mashing
   * @param {number} pressDuration Duration of each press
   * @param {number} releaseDuration Duration between presses
   * @param {number} cycles Number of press-release cycles
   * @returns {Array} Array of alternating 1s and 0s
   */
  static generateSpamPattern(
    pressDuration = 3,
    releaseDuration = 3,
    cycles = 100
  ) {
    const pattern = [];
    for (let i = 0; i < cycles; i++) {
      for (let p = 0; p < pressDuration; p++) pattern.push(1);
      for (let r = 0; r < releaseDuration; r++) pattern.push(0);
    }
    // Ensure minimum length
    while (pattern.length < pressDuration + releaseDuration) {
      pattern.push(0);
    }
    return pattern;
  }
}

module.exports = { InputPatternGenerator };
