# Game rules

1. Game Environment:

   - The game screen is divided into horizontal lanes.
   - Each lane contains colored bars that move horizontally.

2. Core Mechanics:

   - Players shoot a vertical line from the bottom of the screen.
   - The line travels upwards and interacts with the colored bars.

3. Player Interaction:

   - Players tap to shoot the line.
   - The goal is to hit bars of the same color as the shot.

4. Challenge:
   - Successfully hitting matching colors increases the score and difficulty.
   - Missing or hitting wrong colors penalizes the player.

# Game objects

## Lanes

- Properties:
  - x: Horizontal position (number)
  - y: Vertical position (number)
  - vx: Horizontal velocity (number)
  - bars: Array of colored bar objects
- Initial state:
  - Two lanes are created at the start
  - Position and velocity are randomly generated
- Shape: Horizontal bars
- Color: Multiple (red, green, blue, yellow)
- Behavior:
  - Move horizontally based on their velocity
  - Scroll vertically downwards
- Spawning rules:
  - New lanes are added when previous ones are cleared
  - Number of lanes increases with difficulty

## Shot

- Properties:
  - y: Vertical position (number)
- Initial state:
  - Not present until player shoots
- Shape: Vertical line
- Color: Black (changes to hit color on collision)
- Behavior:
  - Moves upwards when shot
- One-button controls:
  - Tap to shoot from the bottom of the screen
- Collision events:
  - Changes color and triggers score on correct hit
  - Disappears on incorrect hit

## Colored Bars

- Properties:
  - width: Width of the bar (number)
  - color: Color of the bar (string)
- Initial state:
  - Generated for each lane
- Shape: Rectangle
- Color: red, green, blue, or yellow
- Behavior:
  - Move with their parent lane
- Collision events:
  - Disappear when hit by matching color shot

# Skeleton code

```javascript
title = "COLOR ROLL";

description = `
[Tap] Shoot
`;

characters = [];

options = {
  // Game options
};

/** @type {{x: number, y: number, vx: number, bars: {width: number, color: Color}[]}[]} */
let lanes;
let laneY;
let shotY;
let hitColor;
let laneCount;
let baseMultiplier;
let multiplier;
let penalty;
const colors = ["red", "green", "blue", "yellow"];
const laneHeight = 7;

function update() {
  if (!ticks) {
    // Initialize game state
  }

  // Update shot position

  // Draw shot

  // Update lane positions

  // Handle collisions and scoring

  // Add new lanes as needed

  // Check for game over condition

  function addLane() {
    // Add a new lane
  }

  function addBars(prevBars) {
    // Generate colored bars for a lane
  }
}
```

# Source code

```javascript
title = "COLOR ROLL";

description = `
[Tap] Shoot
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  audioSeed: 9,
};

/** @type {{x: number, y: number, vx: number, bars: {width: number, color: Color}[]}[]} */
let lanes;
let laneY;
let shotY;
let hitColor;
let laneCount;
let baseMultiplier;
let multiplier;
let penalty;
const colors = ["red", "green", "blue", "yellow"];
const laneHeight = 7;

function update() {
  if (!ticks) {
    lanes = [];
    shotY = undefined;
    hitColor = undefined;
    laneCount = 2;
    times(laneCount, () => addLane());
    baseMultiplier = 0;
    multiplier = 1;
    penalty = 1;
  }
  let sy = 97;
  if (shotY != null) {
    shotY -= sqrt(difficulty) * 3;
    sy = shotY;
  } else {
    hitColor = undefined;
    if (input.isJustPressed) {
      play("laser");
      multiplier = 1;
      shotY = sy;
      laneY += 2 * penalty * sqrt(sqrt(difficulty));
    }
  }
  color(hitColor == null ? "black" : hitColor);
  rect(49, sy, 3, 99 - sy);
  const my = laneHeight * laneCount;
  laneY += sqrt(difficulty) * 0.005;
  if (laneY < my) {
    laneY += (my - laneY) * 0.2;
  }
  let ly = laneY;
  remove(lanes, (l) => {
    l.x = wrap(l.x + l.vx, 0, 99);
    l.y += (ly - l.y) * 0.2;
    let x = l.x;
    let isRemoved = false;
    let isShotRemoved = false;
    l.bars.forEach((b) => {
      color(b.color);
      let c;
      if (x + b.width < 99) {
        c = rect(x, l.y, b.width - 1, -laneHeight + 1).isColliding.rect;
      } else {
        c = rect(x, l.y, 99 - x, -laneHeight + 1).isColliding.rect;
        c = {
          ...c,
          ...rect(0, l.y, b.width - (99 - x) - 1, -laneHeight + 1).isColliding
            .rect,
        };
      }
      if (c.black) {
        hitColor = b.color;
        isRemoved = true;
      } else if (hitColor != null) {
        if (c[b.color]) {
          isRemoved = true;
        } else if (c.red || c.green || c.blue || c.yellow) {
          isShotRemoved = true;
        }
      }
      x = wrap(x + b.width, 0, 99);
    });
    ly -= laneHeight;
    if (isShotRemoved) {
      play("hit");
      shotY = undefined;
      penalty = clamp(penalty * (3 / multiplier), 1, 4);
    } else if (isRemoved) {
      play("coin");
      addScore(multiplier * pow(2, baseMultiplier), 50, l.y);
      laneY -= multiplier;
      multiplier *= 2;
      return true;
    }
  });
  if (lanes.length === 0) {
    play("powerUp");
    shotY = undefined;
    laneCount++;
    if (laneCount > clamp(5 + baseMultiplier, 1, 10)) {
      baseMultiplier = clamp(baseMultiplier + 1, 1, 9);
      laneCount = 2;
    }
  }
  if (shotY == null) {
    times(laneCount - lanes.length, () => addLane());
    if (shotY == null && lanes[0].y > 97) {
      play("explosion");
      end();
    }
  }

  function addLane() {
    play("select");
    const x = rnd(99);
    const vx = rnds(0.5, 1) * sqrt(difficulty);
    if (lanes.length === 0) {
      laneY = 0;
      lanes.push({ x, y: 0, vx, bars: addBars() });
    } else {
      lanes.push({
        x,
        y: -lanes.length * laneHeight,
        vx,
        bars: addBars(lanes[lanes.length - 1].bars),
      });
    }
  }

  function addBars(prevBars) {
    let cs =
      prevBars != null
        ? prevBars.map((b) => b.color)
        : [colors[rndi(colors.length)]];
    if (cs.length === 1 || (cs.length < 4 && rnd() < 0.5)) {
      cs.push(colors[rndi(colors.length)]);
    } else {
      cs.splice(rndi(colors.length), 1);
    }
    let lx = 99;
    let x = rnd(99);
    const cc = cs.length;
    return cs.map((c, i) => {
      const width = i === cc - 1 ? lx : (99 / cc) * rnd(0.8, 1.2);
      lx -= width;
      x = wrap(x + width, 0, 99);
      return { x, width, color: c };
    });
  }
}
```
