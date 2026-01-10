import "crisp-game-lib";

const title = "MAGNETIC\nPENDULUM";

const description = `
[Hold] Shorten rope
Collect falling magnets
`;

const characters = [
  `
 rrrr
rRlllr
rlRRRr
rlllRr
rRRRlr
rlllRr
 rrrr
  rr
  `,
  `
 bbbb
blBBlb
bllBlb
blBllb
blBBlb
 bbbb
  bb
  `,
];

const options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 1,
};

// Balance parameters (for coevolution system)
const ROPE_MAX_LENGTH = 66; // 2/3 of screen height
const ROPE_MIN_LENGTH = 10;
const ROPE_CHANGE_SPEED = 1.0;
const PENDULUM_RADIUS = 3;
const ANCHOR_X = 50;
const ANCHOR_Y = 5;
const MAGNET_RADIUS = 4;
const MAGNET_FALL_SPEED_BASE = 0.3;
const MAGNET_SPAWN_INTERVAL_BASE = 90;
const MAGNETIC_FORCE = 0.15;
const MAGNETIC_RANGE = 30;
const GRAVITY_BASE = 0.1;
const DAMPING = 0.99;
const ANGLE_VELOCITY_INIT_BASE = 0.02;
const DIFFICULTY_SPEED_MULT = 0.5; // Magnet speed multiplier per difficulty
const DIFFICULTY_INTERVAL_MULT = 0.3; // Spawn interval divisor per difficulty
const DIFFICULTY_GRAVITY_MULT = 0.3; // Gravity multiplier per difficulty
const DIFFICULTY_SWING_MULT = 0.2; // Initial swing multiplier per difficulty
const FLOOR_RISE_AMOUNT = 10; // How much floor rises when magnet is missed
const FLOOR_LOWER_SPEED = 0.01; // How fast floor lowers over time
const FLOOR_TRANSITION_SPEED = 0.5; // Speed of floor height interpolation
const FLOOR_COLLECT_BONUS = 2; // How much floor lowers when magnet is collected
const MAX_MULTIPLIER = 9; // Maximum score multiplier
const BASE_SCORE = 1; // Base score per magnet

type Pendulum = { pos: Vector; velocity: Vector };
type Magnet = { pos: Vector; velocity: Vector };

let pendulum: Pendulum;
let ropeLength: number;
let angle: number;
let angularVelocity: number;
let magnets: Magnet[];
let magnetSpawnTimer: number;
let floorHeight: number;
let targetFloorHeight: number;
let multiplier: number;

