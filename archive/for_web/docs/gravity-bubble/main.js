title = "GRAVITY BUBBLE";

description = `
[Hold & Release] 
Place 
 anti-gravity bubbles
`;

options = {
  viewSize: { x: 100, y: 100 },
  theme: "simple",
  isPlayingBgm: true,
  isReplayEnabled: true,
  bgmVolume: 5,
  audioSeed: 101,
};

audioFiles = {
  bgm: "./gravity-bubble/Gravity_Groove.mp3",
};

let player,
  bubbles,
  enemies,
  walls,
  gameHeight,
  nextWallHeight,
  nextEnemySpawn,
  lastHeightScore,
  showingPreview,
  holdTime,
  savedPreviewPos,
  savedPreviewSize,
  playerInBubble;

function update() {
  if (!ticks) {
    //sss.setQuantize(0);
    player = {
      pos: vec(50, 50),
      vel: vec(1, 0), // automatic movement to the right
      size: 6,
    };
    bubbles = [];
    enemies = [];
    walls = [];
    gameHeight = 0; // reached altitude
    nextWallHeight = 150; // next wall spawn altitude
    nextEnemySpawn = 60; // next enemy spawn frame
    lastHeightScore = 0; // last added altitude score
    showingPreview = false;
    holdTime = 0; // hold time tracking
    savedPreviewPos = vec(0, 0);
    savedPreviewSize = 8;
    playerInBubble = false;
  }

  // === Player Physics ===
  // Apply gravity (adjusted to be even weaker)
  player.vel.y += 0.025;
  player.vel.y *= 0.995;

  // Automatic horizontal movement (wall bounce)
  player.pos.x += player.vel.x;
  if (player.pos.x > 95 || player.pos.x < 5) {
    player.vel.x *= -1; // reverse at wall
  }

  // Y-axis movement
  player.pos.y += player.vel.y;

  // === Scroll Processing ===
  // If player is above upper half of screen, move player and bubbles down
  if (player.pos.y < 60) {
    let scrollOffset = (60 - player.pos.y) * 0.5;

    // Move player down
    player.pos.y += scrollOffset;

    // Move all bubbles down too
    bubbles.forEach((bubble) => {
      bubble.pos.y += scrollOffset;
    });

    // Move all enemies down too
    enemies.forEach((enemy) => {
      enemy.pos.y += scrollOffset;
    });

    // Move all walls down too
    walls.forEach((wall) => {
      wall.pos.y += scrollOffset;
    });

    // Record altitude
    gameHeight += scrollOffset;
  }

  // === Bubble System ===
  if (input.isPressed) {
    // During hold: move preview circle to future position
    showingPreview = true;
    holdTime++; // increase hold time

    // Calculate preview circle position using same logic as player
    let previewFrames = holdTime; // predict ahead by hold time

    // Simulate with virtual player
    let virtualPlayer = {
      pos: vec(player.pos.x, player.pos.y),
      vel: vec(player.vel.x, player.vel.y),
    };

    // Simulate same movement as player for specified frames
    for (let i = 0; i < previewFrames; i++) {
      // Same physics processing as player
      virtualPlayer.pos.x += virtualPlayer.vel.x;
      virtualPlayer.pos.y += virtualPlayer.vel.y;
      if (virtualPlayer.pos.x > 95 || virtualPlayer.pos.x < 5) {
        virtualPlayer.vel.x *= -1; // reverse at wall (same as player)
      }
    }

    savedPreviewPos = vec(virtualPlayer.pos.x, virtualPlayer.pos.y);

    // Size adjustment (gradually expand with hold time)
    savedPreviewSize = 8 + min(25, holdTime * 0.2);

    // Display preview circle
    color("cyan");
    arc(savedPreviewPos, savedPreviewSize, 2);
  }

  // Bubble generation processing
  if (input.isJustReleased && showingPreview) {
    // On release: generate bubble at saved preview circle position and size
    bubbles.push({
      pos: vec(savedPreviewPos),
      size: savedPreviewSize,
      life: 180, // lasts for 3 seconds
    });

    // Bubble generation effect
    play("powerUp", { volume: 0.5, pitch: 60 });
    particle(savedPreviewPos, {
      count: Math.floor(savedPreviewSize / 3),
      speed: 1.5,
      angle: 0,
      angleWidth: PI * 2,
    });
  }

  if (!input.isPressed) {
    showingPreview = false;
    holdTime = 0; // reset hold time
  }

  // === Altitude Calculation ===
  // Current altitude is displayed with accumulated gameHeight
  let currentHeight = gameHeight + max(0, 100 - player.pos.y);

  // === Enemy Generation System ===
  // Difficulty calculation (based on altitude)
  let difficultyLevel = Math.floor(currentHeight / 100) + 1; // difficulty +1 per 100 altitude

  // Generate enemies at fixed intervals
  if (ticks >= nextEnemySpawn) {
    // Change enemy type according to difficulty
    let enemySpeed = rnd(0.2, 0.25 + sqrt(difficultyLevel) * 0.08); // more gradual speed increase
    let enemySize = 7 + min(3, Math.floor(difficultyLevel / 2)); // smaller and more gradual

    enemies.push({
      pos: vec(rnd(15, 85), -5), // appear from off-screen
      vel: vec(rnd(-0.6, 0.6), enemySpeed), // slightly suppress horizontal speed
      size: enemySize,
      inBubble: false,
      type: "normal",
    });

    // Set next enemy spawn time (shorten interval with difficulty, with variation)
    let baseInterval = Math.max(45, 120 - difficultyLevel * 10); // base interval
    let variation = baseInterval * 0.3; // 30% variation
    nextEnemySpawn = ticks + baseInterval + rnd(-variation, variation);
  }

  // === Wall Generation System ===
  // Generate walls based on altitude
  if (difficultyLevel > 2 && currentHeight >= nextWallHeight) {
    // Adjust wall length to be narrower
    let wallLength = rnd(25, 50);
    let wallX = rnd(0, 100 - wallLength); // ensure wall fits within screen

    walls.push({
      pos: vec(wallX + wallLength / 2, -5), // appear from off-screen
      width: wallLength,
      height: 4,
    });

    // Set next wall spawn altitude
    nextWallHeight = currentHeight + rnd(70, 150);
  }

  // === Bubble Processing ===
  // Initialize player bubble state
  let wasInBubble = playerInBubble;
  playerInBubble = false;

  remove(bubbles, (bubble) => {
    bubble.life--;

    // Gradually decrease bubble size (shrink in last 150 frames (2.5 seconds))
    let shrinkPhase = max(0, 150 - bubble.life);
    let currentBubbleSize = bubble.size * (1 - shrinkPhase / 150);

    // Gravity reversal detection inside bubble (player)
    let distanceToPlayer = player.pos.distanceTo(bubble.pos);
    if (distanceToPlayer < currentBubbleSize + 9) {
      // Player inside bubble - gravity reversal
      player.vel.y -= 0.05;
      playerInBubble = true;
    }

    // Gravity reversal detection inside bubble (enemies)
    enemies.forEach((enemy) => {
      let distanceToEnemy = enemy.pos.distanceTo(bubble.pos);
      if (distanceToEnemy < currentBubbleSize + enemy.size / 2) {
        // Enemy inside bubble - gravity reversal
        enemy.vel.y -= 0.08; // enemies have slightly stronger reversal force
        enemy.inBubble = true;
      } else {
        enemy.inBubble = false;
      }
    });

    // Draw bubble (at current size)
    color("cyan");
    arc(bubble.pos, currentBubbleSize, 1);

    // Complete bubble disappearance (return true to remove from array)
    return bubble.life <= 0;
  });

  // Bubble entry/exit effects
  if (!wasInBubble && playerInBubble) {
    // Entered bubble
    particle(player.pos, { count: 5, speed: 1, angle: 0, angleWidth: PI * 2 });
  } else if (wasInBubble && !playerInBubble) {
    // Exited bubble
    play("select", { volume: 0.5, pitch: 60 });
  }

  // === Enemy Processing and Drawing ===
  remove(enemies, (enemy) => {
    // Enemy physics processing
    if (!enemy.inBubble) {
      enemy.vel.y += 0.02; // weak gravity
    }

    // Enemy movement
    enemy.pos.add(enemy.vel);

    // Wall bounce at screen edges
    if (enemy.pos.x > 95 || enemy.pos.x < 5) {
      enemy.vel.x *= -1;
    }

    // Collision detection with walls
    walls.forEach((wall) => {
      let enemyLeft = enemy.pos.x - enemy.size / 2;
      let enemyRight = enemy.pos.x + enemy.size / 2;
      let wallLeft = wall.pos.x - wall.width / 2;
      let wallRight = wall.pos.x + wall.width / 2;

      let xOverlap = enemyRight > wallLeft && enemyLeft < wallRight;
      let yOverlap =
        Math.abs(enemy.pos.y - wall.pos.y) < (enemy.size + wall.height) / 2;

      if (xOverlap && yOverlap) {
        // Enemy also bounces on Y-axis
        enemy.vel.y *= -0.6;

        // Move enemy away from wall
        if (enemy.pos.y < wall.pos.y) {
          enemy.pos.y = wall.pos.y - (wall.height + enemy.size) / 2 - 1;
        } else {
          enemy.pos.y = wall.pos.y + (wall.height + enemy.size) / 2 + 1;
        }
      }
    });

    // Draw enemy (change color based on bubble state)
    if (enemy.inBubble) {
      color("yellow");
    } else {
      color("red"); // normal enemies are red
    }
    box(enemy.pos, enemy.size);

    // Collision detection between player and enemy
    let distanceToPlayer = player.pos.distanceTo(enemy.pos);
    if (distanceToPlayer < (player.size + enemy.size) / 2 + 2) {
      // Launch player based on enemy's Y-axis velocity
      let impulse = enemy.vel.y * 1.5;
      player.vel.y += impulse;

      // Effect
      play("hit", { pitch: 99 });
      particle(enemy.pos, { count: 25, speed: 2 });
      addScore(100, enemy.pos);

      return true;
    }

    // Remove enemies that fell below screen
    return enemy.pos.y > 110;
  });

  // === Wall Processing and Drawing ===
  remove(walls, (wall) => {
    // Draw wall
    color("green");
    box(wall.pos, wall.width, wall.height);

    // X-axis overlap check (is player within wall width)
    let playerLeft = player.pos.x - player.size / 2;
    let playerRight = player.pos.x + player.size / 2;
    let wallLeft = wall.pos.x - wall.width / 2;
    let wallRight = wall.pos.x + wall.width / 2;

    let xOverlap = playerRight > wallLeft && playerLeft < wallRight;
    let yOverlap =
      Math.abs(player.pos.y - wall.pos.y) < (player.size + wall.height) / 2;

    if (xOverlap && yOverlap) {
      // Bounce on Y-axis
      player.vel.y *= -0.8; // reversal and damping
      play("hit");
      particle(wall.pos, {
        count: 5,
        speed: 1.5,
        angle: 0,
        angleWidth: PI * 2,
      });

      // Move player away from wall
      if (player.pos.y < wall.pos.y) {
        player.pos.y = wall.pos.y - (wall.height + player.size) / 2 - 1;
      } else {
        player.pos.y = wall.pos.y + (wall.height + player.size) / 2 + 1;
      }
    }

    // Remove walls that fell below screen
    return wall.pos.y > 110;
  });

  // === Player Drawing ===
  color(playerInBubble ? "cyan" : "blue");
  box(player.pos, player.size);

  // === Score Update ===
  // +1 score per +1 altitude (only add increments)
  let currentHeightScore = floor(currentHeight);
  if (currentHeightScore > lastHeightScore) {
    addScore(currentHeightScore - lastHeightScore);
    lastHeightScore = currentHeightScore;
  }

  // Game over only when completely fallen below screen
  if (player.pos.y > 105) {
    play("explosion");
    end();
  }
}
