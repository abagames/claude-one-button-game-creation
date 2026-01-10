title = "BS FISH";

description = `
[Hold] Speed up
`;

characters = [
  `
  rrr 
rrbrrr
 rrr r
`,
  `
 ll
  ll
llllly

`,
  `

llllly
  ll
 ll
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 4,
};

/** @type {{pos: Vector, vx: number, ticks: number}} */
let bird;
/**
 * @type {{
 * pos: Vector, vel: Vector, type: "normal" | "eye" | "big" | "fake"
 * }[]}
 */
let fishes;
let nextFishTicks;
let nextBigFishCount;
let scrX;
let multiplier;

function update() {
  if (!ticks) {
    bird = { pos: vec(20, 20), vx: 1, ticks: 0 };
    fishes = [];
    nextFishTicks = 0;
    nextBigFishCount = 3;
    scrX = 0;
    multiplier = 1;
  }
  if (input.isJustPressed) {
    play("select");
  }
  const scr = bird.pos.x > 30 ? (bird.pos.x - 30) * 0.1 * sqrt(difficulty) : 0;
  bird.vx += ((input.isPressed ? 3 * sqrt(difficulty) : 0.1) - bird.vx) * 0.2;
  bird.ticks += bird.vx;
  bird.pos.x += bird.vx - scr;
  color("black");
  char(addWithCharCode("b", floor(bird.ticks / 10) % 2), bird.pos);
  nextFishTicks--;
  if (nextFishTicks < 0) {
    const pos = vec(rnd(130, 220), 120);
    const vel = vec(
      -rnd(1, 1.5) * 0.5 * sqrt(difficulty),
      -2.5 * sqrt(difficulty)
    );
    let type = "normal";
    nextBigFishCount--;
    if (nextBigFishCount < 0) {
      type = rnd() < 0.5 ? "big" : "fake";
      nextBigFishCount = rnd(3, 9);
    }
    if (type === "big") {
      if (rnd() < 0.7) {
        vel.y *= 1.125;
        vel.x *= 0.9;
      } else {
        vel.y *= 0.97;
        vel.x *= 1.5;
      }
    }
    // @ts-ignore
    fishes.push({ pos, vel, type });
    nextFishTicks = rnd(40, 60) / difficulty;
  }
  remove(fishes, (f) => {
    const pp = vec(f.pos);
    f.vel.y += 0.03 * difficulty;
    f.pos.add(f.vel);
    f.pos.x -= scr;
    color("black");
    const sc = f.type === "big" || f.type === "fake" ? 6 : 1;
    const wy = 50 + 2 * sc;
    if (f.pos.y > wy) {
      color("blue");
    } else {
      if (f.type === "fake") {
        const eye = [2, 1];
        [
          [2, 0],
          [3, 0],
          [4, 0],
          [0, 1],
          [1, 1],
          [2, 1],
          [3, 1],
          [4, 1],
          [5, 1],
          [1, 2],
          [2, 2],
          [3, 2],
          [5, 2],
        ].forEach((p) => {
          const x = p[0];
          const y = p[1];
          fishes.push({
            pos: vec(f.pos.x + x * 6 - 15, f.pos.y + y * 6 - 6),
            vel: vec(f.vel),
            type: x == eye[0] && y === eye[1] ? "eye" : "normal",
          });
        });
        return true;
      }
      if (f.type === "big") {
        color("white");
        line(f.pos.x, f.pos.y - 3, f.pos.x - 10, f.pos.y);
        line(f.pos.x, f.pos.y - 5, f.pos.x + 16, f.pos.y);
        line(f.pos.x, f.pos.y + 5, f.pos.x - 16, f.pos.y);
        line(f.pos.x, f.pos.y + 5, f.pos.x + 16, f.pos.y);
      }
      color(f.type === "eye" ? "blue" : "black");
    }
    char("a", f.pos, { scale: { x: sc, y: sc } });
    if (f.type !== "big" && f.pos.distanceTo(bird.pos) < 6) {
      addScore(multiplier, f.pos);
      if (f.type === "normal") {
        play("coin");
        multiplier++;
      } else {
        play("powerUp");
        multiplier += 10;
      }
      return true;
    }
    if (f.pos.x < -18 || f.pos.y > 120) {
      if (f.type !== "big" && multiplier > 1) {
        multiplier--;
      }
      return true;
    }
    if ((pp.y - wy) * (f.pos.y - wy) < 0) {
      play("hit");
    }
  });
  color("transparent");
  if (
    char(addWithCharCode("b", floor(bird.ticks / 10) % 2), bird.pos).isColliding
      .rect.white
  ) {
    play("explosion");
    end();
  }
  scrX = wrap(scrX - scr, -10, 210);
  color("blue");
  rect(0, 50, 200, 2);
  color("cyan");
  times(5, (i) => {
    rect(wrap(scrX + (220 / 5) * i, -10, 210), 50, 9, 2);
  });
  color("black");
  text(`x${multiplier}`, 3, 9);
}
