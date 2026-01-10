title = "SKY RAFTSMAN";

description = `
[Tap] Jump
`;

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  audioSeed: 2,
};

// Game objects
/** @type {{ pos: Vector, isJumping: boolean, currentLog: any, vel: Vector }} */
let raftsman;

/** @type {{
 * pos: Vector, size: number, rotationSpeed: number, angle: number, vel: Vector, yDist: number
 * }[]} */
let logs;
let nextLogDist;

/** @type {{pos: Vector, size: Vector}[]} */
let clouds;
let nextCloudDist;

let scrollDist;

// Game variables
const JUMP_POWER = 2;
const GRAVITY = 0.1;

function update() {
  if (!ticks) {
    initGame();
  }
  scrollDist = -0.05;
  if (raftsman.pos.y > 50 && logs.length > 0) {
    scrollDist += (50 - raftsman.pos.y) * 0.2;
  } else if (raftsman.pos.y < 20) {
    scrollDist += (20 - raftsman.pos.y) * 0.1;
  }
  scrollDist *= difficulty;
  updateClouds();
  updateRaftsman();
  updateLogs();
  drawGame();
}

function initGame() {
  logs = times(5, (i) => ({
    pos: vec(i === 0 ? 50 : rnd(10, 90), 75 + i * 30),
    size: i === 0 ? 20 : rnd(15, 25),
    rotationSpeed: i === 0 ? -0.05 : rnds(0.04, 0.08),
    angle: 0,
    vel: vec(),
    yDist: 0,
  }));
  raftsman = {
    pos: vec(),
    isJumping: false,
    currentLog: logs[0],
    vel: vec(),
  };
  nextLogDist = 0;
  clouds = [];
  nextCloudDist = 0;
  scrollDist = 0;
}

function updateRaftsman() {
  if (input.isJustPressed && !raftsman.isJumping) {
    play("jump");
    raftsman.isJumping = true;
    raftsman.vel.set(0, 0).addWithAngle(raftsman.currentLog.angle, JUMP_POWER);
    raftsman.pos.add(vec(raftsman.vel).mul(2));
    raftsman.currentLog.vel.set(vec(raftsman.vel).mul(-1));
  }
  if (raftsman.isJumping) {
    raftsman.pos.add(vec(raftsman.vel).mul(difficulty));
    raftsman.vel.mul(0.99);
    raftsman.vel.y += GRAVITY / (input.isPressed ? 2 : 1);
    raftsman.pos.y += scrollDist;
  } else if (raftsman.currentLog) {
    raftsman.pos
      .set(raftsman.currentLog.pos)
      .addWithAngle(raftsman.currentLog.angle, raftsman.currentLog.size / 2);
  }
  if (
    (raftsman.pos.x < 3 && raftsman.vel.x < 0) ||
    (raftsman.pos.x > 97 && raftsman.vel.x > 0)
  ) {
    raftsman.vel.x = -raftsman.vel.x;
  }
  if (raftsman.pos.y > 100) {
    play("explosion");
    end();
  }
}

function updateLogs() {
  remove(logs, (log) => {
    log.pos.add(vec(log.vel).mul(difficulty));
    log.yDist += log.vel.y * difficulty;
    if (log.yDist > 20) {
      log.yDist -= 20;
      const s = floor(log.vel.y * difficulty * 5);
      if (s > 0) {
        if (log.pos.y < 100) {
          play("coin");
          addScore(s, log.pos);
        } else {
          addScore(s, log.pos.x, 99);
        }
      }
    }
    log.vel.mul(0.99);
    log.pos.y += scrollDist;
    if (
      (log.pos.x < log.size / 2 && log.vel.x < 0) ||
      (log.pos.x > 100 - log.size / 2 && log.vel.x > 0)
    ) {
      log.vel.x = -log.vel.x;
    }
    log.angle += log.rotationSpeed * difficulty;
    return log.pos.y < -99;
  });
  nextLogDist += scrollDist;
  if (nextLogDist < 0 && !raftsman.isJumping) {
    logs.push({
      pos: vec(rnd(10, 90), 125),
      size: rnd(15, 25),
      rotationSpeed: rnds(0.04, 0.08),
      angle: 0,
      vel: vec(),
      yDist: 0,
    });
    nextLogDist = 100;
  }
}

function updateClouds() {
  remove(clouds, (cloud) => {
    cloud.pos.y += scrollDist / 2;
    return cloud.pos.y < -20;
  });
  nextCloudDist += scrollDist;
  if (nextCloudDist < 0) {
    let cc = rndi(3, 6);
    let cx = rnd(100);
    for (let i = 0; i < cc; i++) {
      clouds.push({
        pos: vec(cx + rnds(20), 120 + rnd(10)),
        size: vec(rnd(15, 25), rnd(5, 15)),
      });
    }
    nextCloudDist += rnd(120, 160);
  }
}

function drawGame() {
  color("light_cyan");
  clouds.forEach((cloud) => {
    box(cloud.pos, cloud.size);
  });
  color("red");
  box(raftsman.pos, 6);
  color("yellow");
  logs.forEach((log) => {
    if (log.pos.y > 100 + log.size / 2) {
      color("light_yellow");
      rect(log.pos.x - log.size / 2, 98, log.size, 2);
    } else {
      color("yellow");
      if (
        arc(log.pos, log.size / 2, 3, log.angle, log.angle + 2 * PI).isColliding
          .rect.red &&
        raftsman.isJumping
      ) {
        play("click");
        raftsman.isJumping = false;
        raftsman.currentLog = log;
        log.angle = log.pos.angleTo(raftsman.pos);
      }
    }
  });
}
