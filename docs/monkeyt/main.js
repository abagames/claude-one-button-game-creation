title = "MONKEY T";

description = `
[Hold]
  Compress
[Release]
  Launch
`;

characters = [
  `
l  ll
l l  l
l  ll
 lll l
lll  l
  `,
  `
  lll
   l
  l l
  l l l
 l l l
l l l 
  `,
  `
llll
 llll
  llll
 lll
ll  l
  `,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

// Define variables for game objects
// Monkey:
// - Properties: position, velocity
/** @type {Vector} */
let monkeyPosition;
/** @type {Vector} */
let monkeyVelocity;
let monkeyCollectingCount;

// Trampoline:
// - Properties: compression, launchPower
/** @type {number} */
let trampolineCompression;
/** @type {number} */
let trampolineLaunchPower;

// Collectibles (Bananas, etc.):
// - Properties: position, points
/** @type {{position: Vector}[]} */
let collectibles;

// Hazards (Birds, Airplanes, etc.):
// - Properties: position, speed
/** @type {{position: Vector, speed: number}[]} */
let hazards;

let multiplier;

function update() {
  if (!ticks) {
    // Initialize the game objects
    // Monkey:
    // - Initial state: Positioned at the center of the trampoline.
    monkeyPosition = vec(50, 90);
    monkeyVelocity = vec(0.3, 0);
    monkeyCollectingCount = 0;

    // Trampoline:
    // - Initial state: Uncompressed at the bottom of the screen.
    trampolineCompression = 0;
    trampolineLaunchPower = 0;

    addCollectables();

    // Hazards (Birds, Airplanes, etc.):
    // - Initial state: Spawned at the right edge of the screen, at varying heights.
    hazards = times(3, (i) => {
      return {
        position: vec(rnd(10, 90), rnd(10, 70)),
        speed: 0.5 + i * 0.1,
      };
    });

    multiplier = 1;
  }

  // Trampoline:
  // - One-button controls: Compress the trampoline by holding the button. Launch the monkey by releasing the button.
  // - Behaviors: Compresses downwards when the button is held. Launches the monkey upwards when released, with launch power proportional to the compression level.
  if (input.isPressed) {
    trampolineCompression = Math.min(trampolineCompression + 1, 30);
  } else if (input.isJustReleased) {
    trampolineLaunchPower = trampolineCompression;
    trampolineCompression = 0;
    monkeyCollectingCount = 0;
  }
  const trampolineHeight =
    90 + trampolineCompression * 0.25 + trampolineLaunchPower * 0.25;
  color("black");
  line(25, trampolineHeight, 75, trampolineHeight, 2);

  // Monkey:
  // - Behaviors: Falls downward due to gravity. Bounces upwards when launched from the trampoline.
  // - Collision events: Collects bananas and other collectibles upon contact. Game over if colliding with a hazard.
  monkeyVelocity.y += 0.1;
  monkeyPosition.add(monkeyVelocity.x * difficulty, monkeyVelocity.y);
  if (
    (monkeyPosition.x < 25 && monkeyVelocity.x < 0) ||
    (monkeyPosition.x > 75 && monkeyVelocity.x > 0)
  ) {
    monkeyVelocity.x = -monkeyVelocity.x;
  }

  color("red");
  const isMonkeyCollided = char("a", monkeyPosition, {
    mirror: { x: monkeyVelocity.x > 0 ? 1 : -1 },
  }).isColliding.rect;
  if (isMonkeyCollided.black && monkeyVelocity.y > 0) {
    monkeyPosition.y = trampolineHeight - 5;
    monkeyVelocity.y = -monkeyVelocity.y * 0.2 - trampolineLaunchPower * 0.13;
    if (trampolineLaunchPower > 1) {
      play("jump");
      trampolineLaunchPower = 0;
    }
  }

  // Collectibles (Bananas, etc.):
  // - Collision events: Collected by the monkey upon contact, awarding points.
  color("yellow");
  remove(collectibles, (c) => {
    const isBananaCollected = char("b", c.position).isColliding.char;
    if (isBananaCollected["a"]) {
      play("coin");
      multiplier += monkeyCollectingCount;
      monkeyCollectingCount++;
      addScore(multiplier, monkeyPosition);
      particle(c.position);
      return true;
    }
  });
  if (collectibles.length === 0) {
    addCollectables();
  }

  // Hazards (Birds, Airplanes, etc.):
  // - Behaviors: Move horizontally from right to left at a constant speed.
  // - Collision events: End the game if the monkey collides with a hazard.
  color("black");
  remove(hazards, (h) => {
    h.position.x +=
      h.speed *
      ((h.position.x < 10 && h.speed > 0) || (h.position.x > 90 && h.speed < 0)
        ? 0.5
        : 1);
    if (
      (h.position.x < -10 && h.speed < 0) ||
      (h.position.x > 110 && h.speed > 0)
    ) {
      h.position.y = rnd(10, 70);
      h.speed = -h.speed;
    }
    const isHazardCollided = char("c", h.position, {
      mirror: { x: h.speed > 0 ? 1 : -1 },
    }).isColliding.char;
    if (isHazardCollided["a"]) {
      play("explosion");
      end();
    }
  });
  text(`x${multiplier}`, 3, 10);
}

function addCollectables() {
  // Collectibles (Bananas, etc.):
  // - Initial state: Randomly positioned at various heights above the trampoline.
  collectibles = times(5, () => {
    return {
      position: vec(rnd(30, 70), rnd(20, 70)),
    };
  });
}
