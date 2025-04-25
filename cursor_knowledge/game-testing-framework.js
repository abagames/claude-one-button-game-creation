/**
 * One-Button Game Testing Framework
 *
 * A data-driven approach to evaluate one-button game designs
 * through automated input pattern simulation and metrics analysis.
 */

// Node.js environment setup
const path = require("path");
const fs = require("fs");

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
    inputPattern = [] // Now expects a flat array [0, 1, 0, 1...]
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

    // Clean up global reference
    if (typeof global !== "undefined" && global.simulator === this) {
      delete global.simulator;
    }

    return {
      duration: this.ticks,
      score: lastScore,
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
    return min + Math.random() * (max - min);
  }

  /**
   * Random integer in range (inclusive)
   */
  randomInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
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
   * Generate a pattern simulating a very unskilled beginner player
   * - Very slow reactions
   * - Highly inconsistent timing
   * - Frequent missed inputs
   * - Long pauses between actions
   *
   * @param {number} cycles Number of action cycles to generate
   * @returns {Array} Array of input actions [0, 1, 0, ...]
   */
  static generateBeginnerPattern(cycles = 20) {
    const pattern = [];
    // ... (Logic to generate flat pattern [0, 1, 0...]) ...
    // Simplified example: random presses
    for (let i = 0; i < cycles * 15; i++) {
      // Adjust length as needed
      pattern.push(Math.random() < 0.1 ? 1 : 0);
    }
    return pattern;
  }

  /**
   * Generate a pattern simulating a generic expert player (fallback)
   * - Assumes consistent, moderately paced actions
   *
   * @param {number} ticks Total duration in ticks
   * @returns {Array} Array of input actions [0, 1, 0, ...]
   */
  static generateFallbackExpertPattern(ticks = 600) {
    const pattern = [];
    const optimalWaitTime = 25;
    const optimalHoldTime = 6;
    let frameCounter = 0;
    let holding = false;

    for (let i = 0; i < ticks; i++) {
      if (holding) {
        if (
          frameCounter >=
          optimalHoldTime + (Math.floor(Math.random() * 3) - 1)
        ) {
          holding = false;
          frameCounter = 0;
        }
      } else {
        if (
          frameCounter >=
          optimalWaitTime + (Math.floor(Math.random() * 7) - 3)
        ) {
          holding = true;
          frameCounter = 0;
        }
      }
      pattern.push(holding ? 1 : 0);
      frameCounter++;
    }
    return pattern;
  }

  /**
   * Generate an expert pattern using game-specific logic if available,
   * otherwise fall back to a generic expert pattern.
   *
   * @param {object} gameConcept The loaded game concept module
   * @param {GameSimulator} simulator The simulator instance
   * @param {number} maxTicks Maximum duration in ticks
   * @returns {Array} Array of input actions [0, 1, 0, ...]
   */
  static generateExpertPattern(gameConcept, simulator, maxTicks = 600) {
    // Check if the concept provides a custom input generator
    if (typeof gameConcept.generateExpertInput === "function") {
      console.log(
        `Using game-specific expert pattern for ${
          gameConcept.name || "concept"
        }`
      );
      const pattern = [];

      // Temporarily set up global reference for the generator
      if (typeof global !== "undefined") {
        global.simulator = simulator;
      }

      // Simulate tick by tick to generate pattern based on state
      simulator.initGame(gameConcept.init); // Reset game state for generation
      for (let tick = 0; tick < maxTicks; tick++) {
        const gameState = simulator.getGameState();
        const shouldPress = gameConcept.generateExpertInput(gameState, tick);
        pattern.push(shouldPress ? 1 : 0);

        // Update simulator state to reflect the generated input for the next tick
        simulator.updateInput(shouldPress);
        simulator.simulateFrame(gameConcept.update);

        if (gameConcept.isGameOver()) {
          break; // Stop generating if game over
        }
      }

      // Clean up global reference
      if (typeof global !== "undefined" && global.simulator === simulator) {
        delete global.simulator;
      }

      // Ensure the pattern has minimum length for simulation
      while (pattern.length < maxTicks && pattern.length > 0) {
        pattern.push(pattern[pattern.length - 1]); // Pad with last state
      }
      if (pattern.length === 0) {
        // Handle case where game ends immediately
        return Array(maxTicks).fill(0);
      }

      return pattern;
    } else {
      // Fallback to the generic expert pattern
      console.log(
        `Using fallback expert pattern for ${gameConcept.name || "concept"}`
      );
      return this.generateFallbackExpertPattern(maxTicks);
    }
  }

  /**
   * Generate a pattern with no button presses
   * @param {number} duration Total duration
   * @returns {Array} Array of zeros
   */
  static generateNoInputPattern(duration = 600) {
    return Array(duration).fill(0);
  }

  /**
   * Generate a pattern with constant button holding
   * @param {number} duration Total duration
   * @returns {Array} Array of ones
   */
  static generateHoldOnlyPattern(duration = 600) {
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
   * @returns {Object} Results including vulnerability assessment and pattern scores
   */
  static testMonotonousPatterns(simulator, gameConcept, simulationParams = {}) {
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
   * Compare game performance using different simulated player skill levels.
   *
   * @param {GameSimulator} simulator Game simulator instance
   * @param {object} gameConcept Loaded game concept module
   * @param {Object} simulationParams Parameters for the game simulation
   * @returns {Object} Comparison results (beginner vs expert performance, skill gap)
   */
  static comparePlayerPatterns(simulator, gameConcept, simulationParams = {}) {
    const playerResults = {};
    const numRuns = 3; // Number of runs per pattern for averaging
    const maxTicks = 1800; // Max duration per run (30 seconds)

    const playerTypes = {
      Beginner: InputPatternGenerator.generateBeginnerPattern(100), // Generate longer pattern
      Expert: InputPatternGenerator.generateExpertPattern(
        gameConcept,
        simulator,
        maxTicks
      ), // Generate expert pattern
    };

    Object.entries(playerTypes).forEach(([player, pattern]) => {
      let totalDuration = 0;
      let totalScore = 0;
      let successfulRuns = 0;

      for (let i = 0; i < numRuns; i++) {
        try {
          const result = simulator.simulateGame(
            gameConcept.init,
            gameConcept.update,
            gameConcept.isGameOver,
            gameConcept.getScore,
            simulationParams,
            maxTicks,
            pattern
          );
          totalDuration += result.duration;
          totalScore += typeof result.score === "number" ? result.score : 0;
          successfulRuns++;
        } catch (simError) {
          console.error(
            `\n### ERROR during player simulation (${player}, run ${
              i + 1
            }) for ${gameConcept.name || "unknown concept"} ###`
          );
          console.error(simError.stack);
          // Don't count this run towards average if it failed
        }
      }

      playerResults[player] = {
        averageDuration:
          successfulRuns > 0 ? totalDuration / successfulRuns / 60.0 : 0,
        averageScore: successfulRuns > 0 ? totalScore / successfulRuns : 0,
      };
    });

    // Calculate skill gap (Expert score / Beginner score)
    let skillGap = NaN;
    if (
      playerResults.Beginner &&
      playerResults.Expert &&
      playerResults.Beginner.averageScore > 0
    ) {
      skillGap =
        playerResults.Expert.averageScore / playerResults.Beginner.averageScore;
    } else if (playerResults.Expert && playerResults.Expert.averageScore > 0) {
      skillGap = Infinity; // Beginner scored 0, Expert scored > 0
    }

    return {
      playerResults,
      skillGap,
    };
  }

  /**
   * Evaluate overall game quality based on simulation results
   * @param {Object} playerResults Results from comparePlayerPatterns
   * @param {Object} monotonousResults Results from testMonotonousPatterns
   * @returns {Object} Evaluation metrics and qualitative assessment
   */
  static evaluateGame(playerResults, monotonousResults) {
    let durationScore = 0;
    let skillGapScore = 0;
    let difficultyScore = 0;
    let monotonousInputScore = 0; // Default to 0

    const strengths = [];
    const weaknesses = [];

    // 1. Game Duration (Expert Average)
    const expertDuration =
      playerResults.playerResults.Expert.averageDuration / 60.0; // seconds
    if (expertDuration > 45) {
      durationScore = 3; // Excellent
      strengths.push("Good to Excellent game duration");
    } else if (expertDuration > 20) {
      durationScore = 2; // Good
      strengths.push("Acceptable game duration");
    } else if (expertDuration > 5) {
      durationScore = 1; // Fair
      weaknesses.push("Short game duration - potentially ends too quickly");
    } else {
      durationScore = 0; // Poor
      weaknesses.push(
        "Very short game duration - likely too difficult initially"
      );
    }

    // 2. Skill Gap (Expert Score / Beginner Score Ratio)
    const skillGap = playerResults.skillGap;
    if (skillGap > 3.0) {
      skillGapScore = 3; // Excellent
      strengths.push("Clear skill gap rewarding expert play");
    } else if (skillGap > 1.5) {
      skillGapScore = 2; // Good
      strengths.push("Noticeable skill gap");
    } else if (skillGap > 1.1) {
      skillGapScore = 1; // Fair
      weaknesses.push(
        "Small skill gap - skill differences have limited impact"
      );
    } else {
      skillGapScore = 0; // Poor
      weaknesses.push("Negligible skill gap - skill is not well rewarded");
    }

    // 3. Difficulty Progression (Implicitly from Duration & Skill Gap)
    // Good duration + good skill gap implies some progression
    if (durationScore >= 2 && skillGapScore >= 2) {
      difficultyScore = 3; // Likely Good
      strengths.push("Implied good difficulty progression");
    } else if (durationScore >= 1 && skillGapScore >= 1) {
      difficultyScore = 2; // Likely Fair
      strengths.push("Fair difficulty progression - potential for improvement");
    } else if (durationScore >= 1 || skillGapScore >= 1) {
      difficultyScore = 1; // Likely Poor
      weaknesses.push("Difficulty progression might be uneven or insufficient");
    } else {
      difficultyScore = 0; // Likely Very Poor
      weaknesses.push(
        "Poor difficulty progression - flat or overly steep curve likely"
      );
    }

    // 4. Monotonous Input Resistance (Based on monotonous test vulnerability)
    if (
      monotonousResults &&
      typeof monotonousResults.isHighlyVulnerable !== "undefined"
    ) {
      // Check if results exist
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
        // If it survives very long even with high vulnerability, maybe it's 0?
        if (monotonousResults.maxSurvivalTime > 15) {
          // Arbitrary threshold
          monotonousInputScore = 0; // Poor
        }
      }
    } else {
      // monotonousResults might be missing or malformed, assign 0 or handle differently
      monotonousInputScore = 0; // Assign 0 if data is missing
      weaknesses.push("Monotonous input resistance could not be determined");
    }

    // Calculate Total Score (Ensure all components are numbers)
    const totalScore = [
      durationScore,
      skillGapScore,
      difficultyScore,
      monotonousInputScore,
    ].reduce((sum, score) => sum + (typeof score === "number" ? score : 0), 0);

    // Qualitative Rating
    let rating = "POOR";
    if (totalScore >= 10) {
      rating = "EXCELLENT";
    } else if (totalScore >= 7) {
      rating = "GOOD";
    } else if (totalScore >= 4) {
      rating = "AVERAGE";
    } else if (totalScore >= 1) {
      rating = "BELOW AVERAGE";
    }

    return {
      durationScore,
      skillGapScore,
      difficultyScore,
      monotonousInputScore,
      totalScore,
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

    // Recommendations for short game duration
    if (evaluation.durationScore < 2) {
      recommendations.push(
        "Lower initial difficulty to extend gameplay duration"
      );
      recommendations.push("Make difficulty curve more gradual");
      recommendations.push(
        "Add mechanics that reward skilled play without ending the game too quickly"
      );
    }

    // Recommendations for small skill gap
    if (evaluation.skillGapScore < 2) {
      recommendations.push(
        "Add bonus elements that reward advanced techniques"
      );
      recommendations.push("Introduce risk-reward choices for expert players");
      recommendations.push(
        "Create opportunities for score multipliers that require precise timing"
      );
    }

    // Recommendations for difficulty progression
    if (evaluation.difficultyScore < 2) {
      recommendations.push(
        "Review initial difficulty: ensure beginners can survive > 5 seconds."
      );
      recommendations.push(
        "Enhance mechanics or difficulty scaling to create a larger difference in survival time between beginner and expert play."
      );
      recommendations.push(
        "Analyze if the game ends too abruptly or if challenge ramps up too quickly/slowly."
      );
    }

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
   * @returns {Object} Comprehensive evaluation report
   */
  static evaluateGameComprehensive(simulator, gameConcept, gameName) {
    console.log(`\n===== Testing Game Concept: ${gameName} =====`);

    const standardSimulationParams = {
      worldWidth: 100, // Standard width for testing
      worldHeight: 100, // Standard height for testing
      // Add other common parameters used by the concepts here...
    };

    let monotonousResults = null; // Initialize results to null
    let playerResults = null;
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
              typeof result.score === "number" ? result.score : "NaN" // Handle NaN score display
            }`
          );
        }
      );

      // Test player skill patterns
      console.log("\nRunning Player Skill Tests...");
      playerResults = this.comparePlayerPatterns(
        simulator,
        gameConcept,
        standardSimulationParams
      );

      Object.entries(playerResults.playerResults).forEach(
        ([player, result]) => {
          console.log(
            `- ${player}: ${result.averageDuration.toFixed(1)}s, Score: ${
              typeof result.averageScore === "number"
                ? result.averageScore.toFixed(1)
                : "NaN"
            }` // Handle NaN score display
          );
        }
      );
      console.log(
        `Skill Gap: ${
          typeof playerResults.skillGap === "number"
            ? playerResults.skillGap.toFixed(2) + "x"
            : "NaNx"
        }`
      ); // Handle NaN skill gap display

      // Evaluate game quality (only if previous steps succeeded)
      evaluation = this.evaluateGame(playerResults, monotonousResults);

      console.log("\nEvaluation Results:");
      console.log(
        `- Overall Rating: ${evaluation.totalScore}/12 points (${evaluation.rating})`
      );
      console.log(`- Game Duration: ${evaluation.durationScore}/3 points`);
      console.log(`- Skill Gap: ${evaluation.skillGapScore}/3 points`);
      console.log(
        `- Difficulty Progression: ${evaluation.difficultyScore}/3 points`
      );
      console.log(
        `- Monotonous Input Resistance: ${evaluation.monotonousInputScore}/3 points`
      );

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
      console.error(error.stack); // Print stack trace
      // Ensure evaluation object exists but indicates failure
      evaluation = {
        totalScore: 0,
        rating: "ERROR",
        strengths: [],
        weaknesses: ["Evaluation failed due to runtime error."],
      };
      // playerResults and monotonousResults might be incomplete or null
      if (!playerResults) playerResults = { playerResults: {}, skillGap: NaN };
      if (!monotonousResults)
        monotonousResults = {
          patternResults: {},
          isHighlyVulnerable: false,
          isModeratelyVulnerable: false,
          maxSurvivalTime: 0,
        };
    }

    // Return comprehensive results (even if errors occurred)
    return {
      gameName,
      monotonousResults,
      playerResults,
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
      "| Concept Name | Rating        | Score | Skill Gap | Expert Time | Monotony Resist |"
    );
    console.log(
      "|--------------|---------------|-------|-----------|-------------|-----------------|"
    );

    gameResults.forEach((result) => {
      // Check if result and necessary properties exist before accessing
      if (
        !result ||
        !result.evaluation ||
        !result.playerResults ||
        !result.playerResults.playerResults ||
        !result.playerResults.playerResults.Expert
      ) {
        console.error(
          `ERROR: Invalid or incomplete result object for game: ${
            result ? result.gameName : "UNKNOWN"
          }. Skipping comparison.`
        );
        return; // Skip this iteration if the result object is malformed
      }

      const { gameName, evaluation, playerResults } = result;
      const expertTime =
        playerResults.playerResults.Expert.averageDuration.toFixed(1);

      // Ensure skillGap is a number before calling toFixed
      const skillGapValue =
        typeof playerResults.skillGap === "number"
          ? playerResults.skillGap.toFixed(2)
          : "NaN";
      // Ensure monotonousInputScore is a number before accessing
      const monotonyScore =
        typeof evaluation.monotonousInputScore === "number"
          ? String(evaluation.monotonousInputScore)
          : "undef";
      // Ensure totalScore is a number
      const totalScoreValue =
        typeof evaluation.totalScore === "number"
          ? String(evaluation.totalScore)
          : "NaN";

      console.log(
        `| ${gameName.padEnd(12)} | ${evaluation.rating.padEnd(
          13
        )} | ${totalScoreValue.padStart(2)}/12 | ${skillGapValue.padStart(
          9
        )}x | ${expertTime.padStart(11)}s | ${monotonyScore.padStart(15)}/3 |`
      );
    });

    // Filter out invalid results before finding the best game
    const validResults = gameResults.filter(
      (r) => r && r.evaluation && typeof r.evaluation.totalScore === "number"
    );

    if (validResults.length === 0) {
      console.log("\nNo valid game results to determine the best design.");
      return {
        games: gameResults, // Return original results for inspection
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
    // Check if bestGame.evaluation.strengths exists and is an array
    if (
      bestGame.evaluation.strengths &&
      Array.isArray(bestGame.evaluation.strengths)
    ) {
      bestGame.evaluation.strengths.forEach((s) => console.log(`- ${s}`));
    } else {
      console.log("- Strengths data missing or invalid.");
    }

    return {
      games: gameResults, // Return original results
      bestGame,
    };
  }
}

// ===== Main Execution =====

// Check for command line arguments
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

// Export classes for potential external use (optional)
module.exports = {
  GameSimulator,
  InputPatternGenerator,
  GameAnalyzer,
};
