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

function update() {
  if (!ticks) {
    player = { x: 50, y: 70, vx: 1, vy: 0, grounded: false };
    platforms = [];
    enemies = [];
    nextEnemyDist = 100;
    debris = [];
    lavaY = 102;
    combo = 0;
    jumpCount = 0;
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
    }
  });

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

  // Player
  color("cyan");
  box(player.x, player.y, 6);

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

  // Enemies
  color("red");
  enemies = enemies.filter((e) => {
    let c = box(e.x, e.y, 7);
    if (c.isColliding.rect.cyan) {
      if (player.vy > 0.5 && player.y < e.y - 2) {
        player.vy = -2.2;
        combo++;
        addScore(8 + combo * 4);
        play("powerUp");
        return false;
      } else {
        play("hit");
        end();
      }
    }
    return true;
  });

  // Debris
  color("purple");
  debris = debris.filter((d) => {
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
      particle(d.x, d.y, 3, 0.4);
      return false;
    }
    let c = box(d.x, d.y, 4);
    if (c.isColliding.rect.cyan) {
      play("hit");
      end();
    }
    return true;
  });
}
