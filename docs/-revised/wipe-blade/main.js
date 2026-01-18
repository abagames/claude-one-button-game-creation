title = "WIPE BLADE";

description = `
[Tap] Wipe attack
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let bladeAngle;
let enemies;
let isWiping;
let wipeTimer;
let comboCount;
let cooldown;
let bladeDir;
let bladeTrail;

function update() {
  if (!ticks) {
    bladeAngle = 0;
    enemies = [];
    isWiping = false;
    wipeTimer = 0;
    comboCount = 0;
    cooldown = 0;
    bladeDir = 1;
    bladeTrail = [];
  }

  const centerX = 50;
  const centerY = 50;
  const bladeLength = 28;
  const rotateSpeed = 0.03;
  const wipeDuration = 8;
  const baseCooldown = 40;

  // Blade always rotates
  bladeAngle += rotateSpeed * bladeDir * sqrt(difficulty);

  // Spawn enemies from edges
  let spawnRate = 45 / difficulty;
  if (ticks % floor(spawnRate) === 0) {
    let angle = rnd(PI * 2);
    let dist = 65;
    let ex = centerX + cos(angle) * dist;
    let ey = centerY + sin(angle) * dist;
    let speed = 0.2 * sqrt(difficulty);
    if (speed > 0.8) speed = 0.8;
    let hp = 1;
    // Add game feel properties
    enemies.push({
      x: ex,
      y: ey,
      speed: speed,
      hp: hp,
      rot: angle + PI, // Face toward center
      spawnAnim: 1.0, // Spawn stretch animation
      squash: 1.0, // Squash factor
    });
    // Spawn particles
    color("red");
    particle(ex, ey, 5, 1, 0.5, angle + PI, 0.3);
  }

  // Cooldown countdown
  if (cooldown > 0) cooldown -= sqrt(difficulty);

  // Input: tap to wipe
  if (input.isJustPressed && !isWiping && cooldown <= 0) {
    isWiping = true;
    wipeTimer = wipeDuration;
    comboCount = 0;
    bladeDir = -bladeDir;
    play("laser");
    // Wipe start particles from blade tips
    color("yellow");
    let bx1 = centerX + cos(bladeAngle) * bladeLength;
    let by1 = centerY + sin(bladeAngle) * bladeLength;
    particle(bx1, by1, 8, 2, 0.5, bladeAngle, 0.5);
    let bx2 = centerX - cos(bladeAngle) * bladeLength;
    let by2 = centerY - sin(bladeAngle) * bladeLength;
    particle(bx2, by2, 8, 2, 0.5, bladeAngle + PI, 0.5);
  }

  // Record blade trail during wipe
  if (isWiping) {
    bladeTrail.push({ angle: bladeAngle, life: 6 });
  }

  // Update and draw blade trail (afterimage)
  bladeTrail = bladeTrail.filter((t) => {
    t.life--;
    if (t.life <= 0) return false;
    let alpha = t.life / 6;
    color("light_cyan");
    let len = bladeLength * alpha;
    let tx1 = centerX + cos(t.angle) * len;
    let ty1 = centerY + sin(t.angle) * len;
    line(centerX, centerY, tx1, ty1, 1);
    let tx2 = centerX - cos(t.angle) * len;
    let ty2 = centerY - sin(t.angle) * len;
    line(centerX, centerY, tx2, ty2, 1);
    return true;
  });

  // Wipe attack logic
  if (isWiping) {
    wipeTimer--;
    // Continuous wipe particles
    if (wipeTimer % 2 === 0) {
      color("yellow");
      let tipAngle = bladeAngle + (rnd() - 0.5) * 0.3;
      let tipDist = bladeLength + 5;
      particle(
        centerX + cos(tipAngle) * tipDist,
        centerY + sin(tipAngle) * tipDist,
        3,
        1,
        0.3,
        tipAngle,
        0.2,
      );
      particle(
        centerX - cos(tipAngle) * tipDist,
        centerY - sin(tipAngle) * tipDist,
        3,
        1,
        0.3,
        tipAngle + PI,
        0.2,
      );
    }
    if (wipeTimer <= 0) {
      isWiping = false;
      cooldown = floor(baseCooldown / (1 + comboCount * 0.5));
      if (cooldown < 10) cooldown = 10;
      if (comboCount >= 3) {
        addScore(comboCount * 3, 50, 50);
        play("coin");
        // Big combo particle burst
        color("yellow");
        particle(centerX, centerY, 20, 3, 1, 0, PI * 2);
      } else if (comboCount >= 2) {
        addScore(comboCount, 50, 50);
      }
    }
  }

  // Draw cooldown indicator
  color("light_black");
  rect(10, 93, 80, 4);
  if (cooldown > 0) {
    color("red");
    rect(10, 93, (cooldown / baseCooldown) * 80, 4);
  } else if (!isWiping) {
    color("green");
    rect(10, 93, 80, 4);
  } else {
    color("yellow");
    rect(10, 93, (wipeTimer / wipeDuration) * 80, 4);
  }

  // Draw center core with pulse animation
  color("cyan");
  let corePulse = 1 + sin(ticks * 0.1) * 0.1;
  box(centerX, centerY, 5 * corePulse);

  // Draw blade (both sides)
  color("cyan");
  let bx1 = centerX + cos(bladeAngle) * bladeLength;
  let by1 = centerY + sin(bladeAngle) * bladeLength;
  line(centerX, centerY, bx1, by1, 2);
  let bx2 = centerX - cos(bladeAngle) * bladeLength;
  let by2 = centerY - sin(bladeAngle) * bladeLength;
  line(centerX, centerY, bx2, by2, 2);

  // Draw wipe effect (tighter arc - harder to hit)
  if (isWiping) {
    color("yellow");
    let progress = 1 - wipeTimer / wipeDuration;
    let arcSpan = PI * 0.35 * progress;
    for (let a = -arcSpan; a <= arcSpan; a += 0.1) {
      let rayAngle = bladeAngle + a;
      let rayLen = bladeLength + 10;
      let rx1 = centerX + cos(rayAngle) * rayLen;
      let ry1 = centerY + sin(rayAngle) * rayLen;
      line(centerX, centerY, rx1, ry1, 2);
      let rx2 = centerX - cos(rayAngle) * rayLen;
      let ry2 = centerY - sin(rayAngle) * rayLen;
      line(centerX, centerY, rx2, ry2, 2);
    }
  }

  // Update and draw enemies
  enemies = enemies.filter((e) => {
    let dx = centerX - e.x;
    let dy = centerY - e.y;
    let dist = sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      e.x += (dx / dist) * e.speed;
      e.y += (dy / dist) * e.speed;
      // Update rotation to face movement direction
      e.rot = atan2(dy, dx);
    }

    // Spawn animation: start stretched, return to normal
    if (e.spawnAnim > 0) {
      e.spawnAnim -= 0.05;
      if (e.spawnAnim < 0) e.spawnAnim = 0;
    }

    // Squash based on proximity to center (closer = more squashed)
    let proximityFactor = 1 - clamp(dist / 50, 0, 1);
    e.squash = 1 - proximityFactor * 0.3;

    // Check wipe collision
    if (isWiping) {
      let enemyDist = sqrt((e.x - centerX) ** 2 + (e.y - centerY) ** 2);
      if (enemyDist < bladeLength + 12) {
        let enemyAngle = atan2(e.y - centerY, e.x - centerX);
        let diff =
          ((((enemyAngle - bladeAngle) % (PI * 2)) + PI * 3) % (PI * 2)) - PI;
        let arcSpan = PI * 0.35 * (1 - wipeTimer / wipeDuration);
        if (abs(diff) < arcSpan + 0.2 || abs(abs(diff) - PI) < arcSpan + 0.2) {
          e.hp--;
          if (e.hp <= 0) {
            play("powerUp");
            addScore(1, e.x, e.y);
            comboCount++;
            color("red");
            particle(e.x, e.y, 15, 2, 0.8, 0, PI * 2);
            return false;
          }
        }
      }
    }

    // Draw enemy with squash/stretch and rotation
    color(e.hp > 1 ? "purple" : "red");
    let baseSize = e.hp > 1 ? 7 : 5;
    // Calculate stretch from spawn animation and squash from proximity
    let stretchX = 1 + e.spawnAnim * 0.5;
    let stretchY = e.squash - e.spawnAnim * 0.3;
    let w = baseSize * stretchX;
    let h = baseSize * stretchY;
    // Draw as rotated bar for dynamic tilt
    let ec = bar(e.x, e.y, h, w, e.rot);

    // Check if enemy touches core
    if (ec.isColliding.rect.cyan) {
      play("explosion");
      color("red");
      particle(centerX, centerY, 30, 3, 1, 0, PI * 2);
      end();
    }

    return e.x > -10 && e.x < 110 && e.y > -10 && e.y < 110;
  });
}
