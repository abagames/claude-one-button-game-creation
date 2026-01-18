title = "CLING HOP";

description = `
[Tap] Flap
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 3,
};

let player;
let platforms;
let obstacles;
let nextObstacleTicks;
let clingTarget;
let lastPlatformId;
let trail;
let prevX;
let wasClinging;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 50), vy: 0, vx: 0 };
    platforms = [];
    obstacles = [];
    nextObstacleTicks = 0;
    clingTarget = null;
    lastPlatformId = -1;
    trail = [];
    prevX = 50;
    wasClinging = false;
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
  nextObstacleTicks--;
  if (nextObstacleTicks < 0 || obstacles.length === 0) {
    let side = player.pos.x > 50;
    obstacles.push({
      pos: vec(side ? -5 : 105, rnd(20, 60)),
      vx: (side ? 1 : -1) * rnd(0.5, 1.2) * spd,
      vy: rnd(-1, 1) * spd,
      spin: 0,
      squashX: 1,
      squashY: 1,
      trail: [],
    });
    nextObstacleTicks = 180 / spd;
  }

  // Store previous position for trail and velocity calculation
  let oldX = player.pos.x;

  // Player physics
  if (clingTarget === null) {
    player.vy += 0.12;
    if (input.isJustPressed) {
      player.vy = -2.2;
      play("jump");
      // Jump particle effect
      color("yellow");
      particle(player.pos, {
        count: 8,
        speed: 1.5,
        angle: PI / 2,
        angleWidth: PI / 3,
      });
    }
    player.pos.y += player.vy;
    player.pos.x = clamp(player.pos.x, 5, 95);
  } else {
    // Clinging to platform - move with it
    let plat = platforms.find((p) => p.id === clingTarget);
    if (plat) {
      player.pos.x = clamp(
        plat.pos.x + sin(ticks * 0.05 + plat.phase) * 20,
        5,
        95,
      );
      player.pos.y = plat.pos.y + 7;
      // Landing particle effect (only on first cling frame)
      if (!wasClinging) {
        color("cyan");
        particle(player.pos, {
          count: 12,
          speed: 2,
          angle: -PI / 2,
          angleWidth: PI / 2,
        });
      }
      player.vy = 0;
      addScore(1);
      if (input.isJustPressed) {
        clingTarget = null;
        player.vy = -2.5;
        play("jump");
        color("yellow");
        particle(player.pos, {
          count: 8,
          speed: 1.5,
          angle: PI / 2,
          angleWidth: PI / 3,
        });
      }
    } else {
      clingTarget = null;
    }
  }

  // Calculate horizontal velocity for tilt
  player.vx = player.pos.x - oldX;
  wasClinging = clingTarget !== null;

  // Update trail (store positions for afterimage)
  trail.unshift({ x: player.pos.x, y: player.pos.y, vy: player.vy });
  if (trail.length > 5) trail.pop();

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
          addScore(obstacles.length);
          lastPlatformId = plat.id;
          play("coin");
        }
      }
    }

    return plat.pos.y < 110;
  });

  // Draw trail (afterimages) - fading copies behind player
  color("light_yellow");
  for (let i = trail.length - 1; i >= 1; i--) {
    let t = trail[i];
    let alpha = (trail.length - i) / trail.length;
    let size = 3 * alpha;
    box(t.x, t.y, size);
  }

  // Calculate squash & stretch and rotation
  let scaleX = 1;
  let scaleY = 1;
  let tilt = 0;
  if (clingTarget !== null) {
    // Clinging: flat/wide shape + breathing, no rotation
    let breath = sin(ticks * 0.1) * 0.08;
    scaleX = 1.4 + breath;
    scaleY = 0.75 - breath;
    tilt = 0;
  } else {
    // In air: spin based on vertical velocity (attacking spin)
    tilt = ticks * 15 * (player.vy < 0 ? 1 : 0.5);
    if (abs(player.vy) > 1.5) {
      // Fast movement: more square for spinning
      scaleX = 1;
      scaleY = 1;
    } else {
      // Slow/transitioning: slight stretch in movement direction
      scaleX = 1 + abs(player.vx) * 0.1;
      scaleY = 1 - abs(player.vy) * 0.05;
    }
  }

  // Draw player with squash/stretch and tilt
  color(clingTarget != null ? "cyan" : "yellow");
  let pw = 5 * scaleX;
  let ph = 7 * scaleY;
  let px = player.pos.x;
  let py = player.pos.y;

  // Draw tilted body using bar (supports rotation)
  bar(vec(px, py), pw, ph, tilt);

  // Draw eyes (only when clinging - spinning hides them)
  if (clingTarget !== null) {
    let eyeOffsetX = (1.8 * scaleX) / 1.4;
    let eyeOffsetY = -0.3;
    // Eyes look in movement direction
    let lookX = clamp(player.vx * 2, -1, 1);

    // White of eyes (wider apart for flat body)
    color("white");
    box(px - eyeOffsetX, py + eyeOffsetY, 2, 1.5);
    box(px + eyeOffsetX, py + eyeOffsetY, 2, 1.5);

    // Pupils
    color("black");
    box(px - eyeOffsetX + lookX * 0.5, py + eyeOffsetY, 1);
    box(px + eyeOffsetX + lookX * 0.5, py + eyeOffsetY, 1);
  }

  // Draw and update obstacles - check collision with player
  remove(obstacles, (obs) => {
    obs.pos.x += obs.vx;
    obs.pos.y += obs.vy;

    // Update trail
    obs.trail.unshift({ x: obs.pos.x, y: obs.pos.y });
    if (obs.trail.length > 4) obs.trail.pop();

    // Spin based on velocity
    obs.spin += (abs(obs.vx) + abs(obs.vy)) * 0.1;

    // Recover squash back to normal
    obs.squashX += (1 - obs.squashX) * 0.2;
    obs.squashY += (1 - obs.squashY) * 0.2;

    // Bounce off walls with squash effect
    color("red");
    if (obs.pos.x < 3 || obs.pos.x > 97) {
      obs.vx *= -1;
      obs.pos.x = clamp(obs.pos.x, 3, 97);
      obs.squashX = 0.5;
      obs.squashY = 1.4;
      particle(obs.pos, { count: 5, speed: 1 });
    }
    if (obs.pos.y < 3 || obs.pos.y > 97) {
      obs.vy *= -1;
      obs.pos.y = clamp(obs.pos.y, 3, 97);
      obs.squashX = 1.4;
      obs.squashY = 0.5;
      particle(obs.pos, { count: 5, speed: 1 });
    }

    // Draw trail
    color("light_red");
    for (let i = obs.trail.length - 1; i >= 1; i--) {
      let t = obs.trail[i];
      let size = (3 * (obs.trail.length - i)) / obs.trail.length;
      box(t.x, t.y, size);
    }

    // Draw obstacle body with squash and spin
    color("red");
    let ow = 5 * obs.squashX;
    let oh = 4 * obs.squashY;
    let obsCol = bar(obs.pos, ow, oh, obs.spin).isColliding.rect;

    // Draw eyes
    let lookX = obs.vx > 0 ? 1 : -1;
    let lookY = clamp(obs.vy * 0.5, -1, 1);
    color("white");
    box(obs.pos.x - 1.2, obs.pos.y - 0.5, 1.5);
    box(obs.pos.x + 1.2, obs.pos.y - 0.5, 1.5);
    color("black");
    box(obs.pos.x - 1.2 + lookX * 0.3, obs.pos.y - 0.5 + lookY * 0.3, 0.8);
    box(obs.pos.x + 1.2 + lookX * 0.3, obs.pos.y - 0.5 + lookY * 0.3, 0.8);

    if (obsCol.cyan) {
      play("explosion");
      end();
    } else if (obsCol.yellow) {
      play("powerUp");
      color("red");
      particle(obs.pos, { count: 20, speed: 3 });
      return true;
    }
  });
  color("black");
  text(`x${obstacles.length}`, 3, 9, { isSmallText: true });
}
