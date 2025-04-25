# Game rules

1. Game Environment:

   - The game takes place on a scrolling platform with a ground level.
   - Rectangular obstacles appear on the platform.

2. Core Mechanics:

   - The player controls a stretchy tape that can be extended and released.
   - The tape can wrap around rectangular obstacles.

3. Player Interaction:

   - Hold the button to extend the tape.
   - Release the button to retract the tape.

4. Challenge:
   - Navigate the tape around obstacles while avoiding falling fireballs.
   - Maintain the tape's position on the screen as it scrolls.

# Game objects

## Tape

- Properties:
  - from: Starting position (Vector)
  - to: Ending position (Vector)
  - type: Current state ("ground", "up", "top", "down")
  - rect: Reference to the current rectangle being wrapped
- Initial state:
  - from: (100, groundY - 1)
  - to: (100, groundY - 1)
  - type: "ground"
  - rect: undefined
- Shape: Line
- Color: Black
- Behavior:
  - Extends when the button is held
  - Retracts when the button is released
  - Wraps around rectangles
- One-button controls:
  - When pressed: Tape extends
  - When released: Tape retracts
- Collision events:
  - Wraps around rectangles when colliding

## Rectangles

- Properties:
  - x: Horizontal position
  - size: Size of the rectangle (Vector)
- Initial state: None (spawned during gameplay)
- Shape: Rectangle
- Color: Light Black
- Behavior:
  - Static, but move left as the screen scrolls
- Spawning rules:
  - Appear at the right side of the screen
  - Random width between 20 and 40
  - Random height between 10 and 50
- Scrolling:
  - Move left at a speed based on difficulty and tape position

## Fireballs

- Properties:
  - pos: Position (Vector)
  - vel: Velocity (Vector)
  - size: Size of the fireball
- Initial state: None (spawned during gameplay)
- Shape: Box
- Color: Red
- Behavior:
  - Move diagonally downwards
  - Leave particle trail
- Spawning rules:
  - Appear at random positions above the screen
  - Random size between 5 and 15
- Collision events:
  - Disappear when hitting the ground or obstacles
  - End the game if colliding with the tape

# Source code

