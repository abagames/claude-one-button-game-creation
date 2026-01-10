title = "FALL BOUNCE";

description = `
[Hold]
 Fall & Bounce
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

let platforms, whale;
let nextPlatformTicks;
const platformWidth = 15;

function update() {
  if (!ticks) {
    platforms = [];
    for (let i = 0; i < 2; i++) {
      spawnPlatform();
    }

    whale = { pos: vec(50, 10), vx: 1, width: 10, targetY: undefined };

    nextPlatformTicks = 0;
  }

  if (whale.targetY != null) {
    whale.pos.y += (whale.targetY - whale.pos.y) * 0.2;
    if (abs(whale.targetY - whale.pos.y) < 1) {
      whale.targetY = undefined;
    }
  } else {
    const fallSpeed = input.isPressed ? difficulty * 1.5 : difficulty * 0.25;
    whale.pos.y += fallSpeed;
  }
  whale.pos.x = wrap(whale.pos.x + whale.vx, 0, 100);

  color(input.isPressed ? "cyan" : "light_black");
  box(whale.pos, whale.width, 3);

  if (whale.pos.y > 103) {
    play("hit");
    end();
  }

  nextPlatformTicks--;
  if (nextPlatformTicks < 0) {
    for (let i = 0; i < 2; i++) {
      spawnPlatform();
    }
    nextPlatformTicks = ceil(rnd(40, 60) / difficulty);
  }

  platforms.forEach((p) => {
    p.pos.y += difficulty * 1;
    color("blue");
    const isLanded =
      box(p.pos, p.width, 5).isColliding.rect.cyan && whale.targetY == null;
    if (isLanded) {
      play("powerUp");
      addScore(whale.pos.y - 10, p.pos);
      whale.targetY = 10;
    }
  });

  platforms = platforms.filter((p) => p.pos.y < 103);
}

function spawnPlatform() {
  platforms.push({
    pos: vec(rnd(100 - platformWidth), -5),
    width: rnd(platformWidth, 35),
  });
}
