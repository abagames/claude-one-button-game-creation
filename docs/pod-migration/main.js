title = "Pod Migration";
description = `[Tap] Change direction`;

characters = [
  // Lead whale (larger, whale-like, facing right)
  `
  lll
l lccl
llclcl
lcllll
 lwwwl
  lll
`,
  // Pod whale (smaller, whale-like, facing right)
  `
  ll
 lppl
llpll
 lll
`,
];

options = {
  theme: "shape",
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  isDrawingParticleFront: true,
  textEdgeColor: { title: "light_cyan" },
  audioSeed: 4,
  bgmVolume: 2,
};

audioFiles = {
  bgm: "./pod-migration/Pixelated_Blizzard.mp3",
};

let leadWhale;
let podWhales;
let iceFloes;
let direction;
let speed;
let respawnTimer;
let multiplier;

function update() {
  if (!ticks) {
    sss.setQuantize(0);
    leadWhale = {
      pos: vec(20, 50),
      knockbackVel: vec(0, 0),
      knockbackFrames: 0,
    };
    podWhales = [
      { pos: vec(10, 45), isDestroyed: false },
      { pos: vec(10, 55), isDestroyed: false },
      { pos: vec(5, 50), isDestroyed: false },
    ];
    iceFloes = [];
    direction = 0;
    speed = 1;
    respawnTimer = 0;
    multiplier = 1;
  }

  // Adjust game parameters based on difficulty
  let currentSpeed = speed + (difficulty - 1) * 0.3;
  let baseIceSpawnRate = 0.01 + (difficulty - 1) * 0.005;

  // Adjust spawn rate based on current ice count
  let targetIceCount = 3 + Math.floor(difficulty / 2); // 3-4 ice floes minimum
  let iceCountMultiplier = 1;

  if (iceFloes.length < targetIceCount) {
    iceCountMultiplier = 3; // 3x more frequent when below target
  } else if (iceFloes.length < targetIceCount + 2) {
    iceCountMultiplier = 2; // 2x more frequent when slightly below
  }

  let iceSpawnRate = baseIceSpawnRate * iceCountMultiplier;

  // Update multiplier (decay each frame)
  multiplier *= 0.998;
  multiplier = Math.max(multiplier, 1);

  // Add subtle wave pattern to background
  color("light_blue");
  for (let y = 0; y < 100; y += 12) {
    for (let x = 0; x < 100; x += 15) {
      let waveHeight = sin(ticks * 0.01 + x * 0.1 + y * 0.05) * 0.8;
      rect(x, y + waveHeight, 9, 2);
    }
  }

  // Handle pod whale respawn
  respawnTimer++;
  let respawnInterval = 300; // 5 seconds at 60fps

  if (respawnTimer >= respawnInterval) {
    // Find first destroyed pod whale to respawn
    let destroyedWhale = podWhales.find((whale) => whale.isDestroyed);
    if (destroyedWhale) {
      destroyedWhale.isDestroyed = false;
      particle(destroyedWhale.pos, 6, 1);
      play("coin");
      respawnTimer = 0;
    }
  }

  // Handle direction change
  if (input.isJustPressed) {
    direction = (direction + 1) % 4;
  }

  // Calculate movement velocity using current speed
  let vel = vec(0, 0);
  if (direction === 0) vel.x = currentSpeed;
  else if (direction === 1) vel.y = currentSpeed;
  else if (direction === 2) vel.x = -currentSpeed;
  else if (direction === 3) vel.y = -currentSpeed;

  // Check for collision before moving
  let nextPos = vec(leadWhale.pos).add(vel);
  let canMove = true;

  // Update pod whales (follow leader) - all whales move regardless of destruction status
  podWhales.forEach((whale, i) => {
    let target = i === 0 ? leadWhale.pos : podWhales[i - 1].pos;
    let offset = vec(target).sub(whale.pos);
    offset.mul(0.05);
    whale.pos.add(offset);
  });

  // Draw lead whale with direction
  color("black");
  let leadMirror = {};
  if (direction >= 2) {
    // facing left
    leadMirror.x = -1;
  }
  char("a", leadWhale.pos, { mirror: leadMirror });
  color("light_blue");
  particle(leadWhale.pos, {
    angle: vel.angle + PI,
    angleWidth: 0.2,
    count: 1,
    speed: 1,
  });

  // Check pod whale collision with lead whale and draw pod whales
  color("black");
  podWhales.forEach((whale, i) => {
    // Calculate pod whale facing direction (follow the whale in front)
    let target = i === 0 ? leadWhale.pos : podWhales[i - 1].pos;
    let podMirror = {};
    if (whale.pos.x > target.x) {
      // facing left (toward target)
      podMirror.x = -1;
    }

    if (!whale.isDestroyed) {
      // Check collision with lead whale
      if (char("b", whale.pos, { mirror: podMirror }).isColliding.char.a) {
        whale.isDestroyed = true;
        particle(whale.pos, 4, 2);
        play("explosion");
        respawnTimer = 0;
      }
    } else {
      // Draw invisible pod whales for collision detection only
      color("transparent");
      char("b", whale.pos, { mirror: podMirror });
      color("black");
    }
  });

  // Spawn ice floes with difficulty-based frequency
  if (rnd() < iceSpawnRate) {
    let newIcePos = vec(rnd(10, 90), rnd(10, 90));
    let safeDistance = 20;
    let isSafe = true;

    // Check distance from pod whales
    podWhales.forEach((whale) => {
      if (newIcePos.distanceTo(whale.pos) < safeDistance) {
        isSafe = false;
      }
    });

    // Only spawn if position is safe
    if (isSafe) {
      play("click");
      iceFloes.push({
        pos: newIcePos,
        size: vec(rnd(9, 16), rnd(6, 10)), // Horizontal iceberg (wider than tall)
        jaggedness: rnd(0.3, 0.8), // Random jaggedness factor
        spawnTime: ticks, // Track when this iceberg was spawned
        emergeDuration: 150,
        lifespan: rnd(500, 600), // Random lifespan
        sinkDuration: 120,
      });
    }
  }

  // Draw ice floes and check collision with pod whales
  remove(iceFloes, (ice) => {
    let iceDestroyed = false;

    // Calculate emergence progress (0 = just spawned, 1 = fully emerged)
    let ageFrames = ticks - ice.spawnTime;
    let emergeProgress = Math.min(ageFrames / ice.emergeDuration, 1);

    // Check if iceberg should start sinking
    let sinkStartTime = ice.lifespan - ice.sinkDuration;
    let heightMultiplier = 1;
    let isFullyEmerged = emergeProgress >= 1;
    let isSinking = ageFrames >= sinkStartTime;

    if (ageFrames >= ice.lifespan) {
      // Iceberg has completed its life cycle
      return true; // Remove from array
    } else if (isSinking) {
      // Iceberg is sinking
      let sinkProgress = (ageFrames - sinkStartTime) / ice.sinkDuration;
      let sinkEase = Math.pow(sinkProgress, 2); // Quadratic easing in (accelerating sink)
      heightMultiplier = 1 - sinkEase;
    }

    // Smooth emergence using easing function
    let emergeEase = 1 - Math.pow(1 - emergeProgress, 3); // Cubic easing out

    // Calculate how much of the iceberg is visible (emerges from bottom, sinks from top)
    let finalHeightMultiplier = emergeEase * heightMultiplier;
    let visibleHeight = ice.size.y * finalHeightMultiplier;
    let emergeOffset = ice.size.y - visibleHeight;

    // Draw iceberg with jagged edges (multiple rectangles for irregular shape)
    let jaggedParts = Math.floor(ice.size.x / 4); // Number of jagged sections

    // Shadow/water wave layer (gentle wave motion)
    color("light_blue");
    for (let i = 0; i < jaggedParts; i++) {
      let partWidth = ice.size.x / jaggedParts;
      // Create gentle wave motion using sine wave
      let waveOffset = sin(ticks * 0.02 + i * 0.5) * 1.5; // Gentle wave
      let partHeight = ice.size.y * 0.7 * finalHeightMultiplier; // Apply emergence and sinking to wave layer
      if (partHeight > 0) {
        rect(
          ice.pos.x - ice.size.x / 2 + i * partWidth - 1,
          ice.pos.y + emergeOffset - partHeight / 2 + 2 + waveOffset, // Emerge from bottom
          partWidth + 2,
          partHeight
        );
      }
    }

    // Main body (jagged, static)
    color("cyan");
    let collision = { isColliding: { char: { a: false, b: false } } };
    for (let i = 0; i < jaggedParts; i++) {
      let partWidth = ice.size.x / jaggedParts;
      // Use ice position as seed for consistent jaggedness
      let heightVariation = ice.jaggedness * (sin(ice.pos.x * 0.1 + i) * 2);
      let fullPartHeight = ice.size.y + heightVariation;
      let partHeight = fullPartHeight * finalHeightMultiplier; // Apply emergence and sinking

      if (partHeight > 0) {
        let partCollision = rect(
          ice.pos.x - ice.size.x / 2 + i * partWidth - 1,
          ice.pos.y + emergeOffset - partHeight / 2, // Emerge from bottom
          partWidth + 2,
          partHeight
        );
        // Check collision for each part
        if (partCollision.isColliding.char.a) {
          collision.isColliding.char.a = true;
        }
        if (partCollision.isColliding.char.b) {
          collision.isColliding.char.b = true;
        }
      }
    }

    // Highlight layer (top, jagged, static)
    color("light_cyan");
    for (let i = 0; i < jaggedParts; i++) {
      let partWidth = (ice.size.x / jaggedParts) * 0.8;
      // Use ice position as seed for consistent highlight
      let heightVariation = ice.jaggedness * (sin(ice.pos.x * 0.1 + i) * 1);
      let fullPartHeight = ice.size.y * 0.6 + heightVariation;
      let partHeight = fullPartHeight * finalHeightMultiplier; // Apply emergence and sinking

      if (partHeight > 0) {
        rect(
          ice.pos.x - ice.size.x / 2 + i * (ice.size.x / jaggedParts) - 1,
          ice.pos.y + emergeOffset - partHeight / 2 - 1, // Emerge from bottom
          partWidth,
          partHeight
        );
      }
    }

    // Check collision with pod whales (characters must be drawn first)
    if (collision.isColliding.char.b) {
      // Pod whale destroys ice
      particle(ice.pos, 5, 2, 0, PI);
      let points = round(multiplier);
      addScore(points, ice.pos);
      multiplier += 1;
      play("powerUp");
      iceDestroyed = true;
    }

    // Check if lead whale next position would collide (only if ice not destroyed and fully emerged)
    if (!iceDestroyed && isFullyEmerged && !isSinking) {
      // Check collision with main ice body
      if (collision.isColliding.char.a) {
        canMove = false;
      }
    }

    return iceDestroyed;
  });

  // Handle knockback
  if (leadWhale.knockbackFrames > 0) {
    leadWhale.pos.add(leadWhale.knockbackVel);
    leadWhale.knockbackVel.mul(0.88); // Decay knockback
    leadWhale.knockbackFrames--;
  }

  // Move lead whale (can move during knockback too)
  if (canMove) {
    leadWhale.pos.add(vel);
  } else {
    // Collision detected - apply knockback
    leadWhale.knockbackVel = vec(vel).mul(-1.8); // Reverse direction with 1.8x force
    leadWhale.knockbackFrames = 25; // 25 frames of knockback
    play("hit");
  }

  // Check if all pod whales are destroyed
  let allPodWhalesDestroyed = podWhales.every((whale) => whale.isDestroyed);
  if (allPodWhalesDestroyed) {
    play("explosion");
    end();
  }

  // Keep whales in bounds
  leadWhale.pos.clamp(3, 97, 3, 97);

  // Display multiplier
  color("black");
  text(`x${round(multiplier)}`, 3, 9, { isSmallText: true });
}
