title = "Marble Bounce";
description = `[Tap] Bounce higher`;

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 3,
  bgmVolume: 3,
  textEdgeColor: { title: "light_blue" },
};

audioFiles = {
  bgm: "./marble-bounce/Marbles_in_Motion.mp3",
};

let marble, pins, ground;
let marbleVelocity, gravity;
let pinSpawnTimer, multiplier;
let pinSpawnInterval, baseSpawnInterval;

function update() {
  if (!ticks) {
    sss.setQuantize(0);
    marble = { pos: vec(50, 80), size: 3 };
    pins = [];
    ground = { pos: vec(50, 95), size: vec(100, 5) };
    marbleVelocity = vec(0, 0);
    gravity = 0.1;
    pinSpawnTimer = 0;
    multiplier = 1;
    baseSpawnInterval = 360;
    pinSpawnInterval = baseSpawnInterval;

    // Create pins with proper spacing
    let minDistance = 15; // Minimum distance between pins
    for (let i = 0; i < 8; i++) {
      let attempts = 0;
      let maxAttempts = 50;
      let validPosition = false;
      let newPos;

      while (attempts < maxAttempts && !validPosition) {
        newPos = vec(rnd(10, 90), rnd(20, 80));
        validPosition = true;

        // Check distance from existing pins
        pins.forEach((pin) => {
          if (newPos.distanceTo(pin.pos) < minDistance) {
            validPosition = false;
          }
        });

        // Check distance from marble initial position
        if (newPos.distanceTo(vec(50, 80)) < minDistance) {
          validPosition = false;
        }

        attempts++;
      }

      // If we couldn't find a valid position, use the last attempt
      if (!validPosition) {
        newPos = vec(rnd(10, 90), rnd(20, 80));
      }

      pins.push({
        pos: newPos,
        size: 2,
        isTarget: i === 0, // First pin is the target
        spawning: false,
        spawnSize: 2,
        targetSize: 2,
        lastHitTime: 0,
        createdTime: ticks,
        warningTime: 600, // 10 seconds warning phase
        explosionTime: 900, // 15 seconds total before explosion
        originalPos: vec(newPos), // Store original position for collision
      });
    }
  }

  // Apply gravity
  marbleVelocity.y += gravity;

  // Spawn new pins periodically with decreasing intervals
  pinSpawnTimer += sqrt(difficulty);
  if (pinSpawnTimer >= pinSpawnInterval) {
    pinSpawnTimer = 0;

    // Try to spawn a new pin with proper spacing
    let attempts = 0;
    let maxAttempts = 20;
    let minDistance = 15; // Minimum distance between pins

    while (attempts < maxAttempts) {
      let newPos = vec(rnd(10, 90), rnd(20, 80));
      let tooClose = false;

      // Check distance from existing pins
      pins.forEach((pin) => {
        if (newPos.distanceTo(pin.pos) < minDistance) {
          tooClose = true;
        }
      });

      // Check distance from marble
      if (newPos.distanceTo(marble.pos) < minDistance) {
        tooClose = true;
      }

      if (!tooClose) {
        pins.push({
          pos: newPos,
          size: 2,
          isTarget: false,
          spawning: true,
          spawnSize: 0,
          targetSize: 2,
          lastHitTime: 0,
          createdTime: ticks,
          warningTime: 600,
          explosionTime: 900,
          originalPos: vec(newPos),
        });

        play("laser");

        // Decrease spawn interval for next pin
        pinSpawnInterval = clamp(pinSpawnInterval - 30, 90, baseSpawnInterval);
        break;
      }
      attempts++;
    }
  }

  // Handle button press for upward force
  if (input.isJustPressed) {
    marbleVelocity.y = clamp(marbleVelocity.y - 3, -5, 5);
    play("jump", { volume: 5 });
  }

  // Update marble position
  marble.pos.add(marbleVelocity);

  // Draw ground
  color("green");
  rect(ground.pos.x - 50, ground.pos.y - 2.5, 100, 5);

  // Display multiplier
  color("black");
  text(`x${multiplier}`, 3, 9, { isSmallText: true });

  // Handle ground collision
  if (marble.pos.y + marble.size >= ground.pos.y - 2.5) {
    marble.pos.y = ground.pos.y - 2.5 - marble.size;
    marbleVelocity.y = -marbleVelocity.y * 0.7;

    // Add random horizontal velocity if marble is nearly stationary horizontally
    if (abs(marbleVelocity.x) < 0.5) {
      marbleVelocity.x += rnds(1, 2);
    }
  }

  // Update and draw pins
  pins.forEach((pin) => {
    // Update spawning animation
    if (pin.spawning) {
      pin.spawnSize += 0.1;
      if (pin.spawnSize >= pin.targetSize) {
        pin.spawnSize = pin.targetSize;
        pin.spawning = false;
      }
      pin.size = pin.spawnSize;
    }

    // Handle target pin timing and warning
    if (pin.isTarget) {
      let timeAlive = (ticks - pin.createdTime) * sqrt(difficulty);

      // Check for explosion
      if (timeAlive > pin.explosionTime) {
        // Game over
        play("explosion");
        end();
        return;
      }

      // Warning phase - vibration and particles
      if (timeAlive > pin.warningTime) {
        // Calculate intensity based on time until explosion
        let warningProgress =
          (timeAlive - pin.warningTime) / (pin.explosionTime - pin.warningTime);
        let intensity = warningProgress; // 0 to 1 as explosion approaches

        // Vibration effect - gets stronger as explosion approaches (visual only)
        let vibrationStrength = 0.2 + intensity * 1.0;
        let vibrationSpeed = 0.2 + intensity * 0.8;
        let vibrationX = sin(ticks * vibrationSpeed) * vibrationStrength;
        let vibrationY = cos(ticks * vibrationSpeed * 1.3) * vibrationStrength;

        // Emit particles - more frequent and intense as explosion approaches
        let particleFrequency = floor(20 - intensity * 15); // 20 to 5 frames
        let particleCount = floor(2 + intensity * 6); // 2 to 8 particles
        let particleSpeed = 0.5 + intensity * 2; // 0.5 to 2.5 speed

        if (ticks % clamp(particleFrequency, 3, 20) === 0) {
          play("hit", { seed: 1 });
          particle(vec(pin.pos.x + vibrationX, pin.pos.y + vibrationY), {
            count: particleCount,
            speed: particleSpeed,
            angle: rnd(0, PI * 2),
            angleWidth: PI * 2,
            edgeColor: intensity > 0.7 ? "yellow" : "red",
          });
        }

        // Flashing color effect - faster as explosion approaches
        let flashSpeed = floor(20 - intensity * 15); // 20 to 5 frames
        color(
          ticks % clamp(flashSpeed, 3, 20) < clamp(flashSpeed / 2, 1, 10)
            ? "red"
            : "yellow"
        );

        // Draw pin with vibration effect
        arc(vec(pin.pos.x + vibrationX, pin.pos.y + vibrationY), pin.size);
      } else {
        color("red");
        // Draw pin at normal position
        arc(pin.pos, pin.size);
      }
    } else {
      color("black");
      // Draw pin at normal position
      arc(pin.pos, pin.size);
    }
  });

  // Draw marble and check for collisions
  color("blue");
  let marbleCollision = arc(marble.pos, marble.size);

  // Check collision with regular pins (black)
  if (marbleCollision.isColliding.rect.black) {
    // Find the closest regular pin that's colliding
    let closestPin = null;
    let closestDistance = Infinity;

    pins.forEach((pin) => {
      if (!pin.isTarget) {
        let distance = marble.pos.distanceTo(pin.pos);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPin = pin;
        }
      }
    });

    if (closestPin) {
      // Move marble away from the pin until no collision
      let attempts = 0;
      while (attempts < 10) {
        let separationAngle = closestPin.pos.angleTo(marble.pos);
        marble.pos.addWithAngle(separationAngle, 1);

        // Test if still colliding with black pins
        color("transparent");
        let stillColliding = arc(marble.pos, marble.size).isColliding.rect
          .black;
        if (!stillColliding) {
          break;
        }
        attempts++;
      }

      // Add score for hitting regular pin (with cooldown)
      let hitCooldown = 9;
      if (ticks - closestPin.lastHitTime > hitCooldown) {
        addScore(multiplier, marble.pos);
        closestPin.lastHitTime = ticks;
        play("hit", { volume: 0.5 });
      }

      // Bounce off the pin
      marbleVelocity.x = rnds(1, 2);
      marbleVelocity.y = -abs(marbleVelocity.y) * 0.8;
    }

    // Redraw marble in final position
    color("blue");
    marbleCollision = arc(marble.pos, marble.size);
  }

  // Check collision with target pin (red or yellow)
  if (
    marbleCollision.isColliding.rect.red ||
    marbleCollision.isColliding.rect.yellow
  ) {
    // Find the target pin that's colliding
    let targetPin = null;
    pins.forEach((pin) => {
      if (pin.isTarget) {
        let distance = marble.pos.distanceTo(pin.pos);
        if (distance < marble.size + pin.size) {
          targetPin = pin;
        }
      }
    });

    if (targetPin) {
      // Bounce off the target pin before destroying it
      let separationAngle = targetPin.pos.angleTo(marble.pos);
      marble.pos.addWithAngle(separationAngle, 2);
      marbleVelocity.x = rnds(2, 3);
      marbleVelocity.y = -abs(marbleVelocity.y) * 0.9;

      // Add score for destroying target pin (100x multiplier)
      addScore(multiplier * 100, marble.pos);
      play("powerUp");

      // Reset spawn interval when target is destroyed
      pinSpawnInterval = baseSpawnInterval;
      pinSpawnTimer = 0;

      // Remove the target pin
      pins = pins.filter((pin) => !pin.isTarget);

      // Check if all pins are destroyed
      if (pins.length === 0) {
        // Increase multiplier and spawn new wave of pins
        multiplier++;
        play("lucky");

        // Create new wave of pins with proper spacing
        let minDistance = 15;
        for (let i = 0; i < 8; i++) {
          let attempts = 0;
          let maxAttempts = 50;
          let validPosition = false;
          let newPos;

          while (attempts < maxAttempts && !validPosition) {
            newPos = vec(rnd(10, 90), rnd(20, 80));
            validPosition = true;

            // Check distance from existing pins
            pins.forEach((pin) => {
              if (newPos.distanceTo(pin.pos) < minDistance) {
                validPosition = false;
              }
            });

            // Check distance from marble current position
            if (newPos.distanceTo(marble.pos) < minDistance) {
              validPosition = false;
            }

            attempts++;
          }

          // If we couldn't find a valid position, use the last attempt
          if (!validPosition) {
            newPos = vec(rnd(10, 90), rnd(20, 80));
          }

          pins.push({
            pos: newPos,
            size: 2,
            isTarget: i === 0, // First pin is the target
            spawning: true,
            spawnSize: 0,
            targetSize: 2,
            lastHitTime: 0,
            createdTime: ticks,
            warningTime: 600,
            explosionTime: 900,
            originalPos: vec(newPos),
          });
        }
      } else {
        // Convert a random regular pin to target pin
        let regularPins = pins.filter((pin) => !pin.isTarget);
        if (regularPins.length > 0) {
          let randomPin = regularPins[rndi(regularPins.length)];
          randomPin.isTarget = true;
          randomPin.createdTime = ticks;
          randomPin.warningTime = 600;
          randomPin.explosionTime = 900;
          randomPin.originalPos = vec(randomPin.pos);
        } else {
          // If no regular pins, create a new target pin
          let newTargetPos = vec(rnd(10, 90), rnd(20, 80));
          pins.push({
            pos: newTargetPos,
            size: 2,
            isTarget: true,
            spawning: true,
            spawnSize: 0,
            targetSize: 2,
            lastHitTime: 0,
            createdTime: ticks,
            warningTime: 600,
            explosionTime: 900,
            originalPos: vec(newTargetPos),
          });
        }
      }

      // Redraw marble after bounce
      color("blue");
      arc(marble.pos, marble.size);
    }
  }

  // Keep marble on screen horizontally
  if (marble.pos.x < 5) {
    marble.pos.x = 5;
    marbleVelocity.x = abs(marbleVelocity.x);
  }
  if (marble.pos.x > 95) {
    marble.pos.x = 95;
    marbleVelocity.x = -abs(marbleVelocity.x);
  }

  // Keep marble on screen vertically
  if (marble.pos.y < 5) {
    marble.pos.y = 5;
    marbleVelocity.y = abs(marbleVelocity.y);
  }
}
