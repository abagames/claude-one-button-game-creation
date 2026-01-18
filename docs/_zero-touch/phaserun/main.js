title = "PHASERUN";

description = `
[Tap] Phase
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
let spawnTimer;
let coinTimer;
let isSolid;

function update() {
  if (!ticks) {
    player = { pos: vec(20, 50) };
    obstacles = [];
    coins = [];
    spawnTimer = 90;
    coinTimer = 60;
    isSolid = true;
  }

  // Input - toggle between solid and ghost phase
  if (input.isJustPressed) {
    isSolid = !isSolid;
    play("select");
    particle(player.pos, { count: 6, speed: 1.5, angle: 0, angleWidth: PI * 2 });
  }

  // Spawn obstacles
  spawnTimer--;
  if (spawnTimer <= 0) {
    obstacles.push({ pos: vec(105, 50) });
    spawnTimer = floor(50 / sqrt(difficulty));
  }

  // Spawn coins
  coinTimer--;
  if (coinTimer <= 0) {
    coins.push({ pos: vec(105, 50) });
    coinTimer = floor(80 / sqrt(difficulty));
  }

  let speed = 1.0 + difficulty * 0.3;

  // Draw player FIRST for collision detection
  color("cyan");
  box(player.pos, 8);

  // Draw coins and check collision
  color("yellow");
  remove(coins, (coin) => {
    coin.pos.x -= speed;
    let collision = box(coin.pos, 6);

    // Only collect when SOLID
    if (isSolid && collision.isColliding.rect.cyan) {
      addScore(1, coin.pos);
      play("coin");
      particle(coin.pos, { count: 5, speed: 1, angle: 0, angleWidth: PI * 2 });
      return true;
    }

    return coin.pos.x < -10;
  });

  // Draw obstacles and check collision
  color("red");
  remove(obstacles, (obs) => {
    obs.pos.x -= speed;
    let collision = box(obs.pos, 10);

    // Only kill when SOLID
    if (isSolid && collision.isColliding.rect.cyan) {
      play("hit");
      end();
    }

    return obs.pos.x < -10;
  });

  // Draw phase indicator on top of player
  if (isSolid) {
    color("blue");
    box(player.pos, 5);
  } else {
    color("light_blue");
    box(player.pos, 4);
  }

  // UI
  color("black");
  text(isSolid ? "SOLID" : "GHOST", 3, 10);
}
