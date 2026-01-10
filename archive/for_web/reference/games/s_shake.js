title = "S SHAKE";

description = `
[Tap] Shake
`;

characters = [
  `
  lll
ll l l
 llll
 l  l
ll  ll
`,
  `
  lll
ll l l
 llll
  ll
 l  l
 l  l
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 7,
};

/** @type {{pos: Vector, angle: number, height: number}[]} */
let grounds;
let heightRatio;
/** @type {{pos: Vector, vel: Vector, isOnGround: boolean, ticks: number}[]} */
let enemies;
let nextEnemyTicks;
let multiplier;

function update() {
  if (!ticks) {
    let angle = 0;
    grounds = times(22, (i) => {
      angle += (PI * 4) / 20;
      return { pos: vec(i * 10), angle, height: 9 };
    });
    heightRatio = 1;
    enemies = [];
    nextEnemyTicks = 0;
    multiplier = 1;
  }
  let scr = difficulty * 0.3;
  if (input.isJustPressed) {
    play("jump");
    heightRatio = 3;
    multiplier = 1;
  }
  heightRatio += (1 - heightRatio) * 0.05;
  let maxY = 0;
  grounds.forEach((g, i) => {
    g.pos.x += scr;
    if (g.pos.x > 210) {
      g.pos.x -= 220;
      const ng = grounds[wrap(i + 1, 0, 22)];
      g.angle = ng.angle - ((PI * 4) / 20) * rnd(0.5, 1.5);
      g.height = ng.height + rnds(1);
      g.height += (9 - g.height) * 0.05;
    }
    g.pos.y = sin(g.angle) * g.height;
    if (g.pos.y > maxY) {
      maxY = g.pos.y;
    }
  });
  let pp;
  grounds.forEach((g) => {
    g.pos.y = (g.pos.y - maxY) * heightRatio + 99;
    if (pp != null && pp.x < g.pos.x) {
      line(pp, g.pos);
    }
    pp = g.pos;
  });
  const fp = grounds[0].pos;
  const lp = grounds[grounds.length - 1].pos;
  if (lp.x < fp.x) {
    line(lp, fp);
  }
  nextEnemyTicks--;
  if (nextEnemyTicks < 0) {
    enemies.push({
      pos: vec(203, 50),
      vel: vec(-rnd(1, sqrt(difficulty)) * 0.3 * sqrt(difficulty)),
      isOnGround: true,
      ticks: 0,
    });
    nextEnemyTicks = rnd(120) / difficulty / difficulty;
  }
  remove(enemies, (e) => {
    e.pos.add(e.vel);
    e.ticks -= e.vel.x;
    color("transparent");
    if (e.isOnGround) {
      if (input.isJustPressed) {
        let vy = 0;
        for (let i = 0; i < 99; i++) {
          e.pos.y--;
          vy--;
          if (box(e.pos, 6).isColliding.rect.black) {
            e.vel.y = vy * sqrt(difficulty) * 0.3;
            e.isOnGround = false;
            break;
          }
        }
      }
      if (box(e.pos, 6).isColliding.rect.black) {
        for (let i = 0; i < 99; i++) {
          e.pos.y--;
          if (!box(e.pos, 6).isColliding.rect.black) {
            break;
          }
        }
      } else {
        for (let i = 0; i < 99; i++) {
          e.pos.y++;
          if (box(e.pos, 6).isColliding.rect.black) {
            e.pos.y--;
            break;
          }
        }
      }
    } else {
      e.vel.y += 0.03 * difficulty;
      if (box(e.pos, 6).isColliding.rect.black) {
        e.isOnGround = true;
        e.vel.y = 0;
      } else if (e.vel.y > 0) {
        let ey = e.pos.y;
        for (let i = 0; i < 9; i++) {
          ey -= 3;
          if (box(e.pos.x, ey, 6).isColliding.rect.black) {
            e.pos.y = ey - 5;
            e.isOnGround = true;
            e.vel.y = 0;
            break;
          }
        }
      }
    }
    color("black");
    char(addWithCharCode("a", floor(e.ticks / 9) % 2), e.pos, {
      mirror: { x: -1 },
    });
    if (e.pos.y < -3) {
      play("coin");
      addScore(multiplier, e.pos.x, clamp(9 + multiplier * 3, 9, 60));
      multiplier++;
      return true;
    }
    if (e.pos.x < 3) {
      play("explosion");
      end();
    }
    return e.pos.y > 103;
  });
}
