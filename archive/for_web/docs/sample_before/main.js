// Define variables for game objects
/** @type {{pos: Vector, vel: Vector, size: Vector}} */
let paraglider;
/** @type {{pos: Vector, size: Vector, health: number}[]} */
let pillars;
/** @type {{pos: Vector, radius: number, maxRadius: number}[]} */
let shockwaves;

// Define game constants
const SCROLL_SPEED = 1;
const GRAVITY = 0.1;
const JUMP_FORCE = 1.5;
const SHOCKWAVE_SPEED = 0.5;
const MAX_SHOCKWAVE_RADIUS = 20;
const PILLAR_SPAWN_RATE = 50;
const PILLAR_WIDTH = 8;
const MIN_PILLAR_HEIGHT = 20;
const MAX_PILLAR_HEIGHT = 60;
const PILLAR_GAP = 40;

// Helper function for circle-rectangle collision
function circleRectCollision(circlePos, circleRadius, rectPos, rectSize) {
  const closestX = clamp(circlePos.x, rectPos.x, rectPos.x + rectSize.x);
  const closestY = clamp(circlePos.y, rectPos.y, rectPos.y + rectSize.y);
  const distanceX = circlePos.x - closestX;
  const distanceY = circlePos.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared < circleRadius * circleRadius;
}

function update() {
  if (!ticks) {
    // Initialize game objects
    paraglider = { pos: vec(20, 50), vel: vec(0, 0), size: vec(3, 3) };
    pillars = [];
    shockwaves = [];
  }

  // Update paraglider
  paraglider.pos.y += paraglider.vel.y;
  paraglider.vel.y += GRAVITY;

  // Handle button input (jump and create shockwave)
  if (input.isJustPressed) {
    paraglider.vel.y = -JUMP_FORCE;
    shockwaves.push({
      pos: vec(paraglider.pos),
      radius: 0,
      maxRadius: MAX_SHOCKWAVE_RADIUS,
    });
  }

  // Clamp paraglider position
  paraglider.pos.y = clamp(paraglider.pos.y, 0, 99);

  // Update pillars
  pillars.forEach((p) => {
    p.pos.x -= SCROLL_SPEED;
  });

  // Remove off-screen pillars
  remove(pillars, (p) => p.pos.x < -PILLAR_WIDTH);

  // Generate new pillars
  if (ticks % PILLAR_SPAWN_RATE === 0 || pillars.length === 0) {
    const height = rnd(MIN_PILLAR_HEIGHT, MAX_PILLAR_HEIGHT);
    pillars.push({
      pos: vec(100, rnd(0, 100 - height)),
      size: vec(PILLAR_WIDTH, height),
      health: 3,
    });
  }

  // Update shockwaves
  shockwaves.forEach((s) => {
    s.radius += SHOCKWAVE_SPEED;
  });

  // Remove completed shockwaves
  remove(shockwaves, (s) => s.radius >= s.maxRadius);

  // Check shockwave collision with pillars
  shockwaves.forEach((s) => {
    pillars.forEach((p) => {
      if (circleRectCollision(s.pos, s.radius, p.pos, p.size)) {
        p.health = Math.max(0, p.health - 1);
      }
    });
  });

  // Remove destroyed pillars
  remove(pillars, (p) => p.health <= 0);

  // Draw game objects
  // Draw paraglider
  color("red");
  box(paraglider.pos, paraglider.size);

  // Draw pillars
  pillars.forEach((p) => {
    color(p.health === 3 ? "cyan" : p.health === 2 ? "yellow" : "light_red");
    box(p.pos, p.size);
  });

  // Draw shockwaves
  color("purple");
  shockwaves.forEach((s) => {
    arc(s.pos, s.radius);
  });

  // Check collision with pillars (game over condition)
  if (pillars.some((p) => box(p.pos, p.size).isColliding.rect.red)) {
    end();
  }

  // Update score
  addScore(1);
}
