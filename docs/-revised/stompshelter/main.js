title = "STOMPSHELTER";

description = `
[Tap] Double Jump
[Hold] Slide
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let player;
let platforms;
let enemies;
let nextEnemyDist;
let debris;
let lavaY;
let combo;
let jumpCount;
let playerTrail;
let wasGrounded;

function update() {
  if (!ticks) {
    player = {
      x: 50,
      y: 70,
      vx: 1,
      vy: 0,
      grounded: false,
      scaleX: 1,
      scaleY: 1,
    };
    platforms = [];
    enemies = [];
    nextEnemyDist = 100;
    debris = [];
    lavaY = 102;
    combo = 0;
    jumpCount = 0;
    playerTrail = [];
    wasGrounded = false;
    for (let i = 0; i < 6; i++) {
      platforms.push({
        x: rnd(20, 60),
        y: 15 + i * 15,
        w: rnd(25, 38),
        hp: 120,
      });
    }
  }

  // Lava rises
  lavaY -= 0.025;

  // Spawn new platforms
  let topY = 999;
  platforms.forEach((p) => {
    if (p.y < topY) topY = p.y;
  });
  if (topY > 5) {
    platforms.push({
      x: rnd(10, 55),
      y: topY - rnd(13, 17),
      w: rnd(25, 38),
      hp: 120,
    });
  }

  // Spawn enemies
  if (nextEnemyDist < 0) {
    let vp = platforms.filter((p) => p.y < 20 && p.hp > 60);
    if (vp.length > 0) {
      let p = vp[floor(rnd(vp.length))];
      enemies.push({
        x: p.x + p.w / 2,
        y: p.y - 5,
        dir: rndi(2) * 2 - 1,
        py: p.y,
      });
      nextEnemyDist = rnd(100, 200) / sqrt(difficulty);
    }
  }

  // Spawn debris
  if (ticks % floor(70 / difficulty) === 0) {
    debris.push({ x: rnd(8, 92), y: -4, speed: 0.5 });
  }

  // Jump
  if (input.isJustPressed && (player.grounded || jumpCount < 2)) {
    player.vy = -2.6;
    player.grounded = false;
    jumpCount++;
    play("jump");
    // Squash & Stretch: stretch vertically on jump
    player.scaleX = 0.7;
    player.scaleY = 1.4;
    // Particle effect on jump
    color("cyan");
    particle(player.x, player.y + 3, 5, 1, -PI / 2, PI / 4);
  }

  // Physics
  player.vy += 0.1;
  player.y += player.vy;

  // Slight horizontal drift
  player.x += player.vx * (input.isPressed ? 1 : 0.1);
  if ((player.x > 90 && player.vx > 0) || (player.x < 10 && player.vx < 0)) {
    player.vx *= -1;
  }

  // Platform collision + crumbling
  player.grounded = false;
  platforms.forEach((p) => {
    if (
      player.vy > 0 &&
      p.hp > 0 &&
      player.x > p.x - 3 &&
      player.x < p.x + p.w + 3 &&
      player.y > p.y - 8 &&
      player.y < p.y + 2
    ) {
      player.y = p.y - 4;
      player.vy = 0;
      player.grounded = true;
      jumpCount = 0;
      combo = 0;
      // Platform crumbles when standing
      p.hp -= 1;
      // Landing effect
      if (!wasGrounded) {
        player.scaleX = 1.4;
        player.scaleY = 0.6;
        color("cyan");
        particle(player.x, player.y + 3, 4, 0.8, PI / 2, PI / 3);
      }
    }
  });
  wasGrounded = player.grounded;

  // Scroll
  if (player.y < 60) {
    let scroll = 60 - player.y;
    player.y = 60;
    lavaY += scroll;
    nextEnemyDist -= scroll;
    platforms.forEach((p) => {
      p.y += scroll;
    });
    enemies.forEach((e) => {
      e.y += scroll;
      e.py += scroll;
    });
    debris.forEach((d) => {
      d.y += scroll;
    });
    playerTrail.forEach((t) => {
      t.y += scroll;
    });
    addScore(floor(scroll));
  }

  // Remove off-screen / dead platforms
  platforms = platforms.filter((p) => p.y < 110 && p.hp > 0);
  enemies = enemies.filter((e) => e.y < 105);
  debris = debris.filter((d) => d.y < 105);

  // Enemy movement
  enemies.forEach((e) => {
    e.x += e.dir * 0.35;
    platforms.forEach((p) => {
      if (p.hp > 0 && abs(e.py - p.y) < 2) {
        if (e.x <= p.x + 2) e.dir = 1;
        if (e.x >= p.x + p.w - 2) e.dir = -1;
      }
    });
  });

  // Debris
  debris.forEach((d) => {
    d.y += d.speed;
  });

  // === DRAW ===

  // Squash/Stretch interpolation (return to normal)
  player.scaleX += (1 - player.scaleX) * 0.15;
  player.scaleY += (1 - player.scaleY) * 0.15;

  // Idle breathing when grounded
  if (player.grounded && abs(player.scaleX - 1) < 0.05) {
    let breath = sin(ticks * 0.1) * 0.05;
    player.scaleX = 1 + breath;
    player.scaleY = 1 - breath;
  }

  // Trail management
  if (abs(player.vy) > 1 || abs(player.vx) > 0.5) {
    playerTrail.push({ x: player.x, y: player.y, life: 8 });
  }
  playerTrail = playerTrail.filter((t) => {
    t.life--;
    return t.life > 0;
  });

  // Draw trail (afterimage)
  playerTrail.forEach((t) => {
    color("light_cyan");
    let alpha = t.life / 8;
    box(t.x, t.y, 4 * alpha);
  });

  // Player with squash/stretch and tilt
  color("cyan");
  let tilt = player.vx * 0.15;
  let pw = 6 * player.scaleX;
  let ph = 6 * player.scaleY;
  bar(player.x, player.y, ph / 2, pw, -PI / 2 + tilt);

  // Player eyes
  color("white");
  let eyeOffX = player.vx > 0 ? 1 : -1;
  let eyeOffY = player.vy > 0 ? 1 : player.vy < -1 ? -1 : 0;
  box(player.x - 1.2, player.y - 1, 2, 2);
  box(player.x + 1.2, player.y - 1, 2, 2);
  color("black");
  box(player.x - 1.2 + eyeOffX * 0.4, player.y - 1 + eyeOffY * 0.3, 1, 1);
  box(player.x + 1.2 + eyeOffX * 0.4, player.y - 1 + eyeOffY * 0.3, 1, 1);

  // Lava
  if (lavaY > 100) lavaY += (100 - lavaY) * 0.5;
  color("yellow");
  rect(0, lavaY, 100, 120 - lavaY);
  if (player.y > lavaY - 3) {
    play("explosion");
    end();
  }

  // Platforms (with crumble visual)
  platforms.forEach((p) => {
    if (p.hp > 80) color("black");
    else if (p.hp > 40) color("blue");
    else color("light_red");
    rect(p.x, p.y, p.w, 4);
  });

  // Enemies with eyes and rotation
  enemies = enemies.filter((e) => {
    // Collision check first (body)
    color("red");
    let c = box(e.x, e.y, 7);

    // Tilt overlay with bar
    let eTilt = e.dir * 0.2;
    bar(e.x, e.y, 3.5, 7, -PI / 2 + eTilt);

    // Enemy eyes looking toward player (drawn last to be visible)
    color("white");
    let lookX = player.x > e.x ? 1 : -1;
    let lookY = player.y > e.y ? 1 : player.y < e.y - 5 ? -1 : 0;
    box(e.x - 1.5, e.y - 1, 2.5, 2.5);
    box(e.x + 1.5, e.y - 1, 2.5, 2.5);
    color("black");
    box(e.x - 1.5 + lookX * 0.5, e.y - 1 + lookY * 0.4, 1.2, 1.2);
    box(e.x + 1.5 + lookX * 0.5, e.y - 1 + lookY * 0.4, 1.2, 1.2);

    if (c.isColliding.rect.cyan) {
      if (player.vy > 0.5 && player.y < e.y - 2) {
        player.vy = -2.2;
        combo++;
        addScore(8 + combo * 4);
        play("powerUp");
        // Stomp particle effect
        color("red");
        particle(e.x, e.y, 10, 2);
        return false;
      } else {
        play("hit");
        end();
      }
    }
    return true;
  });

  // Debris with trail
  debris = debris.filter((d) => {
    // Trail effect for falling debris
    color("light_purple");
    box(d.x, d.y - 3, 2);
    box(d.x, d.y - 6, 1);

    let blocked = false;
    platforms.forEach((p) => {
      if (
        p.hp > 0 &&
        d.x > p.x &&
        d.x < p.x + p.w &&
        d.y > p.y - 2 &&
        d.y < p.y + 5
      ) {
        blocked = true;
        p.hp -= 15; // Debris damages platforms
      }
    });
    if (blocked) {
      color("purple");
      particle(d.x, d.y, 6, 1);
      return false;
    }
    color("purple");
    let c = box(d.x, d.y, 4);
    if (c.isColliding.rect.cyan) {
      play("hit");
      end();
    }
    return true;
  });
}
