title = "PRESSBOUND";

description = `
[Hold] Charge
[Release] Push walls
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let balls;
let wallPress;
let charge;
let maxCharge;
let frozen;
let lastAddTime;

function update() {
  if (!ticks) {
    balls = [];
    for (let i = 0; i < 3; i++) {
      balls.push({
        pos: vec(50 + rnd(-10, 10), 50 + rnd(-10, 10)),
        vel: vec(rnd(-1, 1), rnd(-1, 1)).normalize().mul(1.2),
      });
    }
    wallPress = 5;
    charge = 0;
    maxCharge = 60;
    frozen = false;
    lastAddTime = 0;
  }

  // Add ball every 30 seconds (max 5)
  if (ticks - lastAddTime > 1800 && balls.length < 5) {
    balls.push({
      pos: vec(50, 50),
      vel: vec(rnd(-1, 1), rnd(-1, 1)).normalize().mul(1.2),
    });
    lastAddTime = ticks;
    play("powerUp");
  }

  // Walls always press in - speed increases with difficulty
  let pressSpeed = 0.12 + difficulty * 0.02;
  wallPress += pressSpeed;

  // Input handling
  if (input.isJustPressed) {
    frozen = true;
    play("select");
  }

  if (input.isPressed) {
    // Charging while holding
    if (charge < maxCharge) {
      charge += 1;
    }
  }

  if (input.isJustReleased) {
    // Release pushes walls back proportional to charge
    let pushBack = charge * 0.5;
    wallPress -= pushBack;
    if (wallPress < 2) wallPress = 2;

    // Score bonus for well-timed releases
    if (charge > 30 && wallPress < 25) {
      addScore(floor(charge / 10));
      play("coin");
    }

    charge = 0;
    frozen = false;
    play("jump");

    // Balls get a speed boost on release
    balls.forEach((b) => {
      b.vel = b.vel.normalize().mul(1.5 + rnd(0.5));
    });
  }

  // Game over if walls reach max
  let maxWall = 43;
  if (wallPress >= maxWall) {
    play("explosion");
    end();
  }

  // Update ball positions (only when not frozen)
  if (!frozen) {
    balls.forEach((b) => {
      b.pos.x += b.vel.x;
      b.pos.y += b.vel.y;

      // Bounce off current wall positions
      let margin = 4;
      let minB = wallPress + margin;
      let maxB = 100 - wallPress - margin;

      if (b.pos.x < minB) {
        b.pos.x = minB;
        b.vel.x = abs(b.vel.x);
      }
      if (b.pos.x > maxB) {
        b.pos.x = maxB;
        b.vel.x = -abs(b.vel.x);
      }
      if (b.pos.y < minB) {
        b.pos.y = minB;
        b.vel.y = abs(b.vel.y);
      }
      if (b.pos.y > maxB) {
        b.pos.y = maxB;
        b.vel.y = -abs(b.vel.y);
      }

      // Speed decay
      b.vel.mul(0.998);
      if (b.vel.length < 0.8) {
        b.vel = b.vel.normalize().mul(0.9);
      }
    });
  }

  // Score per second survived
  if (ticks % 60 === 0) {
    addScore(1);
  }

  // Draw charge bar
  color("black");
  rect(5, 3, 90, 5);
  color(charge > 45 ? "yellow" : "green");
  rect(6, 4, (charge / maxCharge) * 88, 3);

  // Draw walls
  let wallColor = "purple";
  if (wallPress > 35) {
    wallColor = floor(ticks / 4) % 2 === 0 ? "red" : "purple";
  }
  color(wallColor);
  let wp = wallPress;
  rect(0, 0, wp, 100);
  rect(100 - wp, 0, wp, 100);
  rect(wp, 0, 100 - wp * 2, wp);
  rect(wp, 100 - wp, 100 - wp * 2, wp);

  // Check ball crush and draw balls
  let crushed = false;
  balls.forEach((b) => {
    // Frozen balls can be crushed by walls
    let crushMargin = frozen ? 6 : 4;
    if (
      b.pos.x < wallPress + crushMargin ||
      b.pos.x > 100 - wallPress - crushMargin ||
      b.pos.y < wallPress + crushMargin ||
      b.pos.y > 100 - wallPress - crushMargin
    ) {
      crushed = true;
    }

    // Draw ball - flash when frozen
    if (frozen) {
      color(floor(ticks / 3) % 2 === 0 ? "blue" : "light_blue");
    } else {
      color("cyan");
    }
    box(b.pos, 5);
  });

  if (crushed) {
    play("explosion");
    end();
  }

  // Ball count
  color("black");
  text(`x${balls.length}`, 3, 97);
}
