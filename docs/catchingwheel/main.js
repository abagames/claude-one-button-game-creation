title = "CATCHING WHEEL";

description = `
[Hold] Rotate wheel
`;

characters = [
  `
lllll
 lll
 lll
`,
  `
  ll
l l  l
 llll 
  l
 l l
l   l
`,
];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingParticleFront: true,
  audioSeed: 8,
};

/**
 * @type {{
 * center: Vector, radius: number, angle: number, spokeCount: number, rotationSpeed: number, isAlive: boolean[]
 * }}
 */
let wheel;
/** @type {{ pos: Vector, vel: Vector }[]} */
let humans;
let nextHumanTicks;
/** @type {{ pos: Vector, vel: Vector }[]} */
let obstacles;
let nextObstacleTicks;
let multiplier;
const baseHumanSpawnInterval = 40;
const baseObstacleSpawnInterval = 99;
const basketScale = 3;
const gravity = 0.02;

function update() {
  if (!ticks) {
    const spokeCount = 6;
    wheel = {
      center: vec(50, 90),
      radius: 40,
      angle: 0,
      spokeCount,
      rotationSpeed: 0.05,
      isAlive: times(spokeCount, () => true),
    };
    humans = [];
    nextHumanTicks = baseHumanSpawnInterval;
    obstacles = [];
    nextObstacleTicks = baseObstacleSpawnInterval;
    multiplier = 1;
  }

  nextObstacleTicks -= difficulty;
  if (nextObstacleTicks <= 0) {
    obstacles.push({
      pos: vec(rnd(20, 80), 0),
      vel: vec(0, 0),
    });
    nextObstacleTicks = baseObstacleSpawnInterval * rnd(0.8, 1.2);
  }

  color("red");
  remove(obstacles, (o) => {
    // Apply gravity
    o.vel.y += gravity;
    o.pos.y += o.vel.y * difficulty;
    text("*", o.pos);
    return o.pos.y > 95;
  });

  // Update and draw Ferris wheel
  color("blue");
  arc(wheel.center, wheel.radius);
  if (input.isPressed) {
    wheel.angle += wheel.rotationSpeed * difficulty;
  }
  for (let i = 0; i < wheel.spokeCount; i++) {
    const spokeAngle = wheel.angle + (i * 2 * PI) / wheel.spokeCount;
    const spokeEnd = vec(wheel.center).addWithAngle(spokeAngle, wheel.radius);
    color("black");
    line(wheel.center, spokeEnd);

    // Draw larger basket at the end of each spoke
    if (wheel.isAlive[i]) {
      const basketPos = vec(spokeEnd);
      color("yellow");
      if (
        char("a", basketPos, {
          scale: { x: basketScale, y: basketScale },
        }).isColliding.text["*"]
      ) {
        destroyBasket(i);
      }
    }
  }

  // Spawn new humans
  nextHumanTicks -= difficulty;
  if (nextHumanTicks <= 0) {
    humans.push({
      pos: vec(rnd(10, 90), 0),
      vel: vec(0, 0),
    });
    nextHumanTicks = baseHumanSpawnInterval * rnd(0.7, 1);
  }

  // Update and draw humans
  color("yellow");
  remove(humans, (human) => {
    // Apply gravity
    human.vel.y += gravity;
    human.pos.add(human.vel);

    const humanObj = char("b", human.pos);
    if (humanObj.isColliding.text["*"]) {
      return true;
    }

    // Check for collisions between humans and baskets
    for (let i = 0; i < wheel.spokeCount; i++) {
      if (humanObj.isColliding.char.a) {
        play("coin");
        addScore(multiplier, human.pos);
        multiplier++;
        let bi = rndi(wheel.spokeCount);
        for (let i = 0; i < wheel.spokeCount; i++) {
          if (!wheel.isAlive[bi]) {
            wheel.isAlive[bi] = true;
            break;
          }
          bi = (bi + 1) % wheel.spokeCount;
        }
        return true;
      }
    }

    // Remove humans that fall off-screen
    if (human.pos.y > 100) {
      let bi = rndi(wheel.spokeCount);
      for (let i = 0; i < wheel.spokeCount; i++) {
        if (wheel.isAlive[bi]) {
          destroyBasket(bi);
          break;
        }
        bi = (bi + 1) % wheel.spokeCount;
      }
      play("explosion");
      return true;
    }
  });
  let isAlive = false;
  for (let i = 0; i < wheel.spokeCount; i++) {
    if (wheel.isAlive[i]) {
      isAlive = true;
      break;
    }
  }
  if (!isAlive) {
    end();
  }
}

function destroyBasket(i) {
  play("explosion");
  wheel.isAlive[i] = false;
  color("red");
  const spokeAngle = wheel.angle + (i * 2 * PI) / wheel.spokeCount;
  const spokeEnd = vec(wheel.center).addWithAngle(spokeAngle, wheel.radius);
  particle(spokeEnd.x, clamp(spokeEnd.y, 0, 95), { count: 20, speed: 2 });
  multiplier = 1;
}
