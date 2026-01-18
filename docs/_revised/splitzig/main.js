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

function update() {
  if (!ticks) {
    player = { pos: vec(50, 80), dir: 1, speed: 1.5 };
    bullets = [];
    blocks = [];
    stackHeight = 0;
    spawnTimer = 0;
  }

  // Input: turn direction
  if (input.isJustPressed) {
    player.dir *= -1;
    play("select");
  }

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
  let spawnRate = rnd(99, 111) / sqrt(difficulty);
  if (spawnTimer >= spawnRate) {
    spawnTimer = 0;
    let size = 2; // 2 = large, 1 = medium, 0 = small
    blocks.push({
      pos: vec(rnd(15, 85), -10),
      vx: rnd(-0.3, 0.3) * sqrt(difficulty),
      vy: rnd(0.2, 0.8) * sqrt(difficulty),
      size,
    });
  }

  // Draw stack (green floor)
  color("green");
  if (stackHeight > 0) {
    rect(0, 100 - stackHeight, 100, stackHeight);
  }

  // Draw player first (for collision detection)
  color("cyan");
  box(player.pos, 6);

  // Update and draw bullets
  remove(bullets, (b) => {
    b.pos.y += b.vy;
    color("yellow");
    box(b.pos, 2, 4);
    return b.pos.y < -5;
  });

  // Update and draw blocks
  remove(blocks, (blk) => {
    blk.pos.x += blk.vx;
    blk.pos.y += blk.vy;

    // Bounce off walls
    if ((blk.pos.x < 5 && blk.vx < 0) || (blk.pos.x > 95 && blk.vx > 0)) {
      blk.vx *= -1;
    }

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

    color(blockColor);
    let col = box(blk.pos, blockSize);

    // Check bullet collision
    if (col.isColliding.rect.yellow) {
      play("hit");
      addScore(points, blk.pos);
      particle(blk.pos, { count: 5, speed: 1, angle: 0, angleWidth: PI * 2 });

      if (blk.size > 0) {
        // Split into 2 smaller blocks
        let newSize = blk.size - 1;
        blocks.push({
          pos: vec(blk.pos.x - 5, blk.pos.y),
          vx: -0.8 - rnd(0.3),
          vy: blk.vy * 0.8,
          size: newSize,
        });
        blocks.push({
          pos: vec(blk.pos.x + 5, blk.pos.y),
          vx: 0.8 + rnd(0.3),
          vy: blk.vy * 0.8,
          size: newSize,
        });
      } else {
        // Smallest block destroyed
        play("powerUp");
      }
      return true; // Remove this block
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
      // Block adds to stack
      stackHeight += blockSize / 2;
      play("hit");
      particle(blk.pos, {
        count: 3,
        speed: 0.5,
        angle: -PI / 2,
        angleWidth: PI,
      });
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
