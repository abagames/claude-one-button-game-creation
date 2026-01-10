title = "V BOMB";

description = `
[Tap] Turn
`;

characters = [
  `
ll
lllll
llllll
`,
  `
lll
lll
lll
lll
 l
`,
  `
  ll
 l ll
l llll
llllll
 llll
  ll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 200,
};

/** @type {{pos: Vector, vx: number, targetVx: number}} */
let ship;
/** @type {{pos: Vector, vel: Vector, bombTicks: number}[]} */
let enemies;
let nextEnemyTicks;
/** @type {{pos: Vector, count: number, vy: number}[]} */
let bombs;
/** @type {{pos: Vector, height: number}[]} */
let explosions;
let multiplier;

function update() {
  if (!ticks) {
    ship = { pos: vec(40, 10), vx: 1, targetVx: 1 };
    enemies = [];
    nextEnemyTicks = 0;
    bombs = [];
    explosions = [];
    multiplier = 1;
  }
  color("black");
  rect(0, 90, 100, 10);
  nextEnemyTicks--;
  if (nextEnemyTicks < 0) {
    enemies.push({
      pos: vec(rnd() < 0.5 ? -3 : 103, rnd(70, 80)),
      vel: vec(0, -sqrt(difficulty) * rnd(0.01, 0.03)),
      bombTicks: 0,
    });
    nextEnemyTicks = rnd(120, 150) / difficulty;
  }
  if (explosions.length === 0) {
    multiplier = 1;
  }
  color("red");
  remove(explosions, (e) => {
    box(e.pos, 6, e.height);
    e.pos.y -= 7;
    e.height += 5;
    return e.pos.y + e.height < 0;
  });
  remove(enemies, (e) => {
    e.bombTicks--;
    if (e.bombTicks < 0) {
      if (e.pos.x > 1 && e.pos.x < 99) {
        play("laser");
        bombs.push({ pos: vec(e.pos), count: rndi(3, 9) + 0.9, vy: 0 });
      }
      e.bombTicks = rnd(200, 300);
    }
    const ms = sqrt(difficulty) * 0.1;
    e.vel.x = clamp(
      e.vel.x + (ship.pos.x - e.pos.x) * 0.0002 * sqrt(difficulty),
      -ms,
      ms
    );
    if (e.pos.y < 10) {
      e.vel.y = 0;
    }
    e.pos.add(e.vel);
    if (
      char(abs(e.vel.x) < 0.1 ? "b" : "a", e.pos, {
        mirror: { x: e.vel.x < 0 ? -1 : 1, y: abs(e.vel.x) < 0.1 ? -1 : 1 },
      }).isColliding.rect.red
    ) {
      play("coin");
      addScore(multiplier, e.pos);
      multiplier++;
      particle(e.pos, 9, 3);
      return true;
    }
  });
  remove(bombs, (b) => {
    b.vy += 0.1 * difficulty;
    b.pos.y += b.vy;
    if (b.pos.y > 87) {
      b.pos.y = 87;
    }
    color("purple");
    const sc = (10 - b.count) / 10 + 0.5;
    char("c", b.pos.x, b.pos.y + 3 - (10 - b.count) / 2, {
      scale: { x: sc, y: sc },
    });
    color(b.count <= 1 ? "red" : "black");
    let ty = b.pos.y - (10 - b.count) * 2;
    if (b.count < 1) {
      ty -= (1 - b.count) * 50;
    }
    if (text(`${ceil(b.count)}`, b.pos.x, ty).isColliding.rect.red) {
      b.count = 0;
    }
    color("purple");
    particle(
      b.pos.x,
      b.pos.y - (10 - b.count) / 2,
      0.3,
      (10 - b.count) * 0.1,
      -PI / 2,
      PI / 3
    );
    const pc = ceil(b.count);
    b.count -= 1 / 60;
    if (pc != ceil(b.count)) {
      play("hit");
    }
    if (b.count <= 0) {
      play("explosion");
      particle(b.pos, 20, 3, -PI / 2, PI / 8);
      explosions.push({ pos: vec(b.pos), height: 6 });
      return true;
    }
  });
  color("black");
  if (
    input.isJustPressed ||
    (ship.pos.x > 99 && ship.targetVx > 0) ||
    (ship.pos.x < 1 && ship.targetVx < 0)
  ) {
    play("select");
    ship.targetVx *= -1;
  }
  ship.vx += (ship.targetVx - ship.vx) * 0.1;
  ship.pos.x += ship.vx * sqrt(difficulty);
  const c = char(abs(ship.vx) < 0.5 ? "b" : "a", ship.pos, {
    mirror: { x: ship.vx < 0 ? -1 : 1 },
  }).isColliding;
  if (c.rect.red || c.char.a || c.char.b) {
    play("lucky");
    end();
  }
}
