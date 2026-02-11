# crisp-game-lib Game Examples

## One-Button Jumper

Mobile-friendly tap-to-jump game with obstacle avoidance.

```javascript
title = "JUMP HERO";

description = `
[Tap] Jump
`;

let player, obstacles, ground;

function update() {
  if (!ticks) {
    player = { pos: vec(30, 80), vy: 0, onGround: false };
    obstacles = [];
    ground = 85;
  }

  // Spawn obstacles
  if (ticks % 120 === 0) {
    obstacles.push({ pos: vec(120, ground - 10), width: 8, isPassed: false });
  }

  // Player physics
  if (input.isJustPressed && player.onGround) {
    player.vy = -4;
    play("jump");
  }

  player.vy += 0.15;
  player.pos.y += player.vy;

  // Ground collision
  if (player.pos.y >= ground - 4) {
    player.pos.y = ground - 4;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // Update obstacles
  remove(obstacles, (obs) => {
    obs.pos.x -= difficulty * 0.5;

    color("red");
    box(obs.pos, obs.width, 20);

    if (obs.pos.x < player.pos.x && !obs.isPassed) {
      addScore(10);
      obs.isPassed = true;
      play("coin");
    }

    return obs.pos.x <= -20;
  });

  // Draw player and check collision
  color("blue");
  if (box(player.pos, 8).isColliding.rect.red) {
    end();
  }

  // Draw ground
  color("green");
  rect(0, ground, 100, 100 - ground);
}
```

## Top-Down Shooter

Pointer-controlled shooter with auto-fire and enemy waves.

```javascript
title = "SPACE BLAST";

description = `
[Mouse / Slide] Move
`;

options = { viewSize: { x: 200, y: 150 } };

let player, enemies, bullets;

function update() {
  if (!ticks) {
    player = { pos: vec(100, 120) };
    enemies = [];
    bullets = [];
  }

  // Player follows pointer
  player.pos = vec(input.pos.x, input.pos.y);
  player.pos.clamp(8, 192, 8, 142);

  // Auto-shoot
  if (ticks % 8 === 0) {
    bullets.push({
      pos: vec(player.pos.x, player.pos.y - 10),
      vy: -4,
    });
    play("select");
  }

  // Spawn enemies
  if (ticks % 45 === 0) {
    enemies.push({
      pos: vec(rnd(180) + 10, -10),
      vy: rnd(1, 3),
    });
  }

  // Draw player first (so enemies can detect collision)
  color("blue");
  box(player.pos, 10);

  // Update bullets
  remove(bullets, (bullet) => {
    bullet.pos.y += bullet.vy;
    color("yellow");
    box(bullet.pos, 3);
    return bullet.pos.y <= -5;
  });

  // Update enemies
  remove(enemies, (enemy) => {
    enemy.pos.y += enemy.vy;

    color("red");
    let enemyHit = box(enemy.pos, 12);

    if (enemyHit.isColliding.rect.yellow) {
      addScore(100, enemy.pos);
      particle(enemy.pos, { count: 10, speed: 2, angle: PI });
      play("powerUp");
      return true;
    }

    if (enemyHit.isColliding.rect.blue) {
      end();
    }

    return enemy.pos.y >= 160;
  });
}
```

## Dodge Game

Simple avoider using slide controls.

```javascript
title = "DODGE";

description = `
[Slide] Move
`;

let player, falling;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 90) };
    falling = [];
  }

  // Slide control
  player.pos.x = input.pos.x;
  player.pos.clamp(5, 95, 90, 90);

  // Spawn falling objects
  if (ticks % floor(40 / difficulty) === 0) {
    falling.push({ pos: vec(rnd(90) + 5, -5), speed: rnd(0.5, 1.5) });
  }

  // Score over time
  if (ticks % 30 === 0) {
    addScore(1);
  }

  // Update falling objects
  remove(falling, (f) => {
    f.pos.y += f.speed * difficulty;
    color("red");
    box(f.pos, 6);
    return f.pos.y > 105;
  });

  // Draw player and check collision
  color("blue");
  if (box(player.pos, 8).isColliding.rect.red) {
    end();
  }
}
```

## Collector Game

Collect items while avoiding hazards, with character animation.

```javascript
title = "COLLECT";

description = `
[Slide] Move
`;

characters = [
  `
  ll
 llll
llllll
  ll
 l  l
l    l
`,
  `
  ll
 llll
llllll
  ll
  ll
 l  l
`,
];

let player, items, hazards;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 80) };
    items = [];
    hazards = [];
  }

  player.pos.x = input.pos.x;
  player.pos.clamp(5, 95, 80, 80);

  // Spawn items
  if (ticks % floor(60 / difficulty) === 0) {
    items.push({ pos: vec(rnd(90) + 5, -5) });
  }

  // Spawn hazards
  if (ticks % floor(90 / difficulty) === 0) {
    hazards.push({ pos: vec(rnd(90) + 5, -5) });
  }

  // Draw animated player first
  color("blue");
  let playerChar = addWithCharCode("a", floor(ticks / 15) % 2);
  char(playerChar, player.pos);

  // Draw items after player, and detect collision against player char
  color("yellow");
  remove(items, (item) => {
    item.pos.y += 1;
    let ic = box(item.pos, 6);
    if (ic.isColliding.char.a || ic.isColliding.char.b) {
      addScore(10, player.pos);
      play("coin");
      return true;
    }
    return item.pos.y > 105;
  });

  // Draw hazards after player, and detect collision against player char
  color("red");
  remove(hazards, (h) => {
    h.pos.y += 1.5;
    let hc = box(h.pos, 5);
    if (hc.isColliding.char.a || hc.isColliding.char.b) {
      end();
    }
    return h.pos.y > 105;
  });
}
```

## Patterns Summary

| Pattern    | Key Technique                                         |
| ---------- | ----------------------------------------------------- |
| Jumper     | `input.isJustPressed` + gravity (`vy += 0.15`)        |
| Shooter    | `input.pos` tracking + auto-fire (`ticks % N`)        |
| Dodger     | `player.pos.x = input.pos.x` + falling spawns         |
| Collector  | Color-based collision to distinguish items vs hazards |
| Animation  | `addWithCharCode("a", floor(ticks / N) % frameCount)` |
| Difficulty | `floor(interval / difficulty)` for spawn rate scaling |
