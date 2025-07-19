title = "Pulse Stream";

description = `
[Tap] Push back 
drifting objects.
Don't lose 3 lanes!
`;

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 8,
  bgmVolume: 3,
  isDrawingScoreFront: true,
  textEdgeColor: { title: "cyan" },
};

audioFiles = {
  bgm: "./pulse-stream/Pixelated_Journey.mp3",
};

let streamCurrents;
let pulseWaves;
let driftingObjects;
let streamPhase;
let bubbleSpawnIndex;
let pulseSpawnIndex;
let laneUsageCount;
let disabledLanes;
let laneRecoveryProgress;
let lastTapTime;
let autoTapTimer;
let rapidTapRate;

// Recovery settings
const TAPS_TO_RECOVER = 36;

function update() {
  if (!ticks) {
    streamCurrents = [
      { pos: vec(0, 18), width: 100, height: 9, y: 18 },
      { pos: vec(0, 36), width: 100, height: 9, y: 36 },
      { pos: vec(0, 54), width: 100, height: 9, y: 54 },
      { pos: vec(0, 72), width: 100, height: 9, y: 72 },
      { pos: vec(0, 90), width: 100, height: 9, y: 90 },
    ];
    pulseWaves = [];
    driftingObjects = [];
    const streamChoice = streamCurrents[2];
    driftingObjects.push({
      pos: vec(98, streamChoice.y + rnds(2)),
      velocity: vec(-0.2, 0),
      size: 3,
      streamY: streamChoice.y,
      baseStreamY: streamChoice.y,
    });
    streamPhase = 0;
    bubbleSpawnIndex = 0;
    pulseSpawnIndex = 0;
    laneUsageCount = [0, 0, 0, 0, 0]; // Track usage for each lane
    disabledLanes = [false, false, false, false, false]; // Track disabled lanes
    laneRecoveryProgress = [0, 0, 0, 0, 0]; // Track recovery progress (0-TAPS_TO_RECOVER) for each lane
    lastTapTime = ticks;
    autoTapTimer = 0;
    rapidTapRate = 0;
  }

  streamPhase += 0.05;

  // Spawn pulse waves naturally from left (environment-driven)
  if (ticks % 36 === 0) {
    // Weighted random selection favoring less-used lanes
    let laneWeights = laneUsageCount.map((count) => Math.max(1, 10 - count));
    let totalWeight = laneWeights.reduce((sum, weight) => sum + weight, 0);
    let randomValue = rnd() * totalWeight;

    let selectedLane = 0;
    let cumulativeWeight = 0;
    for (let i = 0; i < laneWeights.length; i++) {
      cumulativeWeight += laneWeights[i];
      if (randomValue <= cumulativeWeight) {
        selectedLane = i;
        break;
      }
    }

    // If selected lane is disabled, find an active lane
    if (disabledLanes[selectedLane]) {
      // Find active lane
      let foundActiveLane = false;
      for (let i = 0; i < streamCurrents.length; i++) {
        selectedLane = (selectedLane + i) % streamCurrents.length;
        if (!disabledLanes[selectedLane]) {
          foundActiveLane = true;
          break;
        }
      }
      // If no active lanes found, don't spawn (all lanes disabled)
      if (!foundActiveLane) {
        selectedLane = -1; // Mark as invalid
      }
    }

    if (selectedLane !== -1) {
      let streamChoice = streamCurrents[selectedLane];
      laneUsageCount[selectedLane]++;

      // Reset usage counts periodically for continued randomness
      if (ticks % 600 === 0) {
        laneUsageCount = [0, 0, 0, 0, 0];
      }

      pulseWaves.push({
        pos: vec(-5, streamChoice.y),
        velocity: vec(0.8, 0),
        amplitude: rnd(1, 1.7),
        streamY: streamChoice.y,
        baseStreamY: streamChoice.y, // Keep original Y for reference
        tapExpansion: 0, // Animation state for tap expansion
      });
    }
  }

  // Spawn drifting objects - semi-random with slight bias toward cycling
  if (rnd() < 0.01 * difficulty) {
    let selectedLane;

    // 70% chance to follow cycle, 30% chance to be random
    if (rnd() < 0.7) {
      selectedLane = bubbleSpawnIndex;
      bubbleSpawnIndex = (bubbleSpawnIndex + 1) % streamCurrents.length;
    } else {
      selectedLane = rndi(0, streamCurrents.length);
    }

    // If selected lane is disabled, find an active lane
    if (disabledLanes[selectedLane]) {
      // Find active lane
      let foundActiveLane = false;
      for (let i = 0; i < streamCurrents.length; i++) {
        selectedLane = (selectedLane + 1) % streamCurrents.length;
        if (!disabledLanes[selectedLane]) {
          foundActiveLane = true;
          break;
        }
      }
      // If no active lanes found, don't spawn (all lanes disabled)
      if (!foundActiveLane) {
        selectedLane = -1; // Mark as invalid
      }
    }

    if (selectedLane !== -1) {
      let streamChoice = streamCurrents[selectedLane];

      driftingObjects.push({
        pos: vec(98, streamChoice.y + rnds(2)),
        velocity: vec(rnd(-0.3, -0.2), 0), // Initial leftward velocity only
        size: rnd(2.5, 4),
        streamY: streamChoice.y,
        baseStreamY: streamChoice.y, // Keep original Y for reference
      });
    }
  }

  // Handle auto-tap system
  let simulatedTap = false;

  if (input.isJustPressed) {
    lastTapTime = ticks;
    autoTapTimer = 0;
  } else {
    // Check if 10 seconds (600 frames) have passed without tapping
    if (ticks - lastTapTime >= 600) {
      autoTapTimer++;
      if (autoTapTimer >= 60) {
        // Auto-tap every 1 second (60 frames)
        simulatedTap = true;
        autoTapTimer = 0;
      }
    }
  }

  // Trigger tap expansion animation for all pulse waves
  if (input.isJustPressed || simulatedTap) {
    rapidTapRate += 0.3;
    pulseWaves.forEach((pulse) => {
      pulse.tapExpansion = 1.5;
    });

    // Recover disabled lanes on tap
    for (let i = 0; i < disabledLanes.length; i++) {
      if (disabledLanes[i]) {
        laneRecoveryProgress[i]++;
        if (laneRecoveryProgress[i] >= TAPS_TO_RECOVER) {
          disabledLanes[i] = false; // Re-enable the lane
          laneRecoveryProgress[i] = 0; // Reset progress
          play("powerUp", { volume: 0.9, pitch: 110 });
        }
      }
    }

    // Play tap sound
    play("click", { volume: 0.3 });
  }
  rapidTapRate *= 0.98;

  // Update pulse waves
  color("cyan");
  remove(pulseWaves, (pulse) => {
    pulse.pos.add(pulse.velocity);

    // Keep pulse at base stream position
    pulse.pos.y = pulse.baseStreamY;

    // Update tap expansion animation
    if (pulse.tapExpansion > 0) {
      pulse.tapExpansion -= 0.08;
      if (pulse.tapExpansion < 0) pulse.tapExpansion = 0;
    }

    let waveHeight = sin(streamPhase + pulse.pos.x * 0.1) * pulse.amplitude;
    let expandedRadius = pulse.amplitude * 3 + pulse.tapExpansion * 4;
    arc(pulse.pos.x, pulse.pos.y + waveHeight, expandedRadius, 2);

    return pulse.pos.x > 105;
  });

  // Update drifting objects
  color("red");
  remove(driftingObjects, (obj) => {
    obj.pos.add(obj.velocity);

    // Check for pulse wave interaction when button pressed (real or simulated)
    if (input.isJustPressed || simulatedTap) {
      let accelerated = false;
      pulseWaves.forEach((pulse) => {
        if (
          abs(obj.baseStreamY - pulse.baseStreamY) < 5 &&
          obj.pos.distanceTo(pulse.pos) < pulse.amplitude * 6
        ) {
          // Add rightward acceleration when timed correctly
          obj.velocity.x += 0.8;
          obj.velocity.y += rnds(0.2);
          accelerated = true;
          particle(obj.pos, 4, 1, 0, 2 * PI);
          addScore(1, obj.pos); // 1 point for deflecting object
          play("hit", { volume: 0.7, pitch: 150 });
        }
      });

      // Small penalty for mistimed presses (no nearby pulse)
      if (!accelerated) {
        obj.velocity.x -= 0.1 * (0.25 + rapidTapRate);
      }
    }

    // Natural deceleration (no constant stream flow)
    obj.velocity.x *= 0.993;
    obj.velocity.y -= obj.velocity.y * 0.01;
    obj.velocity.y *= 0.9;

    // Gradually return to stream center
    let targetY = obj.baseStreamY;
    obj.pos.y += (targetY - obj.pos.y) * 0.05;

    box(obj.pos, obj.size, obj.size * 2);

    // Defense failure: object reached left edge
    if (obj.pos.x < 0) {
      particle(obj.pos, 8, 2, 0, PI);
      play("explosion", { volume: 0.6, pitch: 0.8 });

      // Disable the lane where the object escaped
      let failedLaneIndex = streamCurrents.findIndex(
        (s) => s.y === obj.baseStreamY
      );
      if (failedLaneIndex !== -1) {
        disabledLanes[failedLaneIndex] = true;
        laneRecoveryProgress[failedLaneIndex] = 0; // Reset recovery progress

        // Remove all objects from this lane
        driftingObjects = driftingObjects.filter(
          (otherObj) => otherObj.baseStreamY !== obj.baseStreamY
        );

        // Remove all pulse waves from this lane
        pulseWaves = pulseWaves.filter(
          (pulse) => pulse.baseStreamY !== obj.baseStreamY
        );
      }
      return true;
    }

    // Success: objects that reach the right side give bonus points
    if (obj.pos.x > 100) {
      addScore(2, vec(95, obj.pos.y)); // 2 points for pushing object to right edge
      particle(95, obj.pos.y, 6, 2, PI, PI / 4);
      play("coin", { volume: 0.9, pitch: 130 });
      return true;
    }

    return false;
  });

  // Lane recovery is now handled in tap processing above

  // Check for game over condition (3 or more disabled lanes)
  let disabledCount = disabledLanes.filter((disabled) => disabled).length;
  if (disabledCount >= 3) {
    play("explosion", { volume: 0.8, pitch: 0.6 });
    end();
  }

  // Draw stream currents
  streamCurrents.forEach((streamCurrent, index) => {
    // Set color based on lane status and recovery progress
    if (disabledLanes[index]) {
      // Calculate recovery progress (0 to 1) based on tap count
      let recoveryProgress = laneRecoveryProgress[index] / TAPS_TO_RECOVER;
      let recoveryWidth = recoveryProgress * streamCurrent.width;

      // Draw the recovered portion (blue from left)
      if (recoveryWidth > 0) {
        color("blue");
        rect(
          streamCurrent.pos.x,
          streamCurrent.pos.y,
          recoveryWidth,
          streamCurrent.height
        );
      }

      // Draw the remaining disabled portion (light_blue)
      if (recoveryWidth < streamCurrent.width) {
        color("light_blue");
        rect(
          streamCurrent.pos.x + recoveryWidth,
          streamCurrent.pos.y,
          streamCurrent.width - recoveryWidth,
          streamCurrent.height
        );
      }
    } else {
      // Lane is active, draw normally
      color("blue");
      rect(
        streamCurrent.pos.x,
        streamCurrent.pos.y,
        streamCurrent.width,
        streamCurrent.height
      );
    }
  });
}