function update() {
  if (!ticks) {
    // Initialize
    ropeLength = ROPE_MAX_LENGTH;
    angle = 0;
    angularVelocity =
      ANGLE_VELOCITY_INIT_BASE * (1 + difficulty * DIFFICULTY_SWING_MULT);
    pendulum = {
      pos: vec(ANCHOR_X, ANCHOR_Y + ropeLength),
      velocity: vec(0, 0),
    };
    magnets = [];
    magnetSpawnTimer =
      MAGNET_SPAWN_INTERVAL_BASE / (1 + difficulty * DIFFICULTY_INTERVAL_MULT);
    floorHeight = 100; // Start at bottom of screen
    targetFloorHeight = 100; // Target floor height
    multiplier = 1; // Start with 1x multiplier
  }

  // Target floor slowly lowers over time
  targetFloorHeight = Math.min(100, targetFloorHeight + FLOOR_LOWER_SPEED);

  // Smoothly interpolate floorHeight towards targetFloorHeight
  const heightDiff = targetFloorHeight - floorHeight;
  floorHeight += heightDiff * FLOOR_TRANSITION_SPEED;

  // Rope length control
  if (input.isPressed) {
    ropeLength = Math.max(ROPE_MIN_LENGTH, ropeLength - ROPE_CHANGE_SPEED);
  } else {
    ropeLength = Math.min(ROPE_MAX_LENGTH, ropeLength + ROPE_CHANGE_SPEED);
  }

  // Spawn magnets (with difficulty-based speed and interval)
  magnetSpawnTimer--;
  if (magnetSpawnTimer <= 0) {
    const spawnX = rnd(15, 85);
    const magnetSpeed =
      MAGNET_FALL_SPEED_BASE * (1 + difficulty * DIFFICULTY_SPEED_MULT);
    magnets.push({
      pos: vec(spawnX, 0),
      velocity: vec(0, magnetSpeed),
    });
    magnetSpawnTimer =
      MAGNET_SPAWN_INTERVAL_BASE / (1 + difficulty * DIFFICULTY_INTERVAL_MULT);
  }

  // Draw anchor point
  color("light_black");
  box(ANCHOR_X, ANCHOR_Y, 4, 2);

  // Display multiplier below score
  color("black");
  text(`x${multiplier}`, 3, 9, { isSmallText: true });

  // Draw floor (rises when magnets are missed)
  if (floorHeight < 100) {
    color("black");
    rect(0, floorHeight, 100, 100 - floorHeight);
  }

  // Update pendulum physics
  // Apply magnetic forces from all magnets
  let totalMagneticForceX = 0;
  let totalMagneticForceY = 0;

  magnets.forEach((magnet) => {
    const dx = magnet.pos.x - pendulum.pos.x;
    const dy = magnet.pos.y - pendulum.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MAGNETIC_RANGE && dist > 0) {
      const force = MAGNETIC_FORCE * (1 - dist / MAGNETIC_RANGE);
      totalMagneticForceX += (dx / dist) * force;
      totalMagneticForceY += (dy / dist) * force;
    }
  });

  // Apply forces to angular velocity
  // Tangential direction (perpendicular to rope, in direction of increasing angle)
  const tangentialForceX = Math.cos(angle);
  const tangentialForceY = -Math.sin(angle);
  const tangentialMagneticForce =
    totalMagneticForceX * tangentialForceX +
    totalMagneticForceY * tangentialForceY;

  // Angular acceleration from gravity and magnetic force
  // Pendulum equation: d²θ/dt² = -(g/L) * sin(θ)
  // Gravity increases with difficulty
  const currentGravity =
    GRAVITY_BASE * (1 + difficulty * DIFFICULTY_GRAVITY_MULT);
  const angularAcceleration =
    -(currentGravity * Math.sin(angle)) / ropeLength +
    tangentialMagneticForce / ropeLength;

  angularVelocity += angularAcceleration;
  angularVelocity *= DAMPING;
  angle += angularVelocity;

  // Update pendulum position
  pendulum.pos.x = ANCHOR_X + Math.sin(angle) * ropeLength;
  pendulum.pos.y = ANCHOR_Y + Math.cos(angle) * ropeLength;

  // Draw magnetic attraction lines
  color("light_red");
  magnets.forEach((magnet) => {
    const dx = magnet.pos.x - pendulum.pos.x;
    const dy = magnet.pos.y - pendulum.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MAGNETIC_RANGE && dist > 0) {
      line(pendulum.pos.x, pendulum.pos.y, magnet.pos.x, magnet.pos.y, 1);
    }
  });

  // Draw rope
  color("light_blue");
  line(ANCHOR_X, ANCHOR_Y, pendulum.pos.x, pendulum.pos.y, 2);

  // Draw pendulum (N pole - blue)
  color("black");
  char("b", pendulum.pos);

  // Check floor collision
  if (pendulum.pos.y + PENDULUM_RADIUS > floorHeight) {
    play("explosion");
    end();
  }

  // Update and draw magnets
  color("black");
  magnets = magnets.filter((magnet) => {
    magnet.pos.add(magnet.velocity);

    // Draw magnet (S pole - red)
    const isColliding = char("a", magnet.pos).isColliding.char?.b;

    if (isColliding) {
      // Collect magnet
      play("coin");
      particle(magnet.pos, 10, 2);
      addScore(BASE_SCORE * multiplier, magnet.pos);
      multiplier = Math.min(MAX_MULTIPLIER, multiplier + 1);
      // Floor lowers slightly as reward
      targetFloorHeight = Math.min(
        100,
        targetFloorHeight + FLOOR_COLLECT_BONUS
      );
      return false;
    }

    // Check if magnet hit the floor
    if (magnet.pos.y + MAGNET_RADIUS > floorHeight) {
      // Floor rises as penalty (target rises, actual height interpolates)
      play("hit");
      targetFloorHeight = Math.max(0, targetFloorHeight - FLOOR_RISE_AMOUNT);
      multiplier = 1; // Reset multiplier
      return false;
    }

    return true;
  });
}

init({ options, title, description, characters, update });
