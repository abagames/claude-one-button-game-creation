title = "TROJAN DEFENSE";

description = `
[Tap]
 Change Direction
[Hold]
 Extend Shield
`;

characters = [
  `
   ll
   l
 lLll
llllll
l    l
l    l
`,
  `
   ll
   l
 lLll
llllll
l    l
l  l
`,
  `
   r
  rrr
 rrrrr
rrrrrrr
 rrrrr
  rrr
   r
`,
  `
  ll
 llll
llllll
llllll
 llll
  ll
`,
];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 7,
};

/**
 * @typedef {{
 * pos: Vector,
 * radius: number
 * }} Horse
 */

/**
 * @typedef {{
 * angle: number,
 * length: number,
 * width: number,
 * arcAngle: number,
 * rotationSpeed: number,
 * rotationDirection: number,
 * extending: boolean
 * }} Shield
 */

/**
 * @typedef {{
 * pos: Vector,
 * type: string,
 * fireRate: number,
 * nextFire: number,
 * fireSpeed: number
 * }} Enemy
 */

/**
 * @typedef {{
 * pos: Vector,
 * vel: Vector,
 * isDeflected: boolean,
 * deflectedTicks: number
 * }} Projectile
 */

/**
 * @typedef {{
 * pos: Vector,
 * radius: number,
 * duration: number,
 * ticks: number
 * }} Explosion
 */

/**
 * @type {Horse}
 */
let horse;

/**
 * @type {Shield}
 */
let shield;

/**
 * @type {Enemy[]}
 */
let enemies;

/**
 * @type {Projectile[]}
 */
let projectiles;

/**
 * @type {Explosion[]}
 */
let explosions;

/**
 * @type {number}
 */
let multiplier;

/**
 * @type {number}
 */
let waveCount;

/**
 * @type {number}
 */
let nextEnemyTicks;

