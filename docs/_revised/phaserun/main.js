title = "PHASERUN";

description = `
[Tap] Phase
[Hold] Grow
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let player;
let obstacles;
let coins;
let spawnTimer;
let coinTimer;
let isSolid;

function update() {
  if (!ticks) {
    player = { pos: vec(20, 50), size: 8 };
    obstacles = [];
    coins = [];
    spawnTimer = 60;
    coinTimer = 0;
    isSolid = true;
  }

  // Input - toggle between solid and ghost phase
  if (input.isJustPressed) {
    isSolid = !isSolid;
    play("select");
    particle(player.pos, {
      count: 6,
      speed: 1.5,
      angle: 0,
      angleWidth: PI * 2,
    });
  }

  // Spawn obstacles
  spawnTimer--;
  if (spawnTimer <= 0) {
    obstacles.push({ pos: vec(105, 50) });
    spawnTimer = floor(rnd(88, 111) / sqrt(difficulty));
  }

  // Spawn coins
  coinTimer--;
  if (coinTimer <= 0) {
    coins.push({ pos: vec(105, 50) });
    coinTimer = floor(rnd(11, 77) / difficulty);
  }

  let speed = 1.0 * difficulty;

  if (input.isPressed) {
    player.size += 3 * sqrt(difficulty);
  } else {
    player.size += (8 - player.size) * 0.5;
  }

  // Draw player FIRST for collision detection
  color("cyan");
  box(player.pos, player.size);

  // Draw coins and check collision
  color("yellow");
  remove(coins, (coin) => {
    coin.pos.x -= speed;
    let collision = box(coin.pos, 6);

    // Only collect when SOLID
    if (isSolid && collision.isColliding.rect.cyan) {
      addScore(ceil(player.size), coin.pos);
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
