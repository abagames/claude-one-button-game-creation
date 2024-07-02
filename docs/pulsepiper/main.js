title = "PULSE PIPER";

description = `
[Hold] Charge
`;

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 1,
};

// Define variables for objects
/** @type {{pos: Vector, charge: number}} */
let pulse;
/** @type {{pos: Vector, size: Vector, gap: number, isDot: boolean}[]} */
let obstacles;
let nextObstacleDist;
let obstacleScore;

// Define constants
const PULSE_SPEED = 0.7;
const CHARGE_RATE = 1;
const OBSTACLE_SPEED = 0.5;
const SPAWN_INTERVAL = 60;
const WIRE_Y = 50;

function update() {
  if (!ticks) {
    // Initialize the game
    pulse = { pos: vec(10, WIRE_Y), charge: 0 };
    obstacles = [];
    nextObstacleDist = 0;
    obstacleScore = 0;
  }

  // Draw the wire
  color("cyan");
  line(0, WIRE_Y, 100, WIRE_Y, 4);

  // Update and draw the pulse
  updatePulse();

  // Update and draw obstacles
  updateObstacles();

  // Spawn new obstacles
  nextObstacleDist -= difficulty;
  if (nextObstacleDist < 0) {
    spawnObstacle();
    nextObstacleDist += SPAWN_INTERVAL;
  }
}

function updatePulse() {
  // Move the pulse
  pulse.pos.x += PULSE_SPEED * difficulty;
  if (pulse.pos.x > 100) pulse.pos.x = 0;

  // Handle charging and bursts
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isPressed) {
    pulse.charge = clamp(pulse.charge + CHARGE_RATE * difficulty, 0, 99);
  }
  if (input.isJustReleased) {
    play("laser");
    color("yellow");
    particle(pulse.pos, 10, 2);
    color("red");
    obstacleScore = floor(pulse.charge);
    pulse.charge = 0;
  } else {
    color("yellow");
  }
  const pulseGap = 4 + pulse.charge;
  box(pulse.pos.x, pulse.pos.y - pulseGap / 2, 8, 4);
  box(pulse.pos.x, pulse.pos.y + pulseGap / 2, 8, 4);
}

function updateObstacles() {
  remove(obstacles, (obstacle) => {
    // Move the obstacle
    obstacle.pos.x -= OBSTACLE_SPEED * difficulty;

    // Draw the obstacle
    color(!obstacle.isDot ? "purple" : "red");
    const obstacleGap = obstacle.gap + obstacle.size.y / 2;
    const c1 = box(
      obstacle.pos.x,
      obstacle.pos.y - obstacleGap,
      obstacle.size.x,
      obstacle.size.y
    ).isColliding.rect;
    const c2 = box(
      obstacle.pos.x,
      obstacle.pos.y + obstacleGap,
      obstacle.size.x,
      obstacle.size.y
    ).isColliding.rect;
    if (obstacle.isDot && (c1.red || c2.red)) {
      play("powerUp");
      color("red");
      particle(obstacle.pos, 15, 3);
      addScore(obstacleScore, obstacle.pos);
      return true;
    }
    if (!obstacle.isDot && (c1.yellow || c2.yellow)) {
      play("explosion");
      end();
    }
    return obstacle.pos.x + obstacle.size.x / 3 < 0;
  });
}

function spawnObstacle() {
  play("click");
  const isDot = rnd() < 0.7;
  const isWall = rnd() < 0.3;
  const size = isDot ? vec(4, 2) : vec(9, isWall ? 50 : 4);
  const gap = isDot
    ? 0
    : !isWall && pulse.pos.x < 40 && rnd() < 0.65
    ? 0
    : rnd(10, 20);
  obstacles.push({ pos: vec(100 + size.x / 2, WIRE_Y), size, gap, isDot });
}
