## PREREQUISITE FILES - READ BEFORE EXECUTION

Before starting any task, you MUST read these files in the following order:

1. **cursor_knowledge/game-design-guide.md** - Comprehensive design principles, interaction patterns, and evaluation criteria
2. **cursor_knowledge/crisp-game-lib.d.ts** - Complete API reference for the game library
3. **cursor_knowledge/crisp-game-lib-main.js** - Complete working game implementation example
4. **cursor_knowledge/crisp-game-lib-index.html** - HTML structure and library setup example
5. **cursor_knowledge/crisp-game-lib-readme.md** - Library documentation and usage guide
6. **cursor_knowledge/sample-games/pinclimb.md** - Implementation example and code patterns (for technical reference only)

**VERIFICATION CHECKPOINT**: After reading these files, you must be able to:

- Explain one-button interaction patterns (press, hold, release) and their applications
- Understand environmental interaction types and movement patterns from game-design-guide.md
- Apply design principles for novel yet intuitive game concepts
- Recognize evaluation criteria for balance, visual design, and player engagement
- Apply SCAMPER method and natural phenomena inspiration from game-design-guide.md
- Understand the crisp-game-lib API structure and key functions
- Understand the complete game implementation structure from crisp-game-lib-main.js
- Know how to set up HTML structure and library integration from crisp-game-lib-index.html
- Understand library documentation and usage from crisp-game-lib-readme.md
- Recognize the implementation patterns from pinclimb.md (for technical reference only)
- **CRITICAL**: Understand that sample-games are for implementation patterns only, not creative constraints

---

Your task is to design innovative, intuitive, and fun one-button action mini-games with simple rules. You will implement ALL games completely. Follow these steps:

1. Ask the user for a theme or concept for the game.

2. Generate 8 unique game ideas based on the theme. For each idea:

   **REQUIRED READING BEFORE THIS STEP:**

   - MUST have read `cursor_knowledge/game-design-guide.md` for comprehensive design principles and interaction patterns
   - FOCUS PRIMARILY on game-design-guide.md for creative inspiration and principles
   - **MINIMIZE initial reference to sample-games** - use these only for implementation patterns later

   **CREATIVE DIVERSITY ENFORCEMENT:**

   **A. Mandatory Diversity Constraints:**

   - Each idea MUST use a different control mechanic from the design guide
   - Each idea MUST use a different environment type from the design guide

   **B. Creative Exploration Requirements:**

   - Apply SCAMPER method to at least 3 ideas (Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse/Rearrange)
   - Draw inspiration from natural phenomena for at least 3 ideas (waves, growth, orbits, magnetism, etc.)
   - Implement creative constraints for at least 2 ideas (remove expected elements like gravity, direct control, static surfaces, etc.)
   - Question physics assumptions: "What if gravity changed?", "What if time flowed differently?", "What if scale was dynamic?"

   **C. Bias Avoidance Checklist:**

   - Consciously avoid replicating patterns from sample-games
   - Prioritize peaceful/constructive themes over combat/conflict
   - Explore abstract mathematical/geometric concepts
   - Consider non-obvious interpretations of the given theme
   - Challenge your first instinct - if an idea feels familiar, push further

   **IMPLEMENTATION:**

   - Apply all design principles from `cursor_knowledge/game-design-guide.md` (interaction patterns, environmental types, idea generation methods)
   - **DEFER sample-games reference** - focus on novel concept creation first
   - Briefly describe the core mechanic and one-button control.

   **AVOID COMPLEX MECHANICS:**

   - power-ups
   - rhythm
   - maze
   - energy, fuel or time limit
   - balance
   - scoring systems
   - win/lose conditions
   - end game conditions
   - difficulty adjustment

   **INDEPENDENCE GUIDELINES:**

   To ensure maximum diversity and independence between all games using game-design-guide.md principles:

   **A. Diverse Player Control Mechanics:**

   - Use different control types from the design guide (rotational, trajectory, positional snapping, state switching, growth/extension, thrust/gravity, reflection/deflection, path adherence, timing-based)
   - Apply different interaction patterns (press, hold, release) with unique outcomes

   **B. Varied Environmental Interactions:**

   - Apply different environment types (central anchor/orbit, defined path/track, open space physics, scrolling landscape, lane-based, dynamic surface, etc.)
   - Use different movement patterns (stationary action, automatic movement, controlled trajectory, gravity & thrust, etc.)

   **C. Independent Core Action Mechanics:**

   - Use different objectives (target destruction, item collection, hazard avoidance, precision matching, accurate timing, traversal/progression, etc.)
   - Apply different action verbs (build, destroy, avoid, collect, transform, navigate, etc.)

   **D. Distinct Visual and Physical Laws:**

   - Apply different physics principles per game (gravity, inertia, momentum, magnetism, fluid dynamics, etc.)
   - Use distinct visual approaches and color palettes
   - Create unique movement and interaction patterns

   **DIVERSITY VERIFICATION:**

   After generating all 8 ideas, perform this comprehensive self-check:

   - [ ] All games use different player control mechanics from design guide
   - [ ] All games apply different environmental interaction types
   - [ ] All games feature different core action objectives
   - [ ] All games implement different movement patterns
   - [ ] All games employ different visual and physical approaches
   - [ ] At least 3 ideas applied SCAMPER method
   - [ ] At least 3 ideas drew from natural phenomena
   - [ ] At least 2 ideas implemented creative constraints
   - [ ] Ideas avoid obvious similarities to sample-games
   - [ ] Multiple peaceful/constructive themes included
   - [ ] Abstract/mathematical concepts explored
   - [ ] Non-obvious theme interpretations present

   **If any verification fails, regenerate ideas until all criteria are met.**

   Present the ideas in a numbered list.

