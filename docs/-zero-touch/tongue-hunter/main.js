title = "TONGUE HUNTER";

description = `
[Hold] Extend tongue
`;

characters = [
  `
  llll
 llllll
ll ll ll
llllllll
 llllll
  l  l
  `,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let frog;
let tongueLength;
let tongueAngle;
let prey;
let hazards;
let combo;

function update() {
  if (!ticks) {
    frog = { x: 50, y: 90 };
    tongueLength = 0;
    tongueAngle = -PI / 2;
    prey = [];
    hazards = [];
    combo = 1;
  }

  let spawnRate = 60 - sqrt(difficulty) * 5;
  if (spawnRate < 20) spawnRate = 20;
  if (ticks % floor(spawnRate) === 0) {
    prey.push({
      x: rnd(1) < 0.5 ? -5 : 105,
      y: rnd(20, 60),
      vx: rnd(1) < 0.5 ? rnd(0.3, 0.6) : rnd(-0.6, -0.3),
    });
  }

  let hazardRate = 90 - sqrt(difficulty) * 8;
  if (hazardRate < 30) hazardRate = 30;
  if (ticks % floor(hazardRate) === 0) {
    hazards.push({
      x: rnd(10, 90),
      y: -5,
      vy: 0.5 + difficulty * 0.1,
    });
  }

  let nearestPrey = null;
  let nearestDist = 999;
  prey.forEach((p) => {
    let dx = p.x - frog.x;
    let dy = p.y - frog.y;
    let d = sqrt(dx * dx + dy * dy);
    if (d < nearestDist) {
      nearestDist = d;
      nearestPrey = p;
    }
  });

  if (input.isPressed && nearestPrey) {
    tongueAngle = atan2(nearestPrey.y - frog.y, nearestPrey.x - frog.x);
    let maxLen = 80;
    if (tongueLength < maxLen) {
      tongueLength += 3;
    }
  } else {
    tongueLength -= 5;
    if (tongueLength < 0) tongueLength = 0;
  }

  let tongueEndX = frog.x + cos(tongueAngle) * tongueLength;
  let tongueEndY = frog.y + sin(tongueAngle) * tongueLength;

  prey.forEach((p) => {
    p.x += p.vx * (1 + difficulty * 0.05);
  });
  prey = prey.filter((p) => p.x > -10 && p.x < 110);

  color("black");
  prey.forEach((p) => {
    box(p.x, p.y, 5);
  });

  color("green");
  char("a", frog.x, frog.y);

  if (tongueLength > 5) {
    color("red");
    line(frog.x, frog.y, tongueEndX, tongueEndY, 2);

    color("cyan");
    let tipCol = box(tongueEndX, tongueEndY, 6);

    if (tipCol.isColliding.rect.black) {
      play("coin");
      addScore(10 * combo, tongueEndX, tongueEndY);
      combo++;
      let removeIdx = -1;
      let minD = 999;
      for (let i = 0; i < prey.length; i++) {
        let dx = prey[i].x - tongueEndX;
        let dy = prey[i].y - tongueEndY;
        let d = sqrt(dx * dx + dy * dy);
        if (d < minD) {
          minD = d;
          removeIdx = i;
        }
      }
      if (removeIdx >= 0) {
        prey.splice(removeIdx, 1);
      }
    }
  } else {
    combo = 1;
  }

  let isExtended = tongueLength > 5;

  hazards.forEach((h) => {
    h.y += h.vy;
  });
  hazards = hazards.filter((h) => h.y < 110);

  color("red");
  hazards.forEach((h) => {
    let hCol = box(h.x, h.y, 8);
    if (isExtended && hCol.isColliding.char.a) {
      play("explosion");
      end();
    }
  });

  color("black");
  text(`x${combo}`, 3, 10);
}
