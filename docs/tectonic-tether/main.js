// Game: Tectonic Tether
// A one-button game about swinging on a tether to collect geodes.

// --- Game Objects ---

/**
 * @typedef {{
 * angle: number,
 * angularVelocity: number,
 * tetherLength: number,
 * pos: Vector
 * }} PlayerShard
 */

/**
 * @type { PlayerShard }
 */
let playerShard;

/**
 * @typedef {{
 * pos: Vector,
 * growthTime: number,
 * isCollectible: boolean,
 * vel: Vector
 * }} GeodeFragment
 */

/**
 * @type { GeodeFragment[] }
 */
let geodeFragments;

/**
 * @typedef {{
 * pos: Vector,
 * size: number,
 * vel: Vector
 * }} Asteroid
 */

/**
 * @type { Asteroid[] }
 */
let asteroids;

// --- Game State ---
let chargePower;
let extensionBoost;
let absorptionPower;

// --- Game Constants ---
const CENTER = vec(50, 50);
const TETHER_SPEED = 0.7;
const BASE_ANGULAR_VELOCITY = 0.01;
const MAX_ANGULAR_VELOCITY = 0.05;
const MAX_CHARGE_POWER = 5;
const MAX_ABSORPTION_POWER = 30;
const DANGER_ABSORPTION_THRESHOLD = 10;
const EMPTY_ABSORPTION_THRESHOLD = 0;
const ABSORPTION_DECAY_RATE = 0.05;
const ABSORPTION_RECOVERY_RATE = 1.5;

// --- Game Setup ---
title = "Tectonic Tether";
description = `
[Hold] Charge & Retract
[Release] Extend
`;

options = {
  theme: "shape",
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 53,
  bgmVolume: 3,
  textEdgeColor: { title: "yellow" },
};

audioFiles = {
  bgm: "./tectonic-tether/Pixelated_ Adventures.mp3",
};

