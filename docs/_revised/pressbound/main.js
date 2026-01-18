title = "PRESSBOUND";

description = `
[Hold] Charge
[Release] Push walls
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let balls;
let wallPress;
let charge;
let frozen;

function update() {
  if (!ticks) {
    addBalls(1);
    wallPress = 5;
    charge = 0;
    frozen = false;
  }

  // Walls always press in - speed increases with difficulty
  wallPress += (input.isPressed ? 0.2 : 0.05) * sqrt(difficulty);

  // Input handling
  if (input.isPressed) {
    // Charging while holding
    charge += 1;
    if (charge > 9) {
      play("select");
      frozen = true;
    }
  }

  const pb = charge * 0.1;
  const sc = floor(pb * pb * balls.length * balls.length);
  if (input.isPressed && charge > 9) {
    const ss = `${sc}`;
    color("black");
    text(ss, 50 - ss.length * 6 + 6, 30, { scale: { x: 2, y: 2 } });
  }
  if (input.isJustReleased && charge > 9) {
    if (sc > 0) {
      addScore(sc, 50, 50);
      play("jump");
    }
    wallPress = 5;
    charge = 0;
    frozen = false;
    addBalls(rndi(1, 6));
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
    });
  }

  // Draw walls
  let wallColor = "light_purple";
  if (wallPress > 35) {
    wallColor = floor(ticks / 20) % 2 == 0 ? "light_red" : "light_purple";
  }
  color(wallColor);
  let wp = wallPress;
  rect(0, 0, wp, 100);
  rect(100, 0, -wp, 100);
  rect(0, 0, 100, wp);
  rect(0, 100, 100, -wp);

  // Check ball crush and draw balls
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
    const c = box(b.pos, 5).isColliding.rect;
    if (frozen && c.light_purple) {
      play("explosion");
      end();
    }
  });
}

function addBalls(count) {
  balls = [];
  const speed = sqrt(difficulty);
  for (let i = 0; i < count; i++) {
    balls.push({
      pos: vec(rnd(10, 90), rnd(10, 90)),
      vel: vec(rnds(0.2, 1) * speed, rnds(0.2, 1) * speed),
    });
  }
}
