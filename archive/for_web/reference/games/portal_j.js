title = "PORTAL J";

description = `
[Tap] Portal jump
`;

characters = [];

options = {
  viewSize: { x: 200, y: 50 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 6,
};

let playerX;
let portalTicks;
let fallTicks;
let portalX;
/** @type {{x: number, vx: number, width: number}[]} */
let floors;
let backX;
let nextFloorDist;
/** @type {{x: number}[]} */
let golds;
let nextGoldDist;
let multiplier;
let nextScore;

function update() {
  if (!ticks) {
    playerX = 30;
    portalTicks = 0;
    fallTicks = 0;
    portalX = 36;
    backX = 0;
    floors = [
      { x: 0, vx: 0, width: 100 },
      { x: 110, vx: 0, width: 80 },
    ];
    nextFloorDist = 0;
    golds = [];
    nextGoldDist = 30;
    multiplier = 1;
    nextScore = 0;
  }
  const scrX = (playerX > 30 ? (playerX - 30) * 0.1 : 0) + difficulty * 0.1;
  color("light_black");
  backX = wrap(backX - scrX, 0, 200);
  times(2, (i) => {
    rect(wrap(backX + i * 50, 0, 200), 0, 1, 50);
  });
  nextFloorDist -= scrX;
  if (nextFloorDist < 0) {
    const itv = rnd(50, 99);
    const fr = rnd(0.4, 0.7);
    const vx = rnd() > 1 / difficulty ? rnds(1, difficulty) * 0.25 : 0;
    floors.push({
      x: 200 + nextFloorDist + itv * rnd(1 - fr),
      vx,
      width: itv * fr,
    });
    nextFloorDist += itv;
  }
  color("green");
  remove(floors, (f) => {
    f.x += f.vx - scrX;
    floors.forEach((af) => {
      if (af.x >= f.x) {
        return;
      }
      if (af.x + af.width >= f.x) {
        f.vx *= -1;
        af.vx *= -1;
        f.x += f.vx * 2;
      }
    });
    rect(f.x, 40, f.width, 8);
    return f.x + f.width < 0;
  });
  playerX -= scrX;
  portalX -= scrX;
  let py = 39;
  if (fallTicks > 0) {
    fallTicks += difficulty * 0.2;
    py += fallTicks;
  }
  if (portalTicks > 0) {
    portalTicks += difficulty;
    if (portalTicks < 5) {
      py += portalTicks;
    } else {
      if (playerX < portalX) {
        play("laser");
        nextScore = portalX - playerX;
        nextScore = ceil(nextScore * sqrt(nextScore) * 0.1 * multiplier);
        playerX = portalX;
      }
      py = 42 - (portalTicks - 5);
      if (py < 39) {
        play("powerUp");
        addScore(nextScore, playerX, 36);
        py = 39;
        portalTicks = 0;
      }
    }
  } else {
    portalX += difficulty * 2;
    if (portalX > 200) {
      portalX = playerX + 6;
    }
    if (input.isJustPressed) {
      play("hit");
      portalTicks = 1;
    }
  }
  color("red");
  const c = box(playerX, py, 5).isColliding.rect;
  color("purple");
  box(portalX, 43, 7, 5);
  if (portalTicks > 0 && portalTicks < 5) {
    box(playerX, 43 + fallTicks, 7, 5);
  }
  if (portalTicks === 0) {
    if (c.green) {
      fallTicks = 0;
    } else if (fallTicks === 0) {
      fallTicks = 1;
    }
  }
  if (py > 52 || playerX < 0) {
    play("explosion");
    end();
  }
  nextGoldDist -= scrX;
  if (nextGoldDist < 0) {
    golds.push({ x: 203 });
    nextGoldDist += rnd(99, 120);
  }
  color("yellow");
  remove(golds, (g) => {
    g.x -= scrX;
    if (text("$", g.x, 36).isColliding.rect.red) {
      play("coin");
      multiplier++;
      return true;
    }
    return g.x < -3;
  });
  color("black");
  text(`x${multiplier}`, 3, 9);
}
