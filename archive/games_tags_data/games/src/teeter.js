title = "TEETER";

description = `
[Tap]
 Change angle
`;

characters = [
  `
 llll
l llll
llllll
llllll
llllll
 llll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 60,
};

/** @type {{pos: Vector, angle: number, width: number}[]} */
let bars;
let barAngleSign;
/** @type {Vector}} */
let ballTargetPos;
/** @type {Vector}} */
let ballPos;
/** @type {{pos: Vector, width: number, score: number, barCount: number}[]} */
let floors;

function update() {
  if (!ticks) {
    bars = [];
    times(7, () => {
      addBar();
    });
    barAngleSign = 1;
    ballTargetPos = ballPos = undefined;
    floors = [];
  }
  if (ballTargetPos == null) {
    play("laser");
    let x;
    for (let i = 0; i < 99; i++) {
      x = rnd(20, 80);
      let isOnBar = false;
      bars.forEach((b) => {
        if (abs(b.pos.x - x) < (b.width / 2) * cos(b.angle)) {
          isOnBar = true;
        }
      });
      if (isOnBar) {
        break;
      }
    }
    ballTargetPos = vec(x, -4);
    ballPos = vec(ballTargetPos);
    floors = [];
    let fw = 0;
    while (fw < 100) {
      const width = rnd(20, 30);
      floors.push({
        pos: vec(fw + width / 2, 95),
        width,
        score: floor(rnd(1, 3.1) * rnd(1, 3.1)),
        barCount: 0,
      });
      fw += width;
    }
    let fi = rndi(floors.length);
    floors[fi].score = 0;
    floors[fi].barCount = floor(rnd(1, 2.2) * rnd(1, 2.2));
    fi = rndi(floors.length);
    floors[fi].score = 0;
    floors[fi].barCount = -floor(rnd(1, 2.2) * rnd(1, 2.2));
    floors.forEach((f) => {
      f.pos.x -= (fw - 100) / 2;
    });
  }
  ballTargetPos.y += difficulty * 0.5;
  ballPos.add(vec(ballTargetPos).sub(ballPos).mul(0.5));
  color("black");
  char("a", ballPos);
  if (input.isJustPressed) {
    play("select");
    barAngleSign *= -1;
  }
  bars.forEach((b) => {
    const a = b.angle * barAngleSign;
    if (bar(b.pos, b.width, 3, a).isColliding.char.a) {
      play("hit");
      ballTargetPos.set(
        vec(b.pos).addWithAngle(a, (b.width / 2 + 7) * (a > 0 ? 1 : -1))
      );
    }
  });
  let barCountDiff = 0;
  remove(floors, (f) => {
    let t, c;
    if (f.score > 0) {
      t = `${f.score}`;
      c = f.score < 5 ? "light_black" : "black";
    } else if (f.barCount < 0) {
      t = `${f.barCount}`;
      c = "red";
    } else {
      t = `+${f.barCount}`;
      c = "blue";
    }
    // @ts-ignore
    color(c);
    if (box(f.pos, f.width - 1, 10).isColliding.char.a) {
      particle(f.pos);
      if (f.score > 0) {
        play("coin");
        addScore(f.score, f.pos);
        f.score++;
      } else {
        barCountDiff += f.barCount;
      }
      return true;
    }
    color("white");
    text(
      t,
      clamp(f.pos.x - (t.length - 1) * 3, 3, 97 - (t.length - 1) * 6),
      f.pos.y
    );
    return f.pos.x > 99 + f.width / 2;
  });
  if (barCountDiff > 0) {
    let sc = 0;
    times(barCountDiff, () => {
      play("powerUp");
      if (!addBar()) {
        sc++;
      }
    });
    if (sc > 0) {
      addScore(sc, ballPos);
    }
  } else if (barCountDiff < 0) {
    play("explosion");
    color("black");
    for (let i = 0; i < -barCountDiff; i++) {
      const bi = rndi(bars.length);
      particle(bars[bi].pos);
      bars.splice(bi, 1);
      if (bars.length === 0) {
        break;
      }
    }
  }
  if (ballPos.y > 99) {
    if (bars.length === 0) {
      play("lucky");
      end();
    }
    ballTargetPos = undefined;
  }

  function addBar() {
    color("white");
    bars.forEach((b) => {
      bar(b.pos, b.width + 5, 6, b.angle);
      bar(b.pos, b.width + 5, 6, -b.angle);
    });
    let b;
    color("transparent");
    let isPlaced = false;
    for (let i = 0; i < 99; i++) {
      const width = rnd(12, 18);
      const angle = rnds(0.2, 0.8);
      const aw = width * cos(angle);
      const pos = vec(rnd(5 + aw / 2, 95 - aw / 2), rnd(20, 70));
      const c1 = bar(pos, width + 5, 6, angle).isColliding.rect.white;
      const c2 = bar(pos, width + 5, 6, -angle).isColliding.rect.white;
      if (!c1 && !c2) {
        bars.push({ pos, angle, width });
        isPlaced = true;
        break;
      }
    }
    return isPlaced;
  }
}
