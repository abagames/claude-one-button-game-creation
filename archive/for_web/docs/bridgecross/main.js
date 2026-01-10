title = "BRIDGE CROSS";

description = `
[Hold] Jump
`;

options = {
  viewSize: { x: 150, y: 50 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingScoreFront: true,
  seed: 3,
};

let brigade;
let bridges;
let nextBridgeTicks = 0;
let multiplier;
let nextMultiplierDist;

function update() {
  if (!ticks) {
    brigade = {
      pos: vec(10, 37),
      length: 30,
      vy: 0,
      isJumping: false,
      isFalling: false,
      isOnBridge: false,
    };
    bridges = [];
    multiplier = 1;
    nextMultiplierDist = 0;
  }

  color("light_blue");
  rect(0, 0, 150, 50);
  color("green");
  rect(0, 40, 150, 10);

  if (nextBridgeTicks <= 0) {
    const length = rnd(20, 40);
    bridges.push({ pos: vec(153, 35), length: length });
    nextBridgeTicks = rnd(50, 100);
  }
  nextBridgeTicks -= difficulty;

  bridges.forEach((b) => {
    b.pos.x -= difficulty;
    color("yellow");
    rect(b.pos, b.length, 5);
    color("blue");
    rect(b.pos.x, b.pos.y + 5, b.length, 10);
  });

  let isOnBridge = false;
  bridges.forEach((b) => {
    if (
      brigade.pos.x + brigade.length >= b.pos.x &&
      brigade.pos.x <= b.pos.x + b.length
    ) {
      isOnBridge = true;
    }
  });

  bridges = bridges.filter((b) => b.pos.x + b.length > 0);

  if (brigade.pos.y < 35 && !brigade.isFalling && !isOnBridge) {
    brigade.isFalling = true;
    brigade.isOnBridge = false;
  }
  if (brigade.isJumping || brigade.isFalling) {
    brigade.pos.y += brigade.vy;
    brigade.vy += (input.isPressed ? 0.1 : 0.2) * difficulty;
    if (isOnBridge && brigade.pos.y > 32 && brigade.vy > 0) {
      brigade.isJumping = brigade.isFalling = false;
      brigade.isOnBridge = true;
      brigade.pos.y = 32;
      brigade.vy = 0;
    }
    if (!isOnBridge && brigade.pos.y > 37 && brigade.vy > 0) {
      brigade.isJumping = brigade.isFalling = false;
      brigade.pos.y = 37;
      brigade.vy = 0;
    }
  }
  if (!brigade.isJumping && input.isJustPressed) {
    play("jump");
    brigade.isJumping = true;
    brigade.isOnBridge = false;
    brigade.vy = -2 * sqrt(difficulty);
    multiplier = ceil(multiplier / 2);
  }
  if (brigade.isOnBridge) {
    nextMultiplierDist -= difficulty;
    if (nextMultiplierDist < 0) {
      play("coin");
      addScore(
        multiplier,
        brigade.pos.x + clamp(multiplier * 3, 0, 50),
        brigade.pos.y
      );
      nextMultiplierDist = 10;
      multiplier++;
    }
  }
  if (!brigade.isJumping && brigade.pos.y > 32 && isOnBridge) {
    play("explosion");
    end();
  }

  color("black");
  rect(brigade.pos, brigade.length, 3);
  text(`x${multiplier}`, 3, 9);
}
