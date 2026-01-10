title = "ROLL S";

description = `
[Tap]
 Change angle
[Hold]
 Fire
`;

characters = [
  `
ll
ll
ll
ll
ll
ll
`,
  `
  ll
   ll
    ll
    ll
   ll 
  ll
`,
  `
  lll
   ll
  lll
 ll ll
ll  ll 
ll  ll
`,
  `




llllll
llllll
`,
  `



ll
llllll
llllll
`,
  `
ll
ll
ll
ll
ll
ll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingParticleFront: true,
  isDrawingScoreFront: true,
  seed: 200,
};

/** @type {{pos: Vector, angle: number, va: number, ticks: number, fireTicks: number}} */
let player;
/** @type {{pos: Vector, vel: Vector}[]} */
let shots;
/** @type {{pos: Vector, vel: Vector, angle: number, ticks: number, fireTicks: number}[]} */
let enemies;
let nextEnemyTicks;
/** @type {{pos: Vector, vel: Vector}[]} */
let bullets;
let scrOfs;
let multiplier;
const playerX = 20;

function update() {
  if (!ticks) {
    player = { pos: vec(playerX, 50), angle: 0, va: 1, ticks: 0, fireTicks: 0 };
    shots = [];
    enemies = [];
    nextEnemyTicks = 0;
    bullets = [];
    scrOfs = 0;
    multiplier = 1;
  }
  let scr = 0;
  const pa = (floor(player.angle) * PI) / 4;
  const pc = vec(player.pos.x, player.pos.y - 9);
  let pd = false;
  if (input.isJustReleased) {
    play("select");
    player.angle += player.va;
    if (player.angle < -1 || player.angle > 1) {
      player.va *= -1;
      player.angle += player.va * 2;
    }
    player.fireTicks = 9 / sqrt(difficulty);
  }
  if (input.isPressed) {
    if (player.angle === 0 || player.angle === 4) {
      pc.set(player.pos.x + (player.angle === 0 ? 6 : -6), player.pos.y - 3);
      pd = true;
    }
    player.angle = floor(player.angle);
    player.fireTicks--;
    if (player.fireTicks < 0) {
      play("hit");
      times(5, (i) => {
        shots.push({
          pos: vec(pc),
          vel: vec(3 * sqrt(difficulty)).rotate(pa + i * 0.12 - 0.24),
        });
      });
      player.fireTicks = 9 / sqrt(difficulty);
    }
  } else {
    scr = sqrt(difficulty) * 0.5;
    player.ticks += sqrt(difficulty);
  }
  scrOfs += scr;
  if (scrOfs > multiplier * 100) {
    play("coin");
    multiplier++;
  }
  color("green");
  rect(0, 20, 100, 5);
  rect(0, 50, 100, 5);
  rect(0, 80, 100, 5);
  rect(0, 80, 100, 5);
  color("light_black");
  rect(0, 25, 100, 25);
  rect(0, 55, 100, 25);
  color("light_blue");
  rect(0, 85, 100, 15);
  color("light_green");
  rect(wrap(-scrOfs + playerX, 0, 100), 25, 2, 25);
  rect(wrap(-scrOfs + 67, -10, 110), 55, 2, 25);
  color("black");
  if (pd) {
    char("d", pc);
    color("blue");
    char("e", player.pos.x, player.pos.y - 3);
  } else {
    char("a", pc);
    color("blue");
    char(
      addWithCharCode("b", floor(player.ticks / 15) % 2),
      player.pos.x,
      player.pos.y - 3
    );
  }
  color("black");
  bar(pc, 6, 3, pa, 0);
  color("blue");
  remove(shots, (s) => {
    s.pos.add(s.vel);
    s.pos.x -= scr;
    bar(s.pos, 3, 3, s.vel.angle);
    return !s.pos.isInRect(-3, -3, 106, 106);
  });
  const fireInterval = ceil(300 / sqrt(difficulty));
  const fireRepeatInterval = ceil(36 / sqrt(difficulty));
  nextEnemyTicks--;
  if (nextEnemyTicks < 0) {
    enemies.push({
      pos: vec(105, rndi(3) * 30 + 20),
      vel: vec(rnd(1, difficulty) * -0.2),
      angle: 0,
      ticks: 0,
      fireTicks: rndi(fireInterval),
    });
    nextEnemyTicks = rnd(50, 60) / difficulty;
  }
  remove(enemies, (e) => {
    const ec = vec(e.pos.x, e.pos.y - 9);
    e.fireTicks--;
    if (e.fireTicks < 0) {
      if (-e.fireTicks % fireRepeatInterval === 0) {
        play("jump");
        bullets.push({ pos: ec, vel: vec(sqrt(difficulty)).rotate(e.angle) });
      }
      if (-e.fireTicks >= fireRepeatInterval * 3) {
        e.fireTicks = fireInterval;
      }
    } else {
      e.angle =
        floor((e.pos.angleTo(player.pos) + PI / 8) / (PI / 4)) * (PI / 4);
      e.pos.add(e.vel);
      e.ticks -= e.vel.x * 5;
    }
    e.pos.x -= scr;
    color("red");
    const c1 = char("f", ec, { mirror: { x: -1 } }).isColliding;
    const c2 = char(
      addWithCharCode("b", floor(e.ticks / 15) % 2),
      e.pos.x,
      e.pos.y - 3,
      { mirror: { x: -1 } }
    ).isColliding;
    color(e.fireTicks < 0 ? "red" : "black");
    bar(ec, 6, 3, e.angle, 0);
    if (c1.rect.blue || c2.rect.blue) {
      play("powerUp");
      color("red");
      addScore(multiplier);
      particle(e.pos);
      return true;
    }
    if (c1.char.a) {
      play("explosion");
      end();
    }
    return !e.pos.isInRect(-5, -5, 110, 110);
  });
  color("red");
  remove(bullets, (b) => {
    b.pos.add(b.vel);
    b.pos.x -= scr;
    const c = bar(b.pos, 3, 3, b.vel.angle).isColliding.char;
    if (c.a || c.d) {
      play("explosion");
      end();
    }
    return !b.pos.isInRect(-5, -5, 110, 110);
  });
  color("black");
  text(`x${multiplier}`, 3, 9);
}
