title = "STILLFIRE CHOIR";

description = `
[Hold] Fix choir
Auto-ray on pulse
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 5,
};

let player;
let allies;
let enemies;
let items;
let nextEnemyTicks;
let nextItemTicks;
let nextVolleyTicks;
let volleySpan;
let beamTicks;
let beamAfterglowTicks;
let lockPulseTicks;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 88), vx: 0.72 };
    allies = [];
    enemies = [];
    items = [];
    nextEnemyTicks = 25;
    nextItemTicks = 75;
    volleySpan = 62;
    nextVolleyTicks = volleySpan;
    beamTicks = 0;
    beamAfterglowTicks = 0;
    lockPulseTicks = 0;
  }

  const pressure = sqrt(difficulty);

  if (input.isJustPressed) {
    lockPulseTicks = 5;
    play("select");
  }

  if (!input.isPressed) {
    player.pos.x += player.vx * pressure;
    if (player.pos.x < 5 || player.pos.x > 95) {
      player.pos.x = clamp(player.pos.x, 5, 95);
      player.vx *= -1;
      color("light_blue");
      particle(player.pos, {
        count: 3,
        speed: 0.8,
        angle: player.vx > 0 ? 0 : PI,
        angleWidth: PI / 3,
      });
      play("click");
    }
    allies.forEach((ally) => {
      ally.pos.x += ally.vx * pressure;
      if (ally.pos.x < 4 || ally.pos.x > 96) {
        ally.pos.x = clamp(ally.pos.x, 4, 96);
        ally.vx *= -1;
        color("light_blue");
        particle(ally.pos, {
          count: 2,
          speed: 0.7,
          angle: ally.vx > 0 ? 0 : PI,
          angleWidth: PI / 3,
        });
      }
    });
  }

  nextVolleyTicks--;
  if (nextVolleyTicks <= 0) {
    beamTicks = 1;
    // Four includes the live beam frame, leaving three visual-only frames.
    beamAfterglowTicks = 4;
    volleySpan = max(36, 62 / pressure);
    nextVolleyTicks = volleySpan;
    play("laser");
  }

  nextEnemyTicks--;
  if (nextEnemyTicks <= 0) {
    enemies.push({
      pos: vec(rnd(5, 95), -4),
      speed: rnd(0.45, 0.78),
      size: rnd(5, 9),
    });
    nextEnemyTicks = rnd(31, 49) / pressure;
  }

  nextItemTicks--;
  if (nextItemTicks <= 0) {
    items.push({ pos: vec(rnd(7, 93), -3), speed: rnd(0.36, 0.52) });
    nextItemTicks = rnd(125, 175) / pressure;
  }

  color("blue");
  box(player.pos, 7, 7);
  allies.forEach((ally) => {
    box(ally.pos, 5, 5);
  });

  // The emitters themselves are the volley gauge: their cores fill upward
  // as the next synchronized ray approaches. Keep the blue body unchanged so
  // the visual charge never alters its collision footprint.
  const volleyCharge = clamp(1 - nextVolleyTicks / volleySpan, 0, 1);
  const isChargeFlickering =
    nextVolleyTicks < 10 && Math.floor(ticks / 2) % 2 === 0;
  color(isChargeFlickering ? "light_blue" : "light_cyan");
  const playerChargeHeight = 5 * volleyCharge;
  rect(
    player.pos.x - 1.5,
    player.pos.y + 2.5 - playerChargeHeight,
    3,
    playerChargeHeight,
  );
  allies.forEach((ally) => {
    const allyChargeHeight = 3 * volleyCharge;
    rect(
      ally.pos.x - 1,
      ally.pos.y + 1.5 - allyChargeHeight,
      2,
      allyChargeHeight,
    );
  });

  // A brief ring makes the exact hold edge tactile without enlarging or
  // deforming the collision bodies.
  if (lockPulseTicks > 0) {
    color("light_cyan");
    arc(player.pos, 4 + lockPulseTicks * 0.35, 1);
    allies.forEach((ally) => {
      arc(ally.pos, 3 + lockPulseTicks * 0.25, 1);
    });
  }

  // Newly collected voices settle into the formation with a short ring.
  color("light_yellow");
  allies.forEach((ally) => {
    if (ally.spawnTicks > 0) {
      arc(ally.pos, 3 + ally.spawnTicks * 0.35, 1);
      ally.spawnTicks--;
    }
  });

  if (beamTicks > 0) {
    color("cyan");
    rect(player.pos.x - 1, 6, 2, player.pos.y - 8);
    allies.forEach((ally) => {
      rect(ally.pos.x - 1, 6, 2, ally.pos.y - 8);
    });
  } else if (beamAfterglowTicks > 0) {
    color("light_cyan");
    const afterglowWidth = 0.5 + beamAfterglowTicks * 0.25;
    rect(
      player.pos.x - afterglowWidth / 2,
      6,
      afterglowWidth,
      player.pos.y - 8,
    );
    allies.forEach((ally) => {
      rect(ally.pos.x - afterglowWidth / 2, 6, afterglowWidth, ally.pos.y - 8);
    });
  }

  color("yellow");
  remove(items, (item) => {
    item.pos.y += item.speed * pressure;
    const hit = box(item.pos, 5, 5);
    if (hit.isColliding.rect.blue) {
      const direction = rndi(2) === 0 ? -1 : 1;
      allies.push({
        pos: vec(item.pos.x, item.pos.y),
        vx: direction * rnd(0.48, 0.9),
        spawnTicks: 8,
      });
      addScore(5, item.pos.x, item.pos.y);
      particle(item.pos, { count: 8, speed: 1.2, angle: -PI / 2 });
      play("powerUp");
      return true;
    }
    return item.pos.y > 105;
  });

  color("red");
  remove(enemies, (enemy) => {
    enemy.pos.y += enemy.speed * pressure;
    const hit = box(enemy.pos, enemy.size, enemy.size);
    if (hit.isColliding.rect.cyan) {
      const points = 10 + allies.length * 2;
      addScore(points, enemy.pos.x, enemy.pos.y);
      particle(enemy.pos, { count: 9, speed: 1.5, angle: PI / 2 });
      play("coin");
      return true;
    }
    if (hit.isColliding.rect.blue) {
      play("explosion");
      end();
    }
    return enemy.pos.y > 105;
  });

  beamTicks = max(0, beamTicks - 1);
  beamAfterglowTicks = max(0, beamAfterglowTicks - 1);
  lockPulseTicks = max(0, lockPulseTicks - 1);
}
