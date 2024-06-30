title = "KELP CLIMBER";

description = `
[Tap] Grab kelp
`;

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  audioSeed: 1,
};

// Define variables for objects
/** @type {{ pos: Vector, grabbedKelp: { pos: Vector, length: number } }} */
let otter;
/** @type {{ pos: Vector, length: number }[]} */
let kelpStrands;
let nextKelpStandDist;
/** @type {{ pos: Vector, size: Vector }[]} */
let obstacles;
let nextObstacleDist;

// Define variables for game
const screenWidth = 100;
const screenHeight = 100;
const otterSize = 5;

function update() {
  if (!ticks) {
    // Initialize the game state
    kelpStrands = [
      { pos: vec(25, 40), length: screenHeight },
      { pos: vec(50, 50), length: screenHeight },
      { pos: vec(75, 45), length: screenHeight },
    ];
    nextKelpStandDist = 0;
    otter = {
      pos: vec(kelpStrands[1].pos.x, 90),
      grabbedKelp: kelpStrands[1],
    };
    obstacles = [];
    nextObstacleDist = 0;
  }
  const scrollSpeed = 0.5 * difficulty;

  // Update otter
  // Find the nearest kelp strand
  let nearestKelp = null;
  let minDistance = 99;
  kelpStrands.forEach((kelp) => {
    if (kelp !== otter.grabbedKelp && kelp.pos.y > 40) {
      let distance = Math.abs(kelp.pos.x - otter.pos.x);
      if (distance < minDistance) {
        minDistance = distance;
        nearestKelp = kelp;
      }
    }
  });
  if (input.isJustPressed) {
    // Try to grab the nearest kelp strand
    if (nearestKelp) {
      play("jump");
      // @ts-ignore
      addScore(ceil(abs(nearestKelp.pos.x - otter.pos.x)), otter.pos);
      otter.grabbedKelp.pos.y = 199;
      otter.grabbedKelp = nearestKelp;
      // @ts-ignore
      otter.pos.x = nearestKelp.pos.x;
    }
  }

  // Update kelp strands
  kelpStrands.forEach((kelp) => {
    kelp.pos.y += scrollSpeed;
  });

  // Remove kelp strands that are off-screen and spawn new ones
  remove(kelpStrands, (kelp) => kelp.pos.y > screenHeight + 50);
  nextKelpStandDist -= scrollSpeed;
  if (nextKelpStandDist < 0) {
    play("click");
    kelpStrands.push({
      pos: vec(rnd(10, 90), -50),
      length: screenHeight,
    });
    nextKelpStandDist += rnd(30, 50);
  }

  // Update obstacles
  obstacles.forEach((obstacle) => {
    obstacle.pos.y += scrollSpeed;
  });

  // Remove obstacles that are off-screen and spawn new ones
  remove(obstacles, (obstacle) => obstacle.pos.y > screenHeight + 10);
  nextObstacleDist -= scrollSpeed;
  if (nextObstacleDist < 0) {
    play("hit");
    let newObstacle = {
      pos: vec(rnd(10, 90), -10),
      size: vec(rnd(5, 15), rnd(5, 15)),
    };
    obstacles.push(newObstacle);
    nextObstacleDist += rnd(40, 50);
  }

  // Draw game objects and check for collisions
  color("green");
  kelpStrands.forEach((kelp) => {
    box(kelp.pos, vec(3, kelp.length));
  });

  color("red");
  obstacles.forEach((obstacle) => {
    box(obstacle.pos, obstacle.size);
  });

  color("yellow");
  if (box(otter.pos, otterSize).isColliding.rect.red) {
    play("explosion");
    end();
  }
  if (nearestKelp) {
    color("light_cyan");
    // @ts-ignore
    box(nearestKelp.pos.x, 90, otterSize - 2);
  }
}
