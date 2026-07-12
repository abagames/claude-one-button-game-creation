title = "RECOIL RADAR";

description = `
[Hold] Charge Scan
[Release] Fire + Recoil
`;

characters = [];

options = {
  viewSize: { x: 100, y: 100 },
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 2026071102,
};

let player;
let hazards;
let scanRadius;
let scanChargeTicks;
let nextHazardTicks;
let shotTicks;
let shotFrom;
let shotTo;
let playerFlashTicks;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 50), vel: vec(0, 0) };
    hazards = [];
    scanRadius = 8;
    scanChargeTicks = 0;
    nextHazardTicks = 45;
    shotTicks = 0;
    shotFrom = vec(50, 50);
    shotTo = vec(50, 50);
    playerFlashTicks = 0;
  }

  // Holding illuminates more space, but inertia continues throughout the scan.
  if (input.isPressed) {
    scanChargeTicks++;
    scanRadius = min(scanRadius + 0.55, 46);
  } else if (!input.isJustReleased) {
    scanChargeTicks = 0;
    scanRadius = max(scanRadius - 1.5, 8);
  }
  let isScanCharged = scanChargeTicks >= 10;
  if (scanChargeTicks === 10) {
    color("light_cyan");
    particle(player.pos, {
      count: 6,
      speed: 0.8,
      angle: 0,
      angleWidth: PI * 2,
    });
    play("select");
  }

  // A visible minimum charge prevents rapid taps from creating shots or score.
  if (input.isJustReleased) {
    let targetIndex = -1;
    let targetDistance = scanRadius;
    if (isScanCharged) {
      for (let i = 0; i < hazards.length; i++) {
        let d = player.pos.distanceTo(hazards[i].pos);
        if (d <= targetDistance) {
          targetDistance = d;
          targetIndex = i;
        }
      }
    }
    if (targetIndex >= 0) {
      let target = hazards[targetIndex];
      shotFrom = vec(player.pos.x, player.pos.y);
      shotTo = vec(target.pos.x, target.pos.y);
      shotTicks = 5;
      let recoilAngle = target.pos.angleTo(player.pos);
      let kick = 1.2 + (46 - targetDistance) * 0.025;
      player.vel.addWithAngle(recoilAngle, kick);
      addScore(round(55 - targetDistance), target.pos.x, target.pos.y);
      color("yellow");
      particle(target.pos, {
        count: 12,
        speed: 2.2,
        angle: recoilAngle,
        angleWidth: PI * 2,
      });
      color("cyan");
      particle(player.pos, {
        count: 4,
        speed: 1.4,
        angle: recoilAngle + PI,
        angleWidth: 0.5,
      });
      hazards.splice(targetIndex, 1);
      play("laser");
    } else {
      play("click");
    }
    scanChargeTicks = 0;
    scanRadius = 8;
  }

  // Recoil-driven motion has drag and elastic wall impacts. Keep the ship's
  // visible edge about 5-6 px inside the arena so newly entering rocks are
  // readable before contact.
  player.pos.add(player.vel);
  player.vel.mul(0.985);
  let didBounce = false;
  if (player.pos.x < 8) {
    player.pos.x = 8;
    player.vel.x = abs(player.vel.x) * 0.8;
    didBounce = true;
  } else if (player.pos.x > 92) {
    player.pos.x = 92;
    player.vel.x = -abs(player.vel.x) * 0.8;
    didBounce = true;
  }
  if (player.pos.y < 9) {
    player.pos.y = 9;
    player.vel.y = abs(player.vel.y) * 0.8;
    didBounce = true;
  } else if (player.pos.y > 92) {
    player.pos.y = 92;
    player.vel.y = -abs(player.vel.y) * 0.8;
    didBounce = true;
  }
  if (didBounce) {
    playerFlashTicks = 2;
    color("cyan");
    particle(player.pos, {
      count: 5,
      speed: 1.2,
      angle: player.vel.angle + PI,
      angleWidth: PI / 2,
    });
    play("hit");
  }

  // Rocks enter from all four edges and drift across the arena.
  nextHazardTicks--;
  if (nextHazardTicks < 0) {
    let edge = rndi(4);
    let p;
    if (edge === 0) {
      p = vec(rnd(10, 90), -5);
    } else if (edge === 1) {
      p = vec(105, rnd(10, 90));
    } else if (edge === 2) {
      p = vec(rnd(10, 90), 105);
    } else {
      p = vec(-5, rnd(10, 90));
    }
    let a = p.angleTo(player.pos) + rnd(-0.45, 0.45);
    hazards.push({ pos: p, vel: vec(cos(a), sin(a)), size: rnd(5, 8) });
    nextHazardTicks = max(24, 72 / sqrt(difficulty));
  }

  // The scan is a visible light pool; distant rocks remain only silhouettes.
  if (input.isPressed) {
    color(isScanCharged ? "light_cyan" : "light_black");
    arc(player.pos, scanRadius, 1.5);
  }

  if (shotTicks > 0) {
    color("yellow");
    line(shotFrom, shotTo, 2);
    shotTicks--;
  }

  color("cyan");
  box(player.pos, 6);
  if (playerFlashTicks > 0) {
    color("light_cyan");
    box(player.pos, 4);
    playerFlashTicks--;
  }
  color("blue");
  bar(player.pos, 9, 2, player.vel.angle);

  let rockSpeed = min(1.8, 0.45 + 0.18 * sqrt(difficulty));
  remove(hazards, (h) => {
    h.pos.add(vec(h.vel.x * rockSpeed, h.vel.y * rockSpeed));
    let isRevealed =
      input.isPressed &&
      isScanCharged &&
      player.pos.distanceTo(h.pos) <= scanRadius;
    color(isRevealed ? "red" : "light_black");
    let hit = box(h.pos, h.size);
    if (hit.isColliding.rect.cyan || hit.isColliding.rect.blue) {
      play("explosion");
      end();
    }
    return h.pos.x < -12 || h.pos.x > 112 || h.pos.y < -12 || h.pos.y > 112;
  });
}