3. For ALL game ideas, create concise game rules for each. Focus on:

   **REQUIRED READING**: As per prerequisite files above.

   **IMPLEMENTATION:**

   For each of the game ideas, specify:

   - Game Environment
   - Core Mechanics
   - Player Interaction
   - Challenge

   Apply all design principles from game-design-guide.md (as referenced above).

   **AVOID COMPLEX MECHANICS** (as defined above).

4. For ALL games, detail the game objects (maximum 3 types per game) that implement the game rules. For each object in each game, specify:

   - Properties (e.g., position, size, state)
   - Initial state
   - Shape (use simple geometric shapes)
   - Color (choose from: red, green, yellow, blue, purple, cyan, black)
   - Behavior (movement patterns, interactions)
   - One-button controls (if applicable)
   - Collision events
   - Spawning rules
   - Scrolling (if applicable)

   **AVOID COMPLEX MECHANICS** (as defined above).

5. For ALL games, provide skeleton JavaScript code structure with comments outlining the implementation of game rules. Include:

   - Variable definitions for game objects
   - update() function structure
   - Placeholders for object behavior implementation

6. Study the crisp-game-lib library and example code:

   **REQUIRED READING BEFORE THIS STEP:**

   - MUST have read `cursor_knowledge/crisp-game-lib.d.ts` for complete API reference
   - MUST have read `cursor_knowledge/crisp-game-lib-main.js` for complete implementation example
   - MUST have read `cursor_knowledge/crisp-game-lib-index.html` for HTML setup structure
   - MUST have read `cursor_knowledge/crisp-game-lib-readme.md` for library documentation
   - NOW reference `cursor_knowledge/sample-games/pinclimb.md` for technical implementation patterns only

   a. Examine crisp-game-lib.d.ts:

   - This file provides type definitions for the library's functions and objects.
   - Pay attention to the following key elements:
     - Input handling: use `input.isPressed`, `input.isJustPressed`, and `input.isJustReleased`
     - Drawing functions: `color()`, `rect()`, `box()`, `bar()`, `line()`, `arc()`, `text()`
     - Collision detection: Use the `Collision` type returned by drawing functions
     - Vector operations: Utilize the `Vector` interface and `vec()` function
     - Random number generation: `rnd()`, `rndi()`, `rnds()`
     - Math utilities: `clamp()`, `wrap()`, `PI`, `abs()`, `sin()`, `cos()`, `Math.max()`, `Math.min()`, etc.

   b. Analyze the source code section of `cursor_knowledge/sample-games/pinclimb.md`:

   - This file demonstrates a complete game implementation using crisp-game-lib.
   - Note the structure and patterns used, such as:
     - Object definitions and their properties
     - The `update()` function structure
     - How scrolling is implemented
     - Collision detection and handling
     - Use of drawing functions
   - If the screen size is 100x100, the coordinates (x, y) of the four corners of the screen are as follows:
     - upper left (0, 0), upper right (99, 0), lower left (0, 99), lower right (99, 99)
   - Velocity vectors (vx, vy) in the four directions are:
     - up (0, -1), down (0, 1), left (-1, 0), right (1, 0)
   - Use `isColliding` for simultaneous drawing and collision detection:
     ```javascript
     color("red");
     arc(obstacle.pos, 5);
     color("blue");
     // Collision detection should be done after the target shape is drawn
     // Use `isColliding.rect` to check for collisions with any type of shape
     // There are no properties like `isColliding.circle`, 'isColliding.arc` or `isColliding.line`
     if (box(player.pos, player.size).isColliding.rect.red) {
       // Handle collision with drawn red shapes
     }
     ```
   - Implement scrolling with a scrollingVelocity Vector:
     ```javascript
     let scrollingVelocity = vec(0, 1);
     // In update():
     obstacle.pos.y -= scrollingVelocity.y;
     ```
   - Use `vec()` for Vector copying:
     ```javascript
     let newPos = vec(oldPos);
     ```
   - Utilize `clamp()` for value limiting:
     ```javascript
     player.pos.x = clamp(player.pos.x, 0, 100);
     ```
   - Use `rnd()` for events that occur with a certain probability:
     ```javascript
     if (rnd() < 0.05) {
     }
     ```
   - It is not necessary to declare the `score` and `difficulty` variables

7. For ALL games, implement the game logic using the crisp-game-lib library, translating each comment in the skeleton into functional JavaScript. Key points:

   **REQUIRED READING VERIFICATION**: As per prerequisite files above.

   **IMPLEMENTATION:**

   For each of the games:

   - Accurate implementation of game rules
   - Clear and concise code structure
   - Retention of descriptive comments
   - **AVOID COMPLEX MECHANICS** (as defined above).

8. Create the game files in the proper directory structure for ALL games:

   **REQUIRED READING REFERENCE**: As per prerequisite files above.

   **IMPLEMENTATION:**

   For each of the games:

   - Create a new directory: ./tmp/games/[game-name] (where [game-name] is the name of your game)
   - Place two files in this directory:
     - index.html: A complete HTML file that includes the crisp-game-lib library and runs the game
     - main.js: The game logic implementation from step 7
   - The index.html should:
     - Include the crisp-game-lib library from a CDN or local copy
     - Load the main.js file
     - Set up the game canvas and initialization
     - Provide a complete, playable game experience

   **BATCH PROCESSING:**

   - Process all games systematically
   - Ensure each game is complete and playable
   - Create separate directories for each game
   - Test each implementation before moving to the next

9. Adjust ALL games for optimal toy experience:

   **PURPOSE:**

   Transform completed games into true "toy" experiences where players can safely experiment, learn, and create without fear of failure.

   **CORE ADJUSTMENTS:**

   **A. Remove Game Over Mechanics:**

   - Eliminate all `end()` function calls from every game
   - Replace failure states with recovery mechanisms
   - Convert punitive systems into learning opportunities

   **B. Implement Recovery Systems:**

   For each of the games, replace failure conditions with appropriate recovery mechanisms:

   - **Player Falls Off Screen**: Reset player to safe starting position with neutral state
   - **Speed/Momentum Issues**: Adjust player speed to safe, playable levels when too fast or slow
   - **Collision with Obstacles**: Implement bounce-back, position reset, or temporary immunity
   - **Missing Required Elements**: Teleport player to safe position or generate necessary elements
   - **State Conflicts**: Reset problematic states (gravity, direction, mode) to stable defaults

   **C. Screen Boundary Protection:**

   Add comprehensive boundary checks to ALL games:

   ```javascript
   // Keep player within horizontal screen bounds
   if (player.pos.x < 5) {
     player.pos.x = 10;
   }
   if (player.pos.x > 95) {
     player.pos.x = 90;
   }
   // Keep player within vertical screen bounds
   if (player.pos.y < 5) {
     player.pos.y = 10;
   }
   if (player.pos.y > 95) {
     player.pos.y = 90;
   }
   ```

   **D. Maintain Exploration Mindset:**

   - Ensure all recovery feels natural and non-punitive
   - Preserve player agency and experimentation
   - Keep mechanisms simple and predictable
   - Avoid complex state management

   **IMPLEMENTATION PRINCIPLES:**

   - **Continuity**: Players should never be forced to restart
   - **Safety**: No way to permanently break or lose progress
   - **Discovery**: Encourage experimentation with different control patterns
   - **Foundation**: Create solid base for future gameplay additions

   **VERIFICATION:**

   After implementing adjustments, confirm each game:

   - Never calls `end()` under any circumstances
   - Handles all edge cases with graceful recovery
   - Keeps players visible and active on screen
   - Maintains engaging core mechanic exploration
   - Provides safe environment for creative play

**FINAL VERIFICATION CHECKPOINT:**
Before presenting the completed games, confirm you have:

**CREATIVE VERIFICATION:**

- Applied design principles from `cursor_knowledge/game-design-guide.md` to all games
- Confirmed diversity verification criteria met (as specified in Step 2)
- Challenged conventional game design assumptions

**TECHNICAL VERIFICATION:**

- Successfully read and applied concepts from all prerequisite files
- Used technical patterns from `cursor_knowledge/sample-games/pinclimb.md` for implementation only
- Used API functions correctly per `cursor_knowledge/crisp-game-lib.d.ts` in all games
- Used complete implementation structure from `cursor_knowledge/crisp-game-lib-main.js` for all games
- Applied HTML setup patterns from `cursor_knowledge/crisp-game-lib-index.html` for all games
- Followed library documentation from `cursor_knowledge/crisp-game-lib-readme.md` for all games
- Created separate directories for each of the all games
- Ensured all games are complete and playable
- Tested each game implementation individually

**EXPERIENCE VERIFICATION:**

- Applied quality evaluation criteria from game-design-guide.md
- Converted all games to toy experiences with no game over conditions
- Implemented comprehensive recovery systems for all failure scenarios
- Added screen boundary protection to prevent players from becoming lost
- Verified that all games provide safe, continuous exploration experiences

**META-COGNITIVE VERIFICATION:**

- Consciously questioned and avoided first instincts that led to familiar patterns
- Actively sought non-obvious interpretations of the given theme
- Deliberately explored underrepresented mechanical territories
- Confirmed that the final game collection represents genuine creative diversity

Remember:

- Prioritize simplicity and innovation in game mechanics
- Design rules that are straightforward to implement
- Create intuitive gameplay that's enjoyable with one-button control
- Balance challenge and accessibility for a fun player experience
