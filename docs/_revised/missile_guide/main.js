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

function update() {
  if (!ticks) {
    missile = { x: 50, y: 65 };
    outposts = [];
    obstacles = [];
    scrollSpeed = 0.6;
    nextSpawn = 30;
    fuel = 100;
    combo = 0;
    lastOutpostX = 50;
  }

  scrollSpeed = 0.6 * difficulty;
  let frozen = input.isPressed;

  if (frozen) {
    fuel -= 0.4;
  } else {
    fuel = Math.min(fuel + 0.1, 100);
  }

  if (fuel <= 0) {
    play("explosion");
    end();
  }

  color("light_black");
  rect(3, 97, fuel * 0.94, 2);

  nextSpawn--;
  if (nextSpawn <= 0) {
    let newX = lastOutpostX + rnd(-40, 40);
    newX = clamp(newX, 12, 88);
    if (rnd() < 0.8) {
      outposts.push({ x: newX, y: -5 });
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

  color("cyan");
  box(missile.x, missile.y, 4, 7);
  if (frozen) {
    color("light_cyan");
    arc(missile.x, missile.y, 8, 2);
  }

  remove(outposts, (o) => {
    o.y += scrollSpeed;
    color("yellow");
    let col = box(o.x, o.y, 6, 6);
    if (!frozen && col.isColliding.rect.cyan) {
      play("coin");
      combo++;
      addScore(1 + floor(combo / 3));
      fuel = Math.min(fuel + 12, 100);
      particle(o.x, o.y, 8, 1.5, 0, PI / 2);
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
      end();
    }
    return o.y > 105;
  });
}