```javascript
title = "TAPE J";

description = `
[Hold]    Pull
[Release] Release
`;

characters = [];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 3,
};

/** @type {{x: number, size: Vector}[]} */
let rects;
let nextRectDist;
/** @type {{from: Vector, to: Vector}[]} */
let tapes;
/**
 * @type {{
 * from: Vector, to: Vector, type: "ground" | "up" | "top" | "down", rect
 * }}
 */
let head;
/** @type {{pos: Vector, vel: Vector, size: number}[]} */
let fires;
let nextFireTicks;
let scr;
let dist;
const groundY = 90;

function update() {
  if (!ticks) {
    rects = [];
    nextRectDist = 0;
    tapes = [];
    head = {
      from: vec(100, groundY - 1),
      to: vec(100, groundY - 1),
      type: "ground",
      rect: undefined,
    };
    fires = [];
    nextFireTicks = 100;
    scr = 0;
    dist = 0;
  }
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isPressed) {
    const spd = difficulty;
    dist += spd;
    switch (head.type) {
      case "ground":
        head.to.x += spd;
        break;
      case "up":
        head.to.y -= spd;
        if (head.to.y < groundY - head.rect.size.y) {
          head.to.y = groundY - head.rect.size.y;
          tapes.push({
            from: vec(head.from),
            to: vec(head.to),
          });
          head.type = "top";
          play("coin");
          head.from.set(head.to);
        }
        break;
      case "top":
        head.to.x += spd;
        if (head.to.x > head.rect.x + head.rect.size.x + 1) {
          head.to.x = head.rect.x + head.rect.size.x + 1;
          tapes.push({
            from: vec(head.from),
            to: vec(head.to),
          });
          head.type = "down";
          play("coin");
          head.from.set(head.to);
        }
        break;
      case "down":
        head.to.y += spd;
        if (head.to.y > groundY - 1) {
          head.to.y = groundY - 1;
          tapes.push({
            from: vec(head.from),
            to: vec(head.to),
          });
          head.type = "ground";
          play("coin");
          head.from.set(head.to);
          head.to.x += 3;
          head.rect = undefined;
        }
        break;
    }
  } else {
    if (dist > 0) {
      play("powerUp");
      addScore(floor(sqrt(dist) * dist * 0.1 + 1), head.to);
      dist = 0;
    }
    if (tapes.length > 0) {
      const t = tapes[0];
      t.from.x += (t.to.x - t.from.x) * 0.2 * sqrt(difficulty);
      t.from.y += (t.to.y - t.from.y) * 0.2 * sqrt(difficulty);
      if (t.from.distanceTo(t.to) < 3) {
        tapes.splice(0, 1);
      }
    } else {
      head.from.x += (head.to.x - head.from.x) * 0.2 * sqrt(difficulty);
      head.from.y += (head.to.y - head.from.y) * 0.2 * sqrt(difficulty);
    }
  }
  head.from.x -= scr;
  if (head.from.x < 0) {
    head.from.x = 0;
  }
  if (head.to.x < 0) {
    play("explosion");
    end();
  }
  head.to.x -= scr;
  color("black");
  remove(tapes, (t) => {
    t.from.x -= scr;
    if (t.from.x < 0) {
      t.from.x = 0;
    }
    t.to.x -= scr;
    line(t.from, t.to);
    return t.to.x < 0;
  });
  line(head.from, head.to, 3);
  color("light_yellow");
  let j = tapes.length > 0 ? tapes[0].from : head.from;
  box(j.x - 1, j.y - 1, 5, 5);
  color("purple");
  box(head.to, 3, 3);
  scr = difficulty * 0.1;
  if (head.to.x > 50) {
    scr += (head.to.x - 50) * 0.1;
  }
  nextRectDist -= scr;
  if (nextRectDist < 0) {
    const w = rnd(20, 40);
    rects.push({ x: 200, size: vec(w, rnd(10, 50)) });
    nextRectDist = w + rnd(20, 70);
  }
  color("light_black");
  rect(0, groundY, 200, 100 - groundY);
  remove(rects, (r) => {
    if (
      rect(r.x, 90, r.size.x, -r.size.y).isColliding.rect.purple &&
      head.type === "ground"
    ) {
      const to = vec(r.x - 1, groundY - 1);
      tapes.push({ from: vec(head.from), to });
      head.from.set(to);
      head.to.set(to);
      head.type = "up";
      play("coin");
      head.rect = r;
    }
    r.x -= scr;
    return r.x < -r.size.x;
  });
  nextFireTicks--;
  if (nextFireTicks < 0) {
    play("laser");
    const size = rnd(5, 15);
    const f = {
      pos: vec(rnd(150, 220), -size),
      vel: vec(-rnd(0.5, 1), rnd(0.8, 1.2)),
      size,
    };
    f.vel.mul(difficulty);
    fires.push(f);
    nextFireTicks = rnd(40, 60) / difficulty;
  }
  color("red");
  remove(fires, (f) => {
    f.pos.add(f.vel);
    f.pos.x -= scr;
    const cl = box(f.pos, f.size, f.size).isColliding.rect;
    particle(
      f.pos.x + rnds(f.size / 2),
      f.pos.y + rnds(f.size / 2),
      (rnd() * f.size) / 2,
      -f.vel.length,
      f.vel.angle,
      0.3
    );
    if (cl.black || cl.purple || cl.light_yellow) {
      play("explosion");
      end();
    }
    if (cl.light_black || f.pos.y > groundY) {
      play("hit");
      particle(f.pos, f.size * 5);
      return true;
    }
  });
}
```
