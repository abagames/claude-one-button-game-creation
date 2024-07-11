title = "TWIN JUMPERS";

description = `
[Tap] Jump
`;

characters = [
  `
 bb
 bb
bbbb
bbbb
b  b
b  b
`,
  `
 gggg
gggggg
gggggg
gg  gg
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 9,
};

/** @type {{ pos: Vector, vx: number, vy: number, onPlatformTicks: number }[]} */
let jumpers;
let jumpPower;
/** @type {{ pos: Vector, width: number }[]} */
let platforms;

// Define game variables
let scrollSpeed;
let nextPlatformDistance;

function update() {
  if (!ticks) {
    // Initialize game objects and variables
    jumpers = [
      { pos: vec(20, 70), vx: 1, vy: 0, onPlatformTicks: 0 },
      { pos: vec(80, 70), vx: 1, vy: 0, onPlatformTicks: 0 },
    ];
    jumpPower = 1;
    platforms = [
      {
        pos: vec(50, 80),
        width: 100,
      },
    ];
    scrollSpeed = 0.1;
    nextPlatformDistance = 0;

    // Spawn initial platforms
    times(3, (i) => {
      platforms.push({
        pos: vec(rnd(0, 40), 70 - i * 30),
        width: rnd(20, 50),
      });
      platforms.push({
        pos: vec(rnd(60, 100), 70 - i * 30),
        width: rnd(20, 50),
      });
    });
  }

  scrollSpeed = 0.1 * sqrt(difficulty);
  const my = Math.max(jumpers[0].pos.y, jumpers[1].pos.y);
  if (my < 60) {
    scrollSpeed += (60 - my) * 0.05;
  }
  addScore(scrollSpeed);

  // Handle input for jumping and swapping
  if (input.isJustPressed) {
    jumpers.forEach((jumper, i) => {
      if (jumper.onPlatformTicks > 0) {
        play("jump", { volume: 0.5 });
        jumper.vy = (i === 0 ? -3 : -2.5) * jumpPower;
      }
    });
    jumpPower *= 0.8;
  } else {
    jumpPower = clamp(jumpPower + 0.01, 0, 1);
  }

  // Update jumper positions
  jumpers.forEach((jumper) => {
    jumper.pos.y += jumper.vy;
    jumper.vy += input.isPressed ? 0.1 : 0.2; // Gravity
    jumper.pos.x += jumper.vx * 0.6;
    jumper.onPlatformTicks--;

    if (
      (jumper.pos.x < 3 && jumper.vx < 0) ||
      (jumper.pos.x > 97 && jumper.vx > 0)
    ) {
      jumper.vx = -jumper.vx;
    }
    if (jumper.pos.y < 0 && jumper.vy < 0) {
      jumper.pos.y = 0;
      jumper.vy *= -0.5;
    }
  });

  // Scroll and spawn platforms
  remove(platforms, (p) => {
    p.pos.y += scrollSpeed;
    // Remove if off screen
    return p.pos.y > 109;
  });

  // Spawn new platforms
  nextPlatformDistance -= scrollSpeed;
  if (nextPlatformDistance <= 0) {
    platforms.push({
      pos: vec(rnd(0, 50), -rnd(20) - 5),
      width: rnd(30, 50),
    });
    platforms.push({
      pos: vec(rnd(50, 100), -rnd(20) - 5),
      width: rnd(30, 50),
    });
    nextPlatformDistance = rnd(20, 30);
  }

  // Draw jumpers using character sprites
  color("black");
  char("a", jumpers[0].pos);
  char("b", jumpers[1].pos);

  // Draw game objects
  color("yellow");
  platforms.forEach((p) => {
    const c = box(p.pos, p.width, 4).isColliding.char;
    if (c.a && jumpers[0].vy > 0) {
      if (jumpers[0].vy > 2) {
        play("click");
      }
      jumpers[0].pos.y = p.pos.y - 4;
      jumpers[0].vy = 0;
      jumpers[0].onPlatformTicks = 9;
    }
    if (c.b && jumpers[1].vy > 0) {
      if (jumpers[0].vy > 2) {
        play("click");
      }
      jumpers[1].pos.y = p.pos.y - 3;
      jumpers[1].vy = 0;
      jumpers[1].onPlatformTicks = 9;
    }
  });

  // Check for game over condition
  if (jumpers.some((char) => char.pos.y > 102)) {
    play("explosion");
    end();
  }
}
