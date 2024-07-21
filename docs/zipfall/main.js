title = "ZIP FALL";

description = `
[Tap] Fall
`;

characters = [
  `
b bb b
 bbbb
bbbbbb
 b  b
 b  b
`,
  `
r rr r
rrrrrr
 r  r
`,
  `
  yy
 yyyy
y yy y
y yy y
 yyyy
  yy
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 3,
  isCapturing: true,
};

/** @type {{pos: Vector, vel: Vector, currentZip}} */
let backpacker;

/** @type {{y: number}[]} */
let zipLines;

/** @type {{pos: Vector, vx: number, type: "obstacle" | "item"}[]} */
let objects;

let scrollSpeed;
let nextZipDist;
let nextObjectTicks;
let multiplier;

function update() {
  if (!ticks) {
    zipLines = [{ y: 20 }, { y: 50 }, { y: 75 }];
    backpacker = { pos: vec(20, 20), vel: vec(1), currentZip: zipLines[0] };
    objects = [];
    scrollSpeed = 1;
    nextZipDist = 0;
    nextObjectTicks = 0;
    multiplier = 1;
  }
  scrollSpeed = 0.05 * difficulty;
  if (backpacker.pos.y > 30) {
    scrollSpeed -= (30 - backpacker.pos.y) * 0.1;
  }

  updateBackpacker();
  updateZipLines();
  updateObjects();

  color("black");
  text(`x${floor(multiplier)}`, 2, 10, { isSmallText: true });
}

function updateBackpacker() {
  // Handle button press
  if (input.isJustPressed) {
    play("powerUp");
    backpacker.pos.y += 5;
    backpacker.vel.y = 1;
    backpacker.currentZip = undefined;
  }
  if (backpacker.currentZip == null) {
    backpacker.vel.y += 0.1;
    backpacker.pos.y += backpacker.vel.y * difficulty - scrollSpeed;
  } else {
    backpacker.pos.y = backpacker.currentZip.y + 3;
    backpacker.pos.x += backpacker.vel.x * difficulty;
  }
  if (
    (backpacker.pos.x < 20 && backpacker.vel.x < 0) ||
    (backpacker.pos.x > 80 && backpacker.vel.x > 0)
  ) {
    backpacker.vel.x = -backpacker.vel.x;
    if (multiplier >= 2) {
      multiplier--;
    }
  }
  if (backpacker.pos.y < 3) {
    play("explosion");
    end();
  }

  // Draw backpacker
  color("blue");
  char("a", backpacker.pos);
}

function updateZipLines() {
  color("black");
  remove(zipLines, (z) => {
    if (
      box(50, z.y, 60, 2).isColliding.char.a &&
      backpacker.currentZip == null
    ) {
      play("click");
      backpacker.currentZip = z;
    }
    // Move zip-lines
    z.y -= scrollSpeed;
    // Remove off-screen zip-lines and add new ones
    return z.y < 0;
  });
  nextZipDist -= scrollSpeed;
  if (nextZipDist < 0) {
    zipLines.push({ y: 100 });
    nextZipDist = rnd(20, 40);
  }
}

function updateObjects() {
  nextObjectTicks -= difficulty;
  if (nextObjectTicks <= 0) {
    const type = rnd() < 0.6 ? "obstacle" : "item";
    const vx = rnd(0.5, 1) * (rnd() < 0.5 ? -1 : 1);
    const pos = vec(vx > 0 ? -3 : 103, rnd(0, 120));
    objects.push({ pos, vx, type });
    nextObjectTicks = rnd(20, 30);
  }

  remove(objects, (obj) => {
    obj.pos.y -= scrollSpeed;
    obj.pos.x += obj.vx * difficulty;

    if (obj.type === "obstacle") {
      color("red");
      if (char("b", obj.pos).isColliding.char.a) {
        play("explosion");
        end();
      }
    } else {
      color("yellow");
      if (char("c", obj.pos).isColliding.char.a) {
        play("coin");
        addScore(multiplier, obj.pos);
        multiplier += difficulty * 3;
        return true;
      }
    }

    return obj.pos.x < -5 || obj.pos.x > 105;
  });
}
