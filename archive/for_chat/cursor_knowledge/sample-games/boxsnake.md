# Game rules

1. Game Environment:

   - The game takes place in a square box with padded edges.
   - The box contains a snake, bullets, and balls.

2. Core Mechanics:

   - The snake moves along the edges of the box.
   - The snake can stretch when the button is held.
   - A turret on the snake fires bullets.
   - Balls appear randomly within the box and move around.

3. Player Interaction:

   - Players control the snake's movement by holding down a button to stretch it.

4. Challenge:
   - Avoid colliding with the balls while trying to shoot them with bullets.
   - Increase score by hitting balls with bullets.
   - Maintain a longer snake length to increase the score multiplier.

# Game objects

## Snake

- Properties:
  - head: {edge: number, pos: number}
  - tail: {edge: number, pos: number}
  - isStretching: boolean
  - length: number
  - turret: {edge: number, pos: number, ticks: number}
- Initial state:
  - head and tail at edge 1, position 0.5
  - isStretching: false
  - length: 0
  - turret at edge 1, position 0.5, ticks: 0
- Shape: Line
- Color: green
- Behavior:
  - Moves along the edges of the box
  - Stretches when button is held
  - Turret moves along the snake and fires bullets
- One-button controls:
  - When pressed: Snake head moves forward and stretches
  - When released: Snake tail catches up to head

## Bullets

- Properties:
  - pos: Vector
  - angle: number
- Shape: Small bar
- Color: blue
- Behavior:
  - Move in a straight line from the turret
  - Disappear when hitting the box edge

## Balls

- Properties:
  - pos: Vector
  - vel: Vector
- Shape: Small box
- Color: red
- Behavior:
  - Move around the box, bouncing off edges
  - Disappear when hit by a bullet
- Spawning rules:
  - Appear at random positions within the box
  - Initial velocity is random

# Source code

```javascript
title = "BOX SNAKE";

description = `
[Hold] Stretch
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

const boxPadding = 9;
const boxThickness = 7;
/** @type {{
 * head: {edge: number, pos: number}, tail: {edge: number, pos: number},
 * isStretching: boolean, length: number,
 * turret: {edge: number, pos: number, ticks: number}
 * }} */
let snake;
/** @type {{pos: Vector, angle: number}[]} */
let bullets;
/** @type {{pos: Vector, vel: Vector}[]} */
let balls;
let nextBallTicks;
let multiplier;

