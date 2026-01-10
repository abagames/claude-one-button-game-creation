title = "KITE MASTER";

description = `
[Hold]
 Pull string
Catch clouds with kite
`;

options = {
  viewSize: { x: 100, y: 100 },
  theme: "simple",
  isPlayingBgm: true,
  isReplayEnabled: true,
  bgmVolume: 2,
  audioSeed: 3,
};

characters = [
  `
  ll
  l
  l  l
lllll
  l
l  l
`,
  `
 ll
 l
  l ll
lllll
 l
l ll
`,
];

audioFiles = {
  bgm: "./kite-master/Digital_Skies.mp3",
};

let player,
  kite,
  stringLength,
  maxStringLength,
  wind,
  kiteTail,
  clouds,
  windTicks;

function update() {
  if (!ticks) {
    sss.setQuantize(0);
    // Initialize
    player = { pos: vec(20, 87) }; // Bottom left
    kite = {
      pos: vec(35, 70),
      vel: vec(0, 0),
    };
    stringLength = 20;
    maxStringLength = 120;
    wind = 0.8; // Wind strength
    windTicks = 0;

    // Kite tail (multiple segments)
    kiteTail = [];
    for (let i = 0; i < 5; i++) {
      kiteTail.push({
        pos: vec(35, 70 + (i + 1) * 3),
        vel: vec(0, 0),
      });
    }

    // Cloud items
    clouds = [];
  }

  // Wind change (gradual)
  wind = 1 + 0.5 * Math.sin(windTicks);
  windTicks += 0.01 * difficulty;

  // Forces acting on kite
  let forces = vec(0, 0);

  // 1. Wind force (opposite to string direction)
  let stringDirection = vec(
    kite.pos.x - player.pos.x,
    kite.pos.y - player.pos.y
  );
  stringDirection.normalize();
  forces.add(vec(stringDirection).mul(wind * 0.81));
  forces.add(wind * 0.19, 0);

  // Hold button to continuously pull string
  if (input.isPressed) {
    stringLength = Math.max(5, stringLength - 0.2 * difficulty); // Continuous pull
    // Add continuous pulling force
    forces.add(0, -1); // Upward continuous force
  }
  if (input.isJustPressed) {
    play("laser", { pitch: 50, volume: 0.5 });
  }
  if (input.isJustReleased) {
    play("hit", { pitch: 80, volume: 0.5 });
  }

  // String extends by wind force
  let distanceToPlayer = kite.pos.distanceTo(player.pos);
  if (distanceToPlayer > stringLength) {
    // When wind is strong and kite tries to exceed string length
    stringLength = Math.min(
      maxStringLength,
      stringLength + wind * 0.1 * difficulty
    );
  }

  // 2. Gravity
  forces.add(vec(0, 0.3));

  // 3. String tension check (distanceToPlayer already calculated)
  if (distanceToPlayer > stringLength) {
    // String is taut: pulling force toward player
    let tensionDirection = vec(
      player.pos.x - kite.pos.x,
      player.pos.y - kite.pos.y
    );
    tensionDirection.normalize();
    let tensionForce = (distanceToPlayer - stringLength) * 0.1;
    forces.add(tensionDirection.mul(tensionForce));
  }

  // Update velocity
  kite.vel.add(forces.mul(0.02));
  kite.vel.mul(0.98); // Air resistance

  // Update position
  kite.pos.add(vec(kite.vel).mul(difficulty));

  // Boundary limit
  kite.pos.clamp(5, 95, 5, 95);

  // Cloud generation (one at a time)
  if (clouds.length === 0) {
    clouds.push({
      pos: vec(rnd(25, 75), -5), // Random position at top of screen
      vel: vec(rnd(-0.1, 0.1), 0.15), // Slow fall
      collected: false,
    });
  }

  // Cloud update
  remove(clouds, (cloud) => {
    if (cloud.collected) return true;

    // Cloud falling
    cloud.pos.add(vec(cloud.vel).mul(difficulty));

    // Cloud boundary limit (bounce off left/right walls)
    if (
      (cloud.pos.x <= 20 && cloud.vel.x < 0) ||
      (cloud.pos.x >= 80 && cloud.vel.x > 0)
    ) {
      cloud.vel.x *= -1; // Reverse horizontal velocity
    }
    if (cloud.pos.y > 90) {
      play("explosion");
      end();
    }
  });

  // Calculate kite angle (string direction + wind influence)
  let stringAngle = Math.atan2(
    kite.pos.y - player.pos.y,
    kite.pos.x - player.pos.x
  );
  let windInfluence = wind * 0.3; // Angle change due to wind
  let kiteAngle = stringAngle + windInfluence + PI / 2; // Add PI/2 for vertical orientation

  // Kite tail physics update
  kiteTail.forEach((segment, i) => {
    // Gravity effect
    segment.vel.add(vec(0, 0.1));

    // Wind effect (horizontal only, stronger for lower segments)
    let windForce = /*stringDirection.x * */ wind * 0.05 * (i + 1);
    segment.vel.add(vec(windForce + rnds(0.25), rnds(0.25)));
    segment.vel.mul(0.99);

    // Constraint with previous segment (connected like string)
    let anchor;
    if (i === 0) {
      anchor = vec(kite.pos).addWithAngle(kiteAngle, 6);
    } else {
      anchor = kiteTail[i - 1].pos;
    }

    let distance = segment.pos.distanceTo(anchor);
    let maxDistance = 4; // Maximum distance between segments

    if (distance > maxDistance) {
      // Pull back if distance is too far
      let direction = vec(anchor.x - segment.pos.x, anchor.y - segment.pos.y);
      direction.normalize();
      segment.pos = vec(
        anchor.x - direction.x * maxDistance,
        anchor.y - direction.y * maxDistance
      );
    }

    // Air resistance
    segment.vel.mul(0.85);

    // Update position
    segment.pos.add(segment.vel);

    // Tail boundary limit
    segment.pos.clamp(2, 98, 2, 90);
  });

  // Drawing
  // Ground
  color("green");
  rect(0, 90, 100, 10);

  // Player
  color("black");
  char(input.isPressed ? "b" : "a", player.pos);

  // String
  color("light_black");
  line(
    player.pos.x + 3,
    player.pos.y,
    vec(kite.pos).sub(stringDirection.x * 6, stringDirection.y * 6),
    1
  );

  // Kite (bar with angle at string end)
  kite.pos.distanceTo(player.pos);

  // Kite bar (vertical pole)
  color("blue");
  bar(kite.pos, 12, 3, kiteAngle);

  // Draw kite tail
  color("light_blue");
  kiteTail.forEach((segment, i) => {
    let size = 4 - i * 0.5; // Smaller toward bottom
    box(segment.pos, Math.max(2, size));
  });

  // Draw clouds (with collision detection)
  remove(clouds, (cloud) => {
    if (cloud.collected) return true;

    color("cyan");
    const cloudCollision1 = arc(cloud.pos.x - 3, cloud.pos.y, 3, 3).isColliding;
    const cloudCollision2 = arc(cloud.pos.x + 3, cloud.pos.y, 3, 3).isColliding;

    // On collision with kite
    if (
      cloudCollision1.rect.blue ||
      cloudCollision1.char.a ||
      cloudCollision1.char.b ||
      cloudCollision2.rect.blue ||
      cloudCollision2.char.a ||
      cloudCollision2.char.b
    ) {
      cloud.collected = true;
      addScore(100 - cloud.pos.y, cloud.pos.clamp(10, 90, 10, 90));
      play("coin");
      return true;
    }

    return false;
  });

  // UI
  color("cyan");
  rect(5, 5, wind * 30, 3); // Wind strength display

  // Game over: kite falls to ground
  if (kite.pos.y > 85) {
    play("explosion");
    end();
  }
}
