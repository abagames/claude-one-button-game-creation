title = "FEEDING FRENZY";

description = `
[Hold]
 Dart and Turn
`;

characters = [
  `
 lll
  lll
l ll l
llllll
l lll
  ll
  `,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  seed: 7,
};

// Define variables for objects.
// Shark:
// - Properties: position, swimming angle, darting state
/** @type {{pos: Vector, angle: number, isDarting: boolean}} */
let shark;
const sharkSpeed = 0.7;
const sharkDartSpeed = 3.9;
// Fish:
// - Properties: position
/** @type {{pos: Vector, angle: number, speed: number, color: Color}[]} */
let fish;
let fishSpawnTicks;

// Define variables for games.
const seabedRadius = 45;
let multiplier;

function update() {
  if (!ticks) {
    // Set the initial state of the game.
    // Shark:
    // - Initial state: Swimming in a circular path around the seabed, centered on the screen
    shark = { pos: vec(50 + seabedRadius, 50), angle: 0, isDarting: false };

    // Fish:
    // - Initial state: Empty array
    fish = [];
    fishSpawnTicks = 0;

    multiplier = 1;
  }

  // Implement the rules of the objects.

  // Seabed:
  // - Shape: Circular area
  // - Color: light_black
  // - Scrolling: The seabed remains stationary throughout the game
  color("light_black");
  arc(50, 50, seabedRadius, 3);

  // Shark:
  // - Shape: Triangle (pointed towards swimming direction)
  // - Color: Black
  // - Behaviors:
  //   - Continuously swims in a circular path around the seabed
  //   - Swimming speed increases gradually over time
  // - One-button Control: Tapping the button initiates the darting behavior towards the seabed
  // - Collision Events:
  //   - Colliding with a fish while darting increases the score and consumes the fish
  color("black");
  if (shark.isDarting) {
    if (input.isPressed) {
      shark.angle -= 0.1 * difficulty;
    }
    shark.pos.addWithAngle(shark.angle, sharkDartSpeed * difficulty);
    if (shark.pos.distanceTo(vec(50, 50)) > seabedRadius) {
      shark.isDarting = false;
      const ca = shark.pos.angleTo(50, 50);
      shark.pos.set(50, 50).addWithAngle(ca + PI, seabedRadius);
    }
  } else {
    shark.angle = shark.pos.angleTo(50, 50) + PI / 2;
    shark.pos.addWithAngle(shark.angle, sharkSpeed * difficulty);
    if (input.isJustPressed) {
      play("laser");
      shark.isDarting = true;
      shark.angle -= 0.5;
      multiplier = 1;
    }
  }
  const triangleHeight = 5;
  const triangleWidth = 3;
  const triangleTip = vec(shark.pos).addWithAngle(shark.angle, triangleHeight);
  const triangleLeft = vec(shark.pos).addWithAngle(
    shark.angle - 2.8,
    triangleWidth
  );
  const triangleRight = vec(shark.pos).addWithAngle(
    shark.angle + 2.8,
    triangleWidth
  );
  line(triangleTip, triangleLeft);
  line(triangleLeft, triangleRight);
  line(triangleRight, triangleTip);

  // Fish:
  // - Shape: Small circle
  // - Appearance Rules:
  //   - Fish spawn at random intervals
  //   - The number of fish spawned increases with difficulty
  // - Collision Events: Getting eaten by the shark removes the fish and increases the score
  fishSpawnTicks--;
  if (fishSpawnTicks < 0) {
    const angle = rnd(PI * 2);
    const radius = rnd(seabedRadius * 0.8);
    const pos = vec(50, 50).addWithAngle(angle, radius);
    fish.push({
      pos,
      angle: wrap(pos.angleTo(50, 50) + rnds(1), 0, PI * 2),
      speed: rnd(0.03, 0.05) * difficulty,
      // @ts-ignore
      color: ["cyan", "blue", "light_blue", "purple"][floor(rnd(4))],
    });
    fishSpawnTicks = (10 * sqrt(fish.length)) / difficulty / difficulty;
  }
  remove(fish, (f) => {
    f.pos.addWithAngle(
      f.angle,
      f.speed *
        (shark.isDarting ? 2.5 : 1) *
        (f.pos.distanceTo(50, 50) > seabedRadius * 1.1 ? 4 : 1)
    );
    color(f.color);
    const c = char("a", f.pos, {
      mirror: { x: f.angle > PI / 2 && f.angle < (PI / 2) * 3 ? -1 : 1 },
    }).isColliding.rect;
    if (c.black) {
      play("coin");
      addScore(multiplier, f.pos);
      particle(f.pos);
      multiplier++;
      return true;
    }
    if (!f.pos.isInRect(0, 0, 100, 100)) {
      play("explosion");
      color("red");
      text("X", f.pos);
      end();
    }
  });
}
