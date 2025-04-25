# One-Button Game Testing Framework for Node.js

## Purpose

This framework provides a structured approach to systematically test and compare multiple game concepts using Node.js before implementing the selected concept in a chosen game library (e.g., crisp-game-lib). By implementing minimal prototype versions of different game concepts in Node.js, you can gather empirical evidence to select the most promising ideas before full implementation.

## Framework Overview

The testing system implemented in `cursor_knowledge/game-testing-framework.js` consists of several core components that enable concept testing in the Node.js environment:

1. **GameSimulator**: Runs game simulations with various input patterns in Node.js. It mimics key `crisp-game-lib` drawing and collision APIs.
2. **InputPatternGenerator**: Creates different button press sequences to test game behavior.
3. **GameAnalyzer**: Evaluates game performance based on key metrics.

This testing approach lets you focus on core mechanics and gameplay evaluation before adding visual implementations.

## Testing Process Instructions

### Loading the Framework

1. Create a new game concept file in the `tmp/concepts/` directory.
2. Follow the format defined by the test framework.
3. This file will be loaded by the testing framework when you run the test command.

### Game Concept Implementation

Your game concept must include at least the following exported functions:

1.  **`init(params, simulator)`**: A function that initializes the game state. It receives simulation parameters (`params`) and the `simulator` instance itself. If your concept uses character sprites (`char()`), call `simulator.loadCharacters(yourCharacterArray)` within this function.
2.  **`update(input, simulator)`**: A function that updates the game state based on the current `input` object and allows interaction with the `simulator` (e.g., for collision detection via drawing functions).
3.  **`getScore()`**: A function that returns the current score as a number.
4.  **`isGameOver()`**: A function that returns a boolean indicating if the game has ended.

Additionally, you can optionally include:

5.  **`generateExpertInput(gameState, currentTick)`**: A function that returns `true` if the button should be pressed on the given `currentTick`, based on the provided `gameState`. This allows for game-specific expert player simulation. If not provided, a generic expert pattern will be used. This function can use the `simulator`'s drawing/collision methods to make decisions.
6.  Helper functions specific to your game mechanics.
7.  Constants for game parameters.

Implement your game prototype following these guidelines:

