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
let trails;

function update() {
  if (!ticks) {
    balls = [];
    trails = [];
    const speed = sqrt(difficulty);
    for (let i = 0; i < 1; i++) {
      balls.push({
        pos: vec(rnd(30, 70), rnd(30, 70)),
        vel: vec(rnds(0.5, 1) * speed, rnds(0.5, 1) * speed),
        scaleX: 1,
        scaleY: 1,
        rot: 0,
      });
    }
    wallPress = 5;
    charge = 0;
    frozen = false;
  }

  // Walls always press in - speed increases with difficulty
  wallPress += (input.isPressed ? 0.2 : 0.05) * sqrt(difficulty);

  // Input handling
  if (input.isPressed) {
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
    // Spawn particles for wall push effect
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * PI * 2;
      const px = 50 + cos(angle) * 30;
      const py = 50 + sin(angle) * 30;
      color("yellow");
      particle(px, py, 8, 2, angle, 0.3);
    }
    wallPress = 5;
    charge = 0;
    frozen = false;
    // Replace balls (same as original addBalls behavior)
    balls = [];
    trails = [];
    const speed = sqrt(difficulty);
    const newCount = rndi(1, 6);
    for (let i = 0; i < newCount; i++) {
      balls.push({
        pos: vec(rnd(30, 70), rnd(30, 70)),
        vel: vec(rnds(0.5, 1) * speed, rnds(0.5, 1) * speed),
        scaleX: 1,
        scaleY: 1,
        rot: 0,
      });
    }
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
      // Add trail before moving
      const spd = sqrt(b.vel.x * b.vel.x + b.vel.y * b.vel.y);
      if (spd > 0.8) {
        trails.push({
          x: b.pos.x,
          y: b.pos.y,
          life: 8,
          size: 4,
        });
      }

      b.pos.x += b.vel.x;
      b.pos.y += b.vel.y;

      // Update rotation based on velocity
      b.rot += spd * 0.1 * (b.vel.x > 0 ? 1 : -1);

      // Gradually restore squash/stretch
      b.scaleX += (1 - b.scaleX) * 0.15;
      b.scaleY += (1 - b.scaleY) * 0.15;

      // Bounce off current wall positions
      let margin = 4;
      let minB = wallPress + margin;
      let maxB = 100 - wallPress - margin;

      if (b.pos.x < minB) {
        b.pos.x = minB;
        b.vel.x = abs(b.vel.x);
        b.scaleX = 0.6;
        b.scaleY = 1.4;
        color("white");
        particle(b.pos.x, b.pos.y, 3, 1, 0, 0.5);
        play("hit");
      }
      if (b.pos.x > maxB) {
        b.pos.x = maxB;
        b.vel.x = -abs(b.vel.x);
        b.scaleX = 0.6;
        b.scaleY = 1.4;
        color("white");
        particle(b.pos.x, b.pos.y, 3, 1, PI, 0.5);
        play("hit");
      }
      if (b.pos.y < minB) {
        b.pos.y = minB;
        b.vel.y = abs(b.vel.y);
        b.scaleX = 1.4;
        b.scaleY = 0.6;
        color("white");
        particle(b.pos.x, b.pos.y, 3, 1, -PI / 2, 0.5);
        play("hit");
      }
      if (b.pos.y > maxB) {
        b.pos.y = maxB;
        b.vel.y = -abs(b.vel.y);
        b.scaleX = 1.4;
        b.scaleY = 0.6;
        color("white");
        particle(b.pos.x, b.pos.y, 3, 1, PI / 2, 0.5);
        play("hit");
      }
    });
  } else {
    // Idle breathing animation when frozen
    balls.forEach((b) => {
      const breathe = sin(ticks * 0.2) * 0.1;
      b.scaleX = 1 + breathe;
      b.scaleY = 1 - breathe;
    });
  }

  // Update and draw trails
  color("light_cyan");
  trails = trails.filter((t) => {
    t.life -= 1;
    if (t.life > 0) {
      const alpha = t.life / 8;
      box(t.x, t.y, t.size * alpha);
      return true;
    }
    return false;
  });

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

  // Check ball crush and draw balls with game feel
  balls.forEach((b) => {
    // Frozen balls can be crushed by walls
    let crushMargin = frozen ? 6 : 4;
    if (
      b.pos.x < wallPress + crushMargin ||
      b.pos.x > 100 - wallPress - crushMargin ||
      b.pos.y < wallPress + crushMargin ||
      b.pos.y > 100 - wallPress - crushMargin
    ) {
      // Generate crush particles every 10 frames
      if (ticks % 3 === 0) {
        color("cyan");
        particle(b.pos.x, b.pos.y, 3, 1);
      }
    }

    // Draw ball body with squash & stretch using bars for rotation effect
    if (frozen) {
      color(floor(ticks / 3) % 2 === 0 ? "blue" : "light_blue");
    } else {
      color("cyan");
    }

    // Main body with squash/stretch
    const w = 5 * b.scaleX;
    const h = 5 * b.scaleY;
    box(b.pos.x, b.pos.y, w, h);

    // Add rotation lines to show spinning
    const lineLen = 3;
    bar(b.pos.x, b.pos.y, lineLen, 1, b.rot);
    bar(b.pos.x, b.pos.y, lineLen, 1, b.rot + PI / 2);

    // Draw eyes looking toward movement direction
    const eyeOffsetX = b.vel.x > 0 ? 1 : -1;
    const eyeOffsetY = b.vel.y > 0 ? 0.5 : -0.5;

    // Eye whites
    color("white");
    box(b.pos.x - 1.5, b.pos.y - 1, 2, 2);
    box(b.pos.x + 1.5, b.pos.y - 1, 2, 2);

    // Pupils looking toward velocity
    color("black");
    box(b.pos.x - 1.5 + eyeOffsetX * 0.5, b.pos.y - 1 + eyeOffsetY, 1, 1);
    box(b.pos.x + 1.5 + eyeOffsetX * 0.5, b.pos.y - 1 + eyeOffsetY, 1, 1);

    // Collision check with walls
    color(frozen ? "blue" : "cyan");
    const c = box(b.pos, 1).isColliding.rect;
    if (frozen && c.light_purple) {
      play("explosion");
      end();
    }
  });
}