function update() {
  if (!ticks) {
    sss.setQuantize(16);
    playerShard = {
      angle: 0,
      angularVelocity: BASE_ANGULAR_VELOCITY,
      tetherLength: 35,
      pos: vec(50, 10),
    };
    geodeFragments = [];
    for (let i = 0; i < 7; i++) {
      geodeFragments.push({
        pos: vec(rnd(10, 90), rnd(10, 90)),
        growthTime: 60,
        isCollectible: true,
        vel: vec(0, 0),
      });
    }
    asteroids = [];
    for (let i = 0; i < 5; i++) {
      asteroids.push({
        pos: vec(rnd(20, 80), rnd(20, 80)),
        size: rnd(8, 12),
        vel: vec(0, 0),
      });
    }
    chargePower = 0;
    extensionBoost = 0;
    absorptionPower = MAX_ABSORPTION_POWER;
  }

  // --- Player Logic ---
  if (input.isPressed) {
    // Shorten tether
    playerShard.tetherLength -= TETHER_SPEED;
    playerShard.angularVelocity += 0.001;
    // Build charge only when tether is short
    if (playerShard.tetherLength <= 10) {
      chargePower = min(chargePower + 0.1, MAX_CHARGE_POWER);
    }
  } else {
    // Extend tether
    if (input.isJustReleased) {
      // Unleash the charged boost
      extensionBoost = chargePower;
      chargePower = 0;
      if (extensionBoost > 1) {
        play("laser", { volume: 0.7, pitch: 60 + floor(extensionBoost * 5) }); // C4 + boost effect
      }
    }
    playerShard.tetherLength += TETHER_SPEED + extensionBoost;
    playerShard.angularVelocity -= 0.0005;
    // Decay the boost
    extensionBoost *= 0.92;
  }

  playerShard.angularVelocity = clamp(
    playerShard.angularVelocity,
    BASE_ANGULAR_VELOCITY,
    MAX_ANGULAR_VELOCITY
  );

  playerShard.angle += playerShard.angularVelocity;
  playerShard.pos
    .set(CENTER)
    .addWithAngle(playerShard.angle, playerShard.tetherLength);

  // --- Absorption Power Logic ---
  // Gradually decrease absorption power over time
  absorptionPower -= ABSORPTION_DECAY_RATE * difficulty;

  // Check for depletion
  if (absorptionPower <= EMPTY_ABSORPTION_THRESHOLD) {
    play("explosion", { pitch: 36 }); // C2 - deep explosion
    particle(playerShard.pos, 20, 5);
    end();
  }

  // Wall collision for player
  if (playerShard.pos.x < 3) playerShard.pos.x = 3;
  if (playerShard.pos.x > 97) playerShard.pos.x = 97;
  if (playerShard.pos.y < 3) playerShard.pos.y = 3;
  if (playerShard.pos.y > 97) playerShard.pos.y = 97;
  playerShard.tetherLength = playerShard.pos.distanceTo(CENTER);
  playerShard.tetherLength = clamp(playerShard.tetherLength, 10, 999);

  // --- Drawing ---
  // Draw outer walls
  color("light_black");
  rect(0, 0, 100, 2); // Top
  rect(0, 98, 100, 2); // Bottom
  rect(0, 0, 2, 100); // Left
  rect(98, 0, 2, 100); // Right

  color("black");
  line(CENTER, playerShard.pos, 1);

  // Draw charge power as yellow line overlapping the tether
  if (chargePower > 0) {
    color("yellow");
    const chargeWidth = 1 + chargePower * 0.7;
    line(CENTER, playerShard.pos, chargeWidth);
  }

  // Draw absorption power as yellow rectangle overlapping player
  color("yellow");
  const absorptionSize = 6 + absorptionPower * 0.25;
  rect(
    playerShard.pos.x - absorptionSize / 2,
    playerShard.pos.y - absorptionSize / 2,
    absorptionSize,
    absorptionSize
  );

  // Apply danger effects when absorption power is low
  let playerPos = vec(playerShard.pos);
  if (absorptionPower <= DANGER_ABSORPTION_THRESHOLD) {
    // Add shaking effect
    const shakeIntensity =
      (DANGER_ABSORPTION_THRESHOLD - absorptionPower) * 0.2;
    playerPos.x += rnd(-shakeIntensity, shakeIntensity);
    playerPos.y += rnd(-shakeIntensity, shakeIntensity);

    // Flash red color occasionally and play warning sound
    if (ticks % 10 < 3) {
      color("red");
      // Play warning sound only at the start of each flash cycle
      if (ticks % 10 === 0) {
        play("click", { pitch: 64 - floor(absorptionPower) * 2 });
      }
    } else {
      color("cyan");
    }
  } else {
    color("cyan");
  }

  const playerCollision = box(playerPos, 6).isColliding;

  color("green");
  geodeFragments = geodeFragments.filter((g) => {
    // Update growth time
    if (g.growthTime < 60) {
      g.growthTime++;
      if (g.growthTime >= 60) {
        g.isCollectible = true;
        g.vel.set(0, 0); // Stop movement when fully grown
      }
    }

    // Apply velocity and friction during growth phase
    if (!g.isCollectible) {
      g.pos.add(g.vel);
      g.vel.mul(0.96); // Apply friction to slow down over time
    }

    // Calculate size based on growth
    const growthRatio = g.growthTime / 60;
    const currentSize = 1 + 4 * growthRatio;

    // Always attract collectible geodes within range based on absorption power
    const attractionRange = 15 + absorptionPower;
    if (
      g.isCollectible &&
      g.pos.distanceTo(playerShard.pos) < attractionRange
    ) {
      const attractionStrength = 0.3 + absorptionPower * 0.05;
      const toPlayer = vec(playerShard.pos)
        .sub(g.pos)
        .normalize()
        .mul(attractionStrength);
      g.pos.add(toPlayer);
    }

    // Keep geodes within screen bounds
    g.pos.x = clamp(g.pos.x, 5, 95);
    g.pos.y = clamp(g.pos.y, 5, 95);

    // Draw geode with current size
    const geodeCollision = box(g.pos, currentSize).isColliding;

    // Check collision only if collectible
    if (g.isCollectible && geodeCollision.rect.cyan) {
      play("coin", { volume: 0.3, pitch: 92 });
      particle(g.pos);
      // Increase absorption power when collecting geodes (up to maximum)
      absorptionPower = min(
        absorptionPower + ABSORPTION_RECOVERY_RATE,
        MAX_ABSORPTION_POWER
      );
      // Add 1 point for geode collection
      addScore(1);
      return false; // Remove this geode
    }
    return true; // Keep this geode
  });

  color("black");
  asteroids.forEach((a, i) => {
    // Update position and apply friction
    a.pos.add(a.vel);
    a.vel.mul(0.95);

    // Draw asteroid and check for collisions
    const asteroidCollision = box(a.pos, a.size).isColliding;

    // Player collision
    if (asteroidCollision.rect.cyan) {
      const playerDist = playerShard.pos.distanceTo(CENTER);
      const asteroidDist = a.pos.distanceTo(CENTER);

      // Calculate collision strength based on tether length and angular velocity
      const collisionStrength =
        playerShard.angularVelocity * (playerShard.tetherLength / 20);

      play("hit", { pitch: 48 + floor(collisionStrength) * 10 }); // C3 + collision intensity

      if (playerDist < asteroidDist) {
        playerShard.tetherLength -= 5;
      } else {
        playerShard.tetherLength += 5;
      }
      const knockback = vec(a.pos).sub(playerShard.pos).normalize().mul(0.8);
      a.vel.add(knockback);

      // Spawn geodes based on collision strength
      const numGeodes = floor(collisionStrength * 20 * difficulty);

      // Calculate base direction (opposite to knockback)
      const baseDirection = vec(knockback).mul(-1).normalize();

      for (let k = 0; k < numGeodes; k++) {
        // Add random spread around the base direction (±60 degrees)
        const spreadAngle = rnd(-PI / 3, PI / 3);
        const baseAngle = atan2(baseDirection.y, baseDirection.x);
        const finalAngle = baseAngle + spreadAngle;

        const speed = rnd(1.5, 3.5); // Vary speed for more natural spread
        const initialVel = vec(
          cos(finalAngle) * speed,
          sin(finalAngle) * speed
        ).mul(0.3);

        // Small random offset from asteroid position
        const spawnOffset = vec(rnd(-3, 3), rnd(-3, 3));
        const spawnPos = vec(a.pos).add(spawnOffset);
        spawnPos.x = clamp(spawnPos.x, 10, 90);
        spawnPos.y = clamp(spawnPos.y, 10, 90);

        geodeFragments.push({
          pos: spawnPos,
          growthTime: 0,
          isCollectible: false,
          vel: initialVel,
        });
      }
    }

    // Wall collision (destruction)
    if (asteroidCollision.rect.light_black) {
      play("explosion", { pitch: 55 + floor(a.size) }); // G3 + asteroid size
      particle(a.pos);
      addScore(10); // Add 10 points for asteroid destruction

      // Spawn many geodes when asteroid is destroyed
      const numGeodes = floor((a.size / 2 + 1) * difficulty);

      for (let k = 0; k < numGeodes; k++) {
        // Create random direction for explosive spread
        const angle = rnd(0, PI * 2);
        const speed = rnd(1.0, 1.5); // Higher speed for destruction effect
        const initialVel = vec(cos(angle) * speed, sin(angle) * speed);

        // Random offset around the destroyed asteroid position
        const spawnOffset = vec(rnd(-8, 8), rnd(-8, 8));
        const spawnPos = vec(a.pos).add(spawnOffset);
        spawnPos.x = clamp(spawnPos.x, 10, 90);
        spawnPos.y = clamp(spawnPos.y, 10, 90);

        geodeFragments.push({
          pos: spawnPos,
          growthTime: 0,
          isCollectible: false,
          vel: initialVel,
        });
      }

      a.pos.set(rnd(20, 80), rnd(20, 80));
      a.vel.set(0, 0);
    }

    // Asteroid vs Asteroid collision
    for (let j = i + 1; j < asteroids.length; j++) {
      const b = asteroids[j];
      const dist = a.pos.distanceTo(b.pos);
      const minDist = (a.size + b.size) / 2;
      if (dist < minDist) {
        play("click", { pitch: 60 }); // C4 + combined size
        const overlap = minDist - dist;
        const pushVector = vec(a.pos).sub(b.pos).normalize();
        a.pos.add(vec(pushVector).mul(overlap / 2));
        b.pos.sub(vec(pushVector).mul(overlap / 2));
        const knockbackForce = vec(pushVector).mul(0.4);
        a.vel.add(knockbackForce);
        b.vel.sub(knockbackForce);
      }
    }
  });
}
