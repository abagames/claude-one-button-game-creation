title = "TURBO TUNNEL";

description = `
[Tap] Turn
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 2,
};

// Define variables for objects
/** @type {{angle: number, pos: Vector, radius: number, vr: number}} */
let car;
/** @type {{radius: number, width: number}} */
let tunnel;
/** @type {{angle: number, va: number, radius: number, destroyedTicks: number, pos: Vector}[]} */
let obstacles;
let multiplier;

function update() {
  if (!ticks) {
    // Initialize game objects and variables
    tunnel = { radius: 30, width: 40 };
    car = { angle: PI / 2, pos: vec(), radius: tunnel.radius, vr: 1 };
    obstacles = [];
    multiplier = 1;
  }

  let isSpawningObstacle = false;

  // Handle player input
  if (input.isJustPressed) {
    play("laser");
    car.vr *= -1;
    isSpawningObstacle = true;
  }

  // Update car position based on tunnel rotation and current side
  car.angle += (0.015 * difficulty) / (car.radius * 0.03);
  car.radius += car.vr * 0.4;
  car.pos = vec(50, 50).add(vec(car.radius, 0).rotate(car.angle));

  // Check if car is outside the tunnel
  const distanceFromCenter = car.pos.distanceTo(vec(50, 50));
  if (
    (distanceFromCenter > tunnel.radius + tunnel.width / 2 && car.vr > 0) ||
    (distanceFromCenter < tunnel.radius - tunnel.width / 2 && car.vr < 0)
  ) {
    car.vr *= -1;
    isSpawningObstacle = true;
  }

  // Draw tunnel
  color("blue");
  arc(50, 50, tunnel.radius + tunnel.width / 2, 4);
  arc(50, 50, tunnel.radius - tunnel.width / 2, 4);

  // Draw and check collision for car
  color("light_red");
  bar(car.pos, 1, 3, car.angle + PI / 2);
  color("red");
  box(car.pos, 1);

  let hasDestroyed = false;
  // Draw and update obstacles, check collisions
  remove(obstacles, (o) => {
    o.angle += o.va / (o.radius * 0.03);
    o.pos = vec(50, 50).add(vec(o.radius, 0).rotate(o.angle));

    if (o.destroyedTicks > 0) {
      hasDestroyed = true;
      o.destroyedTicks -= difficulty;
      if (o.destroyedTicks <= 0) {
        play("powerUp");
        addScore(multiplier, o.pos);
        multiplier++;
        particle(o.pos, { count: 9, speed: 3 });
        return true;
      }
    }
    color(o.destroyedTicks > 0 ? "purple" : "yellow");
    const a = o.angle + PI / 2 + (o.destroyedTicks + 1) * 0.5;
    const isColliding = bar(o.pos, 1, 3, a).isColliding.rect;
    if (o.destroyedTicks < 0 && isColliding.yellow) {
      o.destroyedTicks = 30;
    }
    if (o.destroyedTicks < 0 && isColliding.red) {
      play("explosion");
      end();
    }
  });
  color("transparent");
  obstacles.forEach((o) => {
    const isColliding = box(o.pos, 5).isColliding.rect;
    if (o.destroyedTicks < 0 && isColliding.purple) {
      play("coin");
      o.destroyedTicks = 30;
      hasDestroyed = true;
    }
  });
  if (!hasDestroyed) {
    multiplier = 1;
  }

  // Spawn and update obstacles
  if (isSpawningObstacle) {
    const o = {
      angle: car.angle + (PI * 2 - 3 / car.radius),
      va: -rnd(0.01, 0.03) * difficulty,
      radius: car.radius,
      destroyedTicks: -1,
      pos: vec(),
    };
    o.pos = vec(50, 50).add(vec(o.radius, 0).rotate(o.angle));
    color("transparent");
    const c = box(o.pos, 9).isColliding.rect;
    if (!c.yellow && !c.purple) {
      play("laser");
      obstacles.push(o);
    }
  }
}
