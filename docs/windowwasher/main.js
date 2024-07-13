title = "WINDOW WASHER";

description = `
[Hold] Ascend
[Release] Descend
Clean windows!
`;

characters = [
  `
  ll
 l  l
llllll
 l  l
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 1,
  isDrawingScoreFront: true,
};

/** @type {{pos: Vector, vx: number, vy: number, width: number, height: number}} */
let platform;

/** @type {{pos: Vector, width: number, height: number, isCleaned: boolean}[]} */
let windows;

/** @type {{pos: Vector, vx: number, type: string}[]} */
let obstacles;
let nextObstacleDist;

let screenScrollSpeed;
let multiplier;

function update() {
  if (!ticks) {
    initGame();
  }

  updateBackground();
  updatePlatform();
  updateWindows();
  updateObstacles();
  drawPlatform();
  updateScroll();
  color("black");
  text(`x${multiplier}`, 2, 10, { isSmallText: true });
}

function initGame() {
  platform = {
    pos: vec(50, 10),
    vx: 1,
    vy: 1,
    width: 20,
    height: 5,
  };
  windows = [];
  for (let i = 0; i < 10; i++) {
    windows.push({
      pos: vec(rnd(15, 85), 20 + i * 30),
      width: 15,
      height: 20,
      isCleaned: false,
    });
  }
  obstacles = [];
  nextObstacleDist = 0;
  screenScrollSpeed = 0.5;
  multiplier = 1;
}

function updateBackground() {
  color("light_cyan");
  rect(0, 0, 3, 100);
  rect(97, 0, 3, 100);
}

function updatePlatform() {
  if (input.isJustPressed) {
    play("laser");
  }
  if (input.isPressed) {
    platform.vy = -1.5;
  } else {
    platform.vy = 1;
  }

  // Automatic horizontal movement
  platform.pos.x += platform.vx;
  if (platform.pos.x > 90 || platform.pos.x < 10) {
    play("click");
    platform.vx *= -1;
  }

  platform.pos.y += platform.vy;
  platform.pos.y = clamp(platform.pos.y, 5, 95);

  drawPlatform();
}

function drawPlatform() {
  color("light_black");
  rect(platform.pos.x - platform.width / 2, 0, 1, platform.pos.y);
  rect(platform.pos.x + platform.width / 2 - 1, 0, 1, platform.pos.y);
  color("blue");
  box(platform.pos, platform.width, platform.height);
}

function updateWindows() {
  windows.forEach((w) => {
    w.pos.y -= screenScrollSpeed;
    if (w.pos.y < -30) {
      w.pos.y += 330;
      if (w.isCleaned) {
        w.isCleaned = false;
      } else {
        play("hit");
        multiplier--;
        if (multiplier < 1) {
          multiplier = 1;
        }
      }
    }
    color(w.isCleaned ? "yellow" : "cyan");
    if (box(w.pos, w.width, w.height).isColliding.rect.blue && !w.isCleaned) {
      play("powerUp");
      w.isCleaned = true;
      addScore(multiplier, w.pos);
      multiplier++;
    }
  });
}

function updateObstacles() {
  remove(obstacles, (o) => {
    o.pos.y -= screenScrollSpeed;
    if (o.type === "bird") {
      o.pos.x += o.vx;
      if (o.pos.x > 95 || o.pos.x < 5) {
        o.vx *= -1;
      }
    }
    color("red");
    if (o.type === "bird") {
      if (
        char("a", o.pos, { mirror: { x: o.vx > 0 ? 1 : -1 } }).isColliding.rect
          .blue
      ) {
        endGame();
      }
    } else {
      if (box(o.pos, 10, 14).isColliding.rect.blue) {
        endGame();
      }
    }
    return o.pos.y < -10;
  });

  nextObstacleDist -= screenScrollSpeed;
  if (nextObstacleDist < 0) {
    let isBird = rnd() < 0.5;
    const pos = vec(rnd(15, 85), 110);
    if (!isBird) {
      color("transparent");
      if (box(pos, 14, 18).isColliding.rect.cyan) {
        isBird = true;
      }
    }
    obstacles.push({
      pos,
      vx: isBird ? (rnd() < 0.5 ? 0.5 : -0.5) : 0,
      type: isBird ? "bird" : "open window",
    });
    nextObstacleDist += rnd(40, 50);
  }
}

function updateScroll() {
  screenScrollSpeed = 0.5 + difficulty * 0.1;
}

function endGame() {
  play("explosion");
  end();
}
