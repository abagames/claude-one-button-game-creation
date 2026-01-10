title = "SLIME STRETCHER";

description = `
[Hold] Stretch
[Release] Contract
`;

characters = [
  `
 llll
l  lll
l llll
l llll
llll l
 llll
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 3,
};

/** @type {{
  pos: Vector, width: number, height: number,
  baseWidth: number, baseHeight: number, maxHeight: number,
  velocity: number, isOnGround: boolean
}} */
let slime;

/** @type {{pos: Vector, width: number, height: number}[]} */
let walls;

/** @type {{pos: Vector}[]} */
let collectibles;

// Game state variables
let scrollVelocity;
let nextWallDistance;
let nextCollectibleDistance;
let multiplier;

function update() {
  if (!ticks) {
    // Initialize game objects and variables
    slime = {
      pos: vec(50, 90),
      width: 20,
      height: 20,
      baseWidth: 20,
      baseHeight: 20,
      maxHeight: 80,
      velocity: 1,
      isOnGround: true,
    };
    walls = [];
    collectibles = [];
    scrollVelocity = 1;
    nextWallDistance = 50;
    nextCollectibleDistance = 30;
    multiplier = 1;
  }

  // Handle slime stretching and movement
  if (input.isPressed) {
    // Implement slime stretching
    slime.height = Math.min(slime.height + 2, slime.maxHeight);
    slime.width = Math.max(slime.width - 0.5, slime.baseWidth / 2);
    slime.velocity = 0.5 * difficulty;
    // Move slime upward when stretching
    slime.pos.y = Math.max(slime.pos.y - 2, 10);
  } else {
    // Implement slime contracting
    slime.height = Math.max(slime.height - 4, slime.baseHeight);
    slime.width = Math.min(slime.width + 1, slime.baseWidth);
    slime.velocity = 1.5 * difficulty;
  }

  // Move slime horizontally
  slime.pos.x += slime.velocity;
  if (slime.pos.x < 50) {
    slime.pos.x++;
  }
  if (slime.pos.x < -slime.width) {
    play("explosion");
    end();
  }

  // Spawn and update obstacles
  nextWallDistance -= slime.velocity;
  if (nextWallDistance <= 0) {
    // Spawn new obstacle
    const width = rnd(20, 60);
    walls.push({
      pos: vec(200, rnd(0, 70)),
      width,
      height: rnd(20, 40),
    });
    nextWallDistance = rndi(35, 55) + width;
  }

  // Spawn and update collectibles
  nextCollectibleDistance -= slime.velocity;
  if (nextCollectibleDistance <= 0) {
    // Spawn new collectible
    collectibles.push({
      pos: vec(203, rnd(20, 80)),
    });
    nextCollectibleDistance = rndi(30, 60);
  }

  // Handle collisions
  slime.isOnGround = false;
  walls.forEach((wall) => {
    // Check collision with slime
    if (
      slime.pos.x + slime.width > wall.pos.x &&
      slime.pos.x < wall.pos.x + wall.width &&
      slime.pos.y + slime.height > wall.pos.y &&
      slime.pos.y < wall.pos.y + wall.height
    ) {
      // Collision with wall
      if (slime.pos.y + slime.height < wall.pos.y + 10) {
        // Slime is on top of the wall
        slime.height--;
        slime.pos.y = wall.pos.y - slime.height;
        slime.isOnGround = true;
      } else if (slime.pos.y > wall.pos.y + wall.height - 10) {
        // Slime is below the wall
        slime.pos.y = wall.pos.y + wall.height;
        slime.height -= 2;
      } else if (slime.pos.x + slime.width < wall.pos.x + 5) {
        // Slime is to the left of the wall
        slime.pos.x = wall.pos.x - slime.width;
        slime.width--;
      } else {
        // Slime is inside the wall, push it up
        slime.pos.y = wall.pos.y - slime.height;
        slime.isOnGround = true;
      }
    }
  });

  // Apply gravity if not on ground
  if (!slime.isOnGround) {
    slime.pos.y = Math.min(slime.pos.y + 1, 90);
  }

  // Check if slime is on the ground (bottom of the screen)
  if (slime.pos.y + slime.height >= 90) {
    slime.pos.y = 90 - slime.height;
    slime.isOnGround = true;
  }

  // Draw game objects
  color("green");
  rect(slime.pos, slime.width, slime.height);

  color("black");
  walls.forEach((obstacle) => {
    rect(obstacle.pos, obstacle.width, obstacle.height);
  });
  rect(0, 90, 200, 10);

  // Scroll the view
  scrollVelocity = slime.velocity;
  slime.pos.x -= scrollVelocity;
  remove(walls, (w) => {
    w.pos.x -= scrollVelocity;
    return w.pos.x < -w.width;
  });
  color("yellow");
  remove(collectibles, (c) => {
    const cl = char("a", c.pos).isColliding.rect;
    if (cl.black) {
      return true;
    }
    if (cl.green) {
      play("coin");
      addScore(multiplier, c.pos);
      multiplier++;
      return true;
    }
    c.pos.x -= scrollVelocity;
    if (c.pos.x < -3) {
      multiplier--;
      if (multiplier < 1) {
        multiplier = 1;
      }
      return true;
    }
  });
  color("black");
  text(`x${multiplier}`, 2, 10, { isSmallText: true });
}
