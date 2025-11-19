title = "WIPER";

description = `
[Tap] Swing
`;

characters = [];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 8,
};

/** @type {{pos: Vector, size: number}[]} */
let rains;
let nextRainTicks;
let wiperAngle;
let wiperVa;

function update() {
  if (!ticks) {
    rains = [];
    nextRainTicks = 0;
    wiperAngle = (-PI / 5) * 4;
    wiperVa = 1;
  }
  wiperAngle += wiperVa * 0.05 * sqrt(difficulty);
  if (
    (wiperAngle > -PI / 5 && wiperVa > 0) ||
    (wiperAngle < (-PI / 5) * 4 && wiperVa < 0)
  ) {
    play("hit");
    wiperVa *= -1;
  }
  let ta = wiperVa > 0 ? -PI / 5 : (-PI / 5) * 4;
  if (wiperAngle > -PI / 3) {
    ta = (-PI / 5) * 4;
  }
  if (wiperAngle < (-PI / 3) * 2) {
    ta = -PI / 5;
  }
  color("light_black");
  bar(50, 110, 36, 2, ta, -0.7);
  if (input.isJustPressed) {
    play("select");
    wiperAngle = ta;
    wiperVa *= -1;
  }
  color("black");
  bar(50, 110, 36, 6, wiperAngle, -0.7);
  nextRainTicks--;
  if (nextRainTicks < 0) {
    rains.push({ pos: vec(rnd(10, 90), rnd(20)), size: 2 });
    nextRainTicks = 10 / difficulty;
  }
  remove(rains, (r) => {
    color("transparent");
    let isRemoved = box(r.pos, sqrt(r.size) * 2).isColliding.rect.black;
    let isAbsorbed = false;
    rains.forEach((or) => {
      if (
        r.pos.y > or.pos.y &&
        r.pos.distanceTo(or.pos) < sqrt(r.size + or.size) * 2
      ) {
        or.size += r.size;
        or.pos.x = (or.pos.x + r.pos.x) / 2;
        isAbsorbed = true;
      }
    });
    if (isAbsorbed) {
      play("laser");
      return true;
    }
    r.pos.y += sqrt(r.size - 1.9) * 0.3 * sqrt(difficulty);
    color("cyan");
    if (isRemoved || box(r.pos, sqrt(r.size)).isColliding.rect.black) {
      play("powerUp");
      addScore(ceil(r.size - 1), r.pos);
      return true;
    }
    if (r.pos.y > 99) {
      play("explosion");
      color("red");
      text("X", r.pos.x, 97);
      end();
    }
  });
}
