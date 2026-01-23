title = "GHOST HOP";

description = `
[Tap] Hop
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let player;
let targets;
let bullets;
let jumping;
let jumpTargetIdx;
let jumpT;
let jumpFromX;
let jumpFromY;
let multiplier;
let trails;
let particles;

function update() {
  if (!ticks) {
    targets = [];
    for (let i = 0; i < 5; i++) {
      targets.push({
        x: 20 + (i % 3) * 30,
        y: 25 + floor(i / 3) * 40,
        vx: (rnd() - 0.5) * 0.4,
        vy: (rnd() - 0.5) * 0.4,
        squash: 0,
      });
    }
    player = { idx: 2, squash: 0, stretch: 0 };
    bullets = [];
    jumping = false;
    jumpTargetIdx = 0;
    jumpT = 0;
    jumpFromX = 50;
    jumpFromY = 50;
    multiplier = 1;
    trails = [];
    particles = [];
  }

  let bulletSpd = 0.5 * difficulty;

  // Spawn bullets
  if (ticks % ceil(50 / difficulty) === 0) {
    let side = floor(rnd(4));
    let bx, by;
    let t = targets[player.idx];
    if (side === 0) {
      bx = -5;
      by = rnd(100);
    } else if (side === 1) {
      bx = 105;
      by = rnd(100);
    } else if (side === 2) {
      bx = rnd(100);
      by = -5;
    } else {
      bx = rnd(100);
      by = 105;
    }
    let ang = atan2(t.y - by, t.x - bx);
    bullets.push({
      x: bx,
      y: by,
      vx: cos(ang) * bulletSpd,
      vy: sin(ang) * bulletSpd,
      reflected: false,
    });
  }

  // Input
  if (input.isJustPressed && !jumping) {
    let nextIdx = (player.idx + 1) % targets.length;
    jumping = true;
    jumpTargetIdx = nextIdx;
    jumpT = 0;
    let t = targets[player.idx];
    jumpFromX = t.x;
    jumpFromY = t.y;
    player.stretch = 1.0;
    play("jump");
  }

  // Update targets (drift slowly)
  for (let i = 0; i < targets.length; i++) {
    let t = targets[i];
    let prevX = t.x;
    let prevY = t.y;
    t.x += t.vx * sqrt(difficulty);
    t.y += t.vy * sqrt(difficulty);
    let bounced = false;
    if (t.x < 15 || t.x > 85) {
      t.vx *= -1;
      bounced = true;
    }
    if (t.y < 15 || t.y > 85) {
      t.vy *= -1;
      bounced = true;
    }
    t.x = clamp(t.x, 15, 85);
    t.y = clamp(t.y, 15, 85);
    if (bounced) {
      t.squash = 0.5;
    }
    t.squash *= 0.85;
  }

  // Update jump
  let px, py;
  let eyeDirX = 0;
  let eyeDirY = 0;
  if (jumping) {
    jumpT += 0.08 * sqrt(difficulty);
    let tgt = targets[jumpTargetIdx];
    px = jumpFromX + (tgt.x - jumpFromX) * jumpT;
    py = jumpFromY + (tgt.y - jumpFromY) * jumpT;
    eyeDirX = tgt.x - px;
    eyeDirY = tgt.y - py;
    player.stretch = (1 - jumpT) * 0.8;
    if (ticks % 3 === 0) {
      trails.push({ x: px, y: py, life: 16 });
    }
    if (jumpT >= 1) {
      player.idx = jumpTargetIdx;
      jumping = false;
      player.squash = 0.6;
      player.stretch = 0;
      play("powerUp");
      addScore(floor(multiplier), px, py);
      multiplier *= 2;
      for (let j = 0; j < 2; j++) {
        particles.push({
          x: px,
          y: py,
          vx: (rnd() - 0.5) * 2,
          vy: rnd() * 1.5,
          life: 12,
          color: "cyan",
        });
      }
    }
  } else {
    let t = targets[player.idx];
    px = t.x;
    py = t.y;
    let nextT = targets[(player.idx + 1) % targets.length];
    eyeDirX = nextT.x - px;
    eyeDirY = nextT.y - py;
  }

  // Update particles
  particles = particles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life--;
    color(p.color);
    particle(p.x, p.y, 1, PI / 4, PI / 4);
    return p.life > 0;
  });

  // Update trails
  trails = trails.filter((tr) => {
    tr.life--;
    let alpha = tr.life / 8;
    color("light_yellow");
    box(tr.x, tr.y, 5 * alpha);
    return tr.life > 0;
  });

  // Decay squash
  player.squash *= 0.85;

  // Draw targets with squash & stretch and eyes
  for (let i = 0; i < targets.length; i++) {
    let t = targets[i];
    let isNext = i === wrap(player.idx + 1, 0, targets.length) && !jumping;
    color(isNext ? "light_cyan" : "green");
    let baseSize = i === player.idx && !jumping ? 8 : 5;
    let breath = sin(ticks * 0.1 + i) * 0.3;
    let sw = baseSize * (1 + t.squash * 0.5 + breath * 0.1);
    let sh = baseSize * (1 - t.squash * 0.3 + breath * 0.1);
    box(t.x, t.y, sw, sh);
    // Eyes for targets
    let isCurrent = i === player.idx && !jumping;
    let eyeSpacing = 1.5;
    if (isCurrent || isNext) {
      // Open eyes for current and next target
      let lookX = t.vx;
      let lookY = t.vy;
      let len = sqrt(lookX * lookX + lookY * lookY);
      if (len > 0.01) {
        lookX /= len;
        lookY /= len;
      }
      color("white");
      box(t.x - eyeSpacing, t.y - 1, 2, 2);
      box(t.x + eyeSpacing, t.y - 1, 2, 2);
      color("black");
      box(t.x - eyeSpacing + lookX * 0.5, t.y - 1 + lookY * 0.5, 1, 1);
      box(t.x + eyeSpacing + lookX * 0.5, t.y - 1 + lookY * 0.5, 1, 1);
    } else {
      // Closed eyes (horizontal lines) for other targets
      color("black");
      box(t.x - eyeSpacing, t.y - 1, 2, 0.5);
      box(t.x + eyeSpacing, t.y - 1, 2, 0.5);
    }
  }

  // Draw player with squash & stretch
  color(jumping ? "yellow" : "cyan");
  let breath = sin(ticks * 0.15) * 0.2;
  let pw = 5 * (1 + player.squash * 0.5 - player.stretch * 0.3 + breath * 0.1);
  let ph = 5 * (1 - player.squash * 0.3 + player.stretch * 0.5 + breath * 0.1);
  // Tilt based on movement direction
  let tiltAngle = 0;
  if (jumping) {
    let tgt = targets[jumpTargetIdx];
    tiltAngle = atan2(tgt.y - jumpFromY, tgt.x - jumpFromX);
  }
  if (abs(tiltAngle) < 0.1) {
    box(px, py, pw, ph);
  } else {
    bar(px, py, ph, pw * 0.8, tiltAngle);
  }
  // Draw eyes
  let len = sqrt(eyeDirX * eyeDirX + eyeDirY * eyeDirY);
  if (len > 0.01) {
    eyeDirX /= len;
    eyeDirY /= len;
  }
  color("white");
  let eyeSpacing = 1.5;
  box(px - eyeSpacing, py - 1, 2, 2);
  box(px + eyeSpacing, py - 1, 2, 2);
  color("black");
  box(px - eyeSpacing + eyeDirX * 0.6, py - 1 + eyeDirY * 0.6, 1, 1);
  box(px + eyeSpacing + eyeDirX * 0.6, py - 1 + eyeDirY * 0.6, 1, 1);

  // Update bullets
  bullets = bullets.filter((b) => {
    b.x += b.vx;
    b.y += b.vy;

    if (b.x < -10 || b.x > 110 || b.y < -10 || b.y > 110) {
      return false;
    }

    color("red");
    // Rotate bullet based on velocity
    let bulletAngle = atan2(b.vy, b.vx);
    let col = bar(b.x, b.y, 4, 2, bulletAngle);

    if (col.isColliding.rect.yellow) {
      play("explosion");
      for (let j = 0; j < 3; j++) {
        particles.push({
          x: b.x,
          y: b.y,
          vx: (rnd() - 0.5) * 3,
          vy: (rnd() - 0.5) * 3,
          life: 10,
          color: "red",
        });
      }
      end();
    }
    return true;
  });

  multiplier = clamp(multiplier * 0.99, 1, 256);
  color("black");
  text(`x${floor(multiplier)}`, 3, 9, { isSmallText: true });
}
