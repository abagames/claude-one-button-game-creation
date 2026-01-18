title = "STAR EATER";

description = `
[Hold] Charge
[Release] Blast
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let player;
let asteroids;
let charge;
let explosion;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 50), size: 5 };
    asteroids = [];
    charge = 0;
    explosion = { active: false, pos: vec(), radius: 0, timer: 0 };
  }

  // Spawn asteroids (from all directions)
  if (rnd() < 0.02 + difficulty * 0.005) {
    let side = floor(rnd(4));
    let pos, vel;
    if (side === 0) {
      pos = vec(rnd(100), -10);
      vel = vec(rnd(-0.3, 0.3), 0.5 + rnd(difficulty * 0.2));
    } else if (side === 1) {
      pos = vec(rnd(100), 110);
      vel = vec(rnd(-0.3, 0.3), -0.5 - rnd(difficulty * 0.2));
    } else if (side === 2) {
      pos = vec(-10, rnd(100));
      vel = vec(0.5 + rnd(difficulty * 0.2), rnd(-0.3, 0.3));
    } else {
      pos = vec(110, rnd(100));
      vel = vec(-0.5 - rnd(difficulty * 0.2), rnd(-0.3, 0.3));
    }
    asteroids.push({ pos: pos, vel: vel, size: rnd(5, 9) });
  }

  // Player auto-movement (slow drift, wraps)
  player.pos.x += 0.2;
  if (player.pos.x > 100) player.pos.x = 0;
  player.pos.y += sin(ticks * 0.02) * 0.1;
  player.pos.y = clamp(player.pos.y, 5, 95);

  // Input: Hold to charge (grow bigger = more vulnerable but bigger blast)
  if (input.isPressed) {
    charge = min(charge + 1, 60);
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
    return ast.pos.x > -15 && ast.pos.x < 115 && ast.pos.y > -15 && ast.pos.y < 115;
  });

  // Draw explosion and check asteroid destruction
  if (explosion.active) {
    color("light_yellow");
    let destroyedCount = 0;
    asteroids = asteroids.filter((ast) => {
      let dist = explosion.pos.distanceTo(ast.pos);
      if (dist < explosion.radius + ast.size / 2) {
        destroyedCount++;
        return false;
      }
      return true;
    });
    if (destroyedCount > 0) {
      addScore(destroyedCount * (1 + floor(explosion.radius / 25)));
      play("powerUp");
    }
    arc(explosion.pos, explosion.radius * (explosion.timer / 12), 4);
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
