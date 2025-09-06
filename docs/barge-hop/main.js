title = "Barge Hop";

description = `
[Tap]  Jump
[Hold] Reduce gravity
`;

options = {
  viewSize: { x: 150, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 1,
  bgmVolume: 5,
  audioTempo: 125,
};

audioFiles = {
  bgm: "./barge-hop/Turbo_Hop.mp3",
};

/**
Game overview (Barge hop / side view)
- Three barges move horizontally. They bounce on docks and each other.
- Barges bob up and down slightly.
- Player starts on the left dock. Tap to jump forward, hold to reduce gravity.
- Reaching the right dock clears the round. The shorter time, the higher the score.
*/

// Constants
const worldW = 150;
const worldH = 100;
const waterY = 78;
const waterTopY = waterY - 7; // Visual water surface (top edge of water rect)
const dockW = 14;
const dockH = 12;
const bargeH = 8;
const bargeClearance = 5; // Clearance above the water surface (raised)
const playerW = 6;
const playerH = 8;
const gravity = 0.15;
const jumpVy = -2.1;
const jumpVx = 0.7;

// Round timer (frames) and max time bonus
const timeLimit = 1000;
const maxTimeBonus = 120;

// State
let leftDock, rightDock;
let barges;
let player;
let roundLevel; // Round index (start from 0)
// Animation (squash & stretch for jump/land)
let jumpAnimT = 0;
let landAnimT = 0;
let remain = 0;
const JUMP_DUR = 16; // Slightly longer stretch time
const LAND_DUR = 12; // Slightly longer squash time
const JUMP_STRETCH = { sx: 0.8, sy: 1.35 }; // Stronger vertical stretch and thinner width
const LAND_SQUASH = { sx: 1.35, sy: 0.8 }; // Stronger horizontal squash on landing

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function initRound() {
  const dockRaise = 3; // raise docks to avoid visual clipping with water
  leftDock = {
    x: dockW / 2 + 1,
    y: waterY - dockH / 2 - dockRaise,
    w: dockW,
    h: dockH,
  };
  rightDock = {
    x: worldW - (dockW / 2 + 1),
    y: waterY - dockH / 2 - dockRaise,
    w: dockW,
    h: dockH,
  };

  const n = 3; // fixed to 3 barges
  barges = [];

  const baseY = waterY - bargeH / 2;
  // Speed scales by round (start at about half)
  const roundDifficulty = 1 + sqrt((roundLevel ?? 0) * 0.3);
  const speedScale = 0.5 * roundDifficulty;
  const speedBase = 0.35 * speedScale;
  const widthMin = 20;
  const widthMax = 30;

  for (let i = 0; i < n; i++) {
    const w = clamp(rndi(widthMin, widthMax), 12, 28);
    const dir = rnd() < 0.5 ? -1 : 1;
    const sp = speedBase * rnd(0.9, 1.5) * dir;
    // Place initial x avoiding overlaps
    let x;
    let tries = 0;
    do {
      x = rnd(
        leftDock.x + leftDock.w / 2 + w / 2 + 2,
        rightDock.x - rightDock.w / 2 - w / 2 - 2
      );
      tries++;
      if (tries > 50) break;
    } while (barges.some((b) => abs(b.x - x) < (b.w + w) * 0.55));
    barges.push({
      x,
      y: baseY,
      w,
      h: bargeH,
      vx: sp,
      amp: rnd(1, 2),
      freq: rnd(0.02, 0.05) * roundDifficulty,
      phase: rnd(0, PI * 2),
    });
  }

  player = {
    x: leftDock.x, // Place at left dock center
    y: leftDock.y - leftDock.h / 2 - playerH / 2,
    vx: 0,
    vy: 0,
    onGround: true,
    onBargeIndex: -1,
  };
  remain = clamp(remain + timeLimit / 2, 0, timeLimit);
}

function nextRound() {
  roundLevel = (roundLevel ?? 0) + 1;
  initRound();
}

function update() {
  if (!ticks) {
    roundLevel = 0;
    remain = timeLimit;
    initRound();
  }

  // Round time management
  const roundDifficulty = 1 + (roundLevel ?? 0) / 5;
  remain -= sqrt(roundDifficulty);
  const remainRatio = remain / timeLimit;
  if (remain <= 0) {
    end();
  }

  // Background and water
  color("light_blue");
  box(worldW / 2, waterY + 11, worldW, 44);

  // Time bar (left-bottom to right)
  const barH = 4;
  const barPad = 3;
  const barWMax = worldW - barPad * 2;
  const barX = barPad + barWMax * 0.5;
  const barY = worldH - barPad - barH * 0.5;
  color("light_black");
  box(barX, barY, barWMax, barH);
  // Blink red/yellow when low
  const barW = barWMax * remainRatio;
  const barCX = barPad + barW * 0.5;
  const warningThreshold = 0.25; // Blink when 25% or less
  const blinkPeriod = 8; // Frames per blink half-cycle
  const isWarning = remainRatio <= warningThreshold;
  const fillColor =
    isWarning && floor(ticks / blinkPeriod) % 2 === 0 ? "red" : "yellow";
  color(fillColor);
  if (barW > 0) {
    box(barCX, barY, barW, barH - 1);
  }

  // Draw docks
  color("black");
  box(leftDock.x, leftDock.y, leftDock.w, leftDock.h);
  box(rightDock.x, rightDock.y, rightDock.w, rightDock.h);

  // Update/draw barges
  color("green");
  for (let i = 0; i < barges.length; i++) {
    const b = barges[i];
    // Update horizontal position
    b.x += b.vx;
    // Vertical bobbing (keep bottom above water with clearance)
    b.y =
      waterY -
      bargeH / 2 -
      b.amp -
      bargeClearance +
      sin(ticks * b.freq + b.phase) * b.amp;
    // Bounce on docks and clamp inside edges
    const leftEdge = leftDock.x + leftDock.w / 2;
    const rightEdge = rightDock.x - rightDock.w / 2;
    if (b.x - b.w / 2 <= leftEdge) {
      b.x = leftEdge + b.w / 2;
      b.vx = abs(b.vx);
    }
    if (b.x + b.w / 2 >= rightEdge) {
      b.x = rightEdge - b.w / 2;
      b.vx = -abs(b.vx);
    }
  }
  // Barge-barge collisions (bounce and minimum separation)
  for (let i = 0; i < barges.length; i++) {
    for (let j = i + 1; j < barges.length; j++) {
      const a = barges[i];
      const b = barges[j];
      if (abs(a.y - b.y) < (a.h + b.h) * 0.5) {
        const dx = b.x - a.x;
        const overlap = a.w * 0.5 + b.w * 0.5 - abs(dx);
        if (overlap > 0) {
          const push = overlap / 2 + 0.01;
          if (dx > 0) {
            a.x -= push;
            b.x += push;
          } else {
            a.x += push;
            b.x -= push;
          }
          const sA = a.vx >= 0 ? 1 : -1;
          const sB = b.vx >= 0 ? 1 : -1;
          if (sA === sB) {
            // Same-direction rear-end: only the trailing barge flips
            const movingRight = sA > 0;
            let trailing;
            if (movingRight) {
              trailing = a.x < b.x ? a : b; // When moving right, smaller x is behind
            } else {
              trailing = a.x > b.x ? a : b; // When moving left, larger x is behind
            }
            trailing.vx = -trailing.vx;
          } else {
            // Head-on collision: both flip
            a.vx = -a.vx;
            b.vx = -b.vx;
          }
          play("hit");
        }
      }
    }
  }

  // Draw barges (for collision sampling)
  const bargeTops = [];
  for (let i = 0; i < barges.length; i++) {
    const b = barges[i];
    box(b.x, b.y, b.w, b.h);
    bargeTops[i] = b.y - b.h / 2;
  }

  // Update animation state and compute scales
  if (jumpAnimT > 0) jumpAnimT--;
  if (landAnimT > 0) landAnimT--;
  const wj = jumpAnimT / JUMP_DUR;
  const wl = landAnimT / LAND_DUR;
  const scaleX = lerp(1, JUMP_STRETCH.sx, wj) * lerp(1, LAND_SQUASH.sx, wl);
  const scaleY = lerp(1, JUMP_STRETCH.sy, wj) * lerp(1, LAND_SQUASH.sy, wl);
  const drawW = playerW * scaleX;
  const drawH = playerH * scaleY;

  // Update player
  if (player.onGround) {
    player.vx = 0;
    player.vy = 0;
    // If on a barge, follow its x and bobbing y
    if (player.onBargeIndex >= 0) {
      const bi = player.onBargeIndex;
      player.x += barges[bi].vx;
      // Follow barge's vertical bobbing with Y as well
      player.y = bargeTops[bi] - playerH / 2;
    }
  } else {
    // In air
    const gMul = input.isPressed ? 0.5 : 1.5;
    player.vy += gravity * gMul * roundDifficulty;
    player.x += player.vx;
    player.y += player.vy;
  }

  // Input: Jump (ground or coyote time)
  if (input.isJustPressed) {
    if (player.onGround) {
      player.onGround = false;
      player.onBargeIndex = -1;
      player.vx = jumpVx * sqrt(roundDifficulty);
      player.vy = jumpVy * sqrt(roundDifficulty);
      play("jump");
      jumpAnimT = JUMP_DUR;
    }
  }

  // Foot collision (landing)
  // Use a small box near the feet (aligned to scaled height)
  color("yellow");
  const footBottom = player.y + drawH * 0.5;
  const footBoxY = footBottom - 1;
  // Draw player body (visible)
  box(player.x, player.y, drawW, drawH);
  box(player.x, footBoxY, playerW * 0.6, 5);
  color("transparent");
  const pc = box(player.x, footBoxY - 48, drawW, 100);

  if (!player.onGround) {
    const inRightDockX =
      player.x >= rightDock.x - rightDock.w * 0.6 &&
      player.x <= rightDock.x + rightDock.w * 0.6;
    const landedOnRightDock =
      pc.isColliding.rect.black && player.vy >= 0 && inRightDockX;
    let landedOnBarge = false;
    let landedIndex = -1;
    if (pc.isColliding.rect.green && player.vy >= 0) {
      // Identify which barge we collided with
      for (let i = barges.length - 1; i >= 0; i--) {
        const b = barges[i];
        if (abs(player.x - b.x) <= playerW * 0.6 + b.w * 0.6) {
          landedOnBarge = true;
          landedIndex = i;
          break;
        }
      }
    }

    if (landedOnRightDock) {
      // Clear (land on right dock)
      const bonus = floor(maxTimeBonus * remainRatio);
      addScore(bonus, player.x, player.y - 6);
      play("coin");
      // Next round
      nextRound();
      return;
    } else if (landedOnBarge) {
      const top = bargeTops[landedIndex];
      player.onGround = true;
      player.onBargeIndex = landedIndex;
      player.y = top - playerH / 2;
      player.vx = 0;
      player.vy = 0;
      addScore(1, player.x, player.y - 6);
      play("hit");
      landAnimT = LAND_DUR;
    }
  }

  // Splash check (trigger the instant the visual water surface is touched)
  if (!player.onGround && player.vy >= 0 && footBottom >= waterTopY) {
    color("cyan");
    particle(player.x, waterTopY, {
      count: 20,
      speed: 2.0,
      angle: -PI / 2,
      angleWidth: PI / 1.3,
      edgeColor: "white",
    });
    color("light_blue");
    particle(player.x, waterTopY, {
      count: 14,
      speed: 1.2,
      angle: -PI / 2,
      angleWidth: PI,
      edgeColor: "light_cyan",
    });
    color("light_cyan");
    // Horizontal side splashes (left/right)
    particle(player.x, waterTopY - 1, {
      count: 8,
      speed: 1.4,
      angle: 0,
      angleWidth: PI / 6,
    });
    particle(player.x, waterTopY - 1, {
      count: 8,
      speed: 1.4,
      angle: PI,
      angleWidth: PI / 6,
    });
    play("explosion");
    player.onGround = true;
    player.onBargeIndex = -1;
    player.x = leftDock.x;
    player.y = leftDock.y - leftDock.h / 2 - playerH / 2;
    player.vx = 0;
    player.vy = 0;
    landAnimT = LAND_DUR;
  }
}
