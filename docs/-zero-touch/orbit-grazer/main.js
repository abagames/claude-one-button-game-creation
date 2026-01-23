title = "ORBIT GRAZER";

description = `
[Tap] Reverse orbit
[Hold] Speed up
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let player;
let asteroids;
let centerX;
let centerY;
let orbitRadius;
let orbitAngle;
let orbitDir;
let reverseCooldown;
let multiplier;

function update() {
  if (!ticks) {
    centerX = 50;
    centerY = 50;
    orbitRadius = 25;
    orbitAngle = 0;
    orbitDir = 1;
    player = { x: 0, y: 0 };
    asteroids = [];
    reverseCooldown = 0;
    multiplier = 1;
  }

  // Pattern 4.3: Cooldown for direction change (anti-spam)
  if (reverseCooldown > 0) reverseCooldown--;

  // Input: reverse orbit direction (with cooldown penalty)
  if (input.isJustPressed && reverseCooldown <= 0) {
    orbitDir *= -1;
    reverseCooldown = 20; // Can't reverse again for 20 frames
    play("select");
  } else if (input.isJustPressed && reverseCooldown > 0) {
    // Spam penalty: reset multiplier
    multiplier = max(1, multiplier - 1);
  }

  // Pattern 5.3: Hold accelerates danger (faster orbit = harder to dodge)
  // Pattern 1.1: sqrt scaling for smooth difficulty curve
  let baseSpeed = 0.02 * sqrt(difficulty);
  let holdBonus = input.isPressed ? 1.5 : 1.0; // Faster while holding
  let orbitSpeed = baseSpeed * holdBonus;
  orbitAngle += orbitSpeed * orbitDir;

  // Calculate player position on orbit
  player.x = centerX + cos(orbitAngle) * orbitRadius;
  player.y = centerY + sin(orbitAngle) * orbitRadius;

  // Pattern 1.1: sqrt scaling for spawn rate
  let spawnRate = floor(40 / sqrt(difficulty));
  if (spawnRate < 10) spawnRate = 10;
  if (ticks % spawnRate === 0) {
    // Pattern 6.3: Adaptive spawn - asteroids cross player's orbit path
    let spawnAngle = rnd(PI * 2);
    let dist = 60;
    let ax = centerX + cos(spawnAngle) * dist;
    let ay = centerY + sin(spawnAngle) * dist;

    // Target a point on the orbit (where player will be)
    let playerAngle = atan2(player.y - centerY, player.x - centerX);
    let targetAngle = playerAngle + orbitDir * rnd(0.2, 0.6); // Ahead on orbit
    let targetX = centerX + cos(targetAngle) * orbitRadius;
    let targetY = centerY + sin(targetAngle) * orbitRadius;

    // Pattern 1.1: sqrt scaling for asteroid speed
    let speed = 0.5 * sqrt(difficulty);
    let dx = targetX - ax;
    let dy = targetY - ay;
    let len = sqrt(dx * dx + dy * dy);
    asteroids.push({
      x: ax,
      y: ay,
      vx: (dx / len) * speed,
      vy: (dy / len) * speed,
      size: rnd(6, 11),
      grazed: false,
    });
  }

  // Draw orbit path
  color("light_black");
  arc(centerX, centerY, orbitRadius, 1);

  // Draw center
  color("yellow");
  box(centerX, centerY, 4);

  // Draw cooldown indicator
  if (reverseCooldown > 0) {
    color("red");
    arc(centerX, centerY, 8, 1, 0, (reverseCooldown / 20) * PI * 2);
  }

  // Draw player first for collision detection
  color("cyan");
  box(player.x, player.y, 6);

  // Update and draw asteroids
  color("red");
  asteroids = asteroids.filter((a) => {
    a.x += a.vx;
    a.y += a.vy;

    let dx = player.x - a.x;
    let dy = player.y - a.y;
    let dist = sqrt(dx * dx + dy * dy);

    // Graze detection (close but not colliding)
    let grazeThreshold = a.size / 2 + 8;
    let collisionThreshold = a.size / 2 + 3;

    if (dist < grazeThreshold && dist > collisionThreshold && !a.grazed) {
      // Pattern 2.1: Risk-based scoring
      // Closer = more points, holding (faster) = more points
      let proximityBonus = floor((grazeThreshold - dist) * 2);
      let speedBonus = input.isPressed ? 2 : 1; // Holding = 2x points
      let totalScore = proximityBonus * speedBonus * multiplier;
      addScore(totalScore, a.x, a.y);
      a.grazed = true;
      // Pattern 2.4: Increase multiplier on successful graze
      multiplier = min(multiplier + 1, 8);
      play("coin");
    }

    let col = box(a.x, a.y, a.size);
    if (col.isColliding.rect.cyan) {
      play("explosion");
      end();
    }

    // Remove if reached center or off screen
    let centerDist = sqrt((a.x - centerX) ** 2 + (a.y - centerY) ** 2);
    return centerDist > 5 && a.x > -10 && a.x < 110 && a.y > -10 && a.y < 110;
  });

  // Pattern 4.3: Multiplier decay when no graze for a while
  if (ticks % 120 === 0 && multiplier > 1) {
    multiplier--;
  }

  // Display multiplier
  if (multiplier > 1) {
    color("black");
    text(`x${multiplier}`, 3, 10);
  }
}
