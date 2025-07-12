title = "Echo Bridge";

description = `
[Press] Create bridge
`;

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  audioSeed: 3,
  bgmVolume: 3,
  textEdgeColor: { title: "light_black" },
};

audioFiles = {
  bgm: "./echo-bridge/Bridges_to_Islands.mp3",
};

let player;
let islands;
let bridges;
let rotationAngle;
let currentIsland;
let activeBridge;
let scrollOffset;
let nextIslandDistance;
let islandSpawnY;
let lastIslandX;
let materialGauge;

function update() {
  if (!ticks) {
    // Initialize islands array
    islands = [
      {
        pos: vec(50, 0),
        size: vec(15, 8),
        hasBeenUsed: false,
      },
    ];

    // Initialize player on bottom island
    currentIsland = islands[0];
    player = {
      pos: vec(currentIsland.pos),
      size: 3,
      onIsland: true,
    };

    // Initialize bridges array and rotation
    bridges = [];
    rotationAngle = 0;
    activeBridge = null;

    // Initialize scrolling variables
    scrollOffset = 0;
    nextIslandDistance = 10; // Random distance for next island spawn
    islandSpawnY = -nextIslandDistance;
    lastIslandX = 50; // Start from center
    materialGauge = 80; // Start with full materials
  }

  // Update rotation angle continuously
  rotationAngle += 0.05 * difficulty;

  // Check if player can build any bridge from current position (material range only)
  let canBuildBridge = false;
  if (player.onIsland) {
    islands.forEach((island) => {
      if (island !== currentIsland && !island.hasBeenUsed) {
        // Only consider islands that are visible on screen
        if (
          island.pos.x >= 0 &&
          island.pos.x <= 100 &&
          island.pos.y >= 0 &&
          island.pos.y <= 100
        ) {
          // Check if island is reachable with current materials (ignore direction)
          let bridgeLength = player.pos.distanceTo(island.pos);
          let materialCost = bridgeLength * 0.25;
          if (materialCost <= materialGauge) {
            canBuildBridge = true;
          }
        }
      }
    });
  }

  // Adjust scroll speed based on whether player can build bridges
  let baseScrollSpeed = 0.05 * difficulty;
  let constantScrollAmount =
    player.onIsland && !canBuildBridge ? baseScrollSpeed * 3 : baseScrollSpeed;
  scrollOffset += constantScrollAmount;

  // Move all islands down by constant scroll amount
  islands.forEach((island) => {
    island.pos.y += constantScrollAmount;
  });

  // Move all bridges down by constant scroll amount
  bridges.forEach((bridge) => {
    bridge.startPos.y += constantScrollAmount;
    bridge.endPos.y += constantScrollAmount;
  });

  // Move player down by constant scroll amount
  player.pos.y += constantScrollAmount;

  // Update island spawn position
  islandSpawnY += constantScrollAmount;

  // Handle additional scrolling when player moves too high (keep original mechanism)
  let additionalScrollAmount = 0;
  if (player.pos.y < 60) {
    additionalScrollAmount = 60 - player.pos.y;
    scrollOffset += additionalScrollAmount;

    // Move player to y=60
    player.pos.y = 60;

    // Move all islands down by additional scroll amount
    islands.forEach((island) => {
      island.pos.y += additionalScrollAmount;
    });

    // Move all bridges down by additional scroll amount
    bridges.forEach((bridge) => {
      bridge.startPos.y += additionalScrollAmount;
      bridge.endPos.y += additionalScrollAmount;
    });

    // Update island spawn position
    islandSpawnY += additionalScrollAmount;
  }

  // Spawn new islands as we scroll up
  while (islandSpawnY > -10) {
    // Generate new X coordinate that's spread out from the last one
    let newX;
    let attempts = 0;
    do {
      newX = rnd(0, 100);
      attempts++;
    } while (attempts < 10 && abs(newX - lastIslandX) < 25); // Try to keep at least 25 units apart

    // If we couldn't find a good position after 10 attempts, force it to the opposite side
    if (abs(newX - lastIslandX) < 25) {
      if (lastIslandX < 50) {
        newX = rnd(60, 100); // Place on right side
      } else {
        newX = rnd(0, 40); // Place on left side
      }
    }

    islands.push({
      pos: vec(newX, islandSpawnY),
      size: vec(rnd(10, 16), rnd(5, 8)),
      hasBeenUsed: false,
    });

    lastIslandX = newX; // Remember this position for next spawn

    // Set next spawn distance randomly
    nextIslandDistance = rnd(5, 20);
    islandSpawnY -= nextIslandDistance;
  }

  // Handle bridge creation on button press
  if (input.isJustPressed) {
    // Find the island that's most aligned with the rotation direction
    let targetIsland = null;
    let bestAlignment = -1; // Best dot product (closest to 1 means best alignment)

    islands.forEach((island) => {
      if (island !== currentIsland && !island.hasBeenUsed) {
        // Only consider islands that are visible on screen
        if (
          island.pos.x >= 0 &&
          island.pos.x <= 100 &&
          island.pos.y >= 0 &&
          island.pos.y <= 100
        ) {
          // Calculate direction from player to island
          let directionToIsland = vec(island.pos).sub(player.pos).normalize();
          // Calculate rotation direction
          let rotationDirection = vec().addWithAngle(rotationAngle, 1);

          // Calculate alignment using dot product
          let alignment =
            directionToIsland.x * rotationDirection.x +
            directionToIsland.y * rotationDirection.y;

          // Only consider islands that are roughly in the right direction (alignment > 0.3)
          // and within material gauge range
          if (alignment > 0.3 && alignment > bestAlignment) {
            let bridgeLength = player.pos.distanceTo(island.pos);
            let materialCost = bridgeLength * 0.25;
            if (materialCost <= materialGauge) {
              bestAlignment = alignment;
              targetIsland = island;
            }
          }
        }
      }
    });

    if (targetIsland) {
      let newBridge = {
        startPos: vec(player.pos),
        endPos: vec(targetIsland.pos),
        targetIsland: targetIsland,
        startIsland: player.onIsland ? currentIsland : null, // Track if bridge started from an island
      };

      bridges.push(newBridge);
      activeBridge = newBridge; // Set the newly created bridge as active
      targetIsland.hasBeenUsed = true; // Mark target island as used

      // Consume materials based on bridge length
      let bridgeLength = newBridge.startPos.distanceTo(newBridge.endPos);
      let materialCost = bridgeLength * 0.25;
      materialGauge = Math.max(0, materialGauge - materialCost);

      play("powerUp");
    } else {
      // No bridge could be created - penalty
      materialGauge = Math.max(0, materialGauge - 10);
      play("hit");
    }
  }

  // Update and draw bridges
  let bridgesToRemove = [];

  bridges.forEach((bridge) => {
    // Draw bridge - highlight active bridge
    if (bridge === activeBridge) {
      color("light_blue");
      line(bridge.startPos, bridge.endPos, 3);
    } else {
      color("light_blue");
      line(bridge.startPos, bridge.endPos, 2);
    }

    // Only allow movement on the active bridge
    if (input.isPressed && bridge === activeBridge) {
      // Check if player is close to the bridge line
      let bridgeStart = bridge.startPos;
      let bridgeEnd = bridge.endPos;
      let playerPos = player.pos;

      // Calculate distance from player to bridge line
      let bridgeVector = vec(bridgeEnd).sub(bridgeStart);
      let playerVector = vec(playerPos).sub(bridgeStart);
      let bridgeLength = bridgeVector.length;

      if (bridgeLength > 0) {
        // Project player position onto bridge line
        let projection =
          playerVector.x * bridgeVector.x + playerVector.y * bridgeVector.y;
        let t = projection / (bridgeLength * bridgeLength);

        // Check if player is within the bridge bounds and close to the line
        if (t >= 0 && t <= 1) {
          let closestPoint = vec(bridgeStart).add(vec(bridgeVector).mul(t));
          let distanceToLine = playerPos.distanceTo(closestPoint);

          // Player is on this bridge if close enough to the line
          if (distanceToLine < 8) {
            // Move player towards target island
            let direction = vec(bridgeEnd).sub(bridgeStart).normalize();
            let oldPos = vec(player.pos);
            player.pos.add(direction.mul(1.5));
            player.onIsland = false;

            // Add score for movement (movement pixels × multiplier, no message)
            let movementDistance = oldPos.distanceTo(player.pos);
            let multiplier = bridges.length;
            let movementScore = floor(
              movementDistance * multiplier * difficulty
            );
            score += movementScore;

            // Check if reached target island
            if (player.pos.distanceTo(bridge.targetIsland.pos) < 8) {
              player.pos.set(bridge.targetIsland.pos);
              currentIsland = bridge.targetIsland;
              player.onIsland = true;
              activeBridge = null; // Clear active bridge when reached destination

              // Mark bridge for removal
              bridgesToRemove.push(bridge);

              // Recover materials when bridge is completed
              let completedBridgeLength = bridge.startPos.distanceTo(
                bridge.endPos
              );
              let materialRecovery = completedBridgeLength * 0.2 * multiplier;
              materialGauge = Math.min(80, materialGauge + materialRecovery);
              addScore(floor(materialRecovery), player.pos);

              // If bridge started from an island (not from bridge middle), remove that island too
              if (bridge.startIsland) {
                remove(islands, (island) => island === bridge.startIsland);
              }

              play("select");
            }
          }
        }
      }
    }
  });

  // Remove completed bridges
  bridgesToRemove.forEach((bridgeToRemove) => {
    remove(bridges, (bridge) => bridge === bridgeToRemove);
  });

  // Remove islands that have moved too far down
  remove(islands, (island) => {
    return island.pos.y > 120;
  });

  // Remove bridges that have moved completely off screen
  remove(bridges, (bridge) => {
    // Check if both start and end positions are off screen
    let startOffScreen = bridge.startPos.y > 120;
    let endOffScreen = bridge.endPos.y > 120;

    if (startOffScreen && endOffScreen) {
      // Clear active bridge reference if this bridge was active
      if (bridge === activeBridge) {
        activeBridge = null;
      }
      return true;
    }
    return false;
  });

  // Game over if player reaches bottom of screen
  if (player.pos.y >= 100) {
    play("explosion");
    end();
  }

  // Draw islands
  islands.forEach((island) => {
    // Draw main body of island
    if (island.hasBeenUsed) {
      color("light_green");
    } else {
      color("green");
    }
    box(island.pos, island.size);

    // Draw yellow bottom edge
    color("yellow");
    rect(
      island.pos.x - island.size.x / 2,
      island.pos.y + island.size.y / 2 - 2,
      island.size.x,
      4
    );

    // Draw animated waves below the island
    color("light_cyan");
    let waveTime = ticks * 0.05; // Slower animation
    let islandLeft = island.pos.x - island.size.x / 2;
    let islandBottom = island.pos.y + island.size.y / 2;

    // Create island-specific randomness using position as seed
    let islandSeed = island.pos.x * 0.1 + island.pos.y * 0.05;

    // Bottom waves - 6 small waves with variation
    for (let i = 0; i < 6; i++) {
      let waveSeed = islandSeed + i * 1.7; // Individual wave variation
      let waveX =
        islandLeft + (island.size.x / 5) * (i - 0.5) + sin(waveSeed) * 0.5;
      let waveY = islandBottom + 2 + sin(waveTime + i * 0.8 + waveSeed) * 0.8;
      let waveSize =
        0.5 +
        sin(waveTime + i * 0.3 + waveSeed * 0.5) * 0.2 +
        sin(waveSeed * 2) * 0.1;
      rect(waveX, waveY, waveSize * 5, waveSize * 3);
    }
  });

  // Draw material range indicator
  color("light_blue");
  let maxBridgeLength = materialGauge / 0.25; // Maximum bridge length with current materials
  arc(player.pos, maxBridgeLength, 1);

  // Draw rotation indicator
  color("blue");
  let indicatorEnd = vec(player.pos).addWithAngle(rotationAngle, 15);
  line(player.pos, indicatorEnd, 1);

  // Draw player
  color("blue");
  box(player.pos, player.size);

  // Draw multiplier info
  color("black");
  text(`x${bridges.length}`, 3, 9, { isSmallText: true });

  // Draw material gauge in bottom left
  color("blue");
  rect(5, 90, Math.floor((materialGauge / 80) * 40), 3); // Gauge bar (doubled length)
  color("black");
  line(5, 90, 45, 90, 1); // Top border
  line(5, 93, 45, 93, 1); // Bottom border
  line(5, 90, 5, 93, 1); // Left border
  line(45, 90, 45, 93, 1); // Right border
}
