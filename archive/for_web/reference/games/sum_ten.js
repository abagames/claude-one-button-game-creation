title = "SUM TEN";

description = `
[Tap] Forward
`;

characters = [];

options = {
  viewSize: { x: 150, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  seed: 8,
};

/** @type {{v: number, isFilled: boolean}[][]} */
let grid;
let gridPos;
/** @type {{pos: Vector, angle: number, ticks: 0}} */
let cursor;
/** @type {number[][]} */
let numbers;
let showingSumTicks;
const gridCount = 10;
const gridSize = 11;
const angleOfs = [vec(-1, 0), vec(0, -1)];

function update() {
  if (!ticks) {
    grid = times(gridCount, (x) =>
      times(gridCount, (y) => {
        const iw = x > 6 || (x > 0 && y !== 6);
        return { v: iw ? undefined : rndi(1, 10), isFilled: iw };
      })
    );
    [6, 5, 8, 1, 7, 3].forEach((v, i) => {
      grid[1 + i][6].v = v;
    });
    gridPos = vec(100, 0);
    cursor = { pos: vec(7, 6), angle: 0, ticks: 0 };
    numbers = [[]];
    showingSumTicks = 0;
  }
  const np = vec();
  cursor.ticks++;
  if (cursor.ticks >= 30) {
    const pa = cursor.angle;
    cursor.angle = wrap(cursor.angle + 1, 0, 2);
    np.set(cursor.pos).add(angleOfs[cursor.angle]);
    if (grid[np.x][np.y].v == null) {
      cursor.angle = pa;
    }
    cursor.ticks = 0;
  }
  np.set(cursor.pos).add(angleOfs[cursor.angle]);
  times(gridCount, (x) =>
    times(gridCount, (y) => {
      const g = grid[x][y];
      const c =
        x === cursor.pos.x && y === cursor.pos.y
          ? "cyan"
          : x === np.x && y === np.y
          ? "red"
          : "blue";
      color(c);
      const rx = gridPos.x - x * gridSize;
      const ry = gridPos.y + y * gridSize + 1;
      rect(rx, ry, gridSize - 1, gridSize - 1);
      color("white");
      if (!g.isFilled) {
        rect(rx + 1, ry + 1, gridSize - 3, gridSize - 3);
        color(c);
      }
      if (g.v != null) {
        text(
          `${g.v}`,
          round(gridPos.x - (x - 0.5) * gridSize) - 1,
          round(gridPos.y + (y + 0.5) * gridSize)
        );
      }
      if (c === "cyan" && (rx < 0 || ry > 91)) {
        play("explosion");
        end();
      }
    })
  );
  color("white");
  rect(0, 0, 100, 10);
  rect(100, 0, 50, 100);
  if (input.isJustPressed) {
    play("select");
    cursor.pos.set(np);
    grid[np.x][np.y].isFilled = true;
    cursor.ticks = 0;
    const ns = numbers[numbers.length - 1];
    ns.push(grid[np.x][np.y].v);
    let s = 0;
    ns.forEach((v) => {
      s += v;
    });
    if (s % 10 === 0) {
      play("powerUp");
      numbers.push([]);
      const sc = s / 10;
      addScore(sc * sc * 10, 133, 20 + ns.length * 8);
      if (showingSumTicks <= 0) {
        showingSumTicks = 60;
      }
    } else if (ns.length >= 10) {
      showingSumTicks = 60;
      while (numbers.length > 1) {
        numbers.shift();
      }
      play("explosion");
      end();
    }
    np.set(cursor.pos).add(angleOfs[cursor.angle]);
    if (grid[np.x][np.y].v == null) {
      cursor.angle = wrap(cursor.angle + 1, 0, 2);
    }
  }
  let sum = 0;
  let y = 12;
  color("black");
  numbers[0].forEach((n) => {
    text(`${n}`, 135, y);
    sum += n;
    y += 8;
  });
  if (sum > 0) {
    text("+)", 110, y - 8);
    rect(115, y - 5, 30, 1);
  }
  if (showingSumTicks > 0) {
    text(`${sum}`, 135 - 6, y);
    showingSumTicks--;
    if (showingSumTicks === 0) {
      numbers.shift();
      if (numbers.length > 1) {
        showingSumTicks = 60;
      }
    }
  }
  if (cursor.pos.x < 7) {
    gridPos.x -= (7 - cursor.pos.x) * 0.5;
  }
  if (cursor.pos.y < 6) {
    gridPos.y += (6 - cursor.pos.y) * 0.5;
  }
  const s = sqrt(difficulty) * 0.01;
  gridPos.sub(s, -s);
  if (gridPos.x <= 90) {
    for (let x = gridCount - 1; x >= 0; x--) {
      const wi = rndi(1, gridCount * 1.5);
      for (let y = 0; y < gridCount; y++) {
        if (x > 0) {
          grid[x][y] = grid[x - 1][y];
        } else {
          const isFilled = y === wi && !grid[x + 1][y - 1].isFilled;
          grid[x][y] = {
            v: isFilled ? undefined : rndi(1, 10),
            isFilled,
          };
        }
      }
    }
    gridPos.x += 10;
    cursor.pos.x++;
  }
  if (gridPos.y >= 10) {
    for (let y = gridCount - 1; y >= 0; y--) {
      const wi = rndi(1, gridCount * 1.5);
      for (let x = 0; x < gridCount; x++) {
        if (y > 0) {
          grid[x][y] = grid[x][y - 1];
        } else {
          const isFilled = x === wi && !grid[x - 1][y + 1].isFilled;
          grid[x][y] = {
            v: isFilled ? undefined : rndi(1, 10),
            isFilled,
          };
        }
      }
    }
    gridPos.y -= 10;
    cursor.pos.y++;
  }
}
