# Game rules

1. Game Environment:
   - The game takes place on a scrolling screen with wavy water at the bottom.
   - Mines float on the water's surface.

2. Core Mechanics:
   - The player controls a ship that floats on the water or jumps above it.
   - The screen continuously scrolls to the right.
   - The water's surface is dynamic, creating waves that affect the ship's movement.

3. Player Interaction:
   - One-button control: Tapping makes the ship jump.
   - While in the air, holding the button slows the ship's descent.

4. Challenge:
   - The player must navigate the ship over the waves and avoid colliding with mines.
   - Longer jumps score more points.

# Game objects

## Waves
- Properties:
  - height: Wave amplitude
  - angle: Current phase of the wave
  - va: Angular velocity
  - x: Horizontal position
- Initial state:
  - 7 wave segments with random heights, angles, and velocities
- Shape: Curved line (represented by points)
- Color: blue
- Behavior:
  - Move to the left as the screen scrolls
  - Oscillate up and down based on their angle and height
- Spawning rules:
  - New wave segments appear on the right side of the screen as old ones move off-screen

## Ship
- Properties:
  - pos: Current position (Vector)
  - pp: Previous position (Vector)
  - vel: Velocity (Vector)
  - angle: Rotation angle
  - state: "float" or "jump"
- Initial state:
  - Position: (40, 60)
  - State: "float"
- Shape: Composed of two bars
- Color: red (body) and black (wing)
- Behavior:
  - Floats on water, following the wave contours
  - Jumps when the button is pressed
  - Rotates to align with movement direction
- One-button controls:
  - Tap to jump
  - Hold in air to slow descent
- Collision events:
  - Colliding with water while jumping ends the jump
  - Colliding with mines ends the game

## Mines
- Properties:
  - x: Horizontal position
  - vx: Horizontal velocity
- Initial state: None (spawned during gameplay)
- Shape: Asterisk ("*")
- Color: red
- Behavior:
  - Float on the water surface, affected by waves
- Spawning rules:
  - Appear on the right side of the screen at intervals
- Collision events:
  - Colliding with the ship ends the game

# Skeleton code

```javascript
title = "TURBULENT";

description = `
[Tap] Jump
`;

characters = [];

options = {
  // Game options
};

/** @type {{height: number, angle: number, va: number, x: number}[]} */
let waves;
/** @type {Vector[]} */
let points;
/** @type {{x: number, vx: number}[]} */
let mines;
let nextMineDist;
/**
 * @type {{pos: Vector, pp: Vector, vel: Vector, angle: number,
 * state: "float" | "jump"
 * }}
 */
let ship;
let jumpX;

function update() {
  if (!ticks) {
    // Initialize game objects
  }

  // Update waves
  
  // Draw water surface
  
  // Spawn and update mines
  
  // Update ship position and state
  
  // Handle ship-water collision
  
  // Handle ship-mine collision
  
  // Helper function to get wave points
  function getPoints(x) {
    // Implementation
  }
}
```

# Source code

```javascript
title = "TURBULENT";

description = `
[Tap] Jump
`;

characters = [];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 300,
};

/** @type {{height: number, angle: number, va: number, x: number}[]} */
let waves;
/** @type {Vector[]} */
let points;
/** @type {{x: number, vx: number}[]} */
let mines;
let nextMineDist;
/**
 * @type {{pos: Vector, pp: Vector, vel: Vector, angle: number,
 * state: "float" | "jump"
 * }}
 */
let ship;
let jumpX;

function update() {
  if (!ticks) {
    waves = times(7, (i) => {
      return {
        height: rnd(10, 30),
        angle: (i % 2) * PI + rnds(PI / 4),
        va: rnd(0.01, 0.02),
        x: i * 20 - 20,
      };
    });
    points = times(25, (i) => vec());
    mines = [];
    nextMineDist = 0;
    ship = {
      pos: vec(40, 60),
      pp: vec(40, 60),
      vel: vec(),
      angle: 0,
      state: "float",
    };
  }

  // Update game state (scrolling, waves, mines, ship)
  // ... (rest of the update function)

  function getPoints(x) {
    let pp;
    let np;
    for (let i = 0; i < points.length; i++) {
      pp = points[wrap(i - 1, 0, points.length)];
      np = points[i];
      if (pp.x > np.x) {
        continue;
      }
      if (pp.x <= x && x < np.x) {
        return [pp, np];
      }
    }
    return [undefined, undefined];
  }
}
```