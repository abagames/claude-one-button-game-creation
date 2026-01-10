# Game rules

1. Game Environment:

   - The game takes place in a 2D environment with a water line.
   - Fish swim below the water line.

2. Core Mechanics:

   - The player controls a fishing line with multiple nodes.
   - The line can be cast into the water and pulled back.

3. Player Interaction:

   - Hold button to select casting power and angle.
   - Release button to cast the line.
   - Tap button to pull the line back.

4. Challenge:
   - Catch blue fish to increase score and raise water level.
   - Avoid red fish, which decrease score and lower water level.
   - Maintain water level above the starting position to avoid game over.

# Game objects

## Fishing Line (Nodes)

- Properties:
  - pos: Position of each node (Vector)
  - vel: Velocity of each node (Vector)
  - nextNode: Reference to the next node in the line
- Initial state:
  - 20 nodes starting at position (5, 20)
  - All nodes initially at the same position
- Shape: Line connecting nodes, with a character 'a' at the first node
- Color: Black
- Behavior:
  - Nodes follow physics-based movement when cast
  - Nodes maintain a fixed distance between each other
  - First node leads the movement, others follow
- One-button controls:
  - Hold: Increase casting power and adjust angle
  - Release: Cast the line
  - Tap: Pull the line back
- Collision events:
  - Stops moving when colliding with the ground (light yellow)
  - Interacts with fish when pulling back

## Fish

- Properties:
  - pos: Position of the fish (Vector)
  - vel: Velocity of the fish (Vector)
  - type: 0 for red fish, 1 for blue fish
- Initial state:
  - No fish at the start, spawned periodically
- Shape: Character 'b'
- Color: Red (type 0) or Blue (type 1)
- Behavior:
  - Swim horizontally, mostly from right to left
  - Occasionally change direction
  - Stay below the water line
- Spawning rules:
  - Appear on the right side of the screen
  - Spawn in groups of 3 to 8
  - Red fish are less common than blue fish
- Collision events:
  - Interact with the fishing line when being pulled back
  - Bounce off the ground (light yellow)

## Water Line

- Properties:
  - waterY: Y-position of the water line
- Initial state:
  - waterY = 40
- Shape: Horizontal line
- Color: Light blue
- Behavior:
  - Slowly decreases over time
  - Rises when catching blue fish
  - Lowers when catching red fish

# Skeleton code

```javascript
title = "CAST N";

description = `
[Hold]    Select power
[Release] Cast
[Tap]     Pull
`;

characters = [
  `
 YYY
YyyyY
YyyyY
YyyyY
 YYY
`,
  `
  lll
l ll l
llllll
l llll
  ll
`,
];

options = {
  viewSize: { x: 150, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 2,
};

/** @type {{pos: Vector, vel: Vector, nextNode: any}[]} */
let nodes;
/** @type {"ready" | "angle" | "throw" | "pull"} */
let nodesState;
let throwPower;
/** @type {{pos: Vector, vel: Vector, type: number}[]} */
let fishes;
let nextFishTicks;
let nextRedFishCount;
let waterY;
let multiplier;

function update() {
  if (!ticks) {
    // Initialize game objects and variables
  }

  // Draw game environment

  // Handle fishing line (nodes) behavior based on nodesState

  // Handle fish spawning and movement

  // Update water level

  // Check for game over condition
}
```

# Source code

```javascript
title = "CAST N";

description = `
[Hold]    Select power
[Release] Cast
[Tap]     Pull
`;

characters = [
  `
 YYY
YyyyY
YyyyY
YyyyY
 YYY
`,
  `
  lll
l ll l
llllll
l llll
  ll
