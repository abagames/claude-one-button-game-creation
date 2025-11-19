import "crisp-game-lib";

// Game: Arc Spinner
// Tags: player:rotate, weapon:arc, rule:proximity_bonus, on_holding:rotate

// Balance parameters
const ROTATION_SPEED = 0.005; // Base rotation speed (slow when not holding)
const ROTATION_FAST_FACTOR = 7; // Rotation speed multiplier when holding button
const PLAYER_MOVE_SPEED = 0.5; // Forward movement speed (fast when not holding)
const PLAYER_MOVE_SLOW_FACTOR = 0.2; // Movement speed multiplier when holding button
const ARC_WIDTH = 1.0; // Width of attack arc (radians)
const ARC_RANGE = 10; // Minimum attack range
const ARC_RANGE_MAX = 80; // Maximum attack range when fully charged
const CHARGE_TIME = 60; // Frames to fully charge
const ENEMY_SPAWN_INTERVAL = 45; // Frames between enemy spawns
const ENEMY_SPEED = 0.15; // Base enemy movement speed (slower)

const title = "ARC SPIN";

const description = `
[Hold]
  Charge shot
[Release]
  Fire arc
`;

const characters: string[] = [];

const options = {
  theme: "dark" as const,
  isPlayingBgm: true,
  isReplayEnabled: true,
  isShowingScoreFront: true,
  audioSeed: 47,
};

type Enemy = {
  pos: Vector;
  speed: number;
  id: number;
};

type Shot = {
  pos: Vector;
  angle: number;
  range: number;
  radius: number;
  killCount: number;
};

let playerAngle: number;
let playerPos: Vector;
let enemies: Enemy[];
let enemySpawnTicks: number;
let shot: Shot | null;
let chargeTicks: number;
let enemyIdCounter: number;

function update() {
  if (!ticks) {
    playerAngle = 0;
    playerPos = vec(50, 50);
    enemies = [];
    enemySpawnTicks = 0;
    shot = null;
    chargeTicks = 0;
    enemyIdCounter = 0;
  }

  // Draw background grid for spatial awareness
  color("light_blue");
  for (let r = 20; r <= 60; r += 20) {
    arc(50, 50, r, 1);
  }
  for (let i = 0; i < 8; i++) {
    const angle = (PI * 2 * i) / 8;
    line(50, 50, vec(60).rotate(angle).add(50, 50), 1);
  }

  // Update player rotation
  // When holding: fast rotation, when not holding: slow rotation
  const rotationSpeed = input.isPressed
    ? ROTATION_SPEED * ROTATION_FAST_FACTOR
    : ROTATION_SPEED;
  playerAngle += rotationSpeed * difficulty;

  // Track charge duration
  if (input.isPressed) {
    chargeTicks = min(chargeTicks + 1, CHARGE_TIME);
  }

  // Move player forward in facing direction
  // When holding: slow movement, when not holding: fast movement
  const moveSpeed = input.isPressed
    ? PLAYER_MOVE_SPEED * PLAYER_MOVE_SLOW_FACTOR
    : PLAYER_MOVE_SPEED;
  playerPos.add(vec(moveSpeed).rotate(playerAngle));

  // Keep player on screen
  playerPos.clamp(5, 95, 5, 95);

  // Draw player
  color("cyan");
  box(playerPos, 4, 4);

  // Draw direction indicator
  color("light_cyan");
  line(playerPos, vec(8).rotate(playerAngle).add(playerPos), 2);

  // Draw charge indicator when holding
  if (input.isPressed) {
    const chargeRatio = chargeTicks / CHARGE_TIME;
    const currentRange = ARC_RANGE + (ARC_RANGE_MAX - ARC_RANGE) * chargeRatio;
    const arcFrom = playerAngle - ARC_WIDTH / 2;
    const arcTo = playerAngle + ARC_WIDTH / 2;

    color("green");
    arc(playerPos, currentRange, 2, arcFrom, arcTo);
  }

  // Handle shooting - fire on release
  if (input.isJustReleased && chargeTicks > 0 && !shot) {
    const chargeRatio = chargeTicks / CHARGE_TIME;
    const shotRange = ARC_RANGE + (ARC_RANGE_MAX - ARC_RANGE) * chargeRatio;

    shot = {
      pos: vec(playerPos),
      angle: playerAngle,
      range: shotRange,
      radius: 0,
      killCount: 0,
    };
    play("laser");

    // Reset charge after firing
    chargeTicks = 0;
  }

  // Update and draw shot
  if (shot) {
    // Expand arc radius
    const EXPAND_SPEED = 3;
    shot.radius += EXPAND_SPEED;

    const arcFrom = shot.angle - ARC_WIDTH / 2;
    const arcTo = shot.angle + ARC_WIDTH / 2;

    // Draw expanding arc from fixed position
    color("yellow");
    arc(shot.pos, shot.radius, 3, arcFrom, arcTo);

    // Remove shot when radius exceeds range
    if (shot.radius >= shot.range) {
      shot = null;
    }
  }

  // Spawn enemies
  enemySpawnTicks--;
  if (enemySpawnTicks <= 0) {
    const angle = rnd(PI * 2);
    const spawnDist = 70;
    const spawnPos = vec(spawnDist).rotate(angle).add(50, 50);
    // Add speed variance for variety
    enemies.push({
      pos: spawnPos,
      speed: ENEMY_SPEED * rnd(1, sqrt(difficulty)),
      id: enemyIdCounter++,
    });
    enemySpawnTicks = ENEMY_SPAWN_INTERVAL / sqrt(difficulty);
  }

  // Update and draw enemies
  remove(enemies, (e) => {
    // Chase player
    const dir = vec(playerPos).sub(e.pos).normalize();
    const speed = e.speed;
    e.pos.add(dir.mul(speed));

    // Draw direction indicator (arrow pointing to player)
    color("red");
    line(e.pos, vec(5).rotate(dir.angle).add(e.pos), 1);

    // Draw enemy with pulsing animation
    color("red");
    const pulseSize = 5 + sin(ticks * 0.1 + e.id) * 0.5;
    const collision = box(e.pos, pulseSize, pulseSize).isColliding.rect;
    if (collision?.cyan) {
      play("explosion");
      end();
      return true;
    }

    // Check collision with shot
    if (collision?.yellow && shot) {
      shot.killCount++;
      addScore(shot.killCount, e.pos);
      play("powerUp");
      particle(e.pos, 10, 2);
      return true;
    }
  });
}

init({ update, title, description, characters, options });
