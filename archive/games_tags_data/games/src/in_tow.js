title = "IN TOW";

description = `
[Tap] Multiple jumps
`;

characters = [
  `
 bbbb
bbblwb
bbbbyy
  bb
bbbb
  y y
`,
  `
 bbbb
bbblwb
bbbbyy
bbbb
 bbb
 y y
`,
  `


 yy
 yyl
yyyy
 yy
 y
`,
  `
 rrr l
rrrr l
rrrr l
rrrr l
rrrr l
 rrr l
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 50,
};

/** @type {{pos: Vector, vy: number, posHistory: Vector[], isJumping: boolean}} */
let bird;
/** @type {{index: number, targetIndex: number}[]} */
let chicks;
/** @type {{pos: Vector, vy: number}[]} */
let fallingChicks;
/** @type {{pos: Vector, width: number, hasChick: boolean}[]} */
let floors;
let nextFloorDist;
/** @type {{pos: Vector, vx: number}[]} */
let bullets;
let nextBulletDist;
let isFalling;

function update() {
  if (!ticks) {
    bird = { pos: vec(64, 32), vy: 0, posHistory: [], isJumping: true };
    chicks = [];
    fallingChicks = [];
    floors = [
      { pos: vec(70, 70), width: 90, hasChick: false },
      { pos: vec(150, 50), width: 90, hasChick: true },
    ];
    nextFloorDist = 0;
    bullets = [];
    nextBulletDist = 99;
    isFalling = false;
  }
  const scr = sqrt(difficulty);
  if (bird.isJumping) {
    if (chicks.length > 0 && input.isJustPressed) {
      play("jump");
      play("hit");
      bird.vy = -2 * sqrt(difficulty);
      chicks.shift();
      fallingChicks.push({ pos: vec(bird.posHistory[2]), vy: 0 });
    }
    const pp = vec(bird.pos);
    bird.vy += (input.isPressed ? 0.05 : 0.2) * difficulty;
    bird.pos.y += bird.vy;
    const op = vec(bird.pos).sub(pp).div(9);
    color("white");
    times(9, () => {
      pp.add(op);
      box(pp, 6);
    });
  } else {
    if (input.isJustPressed) {
      play("jump");
      bird.vy = -2 * sqrt(difficulty);
      bird.isJumping = true;
    }
  }
  color("black");
  char(bird.vy < 0 ? "b" : "a", bird.pos);
  nextFloorDist -= scr;
  if (nextFloorDist < 0) {
    const width = rnd(40, 80);
    floors.push({
      pos: vec(200 + width / 2, rndi(30, 90)),
      width,
      hasChick: true,
    });
    nextFloorDist += width + rnd(10, 30);
  }
  remove(floors, (f) => {
    f.pos.x -= scr;
    color("light_yellow");
    const c = box(f.pos, f.width, 4).isColliding.rect;
    if (bird.vy > 0 && c.white) {
      bird.pos.y = f.pos.y - 5;
      bird.isJumping = false;
      bird.vy = 0;
    }
    if (f.hasChick) {
      color("black");
      const c = char("c", f.pos.x, f.pos.y - 5).isColliding.char;
      if (c.a || c.b) {
        if (chicks.length < 30) {
          chicks.push({ index: 0, targetIndex: 0 });
        }
        play("select");
        addScore(chicks.length, f.pos.x, f.pos.y - 5);
        f.hasChick = false;
      }
    }
    return f.pos.x < -f.width / 2;
  });
  bird.posHistory.forEach((p) => {
    p.x -= scr;
  });
  bird.posHistory.unshift(vec(bird.pos));
  if (bird.posHistory.length > 99) {
    bird.posHistory.pop();
  }
  color("transparent");
  if (!bird.isJumping) {
    if (!box(bird.pos.x, bird.pos.y + 4, 9, 2).isColliding.rect.light_yellow) {
      bird.isJumping = true;
    }
  }
  nextBulletDist -= scr;
  if (nextBulletDist < 0) {
    bullets.push({ pos: vec(203, rndi(10, 90)), vx: rnd(1, difficulty) * 0.3 });
    nextBulletDist += rnd(50, 80) / sqrt(difficulty);
  }
  color("black");
  remove(bullets, (b) => {
    b.pos.x -= b.vx + scr;
    const c = char("d", b.pos).isColliding.char;
    if (c.a || c.b) {
      play("explosion");
      if (chicks.length > 0) {
        isFalling = true;
        bird.vy = 3 * sqrt(difficulty);
      } else {
        end();
      }
      return true;
    }
    return b.pos.x < -3;
  });
  color("black");
  let isHit = isFalling;
  isFalling = false;
  remove(chicks, (c, i) => {
    c.targetIndex = 3 * (i + 1);
    c.index += (c.targetIndex - c.index) * 0.05;
    const p = bird.posHistory[floor(c.index)];
    const cl = char("c", p).isColliding;
    if (cl.char.d) {
      play("powerUp");
      isHit = true;
    }
    if (isHit) {
      fallingChicks.push({ pos: vec(p), vy: 0 });
      return true;
    }
  });
  remove(fallingChicks, (f) => {
    f.vy += 0.3 * difficulty;
    f.pos.y += f.vy;
    char("c", f.pos, { mirror: { y: -1 } });
    return f.pos.y > 103;
  });
  color("black");
  char(bird.vy < 0 ? "b" : "a", bird.pos);
  if (bird.pos.y > 99) {
    play("explosion");
    end();
  }
}
