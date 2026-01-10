title = "HOLES";

description = `
[Tap]
 Change holes
`;

characters = [];

options = {
  theme: "shape",
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  seed: 9,
};

/** @type {{pos: Vector, vel: Vector, angle: number}[]} */
let balls;
/** @type {{pos: Vector, length: number, angle: number, index: number}[]} */
let walls;
/** @type {{pos: Vector, wall: any}} */
let coin;
let nextWallDist;
let holeIndex;
let currentIndex;
let scr;
let scrBaseY;
const ballRadius = 1;
const wallAngle = 0.2;
const holeLength = 12;

function update() {
  if (!ticks) {
    balls = [{ pos: vec(10, 0), vel: vec(), angle: 0 }];
    walls = [];
    coin = { pos: vec(), wall: undefined };
    setCoin(20, 0);
    holeIndex = 0;
    currentIndex = 0;
    scr = 0;
    scrBaseY = 60;
  }
  if (input.isJustPressed) {
    play("laser");
    currentIndex = currentIndex === 0 ? 1 : 0;
    scrBaseY -= sqrt(difficulty) * 9;
  }
  color("light_yellow");
  rect(0, 0, 5, 99);
  rect(95, 0, 5, 99);
  color("yellow");
  coin.pos.y -= scr;
  addScore(scr * balls.length);
  line(coin.pos, coin.pos.x + 1, coin.pos.y, 7);
  remove(walls, (w) => {
    w.pos.y -= scr;
    if (w.pos.y < 9) {
      w.pos.y--;
    }
    if (w.index < 0 || w.index === currentIndex) {
      color(
        `${w.pos.y < 9 ? "light_" : ""}${w.angle === 0 ? "green" : "cyan"}`
      );
      bar(w.pos, w.length, 4, w.angle === 0 ? wallAngle : PI - wallAngle, 0);
    }
    return w.pos.y < -w.length * sin(wallAngle);
  });
  let maxY = 0;
  remove(balls, (b) => {
    b.vel.y += 0.2 * sqrt(difficulty);
    b.vel.mul(1 - 0.02 * sqrt(difficulty));
    b.pos.add(vec(b.vel).mul(sqrt(difficulty) * 0.5));
    b.pos.y -= scr;
    if (b.pos.y < scrBaseY + 20 && b.pos.y > maxY) {
      maxY = b.pos.y;
    }
    b.angle += b.vel.x * 0.03 + b.vel.y * 0.02;
    color("red");
    const c = arc(b.pos, ballRadius, 3, b.angle, b.angle + PI * 2).isColliding
      .rect;
    if (c.yellow) {
      play("coin");
      addScore(balls.length * 10, b.pos);
      addWalls(coin.wall);
    }
    if (c.light_yellow) {
      reflect(b, b.pos.x < 50 ? 0 : PI, "light_yellow");
    }
    if (c.green) {
      reflect(b, wallAngle - PI / 2, "green");
    }
    if (c.cyan) {
      reflect(b, PI - wallAngle + PI / 2, "cyan");
    }
    if (b.pos.y > 99 + ballRadius) {
      play("hit");
      return true;
    }
    return b.pos.y < -ballRadius;
  });
  scr = maxY > scrBaseY ? (maxY - scrBaseY) * 0.1 : 0;
  scrBaseY += (60 - scrBaseY) * 0.01;
  if (balls.length === 0) {
    play("explosion");
    end();
  }
  balls.forEach((b) => {
    balls.forEach((ab) => {
      if (ab === b || ab.pos.distanceTo(b.pos) > ballRadius * 2) {
        return;
      }
      reflect(b, ab.pos.angleTo(b.pos));
    });
  });

  function reflect(b, a, c) {
    const oa = wrap(b.vel.angle - a - PI, -PI, PI);
    if (abs(oa) < PI / 2) {
      b.vel.addWithAngle(a, b.vel.length * cos(oa) * 1.7);
    }
    if (c != null) {
      color("transparent");
      for (let i = 0; i < 9; i++) {
        b.pos.addWithAngle(a, 1);
        if (!arc(b.pos, ballRadius).isColliding.rect[c]) {
          break;
        }
      }
    }
  }

  function setCoin(y, a) {
    coin.pos.set(a === 0 ? 10 : 89, y);
    const w = {
      pos: vec(a === 0 ? 7 : 93, y + 9),
      length: 9,
      angle: a,
      index: -1,
    };
    walls.push(w);
    coin.wall = w;
  }

  function addWalls(w) {
    if (balls.length < 9) {
      balls.push({
        pos: vec(rnd(30, 70), 0),
        vel: vec(0, sqrt(difficulty)),
        angle: rnd(PI * 2),
      });
    }
    const y = w.pos.y;
    const a = w.angle;
    const holeXs = [];
    const xl = 80;
    const lp = holeLength + 9;
    for (let i = 0; i < 5; i++) {
      const hx = rnd(15, xl - lp / 2 - 5);
      let isValid = true;
      holeXs.forEach((ahx) => {
        if (abs(hx - ahx) < holeLength + 9) {
          isValid = false;
        }
      });
      if (isValid) {
        holeXs.push(hx);
      }
    }
    holeXs.sort();
    const p = vec(a === 0 ? 7 : 93, y);
    const wa = a === 0 ? wallAngle : PI - wallAngle;
    let phx;
    holeXs.forEach((hx) => {
      const l =
        hx -
        holeLength / 2 -
        (phx == null ? 0 : phx + holeLength / 2) * (1 / cos(wallAngle));
      walls.push({ pos: vec(p), length: l - 5, angle: a, index: -1 });
      p.addWithAngle(wa, l);
      const hl = holeLength * (1 / cos(wallAngle));
      walls.push({ pos: vec(p), length: hl - 5, angle: a, index: holeIndex });
      if (rnd() < 0.7) {
        holeIndex = holeIndex === 0 ? 1 : 0;
      }
      p.addWithAngle(wa, hl);
      phx = hx;
    });
    // @ts-ignore
    const l = (xl - (phx + holeLength / 2)) * (1 / cos(wallAngle));
    walls.push({ pos: vec(p), length: l - 5, angle: a, index: -1 });
    w.pos.y = -99;
    setCoin(y + 80 * sin(wallAngle) + 9, a === 0 ? 1 : 0);
  }
}