`,
];

options = {
  viewSize: { x: 150, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

/** @type {{pos: Vector, vel: Vector, nextNode: any}[]} */
let nodes;
/** @type {"ready" | "angle" | "throw" | "pull"} */
let nodesState;
let throwPower;
/** @type {{pos: Vector, vel: Vector, type: number}[]} */
let fishes;
let nextFishTicks;
let nextRedFishCount;
let waterY;
let multiplier;
const startPos = vec(5, 20);
const nodeDist = 9;

function update() {
  if (!ticks) {
    nodes = times(20, (i) => {
      return { pos: vec(startPos), vel: vec(), nextNode: undefined };
    });
    times(19, (i) => {
      nodes[i + 1].nextNode = nodes[i];
    });
    nodesState = "ready";
    throwPower = 0;
    fishes = [];
    nextFishTicks = 0;
    nextRedFishCount = 1;
    waterY = 40;
    multiplier = 1;
  }
  color("light_yellow");
  line(0, startPos.y + 3, 150, 120);
  color("light_blue");
  rect(0, waterY, 150, 3);
  color("black");
  char("a", nodes[0].pos);
  if (nodesState !== "pull" && waterY < startPos.y - 4) {
    play("explosion");
    end();
  }
  if (nodesState === "ready") {
    if (input.isJustPressed) {
      play("select");
      throwPower = 1;
      nodesState = "angle";
      multiplier = 1;
    }
  }
  if (nodesState === "angle") {
    throwPower += 0.05 * sqrt(difficulty);
    const a = 0.1 - throwPower * 0.2;
    line(startPos, vec(startPos).addWithAngle(a, throwPower * 5 + 3), 2);
    if (input.isJustReleased || throwPower > 3) {
      play("jump");
      throwPower = clamp(throwPower, 1, 3);
      nodesState = "throw";
      nodes[0].vel.set(sqrt(difficulty) * throwPower).rotate(a);
    }
  }
  if (nodesState === "throw") {
    nodes.forEach((n, i) => {
      n.pos.x = clamp(n.pos.x, 0, 147);
      if (i === 0) {
        if (!char("a", n.pos).isColliding.rect.light_yellow) {
          let py = n.pos.y;
          n.pos.add(n.vel);
          if (py < waterY && n.pos.y >= waterY) {
            n.vel.x = 0;
            n.vel.y *= 0.1;
          }
          n.vel.y += (n.pos.y < waterY ? 0.05 : 0.01) * difficulty;
          n.vel.mul(0.99);
        }
      } else {
        if (!line(n.nextNode.pos, n.pos, 2).isColliding.rect.light_yellow) {
          const d = n.pos.distanceTo(n.nextNode.pos);
          if (d > nodeDist) {
            const a = n.nextNode.pos.angleTo(n.pos);
            n.pos.set(n.nextNode.pos).addWithAngle(a, nodeDist);
          }
          n.pos.add(n.vel);
          n.vel.y += (n.pos.y < waterY ? 0.005 : 0.001) * difficulty;
          n.vel.mul(0.99);
        }
      }
    });
    if (input.isJustPressed) {
      play("powerUp");
      nodesState = "pull";
    }
  }
  if (nodesState === "pull") {
    nodes.forEach((n, i) => {
      n.vel.set();
      if (n.pos.distanceTo(startPos) > 1 && n.pos.x > startPos.x) {
        const a = n.pos.angleTo(startPos);
        n.pos.addWithAngle(a, sqrt(difficulty) * 2);
      } else {
        n.pos.set(startPos);
        if (i === 0) {
          nodesState = "ready";
        }
      }
      if (i > 0) {
        line(n.nextNode.pos, n.pos, 2);
      }
    });
  }
  if (fishes.length === 0) {
    nextFishTicks = 0;
  }
  nextFishTicks--;
  if (nextFishTicks < 0) {
    nextRedFishCount--;
    let type = 1;
    if (nextRedFishCount < 0) {
      type = 0;
      nextRedFishCount = rnd(1, 7);
    }
    const c = rndi(3, 8);
    const p = vec(153, rnd(waterY + (type === 0 ? 19 : 9), 90));
    const vx = -rnd(1, sqrt(difficulty)) * (type == 0 ? 0.3 : 0.2);
    times(c, () => {
      fishes.push({
        pos: vec(p)
          .add(rnd(20), rnds(9))
          .clamp(153, 180, waterY + 4, 96),
        vel: vec(vx, 0),
        type,
      });
    });
    nextFishTicks = rnd(120, 150) / sqrt(difficulty);
  }
  remove(fishes, (f) => {
    color(f.type === 0 ? "red" : "blue");
    const c = char("b", f.pos, {
      mirror: { x: f.vel.x < 0 ? -1 : 1 },
    }).isColliding;
    if (c.rect.black || c.char.a) {
      if (nodesState === "pull") {
        const a = f.pos.angleTo(startPos);
        f.pos.addWithAngle(a, sqrt(difficulty) * 2);
        f.pos.y -= difficulty * 0.3;
        if (f.pos.x < startPos.x + 9) {
          addScore(
            f.type === 0 ? -1 : multiplier,
            startPos.x + clamp(multiplier * 6, 0, 140),
            startPos.y + (f.type === 0 ? 9 : 0)
          );
          multiplier++;
          waterY = clamp(
            waterY + (f.type === 0 ? -5 : 1) * sqrt(difficulty),
            0,
            50
          );
          play(f.type === 0 ? "hit" : "coin");
          return true;
        }
      }
      if (!c.rect.light_yellow) {
        f.pos.y += difficulty * 0.3;
      }
      if (rnd() < 0.1) {
        f.vel.x *= -1;
      }
      return;
    }
    if (f.pos.y < waterY + 3) {
      f.vel.y += 0.1;
    } else {
      f.vel.y = 0;
    }
    f.pos.add(f.vel);
    f.vel.x += rnds(sqrt(difficulty)) * 0.01;
    if (c.rect.light_yellow && f.vel.x < 0) {
      f.vel.x *= -1;
    }
    return (f.vel.x > 0 && f.pos.x > 153) || f.pos.x < -3;
  });
  waterY -= sqrt(difficulty) * 0.01;
}
```
