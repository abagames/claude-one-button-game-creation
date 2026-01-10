# One-Button Game Development Prompt

## Purpose

Following the development process below, develop a high-quality one-button mini-game. The development process uses Node.js for testing and evaluation, with the final product implemented using crisp-game-lib for browser-based gameplay. The final product should be easy to play, original, and properly implemented with complete game code.

Start with the idea generation phase and create **5 distinctly different game concepts**.

## Development Process Overview

1. **Idea Generation Phase**: Generate multiple game concepts from a theme
2. **Prototype Testing Phase**: Create simplified implementations and evaluate using Node.js (focus on core mechanic viability and qualitative feel)
3. **Concept Selection Phase**: Choose the best concept based on prototype insights and potential for refinement
4. **Implementation Phase**: Develop the selected concept into a complete game using crisp-game-lib

## Idea Generation Phase Instructions

Create innovative game ideas while documenting the idea generation process using the following methods.

### Theme Exploration

- Develop game concepts based on provided themes or generate your own unique theme combinations
- Consider unexpected theme pairings (e.g., "ancient mythology + household appliances")
- Extract core elements from abstract themes and transform them into concrete game mechanics
- Explore themes through different emotional lenses (excitement, tension, mystery, satisfaction)
- **Refer to the relevant sections of the `cursor_knowledge/game-design-guide.md` file at each phase to ensure consistent and principled game design.**
- Reference the `cursor_knowledge/game-design-guide.md` file's Section 2 "Recommended Game Design Principles" to ensure adherence to fundamental design principles
- Utilize the `cursor_knowledge/game-design-guide.md` file's Section 3 "One-Button Interaction Patterns" to explore diverse interaction possibilities

### Diverse Concept Generation

- While drawing inspiration from examples is encouraged, aim to generate concepts that offer fundamentally unique core mechanics and interactions, moving beyond direct copies of those found in `cursor_knowledge/sample-games/`.
- Create **5 distinctly different game concepts** with unique core mechanics
- Ensure diversity across the following dimensions:
  - **Button Interaction Types**: Press, hold, release, rhythmic patterns, timing-based actions
  - **Physical Principles**: Gravity, momentum, elasticity, magnetism, fluid dynamics
  - **Game Environments**: Varied spaces with different constraints and properties
  - **Movement Patterns**: Linear, orbital, oscillating, expanding/contracting, teleporting
  - **Player Objectives**: Collecting, avoiding, aligning, destroying, reaching
- Apply different creative thinking techniques for each concept (substitution, combination, adaptation, etc.)
- Leverage the `cursor_knowledge/game-design-guide.md` file's Section 5 "Idea Generation Methods" to stimulate diverse creative approaches

### Inspiration Sources

- Draw from diverse sources to spark unique mechanics:
  - Classic games from different eras (arcade, early console, mobile)
  - Physical world phenomena and scientific principles
  - Everyday activities abstracted into game mechanics
  - Natural world behaviors (animal movements, plant growth, weather patterns)
  - Human sensory experiences and perceptual effects
  - Examine sample games in `cursor_knowledge/sample-games/` for inspiration on mechanics, themes, and implementation patterns, but don't limit your ideas solely to these examples.
- Avoid relying on the same inspiration source for multiple concepts
- Challenge yourself to combine seemingly unrelated concepts or mechanics in novel ways.
- Think beyond typical game genres and explore unconventional interactions.

### Documentation Structure

For each concept, document:

1. **Core Mechanic**: The fundamental interaction driven by the one-button control
2. **Player Goal**: Clear objective that drives gameplay
3. **Challenge Elements**: What creates difficulty and engagement
4. **Scoring System**: How player performance is measured
5. **One-Button Pattern**: Specific implementation of button interaction
6. **Unique Appeal**: What makes this concept distinctive and engaging
7. **Risk-Reward Dynamic**: How the player balances safety against potential gains

## Prototype Testing Phase Instructions

Document the game rules and details of game objects corresponding to each concept, and test the game concepts using the Node.js test framework.

1. **Create a Concise Set of Game Rules**

   - Focus on:
     - **Game Environment**: Define the playing field, boundaries, and overall structure
     - **Core Mechanics**: Explain the fundamental rules governing gameplay
     - **Player Interaction**: Detail exactly how the one-button control affects gameplay
     - **Challenge**: Specify what makes the game challenging and how difficulty increases
   - Output game rules that correspond to each concept
   - Follow the `cursor_knowledge/game-design-guide.md` file's Section 2 principles to maintain clarity and simplicity in rule design
   - Review the rule descriptions in `cursor_knowledge/sample-games/` as examples of how game rules can be structured, tailoring your rules to your unique concept.

