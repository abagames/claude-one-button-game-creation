// Chalkboard — One-button chalk writing
// Behavior: Auto-move → turn 90° clockwise at intervals. Hold = write, release = move without writing.
// Energy increases while writing, slowly decays while released. Huge penalty when overwriting your own white stroke. Game over at 0 energy.

title = "Chalkboard";

description = `
[Hold]    Write
[Release] Save
Overwriting costs a lot
`;

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  bgmVolume: 5,
  audioSeed: 5,
};

audioFiles = {
  bgm: "./chalkboard/Pixel_Power_Surge.mp3",
};

// World state
let pos; // current position
let dirIndex; // 0:right, 1:down, 2:left, 3:up
let speed;
let turnTicks;
let nextTurnTicks;

// Camera (world → screen offset)
let cam;

// Chalk energy
let energy;
const maxEnergy = 100;
const writeGain = 0.1; // gain/frame while writing
const idleDecay = 0.1; // decay/frame while released
const overlapPenalty = 10; // immediate loss per frame when overwriting

// Score: increases roughly with written distance
let lastScoreTick;
let scoreCarry = 0; // accumulate fractional score proportional to energy gain

// Stroke data (history)
const segs = []; // {p1:Vector, p2:Vector, age:number}
let lastWritePos; // last committed drawing point
const chalkThickness = 3; // stroke thickness
const segmentSpacing = 2; // add a new segment every N px moved
// Fresh segment protection frames (draw as light_black; ignore as white)
const freshFrames = 4;
let blinkWasOn = false;
// Durational ramps for energy changes
let holdFrames = 0; // consecutive frames holding
let releaseFrames = 0; // consecutive frames released
// Nib screen position
let nibScreen;

function getTurnInterval() {
  return rndi(30, 150) / sqrt(difficulty);
}

function initGame() {
  pos = vec(0, 0);
  dirIndex = 0;
  speed = 0.9;
  turnTicks = 0;
  nextTurnTicks = 120;
  cam = vec();
  energy = 60;
  lastScoreTick = 0;
  segs.length = 0;
  lastWritePos = vec(pos);
  // Initial vertical segments at screen x=120 from y=10..90 (length 10 each)
  // Convert screen -> world by subtracting (50,50) because cam = pos - (50,50)
  for (let sy = 10; sy < 90; sy += 10) {
    segs.push({
      p1: vec(120 - 50, sy - 50),
      p2: vec(120 - 50, sy + 10 - 50),
      age: 0,
    });
  }
  scoreCarry = 0;
  holdFrames = 0;
  releaseFrames = 0;
}

function stepMovement() {
  // Turning timer
  turnTicks++;
  if (turnTicks >= nextTurnTicks) {
    turnTicks = 0;
    nextTurnTicks = getTurnInterval();
    dirIndex = (dirIndex + 1) % 4;
    play("laser");
  }
  // Move forward
  speed = 0.9 * sqrt(difficulty);
  switch (dirIndex) {
    case 0:
      pos.x += speed;
      break;
    case 1:
      pos.y += speed;
      break;
    case 2:
      pos.x -= speed;
      break;
    case 3:
      pos.y -= speed;
      break;
  }
  // Camera follows to keep chalk centered
  cam.set(pos).sub(50, 50);
}

function drawBackground() {
  color("green");
  rect(0, 0, 100, 100);
}

function drawSegments() {
  // Draw only near the screen for performance
  const minX = -20,
    minY = -20,
    maxX = 120,
    maxY = 120;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    const center = vec((s.p1.x + s.p2.x) / 2, (s.p1.y + s.p2.y) / 2).sub(cam);
    if (
      center.x < minX ||
      center.x > maxX ||
      center.y < minY ||
      center.y > maxY
    )
      continue;
    const len = s.p1.distanceTo(s.p2);
    const ang = s.p1.angleTo(s.p2);
    // Check collision with nib (red) first without drawing
    color("transparent");
    // Fresh segments: draw in light_black (not target for white collisions)
    color(s.age < freshFrames ? "light_black" : "white");
    bar(center, len, chalkThickness, ang);
    // Age the segment
    s.age++;
  }
}

// (Segment deletion on release was removed by request)

function pruneSegments() {
  // Remove segments completely outside the screen with a 10px margin
  const minX = -100,
    minY = -100,
    maxX = 200,
    maxY = 200;
  remove(segs, (s) => {
    const p1 = vec(s.p1).sub(cam);
    const p2 = vec(s.p2).sub(cam);
    const segMinX = Math.min(p1.x, p2.x);
    const segMaxX = Math.max(p1.x, p2.x);
    const segMinY = Math.min(p1.y, p2.y);
    const segMaxY = Math.max(p1.y, p2.y);
    return segMaxX < minX || segMinX > maxX || segMaxY < minY || segMinY > maxY;
  });
  // Cap the total number of segments to 1000 (drop oldest)
  if (segs.length > 1000) {
    segs.splice(0, segs.length - 1000);
  }
}

