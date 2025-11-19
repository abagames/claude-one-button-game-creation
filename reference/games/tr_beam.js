title = "TR BEAM";

description = `
[Hold]
 Tractor beam
`;

characters = [
  `
y cc y
 cccc
llllll
lllll
 l l
`,
  `
y cc y
 cccc
llllll
 lllll
  l l
`,
];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 4,
};

/** @type {{pos: Vector, angle: number, trLength: number}} */
let ufo;
/**
 * @type {{
 * pos: Vector, vel: Vector, radius: number, isRed: boolean, isBeamed: boolean
 * }[]}
 */
let balls;
let nextBallTicks;
let nextRedBallCount;
let multiplier;

function update() {
  if (!ticks) {
    ufo = { pos: vec(0, 9), angle: -PI * 0.3, trLength: 0 };
    balls = [];
    nextBallTicks = 0;
    nextRedBallCount = 9;
    multiplier = 1;
  }
  ufo.angle += sqrt(difficulty) * 0.03;
  ufo.pos.x = sin(ufo.angle) * 40 + 50;
  if (input.isJustPressed) {
    play("select");
    multiplier = 1;
  }
  if (input.isPressed) {
    play("laser");
    ufo.trLength = clamp(ufo.trLength + difficulty * 2, 0, 82);
  } else {
    ufo.trLength *= 1 - clamp(sqrt(difficulty), 1, 3) * 0.2;
  }
  let ta = ((ticks % 10) / 10) * (PI / 4);
  if (ufo.trLength > 1) {
    color("blue");
    times(4, () => {
      line(
        4 * cos(ta) + ufo.pos.x,
        ufo.pos.y + 5,
        9 * cos(ta) + ufo.pos.x,
        ufo.pos.y + 5 + ufo.trLength,
        2
      );
      ta += PI / 4;
    });
  }
  color("black");
  char(addWithCharCode("a", floor(ticks / 30) % 2), ufo.pos);
  nextBallTicks--;
  if (nextBallTicks < 0) {
    nextRedBallCount--;
    let isRed = false;
    if (nextRedBallCount < 0) {
      isRed = true;
      nextRedBallCount = rndi(9, 12);
    }
    const radius = rnd(6, 12);
    balls.push({
      pos: vec(rnd(10, 90), 105 + radius),
      vel: vec(),
      radius,
      isRed,
      isBeamed: false,
    });
    nextBallTicks = rnd(20, 25) / sqrt(difficulty);
  }
  remove(balls, (b) => {
    if (b.pos.y > 99) {
      b.vel.y -= sqrt(difficulty);
      b.vel.mul(0.5);
    } else if (b.pos.x < 0 || b.pos.x > 99) {
      b.vel.mul(0.1);
    } else {
      b.vel.mul(0.9);
      if (b.isRed) {
        b.vel.y *= 0.9;
      }
    }
    b.vel.y += sqrt(difficulty) * 0.1;
    b.pos.add(b.vel);
    balls.forEach((ab) => {
      if (ab === b) {
        return;
      }
      const d = ab.pos.distanceTo(b.pos) - ab.radius - b.radius;
      if (d < 0) {
        b.vel.addWithAngle(ab.pos.angleTo(b.pos), -d / sqrt(b.radius));
      }
    });
    color(b.isRed ? "red" : "black");
    const c = arc(b.pos, b.radius).isColliding;
    if (c.char.a || c.char.b) {
      if (b.isRed) {
        play("explosion");
        end();
      } else {
        play("coin");
        addScore(multiplier, b.pos);
        multiplier++;
      }
      return true;
    } else if (c.rect.blue) {
      b.vel.addWithAngle(
        b.pos.angleTo(ufo.pos),
        sqrt(difficulty) / sqrt(b.radius)
      );
      b.vel.x += (ufo.pos.x - b.pos.x) * clamp(sqrt(difficulty), 1, 5) * 0.01;
      b.isBeamed = true;
      if (b.isRed) {
        play("hit");
      }
    } else if (b.isBeamed) {
      b.vel.y *= 0.1;
      b.vel.x *= 5;
      b.isBeamed = false;
    }
    if (
      b.isRed &&
      !b.isBeamed &&
      (b.pos.x < b.radius || b.pos.x > 99 - b.radius)
    ) {
      play("powerUp");
      b.isRed = false;
    } else if (
      !b.isBeamed &&
      b.pos.isInRect(10, 12 + b.radius, 80, 5) &&
      b.vel.y > 0
    ) {
      b.isRed = true;
    }
    return b.pos.x < -20 || b.pos.x > 120;
  });
  if (ufo.trLength > 1) {
    color("cyan");
    times(4, () => {
      line(
        4 * cos(ta) + ufo.pos.x,
        ufo.pos.y + 5,
        9 * cos(ta) + ufo.pos.x,
        ufo.pos.y + 5 + ufo.trLength
      );
      ta += PI / 4;
    });
  }
}
