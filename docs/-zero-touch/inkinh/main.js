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

function update() {
  if (!ticks) {
    player = { pos: vec(50, 80), vel: vec(0, 0), angle: -PI / 2 };
    orbs = [];
    obstacles = [];
    combo = 0;
    comboTimer = 0;
  }

  comboTimer--;
  if (comboTimer <= 0) {
    combo = 0;
  }

  let spawnRate = 55 - floor(difficulty * 5);
  if (spawnRate < 25) spawnRate = 25;

  if (ticks % spawnRate === 0) {
    let ox = rnd(10, 90);
    let speed = 0.5 + difficulty * 0.1;
    if (speed > 1.5) speed = 1.5;
    obstacles.push({ pos: vec(ox, -8), vel: vec(rnd(-0.2, 0.2), speed) });
  }

  let orbRate = 30;
  if (ticks % orbRate === 0 && orbs.length < 8) {
    orbs.push({ pos: vec(rnd(15, 85), rnd(10, 60)), timer: 180 });
  }

  player.angle += 0.025;

  if (input.isPressed) {
    let thrust = 0.15;
    player.vel.x += cos(player.angle) * thrust;
    player.vel.y += sin(player.angle) * thrust;

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
  player.pos.add(player.vel);

  player.pos.x = clamp(player.pos.x, 5, 95);
  player.pos.y = clamp(player.pos.y, 5, 95);

  if (input.isPressed) {
    color("light_black");
    arc(player.pos, 15, 2, player.angle - 0.6, player.angle + 0.6);
  }

  color("cyan");
  box(player.pos, 6);

  color("black");
  let dirLen = 10;
  line(
    player.pos,
    vec(
      player.pos.x + cos(player.angle) * dirLen,
      player.pos.y + sin(player.angle) * dirLen
    ),
    2
  );

  color("yellow");
  orbs = orbs.filter((o) => {
    o.timer--;
    let alpha = o.timer > 60 ? 1 : o.timer / 60;
    let sz = 4 + alpha * 2;
    let coll = box(o.pos, sz).isColliding.rect.cyan;
    if (coll) {
      play("coin");
      combo++;
      comboTimer = 60;
      addScore(combo);
      return false;
    }
    return o.timer > 0;
  });

  obstacles = obstacles.filter((o) => {
    o.pos.add(o.vel);
    return o.pos.y < 110;
  });

  color("red");
  obstacles.forEach((o) => {
    if (box(o.pos, 7).isColliding.rect.cyan) {
      play("explosion");
      end();
    }
  });

  if (combo > 1) {
    color("black");
    text(`x${combo}`, 3, 10);
  }
}
