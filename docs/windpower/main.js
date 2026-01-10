title = "WIND POWER";

description = `
[Hold] Blow air
`;

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

let player;
let playerWindmill;
let windmill;
let obstacles;
let nextObstacleTicks;
let windPower;

function update() {
  if (!ticks) {
    player = vec(0, 50);

    playerWindmill = {
      pos: vec(10, 60),
      speed: 0,
      angle: 0,
    };

    windmill = {
      pos: vec(85, 60),
      speed: 0,
      angle: 0,
    };

    obstacles = [];
    nextObstacleTicks = 0;

    windPower = 0;
  }

  if (input.isPressed) {
    windPower += difficulty * 0.02;
    windPower = clamp(windPower, 0, 1 * difficulty);
  } else {
    windPower *= 0.9;
  }
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isJustReleased) {
    play("click");
  }

  playerWindmill.speed = windPower * 2;
  playerWindmill.angle += playerWindmill.speed * 0.2;

  color("cyan");
  box(playerWindmill.pos, 5, sin(playerWindmill.angle) * 20);

  windmill.speed += windPower * 0.02;
  windmill.speed = Math.min(windmill.speed, 10);
  windmill.speed *= 0.98;
  windmill.angle += windmill.speed * 0.2;

  color("light_black");
  for (let i = 0; i < 3; i++) {
    bar(windmill.pos, 10, 4, windmill.angle + ((PI * 2) / 3) * i, 0);
  }
  if (windmill.angle > PI * 2) {
    play("coin");
    windmill.angle %= PI * 2;
  }

  addScore(windmill.speed);

  nextObstacleTicks -= difficulty;
  if (nextObstacleTicks < 0) {
    play("hit");
    const size = rnd(5, 10);
    const pos = vec(rnd(20, 99), -size);
    obstacles.push({ pos, size, vx: 0 });
    nextObstacleTicks = rnd(75, 250);
  }

  remove(obstacles, (o) => {
    o.pos.y += difficulty * 0.5;
    if (o.pos.y > 20 && o.pos.y < 100) {
      o.vx += windPower / o.size;
    }
    o.vx *= 0.9;
    o.pos.x += o.vx;

    color("black");
    box(o.pos, o.size);

    if (box(o.pos, o.size).isColliding.rect.light_black) {
      play("explosion");
      end();
    }

    return o.pos.y > 100;
  });
}
