title = "STORMVEIL";

description = `
[Tap] Switch Lane
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let player;
let obstacles;
let coins;
let lane;

function update() {
  if (!ticks) {
    lane = 1;
    player = { x: 50, y: 85 };
    obstacles = [];
    coins = [];
  }

  let laneX = [25, 50, 75];
  let speed = 1.5 + difficulty * 0.1;
  if (speed > 3) speed = 3;

  if (input.isJustPressed) {
    lane = (lane + 1) % 3;
    play("jump");
  }

  player.x += (laneX[lane] - player.x) * 0.3;

  // Spawn obstacles - 1 or 2 lanes blocked, rest safe with coin
  if (ticks % 40 === 0 && ticks > 0) {
    let blockedCount = 1 + (difficulty > 5 ? 1 : 0);
    let lanes = [0, 1, 2];
    let blocked = [];
    for (let i = 0; i < blockedCount; i++) {
      let idx = floor(rnd(lanes.length));
      blocked.push(lanes[idx]);
      lanes.splice(idx, 1);
    }
    for (let i = 0; i < 3; i++) {
      if (blocked.indexOf(i) >= 0) {
        obstacles.push({ x: laneX[i], y: -5 });
      }
    }
    if (lanes.length > 0) {
      coins.push({ x: laneX[lanes[floor(rnd(lanes.length))]], y: -5 });
    }
  }

  // Draw lane guides
  color("light_black");
  for (let i = 0; i < 3; i++) {
    line(vec(laneX[i], 0), vec(laneX[i], 100), 1);
  }

  // Draw player first
  color("cyan");
  box(player.x, player.y, 6);

  // Update obstacles
  obstacles = obstacles.filter((o) => {
    o.y += speed;
    color("red");
    if (box(o.x, o.y, 6).isColliding.rect.cyan) {
      play("explosion");
      end();
    }
    return o.y < 105;
  });

  // Update coins
  coins = coins.filter((c) => {
    c.y += speed;
    color("yellow");
    if (box(c.x, c.y, 5).isColliding.rect.cyan) {
      addScore(5);
      play("coin");
      return false;
    }
    return c.y < 105;
  });

  if (ticks % 60 === 0) addScore(1);
}