2. **Detail the Game Objects**

   - Limit to a maximum of 3 types of objects for simplicity
   - For each object, specify:
     - **Properties**: Position, size, velocity, etc.
     - **Initial State**: Where objects start and in what condition
     - **Shape**: Use simple geometric shapes (circle, rectangle, etc.)
     - **Behavior**: Movement patterns, interactions with other objects
     - **One-Button Controls**: How button input affects this object (if applicable)
     - **Collision Events**: What happens when objects collide
     - **Spawning Rules**: When and where new instances appear
     - **Scrolling**: How objects move with screen scrolling (if applicable)
   - Output the details of the game objects corresponding to each concept
   - Reference the `cursor_knowledge/game-design-guide.md` file's Section 6 "Game Mechanics Classification" when detailing object behaviors and interactions
   - Refer to the object definitions in `cursor_knowledge/sample-games/` as examples for structuring object properties and behaviors, adapting them as needed for your specific game design.

3. **Implementation and testing of prototypes using Node.js**
   - You can examine the logic within the `# Source code` sections of files in `cursor_knowledge/sample-games/` for inspiration on implementing core mechanics in JavaScript. Remember to significantly adapt this logic for the Node.js testing environment (using `gameState`, etc.) and prioritize your own concept's specific needs.
   - Create game concept prototype files in the `tmp/concepts/` directory.
   - Follow the format defined in the test framework documentation (`cursor_knowledge/game-testing-prompt.md`).
   - **Export the required functions:** Your module must export `init`, `update`, `getScore`, and `isGameOver`.
   - **Optionally export:** You can also export `generateExpertInput(gameState, currentTick)` to provide game-specific logic for simulating expert play. Refer to `cursor_knowledge/game-testing-prompt.md` for details on its implementation and the `gameState` object.
   - Implement the core game mechanics, scoring system, and game over conditions within the exported functions.
   - **If implementing `generateExpertInput`:** Ensure your `update` function makes the necessary internal game state (e.g., player position, enemy state) accessible to the testing framework by assigning it to `global.simulator.conceptState`. Use this global access cautiously.
   - Run tests using the command:
     ```bash
     node ./cursor_knowledge/game-testing-framework.js ./tmp/concepts/[concept1].js ./tmp/concepts/[concept2].js ...
     ```
   - Analyze the evaluation results provided by the framework for:
     - Skill gap indications (Beginner vs. Expert patterns – note that expert patterns are more accurate if `generateExpertInput` is implemented)
     - Approximate game duration potential
     - Potential difficulty progression patterns
     - Resistance to basic monotonous input patterns
   - **Summarize Findings for Selection**: For each concept, document:
     - **Qualitative Gameplay Feel:** How engaging/fun/intuitive is the core mechanic in simulation?
     - **Quantitative Test Insights:** Briefly note key metrics (duration, score potential, monotony resistance, skill gap). Treat skill gap results with higher confidence if `generateExpertInput` was used.
     - **Refinement Potential:** How easily can this concept be improved or expanded upon in crisp-game-lib?
     - **Potential Bottlenecks/Risks:** Are there obvious implementation challenges or design flaws?
     - This summary, with a strong emphasis on qualitative aspects and refinement potential, directly informs the Concept Selection Phase.

## Concept Selection Phase Instructions

1. **Comparative Analysis**

   - Apply the `cursor_knowledge/game-design-guide.md` file's Section 7 "One-Button Game Design Evaluation" criteria to _holistically_ assess each concept, considering both qualitative feel and quantitative insights from the prototype phase.
   - Compare the summarized findings (qualitative feel, quantitative insights, refinement potential, risks) for each game concept.
   - Evaluate the novelty of each concept on a scale of 0-5 points.
   - Create a comparison table summarizing the key qualitative and quantitative points for all tested concepts.
   - Do not rely solely on the Node.js evaluation score. Consider the complete picture.

