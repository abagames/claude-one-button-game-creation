title = "CLEANER";

description = `
[Hold] Sweep
`;

options = {
  theme: "dark",
  viewSize: { x: 100, y: 150 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 8,
};

// Define variables for game objects
/** @type {{position: Vector}} */
let cleanerHead;
/** @type {{position: Vector,  length: number}} */
let cleaner;

/** @type {{position: Vector, size: Vector, angle: number}[]} */
let dusts;
let nextDustDist;

/** @type {{position: Vector, size: number}[]} */
let holes;
let nextHoleDist;

let multiplier;

function update() {
  if (!ticks) {
    cleanerHead = { position: vec(50, 130) };
    cleaner = { position: vec(50, 130), length: 0 };
    dusts = [];
    holes = [];
    nextHoleDist = 99;
    nextDustDist = 0;
    multiplier = 1;
  }

  const sd = sqrt(difficulty);
  const scrollSpeed = sd;
  cleanerHead.position
    .set(cleaner.position)
    .addWithAngle(sin(ticks * 0.1 * sd) - PI / 2, cleaner.length);
  if (input.isJustPressed) {
    play("laser");
    multiplier = 1;
  }
  if (input.isJustReleased) {
    play("click");
  }
  if (input.isPressed) {
    cleaner.length += (150 - cleaner.length) * 0.005 * difficulty;
  } else {
    cleaner.position.x +=
      (cleanerHead.position.x - cleaner.position.x) *
      0.005 *
      cleaner.length *
      sd;
    cleaner.length *= 1 - 0.1 * sd;
  }
  cleaner.position.x = clamp(cleaner.position.x, 0, 100);
  color("light_cyan");
  line(cleanerHead.position, cleaner.position, 7);
  color("cyan");
  box(cleanerHead.position, 15, 10);

  nextDustDist -= scrollSpeed;
  if (nextDustDist < 0) {
    dusts.push({
      position: vec(rnd(10, 90), -20),
      size: vec(rnd(3, 9), rnd(3, 9)),
      angle: rnd(0, PI * 2),
    });
    nextDustDist = rnd(10, 20) / sd;
  }
  color("light_black");
  remove(dusts, (d) => {
    d.position.y += scrollSpeed;
    const c = bar(d.position, d.size.x, d.size.y, d.angle).isColliding.rect;
    if (c.cyan || c.light_cyan) {
      play("coin");
      particle(d.position);
      addScore(multiplier, d.position);
      multiplier++;
      return true;
    }
    return d.position.y > 170;
  });

  nextHoleDist -= scrollSpeed;
  if (nextHoleDist < 0) {
    holes.push({
      position: vec(rnd(100), -20),
      size: rnd(5, 12),
    });
    nextHoleDist = rnd(99, 120);
  }
  remove(holes, (h) => {
    h.position.y += scrollSpeed;
    color("red");
    arc(h.position, h.size, 3);
    return h.position.y > 170;
  });
  color("blue");
  if (
    arc(cleaner.position.x, cleaner.position.y + 9, 3, 5).isColliding.rect.red
  ) {
    play("explosion");
    end();
  }
}
