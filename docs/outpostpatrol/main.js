title = `
OUTPOST
PATROL
`;

description = `
[Tap] Jump
`;

options = {
  theme: "shape",
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 7,
};

// Define variables for objects
/** @type {{ pos: Vector, angle: number, isJumping: boolean, jumpHeight: number }} */
let sentry;

/** @type {{ pos: Vector, angle: number }[]} */
let obstacles;
let nextObstacleTicks;

/** @type {{ pos: Vector, angle: number, height: number }[]} */
let bombs;
let nextBombTicks;

/** @type {{ angle: number, width: number }[]} */
let waves;

// Define variables for the game
const trackRadius = 40;
const centerPos = vec(50, 50);
const jumpDuration = 30;
let jumpTicks = 0;

function update() {
  if (!ticks) {
    // Initialize the game state
    sentry = {
      pos: vec(centerPos),
      angle: 0,
      isJumping: false,
      jumpHeight: 0,
    };
    obstacles = [];
    nextObstacleTicks = 0;
    bombs = [];
    nextBombTicks = 0;
    waves = [];
  }

  // Update sentry position and handle jumping
  sentry.angle += 0.02 * difficulty;
  sentry.pos = vec(centerPos).add(vec(trackRadius, 0).rotate(sentry.angle));

  if (input.isJustPressed && !sentry.isJumping) {
    play("jump");
    sentry.isJumping = true;
    jumpTicks = 0;
  }

  if (sentry.isJumping) {
    jumpTicks += (input.isPressed ? 1 : 2) * difficulty;
    sentry.jumpHeight = 10 * Math.sin((jumpTicks / jumpDuration) * Math.PI);
    if (jumpTicks >= jumpDuration) {
      play("hit");
      sentry.isJumping = false;
      sentry.jumpHeight = 0;
    }
  }

  // Spawn and update obstacles
  nextObstacleTicks -= difficulty;
  if (nextObstacleTicks < 0) {
    const angle = sentry.angle + PI;
    let minAo = PI;
    obstacles.forEach((obstacle) => {
      const ao = abs(wrap(obstacle.angle - angle, -PI, PI));
      if (ao < minAo) {
        minAo = ao;
      }
    });
    if (minAo > PI * 0.2) {
      play("laser");
      obstacles.push({
        pos: vec(centerPos),
        angle,
      });
    }
    nextObstacleTicks += rnd(60, 150);
  }

  obstacles.forEach((obstacle) => {
    obstacle.angle -= 0.01 * difficulty;
    obstacle.pos = vec(centerPos).add(
      vec(trackRadius, 0).rotate(obstacle.angle)
    );
  });

  // Spawn and update bombs
  nextBombTicks -= difficulty;
  if (nextBombTicks < 0) {
    play("click");
    bombs.push({
      pos: vec(centerPos),
      angle: rnd(0, 2 * PI),
      height: 10,
    });
    nextBombTicks += rnd(90, 120);
  }

  bombs.forEach((intruder) => {
    intruder.angle -= 0.015 * difficulty;
    intruder.pos = vec(centerPos).add(
      vec(trackRadius, 0).rotate(intruder.angle)
    );
  });

  // Draw the track
  color("light_black");
  arc(centerPos, trackRadius);

  color("yellow");
  remove(waves, (wave) => {
    wave.width += 0.1 * difficulty;
    arc(
      centerPos,
      trackRadius,
      4,
      wave.angle - wave.width / 2,
      wave.angle + wave.width / 2
    );
    return wave.width > 1;
  });

  color("red");
  remove(obstacles, (obstacle) => {
    if (box(obstacle.pos, 5).isColliding.rect.yellow) {
      play("coin");
      addScore(1);
      return true;
    }
  });

  // Draw game objects and check collisions
  color(sentry.isJumping ? "cyan" : "blue");
  if (
    box(vec(sentry.pos).add(0, -sentry.jumpHeight), 7).isColliding.rect.red &&
    !sentry.isJumping
  ) {
    play("explosion");
    end();
  }

  color("yellow");
  remove(bombs, (intruder) => {
    const c = box(vec(intruder.pos).add(0, -intruder.height), 6).isColliding
      .rect;
    if ((c.blue || c.cyan) && sentry.isJumping) {
      play("powerUp");
      waves.push({ angle: intruder.angle, width: 0 });
      return true;
    }
    return false;
  });
}
