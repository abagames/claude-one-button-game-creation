# crisp-game-lib Usage in this Project

`crisp-game-lib` is the JavaScript library used for the final implementation phase of the one-button game development process outlined in `cursor_cursor_knowledge/prompt.md`.

## Getting Started

1.  **Refer to the Prompt:** Understand the overall development flow and the specific requirements for the implementation phase described in `cursor_knowledge/prompt.md`.
2.  **Use the Templates:**

    - Start your game implementation using `cursor_knowledge/crisp-game-lib-main.js` as a base template for your `docs/[your-game-name]/main.js` file.
    - Use `cursor_knowledge/crisp-game-lib-index.html` to create the minimal `index.html` required to run your game in the browser.
    - Create your `docs/[your-game-name]/main.js` file.
    - Copy `cursor_knowledge/crisp-game-lib-index.html` to `docs/[your-game-name]/index.html`.

3.  **Implement Your Game:** Fill in the `title`, `description`, `characters`, `options`, and especially the `update` function in your `main.js` according to your chosen game concept.

## Key APIs for One-Button Games

While `crisp-game-lib` offers various functionalities, the following are particularly relevant for the one-button games developed in this project:

- **Input:** `input.isJustPressed` - Detects the single button press.
- **Scoring:** `addScore(value, [pos])` - Adds to the score (display is handled automatically).
- **Game End:** `end()` - Ends the game and displays the final score.
- **Drawing:** `rect()`, `box()`, `line()`, `bar()`, `arc()`, `char()`, `text()`- Used for rendering visuals. Keep visuals simple as per `cursor_knowledge/game-design-guide.md`.
- **Collision:** `char().isColliding`, `rect().isColliding` (and their variants) - Detect collisions between game elements.
- **Sound:** `play()` - Plays sound effects defined by sound strings.
- **Configuration:** `options` object (e.g., `options.theme`, `options.viewSize`, `options.audioSeed`) - Customize game appearance and behavior.

**For detailed information on all available functions, properties, and their parameters, please refer to the TypeScript definition file:** `cursor_knowledge/crisp-game-lib.d.ts`.

## Relationship with Node.js Testing

The Node.js testing phase (using `cursor_knowledge/one-button-game-test-framework.js`) provides initial insights into game mechanics and balance. However, it's important to note:

- **Simulation Differences:** The Node.js environment simulates game logic but lacks the graphical rendering and precise timing of the browser. Core mechanics might feel different.
- **Collision Handling:** `crisp-game-lib` uses a drawing-based collision system (`rect`, `box`, `char`, etc., check for collisions when drawn). The Node.js prototypes use their own collision logic, which might differ significantly. Rely on `crisp-game-lib`'s collision results during final implementation.
- **Focus:** Use the Node.js tests for early validation and identifying major balance issues or monotonous pattern vulnerabilities. Final tuning and feel adjustments must be done during `crisp-game-lib` implementation and browser testing.

## Tips

- **Drawing Order and Collision Detection:** The order in which objects are drawn is crucial for collision detection. Objects that need to detect collisions with other objects should be drawn after those other objects. For example, if a projectile needs to collide with an enemy, draw the projectile first, then the enemy to ensure proper collision detection.
- By drawing with `color("transparent")`, you can get the result of collision detection without drawing any shape on the screen.
- The collision detection is based on the drawing history of the shape. Therefore, even if a drawn shape is overwritten with a background-colored shape, the collision detection in that area will not disappear.
- **Color Visibility:** Avoid using `light_*` colors (like `light_red`, `light_blue`, etc.) for important game elements that require good visibility. These colors have lower contrast and may be difficult to see, especially on smaller screens or for players with visual impairments. Instead, use standard colors (`red`, `blue`, `green`, etc.) for important gameplay elements like projectiles, player characters, or enemies.

## Official Resources

- **GitHub Repository:** [https://github.com/abagames/crisp-game-lib](https://github.com/abagames/crisp-game-lib)
