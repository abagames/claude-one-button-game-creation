# Game rules

1. Game Environment:

   - The game takes place on a vertical scrolling screen.
   - Circular platforms with protruding bars appear from the top of the screen.

2. Core Mechanics:

   - The player controls a small box that can move between circular platforms.
   - Platforms continuously scroll downward.
   - Each platform has a number of rotating bars attached to it.

3. Player Interaction:

   - The player taps to move from one platform to the next connected platform.

4. Challenge:
   - Avoid colliding with the rotating bars while moving between platforms.
   - Stay on the platforms and avoid falling off the bottom of the screen.

# Game objects

## Circles (Platforms)

- Properties:
  - p: Position (Vector)
  - r: Radius (number)
  - num: Number of attached bars (number)
  - a: Rotation angle of bars (number)
  - v: Rotation speed of bars (number)
  - l: Length of attached bars (number)
  - next: Reference to the next circle (object)
- Initial state:
  - Spawned at the top of the screen with random properties
- Shape: Small box (3x3 units) for the center, bars for the attachments
- Color: Red (cyan for the player's current and next platform)
- Behavior:
  - Move downward as the screen scrolls
  - Bars rotate around the center at a constant speed
- Spawning rules:
  - New circles spawn at the top of the screen at regular intervals
  - Properties (radius, number of bars, rotation speed, bar length) are randomized
- Scrolling:
  - Circles move downward at a speed based on difficulty and player position

## Player

- Properties:
  - Current circle (reference to the circle object)
- Initial state:
  - Positioned on the first spawned circle
- Shape: Small box (5x5 units)
- Color: Cyan
- Behavior:
  - Stays on the current circle
  - Can move to the next connected circle
- One-button controls:
  - When tapped: Move to the next circle if available
- Collision events:
  - Colliding with a red bar ends the game
  - Moving off the bottom of the screen ends the game

# Source code

```javascript
title = "CYWALL";

description = `
[Tap] Move
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 27,
};

let circles;
let circleAddDist;
let lastCircle;
let playerCircle;

function update() {
  if (ticks === 0) {
    circles = [];
    circleAddDist = 0;
    lastCircle = undefined;
    playerCircle = undefined;
  }
  if (circleAddDist <= 0) {
    addCircle();
    circleAddDist += rnd(20, 40);
  }
  let sc = difficulty * 0.1;
  const py = playerCircle.p.y;
  if (py < 50) {
    sc += (50 - py) * 0.05;
  }
  circleAddDist -= sc;
  addScore(sc);
  if (playerCircle.p.y > 99) {
    play("explosion");
    end();
  }
  circles = circles.filter((c) => {
    c.p.y += sc;
    if (c.p.y > 99 + c.r) {
      return false;
    }
    color(c === playerCircle || c === playerCircle.next ? "cyan" : "red");
    box(c.p, 3, 3);
    color("red");
    c.a += c.v;
    range(c.num).forEach((i) => {
      const a = c.a + (i * PI * 2) / c.num;
      bar(vec(c.p).addWithAngle(a, c.r), c.l, 3, a + PI / 2);
    });
    return true;
  });
  color("cyan");
  if (playerCircle.next != null && input.isJustPressed) {
    if (line(playerCircle.p, playerCircle.next.p, 3).isColliding.rect["red"]) {
      play("explosion");
      end();
    } else {
      play("coin");
      const p = vec(playerCircle.p);
      const o = vec(playerCircle.next.p).sub(playerCircle.p).div(9);
      const a = o.angle;
      times(9, (i) => {
        particle(p, 4, 2, a + PI, 0.5);
        p.add(o);
      });
    }
    playerCircle = playerCircle.next;
  } else {
    box(playerCircle.p, 5, 5).isColliding.rect;
  }
}

function addCircle() {
  const r = rnd(20, 30);
  const c = {
    p: vec(rnd(20, 80), -r),
    r,
    num: rndi(1, 4),
    a: rnd(PI * 2),
    v: rnds(0.02, 0.05) * difficulty,
    l: rnd(10, 20),
    next: undefined,
  };
  if (lastCircle != null) {
    lastCircle.next = c;
  }
  if (playerCircle == null) {
    playerCircle = c;
  }
  lastCircle = c;
  circles.push(c);
}
```
