title = "INKINH";

description = `
[Hold] Thrust & Inhale
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 0,
};

let player;
let orbs;
let obstacles;
let combo;
let comboTimer;
let trails;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 80), vel: vec(0, 0), angle: -PI / 2, stretch: 1 };
    orbs = [];
    obstacles = [];
    trails = [];
    combo = 0;
    comboTimer = 0;
  }

  comboTimer--;
  if (comboTimer <= 0) {
    combo = 0;
  }

  let spawnRate = floor(72 / sqrt(difficulty));

  if (ticks % spawnRate === 0) {
    let ox = rnd(10, 90);
    let speed = 0.5 * sqrt(difficulty);
    obstacles.push({
      pos: vec(ox, -8),
      vel: vec(rnd(-0.2, 0.2), speed),
      rot: 0,
      rotSpeed: rnd(-0.1, 0.1),
    });
  }

  let orbRate = 30;
  if (ticks % orbRate === 0 && orbs.length < 8) {
    let pos;
    for (let i = 0; i < 9; i++) {
      pos = vec(rnd(15, 85), rnd(20, 90));
      if (pos.distanceTo(player.pos) > 20) break;
    }
    orbs.push({ pos, timer: 300, phase: rnd(0, PI * 2) });
  }

  player.angle += (input.isPressed ? 0.02 : 0.05) * sqrt(difficulty);

  if (input.isPressed) {
    let thrust = 0.15;
    player.vel.x += cos(player.angle) * thrust;
    player.vel.y += sin(player.angle) * thrust;

    // Thrust particles
    if (ticks % 3 === 0) {
      color("light_black");
      let px = player.pos.x - cos(player.angle) * 5;
      let py = player.pos.y - sin(player.angle) * 5;
      particle(px, py, 3, 0.5, -player.angle, PI / 4);
    }

    orbs.forEach((o) => {
      let dx = player.pos.x - o.pos.x;
      let dy = player.pos.y - o.pos.y;
      let dist = sqrt(dx * dx + dy * dy);
      if (dist < 30 && dist > 0) {
        let pull = 0.6 / dist;
        o.pos.x += dx * pull;
        o.pos.y += dy * pull;
      }
    });
  }

  player.vel.x *= 0.96;
  player.vel.y *= 0.96;
  player.pos.add(vec(player.vel).mul(sqrt(difficulty)));

  player.pos.x = clamp(player.pos.x, 5, 95);
  player.pos.y = clamp(player.pos.y, 5, 95);

  // Calculate player speed for effects
  let speed = sqrt(player.vel.x * player.vel.x + player.vel.y * player.vel.y);

  // Squash & Stretch based on velocity
  let targetStretch = 1 + speed * 0.3;
  player.stretch += (targetStretch - player.stretch) * 0.2;

  // Trail effect for fast movement
  if (speed > 0.8 && ticks % 2 === 0) {
    trails.push({ pos: vec(player.pos), alpha: 1 });
  }

  // Draw trails first
  color("light_cyan");
  trails = trails.filter((t) => {
    t.alpha -= 0.15;
    if (t.alpha > 0) {
      box(t.pos, 4 * t.alpha);
      return true;
    }
    return false;
  });

  if (input.isPressed) {
    color("light_black");
    arc(player.pos, 15, 2, player.angle - 0.6, player.angle + 0.6);
  }

  // Draw player with squash & stretch
  color("cyan");
  let stretchX = 6 / player.stretch;
  let stretchY = 6 * player.stretch;
  box(player.pos, stretchX, stretchY);

  // Player eyes - look toward movement direction
  color("white");
  let eyeOffsetX = speed > 0.3 ? player.vel.x * 0.5 : 0;
  let eyeOffsetY = speed > 0.3 ? player.vel.y * 0.5 : 0;
  box(player.pos.x - 1.5 + eyeOffsetX, player.pos.y - 1 + eyeOffsetY, 2);
  box(player.pos.x + 1.5 + eyeOffsetX, player.pos.y - 1 + eyeOffsetY, 2);
  color("black");
  box(
    player.pos.x - 1.5 + eyeOffsetX * 1.5,
    player.pos.y - 1 + eyeOffsetY * 1.5,
    1,
  );
  box(
    player.pos.x + 1.5 + eyeOffsetX * 1.5,
    player.pos.y - 1 + eyeOffsetY * 1.5,
    1,
  );

  // Direction indicator
  let dirLen = 10;
  line(
    player.pos,
    vec(
      player.pos.x + cos(player.angle) * dirLen,
      player.pos.y + sin(player.angle) * dirLen,
    ),
    2,
  );

  // Draw orbs with breathing animation and eyes
  color("yellow");
  orbs = orbs.filter((o) => {
    o.timer--;
    o.phase += 0.1;
    let alpha = o.timer > 60 ? 1 : o.timer / 60;
    let breathe = 1 + sin(o.phase) * 0.15;
    let sz = (4 + alpha * 2) * breathe;
    let coll = box(o.pos, sz).isColliding.rect.cyan;

    // Orb eyes looking at player
    if (alpha > 0.3) {
      let toPlayer = vec(player.pos.x - o.pos.x, player.pos.y - o.pos.y);
      let eyeDir = toPlayer.length > 0 ? toPlayer.normalize() : vec(0, 0);
      color("white");
      box(o.pos.x + eyeDir.x * 0.5, o.pos.y + eyeDir.y * 0.5, 2);
      color("black");
      box(o.pos.x + eyeDir.x * 1, o.pos.y + eyeDir.y * 1, 1);
      color("yellow");
    }

    if (coll) {
      play("coin");
      // Collect particles
      color("yellow");
      particle(o.pos.x, o.pos.y, 8, 1.5);
      combo++;
      comboTimer = 60;
      addScore(combo);
      return false;
    }
    return o.timer > 0;
  });

  // Update and draw obstacles with rotation
  obstacles = obstacles.filter((o) => {
    o.pos.add(o.vel);
    o.rot += o.rotSpeed;
    return o.pos.y < 110;
  });

  color("red");
  obstacles.forEach((o) => {
    // Draw rotated obstacle using lines for diamond shape
    let sz = 3.5;
    let c = cos(o.rot);
    let s = sin(o.rot);
    let p1 = vec(o.pos.x + sz * c, o.pos.y + sz * s);
    let p2 = vec(o.pos.x - sz * s, o.pos.y + sz * c);
    let p3 = vec(o.pos.x - sz * c, o.pos.y - sz * s);
    let p4 = vec(o.pos.x + sz * s, o.pos.y - sz * c);
    line(p1, p2, 2);
    line(p2, p3, 2);
    line(p3, p4, 2);
    line(p4, p1, 2);

    if (box(o.pos, 7).isColliding.rect.cyan) {
      play("explosion");
      color("red");
      particle(o.pos.x, o.pos.y, 15, 2);
      end();
    }
  });

  if (combo > 1) {
    color("black");
    text(`x${combo}`, 3, 9, { isSmallText: true });
  }
}
