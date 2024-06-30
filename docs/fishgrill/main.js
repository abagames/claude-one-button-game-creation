title = "FISH GRILL";

description = `
[Hold] Burn up
`;

characters = [
  `
  l
l lll
llll l
llllll
l lll
  l
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 1,
};

// Define variables for objects
/** @type {{ pos: Vector, velocity: Vector, energy: number, baseEnergy: number }} */
let ember;

/** @type {{ pos: Vector, width: number, isBurned: boolean }[]} */
let fishes;

/** @type {{ pos: Vector, timeLeft: number }[]} */
let updrafts;

// Define variables for game
/** @type {Vector} */
let scrollSpeed;
const gravity = 0.1;
const updraftForce = -1;
const initialEnergy = 100;
const minFishSpacing = 50;
const maxFishSpacing = 80;
const minFishWidth = 10;
const maxFishWidth = 20;

function update() {
  if (!ticks) {
    // Initialize the game state
    ember = {
      pos: vec(20, 50),
      velocity: vec(0, 0),
      energy: initialEnergy,
      baseEnergy: initialEnergy,
    };
    fishes = [{ pos: vec(100, 50), width: 15, isBurned: false }];
    updrafts = [];
    scrollSpeed = vec(-1, 0);
  }

  // Update ember
  ember.velocity.y += gravity;
  ember.pos.add(ember.velocity);
  ember.baseEnergy += 0.1;
  ember.energy += (ember.baseEnergy - ember.energy) * 0.01;
  const emberRadius = 1 + (ember.energy / initialEnergy) * 2;

  // Handle button press (create updraft)
  if (input.isPressed) {
    ember.velocity.y = updraftForce;
    updrafts.push({
      pos: vec(ember.pos.x, ember.pos.y + emberRadius),
      timeLeft: 10,
    });
  }
  if (input.isJustPressed) {
    play("select");
  }

  // Draw ember (size based on energy)
  color("purple");
  arc(ember.pos, emberRadius);

  // Update updrafts
  remove(updrafts, (updraft) => {
    updraft.timeLeft--;

    // Draw effect
    color("red");
    for (let i = 0; i < 3; i++) {
      const x = updraft.pos.x + rnd(-2, 2);
      const y = updraft.pos.y + rnd(0, 5);
      const size = rnd(1, 3);
      // Draw small upward-pointing triangles using lines
      line(x - size / 2, y + size / 2, x, y - size / 2);
      line(x, y - size / 2, x + size / 2, y + size / 2);
      line(x + size / 2, y + size / 2, x - size / 2, y + size / 2);
    }

    return updraft.timeLeft <= 0;
  });

  // Update signal fire locations
  remove(fishes, (fish) => {
    fish.pos.add(scrollSpeed);

    // Draw platforms
    color(fish.isBurned ? "black" : "cyan");
    const collision = char("a", fish.pos, {
      scale: { x: fish.width / 6 },
      mirror: { x: -1 },
    });

    // Check collision with ember
    if (collision.isColliding.rect.red) {
      ember.energy += 5;
      if (!fish.isBurned) {
        play("powerUp");
        addScore(floor(ember.energy / 10), fish.pos);
        fish.isBurned = true;
      } else {
        addScore(floor(ember.energy / 100));
      }
    }
    if (collision.isColliding.rect.purple) {
      play("explosion");
      end();
    }
    return fish.pos.x + fish.width < 0;
  });

  // Spawn new locations
  if (fishes[fishes.length - 1].pos.x < 100) {
    play("click");
    const lastFish = fishes[fishes.length - 1];
    const newX = lastFish.pos.x + rnd(minFishSpacing, maxFishSpacing);
    const newY = rnd(10, 90);
    const newWidth = rnd(minFishWidth, maxFishWidth);
    fishes.push({ pos: vec(newX, newY), width: newWidth, isBurned: false });
  }

  // Game over condition
  if (ember.pos.y < -emberRadius || ember.pos.y > 100 + emberRadius) {
    play("explosion");
    end();
  }
}
