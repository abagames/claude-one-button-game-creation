# Game rules

1. Game Environment:

   - A timber log appears on the screen.
   - A saw moves horizontally across the screen.

2. Core Mechanics:

   - The player must cut the timber log into equal pieces.
   - The saw moves automatically from left to right.

3. Player Interaction:

   - The player taps to cut the log at the current saw position.

4. Challenge:
   - Cut the log into the required number of pieces as evenly as possible.
   - Avoid creating pieces that are too different in size.

# Game objects

## Timber

- Properties:
  - x: X-coordinate of the left edge of the timber (number)
  - width: Width of the timber (number)
- Initial state:
  - Random x position
  - Random width between 40 and 80
- Shape: Rectangle
- Color: red
- Behavior: Static

## Saw

- Properties:
  - x: X-coordinate of the saw (number)
  - vx: Horizontal velocity of the saw (number)
- Initial state:
  - x: -30
  - vx: Calculated based on difficulty and number of required cuts
- Shape: Rectangle
- Color: black
- Behavior:
  - Moves horizontally from left to right
- One-button controls:
  - When tapped: Cuts the timber at the current position

## Pieces

- Properties:
  - size: Vector (width, height)
  - pos: Vector (current x, y position)
  - targetPos: Vector (target x, y position)
- Initial state: Empty array
- Shape: Rectangle
- Color: red
- Behavior:
  - Move from initial position to target position
- Spawning rules:
  - Created when the timber is cut or when the saw reaches the end of the timber

# Skeleton code

```javascript
let timber;
let cutCount;
let cutIndex;
let pieces;
let saw;
let scoreCountTicks;
let scoreCountIndex;
let turnScore;
let turnIndex;
let isShowingIndicator;

function update() {
  if (!ticks) {
    // Initialize game state
  }

  // Draw timber

  // Update saw position and draw saw

  // Handle input and cut timber

  // Move and draw cut pieces

  // Update and display score

  // Check for game over or next turn

  // Draw cut indicators
}

function nextTimber() {
  // Set up next timber and game turn
}
```

# Source code

```javascript
title = "TIMBER TEST";

description = `
[Tap] Cut a log
`;

characters = [];

options = {
  isPlayingBgm: true,
  audioSeed: 18,
};

let timber;
let cutCount;
let cutIndex;
let pieces;
let saw;
let scoreCountTicks;
let scoreCountIndex;
let turnScore;
let turnIndex;
let isShowingIndicator;

function update() {
  if (!ticks) {
    turnIndex = 0;
    nextTimber();
  }
  color("red");
  rect(timber.x, 20, timber.width, 10);
  saw.x += saw.vx;
  color("black");
  rect(saw.x - 1, 10, 3, input.isJustPressed ? 30 : 7);
  text(`1/${cutCount}`, 5, 35);
  if (scoreCountTicks === 0 && saw.x >= timber.x + timber.width) {
    const size = vec(timber.width, 10);
    pieces.push({
      size,
      pos: vec(timber.x + size.x / 2, 20 + 10 / 2),
      targetPos: vec(50, 40 + cutIndex * 15),
    });
    timber.width = 0;
    cutIndex++;
    scoreCountTicks = 1;
  }
  if (scoreCountTicks === 0 && input.isJustPressed) {
    isShowingIndicator = false;
    const cw = saw.x - timber.x;
    if (cw > 0) {
      play("select");
      const size = vec(cw, 10);
      pieces.push({
        size,
        pos: vec(timber.x + size.x / 2, 20 + 10 / 2),
        targetPos: vec(50, 40 + cutIndex * 15),
      });
      timber.x = saw.x;
      timber.width -= cw;
      cutIndex++;
    }
  }
  pieces.forEach((p) => {
    if (p.pos.distanceTo(p.targetPos) < 1) {
      p.pos = p.targetPos;
    } else {
      p.pos.add(vec(p.targetPos).sub(p.pos).mul(0.1));
    }
    color("red");
    box(p.pos, p.size);
  });
  if (scoreCountTicks > 0) {
    scoreCountTicks += difficulty * (pieces.length + 1) * 0.5;
    const c = clamp(
      floor(scoreCountTicks / 20),
      0,
      max(cutCount, pieces.length)
    );
    times(c, (i) => {
      color("black");
      const y = 40 + i * 15;
      if (i === 0) {
        if (turnScore < 0) {
          color("red");
        }
        text(`${turnScore}`, 80, y);
      } else {
        const pw1 = i - 1 < pieces.length ? pieces[i - 1].size.x : 0;
        const pw2 = i < pieces.length ? pieces[i].size.x : 0;
        const p =
          (pw1 === 0 && pw2 === 0) || i > cutCount
            ? 100
            : floor((abs(pw1 - pw2) / (pw1 + pw2)) * 300);
        text(`-${p}`, 74, y);
        if (i === scoreCountIndex) {
          play("hit");
          turnScore -= p;
          scoreCountIndex++;
        }
      }
    });
  }
  if (saw.x > 160) {
    if (turnScore < 0) {
      play("explosion");
      end();
    } else {
      score += turnScore;
      nextTimber();
    }
  }
  color("black");
  if (turnIndex <= 3 && isShowingIndicator) {
    times(cutCount - 1, (i) => {
      text("^", timber.x + (timber.width / cutCount) * (i + 1), 35);
    });
    text("Cut here!", 32, 38);
  }
}

function nextTimber() {
  play("powerUp");
  const tw = rnd(40, 80);
  timber = { x: (100 - tw) / 2 + rnd((100 - tw) / 3), width: tw };
  cutCount = rndi(2, 5);
  turnScore = (cutCount - 1) * 100;
  cutIndex = 0;
  pieces = [];
  saw = { x: -30, vx: (difficulty / sqrt(cutCount)) * 2 };
  scoreCountTicks = 0;
  scoreCountIndex = 1;
  turnIndex++;
  isShowingIndicator = true;
}
```
