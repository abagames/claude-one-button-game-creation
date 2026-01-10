title = "JPADDLE";

description = `
[Tap]  Jump/Turn
[Hold] Move
`;

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 4,
};

let paddle;
let balls;
let jumpCounter;
let jumpToggle;
const jumpHeight = 12;
const maxJumps = 99;
const paddleSize = 6;
const ballSpeed = 1;
const spawnInterval = 60;

function update() {
  if (!ticks) {
    paddle = vec(50, 90);
    balls = [];
    jumpCounter = 0;
    jumpToggle = 0;
  }

  // Paddle movement
  if (input.isJustPressed && jumpCounter < maxJumps) {
    // Jump up
    paddle.y -= jumpHeight / (jumpCounter + 1);
    jumpCounter++;
    jumpToggle++;
    play("jump");
  } else {
    // Fall down
    paddle.y += difficulty * 0.1;
  }

  if (input.isPressed) {
    // Slant paddle while jumping
    if (jumpCounter > 0) {
      paddle.x += difficulty * 0.5 * (jumpToggle % 2 === 1 ? 1 : -1);
    }
  }

  paddle.clamp(3, 97, 30, 110);

  // Draw objects
  color("cyan");
  rect(paddle.x - paddleSize / 2, paddle.y - 2, paddleSize, 4);

  color("black");
  // Update balls
  balls.forEach((b) => {
    b.pos.x += b.vel.x * ballSpeed * difficulty;
    b.pos.y += b.vel.y * ballSpeed * difficulty;

    if (b.pos.x < 0 || b.pos.x > 97) {
      // Bounce off walls
      b.vel.x *= -1;
      play("hit");
    }

    if (arc(b.pos, 3).isColliding.rect.cyan && b.vel.y > 0) {
      // Deflect off paddle
      b.pos.y = paddle.y - 3;
      b.vel.y *= -1;
      addScore(99 - b.pos.y, b.pos);
      play("powerUp");
      jumpCounter -= 9;
      if (jumpCounter < 0) {
        jumpCounter = 0;
      }
    }

    if (b.pos.y > 100) {
      // Remove when off-screen
      remove(balls, (x) => x === b);
    }
  });

  // Spawn balls
  if (ticks % floor(spawnInterval / difficulty) === 0) {
    balls.push({
      pos: vec(rnd(10, 90), 0),
      vel: vec(rnd(-1, 1), 1).normalize(),
    });
    play("laser");
  }

  // Game over
  if (paddle.y > 99) {
    play("explosion");
    end();
  }
}
