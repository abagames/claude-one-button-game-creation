title = "QUANTUM LEAPER";

description = `
[Tap] Change lane
`;

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  audioSeed: 1,
};

// Define variables for objects.
/** @type {{pos: Vector, waveOffset: number, currentUniverse: number, nextAddingScoreOffset: number}} */
let player;
/** @type {{pos: Vector, universe: number}[]} */
let antiParticles;
/** @type {{y: number}[]} */
let universeLanes;
let goldLaneIndex;
let changingGoldLaneTicks;
let multiplier;

// Define variables for the game.
/** @type {number} */
let scrollingSpeed;
const numUniverses = 5;
const waveAmplitude = 10;
const waveFrequency = 0.1;

function update() {
  if (!ticks) {
    initializeGame();
  }

  updateScrollingSpeed();
  updatePlayerPosition();
  handlePlayerInput();
  updateAndDrawUniverseLanes();
  updateAndDrawAntiParticles();
  drawPlayer();
  checkCollisions();
  spawnAntiParticles();

  color("black");
  text(`x${multiplier}`, 2, 9, { isSmallText: true });
}

function initializeGame() {
  player = {
    pos: vec(20, 50),
    waveOffset: 0,
    currentUniverse: 2,
    nextAddingScoreOffset: 0,
  };
  antiParticles = [];
  universeLanes = [];
  for (let i = 0; i < numUniverses; i++) {
    universeLanes.push({ y: 20 + (i * 70) / (numUniverses - 1) });
  }
  goldLaneIndex = 2;
  changingGoldLaneTicks = 300;
  scrollingSpeed = 1;
  multiplier = 1;
}

function updateScrollingSpeed() {
  scrollingSpeed = difficulty;
}

function updatePlayerPosition() {
  player.waveOffset += waveFrequency;
  if (player.waveOffset >= player.nextAddingScoreOffset) {
    if (player.currentUniverse === goldLaneIndex) {
      play("coin");
      addScore(multiplier, player.pos);
      multiplier = clamp(multiplier + 1, 1, 99);
    } else {
      play("hit");
      multiplier = clamp(multiplier - 1, 1, 99);
    }
    player.nextAddingScoreOffset += PI;
  }
  player.pos.y =
    universeLanes[player.currentUniverse].y +
    sin(player.waveOffset) * waveAmplitude;
}

function handlePlayerInput() {
  if (input.isJustPressed) {
    player.currentUniverse = wrap(
      player.currentUniverse + (sin(player.waveOffset) > 0 ? 1 : -1),
      0,
      numUniverses
    );
  }
}

function updateAndDrawUniverseLanes() {
  changingGoldLaneTicks--;
  if (changingGoldLaneTicks < 0) {
    goldLaneIndex = rndi(0, numUniverses);
    changingGoldLaneTicks += 300;
  }
  universeLanes.forEach((lane, i) => {
    color(i === goldLaneIndex ? "yellow" : "light_blue");
    line(0, lane.y, 100, lane.y);
  });
}

function updateAndDrawAntiParticles() {
  color("purple");
  remove(antiParticles, (ap) => {
    ap.pos.x -= scrollingSpeed;
    return box(ap.pos, 3).isColliding.rect.cyan || ap.pos.x < 0;
  });
}

function drawPlayer() {
  color("cyan");
  arc(player.pos, 2);
}

function checkCollisions() {
  const isColliding = box(player.pos, 4).isColliding.rect.purple;
  if (isColliding) {
    play("explosion");
    end();
  }
}

function spawnAntiParticles() {
  if (rnd() < 0.02 * difficulty) {
    play("click");
    const universe = rndi(0, numUniverses);
    antiParticles.push({
      pos: vec(103, universeLanes[universe].y),
      universe: universe,
    });
  }
}
