title = "DARK SORT";

description = `
[Hold] Light gate
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let gate;
let orbs;
let spawnTimer;
let visionRadius;
let combo;

function update() {
  if (!ticks) {
    gate = { x: 50, y: 92, vx: 1, isLight: false };
    orbs = [];
    spawnTimer = 0;
    visionRadius = 55;
    combo = 0;
  }

  gate.isLight = input.isPressed;

  spawnTimer--;
  if (spawnTimer <= 0) {
    let spawnInterval = 30 - floor(difficulty);
    if (spawnInterval < 8) spawnInterval = 8;
    spawnTimer = spawnInterval;

    let numOrbs = 1;
    if (difficulty > 5) numOrbs = rnd() < 0.3 ? 2 : 1;

    for (let i = 0; i < numOrbs; i++) {
      orbs.push({
        x: rnd(12, 88),
        y: -5 - i * 15,
        isWhite: rnd() < 0.5,
        speed: 0.8 * sqrt(difficulty),
      });
    }
  }

  color("light_black");
  rect(0, 0, 100, 100);

  color("white");
  arc(gate.x, gate.y - 25, visionRadius, 6);

  gate.x += gate.vx * sqrt(difficulty);
  if ((gate.x > 90 && gate.vx > 0) || (gate.x < 10 && gate.vx < 0))
    gate.vx *= -1;
  color(gate.isLight ? "white" : "black");
  box(gate.x, gate.y, 24, 5);

  let gameOver = false;

  orbs = orbs.filter((o) => {
    o.y += o.speed;

    let dx = o.x - gate.x;
    let dy = o.y - (gate.y - 25);
    let inVision = sqrt(dx * dx + dy * dy) < visionRadius;

    if (inVision) {
      color(o.isWhite ? "white" : "black");
      box(o.x, o.y, 6);
    }

    if (o.y >= gate.y - 2 && o.y <= gate.y + 3 && abs(o.x - gate.x) < 14) {
      if ((o.isWhite && gate.isLight) || (!o.isWhite && !gate.isLight)) {
        play("coin");
        combo++;
        addScore(combo);
        return false;
      } else {
        play("explosion");
        gameOver = true;
      }
    }

    if (o.y > 100) {
      play("hit");
      combo = 0;
      return false;
    }

    return true;
  });

  if (gameOver) end();
}
