title = "M FIELD";

description = `
[Tap]
 Jump / Double jump
[Hold]
 Speed up
`;

characters = [
  `
llllll
ll l l
ll l l
llllll
 l  l
 l  l
  `,
  `
llllll
ll l l
ll l l
llllll
ll  ll
  `,
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
  seed: 2,
};

/** @type {{x: number, ticks: number, isBlinking: boolean}[]} */
let mines;
let nextMineDist;
/** @type {{x: number, ticks: number}[]} */
let explosions;
/** @type {{x: number, vx: number}[]} */
let enemies;
let nextEnemyDist;
/** @type {{pos: Vector, vel: Vector, jumpCount: number}} */
let player;
let gx;
let multiplier;

function update() {
  if (!ticks) {
    mines = [];
    nextMineDist = 0;
    explosions = [];
    enemies = [];
    nextEnemyDist = 0;
    player = { pos: vec(80, 87), vel: vec(), jumpCount: 0 };
    gx = 0;
    multiplier = 1;
  }
  const scr =
    player.pos.x > 99 ? (player.pos.x - 99) * 0.1 * sqrt(difficulty) : 0;
  color("light_black");
  rect(0, 90, 200, 10);
  gx = wrap(gx - scr, 0, 200);
  color("white");
  rect(gx, 90, 2, 10);
  color("red");
  remove(explosions, (e) => {
    e.x -= scr;
    e.ticks += sqrt(difficulty);
    box(e.x, 86, sin(e.ticks * 0.1) * 50, 8);
    return e.ticks > PI / 0.1;
  });
  nextEnemyDist -= scr;
  if (nextEnemyDist < 0) {
    if (rnd() < 0.7) {
      enemies.push({ x: 203, vx: -rnd(1, 2) * sqrt(difficulty) * 0.4 });
    } else {
      enemies.push({ x: -3, vx: rnd(1.5, 2) * sqrt(difficulty) * 0.4 });
    }
    nextEnemyDist += rnd(20, 30);
  }
  color("purple");
  remove(enemies, (e) => {
    e.x += e.vx - scr;
    if (
      player.jumpCount === 0 &&
      ((e.x < player.pos.x - 20 && e.vx < 0) ||
        (e.x > player.pos.x + 20 && e.vx > 0))
    ) {
      e.vx *= -1;
    }
    if (
      char(addWithCharCode("c", floor(ticks / 20) % 2), e.x, 87, {
        mirror: { x: e.vx > 0 ? 1 : -1 },
      }).isColliding.rect.red
    ) {
      play("powerUp");
      addScore(multiplier, e.x, 87);
      particle(e.x, 87);
      if (multiplier < 64) {
        multiplier *= 2;
      }
      return true;
    }
    return e.x < -9;
  });
  player.vel.x +=
    ((input.isPressed ? 1 : 0.3) * sqrt(difficulty) - player.vel.x) * 0.1;
  if (player.jumpCount > 0) {
    player.vel.y += (input.isPressed ? 0.05 : 0.1) * difficulty;
    if (player.pos.y > 87) {
      player.pos.y = 87;
      player.vel.y = 0;
      player.jumpCount = 0;
    }
  }
  if (player.jumpCount < 2 && input.isJustPressed) {
    play("jump");
    player.vel.y = -2 * sqrt(difficulty);
    player.pos.y -= 6;
    player.jumpCount++;
  }
  player.pos.add(player.vel);
  player.pos.x -= scr;
  color("black");
  const c = char(
    player.jumpCount > 0 || ticks % 30 > 15 ? "a" : "b",
    player.pos
  ).isColliding;
  if (c.rect.red) {
    play("lucky");
    end();
  }
  if (c.char.c || c.char.d) {
    if (player.vel.y > 0) {
      play("jump");
      player.vel.y *= -0.8;
      player.pos.y = 80;
    } else {
      play("lucky");
      end();
    }
  }
  nextMineDist -= scr;
  if (nextMineDist < 0) {
    mines.push({ x: 203, ticks: 0, isBlinking: false });
    nextMineDist = rnd() < 0.6 ? rnd(9, 20) : rnd(50, 80);
  }
  remove(mines, (m) => {
    m.x -= scr;
    let y = m.ticks > 0 ? 89 : 91;
    color("purple");
    if (m.ticks > 0) {
      m.ticks += sqrt(difficulty);
      if (m.ticks > 59) {
        explode(m.x);
        return true;
      } else if (m.ticks % 30 > 15) {
        if (!m.isBlinking) {
          play("laser");
        }
        m.isBlinking = true;
      } else {
        color("transparent");
        m.isBlinking = false;
      }
    }
    const c = box(m.x, y, 6, 3).isColliding;
    if (c.rect.red) {
      explode(m.x);
      return true;
    } else if (m.ticks === 0 && (c.char.a || c.char.b)) {
      play("hit");
      multiplier = 1;
      m.ticks = 1;
    }
    return m.x < -3;
  });

  function explode(x) {
    play("explosion");
    explosions.push({ x: x, ticks: 0 });
    color("red");
    particle(x, 89, 9, 2, -PI / 2, PI / 2);
  }
}
