title = "TT FENCE";

description = `
[Tap] Place
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  seed: 1,
};

/** @type {boolean[][]} */
let grid;
/** @type {boolean[][]} */
let tmpGrid;
/** @type {boolean[][]} */
let bombEdgeGrid;
/** @type {boolean[][]} */
let bombAnimGrid;
/** @type {{pos: Vector, type: number, angle: number}} */
let block;
const blockPatterns = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 3, 0],
  [0, 0, 1],
  [0, 0, 3],
  [1, 0, 0],
  [3, 0, 0],
];
const angleOfs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
let pos;
let angle;
let prevAngle;
let type;
let bombAnimTicks;
let damage;
let damageTarget;
let isDamageShown;
let nextRotationTicks;
const gridSize = 15;

function update() {
  if (!ticks) {
    grid = times(gridSize, () => times(gridSize, () => false));
    tmpGrid = times(gridSize, () => times(gridSize, () => false));
    bombEdgeGrid = times(gridSize, () => times(gridSize, () => false));
    bombAnimGrid = times(gridSize, () => times(gridSize, () => false));
    pos = vec();
    angle = prevAngle = 0;
    type = rndi(blockPatterns.length);
    bombAnimTicks = 0;
    damage = damageTarget = 0;
    isDamageShown = true;
    nextRotationTicks = 0;
    setBlock(vec(7, 7), rndi(blockPatterns.length), rndi(4));
  }
  bombAnimTicks--;
  times(gridSize, (x) =>
    times(gridSize, (y) => {
      if (grid[x][y] && tmpGrid[x][y]) {
        color("purple");
        drawGrid(x, y);
      } else if (grid[x][y]) {
        color("blue");
        drawGrid(x, y);
      } else if (tmpGrid[x][y]) {
        color("light_blue");
        drawGrid(x, y);
      } else if (bombAnimTicks > 0 && bombAnimGrid[x][y]) {
        color("red");
        drawGrid(x, y, sin((bombAnimTicks / 30) * PI) * 6);
      }
    })
  );
  if (input.isJustPressed) {
    play("select");
    setBlock(pos, type, angle);
    checkBomb();
    type = rndi(blockPatterns.length);
    nextRotationTicks = 0;
    damageTarget += sqrt(difficulty) * 2;
  }
  nextRotationTicks--;
  if (nextRotationTicks < 0) {
    let canPlacing = false;
    for (let i = 0; i < 4; i++) {
      angle = wrap(angle + 1, 0, 4);
      if (checkBlock(pos, type, angle)) {
        canPlacing = true;
        break;
      }
    }
    tmpGrid = times(gridSize, () => times(gridSize, () => false));
    if (!canPlacing) {
      for (let i = 0; i < 4; i++) {
        angle = wrap(angle + 1, 0, 4);
        if (checkBlockInGrid(pos, type, angle)) {
          canPlacing = true;
          break;
        }
      }
    }
    if (!canPlacing) {
      damageTarget = 100;
    } else {
      setBlock(pos, type, angle, tmpGrid);
    }
    if (angle !== prevAngle) {
      play("laser");
    }
    prevAngle = angle;
    nextRotationTicks = 30 / sqrt(sqrt(difficulty));
  }
  damageTarget += sqrt(difficulty) * 0.01;
  damage += (damageTarget - damage) * 0.1;
  color("red");
  if (damage > 99) {
    rect(0, 98, 100, 2);
    play("lucky");
    end();
  } else if (damage < 80 || ticks % ceil(109 - damage) < (109 - damage) * 0.8) {
    if (!isDamageShown) {
      play("coin");
    }
    rect(0, 98, damage, 2);
    rect(99, 98, 1, 2);
    isDamageShown = true;
  } else {
    isDamageShown = false;
  }

  function setBlock(rp, type, angle, g = grid) {
    let hitCount = 0;
    const p = vec(rp);
    addAngle(p, angle);
    if (!g[p.x][p.y]) {
      g[p.x][p.y] = true;
    } else {
      hitCount++;
    }
    blockPatterns[type].forEach((ba) => {
      addAngle(p, wrap(angle + ba, 0, 4));
      if (!g[p.x][p.y]) {
        g[p.x][p.y] = true;
      } else {
        hitCount++;
      }
    });
    if (g === grid) {
      if (hitCount > 0) {
        play("hit");
        damageTarget += hitCount * 9 * sqrt(difficulty);
      }
      pos.set(p);
    }
  }

  function checkBlock(rp, type, angle) {
    const p = vec(rp);
    addAngle(p, angle);
    let canPlacing = canPlaceGrid(p);
    blockPatterns[type].forEach((ba) => {
      addAngle(p, wrap(angle + ba, 0, 4));
      canPlacing = canPlacing && canPlaceGrid(p);
    });
    return canPlacing;
  }

  function checkBlockInGrid(rp, type, angle) {
    const p = vec(rp);
    addAngle(p, angle);
    let canPlacing = p.isInRect(0, 0, gridSize, gridSize);
    blockPatterns[type].forEach((ba) => {
      addAngle(p, wrap(angle + ba, 0, 4));
      canPlacing = canPlacing && p.isInRect(0, 0, gridSize, gridSize);
    });
    return canPlacing;
  }

  function checkBomb() {
    bombEdgeGrid = times(gridSize, () => times(gridSize, () => false));
    for (let i = 0; i < gridSize; i++) {
      bombEdgeGrid[i][0] =
        bombEdgeGrid[i][gridSize - 1] =
        bombEdgeGrid[0][i] =
        bombEdgeGrid[gridSize - 1][i] =
          true;
    }
    for (let i = 0; i < 99; i++) {
      if (fillBombDown() + fillBombUp() === 0) {
        break;
      }
    }
    bomb();
  }

  function fillBombDown() {
    let bc = 0;
    let p = vec();
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        p.set(x, y);
        if (canPlaceGrid(p) && bombEdgeGrid[x][y]) {
          addAngle(p, 0);
          if (canPlaceGrid(p) && !bombEdgeGrid[p.x][p.y]) {
            bombEdgeGrid[p.x][p.y] = true;
            bc++;
          }
          p.set(x, y);
          addAngle(p, 1);
          if (canPlaceGrid(p) && !bombEdgeGrid[p.x][p.y]) {
            bombEdgeGrid[p.x][p.y] = true;
            bc++;
          }
        }
      }
    }
    return bc;
  }

  function fillBombUp() {
    let bc = 0;
    let p = vec();
    for (let y = gridSize - 1; y >= 0; y--) {
      for (let x = gridSize - 1; x >= 0; x--) {
        p.set(x, y);
        if (canPlaceGrid(p) && bombEdgeGrid[x][y]) {
          addAngle(p, 2);
          if (canPlaceGrid(p) && !bombEdgeGrid[p.x][p.y]) {
            bombEdgeGrid[p.x][p.y] = true;
            bc++;
          }
          p.set(x, y);
          addAngle(p, 3);
          if (canPlaceGrid(p) && !bombEdgeGrid[p.x][p.y]) {
            bombEdgeGrid[p.x][p.y] = true;
            bc++;
          }
        }
      }
    }
    return bc;
  }

  function bomb() {
    let bc = 0;
    let bp = vec();
    bombAnimGrid = times(gridSize, () => times(gridSize, () => false));
    const p = vec();
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        p.set(x, y);
        if (canPlaceGrid(p) && !bombEdgeGrid[x][y]) {
          angleOfs.forEach(([ox, oy]) => {
            if (!bombAnimGrid[x + ox][y + oy]) {
              bombAnimGrid[x + ox][y + oy] = true;
              bc++;
              bp.add(x + ox, y + oy);
            }
          });
        }
      }
    }
    for (let i = 0; i < floor(sqrt(bc) * 0.5); i++) {
      let pbc = bc;
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          if (bombAnimGrid[x][y]) {
            angleOfs.forEach(([ox, oy]) => {
              p.set(x + ox, y + oy);
              if (existsGrid(p) && !bombAnimGrid[p.x][p.y]) {
                bombAnimGrid[p.x][p.y] = true;
                bc++;
                bp.add(p);
              }
            });
          }
        }
      }
      if (pbc === bc) {
        break;
      }
    }
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (bombAnimGrid[x][y]) {
          grid[x][y] = false;
        }
      }
    }
    bombAnimTicks = 30;
    if (bc > 0) {
      play("explosion");
      bp.div(bc);
      const sc = ceil(bc * sqrt(bc));
      addScore(
        sc,
        (bp.x - gridSize / 2) * 6 + 53,
        (bp.y - gridSize / 2) * 6 + 56
      );
      damageTarget = clamp(damageTarget - sc * 0.1, 0, 99);
    }
  }

  function addAngle(p, angle) {
    const ao = angleOfs[angle];
    p.add(ao[0], ao[1]);
  }

  function canPlaceGrid(p) {
    if (!p.isInRect(0, 0, gridSize, gridSize)) {
      return false;
    }
    return !grid[p.x][p.y];
  }

  function existsGrid(p) {
    if (!p.isInRect(0, 0, gridSize, gridSize)) {
      return false;
    }
    return grid[p.x][p.y];
  }

  function drawGrid(x, y, size = 6) {
    box((x - gridSize / 2) * 6 + 53, (y - gridSize / 2) * 6 + 56, size);
  }
}
