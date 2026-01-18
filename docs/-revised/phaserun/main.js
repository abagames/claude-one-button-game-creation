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
let trails;
let phaseAnimTimer;
let breathPhase;

function update() {
  if (!ticks) {
    player = { pos: vec(20, 50), size: 8, targetSize: 8, scaleX: 1, scaleY: 1 };
    obstacles = [];
    coins = [];
    trails = [];
    spawnTimer = 60;
    coinTimer = 0;
    isSolid = true;
    phaseAnimTimer = 0;
    breathPhase = 0;
  }

  // Breathing animation
  breathPhase += 0.08;
  let breathScale = 1 + sin(breathPhase) * 0.03;

  // Input - toggle between solid and ghost phase
  if (input.isJustPressed) {
    isSolid = !isSolid;
    play("select");
    // Squash on phase change
    player.scaleX = 1.3;
    player.scaleY = 0.7;
    phaseAnimTimer = 10;
    // Enhanced particles on phase change
    color(isSolid ? "blue" : "light_blue");
    particle(player.pos, {
      count: 12,
      speed: 2,
      angle: 0,
      angleWidth: PI * 2,
    });
  }

  // Animate squash/stretch back to normal
  if (phaseAnimTimer > 0) {
    phaseAnimTimer--;
    player.scaleX += (1 - player.scaleX) * 0.3;
    player.scaleY += (1 - player.scaleY) * 0.3;
  } else {
    player.scaleX = breathScale;
    player.scaleY = 2 - breathScale;
  }

  // Spawn obstacles
  spawnTimer--;
  if (spawnTimer <= 0) {
    obstacles.push({ pos: vec(105, 50), rot: 0 });
    spawnTimer = floor(rnd(88, 111) / sqrt(difficulty));
  }

  // Spawn coins
  coinTimer--;
  if (coinTimer <= 0) {
    coins.push({ pos: vec(105, 50), rot: 0, bobPhase: rnd(0, PI * 2) });
    coinTimer = floor(rnd(11, 77) / difficulty);
  }

  let speed = 1.0 * difficulty;

  if (input.isPressed) {
    player.targetSize += 3 * sqrt(difficulty);
  } else {
    player.targetSize += (8 - player.targetSize) * 0.5;
  }
  player.size += (player.targetSize - player.size) * 0.3;

  // Add trails for obstacles
  remove(trails, (t) => {
    t.life--;
    color("light_red");
    let alpha = t.life / 10;
    box(t.pos, t.size * alpha);
    return t.life <= 0;
  });

  // Draw player FIRST for collision detection
  let drawSizeX = player.size * player.scaleX;
  let drawSizeY = player.size * player.scaleY;
  color("cyan");
  box(player.pos, drawSizeX, drawSizeY);

  // Find nearest threat for eye direction
  let nearestThreat = null;
  let nearestDist = 999;
  obstacles.forEach((obs) => {
    let d = obs.pos.x - player.pos.x;
    if (d > 0 && d < nearestDist) {
      nearestDist = d;
      nearestThreat = obs;
    }
  });
  coins.forEach((coin) => {
    let d = coin.pos.x - player.pos.x;
    if (d > 0 && d < nearestDist) {
      nearestDist = d;
      nearestThreat = coin;
    }
  });

  // Draw coins and check collision
  color("yellow");
  remove(coins, (coin) => {
    coin.pos.x -= speed;
    coin.rot += 0.1;
    coin.bobPhase += 0.15;

    // Bobbing animation
    let bobY = 50 + sin(coin.bobPhase) * 3;
    coin.pos.y = bobY;

    // Draw rotating coin using bar
    let coinSize = 6;
    bar(coin.pos, coinSize, 2, coin.rot);
    bar(coin.pos, coinSize, 2, coin.rot + PI / 2);

    let collision = box(coin.pos, coinSize);

    // Only collect when SOLID
    if (isSolid && collision.isColliding.rect.cyan) {
      addScore(ceil(player.size), coin.pos);
      play("coin");
      color("yellow");
      particle(coin.pos, { count: 8, speed: 2, angle: 0, angleWidth: PI * 2 });
      return true;
    }

    return coin.pos.x < -10;
  });

  // Draw obstacles and check collision
  color("red");
  remove(obstacles, (obs) => {
    // Add trail
    if (ticks % 3 === 0) {
      trails.push({ pos: vec(obs.pos.x, obs.pos.y), size: 8, life: 10 });
    }

    obs.pos.x -= speed;
    obs.rot -= 0.15 * speed; // Rotate based on speed

    // Draw rotating obstacle using bars
    let obsSize = 10;
    bar(obs.pos, obsSize, 3, obs.rot);
    bar(obs.pos, obsSize, 3, obs.rot + PI / 2);

    let collision = box(obs.pos, obsSize);

    // Only kill when SOLID
    if (isSolid && collision.isColliding.rect.cyan) {
      play("hit");
      color("red");
      particle(obs.pos, { count: 20, speed: 3, angle: 0, angleWidth: PI * 2 });
      end();
    }

    return obs.pos.x < -10;
  });

  // Draw phase indicator and eyes on top of player
  let eyeOffsetX = 0;
  let eyeOffsetY = 0;
  if (nearestThreat) {
    let dir = vec(
      nearestThreat.pos.x - player.pos.x,
      nearestThreat.pos.y - player.pos.y,
    );
    dir.normalize();
    eyeOffsetX = dir.x * 1.5;
    eyeOffsetY = dir.y * 1.5;
  }

  if (isSolid) {
    color("blue");
    box(player.pos, 5 * player.scaleX, 5 * player.scaleY);
    // Eyes - whites
    color("white");
    let eyeSpacing = 2 * player.scaleX;
    box(player.pos.x - eyeSpacing, player.pos.y - 1, 2, 3);
    box(player.pos.x + eyeSpacing, player.pos.y - 1, 2, 3);
    // Eyes - pupils (look toward threat)
    color("black");
    box(
      player.pos.x - eyeSpacing + eyeOffsetX * 0.3,
      player.pos.y - 1 + eyeOffsetY * 0.3,
      1,
      2,
    );
    box(
      player.pos.x + eyeSpacing + eyeOffsetX * 0.3,
      player.pos.y - 1 + eyeOffsetY * 0.3,
      1,
      2,
    );
  } else {
    color("light_blue");
    box(player.pos, 4 * player.scaleX, 4 * player.scaleY);
    // Ghost eyes - more ethereal
    color("white");
    let eyeSpacing = 2 * player.scaleX;
    // Blink occasionally in ghost mode
    if (floor(ticks / 30) % 4 !== 0) {
      box(player.pos.x - eyeSpacing, player.pos.y - 1, 2, 2);
      box(player.pos.x + eyeSpacing, player.pos.y - 1, 2, 2);
      color("light_purple");
      box(
        player.pos.x - eyeSpacing + eyeOffsetX * 0.3,
        player.pos.y - 1 + eyeOffsetY * 0.3,
        1,
        1,
      );
      box(
        player.pos.x + eyeSpacing + eyeOffsetX * 0.3,
        player.pos.y - 1 + eyeOffsetY * 0.3,
        1,
        1,
      );
    }
  }

  // UI
  color("black");
  text(isSolid ? "SOLID" : "GHOST", 3, 10);
}
