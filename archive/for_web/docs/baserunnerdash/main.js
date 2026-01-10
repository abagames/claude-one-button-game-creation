title = "BASERUNNER DASH";

description = `
[Hold] Run forward
[Release] Run back
`;

characters = [];

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 60,
};

/** @type {{pos: Vector, targetBase: number, currentBase: number, speed: number, isOnBase: boolean}} */
let runner;
/** @type {{pos: Vector, targetBase: number, currentBase: number, speed: number, isThrown: boolean}} */
let ball;
/** @type {{positions: Vector[]}} */
let bases;

const baseRadius = 3;
const runnerRadius = 4;
const ballRadius = 2;

function update() {
  if (!ticks) {
    // Initialize game objects and variables
    bases = {
      positions: [
        vec(50, 90), // Home
        vec(90, 50), // First
        vec(50, 10), // Second
        vec(10, 50), // Third
      ],
    };
    runner = {
      pos: vec(bases.positions[1]),
      targetBase: 2,
      currentBase: 1,
      speed: 0.6,
      isOnBase: true,
    };
    ball = {
      pos: vec(bases.positions[0]),
      targetBase: 2,
      currentBase: 0,
      speed: 0.3,
      isThrown: true,
    };
  }

  // Update runner position
  const currentBase = bases.positions[runner.currentBase];
  const nextBase = bases.positions[runner.targetBase];
  const runnerSpeed = runner.speed * difficulty;
  if (input.isJustPressed || input.isJustReleased) {
    play("click");
  }
  if (input.isPressed) {
    runner.pos.add(vec(nextBase).sub(runner.pos).normalize().mul(runnerSpeed));
    runner.isOnBase = false;
    if (runner.pos.distanceTo(nextBase) < runnerSpeed) {
      play("coin");
      addScore(1);
      runner.pos.set(nextBase);
      runner.currentBase = runner.targetBase;
      runner.targetBase = (runner.targetBase + 1) % 4;
      runner.isOnBase = true;
    }
  } else {
    if (runner.pos.distanceTo(currentBase) < runnerSpeed) {
      runner.pos.set(currentBase);
      if (!runner.isOnBase) {
        play("hit");
      }
      runner.isOnBase = true;
    } else {
      runner.pos.add(
        vec(currentBase).sub(runner.pos).normalize().mul(runnerSpeed)
      );
    }
  }

  // Update ball position
  const targetPos = bases.positions[ball.targetBase];
  const ballSpeed = ball.speed * (ball.isThrown ? 3 : 1) * difficulty;
  ball.pos.add(vec(targetPos).sub(ball.pos).normalize().mul(ballSpeed));
  if (ball.pos.distanceTo(targetPos) < ballSpeed) {
    ball.isThrown = false;
    ball.pos.set(targetPos);
    ball.currentBase = ball.targetBase;
    ball.targetBase =
      ball.targetBase === runner.currentBase
        ? runner.targetBase
        : runner.currentBase;
  } else if (!ball.isThrown && rnd() < 0.05 * difficulty) {
    play("powerUp");
    ball.isThrown = true;
    if (
      ball.currentBase !== runner.currentBase &&
      ball.currentBase !== runner.targetBase
    ) {
      ball.targetBase = runner.targetBase;
    }
  }

  // Draw bases
  color("light_black");
  bases.positions.forEach((basePos) => {
    box(basePos, baseRadius * 2);
  });

  // Draw runner
  color(runner.isOnBase ? "light_blue" : "blue");
  box(runner.pos, runnerRadius * 2);

  // Draw ball
  color(ball.isThrown ? "light_red" : "red");
  if (box(ball.pos, ballRadius * 2).isColliding.rect.blue && !ball.isThrown) {
    play("explosion");
    end();
  }
}
