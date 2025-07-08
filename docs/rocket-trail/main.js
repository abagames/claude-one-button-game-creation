title = "Rocket Trail";
description = `[Hold] Thrust & Destroy`;

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 1,
  bgmVolume: 3,
  theme: "dark",
};

audioFiles = {
  bgm: "./rocket-trail/Rocket_Boosted_Dreams.mp3",
};

let rocket;
let asteroids;
let fuelParticles;
let flameTrail;
let asteroidSpawnTimer;
let asteroidSpawnInterval;
let multiplier;
let stars;

function update() {
  if (!ticks) {
    sss.setQuantize(0);
    rocket = {
      pos: vec(50, 65),
      vel: vec(0, 0),
      thrustPower: 0.3,
      horizontalDir: 1,
      horizontalSpeed: 0.8,
      angle: PI / 2,
    };
    asteroids = [];
    fuelParticles = [];
    flameTrail = [];
    asteroidSpawnTimer = 0;
    asteroidSpawnInterval = 60;
    multiplier = 1;
    stars = [];

    // Initialize stars
    for (let i = 0; i < 50; i++) {
      stars.push({
        pos: vec(rnd(0, 100), rnd(0, 100)),
        vel: vec(0, rnd(0.5, 2)),
        size: rnd(0.5, 2),
      });
    }
  }

  rocket.vel.x *= 0.95;
  // Apply gravity
  rocket.vel.y += 0.1;
  rocket.vel.y *= 0.98;

  // Horizontal movement - automatic left-right oscillation
  if (rocket.pos.x <= 45) {
    rocket.horizontalDir = 1;
  } else if (rocket.pos.x >= 55) {
    rocket.horizontalDir = -1;
  }
  rocket.angle += (PI / 2 + rocket.horizontalDir - rocket.angle) * 0.05;

  // Apply thrust if button held
  if (input.isPressed) {
    //rocket.vel.y -= rocket.thrustPower;
    rocket.vel.addWithAngle(rocket.angle, -rocket.thrustPower);
    // Create fuel particles
    if (rnd() < 0.3) {
      fuelParticles.push({
        pos: vec(rocket.pos),
        vel: vec().addWithAngle(
          rocket.angle + rnds(0.5),
          rocket.thrustPower * 6
        ),
        life: 20,
      });
    }
  }
  if (input.isJustPressed) {
    play("explosion", { seed: 40, volume: 0.3, pitch: 10 });
  }

  rocket.pos.add(rocket.vel);

  // Update and draw stars
  color("black");
  remove(stars, (s) => {
    s.pos.add(s.vel);

    // Draw star
    box(s.pos, s.size);

    // Reset star position when it goes off screen
    if (s.pos.y > 100) {
      s.pos.y = -5;
      s.pos.x = rnd(0, 100);
      s.vel.y = rnd(0.5, 2);
      s.size = rnd(0.5, 2);
    }

    return false; // Never remove stars, just recycle them
  });

  // Add flame trail segment
  flameTrail.push({
    pos: vec(rocket.pos),
    vel: vec().addWithAngle(rocket.angle, rocket.thrustPower * 7),
    age: 0,
  });

  // Keep rocket on screen
  rocket.pos.x = clamp(rocket.pos.x, 1, 99);
  if (rocket.pos.y < 0 || rocket.pos.y > 105) {
    play("explosion", { seed: 31 });
    end();
  }

  // Draw rocket
  color("red");
  bar(rocket.pos, 5, 3, rocket.angle, 1);

  // Update and draw flame trail
  color("yellow");
  remove(flameTrail, (f) => {
    f.age++;
    f.pos.add(f.vel);
    if (f.age < 60) {
      let size = 4 - (f.age / 60) * 3; // Trail gets smaller over time
      box(f.pos, size);
    }
    return f.age >= 25;
  });

  // Update fuel particles
  remove(fuelParticles, (p) => {
    p.pos.add(p.vel);
    p.life--;
    if (p.life > 0) {
      box(p.pos, 2);
    }
    return p.life <= 0;
  });

  // Spawn asteroids using interval timer
  asteroidSpawnTimer++;
  if (asteroids.length === 0 || asteroidSpawnTimer >= asteroidSpawnInterval) {
    const pos = vec(rnd(5, 95), -5);
    asteroids.push({
      pos,
      vel: vec().addWithAngle(pos.angleTo(vec(rnd(20, 80), 99)), rnd(0.3, 0.5)),
    });
    asteroidSpawnTimer = 0;
    // Slightly randomize next interval for variety
    asteroidSpawnInterval = 80 - rnds(30) * difficulty;
  }

  // Update asteroids
  color("black");
  remove(asteroids, (a) => {
    a.pos.add(a.vel);
    let asteroidBox = box(a.pos, 3);
    particle(a.pos, {
      count: 1,
      angle: a.vel.angle + PI,
      angleWidth: 1,
      speed: a.vel.length,
    });

    // Check collision with flame trail - asteroid gets destroyed
    if (asteroidBox.isColliding.rect.yellow) {
      // Add score based on current multiplier
      addScore(multiplier, a.pos);
      // Increase multiplier (max 16)
      multiplier = clamp(multiplier + 1, 1, 16);
      // Create explosion effect
      particle(a.pos, 7, 2);
      // Play destruction sound based on multiplier
      play("explosion", { seed: 34 });
      return true;
    }

    // Check collision with rocket - reset rocket safely
    if (asteroidBox.isColliding.rect.red) {
      rocket.vel.y += 2;
      multiplier = 1;
      color("red");
      particle(a.pos, 25, 3, -PI / 2, 1);
      color("black");
      // Play collision sound
      play("explosion", { seed: 33 });
      return true;
    }

    // Check if asteroid escaped (went off screen)
    if (a.pos.y > 105) {
      // Decrease multiplier when asteroid escapes (min 1)
      multiplier = clamp(multiplier - 1, 1, 16);
      return true;
    }

    return false;
  });

  // Draw multiplier display
  color("black");
  text("x" + multiplier, 3, 9, { isSmallText: true });
}
