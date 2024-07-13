# Game rules

1. Game Environment:

   - The game world consists of a scrolling landscape with mountains.
   - Mountains are represented by vertical rectangles of varying heights.

2. Core Mechanics:

   - The player controls a spaceship that can thrust upwards.
   - Gravity constantly pulls the spaceship down.
   - The landscape scrolls from right to left.

3. Player Interaction:

   - Hold the button to thrust the spaceship upwards.
   - Release the button to let the spaceship fall.

4. Challenge:
   - Land the spaceship on cyan-colored platforms.
   - Avoid colliding with red-colored mountains.
   - Successfully land on multiple platforms to increase the score.

# Game objects

## Spaceship

- Properties:
  - shipY: Vertical position of the spaceship
  - shipV: Vertical velocity of the spaceship
- Initial state:
  - Position: (25, 30)
  - Velocity: 0
- Shape: Custom character 'a' (spaceship shape)
- Color: green
- Behavior:
  - Constantly affected by gravity (downward acceleration)
  - Thrusts upward when the button is held
- One-button controls:
  - When held: Spaceship thrusts upward
  - When released: Spaceship falls due to gravity
- Collision events:
  - Colliding with cyan rectangle: Successful landing
  - Colliding with red rectangle: Game over

## Mountains

- Properties:
  - y: Vertical position of the mountain base
  - c: Color of the mountain (red or cyan)
- Initial state:
  - 9 mountains with varying heights
  - One cyan mountain (landing platform) at y = 49
- Shape: Vertical rectangles (13 units wide)
- Color: red (obstacles) or cyan (landing platforms)
- Behavior:
  - Scroll from right to left
- Spawning rules:
  - New mountains appear on the right side of the screen
  - Heights are randomly generated within specific ranges
  - Cyan landing platforms appear periodically

## Particles

- Properties:
  - Position, size, angle, speed
- Shape: Small particles
- Color: Not specified (likely white or default color)
- Behavior:
  - Emitted when the spaceship is thrusting or landing

# Skeleton code

```javascript
// Define variables for game objects
let mountains;
let shipY, shipV;
let offset;
let mountainAppDist;
let mountainIndex;
let landingIndex;
let landing;
let landY;
let shipCollision;
let m;
let isFirstLanded;

function update() {
  if (!ticks) {
    // Initialize game state
  }

  // Draw mountains

  // Draw and update spaceship

  // Handle landing state

  // Scroll landscape

  // Generate new mountains

  // Apply spaceship controls and physics

  // Check for collisions and handle game over conditions

  // Update score and difficulty
}
```

# Source code

```javascript
title = "LLAND";

description = `
[Hold] Thrust up
`;

characters = [
  `
 llll
l    l
 llll
 l  l
l ll l
ll  ll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 6,
};

let mountains;
let shipY, shipV;
let offset;
let mountainAppDist;
let mountainIndex;
let landingIndex;
let landing;
let landY;
let shipCollision;
let m;
let isFirstLanded;

function update() {
  if (!ticks) {
    mountains = times(9, (i) => {
      if (i === 4) {
        return { y: (landY = 49), c: "cyan" };
      } else {
        return { y: 90 - i, c: "red" };
      }
    });
    shipY = 30;
    shipV =
      offset =
      mountainAppDist =
      mountainIndex =
      landing =
      isFirstLanded =
        0;
    landingIndex = 7;
  }
  mountains.map((m, i) => {
    color(m.c);
    rect(wrap(i * 13 + offset - 13, -13, 104), m.y, 13, 99);
  });
  color("green");
  shipCollision = char("a", 25, shipY);
  if (landing) {
    if (input.isJustPressed) {
      landing = 0;
    } else {
      return;
    }
  }
  offset -= difficulty;
  if ((mountainAppDist -= difficulty) < 0) {
    m = mountains[wrap(mountainIndex, 0, 9)];
    m.y =
      landingIndex > 7 || landingIndex === 1
        ? rnd(70, 90)
        : landingIndex === 0
        ? (landY = rnd(40, 70))
        : rnd(40, 90);
    landingIndex--;
    if (landingIndex < 0) {
      m.c = "cyan";
      landingIndex = 9;
    } else {
      m.c = "red";
    }
    mountainIndex++;
    mountainAppDist += 13;
  }
  if (isFirstLanded) {
    if (input.isJustPressed) {
      play("laser");
      shipV -= 0.4;
    }
    if (input.isPressed) {
      shipV -= 0.2;
      particle(24.5, shipY + 2, 1, 1, PI / 2, 1);
    }
  }
  shipV += 0.1;
  shipV *= 0.99;
  if (shipY < 0 && shipV < 0) {
    shipV *= -1;
  }
  shipY += shipV * difficulty;
  if (shipCollision.isColliding.rect.cyan) {
    play("select");
    particle(24.5, shipY);
    landing = ++score;
    shipV = 0;
    shipY = landY - 3;
    mountains.map((n) => (n.c = "red"));
    isFirstLanded = 1;
  }
  if (shipCollision.isColliding.rect.red) {
    play("explosion");
    end();
  }
  if (rect(-1, 0, 1, 99).isColliding.rect.cyan) {
    color("red");
    for (let y = landY - 4; y < 99; y += 7) {
      text("X", 2, y);
    }
    play("explosion");
    end();
  }
}
```
