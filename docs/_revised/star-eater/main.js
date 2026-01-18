title = "STAR EATER";

description = `
[Hold] Charge
[Release] Blast
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let player;
let asteroids;
let nextAsteroidTicks;
let charge;
let explosion;
let destroyedCount;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 50), size: 5 };
    asteroids = [];
    nextAsteroidTicks = 0;
    charge = 0;
    explosion = { active: false, pos: vec(), radius: 0, timer: 0 };
    destroyedCount = 0;
  }

  // Spawn asteroids (from all directions)
  nextAsteroidTicks--;
  if (nextAsteroidTicks <= 0) {
    let side = floor(rnd(4));
    let pos, vel;
    if (side === 0) {
      pos = vec(rnd(100), 0);
      vel = vec(rnd(-0.3, 0.3), 0.5 + rnd(difficulty * 0.2));
    } else if (side === 1) {
      pos = vec(rnd(100), 100);
      vel = vec(rnd(-0.3, 0.3), -0.5 - rnd(difficulty * 0.2));
    } else if (side === 2) {
      pos = vec(0, rnd(100));
      vel = vec(0.5 + rnd(difficulty * 0.2), rnd(-0.3, 0.3));
    } else {
      pos = vec(100, rnd(100));
      vel = vec(-0.5 - rnd(difficulty * 0.2), rnd(-0.3, 0.3));
    }
    if (
      pos.distanceTo(player.pos) > 50 &&
      pos.distanceTo(player.pos.x - 100, player.pos.y) > 50
    ) {
      vel.mul(sqrt(difficulty));
      asteroids.push({ pos: pos, vel: vel, size: rnd(5, 9) });
      nextAsteroidTicks = rnd(22, 55) / difficulty;
    }
  }

  // Player auto-movement (slow drift, wraps)
  const speed = (input.isPressed ? 1.8 : 1) * sqrt(difficulty);
  player.pos.x += 0.2 * speed;
  if (player.pos.x > 100) player.pos.x = 0;
  player.pos.y += sin(ticks * 0.02 * speed) * 0.1;
  player.pos.y = clamp(player.pos.y, 5, 95);

  // Input: Hold to charge (grow bigger = more vulnerable but bigger blast)
  if (input.isPressed) {
    charge = min(charge + difficulty, 60);
    player.size = 5 + charge * 0.15;
  }

  // Input: Release to blast
  if (input.isJustReleased && charge > 10) {
    play("explosion");
    explosion.active = true;
    explosion.pos = vec(player.pos.x, player.pos.y);
    explosion.radius = 15 + charge * 0.8;
    explosion.timer = 12;
    charge = 0;
    player.size = 5;
    destroyedCount = 0;
  }

  // Decay charge if not holding
  if (!input.isPressed && charge > 0) {
    charge = max(0, charge - 2);
    player.size = 5 + charge * 0.15;
  }

  // Update explosion
  if (explosion.active) {
    explosion.timer--;
    if (explosion.timer <= 0) {
      explosion.active = false;
    }
  }

  // Update asteroids
  asteroids = asteroids.filter((ast) => {
    ast.pos.x += ast.vel.x;
    ast.pos.y += ast.vel.y;
    return ast.pos.x > 0 && ast.pos.x < 100 && ast.pos.y > 0 && ast.pos.y < 100;
  });

  // Draw explosion and check asteroid destruction
  if (explosion.active) {
    checkExplosion(
      explosion.pos.x,
      explosion.pos.y,
      explosion.radius,
      explosion.timer
    );
    checkExplosion(
      explosion.pos.x - 100,
      explosion.pos.y,
      explosion.radius,
      explosion.timer
    );
  }

  // Draw charge indicator
  if (charge > 0) {
    color("yellow");
    arc(player.pos, player.size + 2, 1);
  }

  // Draw player
  color("cyan");
  arc(player.pos, player.size);

  // Draw asteroids and check collision with player
  color("red");
  asteroids.forEach((ast) => {
    box(ast.pos, ast.size);
    let dist = player.pos.distanceTo(ast.pos);
    if (dist < player.size + ast.size / 2) {
      play("hit");
      end();
    }
  });
}

function checkExplosion(x, y, radius, timer) {
  color("light_yellow");
  asteroids = asteroids.filter((ast) => {
    let dist = ast.pos.distanceTo(x, y);
    if (dist < radius + ast.size / 2) {
      destroyedCount++;
      addScore(destroyedCount * destroyedCount, ast.pos);
      play("powerUp");
      return false;
    }
    return true;
  });
  arc(x, y, radius * (timer / 12), 4);
}
