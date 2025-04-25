# Game rules

1. Game Environment:

   - The game takes place on a horizontal plane with a width of 100 units.
   - There are three horizontal lines across the screen.

2. Core Mechanics:

   - The player controls a character that moves horizontally.
   - Dots are scattered across the play area.
   - An enemy character chases or flees from the player.

3. Player Interaction:

   - Players can change the direction of their character's movement by tapping.

4. Challenge:
   - Collect all dots while avoiding the enemy.
   - Some dots are "power" dots that temporarily allow the player to catch the enemy.

# Game objects

## Player

- Properties:
  - x: Horizontal position
  - vx: Horizontal velocity
- Initial state:
  - x: 40
  - vx: 1
- Shape: Simple character (changes based on animation)
- Color: green
- Behavior:
  - Moves horizontally at a constant speed
  - Wraps around screen edges
- One-button controls:
  - When tapped: Reverses horizontal direction
- Collision events:
  - Collects dots on contact

## Enemy

- Properties:
  - x: Horizontal position
  - eyeVx: Horizontal eye velocity (determines state)
- Initial state:
  - x: 100
  - eyeVx: 0
- Shape: Simple character (changes based on state)
- Color: red (normal), blue (vulnerable), black (fleeing)
- Behavior:
  - Chases player when not vulnerable
  - Flees from player when vulnerable
- Collision events:
  - Ends game on collision with player (when not vulnerable)
  - Flees when collided with player (when vulnerable)

## Dots

- Properties:
  - x: Horizontal position
  - isPower: Boolean indicating if it's a power dot
- Initial state:
  - 16 dots placed evenly across the screen
  - One random dot is a power dot
- Shape: Small dot (circle or square)
- Color: yellow (normal dot), flashing yellow/transparent (power dot)
- Behavior:
  - Static
- Collision events:
  - Disappear when collected by player
  - Power dots make the enemy vulnerable when collected

# Source code

```javascript
title = "PAKU PAKU";

description = `
[Tap] Turn
`;

characters = [
  `
  llll
 lll
lll
lll
 lll
  llll
`,
  `
  lll
 lllll
lll
lll
 lllll
  lll
`,
  `
  ll
 llll
llllll
llllll
 llll
  ll
`,
  `
  lll
 l l l
 llll
 llll
llll
l l l
`,
  `
  lll
 l l l
 llll
 llll
 llll
 l l
`,
  `
ll
ll
`,
  `
 ll
llll
llll
 ll
`,
  `
  l l



`,
];

options = {
  viewSize: { x: 100, y: 50 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 9,
};

/** @type {{x: number, vx: number}} */
let player;
/** @type {{x: number, eyeVx: number}} */
let enemy;
/** @type {{x: number, isPower: boolean}[]} */
let dots;
let powerTicks;
let animTicks;
let multiplier;

function update() {
  if (!ticks) {
    player = { x: 40, vx: 1 };
    enemy = { x: 100, eyeVx: 0 };
    multiplier = 0;
    addDots();
    powerTicks = animTicks = 0;
  }
  animTicks += difficulty;
  color("black");
  text(`x${multiplier}`, 3, 9);
  if (input.isJustPressed) {
    player.vx *= -1;
  }
  player.x += player.vx * 0.5 * difficulty;
  if (player.x < -3) {
    player.x = 103;
  } else if (player.x > 103) {
    player.x = -3;
  }
  color("blue");
  rect(0, 23, 100, 1);
  rect(0, 25, 100, 1);
  rect(0, 34, 100, 1);
  rect(0, 36, 100, 1);
  color("green");
  const ai = floor(animTicks / 7) % 4;
  char(addWithCharCode("a", ai === 3 ? 1 : ai), player.x, 30, {
    // @ts-ignore
    mirror: { x: player.vx },
  });
  remove(dots, (d) => {
    color(
      d.isPower && floor(animTicks / 7) % 2 === 0 ? "transparent" : "yellow"
    );
    const c = char(d.isPower ? "g" : "f", d.x, 30).isColliding.char;
    if (c.a || c.b || c.c) {
      if (d.isPower) {
        play("jump");
        if (enemy.eyeVx === 0) {
          powerTicks = 120;
        }
      } else {
        play("hit");
      }
      addScore(multiplier);
      return true;
    }
  });
  const evx =
    enemy.eyeVx !== 0
      ? enemy.eyeVx
      : (player.x > enemy.x ? 1 : -1) * (powerTicks > 0 ? -1 : 1);
  enemy.x = clamp(
    enemy.x +
      evx *
        (powerTicks > 0 ? 0.25 : enemy.eyeVx !== 0 ? 0.75 : 0.55) *
        difficulty,
    0,
    100
  );
  if ((enemy.eyeVx < 0 && enemy.x < 1) || (enemy.eyeVx > 0 && enemy.x > 99)) {
    enemy.eyeVx = 0;
  }
  color(
    powerTicks > 0
      ? powerTicks < 30 && powerTicks % 10 < 5
        ? "black"
        : "blue"
      : enemy.eyeVx !== 0
      ? "black"
      : "red"
  );
  const c = char(
    enemy.eyeVx !== 0 ? "h" : addWithCharCode("d", floor(animTicks / 7) % 2),
    enemy.x,
    30,
    {
      // @ts-ignore
      mirror: { x: evx },
    }
  ).isColliding.char;
  if (enemy.eyeVx === 0 && (c.a || c.b || c.c)) {
    if (powerTicks > 0) {
      play("powerUp");
      addScore(10 * multiplier, enemy.x, 30);
      enemy.eyeVx = player.x > 50 ? -1 : 1;
      powerTicks = 0;
      multiplier++;
    } else {
      play("explosion");
      end();
    }
  }
  powerTicks -= difficulty;
  if (dots.length === 0) {
    play("coin");
    addDots();
  }
}

function addDots() {
  let pi = player.x > 50 ? rndi(1, 6) : rndi(10, 15);
  dots = times(16, (i) => ({ x: i * 6 + 5, isPower: i === pi }));
  multiplier++;
}
```
