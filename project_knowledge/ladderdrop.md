# Game rules

1. Game Environment:
   - The game takes place on a vertical scrolling screen with platforms (panels) appearing from the top.
   - Coins can appear on some platforms.

2. Core Mechanics:
   - Platforms move horizontally at the top of the screen.
   - Player can drop platforms by tapping.
   - Platforms fall and stack on each other.
   - The player character can walk on platforms and climb ladders.

3. Player Interaction:
   - One-button control: Tap to drop the current moving platform.
   - The player character moves automatically, changing direction when reaching the edge of a platform.

4. Challenge:
   - Navigate the player character to collect coins while avoiding falling off the platforms.
   - Keep up with the rising difficulty as the game speed increases.

# Game objects

## Panels (Platforms)

- Properties:
  - pos: Position (Vector)
  - size: Size of the panel (Vector)
  - lxs: Array of x-positions for ladder segments
  - state: "wait" | "drop" | "fix"
  - hasCoin: Boolean indicating if the panel has a coin
- Initial state:
  - One panel at the bottom of the screen
- Shape: Rectangle with ladder segments
- Color: black (panel), blue (ladder segments)
- Behavior:
  - "wait" state: Move horizontally at the top of the screen
  - "drop" state: Fall vertically until colliding with another panel
  - "fix" state: Remain stationary, move with screen scrolling
- One-button controls:
  - When tapped: Change state from "wait" to "drop"
- Spawning rules:
  - New panels spawn at the top after the previous panel is dropped
  - Random width and height
  - Random ladder segment positions
- Scrolling:
  - Panels scroll upward with increasing speed based on difficulty

## Player

- Properties:
  - pos: Position (Vector)
  - vx: Horizontal velocity (-1 or 1)
  - state: "walk" | "up" | "down" | "downWalk" | "drop"
- Initial state:
  - Position: On the first panel
  - vx: 1 (moving right)
  - state: "walk"
- Shape: Simple humanoid character
- Color: black
- Behavior:
  - Automatically walks left and right on platforms
  - Climbs up and down ladders
  - Falls when there's no platform beneath
- Collision events:
  - Changes direction when hitting screen edges or gaps in platforms
  - Transitions between walking and climbing states based on collisions

## Coins

- Properties:
  - pos: Position (Vector)
- Initial state: No coins at the start
- Shape: Small circle
- Color: yellow
- Behavior: Static on platforms, move with screen scrolling
- Collision events:
  - Collected by player on contact, increasing score and multiplier
- Spawning rules:
  - Appear on some platforms at regular intervals

# Skeleton code

```javascript
function update() {
  if (!ticks) {
    // Initialize game objects and variables
  }

  // Update and draw panels
  remove(panels, (p) => {
    // Implement panel behavior based on state
    // Handle panel movement, dropping, and fixing
    // Draw panels
    // Remove panels that move off-screen
  });

  // Update and draw player
  // Implement player movement and state transitions
  // Handle collisions with panels and screen edges

  // Update and draw coins
  remove(coins, (c) => {
    // Move coins with screen scrolling
    // Handle coin collection
    // Remove collected coins or coins that move off-screen
  });

  // Update game difficulty and scrolling speed
}

// Helper functions
function drawPanel(p) {
  // Draw panel with ladder segments and coins
}

function addPanel() {
  // Create a new panel with random properties
}
```

# Source code

The source code for the Ladder Drop game can be found in the original ladderdrop.js file. It implements the game logic using the crisp-game-lib library, following the structure outlined in the skeleton code above. The code includes detailed implementations of panel behavior, player movement and state transitions, coin handling, and difficulty adjustment.
