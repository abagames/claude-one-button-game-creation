title = "SPLITZIG";

description = `
[Tap] Turn
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let player;
let bullets;
let blocks;
let stackHeight;
let spawnTimer;
let trails;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 80), dir: 1, speed: 1.5, squash: 1, tilt: 0 };
    bullets = [];
    blocks = [];
    trails = [];
    stackHeight = 0;
    spawnTimer = 0;
  }

  // Input: turn direction
  if (input.isJustPressed) {
    player.dir *= -1;
    player.squash = 0.5; // Squash on turn
    play("select");
    // Particles on turn
    color("cyan");
    particle(player.pos, {
      count: 4,
      speed: 1.5,
      angle: PI / 2,
      angleWidth: PI,
    });
  }

  // Recover squash
  player.squash += (1 - player.squash) * 0.15;
  // Tilt toward movement direction
  player.tilt += (player.dir * 0.3 - player.tilt) * 0.2;

  // Player movement (auto-move, wall = game over!)
  player.pos.x += player.dir * player.speed * sqrt(difficulty);
  player.pos.x = wrap(player.pos.x, 0, 100);

  // Adjust player Y based on stack
  stackHeight *= 0.998;
  player.pos.y = 90 - stackHeight;
  if (player.pos.y < 0) {
    play("explosion");
    end();
  }

  // Auto-fire bullets
  if (ticks % floor(7 / sqrt(difficulty)) === 0) {
    bullets.push({ pos: vec(player.pos.x, player.pos.y - 5), vy: -3 });
    play("laser");
  }

  // Spawn blocks
  spawnTimer++;
  let spawnRate = rnd(88, 111) / sqrt(difficulty);
  if (spawnTimer >= spawnRate) {
    spawnTimer = 0;
    let size = 2;
    blocks.push({
      pos: vec(rnd(15, 85), -10),
      vx: rnd(-0.3, 0.3) * sqrt(difficulty),
      vy: rnd(0.2, 0.8) * sqrt(difficulty),
      size,
      squash: 1,
      rot: 0,
    });
  }

  // Update trails
  remove(trails, (t) => {
    t.life -= 0.15;
    color("light_yellow");
    box(t.pos, 2 * t.life, 3 * t.life);
    return t.life <= 0;
  });

  // Draw stack (green floor)
  color("green");
  if (stackHeight > 0) {
    rect(0, 100 - stackHeight, 100, stackHeight);
  }

  // Draw player with squash/stretch and tilt
  color("cyan");
  let pw = 6 * player.squash;
  let ph = 6 / player.squash;
  bar(player.pos, ph, pw, player.tilt);
  // Eyes
  let eyeOffX = player.dir * 1.5;
  color("white");
  box(player.pos.x - 1.5, player.pos.y - 1, 2);
  box(player.pos.x + 1.5, player.pos.y - 1, 2);
  color("black");
  box(player.pos.x - 1.5 + eyeOffX * 0.3, player.pos.y - 1, 1);
  box(player.pos.x + 1.5 + eyeOffX * 0.3, player.pos.y - 1, 1);

  // Update and draw bullets with trails
  remove(bullets, (b) => {
    // Add trail
    if (ticks % 2 === 0) {
      trails.push({ pos: vec(b.pos), life: 1 });
    }
    b.pos.y += b.vy;
    color("yellow");
    box(b.pos, 2, 4);
    return b.pos.y < -5;
  });

  // Update and draw blocks
  remove(blocks, (blk) => {
    blk.pos.x += blk.vx;
    blk.pos.y += blk.vy;

    // Bounce off walls with squash
    if ((blk.pos.x < 5 && blk.vx < 0) || (blk.pos.x > 95 && blk.vx > 0)) {
      blk.vx *= -1;
      blk.squash = 0.6;
      color("white");
      particle(blk.pos, {
        count: 3,
        speed: 1,
        angle: blk.vx > 0 ? 0 : PI,
        angleWidth: PI / 2,
      });
    }

    // Recover squash and update rotation
    blk.squash += (1 - blk.squash) * 0.1;
    blk.rot += blk.vx * 0.05;

    // Size-based properties
    let blockSize, blockColor, points;
    if (blk.size === 2) {
      blockSize = 12;
      blockColor = "red";
      points = 1;
    } else if (blk.size === 1) {
      blockSize = 8;
      blockColor = "purple";
      points = 2;
    } else {
      blockSize = 5;
      blockColor = "blue";
      points = 3;
    }

    // Draw block with squash and rotation
    color(blockColor);
    let bw = blockSize * blk.squash;
    let bh = blockSize / blk.squash;
    let col = bar(blk.pos, bh, bw, blk.rot);

    // Eyes on blocks (look toward player)
    let dx = player.pos.x - blk.pos.x;
    let dy = player.pos.y - blk.pos.y;
    let eyeDir = atan2(dy, dx);
    let es = blockSize * 0.15;
    color("white");
    box(blk.pos.x - es, blk.pos.y, es * 1.5);
    box(blk.pos.x + es, blk.pos.y, es * 1.5);
    color("black");
    box(
      blk.pos.x - es + cos(eyeDir) * es * 0.4,
      blk.pos.y + sin(eyeDir) * es * 0.4,
      es * 0.8,
    );
    box(
      blk.pos.x + es + cos(eyeDir) * es * 0.4,
      blk.pos.y + sin(eyeDir) * es * 0.4,
      es * 0.8,
    );

    // Check bullet collision
    if (col.isColliding.rect.yellow) {
      play("hit");
      addScore(points, blk.pos);
      color(blockColor);
      particle(blk.pos, { count: 8, speed: 2, angle: 0, angleWidth: PI * 2 });

      if (blk.size > 0) {
        let newSize = blk.size - 1;
        blocks.push({
          pos: vec(blk.pos.x - 5, blk.pos.y),
          vx: -0.8 - rnd(0.3),
          vy: blk.vy * 0.8,
          size: newSize,
          squash: 0.6,
          rot: blk.rot,
        });
        blocks.push({
          pos: vec(blk.pos.x + 5, blk.pos.y),
          vx: 0.8 + rnd(0.3),
          vy: blk.vy * 0.8,
          size: newSize,
          squash: 0.6,
          rot: blk.rot,
        });
      } else {
        play("powerUp");
      }
      return true;
    }

    // Check player collision
    if (col.isColliding.rect.cyan) {
      play("explosion");
      end();
      return true;
    }

    // Block hits stack or bottom
    let floorY = 100 - stackHeight;
    if (blk.pos.y > floorY - blockSize / 2) {
      stackHeight += blockSize / 2;
      play("hit");
      color(blockColor);
      particle(blk.pos, { count: 6, speed: 1, angle: -PI / 2, angleWidth: PI });
      return true;
    }

    return false;
  });

  // Remove bullets that hit blocks
  remove(bullets, (b) => {
    color("transparent");
    let bcol = box(b.pos, 2, 4);
    return (
      bcol.isColliding.rect.red ||
      bcol.isColliding.rect.purple ||
      bcol.isColliding.rect.blue
    );
  });
}
