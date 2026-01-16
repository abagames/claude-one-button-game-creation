/**
 * Random number generation utilities for game testing
 * Provides deterministic (seedable) random number generation
 */

// ===== Xorshift128 Random Number Generator =====

/**
 * Xorshift128 pseudo-random number generator
 * Fast, deterministic, and seedable PRNG suitable for game testing
 */
class Xorshift128 {
  /**
   * Initialize Xorshift128 with a seed
   * @param {number} seed Seed value (default: 123456789)
   */
  constructor(seed = 123456789) {
    // Initialize state with seed using simple linear congruential generator
    this.x = seed >>> 0;
    this.y = 362436069;
    this.z = 521288629;
    this.w = 88675123;

    // Warm up the generator to avoid initial state correlation
    for (let i = 0; i < 10; i++) {
      this.next();
    }
  }

  /**
   * Generate next random uint32
   * @returns {number} Random 32-bit unsigned integer
   */
  nextUint32() {
    const t = this.x ^ (this.x << 11);
    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8));
    return this.w >>> 0;
  }

  /**
   * Generate next random float in [0, 1)
   * @returns {number} Random float
   */
  next() {
    return this.nextUint32() / 0x100000000;
  }

  /**
   * Generate random integer in [min, max]
   * @param {number} min Minimum value (inclusive)
   * @param {number} max Maximum value (inclusive)
   * @returns {number} Random integer
   */
  nextInt(min, max) {
    return Math.floor(min + this.next() * (max - min + 1));
  }

  /**
   * Generate random float in [min, max)
   * @param {number} min Minimum value
   * @param {number} max Maximum value
   * @returns {number} Random float
   */
  nextFloat(min, max) {
    return min + this.next() * (max - min);
  }
}

// ===== Global Random Number Generator =====

/**
 * Global random number generator for deterministic simulations
 * Used by GA classes that don't have direct access to GameSimulator
 */
let globalRng = null;

/**
 * Set global random seed for all framework operations
 * @param {number|null} seed Seed value (null for non-deterministic)
 */
function setGlobalSeed(seed) {
  if (seed !== null) {
    globalRng = new Xorshift128(seed);
  } else {
    globalRng = null;
  }
}

/**
 * Get random number using global RNG if available, otherwise Math.random()
 * @returns {number} Random float in [0, 1)
 */
function getRandom() {
  if (globalRng) {
    return globalRng.next();
  }
  return Math.random();
}

module.exports = {
  Xorshift128,
  setGlobalSeed,
  getRandom,
};
