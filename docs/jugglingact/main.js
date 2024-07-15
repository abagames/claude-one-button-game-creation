title = "JUGGLING ACT";

description = `
[Hold] Throw ball back
[Release] Move
`;

characters = [
  `
  lll
  lll
  ll
  ll
 llll
ll  ll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 1,
};

// Define variables for game objects
/** @type {{ pos: Vector, velX: number, state: "ready" | "catch" }} */
let juggler;

/** @type {{ pos: Vector, vel: Vector, state: "falling" | "rising" }[]} */
let balls;

let nextBallSpawnTime;
const gravity = 0.02;
const throwVelocity = 2;
const jugglerVelocity = 0.36;

function update() {
  if (!ticks) {
    // Initialize game objects
    juggler = {
      pos: vec(50, 90),
      velX: 0,
      state: "ready",
    };
    balls = [];
    nextBallSpawnTime = 0;
  }
  const sd = sqrt(difficulty);

  // Handle juggler controls
  if (input.isJustPressed) {
    play("select");
    juggler.state = "catch";
  } else if (input.isJustReleased) {
    juggler.state = "ready";
  }

  // Move juggler towards the nearest ball
  if (!input.isPressed) {
    let nearestBall = findNearestBall();
    if (nearestBall) {
      let moveDirection = nearestBall.pos.x > juggler.pos.x ? 1 : -1;
      juggler.velX += moveDirection * jugglerVelocity;
    }
  }
  juggler.velX *= 0.85;
  juggler.pos.x += juggler.velX * sd;
  if (
    (juggler.pos.x < 5 && juggler.velX < 0) ||
    (juggler.pos.x > 95 && juggler.velX > 0)
  ) {
    juggler.velX *= -0.5;
  }

  // Update and draw juggler
  color("blue");
  const handOffset = juggler.state === "catch" ? -5 : 0;
  box(juggler.pos.x - 5, juggler.pos.y + handOffset, 3, 3);
  box(juggler.pos.x + 5, juggler.pos.y + handOffset, 3, 3);
  char("a", juggler.pos, { mirror: { x: juggler.velX > 0 ? 1 : -1 } });

  // Update and draw balls
  color("red");
  remove(balls, (ball) => {
    ball.pos.add(vec(ball.vel).mul(sd));
    ball.vel.mul(0.99);
    if (
      (ball.pos.x < 0 && ball.vel.x < 0) ||
      (ball.pos.x > 100 && ball.vel.x > 0)
    ) {
      ball.vel.x *= -1;
    }

    if (ball.state === "falling") {
      ball.vel.y += gravity * sd;

      // Check for collisions with juggler's hands
      if (
        juggler.state === "catch" &&
        ball.pos.y > juggler.pos.y - 8 &&
        ball.pos.y < juggler.pos.y
      ) {
        if (Math.abs(ball.pos.x - juggler.pos.x) < 10) {
          play("jump");
          ball.state = "rising";
          ball.vel.y = -throwVelocity;
          ball.vel.x = (ball.pos.x - juggler.pos.x) / 10 + rnds(0.1);
          addScore(balls.length, ball.pos);
        }
      }
    } else {
      // Rising ball
      ball.vel.y += gravity * sd;
      if (ball.vel.y >= 0) {
        ball.state = "falling";
      }
    }

    // Draw the ball
    arc(ball.pos, 2);

    // Remove balls that fall off the screen
    if (ball.pos.y > 100) {
      play("click");
      return true;
    }
  });

  // Spawn new balls
  nextBallSpawnTime -= sd;
  if (nextBallSpawnTime <= 0) {
    play("laser");
    balls.push({
      pos: vec(rnd(10, 90), 0),
      vel: vec(0, 0),
      state: "falling",
    });
    nextBallSpawnTime = 200;
  }

  // End game if all balls are lost
  if (balls.length === 0) {
    play("explosion");
    end();
  }
}

// Helper function to find the nearest falling ball
function findNearestBall() {
  let nearestBall = null;
  let nearestDistance = Infinity;

  balls.forEach((ball) => {
    if (ball.state === "falling") {
      let distance = Math.abs(ball.pos.y - juggler.pos.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestBall = ball;
      }
    }
  });

  return nearestBall;
}
