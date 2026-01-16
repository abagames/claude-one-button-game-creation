/**
 * Core game simulator for crisp-game-lib games
 * Emulates game functionality for testing purposes
 */

const { Xorshift128 } = require("./tester_random");
const { Vector } = require("./tester_vector");
const { EventLogger, EventType } = require("./tester_events");

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

// ===== Game Simulator =====

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

    // ---- Event Logger ----
    this.eventLogger = null; // Will be initialized when logging is enabled
    this._loggingEnabled = false;

    // ---- Player state tracking for logging ----
    this._playerState = {
      pos: { x: 50, y: 50 },
      vel: { x: 0, y: 0 },
    };
    this._obstacles = []; // Track active obstacles for near-miss detection
    this._nearMissThreshold = 8; // Distance threshold for near-miss detection
  }

  /**
   * Enable event logging
   * @param {Object} options Logger options
   */
  enableLogging(options = {}) {
    this.eventLogger = new EventLogger(options);
    this._loggingEnabled = true;
  }

  /**
   * Disable event logging
   */
  disableLogging() {
    this._loggingEnabled = false;
    this.eventLogger = null;
  }

  /**
   * Log a game event (convenience method)
   * @param {string} type Event type
   * @param {Object} data Event data
   */
  logEvent(type, data = {}) {
    if (this._loggingEnabled && this.eventLogger) {
      this.eventLogger.log(type, this.ticks, data);
    }
  }

  /**
   * Update player state for logging
   * @param {Object} pos Player position {x, y}
   * @param {Object} vel Player velocity {x, y}
   */
  updatePlayerState(pos, vel = null) {
    if (pos) {
      this._playerState.pos = { x: pos.x, y: pos.y };
    }
    if (vel) {
      this._playerState.vel = { x: vel.x, y: vel.y };
    }
  }

  /**
   * Register an obstacle for tracking
   * @param {Object} obstacle Obstacle data {pos, size, kind}
   */
  registerObstacle(obstacle) {
    this._obstacles.push({
      id: obstacle.id || Math.random().toString(36).substr(2, 9),
      pos: { x: obstacle.pos.x, y: obstacle.pos.y },
      size: obstacle.size || { x: 6, y: 6 },
      kind: obstacle.kind || "unknown",
    });

    // Log spawn event
    this.logEvent(EventType.OBSTACLE_SPAWN, {
      pos: obstacle.pos,
      kind: obstacle.kind,
      id: obstacle.id,
    });
  }

  /**
   * Register an enemy for tracking
   * @param {Object} enemy Enemy data {pos, size, kind}
   */
  registerEnemy(enemy) {
    this.logEvent(EventType.ENEMY_SPAWN, {
      pos: enemy.pos,
      kind: enemy.kind || "enemy",
    });
  }

  /**
   * Remove an obstacle from tracking
   * @param {string} id Obstacle ID
   */
  removeObstacle(id) {
    this._obstacles = this._obstacles.filter((o) => o.id !== id);
  }

  /**
   * Clear all tracked obstacles
   */
  clearObstacles() {
    this._obstacles = [];
  }

  /**
   * Check for near misses with obstacles
   */
  _checkNearMisses() {
    if (!this._loggingEnabled) return;

    const playerPos = this._playerState.pos;
    for (const obstacle of this._obstacles) {
      const dx = obstacle.pos.x - playerPos.x;
      const dy = obstacle.pos.y - playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Near miss: close but not colliding
      if (
        distance < this._nearMissThreshold &&
        distance > (obstacle.size.x + obstacle.size.y) / 4
      ) {
        this.logEvent(EventType.NEAR_MISS, {
          distance: distance.toFixed(1),
          obstacle: obstacle.kind,
          obstaclePos: obstacle.pos,
          playerPos: playerPos,
        });
      }
    }
  }

  /**
   * Find nearest obstacle to player
   * @returns {Object|null} Nearest obstacle info
   */
  _findNearestObstacle() {
    if (this._obstacles.length === 0) return null;

    const playerPos = this._playerState.pos;
    let nearest = null;
    let minDist = Infinity;

    for (const obstacle of this._obstacles) {
      const dx = obstacle.pos.x - playerPos.x;
      const dy = obstacle.pos.y - playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDist) {
        minDist = distance;
        nearest = {
          kind: obstacle.kind,
          pos: obstacle.pos,
          distance: distance.toFixed(1),
        };
      }
    }

    return nearest;
  }

  /**
   * Set the random seed for deterministic simulations
   * @param {number|null} seed Seed value (null to use Math.random)
   */
  setSeed(seed) {
    if (seed !== null) {
      this.rng = new Xorshift128(seed);
      this._useSeededRandom = true;
    } else {
      this.rng = null;
      this._useSeededRandom = false;
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

    // Reset player state and obstacle tracking
    this._playerState = { pos: { x: 50, y: 50 }, vel: { x: 0, y: 0 } };
    this._obstacles = [];

    // Reset event logger if enabled
    if (this._loggingEnabled && this.eventLogger) {
      this.eventLogger.reset();
      this.logEvent(EventType.GAME_START, {});
    }

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

    // Log input events
    if (this._loggingEnabled) {
      if (this.input.justPressed) {
        this.logEvent(EventType.INPUT, { action: "press" });
      }
      if (this.input.justReleased && this._heldTicks > 0) {
        this.logEvent(EventType.INPUT, {
          action: "release",
          holdDuration: this._heldTicks,
        });
      }
    }

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

    // Record frame data for logging
    if (this._loggingEnabled && this.eventLogger) {
      // Check for near misses
      this._checkNearMisses();

      // Record frame snapshot
      this.eventLogger.recordFrame(this.ticks, {
        playerPos: { ...this._playerState.pos },
        playerVel: { ...this._playerState.vel },
        nearestObstacle: this._findNearestObstacle(),
        input: {
          pressed: this.input.pressed,
          heldTime: this.input.heldTime,
        },
        obstacleCount: this._obstacles.length,
      });
    }

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
   * @param {Object} gameConcept Optional: full game concept for crash detection
   * @param {Object} loggingOptions Optional: logging configuration { enabled, verboseMode }
   * @returns {Object} Simulation results (duration, score, log)
   */
  simulateGame(
    initFunction,
    updateFunction,
    isGameOverFunction,
    getScoreFunction,
    simulationParams = {},
    maxTicks = 3600,
    inputPattern = [], // Now expects a flat array [0, 1, 0, 1...]
    gameConcept = null, // Optional: full game concept for crash detection
    loggingOptions = null // Optional: { enabled: true, verboseMode: false }
  ) {
    // Enable logging if requested
    if (loggingOptions && loggingOptions.enabled) {
      this.enableLogging(loggingOptions);
    }

    this.initGame(initFunction, simulationParams);

    let currentPatternIndex = 0;
    let lastScore = 0;
    let gameOverCause = null;

    while (this.ticks < maxTicks) {
      // Determine input based on the pattern array
      const currentInput = inputPattern[currentPatternIndex] === 1;
      this.updateInput(currentInput);

      // Simulate one frame
      this.simulateFrame(updateFunction);

      // Check if game is over
      if (isGameOverFunction()) {
        gameOverCause = "game_logic"; // Default cause
        break;
      }

      // Update pattern index, loop if necessary
      currentPatternIndex = (currentPatternIndex + 1) % inputPattern.length;
      if (inputPattern.length === 0) currentPatternIndex = 0; // Prevent NaN if pattern is empty

      lastScore = getScoreFunction(); // Update score each tick
    }

    // Check for crashes (if gameConcept supports crash detection)
    const hasCrashed =
      gameConcept && typeof gameConcept.hasCrashed === "function"
        ? gameConcept.hasCrashed()
        : false;
    const crashError =
      gameConcept && typeof gameConcept.getCrashError === "function"
        ? gameConcept.getCrashError()
        : null;

    if (hasCrashed) {
      gameOverCause = "crash";
    }

    // Log game over event
    if (this._loggingEnabled) {
      this.logEvent(EventType.GAME_OVER, {
        cause: gameOverCause || (this.ticks >= maxTicks ? "timeout" : "unknown"),
        playerPos: { ...this._playerState.pos },
        score: lastScore,
        obstacle: this._findNearestObstacle()?.kind,
      });
    }

    // Generate log report if logging was enabled
    let logReport = null;
    if (this._loggingEnabled && this.eventLogger) {
      logReport = this.eventLogger.generateReport();
    }

    // Clean up global reference
    if (typeof global !== "undefined" && global.simulator === this) {
      delete global.simulator;
    }

    // Disable logging after simulation (optional - can be kept enabled for multiple runs)
    // this.disableLogging();

    return {
      duration: this.ticks,
      score: lastScore,
      hasCrashed,
      crashError,
      log: logReport,
      logMarkdown: this._loggingEnabled && this.eventLogger
        ? this.eventLogger.toMarkdown()
        : null,
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

module.exports = { GameSimulator };
