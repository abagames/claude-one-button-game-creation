# Game rules

1. Game Environment:

   - The game takes place on a vertical playing field.
   - Lightning bolts descend from the top of the screen.
   - Stars fall from the lightning bolts.
   - A player-controlled character moves at the bottom of the screen.

2. Core Mechanics:

   - Lightning bolts branch out as they descend.
   - Stars fall from the tips of lightning bolts.
   - The player moves horizontally at the bottom of the screen.

3. Player Interaction:

   - The player can change the direction of their character's movement by tapping.

4. Challenge:
   - The player must avoid being struck by the lightning.
   - The player aims to collect falling stars for points.

# Game objects

## Lightning Bolts

- Properties:
  - from: Starting point (Vector)
  - to: Ending point (Vector)
  - vel: Velocity (Vector)
  - ticks: Lifespan of the bolt
  - prevLine: Reference to the previous bolt segment
  - isActive: Boolean indicating if the bolt is currently active
- Initial state:
  - A single bolt starts from a random x-position at the top of the screen
- Shape: Line
- Color: Light black (inactive), Yellow (active)
- Behavior:
  - Extends downwards based on velocity
  - Branches into multiple bolts when its lifespan ends
- Collision events:
  - When reaching the bottom of the screen, the bolt activates and turns yellow
- Spawning rules:
  - Initial bolt spawns at the start of the game
  - New branches spawn when a bolt's lifespan ends

## Stars

- Properties:
  - pos: Position (Vector)
  - vel: Velocity (Vector)
- Initial state:
  - No stars at the start of the game
- Shape: Small character ('a')
- Color: Yellow
- Behavior:
  - Fall downwards with increasing speed
  - Bounce off the bottom of the screen
- Collision events:
  - Disappear when colliding with the player
- Spawning rules:
  - Spawn from the tips of active lightning bolts

## Player

- Properties:
  - x: Horizontal position
  - vx: Horizontal velocity
- Initial state:
  - x: 40
  - vx: 1 (moving right)
- Shape: Character (alternating between 'b' and 'c')
- Color: Black
- Behavior:
  - Moves horizontally at the bottom of the screen
- One-button controls:
  - Tapping changes the direction of movement
- Collision events:
  - Game ends if hit by a lightning bolt

# Source code

```javascript
title = "THUNDER";

description = `
[Tap] Turn
`;

characters = [
  `
 l
lll
l l
`,
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
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 3,
};

/**
 * @type {{
 * from: Vector, to: Vector, vel: Vector,
 * ticks: number, prevLine: any, isActive: boolean
 * }[]}
 */
let lines;
let activeTicks;
/** @type {{pos: Vector, vel: Vector}[]} */
let stars;
/** @type {{x: number, vx: number}} */
let player;
let multiplier;

function update() {
  if (!ticks) {
    lines = [];
    activeTicks = -1;
    stars = [];
    player = { x: 40, vx: 1 };
    multiplier = 1;
  }
  if (lines.length === 0) {
    const from = vec(rnd(30, 70), 0);
    lines.push({
      from,
      to: vec(from),
      vel: vec(0.5 * difficulty, 0).rotate(PI / 2),
      ticks: ceil(30 / difficulty),
      prevLine: undefined,
      isActive: false,
    });
  }
  color("light_blue");
  rect(0, 90, 100, 10);
  activeTicks--;
  remove(lines, (l) => {
    if (l.isActive) {
      color("yellow");
      line(l.from, l.to, 4);
      return activeTicks < 0;
    }
    l.ticks--;
    if (activeTicks > 0) {
      if (l.ticks > 0) {
        stars.push({ pos: vec(l.to), vel: vec(0, -l.to.y * 0.02) });
      }
      return true;
    }
    if (l.ticks > 0) {
      l.to.add(l.vel);
      if (activeTicks < 0 && (l.to.y > 90 || lines.length > 160)) {
        play("explosion");
        let al = l;
        color("yellow");
        for (let i = 0; i < 99; i++) {
          particle(al.to, 30, 2);
          al.isActive = true;
          al = al.prevLine;
          if (al == null) {
            break;
          }
        }
        activeTicks = ceil(20 / sqrt(difficulty));
        multiplier = 1;
      }
    } else if (l.ticks === 0) {
      play("hit");
      color("black");
      particle(l.to, 9, 1);
      for (let i = 0; i < rndi(1, 4); i++) {
        lines.push({
          from: vec(l.to),
          to: vec(l.to),
          vel: vec(l.vel)
            .normalize()
            .rotate(rnds(0.7))
            .mul(rnd(0.3, 1) * sqrt(difficulty)),
          ticks: ceil(rnd(20, 40) / difficulty),
          prevLine: l,
          isActive: false,
        });
      }
    }
    color("light_black");
    line(l.from, l.to, 2);
  });
  if (
    input.isJustPressed ||
    (player.x < 0 && player.vx < 0) ||
    (player.x > 99 && player.vx > 0)
  ) {
    play("laser");
    player.vx *= -1;
  }
  player.x += player.vx * sqrt(difficulty);
  color("black");
  if (
    char(addWithCharCode("b", floor(ticks / 10) % 2), player.x, 87, {
      mirror: { x: player.vx > 0 ? 1 : -1 },
    }).isColliding.rect.yellow
  ) {
    play("lucky");
    end();
  }
  color("yellow");
  remove(stars, (s) => {
    s.vel.y += 0.1 * difficulty;
    s.pos.add(s.vel);
    if (s.pos.y > 89 && s.vel.y > 0) {
      s.vel.y *= -0.5;
      if (s.vel.y > -0.1) {
        return true;
      }
    }
    const c = char("a", s.pos).isColliding.char;
    if (c.b || c.c) {
      play("coin");
      addScore(multiplier, s.pos);
      multiplier++;
      return true;
    }
  });
}
```
