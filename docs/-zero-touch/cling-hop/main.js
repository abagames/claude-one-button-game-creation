title = "CLING HOP";

description = `
[Tap] Flap
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 3,
};

let player;
let platforms;
let obstacles;
let clingTarget;
let lastPlatformId;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 50), vy: 0 };
    platforms = [];
    obstacles = [];
    clingTarget = null;
    lastPlatformId = -1;
  }

  let spd = sqrt(difficulty);

  // Spawn platforms
  if (ticks % floor(90 / spd) === 0) {
    let w = rnd(15, 30) / sqrt(difficulty);
    platforms.push({
      id: ticks,
      pos: vec(rnd(20, 80), -5),
      w: w,
      vx: rnd(-0.3, 0.3) * spd,
      phase: rnd(PI * 2),
    });
  }

  // Spawn bouncing obstacles
  if (ticks % floor(180 / spd) === 0 && difficulty > 0.5) {
    let side = rnd() < 0.5;
    obstacles.push({
      pos: vec(side ? -5 : 105, rnd(20, 60)),
      vx: (side ? 1 : -1) * rnd(0.5, 1.5) * spd,
      vy: rnd(-1, 1) * spd,
    });
  }

  // Player physics
  if (clingTarget === null) {
    player.vy += 0.12;
    if (input.isJustPressed) {
      player.vy = -2.2;
      play("jump");
    }
    player.pos.y += player.vy;
    player.pos.x = clamp(player.pos.x, 5, 95);
  } else {
    // Clinging to platform - move with it
    let plat = platforms.find((p) => p.id === clingTarget);
    if (plat) {
      player.pos.x = clamp(plat.pos.x + sin(ticks * 0.05 + plat.phase) * 20, 5, 95);
      player.pos.y = plat.pos.y + 7;
      player.vy = 0;
      addScore(1);
      if (input.isJustPressed) {
        clingTarget = null;
        player.vy = -2.5;
        play("jump");
      }
    } else {
      clingTarget = null;
    }
  }

  // Fall off screen = game over
  if (player.pos.y > 105) {
    play("explosion");
    end();
  }

  // Draw and update platforms
  color("green");
  platforms = platforms.filter((plat) => {
    plat.pos.y += 0.3 * spd;
    let drawX = plat.pos.x + sin(ticks * 0.05 + plat.phase) * 20;
    drawX = clamp(drawX, plat.w / 2 + 2, 98 - plat.w / 2);
    bar(vec(drawX, plat.pos.y), plat.w, 4, 0);

    // Check if player can cling (falling onto platform)
    if (clingTarget === null && player.vy > 0) {
      let dx = abs(player.pos.x - drawX);
      let dy = player.pos.y - plat.pos.y;
      if (dx < plat.w / 2 + 3 && dy > -3 && dy < 8) {
        clingTarget = plat.id;
        if (plat.id !== lastPlatformId) {
          addScore(10);
          lastPlatformId = plat.id;
          play("coin");
        }
      }
    }

    return plat.pos.y < 110;
  });

  // Draw player first for collision detection
  color("cyan");
  box(player.pos, 5);

  // Draw and update obstacles - check collision with player
  color("red");
  obstacles = obstacles.filter((obs) => {
    obs.pos.x += obs.vx;
    obs.pos.y += obs.vy;

    // Bounce off walls
    if (obs.pos.x < 3 || obs.pos.x > 97) {
      obs.vx *= -1;
      obs.pos.x = clamp(obs.pos.x, 3, 97);
    }
    if (obs.pos.y < 3 || obs.pos.y > 97) {
      obs.vy *= -1;
      obs.pos.y = clamp(obs.pos.y, 3, 97);
    }

    let obsCol = box(obs.pos, 6);
    if (obsCol.isColliding.rect.cyan) {
      play("explosion");
      particle(player.pos, { count: 20, speed: 3 });
      end();
    }

    return ticks < 3600;
  });
}
