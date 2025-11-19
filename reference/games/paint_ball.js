title = "PAINT BALL";

description = `
[Tap] Throw
`;

characters = [
  `
 llll
lyyyyl
lyyyyl
lyyyyl
lyyyyl
 llll
`,
  `
 cccc
cbbbbc
cbbbbc
cbbbbc
cbbbbc
 cccc
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  isDrawingParticleFront: true,
  seed: 5,
};

const gridCount = 12;
/** @type {number[][]} */
let grid;
let gridY;
/** @type {{pos: Vector, vel: Vector, color: number, paintingCount: number}[]} */
let balls;
let nextBallTicks;
/** @type {{pos: Vector, angle: number, va: number}} */
let waitingBall;
let multiplier;

function update() {
  if (!ticks) {
    grid = times(gridCount, () => times(gridCount + 3, () => 0));
    gridY = 0;
    balls = [];
    nextBallTicks = 0;
    waitingBall = { pos: vec(9, 70), angle: 0, va: -1 };
    multiplier = 1;
  }
  const scr = sqrt(difficulty) * 0.03;
  color("light_black");
  box(4, 50, 4, 100);
  box(95, 50, 4, 100);
  gridY += scr;
  if (gridY > 4) {
    gridY -= 7;
    times(gridCount, (x) => {
      times(gridCount + 2, (y) => {
        grid[x][gridCount + 2 - y] = grid[x][gridCount + 1 - y];
      });
      grid[x][0] = 0;
    });
  }
  grid.forEach((gl, x) => {
    gl.forEach((g, y) => {
      // @ts-ignore
      color(["light_black", "yellow", "blue"][g]);
      box(
        50 + (x - (gridCount - 1) / 2) * 7,
        50 + (y - (gridCount + 2) / 2) * 7 + gridY,
        6
      );
    });
  });
  color("black");
  if (waitingBall != null) {
    waitingBall.pos.y += scr;
    if (waitingBall.pos.y > 95) {
      waitingBall.pos.y = 95;
    }
    waitingBall.angle += waitingBall.va * sqrt(difficulty) * 0.02;
    if (
      (waitingBall.va < 0 && waitingBall.angle < -PI / 4) ||
      (waitingBall.va > 0 && waitingBall.angle > PI / 4)
    ) {
      waitingBall.va *= -1;
    }
    const a =
      waitingBall.pos.x < 50 ? waitingBall.angle : PI - waitingBall.angle;
    bar(waitingBall.pos, 20, 2, a, 0);
    char("a", waitingBall.pos);
    if (input.isJustPressed) {
      play("select");
      balls.push({
        pos: waitingBall.pos,
        vel: vec(sqrt(difficulty) * 2).rotate(a),
        color: 1,
        paintingCount: 0,
      });
      waitingBall = undefined;
      multiplier = 1;
    }
  }
  nextBallTicks--;
  if (nextBallTicks < 0) {
    const vel = vec(sqrt(difficulty) * 0.1).rotate(rnd(PI / 8, (PI / 8) * 7));
    balls.push({ pos: vec(rnd(20, 80), -3), vel, color: 2, paintingCount: 0 });
    nextBallTicks = 150 / difficulty;
  }
  remove(balls, (b) => {
    const gx = floor((b.pos.x + 3 - (50 - ((gridCount - 1) / 2) * 7)) / 7);
    const gy = floor(
      (b.pos.y + 3 - (50 - ((gridCount + 2) / 2) * 7) - gridY) / 7
    );
    let sp = 1;
    if (
      b.color === 2 &&
      gx >= 0 &&
      gx < gridCount &&
      gy >= 0 &&
      gy < gridCount + 3
    ) {
      if (grid[gx][gy] === 1) {
        b.paintingCount++;
        sp = 0.1;
      } else {
        b.paintingCount = 999;
      }
    }
    b.pos.add(b.vel.x * sp, b.vel.y * sp);
    b.pos.y += scr;
    if ((b.pos.x <= 9 && b.vel.x < 0) || (b.pos.x >= 90 && b.vel.x > 0)) {
      if (b.color === 1) {
        waitingBall = { pos: b.pos, angle: 0, va: -1 };
        multiplier = 1;
        return true;
      } else {
        b.vel.x *= -1;
      }
    }
    char(b.color === 1 ? "a" : "b", b.pos);
    if (b.color === 2 && b.pos.y > 99) {
      play("explosion");
      color("red");
      text("X", b.pos.x, 97);
      color("black");
      end();
    }
    if ((b.pos.y < 3 && b.vel.y < 0) || (b.pos.y > 99 && b.vel.y > 0)) {
      b.vel.y *= -1;
    }
    if (gx >= 0 && gx < gridCount && gy >= 0 && gy < gridCount + 3) {
      if (b.color === 1 || b.paintingCount > 99 / sqrt(difficulty)) {
        if (b.color === 1 && grid[gx][gy] !== 1) {
          if (grid[gx][gy] === 2) {
            play("laser");
            multiplier++;
          } else {
            play("hit");
          }
          addScore(multiplier, b.pos);
        }
        grid[gx][gy] = b.color;
        b.paintingCount = 0;
      }
    }
  });
  remove(balls, (b) => {
    color("transparent");
    if (b.color === 2 && char("b", b.pos).isColliding.char.a) {
      play("powerUp");
      multiplier++;
      color("cyan");
      particle(b.pos);
      addScore(multiplier, b.pos);
      return true;
    }
  });
  if (balls.length === 0) {
    nextBallTicks = 0;
  }
}
