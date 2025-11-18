# Game rules

1. Game Environment:

   - The game takes place on a vertically stacked set of floors.
   - Each floor has holes that the player must avoid.

2. Core Mechanics:

   - The player character automatically moves to the right.
   - The screen scrolls to the left, creating an endless runner effect.

3. Player Interaction:

   - The player can move up one floor by tapping (or clicking).
   - If the player is above a hole, they will fall down one floor.

4. Challenge:
   - Avoid falling through holes.
   - Collect bamboo for points.
   - Avoid skulls, which end the game if touched.
   - Collect power-ups to turn skulls into bamboo.

# Game objects

## Player

- Properties:
  - pos: The player's position (Vector, x, y coordinates)
  - floorIndex: The current floor the player is on (number)
  - targetFi: The floor index the player is moving towards (number or undefined)
- Initial state:
  - Position: (20, floorIndexToY(5))
  - floorIndex: 5
  - targetFi: undefined
- Shape: Small humanoid character
- Color: black
- Behavior:
  - Moves up when tapped
  - Falls down when over a hole
  - Collects bamboo and power-ups
  - Dies when colliding with skulls
- One-button controls:
  - When tapped: Player moves up one floor if not already moving

## Floors

- Properties:
  - y: Vertical position of the floor (number)
  - holeXs: Array of x-coordinates for holes in the floor (number[])
  - nextHoleDist: Distance until the next hole spawns (number)
  - bambooXs: Array of x-coordinates for bamboo on the floor (number[])
  - skullXs: Array of x-coordinates for skulls on the floor (number[])
  - powXs: Array of x-coordinates for power-ups on the floor (number[])
- Initial state:
  - 6 floors created with random hole positions
  - Bottom floor (index 5) has no holes
- Shape: Horizontal lines with gaps (holes)
- Color: green (top), light_black (bottom)
- Behavior:
  - Static, but appear to move left as the game scrolls
- Spawning rules:
  - New holes spawn at regular intervals on each floor
  - Bamboo, skulls, and power-ups spawn randomly on floors

## Collectibles and Obstacles

- Bamboo:
  - Shape: Small plant-like object
  - Color: yellow
  - Behavior: Collected by player for points
- Skulls:
  - Shape: Skull icon
  - Color: red
  - Behavior: Ends the game if touched by player
- Power-ups:
  - Shape: Special icon
  - Color: yellow
  - Behavior: Turns all skulls into bamboo when collected

# Source code

```javascript
title = "UP 1 WAY";

description = `
[Tap] Go up
`;

characters = [
  `
llllll
ll l l
ll l l
llllll
 l  l
 l  l
    `,
  `
llllll
ll l l
ll l l
llllll
ll  ll
    `,
  `
  yy
  YY
 yyyy
 YYYY
yyyyyy
YYYYYY
    `,
  `
  rr
  rr
  rr
  rr
  rr
  rr
  `,
  `
  rr
 rRRr
 r  r
 rRRr
 rRRr
  rr
  `,
  `
  rr
 rRRr
r RR r
rRRRRr
 rRRr
  rr
  `,
  `
  rr
 rRRr
 r  r
 rRRr
 rRRr
  rr
  `,
  `
yyyy
y  y
yyyy
y Y YY
y Y YY
y Y YY
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  audioSeed: 12,
};

/**
 * @type {{
 * y: number,
 * holeXs: number[], nextHoleDist: number,
 * bambooXs: number[],
 * skullXs: number[],
 * powXs: number[]
 * }[]}
 */
let floors;
let nextBambooDist;
let nextBambooFloorIndex;
let nextSkullDist;
let nextPowDist;
/** @type {{pos: Vector, floorIndex: number, targetFi: number }} */
let player;
let animTicks;

const floorIndexToY = (i) => 16 + i * 15;

