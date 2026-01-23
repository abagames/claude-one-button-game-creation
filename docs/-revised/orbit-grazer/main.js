title = "ORBIT GRAZER";

description = `
[Tap] Reverse orbit
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let player;
let invincibleTicks;
let asteroids;
let centerX;
let centerY;
let orbitRadius;
let orbitAngle;
let orbitDir;
let playerStretch;
let playerTrail;

function update() {
  if (!ticks) {
    centerX = 50;
    centerY = 50;
    orbitRadius = 25;
    orbitAngle = 0;
    orbitDir = 1;
    player = { x: 0, y: 0 };
    asteroids = [];
    invincibleTicks = 0;
    playerStretch = 1;
    playerTrail = [];
  }

  // Input: reverse orbit direction (with cooldown penalty)
  if (input.isJustPressed) {
    orbitDir *= -1;
    play("select");
    playerStretch = 1.6;
    // Direction change particles
    color("cyan");
    particle(
      player.x,
      player.y,
      8,
      1.5,
      orbitAngle - (PI / 2) * orbitDir,
      PI / 4,
    );
  }

  // Decay stretch back to normal
  playerStretch += (1 - playerStretch) * 0.15;

  let orbitSpeed = 0.5 * sqrt(difficulty);
  orbitAngle += (orbitSpeed * orbitDir) / (orbitRadius + 0.1);

  // Calculate player position on orbit
  player.x = centerX + cos(orbitAngle) * orbitRadius;
  player.y = centerY + sin(orbitAngle) * orbitRadius;

  // Update player trail
  if (ticks % 3 == 0) {
    playerTrail.push({ x: player.x, y: player.y, life: 24 });
  }
  remove(playerTrail, (t) => {
    t.life--;
    return t.life <= 0;
  });

  // Pattern 1.1: sqrt scaling for spawn rate
  let spawnRate = floor(50 / sqrt(difficulty));
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
    if (vec(ax, ay).distanceTo(player.x, player.y) > 50) {
      asteroids.push({
        x: ax,
        y: ay,
        vx: (dx / len) * speed,
        vy: (dy / len) * speed,
        size: rnd(6, 9),
        rotation: rnd(PI * 2),
        rotSpeed: rnd(-0.1, 0.1),
        breathPhase: rnd(PI * 2),
        trail: [],
      });
    }
  }
  orbitRadius = clamp(orbitRadius + 0.05, 0, 40);

  // Draw orbit path
  color("light_black");
  arc(centerX, centerY, orbitRadius, 1);

  // Draw center with subtle pulse
  let centerPulse = 1 + sin(ticks * 0.1) * 0.1;
  color("yellow");
  box(centerX, centerY, 4 * centerPulse);

  // Draw player trail (afterimage)
  playerTrail.forEach((t) => {
    let alpha = t.life / 24;
    color(alpha > 0.5 ? "light_cyan" : "light_black");
    box(t.x, t.y, 8 * alpha);
  });

  // Draw player first for collision detection
  invincibleTicks--;
  color(invincibleTicks > 0 ? "blue" : "cyan");

  // Squash & stretch: stretch vertically on direction change
  let stretchW = 6 / playerStretch;
  let stretchH = 6 * playerStretch;

  if (box(player.x, player.y, stretchW, stretchH).isColliding.rect.yellow) {
    end();
  }

  // Update and draw asteroids
  remove(asteroids, (a) => {
    a.x += a.vx;
    a.y += a.vy;
    a.rotation += a.rotSpeed;
    a.breathPhase += 0.15;

    // Breathing animation for asteroids
    let breathScale = 1 + sin(a.breathPhase) * 0.08;

    // Update asteroid trail
    if (ticks % 4 === 0) {
      a.trail.push({ x: a.x, y: a.y, life: 30 });
    }
    remove(a.trail, (t) => {
      t.life--;
      return t.life <= 0;
    });

    let dx = player.x - a.x;
    let dy = player.y - a.y;
    let dist = sqrt(dx * dx + dy * dy);

    // Graze detection (close but not colliding)
    let grazeThreshold = a.size / 2 + 15;

    let grazed = false;
    if (invincibleTicks < 0 && dist < grazeThreshold) {
      addScore(1);
      play("click");
      grazed = true;
      // Graze particles flying opposite to player movement
      color("purple");
      if (ticks % 3 == 0) {
        let oppositeDir = atan2(dy, dx) + PI;
        particle(a.x, a.y, 3, 1, oppositeDir, PI / 4);
      }
    }

    // Draw asteroid trail
    a.trail.forEach((t) => {
      let alpha = t.life / 30;
      color("light_purple");
      box(t.x, t.y, a.size * 0.7 * alpha);
    });

    // Draw asteroid with rotation and breathing
    color(grazed ? "red" : "purple");
    let drawSize = a.size * breathScale;
    let col = bar(a.x, a.y, drawSize, drawSize * 0.7, a.rotation);

    if (col.isColliding.rect.blue) {
      // Destruction particles
      color("purple");
      particle(a.x, a.y, 15, 2);
      return true;
    }
    if (col.isColliding.rect.cyan) {
      play("explosion");
      // Collision particles
      color("red");
      particle(a.x, a.y, 20, 3);
      orbitRadius = clamp(orbitRadius - 20, 0, 40);
      invincibleTicks = 60;
    }

    // Remove if off screen
    return a.x < -10 || a.x > 110 || a.y < -10 || a.y > 110;
  });
}
