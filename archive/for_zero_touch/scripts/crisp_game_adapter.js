/**
 * Crisp Game Library Adapter
 *
 * Adapts Crisp Game Library games (using global state) to the
 * init/update/isGameOver/getScore interface expected by GameSimulator.
 */

// ===== Auto-Detection for Entity Tracking =====

/**
 * Keywords used to identify player variables
 */
const PLAYER_KEYWORDS = ["player", "hero", "ship", "ball", "char", "me", "self"];

/**
 * Keywords used to identify obstacle/enemy arrays
 */
const OBSTACLE_KEYWORDS = [
  "obstacle",
  "enemy",
  "enemies",
  "foe",
  "hazard",
  "spike",
  "block",
  "bullet",
  "shot",
  "missile",
  "bomb",
  "rock",
  "wall",
];

/**
 * State for tracking previously seen entities (to detect new spawns)
 */
let _trackedObstacleIds = new Set();
let _lastObstacleCount = {};

/**
 * Reset tracking state (call on game init)
 */
function resetEntityTracking() {
  _trackedObstacleIds = new Set();
  _lastObstacleCount = {};
}

/**
 * Extract position from various object formats
 * @param {Object} obj Object that might contain position data
 * @returns {{x: number, y: number}|null} Position or null
 */
function extractPosition(obj) {
  if (!obj || typeof obj !== "object") return null;

  // Direct x, y properties
  if (typeof obj.x === "number" && typeof obj.y === "number") {
    return { x: obj.x, y: obj.y };
  }

  // pos property (common in crisp-game-lib)
  if (obj.pos && typeof obj.pos.x === "number" && typeof obj.pos.y === "number") {
    return { x: obj.pos.x, y: obj.pos.y };
  }

  // position property
  if (obj.position && typeof obj.position.x === "number") {
    return { x: obj.position.x, y: obj.position.y };
  }

  return null;
}

/**
 * Extract velocity from various object formats
 * @param {Object} obj Object that might contain velocity data
 * @returns {{x: number, y: number}|null} Velocity or null
 */
function extractVelocity(obj) {
  if (!obj || typeof obj !== "object") return null;

  // vel property
  if (obj.vel && typeof obj.vel.x === "number") {
    return { x: obj.vel.x, y: obj.vel.y };
  }

  // velocity property
  if (obj.velocity && typeof obj.velocity.x === "number") {
    return { x: obj.velocity.x, y: obj.velocity.y };
  }

  // vx, vy properties
  if (typeof obj.vx === "number" && typeof obj.vy === "number") {
    return { x: obj.vx, y: obj.vy };
  }

  return null;
}

/**
 * Generate a simple hash for an object to track identity
 * @param {Object} obj Object to hash
 * @param {number} index Array index
 * @returns {string} Hash string
 */
function generateEntityHash(obj, index) {
  const pos = extractPosition(obj);
  if (pos) {
    // Use position + index as rough identifier
    return `${Math.round(pos.x)}_${Math.round(pos.y)}_${index}`;
  }
  return `idx_${index}`;
}

/**
 * Auto-detect and track game entities from global scope
 * @param {Object} globalScope Global scope containing game variables
 * @param {Object} simulator GameSimulator instance
 * @param {number} tick Current game tick
 */
