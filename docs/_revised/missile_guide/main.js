title = "MISSILE GUIDE";

description = `
[Hold] Freeze
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let missile;
let outposts;
let obstacles;
let scrollSpeed;
let nextSpawn;
let fuel;
let combo;
let lastOutpostX;
let trail;
let wasFrozen;
let squashTime;

function update() {
  if (!ticks) {
    missile = { x: 50, y: 65, vx: 0, vy: 0 };
    outposts = [];
    obstacles = [];
    scrollSpeed = 0.6;
    nextSpawn = 30;
    fuel = 100;
    combo = 0;
    lastOutpostX = 50;
    trail = [];
    wasFrozen = false;
    squashTime = 0;
  }

  scrollSpeed = 0.6 * difficulty;
  let frozen = input.isPressed;

  // Freeze state change effects
  if (frozen && !wasFrozen) {
    squashTime = 10;
    color("light_cyan");
    particle(missile.x, missile.y, 12, 1, 0, PI * 2);
  }
  if (!frozen && wasFrozen) {
    squashTime = -10;
    color("cyan");
    particle(missile.x, missile.y, 8, 2, -PI / 2, PI / 4);
  }
  wasFrozen = frozen;

  if (squashTime > 0) squashTime--;
  if (squashTime < 0) squashTime++;

  if (frozen) {
    fuel -= 0.4;
  } else {
    fuel = Math.min(fuel + 0.1, 100);
  }

  if (fuel <= 0) {
    play("explosion");
    color("red");
    particle(missile.x, missile.y, 30, 3, 0, PI * 2);
    end();
  }

  // Low fuel warning particles
  if (fuel < 20 && ticks % 10 === 0) {
    color("red");
    particle(missile.x, missile.y + 5, 3, 0.5, PI / 2, PI / 4);
  }

  color("light_black");
  rect(3, 97, fuel * 0.94, 2);

  nextSpawn--;
  if (nextSpawn <= 0) {
    let newX = lastOutpostX + rnd(-40, 40);
    newX = clamp(newX, 12, 88);
    if (rnd() < 0.8) {
      outposts.push({ x: newX, y: -5, pulsePhase: rnd(0, PI * 2) });
      lastOutpostX = newX;
    }

    if (ticks > 60 && rnd() < 0.6) {
      let gapW = clamp(30, 16, 30);
      let gapX = newX + rnd(-20, 20);
      gapX = clamp(gapX, gapW / 2 + 5, 100 - gapW / 2 - 5);
      obstacles.push({ y: -10, gapX: gapX, gapW: gapW });
    }
    nextSpawn = clamp(50 / difficulty, 25, 50);
  }

  let prevX = missile.x;
  let prevY = missile.y;

  if (!frozen) {
    let targetX = null;
    let targetY = null;
    let minDist = 999;
    outposts.forEach((o) => {
      if (o.y > missile.y - 60 && o.y < missile.y + 40) {
        let d = abs(o.y - missile.y);
        if (d < minDist) {
          minDist = d;
          targetX = o.x;
          targetY = o.y;
        }
      }
    });
    if (targetX !== null) {
      let dx = targetX - missile.x;
      let dy = targetY - missile.y;
      missile.x += clamp(dx * 0.03 * difficulty, -0.8, 0.8);
      missile.y += clamp(dy * 0.01 * difficulty, -0.8, 0.8);
    }
  }

  missile.x = clamp(missile.x, 6, 94);
  missile.y = clamp(missile.y, 60, 90);

  missile.vx = missile.x - prevX;
  missile.vy = missile.y - prevY;

  // Trail effect
  if (!frozen && (abs(missile.vx) > 0.1 || abs(missile.vy) > 0.1)) {
    trail.push({ x: missile.x, y: missile.y, age: 0 });
  }
  trail = trail.filter((t) => {
    t.age++;
    if (t.age > 8) return false;
    let alpha = 1 - t.age / 8;
    color("light_cyan");
    let size = 3 * alpha;
    box(t.x, t.y + t.age * 0.5, size, size * 1.5);
    return true;
  });

  // Draw missile with squash/stretch and tilt
  let mWidth = 4;
  let mHeight = 7;

  // Squash/stretch based on state
  if (squashTime > 0) {
    mWidth = 4 + squashTime * 0.3;
    mHeight = 7 - squashTime * 0.4;
  } else if (squashTime < 0) {
    mWidth = 4 + squashTime * 0.2;
    mHeight = 7 - squashTime * 0.5;
  }

  // Tilt based on x velocity (base rotation -PI/2 for vertical orientation)
  let tilt = clamp(missile.vx * 0.3, -0.4, 0.4);

  color("cyan");
  bar(missile.x, missile.y, mHeight, mWidth, -PI / 2 + tilt);

  if (frozen) {
    color("light_cyan");
    let pulseSize = 8 + sin(ticks * 0.2) * 2;
    arc(missile.x, missile.y, pulseSize, 2);
  }

  remove(outposts, (o) => {
    o.y += scrollSpeed;
    o.pulsePhase += 0.15;

    // Pulsing outpost (breathing effect)
    let pulse = 1 + sin(o.pulsePhase) * 0.15;
    let size = 6 * pulse;

    color("yellow");
    let col = box(o.x, o.y, size, size);
    if (!frozen && col.isColliding.rect.cyan) {
      play("coin");
      combo++;
      addScore(1 + floor(combo / 3));
      fuel = Math.min(fuel + 12, 100);
      particle(o.x, o.y, 12, 2, 0, PI * 2);
      return true;
    }
    if (o.y > 105) {
      combo = 0;
      return true;
    }
    return false;
  });

  remove(obstacles, (o) => {
    o.y += scrollSpeed;
    color("red");
    let leftW = o.gapX - o.gapW / 2;
    let rightX = o.gapX + o.gapW / 2;
    let rightW = 100 - rightX;
    let hitLeft = false;
    let hitRight = false;
    if (leftW > 2) {
      let colL = box(leftW / 2, o.y, leftW, 5);
      hitLeft = colL.isColliding.rect.cyan;
    }
    if (rightW > 2) {
      let colR = box(rightX + rightW / 2, o.y, rightW, 5);
      hitRight = colR.isColliding.rect.cyan;
    }
    if (!frozen && (hitLeft || hitRight)) {
      play("explosion");
      color("yellow");
      particle(missile.x, missile.y, 25, 3, 0, PI * 2);
      end();
    }
    return o.y > 105;
  });
}
