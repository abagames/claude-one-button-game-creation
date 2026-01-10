# Game rules

1. Game Environment:

   - The game takes place on a 100x100 unit screen.
   - The player controls a character at the center of the screen.
   - Enemies spawn from the edges and move towards the center.

2. Core Mechanics:

   - The player has an arc-shaped weapon that rotates continuously.
   - Holding the button sets the starting point of the arc.
   - Releasing the button fires the arc as a projectile.

3. Player Interaction:

   - Hold the button to set the arc's range and angle.
   - Release the button to fire the arc projectile.
   - The player's character moves after firing, based on the arc's direction.

4. Challenge:
   - Destroy incoming enemies with the arc projectile.
   - Avoid colliding with enemies.
   - Survive as long as possible while increasing score and difficulty.

# Game objects

## Player

- Properties:
  - pos: Position (Vector)
  - angle: Current angle of the arc (number)
  - moveAngle: Direction of movement after firing (number)
  - moveDist: Distance to move after firing (number)
- Initial state:
  - pos: vec(50, 50)
  - angle: 0
  - moveAngle: 0
  - moveDist: 0
- Shape: Character ('a' or 'b')
- Color: black
- Behavior:
  - Rotates continuously (angle increases by 0.07 \* difficulty each update)
  - Moves after firing based on moveAngle and moveDist
- One-button controls:
  - When pressed: Sets arc starting point
  - When held: Increases arc range
  - When released: Fires arc projectile and moves player
- Collision events:
  - Ends game if colliding with an enemy

## Arc Projectile

- Properties:
  - pos: Starting position (Vector)
  - d: Current distance traveled (number)
  - range: Maximum range (number)
  - arcFrom: Starting angle (number)
  - arcTo: Ending angle (number)
- Initial state:
  - Created when player releases the button
- Shape: Arc
- Color: cyan
- Behavior:
  - Expands outward from the player's position
- Spawning rules:
  - Spawns when the player releases the button
- Collision events:
  - Destroys enemies on contact

## Enemies

- Properties:
  - p: Position (Vector)
  - v: Velocity (Vector)
- Initial state:
  - Spawn at the edge of the screen
- Shape: Character ('d' or 'e')
- Color: red
- Behavior:
  - Move towards the center of the screen
- Spawning rules:
  - Spawn at regular intervals based on difficulty
  - Spawn position and velocity are randomized
- Collision events:
  - Destroyed when hit by arc projectile
  - Ends game when colliding with player

# Source code

```javascript
title = "ARCFIRE";

description = `
[Hold]
  Set arc
[Release]
  Fire
`;

characters = [
  `
  ll
  l  l
 llll
l l  
  lll
 l 
`,
  `
  ll
l l
 llll
  l  l
llll
    l
`,
  ``,
  `
 llll
  l  
 lllll
l l  
  lll
 l 
`,
  `
 llll
  l
lllll
  l  l
llll
    l
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 16,
};

let pos;
let moveAngle;
let moveDist;
let angle;
let arcFrom;
let arcTo;
let shots;
let isPressing;
let enemies;
let enemyAddAngle;
let enemyAddTicks;
let multiplier;

function update() {
  if (!ticks) {
    pos = vec(50, 50);
    angle = 0;
    shots = [];
    isPressing = false;
    moveAngle = 0;
    moveDist = 0;
    enemies = [];
    enemyAddAngle = rnd(PI * 2);
    enemyAddTicks = 0;
  }
  if (moveDist > 1) {
    pos.add(vec(moveDist * 0.2).rotate(moveAngle));
    moveDist *= 0.2;
    if (!pos.isInRect(10, 10, 90, 90)) {
      moveAngle += PI;
    }
    pos.clamp(10, 90, 10, 90);
  }
  angle += 0.07 * difficulty;
  color("light_blue");
  arc(50, 50, 7, 4);
  color("light_black");
  line(pos, vec(9).rotate(angle).add(pos), 2);
  color("black");
  char(addWithCharCode("a", floor(ticks / 30) % 2), pos, {
    mirror: { x: cos(moveAngle) < 0 ? -1 : 1 },
  });
  let range = 0;
  if (isPressing) {
    arcTo = angle;
    range = 300 / sqrt((arcTo - arcFrom) * 30);
    color("green");
    line(pos, vec(range).rotate(arcFrom).add(pos));
    line(pos, vec(range).rotate(arcTo).add(pos));
    arc(pos, range, 3, arcFrom, arcTo);
  }
  if (isPressing && arcTo - arcFrom > PI) {
    isPressing = false;
  }
  if (isPressing && input.isJustReleased) {
    isPressing = false;
    if (shots.length === 0) {
      play("select");
      shots.push({ pos, d: 0, range, arcFrom, arcTo });
    }
    moveAngle = (arcTo + arcFrom) / 2;
    moveDist = range / 2;
  }
  if (input.isJustPressed) {
    play("laser");
    arcFrom = angle;
    isPressing = true;
    multiplier = 1;
  }
  color("cyan");
  shots = shots.filter((s) => {
    s.d += 2;
    arc(pos, s.d, 5, s.arcFrom, s.arcTo);
    return s.d < s.range;
  });
  enemyAddTicks -= difficulty;
  if (enemyAddTicks < 0) {
    const p = vec(70).rotate(enemyAddAngle).add(50, 50);
    const v = vec(rnd(10))
      .rotate(rnd(PI * 2))
      .add(50, 50)
      .sub(p)
      .div(500 / rnd(1, difficulty));
    enemies.push({ p, v });
    enemyAddTicks += rnd(40, 60);
    if (rnd() < 0.1) {
      enemyAddAngle = rnd(PI * 2);
    } else {
      enemyAddAngle += rnds(0.05);
    }
  }
  color("red");
  enemies = enemies.filter((e) => {
    e.p.add(e.v);
    const c = char(addWithCharCode("d", floor(ticks / 30) % 2), e.p, {
      mirror: { x: cos(e.v.angle) < 0 ? -1 : 1 },
    }).isColliding;
    if (c.rect.cyan) {
      play("powerUp");
      particle(e.p);
      addScore(multiplier, e.p);
      multiplier++;
      return false;
    }
    if (c.char.a || c.char.b || c.rect.light_blue) {
      if (c.rect.light_blue) {
        text("X", vec(e.p).sub(50, 50).div(2).add(50, 50));
      } else {
        text("X", pos);
      }
      play("lucky");
      end();
    }
    return true;
  });
}
```