function autoDetectEntities(globalScope, simulator, tick) {
  // Skip if logging is not enabled
  if (!simulator._loggingEnabled) return;

  // Detect player
  for (const keyword of PLAYER_KEYWORDS) {
    const player = globalScope[keyword];
    if (player && typeof player === "object") {
      const pos = extractPosition(player);
      const vel = extractVelocity(player);
      if (pos) {
        simulator.updatePlayerState(pos, vel);
        break; // Found player, stop searching
      }
    }
  }

  // Detect obstacle/enemy arrays
  for (const key of Object.keys(globalScope)) {
    const lowerKey = key.toLowerCase();
    const isObstacleArray = OBSTACLE_KEYWORDS.some(
      (kw) => lowerKey.includes(kw) || lowerKey === kw + "s"
    );

    if (isObstacleArray && Array.isArray(globalScope[key])) {
      const array = globalScope[key];
      const prevCount = _lastObstacleCount[key] || 0;

      // Track new entities (array grew)
      if (array.length > prevCount) {
        for (let i = prevCount; i < array.length; i++) {
          const entity = array[i];
          const pos = extractPosition(entity);
          if (pos) {
            const kind = entity.type || entity.kind || key.replace(/s$/, "");
            simulator.registerObstacle({
              id: `${key}_${tick}_${i}`,
              pos: pos,
              size: entity.size || { x: 6, y: 6 },
              kind: kind,
            });
          }
        }
      }

      // Update obstacle positions for near-miss detection
      simulator.clearObstacles();
      array.forEach((entity, i) => {
        const pos = extractPosition(entity);
        if (pos) {
          simulator._obstacles.push({
            id: `${key}_${i}`,
            pos: { x: pos.x, y: pos.y },
            size: entity.size || { x: 6, y: 6 },
            kind: entity.type || entity.kind || key.replace(/s$/, ""),
          });
        }
      });

      _lastObstacleCount[key] = array.length;
    }
  }
}

/**
 * Create an adapter for a Crisp game concept
 * @param {string} gamePath Path to the game.js file
 * @returns {Object} Adapter object with init, update, isGameOver, getScore functions
 */
