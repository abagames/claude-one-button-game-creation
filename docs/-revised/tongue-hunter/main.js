title = "TONGUE HUNTER";

description = `
[Hold] Extend tongue
`;

characters = [
  `
  llll
 llllll
llllllll
llllllll
 llllll
  l  l
  `,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let frog;
let tongueLength;
let tongueAngle;
let prey;
let hazards;
let combo;
let trails;
let frogSquash;

function update() {
  if (!ticks) {
    frog = { x: 50, y: 90 };
    tongueLength = 0;
    tongueAngle = -PI / 2;
    prey = [];
    hazards = [];
    combo = 1;
    trails = [];
    frogSquash = 1;
  }

  let spawnRate = 60 / difficulty;
  if (spawnRate < 20) spawnRate = 20;
  if (ticks % floor(spawnRate) === 0) {
    const side = rnd() < 0.5;
    prey.push({
      x: side ? -5 : 105,
      y: rnd(20, 60),
      vx: side ? rnd(0.3, 0.6) : rnd(-0.6, -0.3),
      squash: 1,
    });
  }

  let hazardRate = 90 / sqrt(difficulty);
  if (hazardRate < 30) hazardRate = 30;
  if (ticks % floor(hazardRate) === 0) {
    hazards.push({
      x: rnd(10, 90),
      y: -5,
      vy: 0.5 * rnd(1, sqrt(difficulty)),
      rot: 0,
    });
  }

  // Frog squash/stretch animation
  if (input.isJustPressed) {
    frogSquash = 1.3;
  }
  frogSquash += (1 - frogSquash) * 0.15;

  let tongueEndX = frog.x + cos(tongueAngle) * tongueLength;
  let tongueEndY = frog.y + sin(tongueAngle) * tongueLength;

  let nearestPrey = null;
  let nearestDist = 999;
  prey.forEach((p) => {
    let dx = p.x - tongueEndX;
    let dy = p.y - tongueEndY;
    let d = sqrt(dx * dx + dy * dy);
    if (d < nearestDist) {
      nearestDist = d;
      nearestPrey = p;
    }
  });

  if (input.isPressed && nearestPrey) {
    const ta = atan2(nearestPrey.y - frog.y, nearestPrey.x - frog.x);
    if (abs(ta - tongueAngle) < 0.1) {
      tongueAngle = ta;
      tongueLength += 8;
    } else if (ta < tongueAngle) {
      tongueAngle -= 0.1;
    } else {
      tongueAngle += 0.1;
    }
  }
  tongueLength = clamp(tongueLength - 5, 0, 80);

  // Add tongue trail
  if (tongueLength > 10) {
    trails.push({ x: tongueEndX, y: tongueEndY, life: 1 });
  }

  // Update trails
  trails = trails.filter((t) => {
    t.life -= 0.15;
    return t.life > 0;
  });

  prey.forEach((p) => {
    p.x += p.vx * (1 + difficulty * 0.05);
    p.squash += (1 - p.squash) * 0.1;
  });
  prey = prey.filter((p) => p.x > -10 && p.x < 110);

  hazards.forEach((h) => {
    h.y += h.vy;
    h.rot += h.vy * 0.1;
  });
  hazards = hazards.filter((h) => h.y < 110);

  // === DRAW ORDER FOR COLLISION ===

  // 1. Draw trails (decorative, no collision)
  color("light_yellow");
  trails.forEach((t) => {
    box(t.x, t.y, 4 * t.life);
  });

  // 2. Draw prey bodies FIRST (collision target for tongue)
  color("black");
  prey.forEach((p) => {
    const w = 5 * p.squash;
    const h = 5 / p.squash;
    box(p.x, p.y, w, h);
  });

  // 3. Draw prey eyes (decorative, after body)
  prey.forEach((p) => {
    const eyeOffsetX = p.vx > 0 ? 1.5 : -1.5;
    color("white");
    box(p.x + eyeOffsetX, p.y - 1, 2);
    color("blue");
    box(p.x + eyeOffsetX + (p.vx > 0 ? 0.5 : -0.5), p.y - 1, 1);
  });

  // 4. Draw frog
  color("green");
  char("a", frog.x, frog.y, { scaleX: 1 / frogSquash, scaleY: frogSquash });

  // 5. Draw frog eyes looking at prey
  if (nearestPrey) {
    const eyeDx = nearestPrey.x > frog.x ? 1 : -1;
    const eyeDy = nearestPrey.y < frog.y ? -0.5 : 0.5;
    color("white");
    box(frog.x - 2, frog.y - 2, 2);
    box(frog.x + 2, frog.y - 2, 2);
    color("blue");
    box(frog.x - 2 + eyeDx * 0.5, frog.y - 2 + eyeDy, 1);
    box(frog.x + 2 + eyeDx * 0.5, frog.y - 2 + eyeDy, 1);
  }

  // 6. Draw tongue and check collision with prey (black)
  if (tongueLength > 5) {
    color("light_red");
    line(frog.x, frog.y, tongueEndX, tongueEndY, 2);

    const tipPulse = 1 + sin(ticks * 0.3) * 0.2;
    color("cyan");
    let tipCol = box(tongueEndX, tongueEndY, 6 * tipPulse);

    if (tipCol.isColliding.rect.black) {
      play("coin");
      addScore(ceil(tongueLength) * combo, tongueEndX, tongueEndY);
      combo++;

      color("yellow");
      particle(tongueEndX, tongueEndY, 15, 2, 0, PI * 2);

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

  // 7. Draw hazards and check collision with tongue
  hazards.forEach((h) => {
    const breathe = 1 + sin(ticks * 0.15 + h.x) * 0.1;
    const size = 8 * breathe;

    // Rotating body using bar
    color("red");
    bar(h.x, h.y, size, size * 0.7, h.rot);

    // Eyes
    color("white");
    box(h.x - 2, h.y, 2);
    box(h.x + 2, h.y, 2);
    color("purple");
    box(h.x - 2, h.y + 0.5, 1);
    box(h.x + 2, h.y + 0.5, 1);

    // Collision check box
    color("red");
    let hCol = box(h.x, h.y, size);
    if (isExtended && hCol.isColliding.rect.light_red) {
      play("explosion");
      color("red");
      particle(h.x, h.y, 30, 3, 0, PI * 2);
      end();
    }
  });

  color("black");
  text(`x${combo}`, 3, 9, { isSmallText: true });
}
