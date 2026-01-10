title = "KITE";

description = `
[Hold] Blow wind
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
     l
lllll

llll
   
llllll
`,
  `
 yyyy
yY YYy
yY YYy
yY YYy
yY YYy
 yyyy
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 5,
};

/** @type {{pos: Vector, vel: Vector}} */
let kite;
/** @type {{pos: Vector, vel: Vector, ticks: number}} */
let player;
/** @type {{pos: Vector, vel: Vector}[]} */
let winds;
let nextWindTicks;
/** @type {{pos: Vector, vel: Vector}[]} */
let coins;
let nextCoinDist;
let groundX;
/** @type {{pos: Vector, height: number}[]} */
let spikes;
/** @type {{yAngle: number, hAngle: number}[]} */
let spikeAngles;
let nextSpikeDist;
const stringDist = 50;

function update() {
  if (!ticks) {
    kite = { pos: vec(40, 50), vel: vec() };
    player = { pos: vec(20, 87), vel: vec(), ticks: 0 };
    groundX = 0;
    winds = [];
    nextWindTicks = 0;
    coins = [];
    nextCoinDist = 0;
    spikes = [];
    spikeAngles = times(2, (i) => {
      return { yAngle: (i * PI) / 2, hAngle: i * PI };
    });
    nextSpikeDist = 0;
  }
  const sd = sqrt(difficulty);
  const scr = kite.pos.x > 60 ? (kite.pos.x - 60) * 0.1 : 0;
  nextSpikeDist -= scr;
  if (nextSpikeDist < 0) {
    addScore(1);
    spikeAngles.forEach((a, i) => {
      const height = sin(a.yAngle) * 9 + sin(a.hAngle) * 20 - 10;
      a.yAngle += rnd(sd) * 0.2;
      a.hAngle += rnd(sd) * 0.4;
      if (height > 0) {
        spikes.push({
          pos: vec(205, i === 0 ? 0 : 90),
          height: height * (i === 0 ? 1 : -1),
        });
      }
    });
    nextSpikeDist += 10;
  }
  color("red");
  remove(spikes, (s) => {
    s.pos.x -= scr;
    line(s.pos.x - 5, s.pos.y, s.pos.x, s.pos.y + s.height);
    line(s.pos.x + 5, s.pos.y, s.pos.x, s.pos.y + s.height);
    return s.pos.x < -5;
  });
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isPressed) {
    kite.vel.add(difficulty * 0.2, -difficulty * 0.2);
  }
  kite.vel.y += difficulty * 0.01;
  kite.vel.mul(0.95);
  kite.pos.add(kite.vel);
  kite.pos.x -= scr;
  if (kite.pos.y < 0) {
    kite.pos.y = 0;
    kite.vel.y = 0;
  } else if (kite.pos.y > 87) {
    kite.pos.y = 87;
    kite.vel.y = 0;
  }
  color("blue");
  if (box(kite.pos, 6).isColliding.rect.red) {
    const s = kite.pos.y < 50 ? 1 : -1;
    play("hit");
    color("transparent");
    let c = 0;
    while (box(kite.pos, 6).isColliding.rect.red && c < 9) {
      kite.pos.y += 3 * s;
      c++;
    }
    kite.vel.y = sqrt(c) * s * 2 * sd;
  }
  color("light_black");
  let p = vec(kite.pos.x - 3, kite.pos.y + 3);
  line(p, vec(p).add(-kite.vel.x * 3, kite.vel.y + 9), 2);
  p = vec(kite.pos.x + 3, kite.pos.y + 3);
  line(p, vec(p).add(-kite.vel.x * 3, kite.vel.y + 9), 2);
  line(kite.pos, player.pos, 2);
  player.pos.add(player.vel);
  player.pos.x -= scr;
  if (player.pos.y < 87) {
    player.vel.y += sd * sqrt(99 - player.pos.y) * 0.01;
    player.vel.x *= 0.95;
    player.ticks = 0;
  } else {
    player.vel.y = 0;
    player.pos.y = 87;
    player.vel.x *= 0.9;
    player.ticks++;
  }
  color("black");
  if (
    char(addWithCharCode("a", floor(player.ticks / 15) % 2), player.pos)
      .isColliding.rect.red
  ) {
    play("explosion");
    end();
  }
  const d = player.pos.distanceTo(kite.pos);
  if (d > stringDist) {
    const a = player.pos.angleTo(kite.pos);
    player.vel.addWithAngle(a, (d - stringDist) * 0.05);
    kite.vel.addWithAngle(a + PI, (d - stringDist) * 0.01);
    kite.pos.addWithAngle(a + PI, d - stringDist);
  }
  nextWindTicks -= input.isPressed ? 3 : 1;
  while (nextWindTicks < 0) {
    winds.push({
      pos: vec(-3, rnd(0, 87)),
      vel: vec(rnd(1, 2) * sd * (input.isPressed ? 2 : 1), 0),
    });
    nextWindTicks += 30 / sd;
  }
  color("light_cyan");
  remove(winds, (w) => {
    w.pos.add(w.vel);
    const c = char("c", w.pos).isColliding.rect;
    if (c.blue) {
      play("hit");
      kite.vel.add(w.vel);
      return true;
    }
    return w.pos.x > 203;
  });
  nextCoinDist -= scr;
  if (nextCoinDist < 0) {
    coins.push({
      pos: vec(203, rnd(30, 80)),
      vel: vec(rnd(1, sd) * -0.5, 0),
    });
    nextCoinDist += rnd(199, 299);
  }
  color("black");
  remove(coins, (c) => {
    c.pos.add(c.vel);
    c.pos.x -= scr;
    const cl = char("d", c.pos).isColliding;
    if (cl.rect.red) {
      return true;
    }
    if (cl.char.a || cl.char.b) {
      play("coin");
      addScore(clamp(ceil(player.vel.x * 5), 1, 99) * 50, c.pos);
      return true;
    }
    if (cl.char.c) {
      c.pos.x++;
    }
    if (c.pos.distanceTo(player.pos) < 24) {
      c.vel.addWithAngle(c.pos.angleTo(player.pos), sd);
      c.vel.mul(0.9);
    }
    return !c.pos.isInRect(-3, -3, 210, 93);
  });
  groundX = wrap(groundX - scr, -9, 209);
  color("light_black");
  rect(0, 90, 200, 10);
  color("white");
  rect(groundX, 90, 2, 10);
}
