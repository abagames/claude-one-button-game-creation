title = "GRAVITY WELL";

description = `
[Tap] Anti Gravity Pulse
`;

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 5,
};

// Define variables for objects.
/** @type {{pos: Vector, velocity: Vector, radius: number}} */
let planet;
let nextScoreAddingDist;
/** @type {{pos: Vector, radius: number, strength: number}[]} */
let blackHoles;
let nextBlackHoleDist;
/** @type {{pos: Vector, radius: number, strength: number}[]} */
let pulses;
/** @type {{pos: Vector, vx: number}[]} */
let stars;

// Define variables for the game.
/** @type {Vector} */
let scrollingSpeed;

function update() {
  if (!ticks) {
    // Set the initial state of the game.
    planet = {
      pos: vec(50, 50),
      velocity: vec(0, 0),
      radius: 9,
    };
    nextScoreAddingDist = 0;
    blackHoles = [];
    nextBlackHoleDist = 0;
    pulses = [];
    stars = times(20, () => ({
      pos: vec(rnd(0, 100), rnd(0, 100)),
      vx: -rnd(0.1, 0.2),
    }));
    scrollingSpeed = vec();
  }

  scrollingSpeed.x = -0.5 * sqrt(difficulty);
  nextScoreAddingDist += scrollingSpeed.x;
  if (nextScoreAddingDist < 0) {
    addScore(floor(planet.radius), planet.pos);
    nextScoreAddingDist += 30;
  }

  color("black");
  stars.forEach((star) => {
    star.pos.x += star.vx;
    if (star.pos.x < 0) {
      star.pos.x += 100;
    }
    box(star.pos, 1);
  });

  // Implement scrolling
  blackHoles.forEach((bh) => {
    bh.pos.add(scrollingSpeed);
  });

  // Spawn new black holes
  nextBlackHoleDist += scrollingSpeed.x;
  if (nextBlackHoleDist < 0) {
    const radius = rnd(5, 9);
    blackHoles.push({
      pos: vec(100 + radius, rnd(10, 90)),
      radius,
      strength: 0.1,
    });
    nextBlackHoleDist += rnd(30, 40);
  }

  // Remove off-screen black holes
  remove(blackHoles, (bh) => bh.pos.x < -10);

  // Update particle position and apply gravity
  planet.pos.add(planet.velocity);
  let o = planet.pos.x + 10;
  planet.velocity.x += 1 / o / o;
  o = 110 - planet.pos.x;
  planet.velocity.x -= 1 / o / o;
  o = planet.pos.y + 10;
  planet.velocity.y += 1 / o / o;
  o = 105 - planet.pos.y;
  planet.velocity.y -= 1 / o / o;
  planet.velocity.mul(0.99);
  blackHoles.forEach((bh) => {
    let direction = vec(bh.pos).sub(planet.pos);
    let distance = direction.length;
    if (distance > 0) {
      let force = bh.strength / distance;
      planet.velocity.add(vec(direction).normalize().mul(force));
    }
  });

  // Handle button input
  if (input.isJustPressed && planet.radius > 2) {
    play("laser");
    planet.radius -= 1;
    pulses.push({
      pos: vec(planet.pos),
      radius: 0,
      strength: 0.5,
    });
  }

  // Update and apply pulses
  pulses.forEach((pulse) => {
    pulse.pos.set(planet.pos);
    pulse.radius += 1;
    blackHoles.forEach((bh) => {
      let direction = vec(bh.pos).sub(pulse.pos);
      let distance = direction.length;
      if (distance < pulse.radius + bh.radius) {
        let force = pulse.strength / sqrt(distance);
        planet.velocity.add(vec(direction).normalize().mul(-force));
        bh.pos.add(vec(direction).normalize().mul(force));
      }
    });
  });

  // Remove faded pulses
  remove(pulses, (pulse) => pulse.radius > 20);

  // Draw game objects
  blackHoles.forEach((bh) => {
    color("white");
    box(bh.pos, bh.radius * 2);
    color("purple");
    arc(bh.pos, bh.radius);
  });

  color("cyan");
  pulses.forEach((pulse) => {
    arc(pulse.pos, pulse.radius);
  });

  color("yellow");
  let collision = arc(planet.pos, planet.radius);

  // Check for collision with black holes
  if (collision.isColliding.rect.purple) {
    play("hit");
    planet.radius -= 0.2;
  } else {
    planet.radius = clamp(planet.radius + 0.05, 1, 9);
  }
  if (planet.radius < 1) {
    play("explosion");
    end();
  }

  // Keep planet on screen
  if (
    (planet.pos.x < 0 && planet.velocity.x < 0) ||
    (planet.pos.x > 100 && planet.velocity.x > 0)
  ) {
    planet.velocity.x *= -1;
  }
  if (
    (planet.pos.y < 0 && planet.velocity.y < 0) ||
    (planet.pos.y > 100 && planet.velocity.y > 0)
  ) {
    planet.velocity.y *= -1;
  }
}
