title = "Jet Stream";
description = `[Tap] Cycle Lanes`;

characters = [
  `
  ll
   l l
  lll
 l l
  ll
 l  l
`,
  `
  ll
   l
 lllll
  l
 l l
l  l
`,
  `
  ll
 l l
  lll
   l l
  ll
  l l
`,
];

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 6,
  bgmVolume: 3,
  textEdgeColor: { title: "light_cyan" },
};

audioFiles = {
  bgm: "./jet-stream/Pixel_Playtime.mp3",
};

let surfer;
let windBarriers;
let streamOffset;
let wakeParticles;
let barrierSpawnTimer;
let baseSpawnInterval;
let wakeParticleTimer;
let wakeParticleInterval;
let multiplier;

function update() {
  if (!ticks) {
    sss.setQuantize(0);
    surfer = {
      pos: vec(50, 25),
      lane: 0, // 0 = upper, 1 = center, 2 = lower
      step: 0,
      animFrame: 0,
      animSpeed: 0.1,
      boardSway: 0,
      knockbackVel: vec(0, 0),
      buttonKnockbackRatio: 0,
    };
    windBarriers = [];
    streamOffset = 0;
    wakeParticles = [];
    barrierSpawnTimer = 0;
    baseSpawnInterval = 120; // Base interval (frames)
    wakeParticleTimer = 0;
    wakeParticleInterval = 3;
    multiplier = 1;
  }

  // Switch lanes on tap (upper → center → lower → center → upper)
  if (input.isJustPressed) {
    surfer.step = (surfer.step + 1) % 4;

    surfer.knockbackVel.x += surfer.buttonKnockbackRatio;
    surfer.knockbackVel.y -= 1;
    surfer.buttonKnockbackRatio += 1;

    // Pattern: step 0=upper, step 1=center, step 2=lower, step 3=center
    if (surfer.step === 0) {
      surfer.lane = 0; // upper
    } else if (surfer.step === 1) {
      surfer.lane = 1; // center
    } else if (surfer.step === 2) {
      surfer.lane = 2; // lower
    } else if (surfer.step === 3) {
      surfer.lane = 1; // center
    }

    // Play lane switch sound
    play("select", { volume: 0.5 });
  }
  surfer.buttonKnockbackRatio *= 0.9;

  // Move surfer to target lane
  let targetY = surfer.lane === 0 ? 21 : surfer.lane === 1 ? 46 : 71;
  surfer.pos.y += (targetY - surfer.pos.y) * 0.1;

  // Apply knockback velocity with damping
  surfer.pos.add(surfer.knockbackVel);
  surfer.knockbackVel.mul(0.9); // Damping effect

  // Move surfer based on lane - edges flow left, center flows right
  let laneSpeed = 0.5 * sqrt(difficulty);
  if (surfer.lane === 0 || surfer.lane === 2) {
    // Upper and lower lanes flow left
    surfer.pos.x -= laneSpeed;
  } else {
    // Center lane flows right
    surfer.pos.x += laneSpeed;
  }

  // Draw stream lines
  streamOffset += 2 * sqrt(difficulty);
  color("light_blue");
  for (let i = 0; i < 5; i++) {
    // Upper lane flows left
    let xUpper = 100 - (((i * 25 + streamOffset) % 125) - 25);
    line(xUpper, 25, xUpper - 15, 25, 2);

    // Center lane flows right
    let xCenter = ((i * 25 + streamOffset) % 125) - 25;
    line(xCenter, 50, xCenter + 15, 50, 2);

    // Lower lane flows left
    let xLower = 100 - (((i * 25 + streamOffset) % 125) - 25);
    line(xLower, 75, xLower - 15, 75, 2);
  }

  // Update surfer animation (slower, more subtle for standing pose)
  if (rnd() < 0.05) {
    surfer.animFrame++;
  }
  //surfer.animFrame += surfer.animSpeed;
  surfer.boardSway += 0.1;

  // Draw surfer with minimal animation (just slight body sway)
  color("blue");
  let charIndex = [0, 1, 2, 1][floor(surfer.animFrame) % 4]; // Only use first 2 frames for subtle movement

  // Keep surfer always upright - no rotation needed
  char(addWithCharCode("a", charIndex), surfer.pos, {
    color: "blue",
  });

  // Draw surfboard as a line below the surfer that sways with air currents
  color("yellow");
  let boardY = surfer.pos.y + 4; // Always below the surfer
  let swayAmount = sin(surfer.boardSway) * 1.5; // Sway effect based on air currents

  // Board sway direction depends on lane (air current direction)
  if (surfer.lane === 0 || surfer.lane === 2) {
    // Edge lanes - board sways as if pushed by leftward air current
    swayAmount = sin(surfer.boardSway + streamOffset * 0.02) * 1;
  } else {
    // Center lane - board sways as if pushed by rightward air current
    swayAmount = sin(surfer.boardSway - streamOffset * 0.02) * 1;
  }

  // Draw board as angled line
  let boardStartX = surfer.pos.x - 4;
  let boardEndX = surfer.pos.x + 4;
  let boardStartY = boardY + swayAmount;
  let boardEndY = boardY - swayAmount;

  line(boardStartX, boardStartY, boardEndX, boardEndY, 2);

  // Spawn wake particles behind the surfboard using timer
  wakeParticleTimer++;

  if (wakeParticleTimer >= wakeParticleInterval) {
    // Determine spawn position behind board based on movement direction
    let wakeX, velocityX;
    if (surfer.lane === 0 || surfer.lane === 2) {
      // Edge lanes flow left - particles spawn to the right (behind)
      wakeX = surfer.pos.x + 5;
      velocityX = 0.3; // Particles move right (away from surfer)
    } else {
      // Center lane flows right - particles spawn to the left (behind)
      wakeX = surfer.pos.x - 5;
      velocityX = -0.3; // Particles move left (away from surfer)
    }

    wakeParticles.push({
      pos: vec(wakeX, boardY),
      vel: vec(velocityX, -0.1),
      size: 1,
      life: 24,
      maxLife: 24,
    });

    // Reset timer
    wakeParticleTimer = 0;
  }

  // Update and draw wake particles
  color("cyan");
  remove(wakeParticles, (p) => {
    p.pos.add(p.vel);
    p.life--;

    // Particles grow larger as they age
    p.size = 1 + (1 - p.life / p.maxLife) * 2;

    // Draw particle if still alive
    if (p.life > 0) {
      rect(p.pos.x - p.size / 2, p.pos.y - p.size / 2, p.size, p.size);
    }

    // Remove if expired or off screen
    return p.life <= 0 || p.pos.x < -5 || p.pos.x > 105;
  });

  // Spawn wind barriers using interval system
  barrierSpawnTimer += difficulty;

  // Calculate next spawn interval with random variation
  let nextSpawnInterval = baseSpawnInterval + rnd(-30, 30); // ±30 frames variation

  if (barrierSpawnTimer >= nextSpawnInterval) {
    let lane = rndi(3);
    let yPos = lane === 0 ? 25 : lane === 1 ? 50 : 75;
    let spawnX = lane === 0 || lane === 2 ? -10 : 110; // Left spawn for edge lanes, right spawn for center
    windBarriers.push({
      pos: vec(spawnX, yPos),
      lane: lane,
      rotation: 0,
      pulsePhase: rnd(0, 2 * PI),
      shrinking: false,
      shrinkScale: 1.0,
      shrinkSpeed: 0.15,
      destroyed: false,
      destroyScale: 1.0,
      destroyExpansion: 1.0,
    });

    // Reset timer with slight random variation for next interval
    barrierSpawnTimer = 0;
    baseSpawnInterval = 120 + rnd(-20, 20); // Adjust base interval slightly for variation
  }

  // Update wind barriers
  remove(windBarriers, (b) => {
    // Move barriers according to their lane flow direction (only if not shrinking)
    if (!b.shrinking) {
      let barrierSpeed = 1 * sqrt(difficulty);
      if (b.lane === 0 || b.lane === 2) {
        // Edge lanes flow left, so barriers move right
        b.pos.x += barrierSpeed;
        b.rotation += 0.15; // Rotate clockwise for right movement
      } else {
        // Center lane flows right, so barriers move left
        b.pos.x -= barrierSpeed;
        b.rotation -= 0.15; // Rotate counter-clockwise for left movement
      }
    }

    b.pulsePhase += 0.2;

    // Handle shrinking animation (collision with surfer)
    if (b.shrinking) {
      b.shrinkScale -= b.shrinkSpeed;
      if (b.shrinkScale <= 0) {
        return true; // Remove when fully shrunk
      }
    }

    // Handle destruction animation (hit by wake particle)
    if (b.destroyed) {
      b.destroyScale -= 0.1; // Individual arcs shrink
      b.destroyExpansion += 0.9; // Overall pattern expands
      if (b.destroyScale <= 0) {
        return true; // Remove when destruction complete
      }
    }

    let currentScale = b.shrinking
      ? b.shrinkScale
      : b.destroyed
      ? b.destroyScale
      : 1.0;
    let expansionScale = b.destroyed ? b.destroyExpansion : 1.0;

    // Draw enhanced wind barrier with appropriate scaling
    let pulseSize = (1 + sin(b.pulsePhase) * 0.3) * currentScale;

    // Draw swirling wind effects around the core and check collisions
    color("light_purple");
    let windCollision = false;
    for (let i = 0; i < 4; i++) {
      let angle = b.rotation + (i * PI) / 2;
      let windX = b.pos.x + cos(angle) * 6 * currentScale * expansionScale;
      let windY = b.pos.y + sin(angle) * 6 * currentScale * expansionScale;
      let windArc = arc(windX, windY, 2 * currentScale);

      // Check collision with wake particles on any swirling wind effect
      if (!b.shrinking && !b.destroyed && windArc.isColliding.rect.cyan) {
        windCollision = true;
      }
    }

    // Handle wake particle collision with swirling wind effects
    if (windCollision) {
      // Start destruction animation when hit by wake particle
      b.destroyed = true;

      // Add score based on current multiplier
      addScore(multiplier, b.pos);

      // Play destruction sound
      if (multiplier < 10) {
        play("powerUp", { seed: 107 });
      } else if (multiplier < 16) {
        play("powerUp", { seed: 108 });
      } else {
        play("powerUp");
      }
      // Increase multiplier (max 16)
      multiplier = clamp(multiplier + 1, 1, 16);
    }

    // Draw core (dark center) and check collision with surfer character
    color("purple");
    let coreCollision = arc(b.pos, 3 * pulseSize);

    // Check collision with surfer character (a, b, or c) only if not already shrinking or destroyed
    if (
      !b.shrinking &&
      !b.destroyed &&
      (coreCollision.isColliding.char.a ||
        coreCollision.isColliding.char.b ||
        coreCollision.isColliding.char.c)
    ) {
      // Apply knockback velocity in barrier's movement direction
      if (b.lane === 0 || b.lane === 2) {
        // Edge lanes - barrier moves right, knockback surfer right
        surfer.knockbackVel.x += 3 * sqrt(difficulty);
      } else {
        // Center lane - barrier moves left, knockback surfer left
        surfer.knockbackVel.x -= 3 * sqrt(difficulty);
      }

      // Add slight vertical knockback for impact effect
      surfer.knockbackVel.y += rnd(-0.5, 0.5);

      // Start shrinking animation instead of immediate removal
      b.shrinking = true;

      // Play collision sound
      play("explosion");
    }

    // Check if barrier escapes off screen (but not if shrinking or being destroyed)
    if (!b.shrinking && !b.destroyed && (b.pos.x < -15 || b.pos.x > 115)) {
      // Decrease multiplier when barrier escapes (min 1)
      multiplier = clamp(multiplier - 1, 1, 16);
      return true;
    }

    return false;
  });

  // Check game over condition - surfer goes too far off screen
  if (surfer.pos.x < -3 || surfer.pos.x > 103) {
    // Play game over sound
    play("explosion", { seed: 77 });
    end();
  }

  // Draw multiplier display
  color("black");
  text("x" + multiplier, 3, 9, { isSmallText: true });
}
