title = "MICROBIAL FOCUS";
description = `
[Hold]
 Adjust focus depth
`;
characters = [];
options = {
  theme: "shape",
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 9,
  bgmVolume: 5,
};

audioFiles = {
  bgm: "./microbial-focus/Pixelated_Dreams.mp3",
};

let focusDepth,
  focusDirection,
  microbes,
  holdCycle,
  nextMicrobeSpawn,
  multiplier;

function update() {
  if (!ticks) {
    // Initialize game state
    focusDepth = 0.5; // 0 = deep layer, 1 = shallow layer
    focusDirection = 1; // 1 = toward shallow, -1 = toward deep
    microbes = [];
    holdCycle = 1; // 0 = toward shallow, 1 = toward deep
    nextMicrobeSpawn = 0;
    multiplier = 1;
  }

  // Focus control system
  if (input.isJustPressed) {
    // Switch direction on each new press
    if (holdCycle === 0) {
      focusDirection = 1; // toward shallow
      holdCycle = 1;
    } else {
      focusDirection = -1; // toward deep
      holdCycle = 0;
    }

    // Button press sound
    play("select", {
      pitch: 60,
      volume: 0.5,
    });
  }

  if (input.isPressed) {
    // Continuous focus transition while holding
    focusDepth += focusDirection * 0.015 * sqrt(difficulty);

    // Clamp to bounds
    if (focusDepth < 0 || focusDepth > 1) {
      focusDepth = clamp(focusDepth, 0, 1);
      play("laser", { volume: 0.5 });
      multiplier = 1;
    }
  }

  // Decrease multiplier every frame
  multiplier *= 0.999;

  // Add new microbes periodically from screen edge
  if (ticks >= nextMicrobeSpawn && microbes.length < 24) {
    nextMicrobeSpawn =
      ticks + (50 / difficulty / difficulty) * sqrt(microbes.length + 1);
    // Generate out-of-focus depth
    let newDepth;
    for (let i = 0; i < 8; i++) {
      newDepth = rnd(0.05, 0.95);
      if (abs(newDepth - focusDepth) > 0.15) {
        break;
      }
    }

    // Generate position from screen edge
    let edge = floor(rnd(0, 4)); // 0=top, 1=right, 2=bottom, 3=left
    let newPos;
    let initialVelocity;

    // Generate microbe first to get size
    let microbeSize = rnd(4, 8);

    if (edge === 0) {
      // top (safely inside deletion boundary)
      newPos = vec(rnd(10, 90), -microbeSize + 1);
      initialVelocity = vec(rnd(-0.2, 0.2), rnd(0.5, 1));
    } else if (edge === 1) {
      // right (safely inside deletion boundary)
      newPos = vec(100 + microbeSize - 1, rnd(10, 90));
      initialVelocity = vec(rnd(-1, -0.5), rnd(-0.2, 0.2));
    } else if (edge === 2) {
      // bottom (safely inside deletion boundary)
      newPos = vec(rnd(10, 90), 100 + microbeSize - 1);
      initialVelocity = vec(rnd(-0.2, 0.2), rnd(-1, -0.5));
    } else {
      // left (safely inside deletion boundary)
      newPos = vec(-microbeSize + 1, rnd(10, 90));
      initialVelocity = vec(rnd(0.5, 1), rnd(-0.2, 0.2));
    }

    microbes.push({
      pos: newPos,
      depth: newDepth,
      size: microbeSize,
      moving: false,
      moveDir: vec(0, 0),
      velocity: initialVelocity,
      anger: 0,
      maxAnger: floor(600 / sqrt(sqrt(difficulty))),
    });

    // Microbe spawn sound
    play("select", {
      pitch: 48 + rndi(0, 12),
      volume: 0.4,
    });
  }

  // Update microbes
  microbes.forEach((microbe) => {
    // Calculate blur based on focus depth difference
    let depthDiff = abs(microbe.depth - focusDepth);
    let isInFocus = depthDiff < 0.1;

    // Increase anger over time
    microbe.anger++;

    // Anger warning sounds
    let angerRatio = microbe.anger / microbe.maxAnger;
    if (angerRatio >= 0.8 && microbe.anger % 30 === 0) {
      // High danger warning
      play("hit", {
        pitch: 84 + rndi(-2, 3),
        volume: 1,
      });
    } else if (angerRatio >= 0.6 && microbe.anger % 60 === 0) {
      // Medium danger warning
      play("hit", {
        pitch: 72 + rndi(-2, 3),
        volume: 0.7,
      });
    }

    // Movement when in focus
    if (isInFocus) {
      if (!microbe.moving) {
        microbe.moving = true;
        // Calculate direction away from center (50, 50)
        let centerPos = vec(50, 50);
        let directionFromCenter = vec(
          microbe.pos.x - centerPos.x,
          microbe.pos.y - centerPos.y
        );

        // Normalize direction
        let length = sqrt(
          directionFromCenter.x * directionFromCenter.x +
            directionFromCenter.y * directionFromCenter.y
        );
        if (length > 0) {
          microbe.moveDir = vec(
            directionFromCenter.x / length,
            directionFromCenter.y / length
          );
        } else {
          // If exactly at center, move in random direction
          let angle = rnd(0, PI * 2);
          microbe.moveDir = vec(cos(angle), sin(angle));
        }
      }

      // Apply acceleration away from center
      let acceleration = 0.02;
      microbe.velocity.x += microbe.moveDir.x * acceleration;
      microbe.velocity.y += microbe.moveDir.y * acceleration;

      // Move based on velocity
      microbe.pos.add(microbe.velocity);
    } else {
      // Apply deceleration when out of focus
      microbe.velocity.x *= 0.99;
      microbe.velocity.y *= 0.99;

      // Continue moving with current velocity
      microbe.pos.add(microbe.velocity);

      // Reset moving state when velocity is very low
      if (abs(microbe.velocity.x) < 0.01 && abs(microbe.velocity.y) < 0.01) {
        microbe.moving = false;
        microbe.velocity = vec(0, 0);
      }
    }
  });

  // Remove off-screen microbes and award scores
  remove(microbes, (microbe) => {
    let depthDiff = abs(microbe.depth - focusDepth);
    let isInFocus = depthDiff < 0.1;

    if (
      microbe.pos.x < -microbe.size ||
      microbe.pos.x > 100 + microbe.size ||
      microbe.pos.y < -microbe.size ||
      microbe.pos.y > 100 + microbe.size
    ) {
      let roundedMultiplier = round(multiplier);
      // Clamp score position to screen bounds
      let scorePos = vec(
        clamp(microbe.pos.x, 10, 90),
        clamp(microbe.pos.y, 20, 99)
      );
      addScore(roundedMultiplier, scorePos);
      multiplier += 1;
      play("powerUp");
      return true; // Remove this microbe
    }
  });

  // Draw microbes
  microbes.forEach((microbe) => {
    // Calculate blur based on focus depth difference
    let depthDiff = abs(microbe.depth - focusDepth);
    let blur = depthDiff * 15;
    let isInFocus = depthDiff < 0.1;

    // Draw microbe with blur effect
    let angerRatio = microbe.anger / microbe.maxAnger;
    let angerRadius = angerRatio * microbe.size;

    // Calculate flashing for anger indicator
    let shouldFlash = angerRatio > 0.6; // Start flashing when 60% angry
    let flashPeriod = 21 - (angerRatio - 0.6) * 20; // 30 frames to 10 frames period
    let isFlashFrame =
      shouldFlash && floor(microbe.anger / flashPeriod) % 2 === 0;
    let angerColor = isFlashFrame ? "yellow" : "red";
    let blurredAngerColor = isFlashFrame ? "light_yellow" : "light_red";

    if (isInFocus) {
      // Sharp, in-focus microbe
      color("green");
      arc(microbe.pos, microbe.size);

      // Add shy/embarrassed particle effect when in focus
      if (rnd() < 0.3) {
        particle(microbe.pos, {
          count: 1,
          speed: rnd(0.5, 1.5),
        });
      }

      // Sharp anger indicator
      if (angerRadius > 0.5) {
        color(angerColor);
        arc(microbe.pos, angerRadius);

        // Add anger particle effect
        if (angerRatio > 0.7 && rnd() < angerRatio) {
          particle(microbe.pos, {
            count: rndi(2, 5),
            speed: rnd(1, 3),
          });
        }
      }
    } else {
      // Blurred, out-of-focus microbe (draw fixed offset pattern)
      let blurAmount = blur * 0.5;

      // Draw blur copies in fixed pattern
      let offsets = [
        [-blurAmount, 0],
        [blurAmount, 0],
      ];

      color("light_green");
      offsets.forEach((offset) => {
        arc(
          vec(microbe.pos.x + offset[0], microbe.pos.y + offset[1]),
          microbe.size * (0.8 + blurAmount * 0.1)
        );
      });

      // Blurred anger indicator
      if (angerRadius > 0.5) {
        color(blurredAngerColor);
        offsets.forEach((offset) => {
          arc(
            vec(microbe.pos.x + offset[0], microbe.pos.y + offset[1]),
            angerRadius * (0.8 + blurAmount * 0.1)
          );
        });

        // Add blurred anger particle effect
        if (angerRatio > 0.7 && rnd() < angerRatio * 0.5) {
          particle(microbe.pos, {
            count: rnd(1, 3),
            speed: rnd(0.8, 2),
            angle: rnd(0, PI * 2),
          });
        }
      }
    }

    // Check for game over
    if (microbe.anger >= microbe.maxAnger) {
      color("red");
      text("X", vec(microbe.pos).clamp(3, 97, 3, 97));
      play("explosion");
      end();
    }
  });

  // Draw focus depth indicator
  color("blue");
  rect(10, 90, 80, 3);
  color("cyan");
  rect(10 + focusDepth * 80 - 2, 89, 4, 5);

  // Draw multiplier
  color("black");
  text("x" + round(multiplier), vec(3, 9), { isSmallText: true });
}