- Use simple variables and objects to track game state (position, velocity, score, etc.).
- Define clear game over conditions in `isGameOver()`.
- Implement a meaningful scoring system in `getScore()`.
- Keep the logic minimal while preserving the core experience.
- **Collision Detection (Using Simulator's Drawing Functions):**
  - The framework's `GameSimulator` provides collision detection methods that closely mimic `crisp-game-lib`. **Use these methods for all collision checks.**
  - **Set Color:** Before drawing/checking collisions for an object, set its "color" using `simulator.color('colorName')`. Valid color names include `red`, `blue`, `green`, `yellow`, `purple`, `cyan`, `black`, `white`, `transparent`, and their `light_` variants.
  - **Drawing & Collision Check:** Call methods like `simulator.rect(x, y, w, h)`, `simulator.box(x, y, w, h)`, `simulator.line(x1, y1, x2, y2, thickness)`, `simulator.bar(...)`, `simulator.arc(...)`, `simulator.text("string", x, y)`, or `simulator.char('a', x, y)` to **both** simulate drawing the shape _and_ check for collisions against previously drawn shapes in the same frame.
  - **Get Collision Result:** These drawing functions return a `Collision` object. The result contains information about what the shape collided with.
  - **Check Result:** The returned `Collision` object has an `isColliding` property. Check for collisions like this:
    - `collision.isColliding.rect.blue`: Collided with a blue rect/box.
    - `collision.isColliding.text['!']`: Collided with the text character '!'.
    - `collision.isColliding.char.b`: Collided with character 'b'.
    - Check against any color used with `simulator.color()`.
  - **Transparent:** Use `simulator.color('transparent')` before a drawing call to check for collisions without adding the object to the collision history for subsequent checks (useful for detection zones).
  - **Do Not Use:** Standalone collision functions (like `collideRects`, `collideBoxes`) are **not available** in the simulator. All collision detection **must** be done via the drawing functions (`rect`, `box`, `line`, etc.).
- **Exposing State for Expert Input:** If implementing `generateExpertInput`, ensure your `update` function makes the necessary internal game state accessible for the generator. Assign it to `simulator.conceptState` (e.g., `simulator.conceptState = { playerPos: this.player.pos, enemies: this.enemyPool.items };`). Accessing `global.simulator` is discouraged; use the passed `simulator` instance.

### Running Evaluations

To evaluate a game concept:

1. Run the test framework using Node.js, providing the paths to your concept files:

   ```bash
   node ./cursor_knowledge/game-testing-framework.js ./tmp/concepts/concept1.js ./tmp/concepts/concept2.js ...
   ```

2. The framework will:
   - Run multiple simulations with different input patterns (Beginner, Expert, Monotonous).
   - Analyze game performance across key metrics using the `GameAnalyzer`.
   - Generate a comprehensive evaluation report comparing the concepts.

### Comparing Multiple Concepts

To compare different game concepts:

1. Implement each concept as a separate file in the `tmp/concepts/` directory.
2. Run the test framework with all concept files listed as arguments.
3. The framework automatically runs tests on all provided concepts and generates a comparison table at the end.
4. Use the comparison data and individual reports to make an informed decision on which concept to fully implement.

## Metrics and Evaluation

The framework evaluates games based on four key metrics:

1. **Skill Gap**: The difference in performance (score or duration) between "expert" and "beginner" input patterns.

   - Higher values indicate the game rewards skill and learning.
   - Low skill gaps may suggest randomness or limited depth.

2. **Game Duration**: Average survival time, especially for the expert pattern.

   - Evaluates if the game provides an appropriate play session length.
   - Too short suggests high initial difficulty or abrupt endings.

3. **Difficulty Progression**: Implicitly measured by comparing beginner/expert duration and skill gap.

   - A good gap and reasonable expert duration suggest a curve exists.
   - Poor results might indicate a flat, overly steep, or inconsistent curve.

4. **Monotonous Input Resistance**: How well the game prevents simple, repetitive inputs (no input, hold, spam) from achieving high scores or survival times.
   - Tests if the game requires varied or thoughtful interaction.
   - Low resistance indicates potential exploits or lack of engaging mechanics.

## Rating Methodology

The framework uses a comprehensive rating system:

- Each metric is scored on a scale of 0-3 points.
- The total score ranges from 0-12 points.
- Games are given one of five ratings based on the total score:
  - EXCELLENT (10-12 points)
  - GOOD (7-9 points)
  - AVERAGE (4-6 points)
  - BELOW AVERAGE (1-3 points)
  - POOR (0 points)
- Ratings help provide a quick assessment of overall concept quality.

## Testing Patterns

The framework uses these input patterns to evaluate games:

1.  **Expert Patterns**: Sophisticated input sequences mimicking skilled play.

    - **If `generateExpertInput` is provided:** The framework calls this function repeatedly, passing the current `gameState` (including `simulator.conceptState`) and `currentTick`. The function should return `true` (press) or `false` (release) for that tick. It can use `simulator` methods (like `box()`, `rect()`) to analyze the game state via collision checks.
    - **If not provided:** A generic fallback pattern is used.
    - Helps determine the **Skill Gap** and **Game Duration** potential.

2.  **Beginner Patterns**: Simple, inconsistent inputs simulating new players.

    - Used with Expert Patterns to calculate the **Skill Gap**.

3.  **Monotonous Patterns**: Simple, repetitive inputs (No Input, Hold Only, Spam Press).
    - Used to determine **Monotonous Input Resistance**.

## Implementation Guidelines

When implementing your game concept:

1.  **State Representation**:

    - Use simple data structures (variables, objects, classes) within your concept file.
    - **For Expert Input Simulation**: Expose necessary state via `simulator.conceptState` in your `update` function.

2.  **Input Handling & Game Logic**:
    - **`update(input, simulator)`**: The core game loop function.
      - Receives `input` object: `{ pressed, justPressed, justReleased, heldTime }`.
      - Receives `simulator` instance. Use `simulator.color()`, `simulator.box()`, `simulator.rect()`, `simulator.line()`, etc., for drawing and collision checks. Check the returned collision object.
      - Update your game state variables based on input and game rules.
    - **`generateExpertInput(gameState, currentTick)` (Optional)**:
      - Receives `gameState` object: `{ ticks, input, conceptState }`. Access your exposed state via `gameState.conceptState`.
      - Receives `currentTick`.
      - **Crucially, this function can call `simulator.color()`, `simulator.box()`, etc., to perform collision checks _within the expert logic_ to determine the best action.** This allows the expert AI to "see" the game world like the player does. Remember that `simulator` is available globally (`global.simulator`) within this function's context during generation, or preferably passed if the framework evolves.
      - Return `true` to press the button, `false` to release.

## Example Concept Implementation

Here's a simplified example demonstrating the required functions, optional expert input, and the **correct way to use drawing functions for collision detection**:

```javascript
// --- Sample game: Minimal Jumper ---

// Game state (scoped within the module)
let playerY, playerVy, obstacleX, score, gameTicks, isDone;

// Constants
const GRAVITY = 0.1;
const JUMP_STRENGTH = 2;
const GROUND = 90;
const PLAYER_SIZE = 6;
const OBSTACLE_SIZE = 8;
const OBSTACLE_SPEED = 1;
const PLAYER_X = 30; // Player fixed X position

// --- Required Functions ---

function init(params, simulator) {
  playerY = 50;
  playerVy = 0;
  obstacleX = 150; // Start obstacle off-screen
  score = 0;
  gameTicks = 0;
  isDone = false;
  console.log("Minimal Jumper Initialized");
  // simulator.loadCharacters(...) // If needed
}

function update(input, simulator) {
  if (isDone) return;

  gameTicks++;

  // === Player Logic ===
  playerVy += GRAVITY;
  playerY += playerVy;

  // Ground check
  if (playerY >= GROUND) {
    playerY = GROUND;
    playerVy = 0;
  }

  // Jump on press (only if on ground)
  if (input.justPressed && playerY >= GROUND - 1) {
    playerVy = -JUMP_STRENGTH;
  }

  // === Obstacle Logic ===
  obstacleX -= OBSTACLE_SPEED;
  if (obstacleX < -OBSTACLE_SIZE) {
    obstacleX = 150; // Reset position
    score++;
  }

  // === Collision Detection & Drawing Simulation ===
  // **IMPORTANT:** Call drawing functions to check collisions.
  // Order matters: Check player against things drawn *before* it.

  // 1. Simulate drawing the obstacle (and add its hitbox)
  simulator.color("red"); // Obstacle is red
  // Use box() for center-based coordinates. Store result (optional here).
  simulator.box(
    obstacleX,
    GROUND - OBSTACLE_SIZE / 2, // Position obstacle on the ground
    OBSTACLE_SIZE,
    OBSTACLE_SIZE
  );

  // 2. Simulate drawing the player and check collision *against existing hitboxes* (the obstacle)
  simulator.color("blue"); // Player is blue
  const playerCollision = simulator.box(
    PLAYER_X,
    playerY,
    PLAYER_SIZE,
    PLAYER_SIZE
  );

  // 3. Check the player's collision result
  if (playerCollision.isColliding.rect.red) {
    // Did the blue player box hit the red obstacle box?
    isDone = true; // Game over on collision
    console.log(`Game Over! Final Score: ${score}`);
  }

  // --- Expose State for Expert Input ---
  // Make current state available for generateExpertInput
  simulator.conceptState = {
    playerY: playerY,
    playerVy: playerVy,
    obstacleX: obstacleX,
    groundY: GROUND,
    playerX: PLAYER_X,
  };
}

function getScore() {
  return score;
}

function isGameOver() {
  return isDone;
}

// --- Optional Expert Input ---
function generateExpertInput(gameState, currentTick) {
  const state = gameState.conceptState;

  // Basic Expert Logic: Jump if obstacle is close and player is on the ground
  const jumpThreshold = 40; // How close the obstacle needs to be

  if (
    state.playerY >= state.groundY - 1 && // Player is on the ground
    state.obstacleX > state.playerX && // Obstacle is to the right
    state.obstacleX < state.playerX + jumpThreshold // Obstacle is close enough
  ) {
    // Check if jumping *now* would likely clear the obstacle.
    // (This is a simplified check; real logic might be more complex)
    // We could even use simulator.box() here to predict future positions,
    // but let's keep it simple for the example.
    return true; // Press button to jump
  }

  return false; // Don't press button
}

// Export the functions
module.exports = {
  init,
  update,
  getScore,
  isGameOver,
  generateExpertInput, // Export the expert function if defined
};
```

## Interpreting Test Results

The test framework will provide detailed results for each metric:

1. **Skill Gap Analysis**:

   - A breakdown of scores achieved by expert vs. beginner patterns
   - Specific areas where skilled play made the biggest difference
   - Suggestions for enhancing or balancing skill requirements

2. **Duration Assessment**:

   - Distribution of game duration across multiple simulations
   - Factors influencing premature game overs
   - Recommendations for adjusting difficulty to achieve target duration

3. **Progression Evaluation**:

   - Analysis of how challenge increases over time
   - Identification of difficulty spikes or plateaus
   - Guidance on creating smoother progression curves

4. **Input Diversity Requirements**:
   - Effectiveness of different input strategies
   - Identification of dominant strategies or exploits
   - Suggestions for mechanics that encourage varied inputs

## Recommendations

Based on the test results, consider:

1. **Adjusting Parameters**: Fine-tune game constants to address specific issues
2. **Mechanic Modifications**: Revise core mechanics that aren't performing well
3. **Feature Additions**: Add complementary features to enhance strengths or address weaknesses
4. **Concept Pivots**: For low-scoring concepts, consider more substantial redesigns or alternative approaches
