title = "FLIP O";

description = `
[Tap] Flip
`;

characters = [];

options = {
  theme: "shapeDark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  seed: 2,
};

/** @type {{pos: Vector, pp: Vector, vel: Vector, angle: number, multiplier: 1}[]} */
let balls;
let flipCount;
/** @type {{pos: Vector, hasBall: boolean}[]} */
let blocks;
let nextBlockDist;
const ballRadius = 2;
const flipperLength = 12;
const blockSize = vec(9, 5);
const blockCount = 8;

function update() {
  if (!ticks) {
    balls = [
      {
        pos: vec(80, 10),
        pp: vec(80, 10),
        vel: vec(1, 0),
        angle: rnd(PI * 2),
        multiplier: 1,
      },
    ];
    flipCount = 0;
    blocks = [];
    nextBlockDist = 0;
  }
  let maxBlockY = 0;
  blocks.forEach((b) => {
    color(b.hasBall ? "red" : "cyan");
    box(b.pos, blockSize);
    if (b.pos.y > maxBlockY) {
      maxBlockY = b.pos.y;
    }
  });
  let scr = maxBlockY < 29 ? (30 - maxBlockY) * 0.1 : sqrt(difficulty) * 0.02;
  if (input.isJustPressed) {
    play("laser");
    scr += sqrt(difficulty) * 0.3 * balls.length;
    flipCount = (flipCount + 1) % 2;
  }
  color("light_cyan");
  rect(5, 0, 90, 5);
  color("light_blue");
  rect(0, 0, 5, 99);
  rect(95, 0, 5, 99);
  color("blue");
  let c = bar(7, 75, 25, 3, 0.5, 0).isColliding.rect;
  c = { ...c, ...bar(101 - 7, 75, 25, 3, PI - 0.5, 0).isColliding.rect };
  color("purple");
  const f1a = flipCount === 0 ? 0.5 : -0.5;
  c = { ...c, ...bar(50 - 17, 88, flipperLength, 3, f1a, 0).isColliding.rect };
  const f2a = flipCount === 0 ? PI + 0.5 : PI - 0.5;
  c = { ...c, ...bar(51 + 17, 88, flipperLength, 3, f2a, 0).isColliding.rect };
  if (c.cyan || c.red) {
    color("red");
    bar(7, 75, 25, 3, 0.5, 0);
    bar(101 - 7, 75, 25, 3, PI - 0.5, 0);
    play("explosion");
    end();
  }
  if (input.isJustPressed) {
    if (flipCount === 0) {
      bar(51 + 17, 88, flipperLength, 3, PI, 0);
    } else {
      bar(50 - 17, 88, flipperLength, 3, 0, 0);
    }
  }
  remove(balls, (b) => {
    b.pp.set(b.pos);
    b.pp.y += scr;
    b.vel.y += 0.1;
    b.vel.mul(0.99);
    b.pos.add(vec(b.vel).mul(sqrt(difficulty) * 0.5));
    b.pos.y += scr;
    b.angle += b.vel.x * 0.03 + b.vel.y * 0.02;
    color("black");
    const c = arc(b.pos, ballRadius, 3, b.angle, b.angle + PI * 2).isColliding
      .rect;
    if (c.red || c.cyan) {
      addScore(b.multiplier * balls.length, b.pos);
      b.multiplier++;
      color("transparent");
      const cx = arc(b.pp.x, b.pos.y, ballRadius).isColliding.rect;
      const cy = arc(b.pos.x, b.pp.y, ballRadius).isColliding.rect;
      if (!(cx.red || cx.cyan)) {
        reflect(b, b.vel.x > 0 ? -PI : 0);
      }
      if (!(cy.red || cy.cyan)) {
        reflect(b, b.vel.y > 0 ? -PI / 2 : PI / 2);
      }
    }
    if (c.light_cyan) {
      play("hit");
      reflect(b, PI / 2, "light_cyan");
    }
    if (c.light_blue) {
      play("hit");
      reflect(b, b.pos.x < 50 ? 0 : PI, "light_blue");
    }
    if (c.blue) {
      reflect(b, b.pos.x < 50 ? 0.5 - PI / 2 : PI - 0.5 + PI / 2, "blue");
    }
    if (c.purple) {
      if (input.isJustPressed) {
        play("jump");
        const pp = vec(b.pos);
        const pf1a = flipCount === 1 ? 0.5 : -0.5;
        const pf2a = flipCount === 1 ? PI + 0.5 : PI - 0.5;
        reflect(b, b.pos.x < 50 ? pf1a - PI / 2 : pf2a + PI / 2, "purple");
        reflect(b, -PI / 2, "purple");
        reflect(b, b.pos.x < 50 ? f1a - PI / 2 : f2a + PI / 2, "purple");
        b.vel.add(vec(b.pos).sub(pp));
        b.multiplier = 1;
      } else {
        reflect(b, b.pos.x < 50 ? f1a - PI / 2 : f2a + PI / 2, "purple");
      }
    }
    if (b.pos.y > 99 + ballRadius) {
      play("select");
      return true;
    }
  });
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
  color("transparent");
  remove(blocks, (b) => {
    b.pos.y += scr;
    if (box(b.pos, blockSize).isColliding.rect.black) {
      if (b.hasBall) {
        play("powerUp");
        balls.push({
          pos: vec(b.pos),
          pp: vec(b.pos),
          vel: vec(1, 0).rotate(PI * 2),
          angle: rnd(PI * 2),
          multiplier: 1,
        });
      } else {
        play("coin");
      }
      return true;
    }
  });
  nextBlockDist -= scr;
  while (nextBlockDist < 0) {
    let x = (blockSize.x + 1) / 2;
    const y = -nextBlockDist;
    const br = 0.1 / balls.length;
    for (let i = 0; i < blockCount / 2; i++) {
      if (rnd() < 0.5) {
        blocks.push({ pos: vec(50 - x, y), hasBall: rnd() < br });
        blocks.push({ pos: vec(50 + x, y), hasBall: rnd() < br });
      }
      x += blockSize.x + 1;
    }
    nextBlockDist += blockSize.y + 1;
  }

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
}
