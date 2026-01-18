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
let trails;
let starDust;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 50), size: 5, baseSize: 5, breathPhase: 0 };
    asteroids = [];
    nextAsteroidTicks = 0;
    charge = 0;
    explosion = { active: false, pos: vec(), radius: 0, timer: 0 };
    destroyedCount = 0;
    trails = [];
    starDust = [];
  }

  // Update trails (afterimage)
  trails = trails.filter((t) => {
    t.alpha -= 0.08;
    return t.alpha > 0;
  });

  // Update star dust particles
  starDust = starDust.filter((p) => {
    p.pos.x += p.vel.x;
    p.pos.y += p.vel.y;
    p.vel.mul(0.95);
    p.life -= 1;
    return p.life > 0;
  });

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
      asteroids.push({
        pos: pos,
        vel: vel,
        size: rnd(5, 9),
        rotation: rnd(PI * 2),
        rotSpeed: rnd(-0.1, 0.1),
      });
      nextAsteroidTicks = rnd(22, 55) / difficulty;
    }
  }

  // Player auto-movement (slow drift, wraps)
  const speed = (input.isPressed ? 1.8 : 1) * sqrt(difficulty);
  player.pos.x += 0.2 * speed;
  if (player.pos.x > 100) player.pos.x = 0;
  player.pos.y += sin(ticks * 0.02 * speed) * 0.1;
  player.pos.y = clamp(player.pos.y, 5, 95);

  // Breathing animation (squash & stretch)
  player.breathPhase += 0.08;
  let breathScale = 1 + sin(player.breathPhase) * 0.05;

  // Add player trail
  if (ticks % 3 === 0) {
    trails.push({
      x: player.pos.x,
      y: player.pos.y,
      size: player.size * 0.7,
      alpha: 0.5,
      type: "player",
    });
  }

  // Input: Hold to charge (grow bigger = more vulnerable but bigger blast)
  if (input.isPressed) {
    charge = min(charge + difficulty, 60);
    player.size = player.baseSize + charge * 0.15;
    breathScale = 1 + sin(ticks * 0.3) * 0.1; // Faster pulse when charging

    // Charge particles (energy gathering)
    if (ticks % 4 === 0) {
      let angle = rnd(PI * 2);
      let dist = player.size + 10 + rnd(5);
      starDust.push({
        pos: vec(
          player.pos.x + cos(angle) * dist,
          player.pos.y + sin(angle) * dist,
        ),
        vel: vec(cos(angle + PI) * 0.8, sin(angle + PI) * 0.8),
        life: 15,
        color: "yellow",
        size: rnd(1, 2),
      });
    }
  }

  // Input: Release to blast
  if (input.isJustReleased && charge > 10) {
    play("explosion");
    explosion.active = true;
    explosion.pos = vec(player.pos.x, player.pos.y);
    explosion.radius = 15 + charge * 0.8;
    explosion.timer = 12;

    // Explosion particles (starburst)
    for (let i = 0; i < 16; i++) {
      let angle = (PI * 2 * i) / 16 + rnd(-0.2, 0.2);
      let spd = rnd(1.5, 3);
      starDust.push({
        pos: vec(player.pos.x, player.pos.y),
        vel: vec(cos(angle) * spd, sin(angle) * spd),
        life: rnd(20, 35),
        color: "light_yellow",
        size: rnd(1, 3),
      });
    }

    charge = 0;
    player.size = player.baseSize;
    destroyedCount = 0;
  }

  // Decay charge if not holding
  if (!input.isPressed && charge > 0) {
    charge = max(0, charge - 2);
    player.size = player.baseSize + charge * 0.15;
  }

  // Update explosion
  if (explosion.active) {
    explosion.timer--;
    if (explosion.timer <= 0) {
      explosion.active = false;
    }
  }

  // Update asteroids with rotation
  asteroids = asteroids.filter((ast) => {
    ast.pos.x += ast.vel.x;
    ast.pos.y += ast.vel.y;
    ast.rotation += ast.rotSpeed;

    // Asteroid trails (comet-like)
    if (ticks % 5 === 0) {
      trails.push({
        x: ast.pos.x,
        y: ast.pos.y,
        size: ast.size * 0.4,
        alpha: 0.3,
        type: "asteroid",
      });
    }

    return (
      ast.pos.x > -10 && ast.pos.x < 110 && ast.pos.y > -10 && ast.pos.y < 110
    );
  });

  // Draw trails (afterimages)
  trails.forEach((t) => {
    if (t.type === "player") {
      color("light_cyan");
    } else {
      color("light_red");
    }
    let a = floor(t.alpha * 3);
    if (a > 0) {
      arc(t.x, t.y, t.size, a);
    }
  });

  // Draw star dust particles
  starDust.forEach((p) => {
    color(p.color);
    let thickness = ceil(p.life / 10);
    box(p.pos, p.size, p.size);
  });

  // Draw explosion and check asteroid destruction
  if (explosion.active) {
    checkExplosion(
      explosion.pos.x,
      explosion.pos.y,
      explosion.radius,
      explosion.timer,
    );
    checkExplosion(
      explosion.pos.x - 100,
      explosion.pos.y,
      explosion.radius,
      explosion.timer,
    );
  }

  // Draw charge indicator (pulsing ring)
  if (charge > 0) {
    color("yellow");
    let pulseSize = player.size + 2 + sin(ticks * 0.4) * 1.5;
    arc(player.pos, pulseSize, 1);
  }

  // Draw player with breathing (squash & stretch using arc)
  color("cyan");
  let drawSize = player.size * breathScale;
  arc(player.pos, drawSize);

  // Inner glow when charged
  if (charge > 20) {
    color("light_cyan");
    arc(player.pos, drawSize * 0.5);
  }

  // Draw asteroids with rotation and check collision
  color("red");
  asteroids.forEach((ast) => {
    // Draw rotating asteroid using bar
    let len = ast.size * 0.8;
    bar(ast.pos, len, ast.size * 0.6, ast.rotation);
    bar(ast.pos, len, ast.size * 0.6, ast.rotation + PI / 2);

    let dist = player.pos.distanceTo(ast.pos);
    if (dist < player.size + ast.size / 2) {
      // Death particles
      for (let i = 0; i < 12; i++) {
        let angle = (PI * 2 * i) / 12;
        starDust.push({
          pos: vec(player.pos.x, player.pos.y),
          vel: vec(cos(angle) * 2, sin(angle) * 2),
          life: 20,
          color: "cyan",
          size: 2,
        });
      }
      play("hit");
      end();
    }
  });
}

function checkExplosion(x, y, radius, timer) {
  // Animated explosion ring
  let phase = 1 - timer / 12;
  let ringRadius = radius * (0.3 + phase * 0.7);

  color("light_yellow");
  arc(x, y, ringRadius, 3 - floor(phase * 2));

  // Inner bright core
  if (timer > 6) {
    color("white");
    arc(x, y, ringRadius * 0.4);
  }

  asteroids = asteroids.filter((ast) => {
    let dist = ast.pos.distanceTo(x, y);
    if (dist < radius + ast.size / 2) {
      // Destruction particles (debris scatter)
      for (let i = 0; i < 8; i++) {
        let angle = rnd(PI * 2);
        let spd = rnd(1, 2.5);
        starDust.push({
          pos: vec(ast.pos.x, ast.pos.y),
          vel: vec(cos(angle) * spd, sin(angle) * spd),
          life: rnd(15, 25),
          color: rnd() > 0.5 ? "red" : "light_red",
          size: rnd(1, 3),
        });
      }

      destroyedCount++;
      addScore(destroyedCount * destroyedCount, ast.pos);
      play("powerUp");
      return false;
    }
    return true;
  });
}