function update() {
  if (!ticks) {
    snake = {
      head: { edge: 1, pos: 0.5 },
      tail: { edge: 1, pos: 0.5 },
      isStretching: false,
      length: 0,
      turret: { edge: 1, pos: 0.5, ticks: 0 },
    };
    bullets = [];
    balls = [];
    nextBallTicks = 0;
    multiplier = 1;
  }
  const sd = sqrt(difficulty);
  drawBox();
  color("blue");
  remove(bullets, (b) => {
    b.pos.addWithAngle(b.angle, 3 * sd);
    if (bar(b.pos, 2 * sd, 3 * sd, b.angle).isColliding.rect.light_blue) {
      return true;
    }
  });
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isJustReleased) {
    play("laser");
  }
  if (input.isPressed) {
    snake.head.pos += 0.01 * sd;
    if (
      snake.length > 3 &&
      snake.head.edge === snake.tail.edge &&
      snake.head.pos >= snake.tail.pos
    ) {
      snake.turret.pos = snake.head.pos;
      snake.turret.edge = snake.head.edge;
      play("coin");
      multiplier++;
    }
    if (snake.head.pos >= 1) {
      snake.head.pos -= 1;
      snake.head.edge = wrap(snake.head.edge + 1, 0, 4);
    }
    snake.isStretching = true;
  } else if (snake.isStretching) {
    snake.tail.pos += 0.1 * sd;
    if (
      snake.length < 1 &&
      snake.tail.edge === snake.head.edge &&
      snake.tail.pos >= snake.head.pos
    ) {
      snake.isStretching = false;
      snake.tail.pos = snake.head.pos;
    } else if (snake.tail.pos >= 1) {
      if (snake.length >= 0.1 * sd) {
        snake.tail.pos -= 1;
        snake.tail.edge = wrap(snake.tail.edge + 1, 0, 4);
      } else {
        snake.isStretching = false;
        snake.tail.edge = wrap(snake.tail.edge + 1, 0, 4);
        snake.tail.pos = snake.head.pos;
      }
    }
  }
  drawSnake();
  snake.turret.pos -= 0.01;
  color("transparent");
  if (
    !box(calcSnakePos(snake.turret.edge, snake.turret.pos), 3, 3).isColliding
      .rect.green
  ) {
    snake.turret.pos = snake.head.pos;
    snake.turret.edge = snake.head.edge;
  } else if (snake.turret.pos <= 0) {
    snake.turret.pos += 1;
    snake.turret.edge = wrap(snake.turret.edge - 1, 0, 4);
  }
  snake.turret.ticks--;
  if (snake.turret.ticks < 0) {
    const pos = calcSnakePos(snake.turret.edge, snake.turret.pos);
    const angle = ((snake.turret.edge + 2) * PI) / 2;
    bullets.push({
      pos,
      angle,
    });
    color("blue");
    particle(pos, { count: 2, speed: 2, angle, angleWidth: 0.3 });
    snake.turret.ticks = 3;
  }
  nextBallTicks -= sd;
  if (nextBallTicks < 0) {
    const pos = vec(rnd(20, 80), rnd(20, 80));
    const a = pos.angleTo(50, 50);
    balls.push({
      pos,
      vel: vec(rnd(0.5, 1) * sd, 0).rotate(a + rnds(0.2)),
    });
    nextBallTicks += rnd(9, 99);
  }
  color("red");
  remove(balls, (b) => {
    b.pos.add(b.vel);
    const c = box(b.pos, 4).isColliding.rect;
    if (c.blue) {
      play("powerUp");
      addScore(Math.ceil(snake.length * 10) * multiplier, b.pos);
      particle(b.pos);
      return true;
    }
    if (c.green) {
      play("explosion");
      end();
    }
    if (b.pos.x < boxPadding && b.vel.x < 0) {
      b.vel.x *= -1;
    }
    if (b.pos.x > 100 - boxPadding && b.vel.x > 0) {
      b.vel.x *= -1;
    }
    if (b.pos.y < boxPadding && b.vel.y < 0) {
      b.vel.y *= -1;
    }
    if (b.pos.y > 100 - boxPadding && b.vel.y > 0) {
      b.vel.y *= -1;
    }
  });
  color("black");
  text(`x${multiplier}`, 3, 9, { isSmallText: true });
}

function drawSnake() {
  color("green");
  let e = snake.head.edge;
  let p = snake.head.pos;
  let pt = snake.tail.pos;
  snake.length = 0;
  for (let i = 0; i < 5; i++) {
    if (e === snake.tail.edge) {
      if (p >= pt) {
        pt = snake.tail.pos;
        line(calcSnakePos(e, p), calcSnakePos(e, pt));
        snake.length += p - pt;
        break;
      } else {
        if (i === 0) {
          pt = 0;
          line(calcSnakePos(e, p), calcSnakePos(e, pt));
          snake.length += p - pt;
          p = 1;
        } else {
          p = snake.tail.pos;
          line(calcSnakePos(e, p), calcSnakePos(e, pt));
          snake.length += p - pt;
          break;
        }
      }
    } else {
      pt = 0;
      line(calcSnakePos(e, p), calcSnakePos(e, pt));
      snake.length += p - pt;
      p = 1;
    }
    e = wrap(e - 1, 0, 4);
  }
  color("white");
  box(calcSnakePos(snake.head.edge, snake.head.pos), 1, 1);
}

function calcSnakePos(edge, pos) {
  switch (edge) {
    case 0:
      return vec(100 - boxPadding, (100 - boxPadding * 2) * pos + boxPadding);
    case 1:
      return vec(
        100 - boxPadding - (100 - boxPadding * 2) * pos,
        100 - boxPadding
      );
    case 2:
      return vec(boxPadding, 100 - boxPadding - (100 - boxPadding * 2) * pos);
    case 3:
      return vec((100 - boxPadding * 2) * pos + boxPadding, boxPadding);
  }
}

function drawBox() {
  color("light_blue");
  rect(
    boxPadding - boxThickness,
    boxPadding - boxThickness,
    100 - (boxPadding - boxThickness) * 2,
    boxThickness
  );
  rect(
    boxPadding - boxThickness,
    boxPadding - boxThickness,
    boxThickness,
    100 - (boxPadding - boxThickness) * 2
  );
  rect(
    boxPadding - boxThickness,
    100 - boxPadding,
    100 - (boxPadding - boxThickness) * 2,
    boxThickness
  );
  rect(
    100 - boxPadding,
    boxPadding - boxThickness,
    boxThickness,
    100 - (boxPadding - boxThickness) * 2
  );
}
```
