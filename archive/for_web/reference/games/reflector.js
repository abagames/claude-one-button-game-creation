title = "REFLECTOR";

description = `
[Tap]
 Turn
[Hold]
 Enforce
 reflector
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
  `
 rrr
rrrrr
rrrrrr
lwlwll
 lwll
`,
  `
 rrr
rrrrr
rrrrrr
llwlwl
 llwl
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

/** @type {{pos: Vector, vx: number, angle: number, power: number}} */
let ufo;
/**
 * @type {{
 * pos: Vector, vx: number, angle: number, angleVel: number, speed: number
 * fireTicks: number, fireInterval: number, fireSpeed: number
 * }[]}
 */
let tanks;
let nextTankTicks;
/** @type {{pos: Vector, vel: Vector}[]} */
let bullets;
/** @type {{pos: Vector, radius: number, ticks: number, duration: number}[]} */
let explosions;
let multiplier;

function update() {
  if (!ticks) {
    ufo = { pos: vec(40, 9), vx: 1, angle: 0, power: 0 };
    tanks = [];
    nextTankTicks = 0;
    bullets = [];
    explosions = [];
    multiplier = 1;
  }
  color("light_black");
  rect(0, 90, 100, 10);
  if (
    input.isJustPressed ||
    (ufo.pos.x < 3 && ufo.vx < 0) ||
    (ufo.pos.x > 97 && ufo.vx > 0)
  ) {
    play("select");
    ufo.vx *= -1;
  }
  if (input.isPressed) {
    ufo.power += (1 - ufo.power) * 0.05;
  } else {
    ufo.power *= 0.9;
  }
  ufo.pos.x += ufo.vx * sqrt(difficulty) * (input.isPressed ? 0.5 : 1) * 0.5;
  if (!input.isPressed) {
    ufo.angle = clamp(
      ufo.angle - ufo.vx * sqrt(difficulty) * 0.07,
      -PI / 4,
      PI / 4
    );
  }
  color("black");
  char(addWithCharCode("a", floor(ticks / 15) % 2), ufo.pos);
  color("blue");
  bar(
    vec(ufo.pos).addWithAngle(ufo.angle + PI / 2, 6),
    9 - ufo.power * 9,
    3 + ufo.power * 3,
    ufo.angle
  );
  if (tanks.length === 0) {
    nextTankTicks = 0;
  }
  nextTankTicks--;
  if (nextTankTicks < 0) {
    const vx = rnd() < 0.5 ? -1 : 1;
    const fireInterval = rnd(200, 300) / difficulty;
    const av = rnd(1, 5);
    tanks.push({
      pos: vec(vx > 0 ? -3 : 103, 87),
      vx,
      angle: -PI / 2,
      angleVel: av * 0.002,
      speed: (0.1 / sqrt(av)) * sqrt(difficulty),
      fireTicks: fireInterval,
      fireInterval,
      fireSpeed: rnd(1, 1.5) * sqrt(difficulty),
    });
    nextTankTicks = rnd(60, 80) / sqrt(difficulty);
  }
  color("light_red");
  if (explosions.length === 0) {
    multiplier = 1;
  }
  remove(explosions, (e) => {
    e.ticks--;
    const r = e.radius * sin((e.ticks / e.duration) * PI);
    arc(e.pos, r);
    return e.ticks < 0;
  });
  color("black");
  remove(tanks, (t) => {
    t.pos.x += t.vx * t.speed;
    const ta = t.pos.angleTo(ufo.pos);
    if (abs(ta) < t.angleVel) {
      t.angle = ta;
    } else if (ta < t.angle) {
      t.angle -= t.angleVel;
    } else {
      t.angle += t.angleVel;
    }
    bar(t.pos, 3, 2, t.angle, -0.5);
    if (
      char(addWithCharCode("c", floor(ticks / 25) % 2), t.pos, {
        mirror: { x: t.vx < 0 ? -1 : 1 },
      }).isColliding.rect.light_red
    ) {
      play("powerUp");
      addScore(multiplier, t.pos);
      multiplier++;
      particle(t.pos);
      return true;
    }
    t.fireTicks--;
    if (t.fireTicks < 0) {
      play("laser");
      bullets.push({
        pos: vec(t.pos),
        vel: vec(t.fireSpeed, 0).rotate(t.angle),
      });
      t.fireTicks = t.fireInterval;
    }
    return t.pos.x < -3 || t.pos.x > 103;
  });
  remove(bullets, (b) => {
    b.pos.add(b.vel);
    color(b.vel.y < 0 ? "red" : "purple");
    const c = bar(b.pos, 4, 3, b.vel.angle).isColliding;
    if (b.vel.y < 0) {
      if (c.rect.blue) {
        play("coin");
        particle(b.pos, 9, 1 + ufo.power * 2, ufo.angle + PI / 2, PI / 8);
        const ra = b.vel.angle - ufo.angle;
        const a = b.vel.angle;
        const s = b.vel.length * (1 + ufo.power * 4);
        b.vel.set().addWithAngle(a - ra * 2, s);
        b.pos.addWithAngle(a - ra * 2, s * 2);
        if (b.pos.y < 20) {
          b.pos.y = 20;
        }
      } else if (c.char.a || c.char.b) {
        play("lucky");
        end();
      }
    }
    if (b.vel.y > 0 && (c.char.c || c.char.d || c.rect.light_black)) {
      play("explosion");
      const s = b.vel.length / sqrt(difficulty);
      const radius = s * s;
      const duration = sqrt(radius) * 9;
      explosions.push({
        pos: b.pos,
        radius,
        ticks: duration,
        duration,
      });
      return true;
    }
    return !b.pos.isInRect(-3, -3, 106, 106);
  });
  color("light_black");
  rect(0, 90, 100, 10);
}