function maybeAddSegment() {
  // Add a segment when sufficiently far from lastWritePos
  const d = lastWritePos.distanceTo(pos);
  if (d >= segmentSpacing) {
    segs.push({ p1: vec(lastWritePos), p2: vec(pos), age: 0 });
    lastWritePos.set(pos);
  }
}

function drawHud() {
  // Energy bar (near bottom edge)
  const w = clamp((energy / maxEnergy) * 92, 0, 92);
  const y = 91; // 4px margin from bottom (100 - 5 - 4)
  color("black");
  rect(4, y, 92, 5);
  color("yellow");
  rect(4, y, w, 5);
}

function doWritingAndEnergy() {
  // Compute nib screen position and check overlap with existing white strokes
  nibScreen = vec(pos).sub(cam);
  color("transparent");
  const cWhite = box(nibScreen, chalkThickness, chalkThickness);
  // Update consecutive press/release counters
  if (input.isPressed) {
    holdFrames++;
    releaseFrames = 0;
  } else {
    releaseFrames++;
    holdFrames = 0;
  }
  // Ramps: start tiny and grow smoothly to 1.0
  const rampHold = clamp(pow(holdFrames / 120, 1.5), 0, 1);
  const rampRelease = clamp(pow(releaseFrames / 120, 1.5), 0, 1);

  if (input.isPressed) {
    // On just-pressed, reset write origin to avoid bridging
    if (input.isJustPressed) {
      lastWritePos.set(pos);
    }
    // Overwrite damage if nib overlaps any white stroke
    if (cWhite.isColliding.rect?.white) {
      energy -= overlapPenalty;
      play("hit");
      particle(nibScreen, 6, 1, 0, PI * 2);
    } else {
      // Ramp up to 3x the baseline while holding; add proportional score
      const rawGain = writeGain * (3 * rampHold) * sqrt(difficulty);
      const applied = clamp(rawGain, 0, maxEnergy - energy);
      energy += applied;
      // Score reflects attempted gain even at full energy
      scoreCarry += rawGain;
      while (scoreCarry >= 1) {
        addScore(1, vec(pos).sub(cam));
        scoreCarry -= 1;
      }
    }
    energy = clamp(energy, 0, maxEnergy);
    // Commit a segment and draw immediate visual feedback
    maybeAddSegment();
  } else {
    // Energy decays while released (scaled by duration, up to 3x)
    energy -= idleDecay * (3 * rampRelease) * sqrt(difficulty);
  }

  // Draw the visible red nib after collision checks
  color("red");
  box(nibScreen, chalkThickness, chalkThickness);

  // Visual indicator: light_black rect pointing forward
  const arm = 8;
  const gap = input.isPressed ? 0 : 3; // little gap when released
  const s = chalkThickness; // thickness
  color("light_red");
  switch (dirIndex) {
    case 0: // right
      rect(nibScreen.x + s / 2 + gap, nibScreen.y - s / 2, arm, s);
      break;
    case 1: // down
      rect(nibScreen.x - s / 2, nibScreen.y + s / 2 + gap, s, arm);
      break;
    case 2: // left
      rect(nibScreen.x - s / 2 - arm - gap, nibScreen.y - s / 2, arm, s);
      break;
    case 3: // up
      rect(nibScreen.x - s / 2, nibScreen.y - s / 2 - arm - gap, s, arm);
      break;
  }

  // Blinking red indicator: shows next turning direction shortly before turning
  const warnFrames = 30; // start ~0.5s before (30f)
  const blinkPeriod = 8; // blink: 4f on, 4f off
  const remaining = nextTurnTicks - turnTicks;
  if (remaining <= warnFrames) {
    const blinkOn = ticks % blinkPeriod < blinkPeriod / 2;
    if (blinkOn && !blinkWasOn) {
      play("jump", { pitch: 50, volume: 0.5 });
    }
    blinkWasOn = blinkOn;
    if (blinkOn) {
      // Use bar (center-aligned) to simplify: center = nib + (gap + len/2) along next direction
      const nextDir = (dirIndex + 1) % 4; // clockwise
      const angles = [0, PI / 2, PI, -PI / 2];
      const angle = angles[nextDir];
      const warnArm = arm + 2;
      const warnGap = gap + 1;
      const center = vec(nibScreen).addWithAngle(
        angle,
        warnGap + warnArm * 0.5
      );
      color("red");
      bar(center, warnArm, s, angle);
    }
  } else {
    // Reset tracker when outside warning window
    blinkWasOn = false;
  }

  if (energy <= 0) {
    end();
    play("explosion");
  }
}

function update() {
  if (!ticks) {
    initGame();
  }
  stepMovement();
  drawBackground();
  pruneSegments();
  drawSegments();
  doWritingAndEnergy();
  drawHud();
}