function update() {
  if (!ticks) {
    // Initialize game objects and variables
    floors = times(6, (i) => {
      return {
        y: floorIndexToY(i),
        holeXs: i === 5 ? [] : [rnd(99, 180)],
        nextHoleDist: i === 5 ? 999999999 : rnd(99),
        bambooXs: [],
        nextBamBooDist: 0,
        skullXs: [],
        powXs: [],
      };
    });
    nextBambooDist = 0;
    nextBambooFloorIndex = rndi(floors.length);
    nextSkullDist = rnd(49, 99);
    nextPowDist = 999;
    const floorIndex = 5;
    player = {
      pos: vec(20, floorIndexToY(floorIndex)),
      floorIndex,
      targetFi: undefined,
    };
    animTicks = 0;
  }

  // Update animation ticks
  animTicks += difficulty;

  // Handle player movement
  if (player.targetFi != null) {
    const ty = floorIndexToY(player.targetFi);
    const vy = ty > player.pos.y ? 1 : -1;
    player.pos.y += vy * difficulty * 3;
    if ((player.pos.y - ty) * vy > 0) {
      player.pos.y = ty;
      player.floorIndex = player.targetFi;
      player.targetFi = undefined;
    }
  }
  if (player.targetFi == null) {
    if (input.isJustPressed && player.floorIndex > 0) {
      play("jump");
      player.targetFi = player.floorIndex - 1;
    } else if (checkHole(player.floorIndex, player.pos.x)) {
      play("click");
      player.targetFi = player.floorIndex + 1;
    }
  }

  // Draw player character
  char(
    addWithCharCode("a", floor(animTicks / 20) % 2),
    player.pos.x,
    player.pos.y - 5
  );

  // Update game objects (floors, collectibles, obstacles)
  const scr = difficulty;
  nextBambooDist -= scr;
  if (nextBambooDist < 0) {
    if (floors[nextBambooFloorIndex].nextHoleDist < 9) {
      nextBambooFloorIndex = rndi(floors.length);
    } else {
      floors[nextBambooFloorIndex].bambooXs.push(209);
      if (rnd() < 0.3) {
        nextBambooDist = 6;
      } else {
        nextBambooDist = rnd(200, 300);
        nextBambooFloorIndex = rndi(floors.length);
      }
    }
  }
  nextSkullDist -= scr;
  if (nextSkullDist < 0) {
    const fi = rndi(floors.length);
    if (floors[fi].nextHoleDist > 9 && nextBambooDist > 9) {
      floors[fi].skullXs.push(209);
    }
    nextSkullDist += rnd(30, 50);
  }
  nextPowDist -= scr;
  if (nextPowDist < 0) {
    const fi = rndi(floors.length);
    floors[fi].powXs.push(209);
    nextPowDist = 999;
  }

  // Draw floors and objects
  color("light_blue");
  rect(0, 97, 200, 3);
  floors.forEach((f) => {
    f.nextHoleDist -= scr;
    if (f.nextHoleDist < 0) {
      f.holeXs.push(200);
      f.nextHoleDist = rnd(32, 99);
    }
    let fx = 0;
    f.holeXs.forEach((x, i) => {
      if (x > fx) {
        color("green");
        rect(fx, f.y - 2, x - fx, 2);
        color("light_black");
        rect(fx, f.y, x - fx, 3);
      }
      fx = x + 9;
      f.holeXs[i] -= scr;
    });
    if (fx < 200) {
      color("green");
      rect(fx, f.y - 2, 200 - fx, 2);
      color("light_black");
      rect(fx, f.y, 200 - fx, 3);
    }
    color("black");
    remove(f.holeXs, (x) => x < -9);

    // Handle collisions and scoring
    f.bambooXs.forEach((x, i) => {
      const c = char("c", x, f.y - 5).isColliding.char;
      if (c.a || c.b) {
        play("coin");
        addScore(1, x, f.y - 5);
        f.bambooXs[i] = -9;
      }
      f.bambooXs[i] -= scr;
    });
    remove(f.bambooXs, (x) => x < -3);
    f.powXs.forEach((x, i) => {
      const c = char("h", x, f.y - 5).isColliding.char;
      if (c.a || c.b) {
        play("powerUp");
        floors.forEach((f) => {
          f.skullXs.forEach((x) => {
            f.bambooXs.push(x);
          });
          f.skullXs = [];
        });
        f.powXs[i] = -9;
      }
      f.powXs[i] -= scr;
    });
    remove(f.powXs, (x) => x < -3);
    f.skullXs.forEach((x, i) => {
      const c = char(
        addWithCharCode("d", floor(animTicks / 15) % 4),
        x,
        f.y - 5
      ).isColliding.char;
      if (c.c || c.h) {
        f.skullXs[i] = -9;
      }
      if (c.a || c.b) {
        play("explosion");
        end();
      }
      f.skullXs[i] -= scr;
    });
    remove(f.skullXs, (x) => x < -3);
  });
}

function checkHole(fi, x) {
  let hasHole = false;
  floors[fi].holeXs.forEach((hx) => {
    if (x > hx + 3 && x < hx + 6) {
      hasHole = true;
    }
  });
  return hasHole;
}
```
