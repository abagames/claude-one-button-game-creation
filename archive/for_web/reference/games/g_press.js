title = "G PRESS";

description = `
[Tap] Press
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

/** @type {{y: number, vy: number, width: number, vw: number}} */
let press;
/** @type {{pos: Vector, vel: Vector, size: number}[]} */
let bubbles;
let nextBubbleTicks;
/** @type {{pos: Vector, vel: Vector}[]} */
let drops;
let dropTicks;
let waterY;
let prevWaterY;
let targetWaterY;
const dropSize = 3;
const pressHeight = 20;

function update() {
  if (!ticks) {
    press = { y: 30, vy: 1, width: 80, vw: 0 };
    bubbles = [];
    nextBubbleTicks = 0;
    drops = [];
    dropTicks = 0;
    waterY = prevWaterY = targetWaterY = 70;
  }
  if (press.vw !== 0) {
    press.width += press.vw * 5 * sqrt(difficulty);
    if (press.width < 0) {
      play("explosion");
      press.width = 0;
      press.vw = 0.5;
    }
    if (press.width > 80) {
      press.width = 80;
      press.vw = 0;
    }
  } else {
    press.y += press.vy * sqrt(difficulty);
    if (
      (press.y < pressHeight / 2 && press.vy < 0) ||
      (press.y > waterY - pressHeight / 2 && press.vy > 0)
    ) {
      press.vy *= -1;
    }
    if (input.isJustPressed) {
      play("select");
      prevWaterY = targetWaterY = waterY + 12;
      press.vw = -1;
    }
  }
  color(press.vw < 0 || press.width === 0 ? "red" : "black");
  rect(50 - press.width / 2, press.y - pressHeight / 2, -5, pressHeight);
  rect(50 + press.width / 2, press.y - pressHeight / 2, 5, pressHeight);
  if (press.vw < 0 || press.width === 0) {
    color("purple");
    rect(1, press.y, 1, 99);
    rect(1, press.y, 44 - press.width / 2, 1);
    rect(98, press.y, 1, 99);
    rect(98, press.y, -(44 - press.width / 2), 1);
  }
  color("black");
  rect(0, press.y - 1, 1, 99);
  rect(2, press.y + 1, 1, 99);
  rect(0, press.y - 1, 45 - press.width / 2, 1);
  rect(2, press.y + 1, 43 - press.width / 2, 1);
  rect(99, press.y - 1, 1, 99);
  rect(97, press.y + 1, 1, 99);
  rect(99, press.y - 1, -(45 - press.width / 2), 1);
  rect(97, press.y + 1, -(43 - press.width / 2), 1);
  nextBubbleTicks--;
  if (nextBubbleTicks < 0) {
    const size = rnd(5, 9);
    bubbles.push({
      pos: vec(rnd(20 + size, 80 - size), waterY + size / 2),
      vel: vec(0, (-rnd(1, 2) / size) * difficulty),
      size,
    });
    targetWaterY += size * 0.03;
    nextBubbleTicks += rnd(10, 50) / difficulty;
  }
  color("purple");
  remove(bubbles, (b) => {
    b.pos.add(b.vel);
    if (box(b.pos, b.size).isColliding.rect.red) {
      if (b.size > press.width) {
        play("hit");
        times(ceil(b.size), () => {
          drops.push({
            pos: vec(b.pos.x + rnds(b.size / 2), b.pos.y + rnds(b.size / 2)),
            vel: vec(),
          });
        });
        return true;
      } else {
        b.pos.x =
          b.pos.x < 50
            ? 50 - press.width / 2 + b.size / 2
            : 50 + press.width / 2 - b.size / 2;
      }
    }
    return b.pos.y < -b.size / 2;
  });
  color("light_purple");
  remove(drops, (d) => {
    d.vel.y += difficulty * 0.1;
    d.pos.add(d.vel);
    box(d.pos, 2);
    if (d.pos.y > waterY + 1) {
      dropTicks = 9 / difficulty;
      play("laser");
      targetWaterY -= 0.35;
      return true;
    }
  });
  if (dropTicks > 0) {
    dropTicks--;
    if (dropTicks <= 0) {
      if (prevWaterY > targetWaterY) {
        play("coin");
        const s = prevWaterY - targetWaterY;
        addScore(ceil(s * sqrt(s)), 50, waterY);
      }
    }
  }
  if (targetWaterY < 50) {
    targetWaterY += (50 - targetWaterY) * 0.05;
  }
  waterY += (targetWaterY - waterY) * 0.2;
  color("purple");
  rect(0, waterY, 100, 101 - waterY);
  if (
    press.vw === 0 &&
    drops.length === 0 &&
    waterY >= 100 &&
    targetWaterY >= 100
  ) {
    play("lucky");
    end();
  }
}
