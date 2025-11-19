title = "DANGO";

description = `
[Tap] Stretch
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 4,
};

/**
 * @type {{
 * x: number, angle: number, angleVel: number, radius: number, height: number,
 * exp: string, isSticked: boolean
 * }[]}
 */
let dangos;
let nextDangoX;
let stickTicks;
let stickLeft;
let stickAdd;
let expStr;
let expAdd;
let offsetX;

function update() {
  if (!ticks) {
    dangos = [];
    nextDangoX = 0;
    stickTicks = 0;
    stickLeft = 9;
    expStr = "";
    expAdd = 0;
    offsetX = 0;
  }
  const sd = sqrt(difficulty);
  const dangoWidth = 12;
  if (stickTicks === 0 && input.isJustPressed) {
    play("laser");
    stickTicks = 1;
    expStr = "";
    stickAdd = 0;
    stickLeft--;
  }
  if (stickTicks > 0) {
    stickTicks += sd;
    color(stickTicks < 10 ? "blue" : "light_blue");
    const x =
      stickTicks < 10 ? 80 - stickTicks * 10 : 80 - (10 - stickTicks) * 10;
    rect(x, 75, 120, 2);
    if (stickTicks > 19) {
      stickTicks = 0;
      if (expStr.startsWith("+")) {
        expStr = expStr.substring(1);
      } else if (expStr.startsWith("*")) {
        expStr = `0${expStr}`;
      }
      expAdd = expStr.length === 0 ? 0 : Function(`return ${expStr};`)();
      addScore(expAdd);
      const sl = stickLeft;
      stickLeft = clamp(stickLeft + floor(expAdd / 100), -1, 9);
      stickAdd = stickLeft - sl;
      if (stickAdd > 0) {
        play("powerUp");
      } else if (expAdd > 0) {
        play("coin");
      }
    }
    offsetX *= 0.1;
  } else if (stickLeft >= 0) {
    color("cyan");
    rect(90, 75, 120, 2);
  } else {
    end();
  }
  if (stickLeft > 0) {
    color("blue");
    times(stickLeft, (i) => {
      rect(92, 70 - i * 3, 8, 1);
    });
  }
  if (stickAdd > 0) {
    text(`+${stickAdd}`, 90, 30);
  }
  offsetX += 0.002 * sqrt(difficulty);
  let targetX = 80;
  remove(dangos, (d) => {
    if (d.isSticked) {
      if (stickTicks > 10) {
        d.x += 20 * sqrt(difficulty);
      }
      if (d.x > 99) {
        nextDangoX -= dangoWidth;
        expStr = d.exp + expStr;
        return true;
      }
    } else {
      d.x += (targetX - d.x) * 0.1;
      d.angle += d.angleVel;
    }
    const x = d.x + offsetX;
    const y = 50 + sin(d.angle) * d.radius;
    color("black");
    const c = box(x, y, 13, d.height).isColliding.rect;
    if (c.blue) {
      play("hit");
      d.isSticked = true;
    } else if (c.cyan) {
      play("explosion");
      end();
    }
    color("white");
    box(x, y, 11, d.height - 2);
    color("black");
    text(d.exp, x - 3.5, y);
    targetX -= dangoWidth;
  });
  while (targetX > dangoWidth / 2) {
    dangos.push({
      x: -dangoWidth / 2,
      angle: rnd(PI * 2),
      angleVel: rnds(0.02, 0.05) * sd,
      radius: 30,
      height: rnd(15, 30),
      exp: `${rnd() < 0.5 ? "+" : "*"}${rndi(2, 10)}`,
      isSticked: false,
    });
    targetX -= dangoWidth;
  }
  color("black");
  text(expStr, 3, 96);
  if (expAdd > 0) {
    const ea = `+${expAdd}`;
    text(ea, 102 - ea.length * 6, 90);
  }
}
