title = "UD CAVE";

description = `
[Hold] Go right
`;

characters = [
  `
 l
lll
 l
l l
`,
];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 5,
};

let playerX;
/** @type {{pos: Vector, width: number, vy: number}[]} */
let walls;
let nextWallDist;
/** @type {{x: number, vx: number, w: number, vw: number}[]} */
let caves;
/** @type {{pos: Vector, vy: number}[]} */
let golds;
let nextGoldDist;
let multiplier;
const wallHeight = 10;

function update() {
  if (!ticks) {
    playerX = 0;
    walls = [];
    nextWallDist = -50;
    caves = times(3, (i) => {
      return { x: 0, vx: 0, w: i > 0 ? 15 : 20, vw: 0 };
    });
    golds = [];
    nextGoldDist = 5;
    multiplier = 1;
  }
  const vy = difficulty;
  nextWallDist -= vy;
  if (nextWallDist < 0) {
    addScore(multiplier);
    const c0 = caves[0];
    caves.forEach((c, i) => {
      c.vx += rnds(2) * sqrt(difficulty);
      c.vw += rnds(1) * sqrt(difficulty);
      c.x += c.vx;
      c.w += c.vw;
      const minX = i === 0 ? -(17 - 7 / sqrt(difficulty)) : c0.x - c0.w;
      const maxX = i === 0 ? 17 - 7 / sqrt(difficulty) : c0.x + c0.w;
      if ((c.x - c.w < minX && c.vx < 0) || (c.x + c.w > maxX && c.vx > 0)) {
        c.vx *= -0.5;
        c.x += c.vx;
      }
      const minW = i === 0 ? 5 + 5 / sqrt(difficulty) : caves[0].w;
      const maxW =
        i === 0 ? 7 + 7 / sqrt(difficulty) : 9 + 9 / sqrt(difficulty);
      if ((c.w < minW && c.vw < 0) || (c.w > maxW && c.vw > 0)) {
        c.vw *= -0.5;
        c.w += c.vw;
      }
    });
    const c1 = caves[1];
    const x11 = c1.x - c1.w + 25;
    const x12 = c1.x + c1.w + 25;
    if (x11 > 0) {
      walls.push({ pos: vec(x11, -nextWallDist), width: -x11, vy: 1 });
    }
    if (x12 < 50) {
      walls.push({ pos: vec(x12, -nextWallDist), width: 50 - x12, vy: 1 });
    }
    const c2 = caves[2];
    const x21 = 75 - c2.x - c2.w;
    const x22 = 75 - c2.x + c2.w;
    if (x21 > 50) {
      walls.push({
        pos: vec(x21, 100 + nextWallDist),
        width: 50 - x21,
        vy: -1,
      });
    }
    if (x22 < 100) {
      walls.push({
        pos: vec(x22, 100 + nextWallDist),
        width: 100 - x22,
        vy: -1,
      });
    }
    nextGoldDist--;
    if (nextGoldDist < 0) {
      if (rnd() < 0.5) {
        golds.push({
          pos: vec(
            caves[1].x + rnds(caves[1].w * 0.8) + 25,
            -nextWallDist - wallHeight / 2
          ),
          vy: 1,
        });
      } else {
        golds.push({
          pos: vec(
            75 - caves[2].x + rnds(caves[2].w * 0.8),
            100 + nextWallDist + wallHeight / 2
          ),
          vy: -1,
        });
      }
      nextGoldDist = rnd(3, 9);
    }
    nextWallDist += wallHeight;
  }
  color("red");
  remove(walls, (w) => {
    w.pos.y += w.vy * vy;
    rect(w.pos, w.width, (wallHeight - 1) * -w.vy);
    return w.vy > 0 ? w.pos.y > 100 + wallHeight : w.pos.y < -wallHeight;
  });
  playerX = clamp(
    playerX + (input.isPressed ? 1 : -1) * difficulty * 0.5,
    -25,
    25
  );
  if (input.isJustPressed) {
    play("select");
  } else if (input.isJustReleased) {
    play("laser");
  }
  color("black");
  const c1 = char("a", playerX + 25, 90).isColliding.rect;
  const c2 = char("a", 75 - playerX, 10).isColliding.rect;
  if (c1.red || c2.red) {
    play("explosion");
    end();
  }
  color("yellow");
  remove(golds, (g) => {
    g.pos.y += g.vy * vy;
    const c = char("$", g.pos).isColliding;
    if (c.rect.red) {
      return true;
    }
    if (c.char.a) {
      play("powerUp");
      multiplier++;
      return true;
    }
    return g.vy > 0 ? g.pos.y > 103 : g.pos.y < -3;
  });
  color("black");
  text(`x${multiplier}`, 3, 9);
}
