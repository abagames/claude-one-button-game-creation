title = "ROTATION ROD";

description = `
[Tap] Turn
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 7,
};

/** @type {{center: Vector, length: number, angle: number, rotationSpeed: number}} */
let player;
/** @type {{pos: Vector, vel: Vector}[]} */
let obstacles;
let nextObstacleTicks;
let lastObstacleSpawn;
/** @type {{pos: Vector, vel: Vector}[]} */
let collectibles;
let nextCollectibleTicks;

let multiplier;

function update() {
  if (!ticks) {
    // Initialize game objects
    player = {
      center: vec(50, 50),
      length: 48,
      angle: 0,
      rotationSpeed: 0.05,
    };
    obstacles = [];
    nextObstacleTicks = 0;
    collectibles = [];
    nextCollectibleTicks = 0;
    multiplier = 1;
  }

  const sd = sqrt(difficulty);

  // Handle input
  if (input.isJustPressed) {
    player.rotationSpeed *= -1;
    play("select");
  }

  // Update bar rotation
  if (!input.isPressed) {
    player.angle += player.rotationSpeed * sd;
  }

  // Draw bar
  color("blue");
  bar(player.center, player.length, 2, player.angle);
  const ap1 = vec(player.center).addWithAngle(
    player.angle,
    player.length * 0.48
  );
  const ap2 = vec(player.center).addWithAngle(
    player.angle + 0.2 * (player.rotationSpeed > 0 ? 1 : -1),
    player.length * 0.42
  );
  line(ap1, ap2);

  // Spawn and update obstacles
  nextObstacleTicks -= sd;
  if (nextObstacleTicks < 0) {
    play("laser");
    lastObstacleSpawn = spawnAtEdge(0.5 * sd);
    obstacles.push({
      pos: vec(lastObstacleSpawn.pos),
      vel: vec(lastObstacleSpawn.vel),
    });
    nextObstacleTicks = 99;
    nextCollectibleTicks = 9;
  }

  color("red");
  remove(obstacles, (o) => {
    o.pos.add(o.vel);
    const isColliding = box(o.pos, 5).isColliding.rect.blue;
    if (isColliding) {
      play("explosion");
      end();
    }
    return !o.pos.isInRect(-5, -5, 110, 110);
  });

  // Spawn and update collectibles
  nextCollectibleTicks -= difficulty;
  if (nextCollectibleTicks < 0) {
    collectibles.push({
      pos: vec(lastObstacleSpawn.pos),
      vel: vec(lastObstacleSpawn.vel),
    });
    nextCollectibleTicks = 9;
  }

  color("yellow");
  remove(collectibles, (c) => {
    c.pos.add(c.vel);
    const isColliding = box(c.pos, 3).isColliding.rect.blue;
    if (isColliding) {
      play("coin");
      addScore(ceil(multiplier), c.pos);
      multiplier += 10;
    }
    return isColliding || !c.pos.isInRect(-5, -5, 110, 110);
  });

  multiplier *= 0.99;
  color("black");
  text(`x${ceil(multiplier)}`, 2, 10, { isSmallText: true });
}

// Helper function to spawn objects at screen edges
function spawnAtEdge(speed) {
  const side = rndi(4);
  let pos, vel;
  switch (side) {
    case 0: // Top
      pos = vec(rnd() < 0.5 ? rnd(20, 40) : rnd(60, 80), -3);
      vel = vec(0, speed);
      break;
    case 1: // Right
      pos = vec(103, rnd() < 0.5 ? rnd(20, 40) : rnd(60, 80));
      vel = vec(-speed, 0);
      break;
    case 2: // Bottom
      pos = vec(rnd() < 0.5 ? rnd(20, 40) : rnd(60, 80), 103);
      vel = vec(0, -speed);
      break;
    case 3: // Left
      pos = vec(-3, rnd() < 0.5 ? rnd(20, 40) : rnd(60, 80));
      vel = vec(speed, 0);
      break;
  }
  return { pos, vel };
}
