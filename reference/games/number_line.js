title = "NUMBER LINE";

description = `
[Tap] Sum
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 60,
};

/** @type {{value: number, x: number, vx: number, line: any, isSummed: boolean}[]} */
let numbers;
/** @type {{nextTicks: number, line: any}[]} */
let nextNumbers;
/** @type {{y: number, ty: number, index: number}[]} */
let lines;
let summedTicks;

function update() {
  if (!ticks) {
    lines = [
      { y: 12, ty: 12, index: 0 },
      { y: 94, ty: 94, index: 1 },
    ];
    numbers = [];
    nextNumbers = times(2, (i) => {
      return {
        nextTicks: 0,
        line: lines[i],
      };
    });
    summedTicks = -1;
  }
  lines.forEach((l) => {
    l.ty += (1 - l.index * 2) * difficulty * 0.01;
    l.y += (l.ty - l.y) * 0.2;
    if (l.index === 0 && l.y < 12) {
      play("coin");
      l.ty++;
      addScore(1);
    }
    if (l.index === 1 && l.y > 94) {
      l.ty--;
    }
    color(l.index === 0 ? "blue" : "red");
    rect(0, l.y, 100, 1);
  });
  if (lines[0].y >= lines[1].y) {
    play("lucky");
    end();
  }
  if (summedTicks < 0) {
    if (input.isJustPressed) {
      play("select");
      numbers.forEach((n) => {
        if (n.x > 3 && n.x < 97) {
          n.isSummed = true;
        }
      });
      summedTicks = 0;
    }
  } else {
    summedTicks++;
  }
  nextNumbers.forEach((nn) => {
    nn.nextTicks--;
    if (nn.nextTicks < 0) {
      numbers.push({
        value: rndi(1, 10),
        x: -3,
        vx: rnd(1, difficulty) * 0.7,
        line: nn.line,
        isSummed: false,
      });
      nn.nextTicks = rnd(10, 30) / difficulty;
    }
  });
  let sums = [0, 0];
  remove(numbers, (n) => {
    const l = n.line;
    if (n.isSummed) {
      if (summedTicks < 0) {
        return true;
      }
      for (let i = 0; i < numbers.length; i++) {
        const an = numbers[i];
        if (an === n) {
          break;
        }
        if (an.isSummed && an.line === n.line && abs(an.x - n.x) < 6) {
          an.value += n.value;
          return true;
        }
      }
      n.x += (50 - n.x) * 0.1;
      const x = l.index === 0 ? n.x : 100 - n.x;
      const y =
        l.y +
        l.index * 8 -
        4 +
        (summedTicks + (summedTicks > 0 ? 10 : 0)) *
          (1 - l.index * 2) *
          0.2 *
          sqrt(difficulty);
      color("black");
      text(`${n.value}`, x - (n.value > 9 ? 3 : 0), y);
      sums[l.index] = n.value;
      return;
    }
    n.x += n.vx;
    const x = l.index === 0 ? n.x : 100 - n.x;
    const y = l.y + l.index * 6 - 3;
    color(
      // @ts-ignore
      ["blue", "cyan", "green", "purple", "red"][floor((n.value - 1) / 2)]
    );
    text(`${n.value}`, x, y);
    return n.x > 103;
  });
  if (summedTicks > 60 / sqrt(difficulty)) {
    summedTicks = -1;
    let s = sums[0] - sums[1];
    if (s > 0) {
      play("powerUp");
    } else if (s < 0) {
      play("explosion");
    }
    addScore(s, 50, 50);
    lines[0].ty -= s * sqrt(difficulty);
    lines[1].ty += s * sqrt(difficulty);
  }
}