function createCrispGameAdapter(gamePath) {
  // Crisp games define global variables (title, description, update, etc.)
  // Execute the game file directly to populate globals

  const fs = require("fs");
  let gameCode = fs.readFileSync(gamePath, "utf8");

  // Remove ESM import statements (e.g., import "crisp-game-lib";) since
  // prototypes are executed directly in this adapter without bundling.
  gameCode = gameCode.replace(/^[ \t]*import[^;]+;?\s*$/gm, "");

  // Reference to global scope (use globalThis for compatibility)
  const globalScope = typeof globalThis !== "undefined" ? globalThis : global;

  // Convert top-level `let` and `const` to `var` for proper global scope binding
  // This is necessary because `let`/`const` at top level don't create global properties
  gameCode = gameCode.replace(/^(let|const)\s+/gm, "var ");

  // Global state storage
  let gameState = {
    score: 0,
    ticks: 0,
    isGameOver: false,
    difficulty: 0,
    hasCrashed: false,
    crashError: null,
  };

  // Create global environment stub for Crisp games (BEFORE evaluating game code)
  const crispGlobals = {
    // Score tracking
    get score() {
      return gameState.score;
    },
    set score(value) {
      gameState.score = value;
    },
    addScore: function (value, x, y) {
      const oldScore = gameState.score;
      gameState.score += value;
      globalScope.score = gameState.score;

      // Log score event if simulator logging is enabled
      if (
        globalScope.simulator &&
        globalScope.simulator._loggingEnabled &&
        globalScope.simulator.logEvent
      ) {
        globalScope.simulator.logEvent("score", {
          value: value,
          trigger: "addScore",
          pos: x !== undefined ? { x, y } : null,
          totalScore: gameState.score,
        });
      }
    },

    // Game state
    ticks: 0,
    difficulty: 0,

    // Game control
    end: function (cause) {
      gameState.isGameOver = true;

      // Log collision/game over cause if available
      if (
        globalScope.simulator &&
        globalScope.simulator._loggingEnabled &&
        globalScope.simulator.logEvent
      ) {
        globalScope.simulator.logEvent("collision", {
          cause: cause || "end_called",
          playerPos: globalScope.simulator._playerState?.pos,
        });
      }
    },

    // Color system (simplified for testing)
    color: function (colorName) {
      // Delegate to simulator if available
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.color === "function"
      ) {
        globalScope.simulator.color(colorName);
      }
    },

    // Drawing functions (delegate to simulator)
    rect: function (...args) {
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.rect === "function"
      ) {
        return globalScope.simulator.rect(...args);
      }
      return { isColliding: { rect: {}, text: {}, char: {} } };
    },

    box: function (...args) {
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.box === "function"
      ) {
        const result = globalScope.simulator.box(...args);
        // Ensure black color collision is properly set
        if (!result.isColliding.rect.black) {
          result.isColliding.rect.black = false;
        }
        return result;
      }
      return { isColliding: { rect: { black: false }, text: {}, char: {} } };
    },

    text: function (...args) {
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.text === "function"
      ) {
        return globalScope.simulator.text(...args);
      }
      return { isColliding: { rect: {}, text: {}, char: {} } };
    },

    char: function (...args) {
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.char === "function"
      ) {
        return globalScope.simulator.char(...args);
      }
      return { isColliding: { rect: {}, text: {}, char: {} } };
    },

    // Character code utility
    addWithCharCode: function (baseChar, offset) {
      // Get the character code of the first character in baseChar
      const baseCode = baseChar.charCodeAt(0);
      // Add the offset
      const newCode = baseCode + offset;
      // Return the character for the new code
      return String.fromCharCode(newCode);
    },

    line: function (...args) {
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.line === "function"
      ) {
        return globalScope.simulator.line(...args);
      }
      return { isColliding: { rect: {}, text: {}, char: {} } };
    },

    bar: function (...args) {
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.bar === "function"
      ) {
        return globalScope.simulator.bar(...args);
      }
      return { isColliding: { rect: {}, text: {}, char: {} } };
    },

    arc: function (...args) {
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.arc === "function"
      ) {
        return globalScope.simulator.arc(...args);
      }
      return { isColliding: { rect: {}, text: {}, char: {} } };
    },

    // Input state (will be updated by simulator)
    input: {
      isPressed: false,
      isJustPressed: false,
      isJustReleased: false,
    },

    // Random functions (delegate to simulator)
    rnd: function (min, max) {
      // Handle rnd() with no arguments → return 0-1
      if (min === undefined && max === undefined) {
        if (
          globalScope.simulator &&
          typeof globalScope.simulator.random === "function"
        ) {
          return globalScope.simulator.random();
        }
        return Math.random();
      }

      // Handle rnd(max) → return 0-max
      if (max === undefined) {
        max = min;
        min = 0;
      }

      if (
        globalScope.simulator &&
        typeof globalScope.simulator.randomRange === "function"
      ) {
        return globalScope.simulator.randomRange(min, max);
      }
      return min + Math.random() * (max - min);
    },

    rndi: function (min, max) {
      // Crisp Game Library spec: rndi(min, max) returns integer from min to max-1 (exclusive max)
      // Example: rndi(0, 3) returns 0, 1, or 2 (NOT 3)
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.randomInt === "function"
      ) {
        // Note: GameSimulator.randomInt is inclusive, so we need to adjust
        return globalScope.simulator.randomInt(min, max - 1);
      }
      return Math.floor(min + Math.random() * (max - min));
    },

    rnds: function (lowOrHigh = 1, high) {
      // Get base random value
      let value;
      if (high === undefined) {
        // rnds(lowOrHigh) form: 0 to lowOrHigh
        value = Math.random() * lowOrHigh;
      } else {
        // rnds(low, high) form: low to high
        value = lowOrHigh + Math.random() * (high - lowOrHigh);
      }
      // Apply random sign (plus or minus)
      return value * (Math.random() < 0.5 ? 1 : -1);
    },

    // Character loading (delegate to simulator)
    loadCharacters: function (characters) {
      if (
        globalScope.simulator &&
        typeof globalScope.simulator.loadCharacters === "function"
      ) {
        globalScope.simulator.loadCharacters(characters);
      }
    },

    // Vector creation
    vec: function (x, y) {
      const createVectorMethods = (obj) => {
        obj.add = function (other) {
          this.x += typeof other === "object" ? other.x : other;
          this.y += typeof other === "object" ? other.y : other;
          return this;
        };
        obj.sub = function (other) {
          this.x -= typeof other === "object" ? other.x : other;
          this.y -= typeof other === "object" ? other.y : other;
          return this;
        };
        obj.mul = function (scalar) {
          this.x *= scalar;
          this.y *= scalar;
          return this;
        };
        obj.div = function (scalar) {
          this.x /= scalar;
          this.y /= scalar;
          return this;
        };
        obj.normalize = function () {
          const len = this.length;
          if (len > 0) {
            this.x /= len;
            this.y /= len;
          }
          return this;
        };
        obj.rotate = function (angle) {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const x = this.x * cos - this.y * sin;
          const y = this.x * sin + this.y * cos;
          this.x = x;
          this.y = y;
          return this;
        };
        obj.addWithAngle = function (angle, length) {
          this.x += Math.cos(angle) * length;
          this.y += Math.sin(angle) * length;
          return this;
        };
        obj.distanceTo = function (other) {
          const dx = other.x - this.x;
          const dy = other.y - this.y;
          return Math.sqrt(dx * dx + dy * dy);
        };
        obj.angleTo = function (other) {
          return Math.atan2(other.y - this.y, other.x - this.x);
        };
        obj.isInRect = function (x, y, width, height) {
          return (
            this.x >= x &&
            this.x <= x + width &&
            this.y >= y &&
            this.y <= y + height
          );
        };
        obj.set = function (x, y) {
          if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
          } else {
            this.x = x || 0;
            this.y = y || 0;
          }
          return this;
        };
        Object.defineProperty(obj, "length", {
          get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
          },
        });
        return obj;
      };

      if (typeof x === "object") {
        return createVectorMethods({ x: x.x, y: x.y });
      }
      return createVectorMethods({ x: x || 0, y: y || 0 });
    },

    // Array remove utility
    remove: function (array, predicate) {
      for (let i = array.length - 1; i >= 0; i--) {
        const result = predicate(array[i], i);
        if (result) {
          array.splice(i, 1);
        }
      }
    },

    // Math utilities
    PI: Math.PI,
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    abs: Math.abs,
    sqrt: Math.sqrt,
    pow: Math.pow,
    sin: Math.sin,
    cos: Math.cos,
    atan2: Math.atan2,
    min: Math.min,
    max: Math.max,
    sign: Math.sign,
    wrap: function (value, min, max) {
      const range = max - min;
      return ((((value - min) % range) + range) % range) + min;
    },
    clamp: function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    // Array utility functions
    times: function (count, func) {
      const results = [];
      for (let i = 0; i < count; i++) {
        results.push(func(i));
      }
      return results;
    },
    range: function (count) {
      return Array.from({ length: count }, (_, i) => i);
    },

    // Sound (stub)
    play: function (type) {
      // Sound is not simulated
    },

    // Particle effects (stub)
    particle: function (pos, count, speed, angle, angleWidth) {
      // Particles are not simulated
    },
  };

  // Assign Crisp API to global scope BEFORE evaluating game code
  const originalGlobals = {};
  for (const key in crispGlobals) {
    if (key in globalScope) {
      originalGlobals[key] = globalScope[key];
    }
    globalScope[key] = crispGlobals[key];
  }

  // Also store original game-specific globals
  const originalGameGlobals = {
    title: globalScope.title,
    description: globalScope.description,
    characters: globalScope.characters,
    options: globalScope.options,
    update: globalScope.update,
    init: globalScope.init,
  };

  // Provide a stub init() so TypeScript-style templates that call init()
  // simply populate the expected globals instead of throwing at runtime.
  globalScope.init = function init(config = {}) {
    const {
      title: initTitle,
      description: initDescription,
      characters: initCharacters,
      options: initOptions,
      update: initUpdate,
    } = config;

    if (typeof initTitle === "string") {
      globalScope.title = initTitle;
    }
    if (typeof initDescription === "string") {
      globalScope.description = initDescription;
    }
    if (Array.isArray(initCharacters)) {
      globalScope.characters = initCharacters;
    }
    if (typeof initOptions === "object") {
      globalScope.options = initOptions;
    }
    if (typeof initUpdate === "function") {
      globalScope.update = initUpdate;
    }
  };

  // Execute game code in global scope using indirect eval
  try {
    (1, eval)(gameCode); // Indirect eval executes in global scope
  } catch (err) {
    console.error("[ERROR] Failed to load game:", err.message, err.stack);
  }

  // Capture game module from globals
  const gameModule = {
    title: globalScope.title,
    description: globalScope.description,
    characters: globalScope.characters,
    options: globalScope.options,
    update: globalScope.update,
  };

  // Capture ALL game-specific globals (variables defined in game code)
  // These are the variables that hold game state (missiles, tanks, shots, etc.)
  // Also capture their initial values for constants
  const gameGlobalNames = [];
  const gameGlobalConstants = {};

  Object.keys(globalScope).forEach((key) => {
    // Exclude Node.js builtins, Crisp API, and original globals
    if (
      !(key in originalGlobals) &&
      !(key in crispGlobals) &&
      key !== "title" &&
      key !== "description" &&
      key !== "characters" &&
      key !== "options" &&
      key !== "update"
    ) {
      gameGlobalNames.push(key);
      // Store initial value - if it's a primitive, treat as constant
      const value = globalScope[key];
      if (
        typeof value === "number" ||
        typeof value === "string" ||
        typeof value === "boolean"
      ) {
        gameGlobalConstants[key] = value;
      }
    }
  });

  // Restore original globals (optional, to avoid pollution)
  Object.assign(globalScope, originalGlobals);
  Object.assign(globalScope, originalGameGlobals);

  return {
    name: gameModule.title || "Unknown Game",

    /**
     * Initialize the game
     * @param {Object} params Simulation parameters (unused for Crisp games)
     * @param {Object} simulator GameSimulator instance
     */
    init: function (params, simulator) {
      // Reset game state
      gameState = {
        score: 0,
        ticks: 0,
        isGameOver: false,
        difficulty: 0,
        hasCrashed: false,
        crashError: null,
      };

      // Set up globals for the game (Crisp API + game module)
      Object.assign(globalScope, crispGlobals);
      globalScope.score = 0;
      globalScope.ticks = 0;
      globalScope.difficulty = 0;
      globalScope.title = gameModule.title;
      globalScope.description = gameModule.description;
      globalScope.characters = gameModule.characters;
      globalScope.options = gameModule.options;
      globalScope.update = gameModule.update;

      // Initialize input state
      globalScope.input = {
        isPressed: false,
        isJustPressed: false,
        isJustReleased: false,
      };

      // Clear all game-specific globals (they will be initialized by first update call)
      // But restore constants (primitive values)
      gameGlobalNames.forEach((name) => {
        if (name in gameGlobalConstants) {
          globalScope[name] = gameGlobalConstants[name]; // Restore constant value
        } else {
          delete globalScope[name]; // Clear variable state
        }
      });

      // Load characters if defined
      if (gameModule.characters) {
        simulator.loadCharacters(gameModule.characters);
      }

      // Reset entity tracking state
      resetEntityTracking();
    },

    /**
     * Update the game for one frame
     * @param {Object} input Input state from simulator
     * @param {Object} simulator GameSimulator instance
     */
    update: function (input, simulator) {
      // Update global state
      globalScope.ticks = gameState.ticks;
      globalScope.difficulty = gameState.difficulty;
      globalScope.score = gameState.score;

      // Map simulator input to Crisp input format
      globalScope.input.isPressed = input.pressed;
      globalScope.input.isJustPressed = input.justPressed;
      globalScope.input.isJustReleased = input.justReleased;

      // Call game's update function
      if (typeof gameModule.update === "function") {
        try {
          gameModule.update();
        } catch (err) {
          console.error(
            `[ERROR] Game update failed at tick ${gameState.ticks}:`,
            err.message
          );
          console.error(err.stack);
          gameState.isGameOver = true;
          gameState.hasCrashed = true;
          gameState.crashError = err.message;
        }
      }

      // Auto-detect and track game entities for logging
      if (simulator._loggingEnabled) {
        autoDetectEntities(globalScope, simulator, gameState.ticks);
      }

      // Sync state back
      gameState.score = globalScope.score;
      gameState.ticks++;
      // Update difficulty: increases by 1 every minute (3600 ticks)
      gameState.difficulty = 1 + Math.floor(gameState.ticks / 3600);
      globalScope.difficulty = gameState.difficulty;
    },

    /**
     * Check if the game is over
     * @returns {boolean} True if game is over
     */
    isGameOver: function () {
      return gameState.isGameOver;
    },

    /**
     * Get the current score
     * @returns {number} Current score
     */
    getScore: function () {
      return gameState.score;
    },

    /**
     * Check if the game crashed due to an error
     * @returns {boolean} True if game crashed
     */
    hasCrashed: function () {
      return gameState.hasCrashed;
    },

    /**
     * Get crash error message
     * @returns {string|null} Error message if crashed, null otherwise
     */
    getCrashError: function () {
      return gameState.crashError;
    },
  };
}

module.exports = { createCrispGameAdapter };
