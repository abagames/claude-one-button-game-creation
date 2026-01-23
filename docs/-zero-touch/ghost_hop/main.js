title = "GHOST HOP";

description = `
[Tap] Jump
[Hold] Shield
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let player;
let targets;
let bullets;
let shielding;
let shieldEnergy;
let jumping;
let jumpTargetIdx;
let jumpT;
let jumpFromX;
let jumpFromY;
let cooldown;

function update() {
  if (!ticks) {
    targets = [];
    for (let i = 0; i < 5; i++) {
      targets.push({
        x: 20 + (i % 3) * 30,
        y: 25 + floor(i / 3) * 40,
        vx: (rnd() - 0.5) * 0.4,
        vy: (rnd() - 0.5) * 0.4,
      });
    }
    player = { idx: 2 };
    bullets = [];
    shielding = false;
    shieldEnergy = 100;
    jumping = false;
    jumpTargetIdx = 0;
    jumpT = 0;
    jumpFromX = 50;
    jumpFromY = 50;
    cooldown = 0;
  }

  let bulletSpd = 0.5 + difficulty * 0.15;

  // Spawn bullets
  if (ticks % ceil(50 / sqrt(difficulty)) === 0) {
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

  if (cooldown > 0) cooldown--;

  // Input
  if (input.isJustPressed && !jumping && cooldown === 0) {
    // Find next target (cycle through)
    let nextIdx = (player.idx + 1) % targets.length;
    jumping = true;
    jumpTargetIdx = nextIdx;
    jumpT = 0;
    let t = targets[player.idx];
    jumpFromX = t.x;
    jumpFromY = t.y;
    cooldown = 25;
    play("jump");
  }

  shielding = input.isPressed && !jumping && shieldEnergy > 0;

  if (shielding) {
    shieldEnergy -= 1.5;
  } else if (shieldEnergy < 100) {
    shieldEnergy += 0.3;
  }

  // Update targets (drift slowly)
  for (let i = 0; i < targets.length; i++) {
    let t = targets[i];
    t.x += t.vx;
    t.y += t.vy;
    if (t.x < 15 || t.x > 85) t.vx *= -1;
    if (t.y < 15 || t.y > 85) t.vy *= -1;
    t.x = clamp(t.x, 15, 85);
    t.y = clamp(t.y, 15, 85);
  }

  // Update jump
  let px, py;
  let justLanded = false;
  if (jumping) {
    jumpT += 0.08;
    let tgt = targets[jumpTargetIdx];
    px = jumpFromX + (tgt.x - jumpFromX) * jumpT;
    py = jumpFromY + (tgt.y - jumpFromY) * jumpT;
    if (jumpT >= 1) {
      player.idx = jumpTargetIdx;
      jumping = false;
      justLanded = true;
      play("powerUp");
    }
  } else {
    let t = targets[player.idx];
    px = t.x;
    py = t.y;
  }

  // Score per second when not shielding
  if (ticks % 60 === 0 && !shielding) {
    addScore(1);
  }

  // Draw shield bar
  color("blue");
  rect(3, 3, shieldEnergy * 0.2, 3);

  // Draw targets
  for (let i = 0; i < targets.length; i++) {
    let t = targets[i];
    color(i === player.idx && !jumping ? "cyan" : "green");
    box(t.x, t.y, i === player.idx && !jumping ? 8 : 5);
  }

  // Draw player
  color(shielding ? "blue" : jumping ? "yellow" : "cyan");
  if (shielding) {
    arc(px, py, 10, 3);
  }
  box(px, py, 5);

  // Update bullets
  bullets = bullets.filter((b) => {
    if (!shielding || b.reflected) {
      b.x += b.vx;
      b.y += b.vy;
    }

    if (b.x < -10 || b.x > 110 || b.y < -10 || b.y > 110) {
      return false;
    }

    // Reflect on landing
    if (justLanded && !b.reflected) {
      let dx = b.x - px;
      let dy = b.y - py;
      if (dx * dx + dy * dy < 225) {
        b.vx *= -1.3;
        b.vy *= -1.3;
        b.reflected = true;
        addScore(10);
        play("coin");
      }
    }

    color(b.reflected ? "yellow" : "red");
    let col = box(b.x, b.y, 4);

    if (!b.reflected && !shielding) {
      if (col.isColliding.rect.cyan || col.isColliding.rect.yellow) {
        play("explosion");
        end();
      }
    }
    return true;
  });
}
