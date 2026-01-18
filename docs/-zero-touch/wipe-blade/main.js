title = "WIPE BLADE";

description = `
[Tap] Wipe attack
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let bladeAngle;
let enemies;
let isWiping;
let wipeTimer;
let comboCount;
let cooldown;
let bladeDir;

function update() {
  if (!ticks) {
    bladeAngle = 0;
    enemies = [];
    isWiping = false;
    wipeTimer = 0;
    comboCount = 0;
    cooldown = 0;
    bladeDir = 1;
  }

  const centerX = 50;
  const centerY = 50;
  const bladeLength = 28;
  const rotateSpeed = 0.03;
  const wipeDuration = 8;
  const baseCooldown = 40;

  // Blade always rotates
  bladeAngle += rotateSpeed * bladeDir;

  // Spawn enemies from edges
  let spawnRate = 45 - sqrt(difficulty) * 5;
  if (spawnRate < 10) spawnRate = 10;
  if (ticks % floor(spawnRate) === 0) {
    let angle = rnd(PI * 2);
    let dist = 65;
    let ex = centerX + cos(angle) * dist;
    let ey = centerY + sin(angle) * dist;
    let speed = 0.2 + difficulty * 0.03;
    if (speed > 0.8) speed = 0.8;
    // Tough enemies later on
    let hp = difficulty > 5 ? (rnd() < 0.3 ? 2 : 1) : 1;
    enemies.push({ x: ex, y: ey, speed: speed, hp: hp });
  }

  // Cooldown countdown
  if (cooldown > 0) cooldown--;

  // Input: tap to wipe
  if (input.isJustPressed && !isWiping && cooldown <= 0) {
    isWiping = true;
    wipeTimer = wipeDuration;
    comboCount = 0;
    bladeDir = -bladeDir;
    play("laser");
  }

  // Wipe attack logic
  if (isWiping) {
    wipeTimer--;
    if (wipeTimer <= 0) {
      isWiping = false;
      // Reward multi-kills: more kills = less cooldown
      cooldown = floor(baseCooldown / (1 + comboCount * 0.5));
      if (cooldown < 10) cooldown = 10;
      // Big bonus for combos
      if (comboCount >= 3) {
        addScore(comboCount * 3);
        play("coin");
      } else if (comboCount >= 2) {
        addScore(comboCount);
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

  // Draw center core first (for collision detection)
  color("cyan");
  box(centerX, centerY, 5);

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
    let progress = 1 - (wipeTimer / wipeDuration);
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
    }

    // Check wipe collision
    if (isWiping) {
      let enemyDist = sqrt((e.x - centerX) ** 2 + (e.y - centerY) ** 2);
      if (enemyDist < bladeLength + 12) {
        let enemyAngle = atan2(e.y - centerY, e.x - centerX);
        let diff = ((enemyAngle - bladeAngle) % (PI * 2) + PI * 3) % (PI * 2) - PI;
        let arcSpan = PI * 0.35 * (1 - wipeTimer / wipeDuration);
        // Check both blade ends
        if (abs(diff) < arcSpan + 0.2 || abs(abs(diff) - PI) < arcSpan + 0.2) {
          e.hp--;
          if (e.hp <= 0) {
            play("powerUp");
            addScore(1);
            comboCount++;
            particle(e.x, e.y, 10, 1.5, 0.5, PI, PI);
            return false;
          }
        }
      }
    }

    // Draw enemy
    color(e.hp > 1 ? "purple" : "red");
    let ec = box(e.x, e.y, e.hp > 1 ? 7 : 5);
    
    // Check if enemy touches core
    if (ec.isColliding.rect.cyan) {
      play("explosion");
      end();
    }

    return e.x > -10 && e.x < 110 && e.y > -10 && e.y < 110;
  });
}
