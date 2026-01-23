title = "STORMVEIL";

description = `
[Tap] Switch Lane
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let player;
let obstacles;
let nextObstacleTicks;
let coins;
let lane;
let multiplier;
let trails;

function update() {
  if (!ticks) {
    lane = 1;
    player = { x: 50, y: 85, vx: 0, squash: 1, switchTimer: 0 };
    obstacles = [];
    coins = [];
    trails = [];
    nextObstacleTicks = 0;
    multiplier = 1;
  }

  let laneX = [25, 50, 75];
  let speed = 1.5 * sqrt(difficulty);
  let prevX = player.x;

  if (input.isJustPressed) {
    lane = (lane + 1) % 3;
    play("jump");
    player.squash = 0.6;
    player.switchTimer = 10;
    // Lane switch particles (dust)
    color("light_black");
    particle(player.x, player.y + 3, 5, 0.5, -PI / 2, PI / 4);
  }

  player.x += (laneX[lane] - player.x) * 0.5;
  player.vx = player.x - prevX;

  // Recover squash
  player.squash += (1 - player.squash) * 0.15;
  if (player.switchTimer > 0) player.switchTimer--;

  // Add trail during lane switch
  if (abs(player.vx) > 0.5) {
    trails.push({ x: player.x, y: player.y, alpha: 0.5 });
  }

  // Spawn obstacles - 1 or 2 lanes blocked, rest safe with coin
  nextObstacleTicks -= difficulty;
  if (nextObstacleTicks < 0) {
    nextObstacleTicks += 40;
    let blockedCount = clamp(floor(rnd(1, sqrt(difficulty))), 1, 2);
    let lanes = [0, 1, 2];
    let blocked = [];
    for (let i = 0; i < blockedCount; i++) {
      let idx = floor(rnd(lanes.length));
      blocked.push(lanes[idx]);
      lanes.splice(idx, 1);
    }
    for (let i = 0; i < 3; i++) {
      if (blocked.indexOf(i) >= 0) {
        obstacles.push({ x: laneX[i], y: -5, phase: rnd(PI * 2) });
      }
    }
    if (lanes.length > 0) {
      coins.push({
        x: laneX[lanes[floor(rnd(lanes.length))]],
        y: -5,
        pulse: 0,
      });
    }
  }

  // Draw lane guides
  color("light_black");
  for (let i = 0; i < 3; i++) {
    line(vec(laneX[i], 0), vec(laneX[i], 100), 1);
  }

  // Draw trails (afterimage)
  remove(trails, (t) => {
    t.alpha -= 0.1;
    if (t.alpha <= 0) return true;
    color("light_cyan");
    box(t.x, t.y, 5 * t.alpha);
    return false;
  });

  // Draw player with squash/stretch and tilt
  color("cyan");
  let breathe = 1 + sin(ticks * 0.1) * 0.05;
  let stretchX = player.squash * breathe;
  let stretchY = (2 - player.squash) * breathe;
  let tilt = -player.vx * 0.08;
  bar(player.x, player.y, 6 * stretchY, 6 * stretchX, tilt);

  // Update obstacles with squash/stretch animation
  remove(obstacles, (o) => {
    o.y += speed;
    o.phase += 0.2;
    color("red");
    let pulse = 1 + sin(o.phase) * 0.15;
    let sizeX = 6 * pulse;
    let sizeY = 6 * (2 - pulse);
    if (box(o.x, o.y, sizeX, sizeY).isColliding.rect.cyan) {
      play("explosion");
      color("red");
      particle(player.x, player.y, 20, 2, 0, PI * 2);
      end();
    }
    // Passed obstacle - small dust
    if (o.y > 105) {
      color("light_black");
      particle(o.x, 100, 3, 0.3, PI / 2, PI / 4);
      return true;
    }
    return false;
  });

  // Update coins with spinning animation
  remove(coins, (c) => {
    c.y += speed;
    c.pulse += 0.12;
    let spinW = 2 + abs(cos(c.pulse)) * 4;
    color("yellow");
    if (box(c.x, c.y, spinW, 6).isColliding.rect.cyan) {
      addScore(multiplier, c.x, c.y);
      multiplier = clamp(multiplier + 1, 1, 16);
      play("coin");
      // Coin collect particles
      color("yellow");
      particle(c.x, c.y, 10, 1.5, 0, PI * 2);
      return true;
    }
    if (c.y > 105) {
      multiplier = 1;
      return true;
    }
    return false;
  });

  color("black");
  text(`x${multiplier}`, 3, 9, { isSmallText: true });
}
