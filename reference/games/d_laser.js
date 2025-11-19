title = "D LASER";

description = `
[Tap]  Turn
[Hold] Stop
`;

characters = [
  `
 ll
ll
 l
 ll
l
`,
  `
 ll
ll
 l
ll
  l
`,
  `
l l l
 lll
  l
 l l
l   l
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

/** @type {{pos: Vector, isHit: boolean}[]} */
let lasers;
let laserCount;
let lcv;
let lcVv;
/** @type {{pos: Vector, tx: number}[]} */
let shields;
let nextShieldDist;
/** @type {{pos: Vector, vx: -1 | 1, ticks: number, dist: number}} */
let player;
let scrY;
const laserFireY = 10;

function update() {
  if (!ticks) {
    lasers = [];
    laserCount = 0;
    lcv = 0;
    lcVv = 0;
    shields = [];
    nextShieldDist = 0;
    scrY = 80;
    player = { pos: vec(50, 90), vx: 1, ticks: 0, dist: 0 };
  }
  const scr =
    sqrt(difficulty) * 0.05 +
    (player.pos.y < scrY ? (scrY - player.pos.y) * 0.1 : 0);
  scrY += (80 - scrY) * 0.001;
  nextShieldDist -= scr;
  if (nextShieldDist < 0) {
    play("hit");
    const tx = rndi(10) * 10 + 5;
    shields.push({ pos: vec(tx < 50 ? 0 : 99, 15), tx });
    nextShieldDist += rnd(9, 36);
  }
  remove(shields, (s) => {
    s.pos.y += scr;
    if (abs(s.pos.x - s.tx) < 1) {
      s.pos.x = s.tx;
      color("blue");
    } else {
      s.pos.x += (s.tx - s.pos.x) * 0.2;
      color("light_blue");
    }
    box(s.pos, 8, 4);
    color("black");
    char("c", s.pos.x, s.pos.y + 4);
    return s.pos.y > 99;
  });
  if (laserCount > 10) {
    laserCount += sqrt(difficulty) * 9;
    if (lasers.length === 0) {
      play("powerUp");
      lasers = times(10, (i) => {
        return { pos: vec(i * 10, 10), isHit: false };
      });
    }
    play("laser");
    if (laserCount > 199) {
      play("coin");
      addScore(
        ceil(player.dist * sqrt(player.dist) * sqrt(difficulty) * 0.1),
        player.pos
      );
      resetLaser();
    }
  } else {
    lcVv += rnds(sqrt(difficulty)) * 0.0001;
    lcv += lcVv;
    if ((lcv < 0 && lcVv < 0) || (lcv > sqrt(difficulty) * 0.2 && lcVv > 0)) {
      lcVv = -lcVv;
      lcv *= rnd(0.2, 1.5);
    }
    laserCount += lcv;
  }
  color("light_red");
  rect(0, 9, 100, 1);
  color("red");
  rect(0, 0, 100, laserCount < 10 ? laserCount : 10);
  lasers.forEach((l) => {
    if (l.isHit) {
      l.pos.y += scr;
    } else {
      l.pos.y += sqrt(difficulty) * 9;
      color("transparent");
      if (rect(l.pos.x, 10, 10, l.pos.y).isColliding.rect.blue) {
        l.isHit = true;
        for (let i = 0; i < 99; i++) {
          l.pos.y--;
          if (!rect(l.pos.x, 10, 10, l.pos.y).isColliding.rect.blue) {
            break;
          }
        }
      }
    }
    color("red");
    rect(l.pos.x, 10, 10, l.pos.y);
  });
  if (input.isJustPressed) {
    play("select");
    player.vx *= -1;
  }
  player.pos.y += scr;
  if (!input.isPressed) {
    player.pos.x += player.vx * sqrt(difficulty);
    if (
      (player.pos.x < 0 && player.vx < 0) ||
      (player.pos.x > 99 && player.vx > 0)
    ) {
      player.vx *= -1;
    }
    player.pos.x = clamp(player.pos.x, 0, 99);
    player.pos.y -= sqrt(difficulty) * 0.5;
    player.dist += sqrt(difficulty) * 0.5;
    player.ticks += sqrt(difficulty);
  }
  if (player.pos.y > 99) {
    play("lucky");
    end();
  }
  color("black");
  if (
    char(addWithCharCode("a", floor(player.ticks / 20) % 2), player.pos, {
      mirror: { x: player.vx },
    }).isColliding.rect.red
  ) {
    particle(player.pos, 30, 3);
    scrY += 7;
    player.pos.y += 7;
    play("explosion");
    resetLaser();
  }

  function resetLaser() {
    lasers = [];
    laserCount = 0;
    lcv *= rnd();
    lcVv *= rnd();
    player.dist = 0;
  }
}
