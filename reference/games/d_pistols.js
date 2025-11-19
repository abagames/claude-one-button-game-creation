title = "D PISTOLS";

description = `
[Tap]
 Turn & Fire
[Hold]
 Cross Fire
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
  theme: "crt",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 7,
};

/** @type {{pos: Vector, my: -1 | 1}} */
let player;
let holdTicks;
/** @type {{pos: Vector, angle: number}[]} */
let shots;
/** @type {{pos: Vector, vel: Vector, ticks: number}[]} */
let enemies;
let nextEnemyTicks;
let nextEnemyY;
let prevEnemyVx;
let multiplier;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 20), my: 1 };
    holdTicks = 0;
    shots = [];
    enemies = [];
    nextEnemyTicks = 0;
    nextEnemyY = 50;
    prevEnemyVx = 1;
    multiplier = 0;
  }
  if (input.isJustPressed) {
    play("laser");
    player.my *= -1;
    times(2, (i) => {
      shots.push({
        pos: vec(player.pos.x, player.pos.y + player.my),
        angle: i * PI,
      });
    });
    multiplier = clamp(multiplier - 1, 0, 99);
  }
  if (input.isPressed) {
    holdTicks += difficulty;
    if (holdTicks > 30) {
      play("select");
      times(4, (i) => {
        shots.push({ pos: vec(player.pos), angle: (i * PI) / 2 });
      });
      holdTicks = 0;
      multiplier = clamp(multiplier - 5, 1, 99);
    }
  } else {
    holdTicks = 0;
  }
  player.pos.y += player.my * difficulty * (1 - holdTicks / 30);
  if (
    (player.pos.y < 0 && player.my < 0) ||
    (player.pos.y > 99 && player.my > 0)
  ) {
    player.my *= -1;
  }
  color("black");
  char(addWithCharCode("a", floor(ticks / 15) % 2), player.pos, {
    mirror: { x: player.my },
  });
  remove(shots, (s) => {
    s.pos.addWithAngle(s.angle, difficulty * 2);
    bar(s.pos, 1, 6, s.angle);
    return !s.pos.isInRect(-3, -3, 106, 106);
  });
  if (enemies.length === 0) {
    nextEnemyTicks = 0;
  }
  nextEnemyTicks--;
  if (nextEnemyTicks < 0) {
    if (rnd() < 0.3) {
      nextEnemyY = rnd(9, 90);
      prevEnemyVx *= -1;
    }
    const vel = vec(prevEnemyVx, 0);
    vel.x *= rnd(1, difficulty) * 0.3;
    enemies.push({ pos: vec(vel.x > 0 ? -3 : 103, nextEnemyY), vel, ticks: 0 });
    nextEnemyTicks = rnd(20, 40) / difficulty;
  }
  color("red");
  remove(enemies, (e) => {
    e.pos.add(e.vel);
    if ((e.pos.x > 50 && e.vel.x > 0.1) || (e.pos.x < 50 && e.vel.x < -0.1)) {
      e.pos.x = 50;
      e.vel.y = player.pos.y < e.pos.y ? -abs(e.vel.x) : abs(e.vel.x);
      e.vel.x *= 0.0001;
    }
    e.ticks++;
    const c = char(addWithCharCode("c", floor(e.ticks / 15) % 2), e.pos, {
      mirror: { x: e.vel.x < 0 ? -1 : 1 },
    }).isColliding;
    if (c.rect.black) {
      play("hit");
      multiplier = clamp(multiplier + 1, 0, 99);
      addScore(multiplier, e.pos);
      particle(e.pos);
      return true;
    }
    if (c.char.a || c.char.b) {
      play("explosion");
      end();
    }
  });
}
