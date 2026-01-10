title = "ACCEL B";

description = `
[Tap]  Fire
[Hold] Accel
`;

characters = [
  `
ll
 lllll
`,
  `
   lll
 lllll
llllll
   ll
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 20,
};

/** @type {{pos: Vector, vx: number}} */
let player;
/**
 * @type {{
 * pos: Vector, vel: Vector, target: Vector,
 * ticks: number, exTicks: number, smokeTicks: number,
 * }[]}
 */
let playerMissiles;
/**
 * @type {{
 * pos: Vector, vx: number, ma: number, fireTicks: number
 * }[]}
 */
let enemies;
let nextEnemyDist;
/**
 * @type {{
 * pos: Vector, angle: number, va: number, speed: number, smokeTicks: number,
 * }[]}
 */
let missiles;
/** @type {{pos: Vector, vel: Vector, ticks: number, isEnemy: boolean}[]} */
let smokes;
/** @type {{pos: Vector, size: Vector}[]} */
let forests;
let multiplier;

function update() {
  if (!ticks) {
    player = { pos: vec(20, 45), vx: 0 };
    playerMissiles = [];
    enemies = [];
    nextEnemyDist = 0;
    missiles = [];
    smokes = [];
    forests = times(7, (i) => {
      return { pos: vec(-99 - i * 40, 0), size: vec() };
    });
    multiplier = 1;
  }
  const scr = (player.pos.x - 20) * 0.1;
  color("yellow");
  rect(0, 90, 200, 10);
  color("green");
  forests.forEach((f) => {
    box(f.pos, f.size);
    f.pos.x -= scr;
    if (f.pos.x < -99) {
      f.pos.x += 300 + rnd(99);
      f.pos.y = rnd(90, 99);
      f.size.set(rnd(30, 50), rnd(5, 9));
    }
  });
  remove(smokes, (s) => {
    s.pos.add(s.vel);
    s.pos.x -= scr;
    s.vel.mul(0.95);
    color(s.isEnemy && s.ticks < 20 ? "light_red" : "light_black");
    box(s.pos, 3 + cos(s.ticks * 0.03) * 5);
    s.ticks += sqrt(difficulty);
    return s.ticks > 60;
  });
  player.vx +=
    ((input.isPressed ? 2 : 0.2) * sqrt(difficulty) - player.vx) * 0.2;
  player.pos.x += player.vx - scr;
  color("blue");
  char("a", player.pos);
  color("purple");
  rect(player.pos.x - 3, player.pos.y, -player.vx * 3, 1);
  if (playerMissiles.length === 0) {
    color("cyan");
    box(player.pos.x, player.pos.y + 3, 5, 2);
    if (input.isJustPressed) {
      play("select");
      multiplier = 1;
      enemies.forEach((e) => {
        playerMissiles.push({
          pos: vec(player.pos.x, player.pos.y + 3),
          vel: vec(sqrt(difficulty) * 2),
          target: e.pos,
          ticks: 0,
          exTicks: 0,
          smokeTicks: 0,
        });
      });
      missiles.forEach((m) => {
        playerMissiles.push({
          pos: vec(player.pos.x, player.pos.y + 3),
          vel: vec(sqrt(difficulty) * 2),
          target: m.pos,
          ticks: 0,
          exTicks: 0,
          smokeTicks: 0,
        });
      });
    }
  }
  let pmc = playerMissiles.length;
  remove(playerMissiles, (m) => {
    m.pos.add(m.vel);
    m.pos.x += sqrt(difficulty) - scr;
    if (m.exTicks > 0) {
      if (m.pos.y > 90) {
        m.vel.set();
      }
      m.exTicks += sqrt(difficulty);
      m.vel.mul(0.9);
      color("red");
      box(m.pos, 3 + cos(m.exTicks * 0.05) * 9);
      return m.exTicks > 30;
    }
    const d = m.pos.distanceTo(m.target);
    if (d < 9 || m.pos.y > 95 || m.ticks > 120) {
      play("powerUp");
      m.exTicks = 1;
      const s = m.vel.length;
      m.vel.set().addWithAngle(m.pos.angleTo(m.target), s);
    }
    const mv =
      (sqrt(difficulty) / sqrt(d + 9)) *
      (m.ticks < 9 ? 0.1 : m.ticks < 20 ? 3 : 1);
    m.vel.addWithAngle(m.pos.angleTo(m.target), mv);
    m.vel.mul(m.ticks < 20 ? 0.7 : 0.95);
    m.ticks += sqrt(difficulty);
    color("cyan");
    bar(m.pos, 3, 2, m.vel.angle);
    m.smokeTicks += sqrt(difficulty);
    if (m.smokeTicks > 5) {
      smokes.push({
        pos: vec(m.pos),
        vel: vec(m.vel).mul(0.5),
        ticks: 0,
        isEnemy: false,
      });
      m.smokeTicks -= 5;
    }
  });
  if (pmc > 0 && playerMissiles.length === 0) {
    play("coin");
  }
  nextEnemyDist -= scr;
  if (nextEnemyDist < 0) {
    enemies.push({
      pos: vec(203, rnd() < 0.5 ? rnd(5, 35) : rnd(55, 85)),
      vx: rnd(sqrt(difficulty)) * 0.5,
      ma: PI + rnds(0.2, PI / 5),
      fireTicks: ceil(rnd(10, 30) / sqrt(difficulty)),
    });
    nextEnemyDist += rnd(40, 60) / difficulty;
  }
  remove(enemies, (e) => {
    e.pos.x -= e.vx + scr;
    e.fireTicks--;
    if (e.fireTicks === 0) {
      play("laser");
      missiles.push({
        pos: vec(e.pos.x, e.pos.y + 3),
        angle: e.ma,
        va: 0,
        speed: sqrt(difficulty),
        smokeTicks: 0,
      });
    }
    color("purple");
    if (char("b", e.pos).isColliding.rect.red) {
      play("explosion");
      particle(e.pos, 15, 2);
      addScore(multiplier, e.pos);
      if (multiplier < 64) {
        multiplier *= 2;
      }
      return true;
    }
    if (e.fireTicks > 0) {
      color("black");
      bar(e.pos.x, e.pos.y + 3, 3, 3, e.ma);
    }
    return e.pos.x < -3;
  });
  const vva = sqrt(difficulty) * 0.0005;
  remove(missiles, (m) => {
    m.pos.addWithAngle(m.angle, m.speed);
    m.pos.x -= scr;
    const ta = m.pos.angleTo(player.pos);
    const oy = wrap(ta - m.angle, -PI, PI);
    m.va += (oy > 0 ? 1 : -1) * vva;
    m.angle = clamp(
      wrap(m.angle + m.va, 0, PI * 2),
      (PI / 4) * 3,
      (PI / 4) * 5
    );
    color("black");
    const c = bar(m.pos, 3, 3, m.angle).isColliding;
    m.smokeTicks += sqrt(difficulty);
    if (m.smokeTicks > 9) {
      smokes.push({
        pos: vec(m.pos),
        vel: vec().addWithAngle(m.angle, m.speed * 0.3),
        ticks: 0,
        isEnemy: true,
      });
      m.smokeTicks -= 9;
    }
    color("red");
    if (c.rect.red) {
      play("hit");
      particle(m.pos, 9, 2);
      addScore(multiplier, m.pos);
      if (multiplier < 64) {
        multiplier *= 2;
      }
      return true;
    } else if (c.char.a) {
      play("explosion");
      end();
    }
    if (m.pos.y > 90) {
      particle(m.pos);
      return true;
    }
    return m.pos.x < -3;
  });
}
