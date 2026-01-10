/**
 * One-Button Game Testing Framework
 *
 * A data-driven approach to evaluate one-button game designs
 * through automated input pattern simulation and metrics analysis.
 */

// Node.js environment setup
const path = require("path");
const fs = require("fs");
const { injectParameters } = require("./dynamic_game_injector.js");
const { createCrispGameAdapter } = require("./crisp_game_adapter.js");

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
    this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
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

// Define crisp-game-lib standard colors
const crispColors = [
  "transparent",
  "white",
  "red",
  "green",
  "yellow",
  "blue",
  "purple",
  "cyan",
  "black",
  "light_red",
  "light_green",
  "light_yellow",
  "light_blue",
  "light_purple",
  "light_cyan",
  "light_black",
];

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

// ===== Game Simulator =====

/**
 * Simple Vector class for 2D operations needed by drawing functions.
 */
class Vector {
  constructor(x = 0, y = 0) {
    if (typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  set(x, y) {
    if (typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mul(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  div(scalar) {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  rotate(angle) {
    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const x = this.x * ca - this.y * sa;
    const y = this.x * sa + this.y * ca;
    this.x = x;
    this.y = y;
    return this;
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

/**
 * Core game simulator that emulates core game functionality
 * for testing purposes, interacting with external game concept modules.
 */
class GameSimulator {
  /**
   * Initialize a new game simulator
   */
  constructor() {
    // Basic simulation variables
    this.ticks = 0;

    // Input simulation
    this.input = {
      pressed: false, // Renamed from isPressed
      justPressed: false, // Renamed from isJustPressed
      justReleased: false, // Renamed from isJustReleased
      heldTime: 0, // Added heldTime in seconds
    };
    this._heldTicks = 0; // Internal counter for heldTime

    // Game state tracking (optional, for events)
    this.events = []; // Keep for potential future event logging
    this.conceptState = {}; // Added to store concept-specific state

    // ---- Crisp-game-lib style collision ----
    /** @type {Array<{pos: {x: number, y: number}, size: {x: number, y: number}, collision: { isColliding: { rect: { [key: string]: boolean }, text: { [key: string]: boolean }, char: { [key: string]: boolean } } } }>} */
    this.hitBoxes = [];
    /** @type {string} */
    this.currentColor = "black"; // Default color similar to crisp-game-lib
    // Store character definitions loaded from the concept
    this.characterDefs = null; // Will be set by loadCharacters
    this.textWidth = 6; // Standard crisp-game-lib text width
    this.textHeight = 6; // Standard crisp-game-lib text height

    // ---- Random number generator (Xorshift128) ----
    this.rng = null; // Will be initialized when seed is set
    this._useSeededRandom = false; // Flag to control random source
  }

  /**
   * Set the random seed for deterministic simulations
   * @param {number|null} seed Seed value (null to use Math.random)
   */
  setSeed(seed) {
    if (seed !== null) {
      this.rng = new Xorshift128(seed);
      this._useSeededRandom = true;
      console.log(`GameSimulator: Seed set to ${seed} (using Xorshift128)`);
    } else {
      this.rng = null;
      this._useSeededRandom = false;
      console.log('GameSimulator: Using non-deterministic Math.random()');
    }
  }

  /**
   * Get random number in [0, 1) using seeded or non-seeded generator
   * @returns {number} Random float
   */
  random() {
    if (this._useSeededRandom && this.rng) {
      return this.rng.next();
    }
    return Math.random();
  }

  /**
   * Load character definitions (simulating crisp-game-lib's 'characters' array)
   * Concepts should call this in their init function if they use char().
   * @param {string[]} characters Character definition array
   */
  loadCharacters(characters) {
    this.characterDefs = characters;
    // Basic validation (can be expanded)
    if (!Array.isArray(characters)) {
      console.warn("Simulator: Invalid character definition format provided.");
      this.characterDefs = null;
    }
  }

  /**
   * Clear hitboxes at the start of a frame.
   * Mimics crisp-game-lib behavior.
   */
  _clearHitBoxes() {
    this.hitBoxes = [];
  }

  /**
   * Check a new hitbox against all existing hitboxes.
   * Mimics crisp-game-lib's checkHitBoxes and testCollision.
   * @param {object} box The new hitbox to check.
   * @returns {object} Collision result object.
   */
  _checkCollision(box) {
    const collision = {
      isColliding: { rect: {}, text: {}, char: {} },
    };
    this.hitBoxes.forEach((r) => {
      // AABB collision test (from crisp-game-lib/src/collision.ts)
      const ox = r.pos.x - box.pos.x;
      const oy = r.pos.y - box.pos.y;
      const overlaps =
        -r.size.x < ox && ox < box.size.x && -r.size.y < oy && oy < box.size.y;

      if (overlaps) {
        // Merge collision flags
        Object.assign(collision.isColliding.rect, r.collision.isColliding.rect);
        Object.assign(collision.isColliding.text, r.collision.isColliding.text);
        Object.assign(collision.isColliding.char, r.collision.isColliding.char);
      }
    });
    return collision;
  }

  /**
   * Add a hitbox to the list for future checks.
   * @param {object} box The hitbox to add.
   */
  _addHitBox(box) {
    // Only add if the color is not transparent (mimics crisp-game-lib)
    if (this.currentColor !== "transparent") {
      this.hitBoxes.push(box);
    }
  }

  /**
   * Set the current "drawing" color for subsequent collision checks.
   * @param {string} colorName Color name (e.g., 'red', 'blue', 'transparent')
   */
  color(colorName) {
    if (crispColors.includes(colorName)) {
      this.currentColor = colorName;
    } else {
      console.warn(
        `Simulator.color: Invalid color name "${colorName}". Using black.`
      );
      this.currentColor = "black";
    }
  }

  /**
   * Simulate drawing a rectangle and check/record collisions.
   * Mimics crisp-game-lib's rect().
   * @param {number | {x: number, y: number}} x Top-left x or position object.
   * @param {number | {x: number, y: number}} y Top-left y or size object.
   * @param {number | {x: number, y: number}} [width] Width or size object.
   * @param {number} [height] Height.
   * @returns {object} Collision result.
   */
  rect(x, y, width, height) {
    let pos = { x: 0, y: 0 };
    let size = { x: 0, y: 0 };

    if (typeof x === "object") {
      pos = { x: x.x, y: x.y };
      if (typeof y === "object") {
        size = { x: y.x, y: y.y };
      } else if (typeof y === "number") {
        size = { x: y, y: width ?? y }; // Use width if provided, else assume square
      }
    } else if (typeof x === "number" && typeof y === "number") {
      pos = { x, y };
      if (typeof width === "object") {
        size = { x: width.x, y: width.y };
      } else if (typeof width === "number") {
        size = { x: width, y: height ?? width }; // Use height if provided, else assume square
      }
    } else {
      console.warn("Simulator.rect: Invalid arguments.");
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    // Normalize negative width/height
    if (size.x < 0) {
      pos.x += size.x;
      size.x *= -1;
    }
    if (size.y < 0) {
      pos.y += size.y;
      size.y *= -1;
    }

    if (size.x === 0 || size.y === 0) {
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    const box = {
      pos: { x: Math.floor(pos.x), y: Math.floor(pos.y) },
      size: { x: Math.trunc(size.x), y: Math.trunc(size.y) },
      collision: { isColliding: { rect: {}, text: {}, char: {} } },
    };
    box.collision.isColliding.rect[this.currentColor] = true;

    const collisionResult = this._checkCollision(box);
    this._addHitBox(box); // Add after checking

    return collisionResult;
  }

  /**
   * Simulate drawing a box (center-aligned rectangle) and check/record collisions.
   * Mimics crisp-game-lib's box().
   * @param {number | {x: number, y: number}} x Center x or position object.
   * @param {number | {x: number, y: number}} y Center y or size object.
   * @param {number | {x: number, y: number}} [width] Width or size object.
   * @param {number} [height] Height.
   * @returns {object} Collision result.
   */
  box(x, y, width, height) {
    let centerPos = { x: 0, y: 0 };
    let size = { x: 0, y: 0 };

    if (typeof x === "object") {
      centerPos = { x: x.x, y: x.y };
      if (typeof y === "object") {
        size = { x: y.x, y: y.y };
      } else if (typeof y === "number") {
        size = { x: y, y: width ?? y }; // Use width if provided, else assume square
      }
    } else if (typeof x === "number" && typeof y === "number") {
      centerPos = { x, y };
      if (typeof width === "object") {
        size = { x: width.x, y: width.y };
      } else if (typeof width === "number") {
        size = { x: width, y: height ?? width }; // Use height if provided, else assume square
      }
    } else {
      console.warn("Simulator.box: Invalid arguments.");
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    // Calculate top-left from center for rect()
    const topLeftX = centerPos.x - size.x / 2;
    const topLeftY = centerPos.y - size.y / 2;

    // Delegate to rect() for actual collision logic
    return this.rect(topLeftX, topLeftY, size.x, size.y);
  }

  /**
   * Simulate drawing text and check/record collisions.
   * Mimics crisp-game-lib's text(). Simplified: Assumes fixed 6x6 size per char.
   * Does not handle rotations, scaling, mirroring, background colors etc.
   * @param {string} str The text string.
   * @param {number | {x: number, y: number}} x Top-left x or position object.
   * @param {number} [y] Top-left y.
   * @returns {object} Collision result for the entire string.
   */
  text(str, x, y) {
    let startPos = { x: 0, y: 0 };
    if (typeof x === "object") {
      startPos = { x: x.x, y: x.y };
    } else if (typeof x === "number" && typeof y === "number") {
      startPos = { x, y };
    } else {
      console.warn("Simulator.text: Invalid arguments.");
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    const aggregatedCollision = {
      isColliding: { rect: {}, text: {}, char: {} },
    };
    let currentX = startPos.x;
    const charWidth = this.textWidth; // Use standard 6px width
    const charHeight = this.textHeight; // Use standard 6px height

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const charCode = char.charCodeAt(0);

      if (charCode < 0x20 || charCode > 0x7e) continue; // Skip non-printable ASCII

      const box = {
        pos: { x: Math.floor(currentX), y: Math.floor(startPos.y) },
        size: { x: charWidth, y: charHeight },
        collision: { isColliding: { rect: {}, text: {}, char: {} } },
      };
      // Text collision uses the character itself as the key
      box.collision.isColliding.text[char] = true;
      // Also mark collision with the current color rect
      box.collision.isColliding.rect[this.currentColor] = true;

      const collisionResult = this._checkCollision(box);
      this._addHitBox(box); // Add after checking

      // Merge results
      Object.assign(
        aggregatedCollision.isColliding.rect,
        collisionResult.isColliding.rect
      );
      Object.assign(
        aggregatedCollision.isColliding.text,
        collisionResult.isColliding.text
      );
      Object.assign(
        aggregatedCollision.isColliding.char,
        collisionResult.isColliding.char
      );

      currentX += charWidth;
    }

    return aggregatedCollision;
  }

  /**
   * Simulate drawing a character sprite and check/record collisions.
   * Mimics crisp-game-lib's char(). Simplified: Assumes fixed 6x6 size.
   * Requires characterDefs to be loaded via loadCharacters().
   * Does not handle rotations, scaling, mirroring etc.
   * @param {string} charStr Character identifier (e.g., 'a', 'b').
   * @param {number | {x: number, y: number}} x Top-left x or position object.
   * @param {number} [y] Top-left y.
   * @returns {object} Collision result.
   */
  char(charStr, x, y) {
    if (!this.characterDefs) {
      console.warn(
        "Simulator.char: Character definitions not loaded. Call loadCharacters() first."
      );
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    if (typeof charStr !== "string" || charStr.length !== 1) {
      console.warn("Simulator.char: Invalid character string provided.");
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    const charCode = charStr.charCodeAt(0);
    const charIndex = charCode - "a".charCodeAt(0); // Assuming 'a' based indexing

    if (charIndex < 0 || charIndex >= this.characterDefs.length) {
      // console.warn(`Simulator.char: Character '${charStr}' not defined.`);
      // Allow checking collisions even if undefined, maybe concept handles it
    }

    let pos = { x: 0, y: 0 };
    if (typeof x === "object") {
      pos = { x: x.x, y: x.y };
    } else if (typeof x === "number" && typeof y === "number") {
      pos = { x, y };
    } else {
      console.warn("Simulator.char: Invalid arguments.");
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    // Simplified: Assume 6x6 size for all characters
    const size = { x: this.textWidth, y: this.textHeight };

    const box = {
      pos: { x: Math.floor(pos.x), y: Math.floor(pos.y) },
      size,
      collision: { isColliding: { rect: {}, text: {}, char: {} } },
    };
    // Char collision uses the character identifier as the key
    box.collision.isColliding.char[charStr] = true;
    // Also mark collision with the current color rect
    box.collision.isColliding.rect[this.currentColor] = true;

    const collisionResult = this._checkCollision(box);
    this._addHitBox(box); // Add after checking

    return collisionResult;
  }

  // --- End of Crisp-game-lib style collision ---

  /**
   * Initialize or reset the game state using the concept's init function
   * @param {Function} gameInitFunction Game-specific initialization function from the concept
   * @param {Object} simulationParams Parameters to pass to the game's init function
   */
  initGame(gameInitFunction, simulationParams = {}) {
    this.ticks = 0;
    this.events = []; // Reset events

    // Reset input state
    this.input.pressed = false;
    this.input.justPressed = false;
    this.input.justReleased = false;
    this.input.heldTime = 0;
    this._heldTicks = 0;

    // Reset concept state
    this.conceptState = {};

    // Reset collision state
    this._clearHitBoxes();
    this.currentColor = "black";
    this.characterDefs = null; // Reset characters, concept must reload

    // Set up global reference for concepts to expose state (use with caution)
    if (typeof global !== "undefined") {
      global.simulator = this; // Provide simulator instance globally
    }

    // Run game-specific initialization
    if (gameInitFunction) {
      // Pass 'this' (the simulator instance) to init
      gameInitFunction(simulationParams, this);
    }
  }

  /**
   * Update input state based on button status
   * @param {boolean} isButtonPressed Whether the button is currently pressed
   */
  updateInput(isButtonPressed) {
    const wasPressed = this.input.pressed;
    this.input.pressed = isButtonPressed;
    this.input.justPressed = isButtonPressed && !wasPressed;
    this.input.justReleased = !isButtonPressed && wasPressed;

    if (this.input.pressed) {
      this._heldTicks++;
    } else {
      this._heldTicks = 0;
    }
    // Assuming 60 ticks per second for heldTime calculation
    this.input.heldTime = this._heldTicks / 60.0;
  }

  /**
   * Simulate one frame of the game
   * @param {Function} updateFunction The concept's update function
   */
  simulateFrame(updateFunction) {
    // Clear collision history for the new frame
    this._clearHitBoxes();

    // Update the game state using the concept's logic
    // Pass the simulator instance ('this') to the update function
    updateFunction(this.input, this);
    this.ticks++;
  }

  /**
   * Get the current state of the game for input generation
   * @returns {Object} Current game state
   */
  getGameState() {
    // NOTE: hitBoxes are NOT included here as they are frame-specific state
    return {
      ticks: this.ticks,
      input: { ...this.input },
      conceptState: this.conceptState || {}, // Return concept state if exposed
    };
  }

  /**
   * Simulate a full game run with a given input pattern
   * @param {Function} initFunction Concept's init function
   * @param {Function} updateFunction Concept's update function
   * @param {Function} isGameOverFunction Concept's isGameOver function
   * @param {Function} getScoreFunction Concept's getScore function
   * @param {Object} simulationParams Parameters for the simulation
   * @param {number} maxTicks Maximum simulation duration
   * @param {Array} inputPattern Predefined input pattern
   * @returns {Object} Simulation results (duration, score)
   */
  simulateGame(
    initFunction,
    updateFunction,
    isGameOverFunction,
    getScoreFunction,
    simulationParams = {},
    maxTicks = 3600,
    inputPattern = [], // Now expects a flat array [0, 1, 0, 1...]
    gameConcept = null // Optional: full game concept for crash detection
  ) {
    this.initGame(initFunction, simulationParams);

    let currentPatternIndex = 0;
    let lastScore = 0;

    while (this.ticks < maxTicks) {
      // Determine input based on the pattern array
      const currentInput = inputPattern[currentPatternIndex] === 1;
      this.updateInput(currentInput);

      // Simulate one frame
      this.simulateFrame(updateFunction);

      // Check if game is over
      if (isGameOverFunction()) {
        break;
      }

      // Update pattern index, loop if necessary
      currentPatternIndex = (currentPatternIndex + 1) % inputPattern.length;
      if (inputPattern.length === 0) currentPatternIndex = 0; // Prevent NaN if pattern is empty

      lastScore = getScoreFunction(); // Update score each tick
    }

    // Check for crashes (if gameConcept supports crash detection)
    const hasCrashed = gameConcept && typeof gameConcept.hasCrashed === 'function'
      ? gameConcept.hasCrashed()
      : false;
    const crashError = gameConcept && typeof gameConcept.getCrashError === 'function'
      ? gameConcept.getCrashError()
      : null;

    // Clean up global reference
    if (typeof global !== "undefined" && global.simulator === this) {
      delete global.simulator;
    }

    return {
      duration: this.ticks,
      score: lastScore,
      hasCrashed,
      crashError,
    };
  }

  /**
   * Object pool for game entities
   * @returns {Object} Object pool with add, processAndFilterItems, and clear methods
   */
  createPool() {
    return {
      items: [],

      // Add new items to the pool
      add(item) {
        this.items.push(item);
        return item; // For chaining
      },

      // Process all items with a callback and remove those where predicate returns true
      processAndFilterItems(callback, predicate) {
        for (let i = this.items.length - 1; i >= 0; i--) {
          const item = this.items[i];

          // Process the item with the callback
          if (callback) {
            callback(item, i);
          }

          // Check if the item should be removed
          if (predicate && predicate(item, i)) {
            this.items.splice(i, 1);
          }
        }
      },

      // Clear all items
      clear() {
        this.items = [];
      },
    };
  }

  // ----- Helper Functions -----

  /**
   * Random function in range
   */
  randomRange(min, max) {
    return min + this.random() * (max - min);
  }

  /**
   * Random integer in range (inclusive)
   */
  randomInt(min, max) {
    return Math.floor(min + this.random() * (max - min + 1));
  }

  /**
   * Check if an object is off-screen
   */
  isOffScreen(x, y, margin = 0) {
    return x < -margin || x > 100 + margin || y < -margin || y > 100 + margin;
  }

  /**
   * Constrain a value between a minimum and maximum
   */
  constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * End the current game
   */
  end() {
    this.events.push({
      type: "gameOver",
      score: this.score,
      tick: this.ticks,
    });
  }

  /**
   * Simulate drawing a line and check/record collisions.
   * Mimics crisp-game-lib's line(). Approximates line with boxes.
   * @param {number | {x: number, y: number}} x1 Start x or vector.
   * @param {number | {x: number, y: number}} y1 Start y or end vector.
   * @param {number | {x: number, y: number}} [x2] End x or thickness.
   * @param {number} [y2] End y.
   * @param {number} [thickness=3] Line thickness.
   * @returns {object} Aggregated collision result.
   */
  line(x1, y1, x2, y2, thickness = 3) {
    const p1 = new Vector();
    const p2 = new Vector();

    if (typeof x1 === "object") {
      // line(vec1, vec2, thickness?)
      p1.set(x1);
      if (typeof y1 === "object") {
        p2.set(y1);
        thickness = typeof x2 === "number" ? x2 : 3;
      } else {
        console.warn("Simulator.line: Invalid arguments for vector input.");
        return { isColliding: { rect: {}, text: {}, char: {} } };
      }
    } else if (typeof x1 === "number" && typeof y1 === "number") {
      // line(x1, y1, x2, y2, thickness?)
      p1.set(x1, y1);
      if (typeof x2 === "number" && typeof y2 === "number") {
        p2.set(x2, y2);
        thickness = typeof thickness === "number" ? thickness : 3;
      } else {
        console.warn("Simulator.line: Invalid arguments for coordinate input.");
        return { isColliding: { rect: {}, text: {}, char: {} } };
      }
    } else {
      console.warn("Simulator.line: Invalid arguments.");
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    const lineVec = p2.clone().sub(p1);
    const length = lineVec.mag();
    const t = Math.floor(this.constrain(thickness, 1, 100)); // Use constrain similar to clamp

    // Avoid division by zero or tiny steps for very short lines
    if (length < 0.1) {
      // Treat very short lines as a single box at the start point
      return this.box(p1.x, p1.y, t, t);
    }

    const segmentCount = this.constrain(
      Math.ceil(length / (t * 0.8)) + 1,
      2,
      99
    ); // Adjusted segment calculation
    const stepVec = lineVec.clone().div(segmentCount - 1);
    const currentPos = p1.clone();

    const aggregatedCollision = {
      isColliding: { rect: {}, text: {}, char: {} },
    };

    for (let i = 0; i < segmentCount; i++) {
      // Use box for center-aligned segments, matching crisp-game-lib's addRect(true,...)
      const collisionResult = this.box(currentPos.x, currentPos.y, t, t);

      // Merge results
      Object.assign(
        aggregatedCollision.isColliding.rect,
        collisionResult.isColliding.rect
      );
      Object.assign(
        aggregatedCollision.isColliding.text,
        collisionResult.isColliding.text
      );
      Object.assign(
        aggregatedCollision.isColliding.char,
        collisionResult.isColliding.char
      );

      currentPos.add(stepVec);
    }

    return aggregatedCollision;
  }

  /**
   * Simulate drawing a bar (rotated line) and check/record collisions.
   * Mimics crisp-game-lib's bar(). Delegates to line().
   * @param {number | {x: number, y: number}} x Center x or position vector.
   * @param {number} y Center y.
   * @param {number} length Bar length.
   * @param {number} thickness Bar thickness.
   * @param {number} [rotate=0] Rotation angle in radians. Crisp uses 0.5=PI? No, seems radians. Let's assume radians.
   * @param {number} [centerPosRatio=0.5] Ratio along the length for the center point.
   * @returns {object} Collision result.
   */
  bar(x, y, length, thickness, rotate = 0, centerPosRatio = 0.5) {
    const center = new Vector();
    if (typeof x === "object") {
      center.set(x);
      // Shift arguments if x is an object
      centerPosRatio = typeof rotate === "number" ? rotate : 0.5;
      rotate = typeof thickness === "number" ? thickness : 0;
      thickness = length;
      length = y;
    } else if (typeof x === "number" && typeof y === "number") {
      center.set(x, y);
    } else {
      console.warn("Simulator.bar: Invalid arguments.");
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    const halfLengthVec = new Vector(length, 0).rotate(rotate); // Vector representing full length and rotation
    const startOffset = halfLengthVec.clone().mul(-centerPosRatio);
    const endOffset = halfLengthVec.clone().mul(1 - centerPosRatio);

    const p1 = center.clone().add(startOffset);
    const p2 = center.clone().add(endOffset);

    return this.line(p1, p2, thickness);
  }

  /**
   * Simulate drawing an arc and check/record collisions.
   * Mimics crisp-game-lib's arc(). Approximates arc with line segments.
   * @param {number | {x: number, y: number}} centerX Center x or position vector.
   * @param {number} centerY Center y or radius.
   * @param {number} [radius] Radius.
   * @param {number} [thickness=3] Arc thickness.
   * @param {number} [angleFrom=0] Start angle (radians).
   * @param {number} [angleTo=Math.PI*2] End angle (radians).
   * @returns {object} Aggregated collision result.
   */
  arc(
    centerX,
    centerY,
    radius,
    thickness = 3,
    angleFrom = 0,
    angleTo = Math.PI * 2
  ) {
    const centerPos = new Vector();
    if (typeof centerX === "object") {
      centerPos.set(centerX);
      // Shift args
      angleTo = typeof angleFrom === "number" ? angleFrom : Math.PI * 2;
      angleFrom = typeof thickness === "number" ? thickness : 0;
      thickness = typeof radius === "number" ? radius : 3;
      radius = centerY;
    } else if (typeof centerX === "number" && typeof centerY === "number") {
      centerPos.set(centerX, centerY);
    } else {
      console.warn("Simulator.arc: Invalid arguments.");
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }

    if (radius === undefined || radius <= 0) {
      console.warn("Simulator.arc: Invalid radius.");
      return { isColliding: { rect: {}, text: {}, char: {} } };
    }
    thickness = Math.max(1, thickness); // Ensure minimum thickness

    let startAngle = angleFrom;
    let endAngle = angleTo;
    if (startAngle > endAngle) {
      [startAngle, endAngle] = [endAngle, startAngle]; // Swap if needed
    }
    let angleDiff = endAngle - startAngle;

    // Handle full circles or large arcs correctly
    angleDiff = this.constrain(angleDiff, 0, Math.PI * 2);

    if (angleDiff < 0.01) {
      // Tiny arc, treat as a single point (or maybe just return empty?)
      // Let's draw a small box at the start angle point
      const p = new Vector(radius, 0).rotate(startAngle).add(centerPos);
      return this.box(p.x, p.y, thickness, thickness);
    }

    // Adjust segment count based on radius and angle diff. Similar to crisp-game-lib logic.
    const segmentCount = this.constrain(
      Math.ceil(angleDiff * Math.sqrt(radius * 0.25)),
      1,
      36
    );
    const angleIncrement = angleDiff / segmentCount;

    let currentAngle = startAngle;
    let p1 = new Vector(radius, 0).rotate(currentAngle).add(centerPos);
    let p2 = new Vector();

    const aggregatedCollision = {
      isColliding: { rect: {}, text: {}, char: {} },
    };

    for (let i = 0; i < segmentCount; i++) {
      currentAngle += angleIncrement;
      p2.set(radius, 0).rotate(currentAngle).add(centerPos); // Set p2 vector components

      const collisionResult = this.line(p1, p2, thickness);

      // Merge results
      Object.assign(
        aggregatedCollision.isColliding.rect,
        collisionResult.isColliding.rect
      );
      Object.assign(
        aggregatedCollision.isColliding.text,
        collisionResult.isColliding.text
      );
      Object.assign(
        aggregatedCollision.isColliding.char,
        collisionResult.isColliding.char
      );

      p1.set(p2); // Update p1 for the next segment
    }

    return aggregatedCollision;
  }
}

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
  static createRandom(minLength = 3, maxLength = 15, minValue = 50, maxValue = 2000) {
    const length = Math.floor(minLength + getRandom() * (maxLength - minLength + 1));
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
    return new GAIndividual(this.genome.map(g => ({ ...g })));
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
      const intervalTicks = Math.max(1, Math.round(gene.interval / 16.67));
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
    for (let i = 0; i < populationSize; i++) {
      population.push(GAIndividual.createRandom(minLength, maxLength, minValue, maxValue));
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
   * @returns {number} Fitness score
   */
  static evaluateFitness(
    individual,
    simulator,
    gameConcept,
    simulationParams = {},
    penaltyCoefficient = 1,
    survivalWeight = 0.1
  ) {
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
    const fitness = result.score + survivalBonus - (individual.genome.length * penaltyCoefficient);
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
    const {
      minValue = 50,
      maxValue = 2000,
      minLength = 1,
    } = config;

    if (getRandom() < mutationRate) {
      const mutationType = getRandom();

      if (mutationType < 0.4) {
        // Value mutation: modify one gene's values
        if (individual.genome.length > 0) {
          const index = Math.floor(getRandom() * individual.genome.length);
          const gene = individual.genome[index];

          if (getRandom() < 0.5) {
            gene.interval = Math.floor(minValue + getRandom() * (maxValue - minValue));
          } else {
            gene.duration = Math.floor(minValue + getRandom() * (maxValue - minValue));
          }
        }
      } else if (mutationType < 0.7) {
        // Insertion mutation: add a new gene
        const newGene = {
          interval: Math.floor(minValue + getRandom() * (maxValue - minValue)),
          duration: Math.floor(minValue + getRandom() * (maxValue - minValue)),
        };
        const insertPos = Math.floor(getRandom() * (individual.genome.length + 1));
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
    } = gaConfig;

    // Create initial population with configured ranges
    let population = this.createInitialPopulation(populationSize, {
      minLength,
      maxLength,
      minValue,
      maxValue,
    });

    // Evaluate initial population
    population.forEach(individual => {
      try {
        this.evaluateFitness(individual, simulator, gameConcept, simulationParams, penaltyCoefficient, survivalWeight);
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
      const avgFitness = population.reduce((sum, ind) => sum + ind.fitness, 0) / population.length;
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
        if (Math.random() < crossoverRate) {
          offspring = this.crossover(parent1, parent2);
        } else {
          offspring = [parent1.clone(), parent2.clone()];
        }

        // Mutate offspring with configured ranges
        offspring.forEach(child => {
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
      nextGeneration.forEach(individual => {
        try {
          this.evaluateFitness(individual, simulator, gameConcept, simulationParams, penaltyCoefficient, survivalWeight);
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

    const paramSpec = this.parameterSpec.find(p => p.path === mutatePath);
    if (!paramSpec) return;

    const range = paramSpec.suggestedMax - paramSpec.suggestedMin;
    const currentValue = this.genome.get(mutatePath);

    // Gaussian mutation with standard deviation = 10% of range
    const sigma = range * 0.1;
    let newValue = currentValue + (Math.random() - 0.5) * 2 * sigma;

    // Clamp to valid range
    newValue = Math.max(paramSpec.suggestedMin, Math.min(paramSpec.suggestedMax, newValue));

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
      gapWeight: gaConfig.gapWeight || 2.0,      // Score gap between GA and monotonous
      scoreWeight: gaConfig.scoreWeight || 1.0,  // Target score proximity
      timeWeight: gaConfig.timeWeight || 0.5,    // Target time proximity
      minScoreGap: gaConfig.minScoreGap || 20,   // Minimum required score gap
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
          const injectionResult = injectParameters(gameCode, paramValues, parameterSpec, {
            verbose: false,
            verifyChanges: true,
          });

          // Check if injection was successful
          if (injectionResult.successCount < injectionResult.totalCount) {
            // Some parameters failed to inject - penalize heavily
            if (gen === 0 && population.indexOf(individual) === 0) {
              // First individual (baseline) should always succeed - log error if it fails
              console.warn(`Warning: Baseline individual injection failed (${injectionResult.successCount}/${injectionResult.totalCount})`);
            }
            individual.fitness = Infinity;
            continue;
          }

          const modifiedCode = injectionResult.code;

          // Create temporary file for modified game
          const tmpDir = path.join(__dirname, 'tmp', 'balance_ga');
          if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
          }
          const tmpGamePath = path.join(tmpDir, `gen${gen}_ind${population.indexOf(individual)}.js`);
          fs.writeFileSync(tmpGamePath, modifiedCode, 'utf8');

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
            HoldOnly: Array(600).fill(true),  // 10 seconds hold
            SpamPress: Array(600).fill(0).map((_, i) => i % 2 === 0),  // Alternating
          };

          let maxMonotonousScore = 0;
          for (const [patternName, pattern] of Object.entries(monotonousPatterns)) {
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
              maxMonotonousScore = Math.max(maxMonotonousScore, monoResult.score);
            } catch (err) {
              // Ignore failed monotonous tests
            }
          }

          // Calculate score gap (higher is better for skill-based gameplay)
          const scoreGap = gaResult.score - maxMonotonousScore;

          // Fitness components
          const gapFitness = -scoreGap;  // Negative because we minimize fitness (larger gap = better)
          const scoreDiff = Math.abs(targetMetrics.score - gaResult.score);
          const timeDiff = Math.abs(targetMetrics.survivalTime - (gaResult.duration / 60.0));

          // Multi-objective fitness (minimize)
          individual.fitness =
            config.gapWeight * gapFitness +      // Prioritize score gap
            config.scoreWeight * scoreDiff +     // Target score proximity
            config.timeWeight * timeDiff;        // Target time proximity

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
      const avgFitness = population.reduce((sum, ind) => sum + (ind.fitness === Infinity ? 1000 : ind.fitness), 0) / population.length;
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
      const candidate = population[Math.floor(Math.random() * population.length)];
      if (!best || candidate.fitness < best.fitness) {
        best = candidate;
      }
    }
    return best;
  }
}

// ===== Game Analyzer =====

/**
 * Analyzes game test results to evaluate game quality
 */
class GameAnalyzer {
  /**
   * Test the game concept against predefined monotonous input patterns
   * to check for exploitability or lack of engagement.
   *
   * NOTE: This method assumes the simulator's seed has already been set
   * (typically by testGAOptimizedPatterns) for fair comparison.
   *
   * @param {GameSimulator} simulator Game simulator instance
   * @param {object} gameConcept Loaded game concept module
   * @param {Object} simulationParams Parameters for the game simulation
   * @returns {Object} Results including vulnerability assessment and pattern scores
   */
  static testMonotonousPatterns(simulator, gameConcept, simulationParams = {}) {
    // NOTE: Using the same fixed seed as GA testing for fair comparison
    console.log('Testing monotonous patterns with same seed as GA testing...');

    // Regenerate patterns using the new flat format
    const patterns = {
      NoInput: InputPatternGenerator.generateNoInputPattern(),
      HoldOnly: InputPatternGenerator.generateHoldOnlyPattern(),
      SpamPress: InputPatternGenerator.generateSpamPattern(),
    };
    const patternResults = {};
    let totalScore = 0;
    let maxDuration = 0;

    Object.entries(patterns).forEach(([name, pattern]) => {
      try {
        // Add try...catch around individual simulation
        const result = simulator.simulateGame(
          gameConcept.init,
          gameConcept.update,
          gameConcept.isGameOver,
          gameConcept.getScore,
          simulationParams,
          pattern.length, // Use pattern length as max ticks
          pattern
        );
        patternResults[name] = {
          survivalTime: result.duration / 60.0,
          score: typeof result.score === "number" ? result.score : 0, // Default score to 0 if NaN/undefined
        };
        totalScore += patternResults[name].score;
        if (result.duration > maxDuration) {
          maxDuration = result.duration;
        }
      } catch (simError) {
        console.error(
          `\n### ERROR during monotonous simulation (${name}) for ${
            gameConcept.name || "unknown concept"
          } ###`
        );
        console.error(simError.stack);
        patternResults[name] = { survivalTime: 0, score: 0 }; // Record failure
      }
    });

    // Recalculate average score based on potentially fewer successful results
    const successfulResults = Object.values(patternResults).filter(
      (r) => r.survivalTime > 0 || r.score > 0
    );
    const averageMonotonousScore =
      successfulResults.length > 0
        ? successfulResults.reduce((sum, r) => sum + r.score, 0) /
          successfulResults.length
        : 0;
    const maxSurvivalTime = maxDuration / 60.0;

    const isHighlyVulnerable =
      averageMonotonousScore > 50 || maxSurvivalTime > 8;
    const isModeratelyVulnerable =
      !isHighlyVulnerable &&
      (averageMonotonousScore > 10 || maxSurvivalTime > 5);

    return {
      patternResults,
      averageMonotonousScore,
      maxSurvivalTime,
      isHighlyVulnerable,
      isModeratelyVulnerable,
    };
  }

  /**
   * Test the game using GA-optimized input patterns
   * Evolves input patterns to maximize score and detect exploitability
   *
   * @param {GameSimulator} simulator Game simulator instance
   * @param {object} gameConcept Loaded game concept module
   * @param {Object} simulationParams Parameters for the game simulation
   * @param {Object} gaConfig GA configuration options
   * @returns {Object} Results including best score, pattern, and evolution history
   */
  static testGAOptimizedPatterns(
    simulator,
    gameConcept,
    simulationParams = {},
    gaConfig = {}
  ) {
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
      console.log(`GA Testing: Using fixed seed ${config.seed} for deterministic evaluation`);
    }

    try {
      // If timeRanges is specified, run multiple GA searches with different time ranges
      const timeRanges = config.timeRanges || [{ minValue: 50, maxValue: 2000 }];

      console.log(`Running GA Evolution with ${timeRanges.length} time range(s)...`);

      let bestOverallResult = null;
      let bestOverallScore = -Infinity;

      for (let i = 0; i < timeRanges.length; i++) {
        const range = timeRanges[i];
        console.log(`  Range ${i + 1}/${timeRanges.length}: ${range.minValue}-${range.maxValue}ms`);

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

        // Simulate one more time with best pattern to get survival time
        const bestPattern = evolutionResult.bestIndividual.toInputPattern();
        const finalResult = simulator.simulateGame(
          gameConcept.init,
          gameConcept.update,
          gameConcept.isGameOver,
          gameConcept.getScore,
          simulationParams,
          bestPattern.length,
          bestPattern
        );

        console.log(`    Best Score in this range: ${finalResult.score}, Survival: ${(finalResult.duration / 60.0).toFixed(1)}s`);

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
          };
        }
      }

      // If no successful result found, return error
      if (bestOverallResult === null) {
        throw new Error('All time ranges failed to produce valid results');
      }

      // Determine vulnerability based on best GA-achieved score
      const isHighlyVulnerable = bestOverallResult.score > 100;
      const isModeratelyVulnerable = !isHighlyVulnerable && bestOverallResult.score > 50;

      console.log(`\nBest overall result from range ${bestOverallResult.rangeIndex + 1} (${bestOverallResult.rangeUsed.minValue}-${bestOverallResult.rangeUsed.maxValue}ms)`);

      return {
        bestScore: bestOverallResult.score,
        bestSurvivalTime: bestOverallResult.survivalTime,
        bestGenome: bestOverallResult.genome,
        bestFitness: bestOverallResult.fitness,
        evolutionHistory: bestOverallResult.evolutionHistory,
        isHighlyVulnerable,
        isModeratelyVulnerable,
        generationsRun: config.generations,
        rangeUsed: bestOverallResult.rangeUsed,
        rangeIndex: bestOverallResult.rangeIndex,
        totalRangesTested: timeRanges.length,
      };
    } catch (error) {
      console.error('Error during GA evolution:', error.message);
      return {
        bestScore: 0,
        bestSurvivalTime: 0,
        bestGenome: [],
        bestFitness: -Infinity,
        evolutionHistory: { generations: [], bestFitness: [], avgFitness: [] },
        isHighlyVulnerable: false,
        isModeratelyVulnerable: false,
        generationsRun: 0,
        error: error.message,
      };
    }
  }

  /**
   * Evaluate overall game quality based on monotonous and GA-optimized input simulation results
   * Core evaluation metric: Normalized scores (scale-independent)
   * @param {Object} monotonousResults Results from testMonotonousPatterns
   * @param {Object} gaResults Results from testGAOptimizedPatterns (optional)
   * @returns {Object} Evaluation metrics and qualitative assessment
   */
  static evaluateGame(monotonousResults, gaResults = null) {
    let monotonousInputScore = 0;
    let gaResistanceScore = 0;
    let normalizedGA = null;
    let normalizedMonotonous = null;

    const strengths = [];
    const weaknesses = [];

    // Calculate normalized scores (scale-independent evaluation)
    if (gaResults && monotonousResults) {
      const gaScore = gaResults.bestScore || 0;
      const monotonousScore = monotonousResults.averageMonotonousScore || 0;
      const totalScore = gaScore + monotonousScore;

      if (totalScore > 0) {
        normalizedGA = gaScore / totalScore;
        normalizedMonotonous = monotonousScore / totalScore;
      } else {
        // Both scores are 0 - treat as balanced
        normalizedGA = 0.5;
        normalizedMonotonous = 0.5;
      }
    }

    // Monotonous Input Resistance (Based on monotonous test vulnerability)
    if (
      monotonousResults &&
      typeof monotonousResults.isHighlyVulnerable !== "undefined"
    ) {
      if (
        !monotonousResults.isHighlyVulnerable &&
        !monotonousResults.isModeratelyVulnerable
      ) {
        monotonousInputScore = 3; // Excellent (Low vulnerability)
        strengths.push("Resistant to monotonous input patterns");
      } else if (!monotonousResults.isHighlyVulnerable) {
        monotonousInputScore = 2; // Good (Moderate vulnerability)
        weaknesses.push("Slightly vulnerable to monotonous input");
      } else {
        monotonousInputScore = 1; // Fair (High vulnerability, but maybe survives short time)
        weaknesses.push("Highly vulnerable to monotonous input patterns");
        if (monotonousResults.maxSurvivalTime > 15) {
          monotonousInputScore = 0; // Poor
        }
      }
    } else {
      monotonousInputScore = 0;
      weaknesses.push("Monotonous input resistance could not be determined");
    }

    // Normalized Score-based Evaluation (scale-independent)
    if (normalizedMonotonous !== null) {
      if (normalizedMonotonous > 0.5) {
        // Monotonous input is dominant or equal → True vulnerability
        gaResistanceScore = 0;
        weaknesses.push("True vulnerability detected (monotonous input achieves higher or equal score)");
      } else if (normalizedGA > 0.75) {
        // GA is significantly dominant → Ideal skill-based design
        gaResistanceScore = 3;
        strengths.push("Excellent skill-based design (GA significantly outperforms monotonous input)");
      } else {
        // Middle case → Needs verification (includes low-score cases like lland)
        gaResistanceScore = 1;
        weaknesses.push("Score balance requires verification (normalized GA score ≤ 0.75, may indicate GA limitation)");
      }
    } else {
      // If GA test was not run, don't penalize
      gaResistanceScore = 0;
    }

    const totalScore = monotonousInputScore + gaResistanceScore;
    const maxScore = gaResults ? 6 : 3;

    // Qualitative Rating based on total score
    let rating = "POOR";
    if (gaResults) {
      // With GA testing (max 6 points)
      if (totalScore >= 5) {
        rating = "EXCELLENT";
      } else if (totalScore >= 4) {
        rating = "GOOD";
      } else if (totalScore >= 2) {
        rating = "AVERAGE";
      }
    } else {
      // Without GA testing (max 3 points)
      if (totalScore >= 3) {
        rating = "EXCELLENT";
      } else if (totalScore >= 2) {
        rating = "GOOD";
      } else if (totalScore >= 1) {
        rating = "AVERAGE";
      }
    }

    return {
      monotonousInputScore,
      gaResistanceScore,
      normalizedGA,  // Add normalized GA score
      normalizedMonotonous,  // Add normalized monotonous score
      totalScore,
      maxScore,
      rating,
      strengths,
      weaknesses,
    };
  }

  /**
   * Generate improvement recommendations based on evaluation
   * @param {Object} evaluation Game evaluation results
   * @returns {Array} List of recommendations
   */
  static generateRecommendations(evaluation) {
    const recommendations = [];

    // Recommendations for monotonous input vulnerability
    if (evaluation.monotonousInputScore < 2) {
      recommendations.push("Add penalties for monotonous input patterns");
      recommendations.push("Strengthen difficulty escalation over time");
      recommendations.push(
        "Add mechanics that require rhythmic or varied player actions"
      );
      recommendations.push(
        "Ensure button mashing doesn't provide an advantage"
      );
    }

    return recommendations;
  }

  /**
   * Run a complete game evaluation and generate a detailed report
   * @param {GameSimulator} simulator Game simulator instance
   * @param {object} gameConcept Loaded game concept module { init, update, isGameOver, getScore }
   * @param {string} gameName Name of the game (derived from file path)
   * @param {Object} options Evaluation options { includeGA: boolean }
   * @returns {Object} Comprehensive evaluation report
   */
  static evaluateGameComprehensive(simulator, gameConcept, gameName, options = {}) {
    const { includeGA = false } = options;

    console.log(`\n===== Testing Game Concept: ${gameName} =====`);

    const standardSimulationParams = {
      worldWidth: 100, // Standard width for testing
      worldHeight: 100, // Standard height for testing
    };

    let monotonousResults = null;
    let gaResults = null;
    let evaluation = null;
    let recommendations = [];

    try {
      // Test monotonous input patterns
      console.log("Running Monotonous Input Tests...");
      monotonousResults = this.testMonotonousPatterns(
        simulator,
        gameConcept,
        standardSimulationParams
      );

      console.log(
        "Monotonous Pattern Vulnerability:",
        monotonousResults.isHighlyVulnerable
          ? "High"
          : monotonousResults.isModeratelyVulnerable
          ? "Moderate"
          : "Low"
      );
      Object.entries(monotonousResults.patternResults).forEach(
        ([pattern, result]) => {
          console.log(
            `- ${pattern}: ${result.survivalTime.toFixed(1)}s, Score: ${
              typeof result.score === "number" ? result.score : "NaN"
            }`
          );
        }
      );

      // Test GA-optimized input patterns (if enabled)
      if (includeGA) {
        console.log("\nRunning GA-Optimized Input Tests...");
        gaResults = this.testGAOptimizedPatterns(
          simulator,
          gameConcept,
          standardSimulationParams
        );

        if (!gaResults.error) {
          console.log(
            "GA-Optimized Pattern Vulnerability:",
            gaResults.isHighlyVulnerable
              ? "High"
              : gaResults.isModeratelyVulnerable
              ? "Moderate"
              : "Low"
          );
          console.log(
            `- Best Score: ${gaResults.bestScore}, Survival: ${gaResults.bestSurvivalTime.toFixed(1)}s`
          );
          console.log(
            `- Best Genome Length: ${gaResults.bestGenome.length}, Generations: ${gaResults.generationsRun}`
          );
        } else {
          console.log(`- GA Test Error: ${gaResults.error}`);
        }
      }

      // Evaluate game quality based on all tests
      evaluation = this.evaluateGame(monotonousResults, gaResults);

      console.log("\nEvaluation Results:");
      console.log(
        `- Overall Rating: ${evaluation.totalScore}/${evaluation.maxScore} points (${evaluation.rating})`
      );
      console.log(
        `- Monotonous Input Resistance: ${evaluation.monotonousInputScore}/3 points`
      );
      if (gaResults) {
        console.log(
          `- GA Input Resistance: ${evaluation.gaResistanceScore}/3 points`
        );
        if (evaluation.normalizedGA !== null && evaluation.normalizedMonotonous !== null) {
          console.log(
            `- Normalized GA Score: ${evaluation.normalizedGA.toFixed(3)}`
          );
          console.log(
            `- Normalized Monotonous Score: ${evaluation.normalizedMonotonous.toFixed(3)}`
          );
        }
      }

      console.log("\nStrengths:");
      evaluation.strengths.forEach((s) => console.log(`- ${s}`));

      console.log("\nWeaknesses:");
      evaluation.weaknesses.forEach((w) => console.log(`- ${w}`));

      // Generate improvement recommendations
      recommendations = this.generateRecommendations(evaluation);

      console.log("\nImprovement Recommendations:");
      recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
    } catch (error) {
      console.error(`
### ERROR during evaluation of ${gameName} ###`);
      console.error(error.stack);
      evaluation = {
        totalScore: 0,
        maxScore: includeGA ? 6 : 3,
        rating: "ERROR",
        strengths: [],
        weaknesses: ["Evaluation failed due to runtime error."],
      };
      if (!monotonousResults)
        monotonousResults = {
          patternResults: {},
          isHighlyVulnerable: false,
          isModeratelyVulnerable: false,
          maxSurvivalTime: 0,
        };
    }

    return {
      gameName,
      monotonousResults,
      gaResults,
      evaluation,
      recommendations,
    };
  }

  /**
   * Compare multiple games to identify the best design
   * @param {Array} gameResults Array of results from evaluateGameComprehensive
   * @returns {Object} Comparative analysis
   */
  static compareGames(gameResults) {
    if (gameResults.length === 0) {
      console.log("\nNo game results to compare.");
      return null;
    }
    console.log("\n===== Game Comparison =====");
    console.log(
      "| Concept Name | Rating        | Score | Monotony Resist |"
    );
    console.log(
      "|--------------|---------------|-------|-----------------|"
    );

    gameResults.forEach((result) => {
      if (!result || !result.evaluation) {
        console.error(
          `ERROR: Invalid or incomplete result object for game: ${
            result ? result.gameName : "UNKNOWN"
          }. Skipping comparison.`
        );
        return;
      }

      const { gameName, evaluation } = result;

      const monotonyScore =
        typeof evaluation.monotonousInputScore === "number"
          ? String(evaluation.monotonousInputScore)
          : "undef";
      const totalScoreValue =
        typeof evaluation.totalScore === "number"
          ? String(evaluation.totalScore)
          : "NaN";

      console.log(
        `| ${gameName.padEnd(12)} | ${evaluation.rating.padEnd(
          13
        )} | ${totalScoreValue.padStart(2)}/3  | ${monotonyScore.padStart(15)}/3 |`
      );
    });

    // Filter out invalid results before finding the best game
    const validResults = gameResults.filter(
      (r) => r && r.evaluation && typeof r.evaluation.totalScore === "number"
    );

    if (validResults.length === 0) {
      console.log("\nNo valid game results to determine the best design.");
      return {
        games: gameResults,
        bestGame: null,
      };
    }

    // Find best game design among valid results
    const bestGame = validResults.reduce(
      (best, current) =>
        current.evaluation.totalScore > best.evaluation.totalScore
          ? current
          : best,
      validResults[0]
    );

    console.log(`\nBest Game Design: ${bestGame.gameName}`);
    console.log("Reasons:");
    if (
      bestGame.evaluation.strengths &&
      Array.isArray(bestGame.evaluation.strengths)
    ) {
      bestGame.evaluation.strengths.forEach((s) => console.log(`- ${s}`));
    } else {
      console.log("- Strengths data missing or invalid.");
    }

    return {
      games: gameResults,
      bestGame,
    };
  }
}

// ===== Main Execution =====

// Check for command line arguments
// Only run main execution if this file is run directly (not when imported as module)
if (require.main === module) {
  if (process.argv.length < 3) {
    console.error(
      "Usage: node one-button-game-test-framework.js <path_to_concept1.js> [path_to_concept2.js] ..."
    );
    process.exit(1);
  }

  const conceptPaths = process.argv.slice(2);
  const allResults = [];
  const simulator = new GameSimulator(); // Create a single simulator instance

  console.log(`Found ${conceptPaths.length} game concept(s) to test.`);

  conceptPaths.forEach((conceptPath) => {
    const absolutePath = path.resolve(conceptPath);
    const gameName = path.basename(conceptPath, ".js"); // Extract name from filename

    try {
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`File not found: ${absolutePath}`);
      }
      console.log(`
Loading concept: ${gameName} from ${absolutePath}`);
      const gameConcept = require(absolutePath);

      // Validate the concept module
      if (
        typeof gameConcept.init !== "function" ||
        typeof gameConcept.update !== "function" ||
        typeof gameConcept.isGameOver !== "function" ||
        typeof gameConcept.getScore !== "function"
      ) {
        throw new Error(
          `Concept file ${conceptPath} does not export required functions (init, update, isGameOver, getScore).`
        );
      }

      // Run the comprehensive evaluation for this concept
      const results = GameAnalyzer.evaluateGameComprehensive(
        simulator,
        gameConcept,
        gameName
      );
      allResults.push(results);
    } catch (error) {
      console.error(
        `
Error processing concept "${gameName}" (${conceptPath}):`,
        error.message
      );
      // Optionally add more error details: console.error(error.stack);
    }
  });

  // Compare all processed concepts
  if (allResults.length > 0) {
    GameAnalyzer.compareGames(allResults);
  } else {
    console.log("\nNo concepts were successfully evaluated.");
  }

  console.log("\n===== Testing Complete =====");
}

// Export classes for potential external use (optional)
module.exports = {
  GameSimulator,
  InputPatternGenerator,
  GAInputGenerator,
  GAIndividual,
  GameBalanceIndividual,
  GameBalanceGA,
  GameAnalyzer,
  setGlobalSeed,
  getRandom,
};