2. **Objective Selection and Refinement Planning**
   - Select the game concept that demonstrates the best balance of engaging core mechanic (qualitative feel), innovation, and high potential for refinement based on the Prototype Testing Phase findings.
   - Explicitly document the identified strengths and weaknesses of the _chosen_ concept, considering both qualitative observations and quantitative test results.
   - Based on the analysis, outline a concrete list of _specific improvements_ and refinements to be incorporated during the Implementation Phase. This refinement plan becomes a key input for the next phase.

## Implementation Phase Instructions

1. **Setting Up the Game Implementation**

   - **For detailed guidance on using crisp-game-lib within this project, including templates, key APIs, and configuration, refer to `cursor_knowledge/crisp-game-lib-readme.md`.**
   - Create a new directory for the final game: `docs/[your-game-name]/`. Replace `[your-game-name]` with the chosen concept's name.
   - Create the main game file `docs/[your-game-name]/main.js`. crisp-game-lib games are typically self-contained in a single JavaScript file.
   - Copy `cursor_knowledge/crisp-game-lib-index.html` to `docs/[your-game-name]/index.html`.
   - **Structure based on crisp-game-lib**: The implementation must follow the structure expected by crisp-game-lib. Define the necessary properties like `title`, `description`, `characters`, `options`, and the core `update` function within `main.js`.
   - **Implement the Refined Concept**: Based on the _refinement plan_ documented in the Concept Selection Phase (or based on Node.js test results if they led to selecting a different concept), begin implementing the chosen game concept using crisp-game-lib within `docs/[your-game-name]/main.js`. Incorporate planned improvements from the start.
   - Faithfully replicate object behavior and collision detection in framework-based concept tests, preventing gaps between test results and the actual play feel.
   - Consult the source code within `cursor_knowledge/sample-games/` for practical examples of implementing various game features and using the `crisp-game-lib` API. Pay attention to how different games structure their `update` function, manage game state, and handle input.
   - Ensure all core game mechanics are implemented using crisp-game-lib's API.

2. **Complete Game Object Definition**

   - Managee game objects within the `update` function using appropriate properties (position, velocity, etc.).
   - Implement proper initialization logic within the `update` function (e.g., checking for the first frame or specific conditions).
   - Follow the `cursor_knowledge/game-design-guide.md` file's Section 2.3 "Simple Shapes and Visuals" to maintain visual simplicity using crisp-game-lib's drawing functions (`rect()`, `box()`, `line()`, `bar()`, `arc()`, `text()`, `char()`).

3. **Core Mechanism Implementation**

   - Implement the one-button control mechanism using crisp-game-lib's `input` object (e.g., `input.isJustPressed`).
   - Ensure smooth and responsive controls.
   - Implement physics and collision detection using crisp-game-lib's built-in collision functions (`char().isColliding`, `rect().isColliding`, etc.) or simple custom logic within the `update` function.
   - Adhere strictly to the `cursor_knowledge/game-design-guide.md` file's Section 2 "Recommended Game Design Principles" when implementing core mechanics.
   - The files in `cursor_knowledge/sample-games/` provide concrete examples of implementing one-button controls (`input`), physics, and collision detection (`isColliding`) using `crisp-game-lib`. Use these as a reference when implementing your core mechanics.

4. **Game State Management**

   - Implement game over detection within the `update` function and trigger the end state using `end()`.
   - Add score tracking using `addScore()`. crisp-game-lib handles the display automatically.
   - Implement difficulty progression as gameplay advances (e.g., by adjusting variables within the `update` function based on `difficulty` or `ticks`).
   - Remove objects that are no longer needed (e.g., off-screen projectiles) using standard JavaScript array manipulation or crisp-game-lib's `remove()` function if applicable.
   - Follow the `cursor_knowledge/game-design-guide.md` file's Section 2.5 "Implicit Visual Feedback" for game state feedback.

5. **Responsive Canvas Scaling**

   - crisp-game-lib handles canvas creation and scaling internally based on the `options` provided (e.g., `options.viewSize`). Ensure the chosen `viewSize` is appropriate for the game design.
   - The library generally maintains the aspect ratio and scales to fit the available space, requiring no additional CSS for basic responsive behavior.

6. **Implementation Completion**
   - Ensure the gameplay matches the chosen concept and incorporates planned refinements.
   - (Optional but recommended) Re-run Node.js tests if significant logic changes were made during crisp-game-lib implementation that could affect the core mechanics tested earlier, adapting the test framework or game logic as needed to bridge potential differences.
