title = "BLADE DANCER";

description = `
[Tap] Jump & Slash
`;

characters = [];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 5,
};

// Define variables for game objects
/** @type {{ pos: Vector, isJumping: boolean, jumpTicks: number, swordAngle: number, swordLength: number }} */
let player;

/** @type {{ pos: Vector, size: number }[]} */
let enemies;

/** @type {{ segments: { x: number, width: number }[] }} */
let ground;

// Define game constants
const GROUND_Y = 80;
const JUMP_DURATION = 30;
const JUMP_HEIGHT = 30;
const SCROLL_SPEED = 1;
const SWORD_ROTATION_SPEED = 0.3;
const MAX_SWORD_LENGTH = 30;

// New variables for improved gameplay
let enemySpawnChance;
let gapFrequency;
let multiplier;

function update() {
  if (!ticks) {
    // Initialize game objects
    player = {
      pos: vec(35, GROUND_Y),
      isJumping: false,
      jumpTicks: 0,
      swordAngle: PI / 2,
      swordLength: 10,
    };
    enemies = [];
    ground = { segments: [{ x: 0, width: 200 }] };
    enemySpawnChance = 0.03;
    gapFrequency = 0.3;
    multiplier = 1;
  }

  // Handle player jumping and slashing
  if (input.isJustPressed && !player.isJumping) {
    player.isJumping = true;
    player.jumpTicks = JUMP_DURATION;
    play("powerUp");
    multiplier = 1;
  }
  if (player.isJumping) {
    player.jumpTicks -= input.isPressed ? 0.5 : 1;
    const jumpProgress = player.jumpTicks / JUMP_DURATION;
    player.pos.y = GROUND_Y - Math.sin(jumpProgress * Math.PI) * JUMP_HEIGHT;

    // Rotate and extend sword
    player.swordAngle -= SWORD_ROTATION_SPEED;
    player.swordLength = 8 + (1 - jumpProgress) * (MAX_SWORD_LENGTH - 8);

    if (player.jumpTicks <= 0) {
      play("click");
      player.isJumping = false;
      player.pos.y = GROUND_Y;
      player.swordAngle = PI / 2;
      player.swordLength = 10;
    }
  }

  // Update and draw player
  color("blue");
  box(player.pos, 4, 8);

  // Draw rotating sword
  color("cyan");
  const swordTip = vec(player.swordLength, 0).rotate(player.swordAngle);
  line(
    player.pos.x,
    player.pos.y - 4,
    player.pos.x + swordTip.x,
    player.pos.y - 4 + swordTip.y,
    player.isJumping ? 5 : 2
  );

  // Update and draw enemies
  if (enemies.length === 0 || rnd() < enemySpawnChance) {
    enemies.push({
      pos: vec(205, rnd(30, GROUND_Y - 5)),
      size: rnd(3, 6),
    });
  }

  remove(enemies, (e) => {
    e.pos.x -= SCROLL_SPEED * sqrt(difficulty);
    color("red");
    const isCollidingWithSword = box(e.pos, e.size).isColliding.rect.cyan;
    if (isCollidingWithSword) {
      play("hit");
      addScore(multiplier, e.pos);
      multiplier++;
      return true;
    }
    if (box(e.pos, e.size).isColliding.rect.blue) {
      play("explosion");
      end();
    }
    return e.pos.x < -10;
  });

  // Update and draw ground
  ground.segments.forEach((segment, index) => {
    segment.x -= SCROLL_SPEED * sqrt(difficulty);
    color("green");
    rect(segment.x, GROUND_Y, segment.width - 2, 20);

    if (
      segment.x + segment.width < 200 &&
      index === ground.segments.length - 1
    ) {
      if (rnd() < gapFrequency) {
        const gapWidth = rnd(15, 30);
        ground.segments.push({
          x: segment.x + segment.width + gapWidth,
          width: rnd(30, 100),
        });
      } else {
        ground.segments.push({
          x: segment.x + segment.width,
          width: rnd(50, 150),
        });
      }
    }
  });

  remove(ground.segments, (segment) => {
    if (segment.x + segment.width < 0) {
      return true;
    }
    if (
      !player.isJumping &&
      player.pos.x > segment.x &&
      player.pos.x < segment.x + segment.width
    ) {
      player.pos.y = GROUND_Y;
    }
    return false;
  });

  // Check if player is over a gap
  const isOverGap = !ground.segments.some(
    (segment) =>
      player.pos.x >= segment.x && player.pos.x <= segment.x + segment.width
  );

  if (isOverGap && !player.isJumping) {
    play("explosion");
    end();
  }

  // Increase difficulty over time
  enemySpawnChance = clamp(0.03 + difficulty * 0.01, 0.02, 0.1);
  gapFrequency = clamp(0.3 + difficulty * 0.02, 0.3, 0.7);
}
