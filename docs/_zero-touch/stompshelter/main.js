title = "STOMPSHELTER";

description = `
[Tap] Jump
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let player;
let platforms;
let enemies;
let debris;
let lavaY;
let combo;
let jumpCount;

function update() {
  if (!ticks) {
    player = { x: 50, y: 70, vy: 0, grounded: false };
    platforms = [];
    enemies = [];
    debris = [];
    lavaY = 102;
    combo = 0;
    jumpCount = 0;
    for (let i = 0; i < 6; i++) {
      platforms.push({ x: rnd(10, 55), y: 15 + i * 15, w: rnd(25, 38), hp: 120 });
    }
  }

  // Lava rises faster
  lavaY -= 0.025 + 0.01 * sqrt(difficulty);

  // Spawn new platforms
  let topY = 999;
  platforms.forEach((p) => { if (p.y < topY) topY = p.y; });
  if (topY > 5) {
    platforms.push({ x: rnd(10, 55), y: topY - rnd(13, 17), w: rnd(25, 38), hp: 120 });
  }

  // Spawn enemies
  if (ticks % 100 === 0 && enemies.length < 2 + floor(difficulty * 0.5)) {
    let vp = platforms.filter((p) => p.y > 10 && p.y < 80 && p.hp > 60);
    if (vp.length > 0) {
      let p = vp[floor(rnd(vp.length))];
      enemies.push({ x: p.x + p.w / 2, y: p.y - 5, dir: rndi(2) * 2 - 1, py: p.y });
    }
  }

  // Spawn debris
  if (ticks % floor(70 / sqrt(difficulty)) === 0) {
    debris.push({ x: rnd(8, 92), y: -4, speed: 1 + rnd(0.5 * difficulty) });
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
  player.x += (50 - player.x) * 0.01;
  player.x = clamp(player.x, 6, 94);

  // Platform collision + crumbling
  player.grounded = false;
  platforms.forEach((p) => {
    if (player.vy > 0 && p.hp > 0 &&
        player.x > p.x - 3 && player.x < p.x + p.w + 3 &&
        player.y > p.y - 8 && player.y < p.y + 2) {
      player.y = p.y - 4;
      player.vy = 0;
      player.grounded = true;
      jumpCount = 0;
      combo = 0;
      // Platform crumbles when standing
      p.hp -= 2;
    }
  });

  // Sheltered (platform above)
  let sheltered = false;
  platforms.forEach((p) => {
    if (p.hp > 0 && player.x > p.x - 2 && player.x < p.x + p.w + 2 &&
        player.y > p.y + 4 && player.y < p.y + 22) {
      sheltered = true;
    }
  });

  // Scroll
  if (player.y < 35) {
    let scroll = 35 - player.y;
    player.y = 35;
    lavaY += scroll;
    platforms.forEach((p) => { p.y += scroll; });
    enemies.forEach((e) => { e.y += scroll; e.py += scroll; });
    debris.forEach((d) => { d.y += scroll; });
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
  debris.forEach((d) => { d.y += d.speed; });

  // === DRAW ===

  // Player
  color("cyan");
  box(player.x, player.y, 6);

  // Lava
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
      if (p.hp > 0 && d.x > p.x && d.x < p.x + p.w && d.y > p.y - 2 && d.y < p.y + 5) {
        blocked = true;
        p.hp -= 15; // Debris damages platforms
      }
    });
    if (blocked) {
      particle(d.x, d.y, 3, 0.4);
      return false;
    }
    let c = box(d.x, d.y, 4);
    if (c.isColliding.rect.cyan && !sheltered) {
      play("hit");
      end();
    }
    return true;
  });

  // Shelter indicator
  if (sheltered) {
    color("light_green");
    text("*", player.x, player.y - 8);
  }
}
