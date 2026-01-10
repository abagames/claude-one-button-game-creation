title = "HEXMIN";

description = `
[Tap] Roll
`;

characters = [];

options = {
  theme: "shape",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 70,
};

/** @type {{value: number}[]} */
let lanes;
let laneChangeTicks;
let nextLaneAddingCount;
let arrowAngle;
let multiplier;
const ss = [4, 6, 8, 10, 10, 10];
const rs = [49, 42, 33, 22, 11];

function update() {
  if (!ticks) {
    lanes = times(6, () => {
      return { value: 0 };
    });
    laneChangeTicks = 0;
    nextLaneAddingCount = 0;
    arrowAngle = 0;
    multiplier = 1;
  }
  if (input.isJustPressed) {
    play("laser");
    arrowAngle = wrap(arrowAngle + 1, 0, 6);
    multiplier = ceil(multiplier * 0.9) - 1;
    if (multiplier < 1) {
      multiplier = 1;
    }
  }
  const p = vec();
  for (let i = 0; i < 6; i++) {
    const oa = wrap(i - arrowAngle, 0, 6);
    p.set(50, 50).addWithAngle((i * PI) / 3, rs[4]);
    color(oa === 0 || oa === 2 ? "red" : "light_black");
    drawHex(p, ss[4] / 2);
  }
  laneChangeTicks--;
  if (laneChangeTicks < 0) {
    for (let i = 0; i < 6; i++) {
      let l = lanes[i];
      if (l.value > 0) {
        play("hit");
        l.value++;
        if (l.value > 4) {
          play("explosion");
          end();
        }
      }
    }
    nextLaneAddingCount--;
    if (nextLaneAddingCount < 0) {
      let li = rndi(6);
      for (let i = 0; i < 6; i++) {
        const l = lanes[li];
        if (l.value === 0) {
          l.value = 1;
          break;
        }
        li = wrap(li + 1, 0, 6);
      }
      nextLaneAddingCount = floor(rnd(1 + 3 / difficulty));
    }
    laneChangeTicks += 30 / sqrt(difficulty);
  }
  lanes.forEach((l, j) => {
    for (let i = 0; i < 5; i++) {
      if (l.value <= i) {
        break;
      }
      p.set(50, 50).addWithAngle((j * PI) / 3, rs[i]);
      color(i < 3 ? "green" : "blue");
      drawHex(p, ss[i] / 2);
    }
    if (l.value === 4) {
      const oa = wrap(j - arrowAngle, 0, 6);
      if (oa === 0 || oa === 2) {
        play("coin");
        addScore(multiplier, 50, 50);
        multiplier += 6;
        l.value = 0;
      }
    }
  });
  color("black");
  text(`x${multiplier}`, 3, 9);

  function drawHex(cp, s) {
    const p1 = vec();
    const p2 = vec();
    p1.set(cp).addWithAngle((5.5 * PI) / 3, s);
    for (let i = 0; i < 6; i++) {
      p2.set(p1);
      p1.set(cp).addWithAngle(((i + 0.5) * PI) / 3, s);
      line(p1, p2, 2);
    }
  }
}
