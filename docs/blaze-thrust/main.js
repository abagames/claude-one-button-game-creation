title = "Blaze Thrust";
description = `[Hold] Thrust upward`;

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  isDrawingParticleFront: true,
  audioSeed: 1,
  bgmVolume: 3,
};

audioFiles = {
  bgm: "./blaze-thrust/Flame_Bubble.mp3",
};

let flame;
let windCurrents;
let oxygenBubbles;
let scrollOffset;
let lastWindY;
let nextBubbleDistance;
let windAnimOffset;
let windParticles;
let blinkTimer;
let multiplier;
let holdTime;

function update() {
  if (!ticks) {
    sss.setQuantize(0);
    flame = {
      pos: vec(50, 90),
      velocity: vec(0, 0),
      size: 9,
      windEffect: 0.1,
    };
    windCurrents = [];
    oxygenBubbles = [];
    scrollOffset = 0;
    lastWindY = -100; // Start above screen
    nextBubbleDistance = rnd(10, 40); // Distance until next bubble spawn
    windAnimOffset = 0;
    windParticles = [];
    blinkTimer = 0;
    multiplier = 1;
    holdTime = 0;

    // Initialize wind currents with proper spacing
    let currentY = 0;
    for (let i = 0; i < 20; i++) {
      let width = rnd(20, 40);
      windCurrents.push({
        pos: vec(0, currentY),
        width: width,
        force: rnds(0.1, 0.3),
      });
      currentY += width + rnd(20, 40); // width of current band + gap to next band
      lastWindY = currentY - rnd(20, 40); // Track last wind position
    }

    // Initialize oxygen bubbles (start with none)
    // oxygenBubbles starts empty
  }

  // Handle thrust and track hold time
  if (input.isPressed) {
    flame.velocity.y -= 0.2;
    holdTime++;
  } else {
    holdTime -= 3;
    if (holdTime < 0) {
      holdTime = 0;
    }
  }

  // Apply gravity
  flame.velocity.y += 0.1;

  // Handle scrolling when player goes above y=60
  let scrollSpeed = 0;
  if (flame.pos.y < 60) {
    scrollSpeed = (60 - flame.pos.y) * 0.1;
    flame.pos.y += scrollSpeed;
    scrollOffset += scrollSpeed;
  }

  // Update flame position
  flame.pos.add(flame.velocity);
  flame.velocity.mul(0.95); // air resistance

  // Update wind currents with scrolling
  windCurrents.forEach((wind) => {
    wind.pos.y += scrollSpeed;
  });

  // Spawn new wind currents at the top when scrolling with proper spacing
  if (scrollSpeed > 0) {
    // Check if we need to spawn a new wind current
    let topWind = windCurrents.find((w) => w.pos.y < 0);
    if (!topWind && windCurrents.length < 10) {
      // Limit total wind currents
      let width = rnd(20, 40);
      let gap = rnd(20, 40);
      let newY = lastWindY - gap - width;
      windCurrents.push({
        pos: vec(0, newY),
        width: width,
        force: rnds(0.1, 0.3),
      });
      lastWindY = newY;
    }
  }

  // Remove wind currents that are too far down and update lastWindY
  windCurrents = windCurrents.filter((wind) => wind.pos.y < 120);

  // Update lastWindY to track the topmost wind current
  if (windCurrents.length > 0) {
    let topWind = windCurrents.reduce((top, current) =>
      current.pos.y < top.pos.y ? current : top
    );
    lastWindY = topWind.pos.y;
  }

  // Keep flame on screen with gentle repositioning
  if (flame.pos.x < 5) {
    flame.pos.x = 10;
    flame.velocity.x = Math.abs(flame.velocity.x) * 0.5;
  }
  if (flame.pos.x > 95) {
    flame.pos.x = 90;
    flame.velocity.x = -Math.abs(flame.velocity.x) * 0.5;
  }
  if (flame.pos.y < 5) {
    flame.pos.y = 10;
    flame.velocity.y = Math.abs(flame.velocity.y) * 0.3;
  }
  if (flame.pos.y > 95) {
    flame.pos.y = 90;
    flame.velocity.y = -Math.abs(flame.velocity.y) * 0.3;
  }

  // Update wind animation
  windAnimOffset += 2;

  // Draw wind currents with variable widths
  windCurrents.forEach((wind) => {
    color("cyan");
    rect(wind.pos, 100, wind.width);
  });

  // Update wind particles with scrolling
  windParticles.forEach((particle) => {
    particle.pos.y += scrollSpeed;
    particle.pos.x += particle.velocity.x;

    // Add sinusoidal vertical movement
    let waveX =
      cos(particle.age * 0.1 + particle.waveOffset) * particle.waveAmplitude;
    let waveY =
      sin(particle.age * 0.1 + particle.waveOffset) * particle.waveAmplitude;
    particle.pos.x += waveX;
    particle.pos.y += waveY * 0.5;

    particle.age++;
  });

  // Remove old wind particles
  windParticles = windParticles.filter(
    (particle) =>
      particle.pos.y < 120 &&
      particle.age < 180 &&
      particle.pos.x > -10 &&
      particle.pos.x < 110
  );

  // Spawn new wind particles
  if (rnd() < 0.15) {
    windCurrents.forEach((wind) => {
      // Cyan wind particles (left direction)
      if (rnd() < 0.25) {
        windParticles.push({
          pos: vec(100, wind.pos.y + rnd(0, wind.width)),
          velocity: vec(-rnd(1, 2), 0),
          age: 0,
          isPurple: true,
          waveOffset: rnd(0, PI * 2),
          waveAmplitude: rnd(0.2, 0.5),
        });
      }
    });

    // White area wind particles (right direction)
    for (let y = 0; y < 100; y += 20) {
      if (rnd() < 0.15) {
        let particleY = y + rnd(15);
        let isInCyan = windCurrents.some(
          (wind) =>
            particleY >= wind.pos.y && particleY <= wind.pos.y + wind.width
        );

        if (!isInCyan) {
          windParticles.push({
            pos: vec(0, particleY),
            velocity: vec(rnd(1, 2), 0),
            age: 0,
            isPurple: false,
            waveOffset: rnd(0, PI * 2),
            waveAmplitude: rnd(0.2, 0.5),
          });
        }
      }
    }
  }

  // Draw wind particles
  windParticles.forEach((particle) => {
    if (particle.isPurple) {
      color("light_cyan");
    } else {
      color("light_green");
    }
    rect(particle.pos, 6, 2);
  });

  // Check background color at player position using transparent collision detection
  color("transparent");
  let isOnPurple = box(flame.pos, 1, 1).isColliding.rect.cyan;

  // Apply horizontal force based on background color (affected by player size)
  if (isOnPurple) {
    flame.velocity.x -= flame.windEffect; // Cyan background = left force
  } else {
    flame.velocity.x += flame.windEffect; // White/none background = right force
  }

  // Player shrinks over time (increasingly faster when button is held)
  let shrinkRate = 0.0016 * difficulty * (1 + holdTime * 0.01);
  flame.size *= 1 - shrinkRate;
  flame.windEffect = flame.size * 0.02;

  // Check if flame size is critically low and end game
  if (flame.size <= 2) {
    play("explosion");
    end();
  }

  // Update blink timer
  blinkTimer++;

  // Draw flame with warning blink when size <= 5
  let shouldBlink = false;
  if (flame.size <= 5) {
    // Calculate blink speed based on how close to 3 the size is
    let blinkSpeed = floor(Math.max(5, 20 - (5 - flame.size) * 4)); // Faster blinking as size approaches 3
    shouldBlink = blinkTimer % blinkSpeed < blinkSpeed / 2;

    // Play warning sound at blink intervals
    if (blinkTimer % blinkSpeed === 0) {
      play("laser", { volume: 0.5 });
    }
  }

  if (flame.size <= 5 && shouldBlink) {
    color("light_red"); // Warning color
  } else {
    color("red"); // Normal color
  }
  arc(flame.pos, flame.size);

  // Update oxygen bubbles with scrolling and wind effects
  oxygenBubbles.forEach((bubble) => {
    bubble.pos.y += scrollSpeed;

    // Add gravity effect (speed based on size)
    bubble.pos.y += bubble.fallSpeed;

    // Check if bubble is in cyan wind current (slight left wind effect)
    let isInCyanWind = windCurrents.some(
      (wind) =>
        bubble.pos.y >= wind.pos.y && bubble.pos.y <= wind.pos.y + wind.width
    );

    if (isInCyanWind) {
      bubble.pos.x -= bubble.windEffect; // Left drift based on size
    } else {
      bubble.pos.x += bubble.windEffect; // Right drift based on size
    }

    // Keep bubbles within screen bounds horizontally
    if (bubble.pos.x < 5) bubble.pos.x = 5;
    if (bubble.pos.x > 95) bubble.pos.x = 95;
  });

  // Draw oxygen bubbles
  color("purple");
  remove(oxygenBubbles, (bubble) => {
    if (arc(bubble.pos, bubble.size).isColliding.rect.red) {
      // Play collection sound effect
      play("coin");

      // Add score based on multiplier
      addScore(multiplier, bubble.pos);

      // Increase multiplier (max 16)
      if (multiplier < 16) {
        multiplier++;
      }

      // Player grows based on bubble size
      flame.size = flame.size + bubble.size * 0.2 * difficulty;
      if (flame.size > 25) {
        flame.size = 25;
      }
      flame.windEffect = flame.size * 0.02;

      // Create circular ring particle effect
      let particleCount = Math.floor(bubble.size * 3); // More particles for larger bubbles
      let ringRadius = bubble.size + 2;

      for (let i = 0; i < particleCount; i++) {
        let angle = (i / particleCount) * PI * 2; // Distribute particles around circle
        let particleX = bubble.pos.x + cos(angle) * ringRadius;
        let particleY = bubble.pos.y + sin(angle) * ringRadius;

        // Create particle at calculated position with outward velocity
        particle(particleX, particleY, 1, 2, angle, 0.3);
      }
      return true;
    }
    if (bubble.pos.y > 120) {
      // Play multiplier reset sound effect
      if (multiplier > 1) {
        play("hit");
      }
      // Reset multiplier when bubble escapes screen
      multiplier = 1;
      return true;
    }
    return false;
  });

  // Spawn oxygen bubbles based on scroll distance
  if (scrollSpeed > 0 && oxygenBubbles.length < 15) {
    // Limit total bubbles
    nextBubbleDistance -= scrollSpeed;
    if (nextBubbleDistance <= 0) {
      let size = rnd(3, 9); // Random size between 3-9
      oxygenBubbles.push({
        pos: vec(rnd(10, 90), -size), // Always start just above screen
        size: size,
        windEffect: size * 0.02, // Larger bubbles affected more by wind
        fallSpeed: 0.3 - (size - 3) * 0.015, // Smaller bubbles fall faster
      });
      nextBubbleDistance = rnd(5, 55); // Set next spawn distance
    }
  }

  // Display multiplier
  color("black");
  text(`x${multiplier}`, 3, 9, { isSmallText: true });
}
