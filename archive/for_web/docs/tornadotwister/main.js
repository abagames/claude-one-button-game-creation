title = "TORNADO TWISTER";

description = `
[Tap] Change direction
[Hold] Shrink & slow down
`;

characters = [];

options = {
  theme: "shapeDark",
  viewSize: { x: 150, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 6,
};

/** @type {{ pos: Vector, size: number, currentSize: number, direction: number, speed: number, particles: Vector[] }} */
let tornado;

/** @type {{ pos: Vector, type: string, size: number, angle: number, distance: number }[]} */
let suckableObjects;

/** @type {{ pos: Vector, width: number, height: number }[]} */
let obstacles;
let nextObstacleTicks;

let scrollSpeed;
let growthRate;
let spawnTimer;

function update() {
  if (!ticks) {
    // Initialize game objects and variables
    tornado = {
      pos: vec(20, 75),
      size: 7,
      currentSize: 7,
      direction: 1,
      speed: 1,
      particles: times(20, () => vec(rnds(10), rnds(10))),
    };
    suckableObjects = [];
    obstacles = [];
    nextObstacleTicks = 0;
    scrollSpeed = 1;
    growthRate = 0.01;
    spawnTimer = 0;
    score = 0;
  }

  const sd = sqrt(difficulty);
  scrollSpeed = sd;

  // Handle input
  if (input.isJustPressed) {
    tornado.direction *= -1;
    play("laser");
  }
  if (input.isPressed) {
    tornado.currentSize += (3 - tornado.currentSize) * 0.1;
    tornado.speed += (0.1 - tornado.speed) * 0.1;
  } else {
    tornado.currentSize += (tornado.size - tornado.currentSize) * 0.03;
    tornado.speed += (1 - tornado.speed) * 0.1;
  }

  // Update tornado
  tornado.pos.y += tornado.direction * tornado.speed * sd;
  if (tornado.pos.y <= tornado.currentSize && tornado.direction < 0) {
    tornado.direction = 1;
  }
  if (tornado.pos.y >= 100 - tornado.currentSize && tornado.direction > 0) {
    tornado.direction = -1;
  }

  // Draw tornado
  color("cyan");
  tornado.particles.forEach((p, i) => {
    p.rotate(0.15 * (1 - i / tornado.particles.length) * sd);
    const pos = vec(tornado.pos).add(vec(p).mul(tornado.currentSize / 10));
    box(pos, sqrt(tornado.currentSize));
  });

  // Spawn and update suckable objects
  spawnTimer -= sd;
  if (spawnTimer <= 0) {
    const type = rnd() < 0.5 ? "tree" : rnd() < 0.7 ? "house" : "car";
    const size = type === "tree" ? 3 : type === "house" ? 5 : 4;
    suckableObjects.push({
      pos: vec(160, rnd(10, 90)),
      type,
      size,
      angle: 0,
      distance: 0,
    });
    spawnTimer = rnd(30, 50);
  }

  remove(suckableObjects, (obj) => {
    if (obj.distance > 0) {
      // Object is being sucked in
      obj.distance -= 1;
      obj.angle += 0.2;
      const offset = vec(obj.distance, 0).rotate(obj.angle);
      obj.pos = vec(tornado.pos).add(offset);
      if (obj.distance <= 0) {
        tornado.size += obj.size * 0.05;
        addScore(floor(obj.size * tornado.currentSize), tornado.pos);
        play("powerUp");
        return true;
      }
    } else {
      // Object is scrolling
      obj.pos.x -= scrollSpeed;
    }

    color(
      obj.type === "tree" ? "green" : obj.type === "house" ? "yellow" : "red"
    );
    const isCollidingTornado = box(obj.pos, obj.size).isColliding.rect.cyan;
    if (isCollidingTornado && obj.distance === 0) {
      obj.distance = obj.pos.distanceTo(tornado.pos) * 1.5;
      obj.angle = tornado.pos.angleTo(obj.pos);
    }
    return obj.pos.x < -obj.size;
  });

  // Spawn and update obstacles
  nextObstacleTicks -= sd;
  if (nextObstacleTicks < 0) {
    const width = rnd(20, 30);
    obstacles.push({
      pos: vec(150 + width / 2, rnd(10, 90)),
      width,
      height: rnd(10, 20),
    });
    nextObstacleTicks += rnd(50, 150);
  }

  obstacles = obstacles.filter((obs) => {
    obs.pos.x -= scrollSpeed;
    color("black");
    const isCollidingTornado = box(obs.pos, obs.width, obs.height).isColliding
      .rect.cyan;
    if (isCollidingTornado) {
      play("explosion");
      end();
    }
    return obs.pos.x > -obs.width;
  });
}