function update() {
  if (!ticks) {
    // Initialize game on first tick
    horse = {
      pos: vec(50, 50),
      radius: 5,
    };

    shield = {
      angle: 0,
      length: 10, // Initial shield length (half of extended length)
      width: 4,
      arcAngle: PI / 8, // Default shield arc angle
      rotationSpeed: 0.06,
      rotationDirection: 1,
      extending: false,
    };

    enemies = [];
    projectiles = [];
    explosions = [];
    multiplier = 1;
    waveCount = 0;
    nextEnemyTicks = 60;
  }

  // Draw arena border
  color("light_black");
  arc(horse.pos, 60, 2);

  // Handle input - change rotation direction
  if (input.isJustPressed) {
    play("select");
    shield.rotationDirection *= -1;
    // Reset multiplier when button is pressed
    multiplier = 1;
  }

  // Handle shield extension
  if (input.isPressed) {
    shield.extending = true;
    // Gradually widen shield's arc angle
    if (shield.arcAngle < PI / 3) {
      shield.arcAngle += 0.02;
    }
    // Extend shield length when button is pressed
    if (shield.length < 20) {
      shield.length += 0.5;
    }
  } else {
    shield.extending = false;
    // Gradually return shield to normal angle
    if (shield.arcAngle > PI / 8) {
      shield.arcAngle -= 0.015;
    }
    // Retract shield length when button is not pressed
    if (shield.length > 10) {
      shield.length -= 0.3;
    }
  }

  // Update shield rotation (slower when extended)
  let speedFactor;
  if (shield.extending) {
    speedFactor = 1 - ((shield.arcAngle - PI / 8) / (PI / 3 - PI / 8)) * 0.7; // Adjust deceleration rate
  } else {
    speedFactor = 1.2; // Slightly faster when button is not pressed
  }

  shield.angle +=
    shield.rotationDirection * shield.rotationSpeed * speedFactor * difficulty;

  // Draw the Trojan Horse
  color("black");
  char(shield.extending ? "b" : "a", horse.pos);

  // Draw the shield as an arc instead of a bar
  color("cyan");

  // Draw arc shield
  const shieldStartAngle = shield.angle - shield.arcAngle / 2;
  const shieldEndAngle = shield.angle + shield.arcAngle / 2;
  for (let r = horse.radius; r <= horse.radius + shield.length; r += 1.5) {
    arc(horse.pos, r, 1, shieldStartAngle, shieldEndAngle);
  }

  // Spawn enemies
  nextEnemyTicks--;
  if (nextEnemyTicks < 0) {
    waveCount++;

    // Increase number of enemies with difficulty
    const enemyCount = Math.min(5, Math.floor(1 + waveCount / 3));

    // Randomly determine base angle for enemy group spawn
    const baseAngle = rnd(0, Math.PI * 2);

    for (let i = 0; i < enemyCount; i++) {
      // Position enemies within ±45 degrees of base angle (PI/4 = 45 degrees)
      const angleVariation = rnd(-PI / 4, PI / 4);
      const angle = baseAngle + angleVariation;

      const distance = 50; // Enemy spawn distance from center
      const enemyPos = vec(
        horse.pos.x + Math.cos(angle) * distance,
        horse.pos.y + Math.sin(angle) * distance
      );

      // Enemy types: normal (0), fast (1), strong (2)
      const enemyType = rnd() < 0.7 ? 0 : rnd() < 0.5 ? 1 : 2;

      // Different properties based on enemy type
      let fireRate, fireSpeed;

      switch (enemyType) {
        case 0: // Normal
          fireRate = rnd(120, 180) / sqrt(difficulty);
          fireSpeed = 0.5 * sqrt(difficulty);
          break;
        case 1: // Fast
          fireRate = rnd(80, 120) / sqrt(difficulty);
          fireSpeed = 0.8 * sqrt(difficulty);
          break;
        case 2: // Strong
          fireRate = rnd(150, 200) / sqrt(difficulty);
          fireSpeed = 0.4 * sqrt(difficulty);
          break;
      }

      enemies.push({
        pos: enemyPos,
        type: enemyType.toString(),
        fireRate: fireRate,
        nextFire: rnd(30, 60),
        fireSpeed: fireSpeed,
      });
    }

    // Set time until next wave
    nextEnemyTicks = rnd(180, 300) / sqrt(difficulty);
  }

  // Update explosions
  color("light_red");
  remove(explosions, (e) => {
    e.ticks--;
    const radiusRatio = e.ticks / e.duration;
    const r = e.radius * sin(radiusRatio * PI);
    arc(e.pos, r);
    return e.ticks < 0;
  });

  // Update projectiles
  remove(projectiles, (p) => {
    // Move projectile
    p.pos.add(p.vel);

    // Draw all projectiles in red for collision detection
    color("red");

    // Draw projectile for collision detection - larger size
    const projectileCollision = box(p.pos, 3).isColliding;

    // Visually display deflected projectiles in yellow (doesn't affect collision)
    if (p.isDeflected) {
      color("yellow");
      box(p.pos, 2.5);
    }

    if (!p.isDeflected) {
      // Check collision with shield
      if (projectileCollision.rect.cyan) {
        // Deflect the projectile
        p.isDeflected = true;
        p.deflectedTicks = 0;

        // Play sound
        play("coin");

        // Calculate the reflection angle based on where on the shield it hit
        // Calculate angle from horse to projectile
        const angleToProjectile = horse.pos.angleTo(p.pos);

        // Use this angle for reflection (perpendicular to the arc at that point)
        const reflectionAngle = angleToProjectile;

        // Reflect velocity
        const speed = p.vel.length * 1.5;
        p.vel = vec(speed, 0).rotate(reflectionAngle);

        // Visual effect
        particle(p.pos, 5, 1, reflectionAngle, PI / 4);

        return false;
      }

      // Check if projectile hit the horse
      if (projectileCollision.char.a || projectileCollision.char.b) {
        // Game over
        play("explosion");
        end();
        return true;
      }
    } else {
      // Update ticks since deflection
      p.deflectedTicks++;

      // Check if deflected projectile hit enemy
      if (
        projectileCollision.char.c ||
        projectileCollision.char.d ||
        projectileCollision.char.e
      ) {
        return true; // Remove projectile (enemy hit handling done in enemy update)
      }
    }

    // Check if projectile is out of bounds
    const distanceFromCenter = p.pos.distanceTo(horse.pos);
    return distanceFromCenter > 55;
  });

  // Update enemies
  remove(enemies, (e) => {
    // Draw enemy based on type
    color("red");
    // Check if enemy collides with yellow (deflected) projectiles
    const enemyCollision = char(
      addWithCharCode("c", parseInt(e.type)),
      e.pos
    ).isColliding;
    const isHit = enemyCollision.rect.yellow;

    if (isHit) {
      // Enemy hit by deflected projectile
      play("powerUp");

      // Add score with multiplier
      addScore(multiplier * (parseInt(e.type) + 1) * 10, e.pos);
      multiplier++;

      // Create explosion
      explosions.push({
        pos: vec(e.pos),
        radius: 8,
        duration: 20,
        ticks: 20,
      });

      // Visual effects
      particle(e.pos, 15, 2, 0, PI * 2);

      return true;
    }

    // Fire projectiles
    e.nextFire--;
    if (e.nextFire <= 0) {
      // Calculate angle to horse
      const angle = e.pos.angleTo(horse.pos);

      // Create projectile
      projectiles.push({
        pos: vec(e.pos),
        vel: vec(e.fireSpeed, 0).rotate(angle),
        isDeflected: false,
        deflectedTicks: 0,
      });

      // Sound effect
      play("laser");

      // Reset fire timer with some randomness
      e.nextFire = e.fireRate * rnd(0.8, 1.2);
    }

    return false;
  });

  // Draw multiplier
  if (multiplier > 1) {
    color("yellow");
    // Display multiplier in top-left using smallText
    text("x" + multiplier, 3, 9, {
      scale: 1,
      isSmallText: true,
    });
  }

  // Increase difficulty over time
  if (enemies.length === 0 && ticks > 100) {
    difficulty += 0.0005;
  }
}
