title = "MORTAR";

description = `
[Hold]
 Adjust distance
[Release]
 Fire
`;

characters = [
  `
  ll
  ll
  ll
l ll l
llllll
ll  ll
`,
  `
llllll
 l  l
 l  l
llllll
  ll
  ll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 3,
};

/** @type {{pos: Vector, vy: number}[]} */
let enemies;
let nextEnemyTicks;
let maxEnemyY;
/** @type {{pos: Vector, vx: number, sightY: number}} */
let mortar;
/** @type {{pos: Vector, width: number}} */
let shot;
/** @type {{pos: Vector, targetRadius: number, radius: number}} */
let explosion;
let oy;
let endCount;
let multiplier;
let sightSpeedRatio;
/** @type {Vector[]} */
let grounds;

function update() {
  if (!ticks) {
    enemies = times(5, () => {
      return { pos: vec(rnd(49, 60), rnd(-149, -140)), vy: 0.1 };
    });
    nextEnemyTicks = 0;
    maxEnemyY = 0;
    mortar = { pos: vec(30, 95), vx: 1, sightY: undefined };
    shot = { pos: vec(), width: undefined };
    explosion = { pos: vec(), targetRadius: undefined, radius: undefined };
    oy = 0;
    endCount = 0;
    multiplier = 1;
    sightSpeedRatio = 3;
    grounds = times(99, () => vec(rnd(99), rnd(-300, 100)));
  }
  color("light_black");
  grounds.forEach((g) => {
    box(g.x, g.y + oy, 3, 1);
  });
  if (explosion.radius != null) {
    color("red");
    explosion.radius += (explosion.targetRadius - explosion.radius) * 0.1;
    arc(explosion.pos.x, explosion.pos.y + oy, explosion.radius, 5);
    if (explosion.targetRadius - explosion.radius < 1) {
      explosion.radius = undefined;
    }
  } else if (mortar.sightY != null) {
    mortar.sightY -= sqrt(difficulty) * 2 * sightSpeedRatio;
    let radius = 0;
    if (mortar.sightY < 0) {
      oy +=
        (90 - mortar.sightY - oy) * (0.05 * sqrt(difficulty) * sightSpeedRatio);
      radius = clamp(-mortar.sightY * 0.3, 0, 30);
    }
    radius += 2;
    color("black");
    arc(mortar.pos.x, mortar.sightY + oy, radius, 2);
    if (input.isJustReleased || mortar.sightY < -200) {
      if (radius === 2) {
        if (shot.width == null) {
          play("laser");
          shot.pos.set(mortar.pos);
          shot.width = ceil((91 - mortar.sightY) * 0.2);
        }
      } else {
        play("explosion");
        explosion.targetRadius = radius;
        explosion.radius = 0;
        explosion.pos.set(mortar.pos.x, mortar.sightY);
      }
      mortar.sightY = undefined;
      if (sightSpeedRatio > 1) {
        sightSpeedRatio--;
      }
    }
  } else {
    oy *= 0.8;
    mortar.pos.x += mortar.vx * difficulty;
    if (
      (mortar.pos.x < 3 && mortar.vx < 0) ||
      (mortar.pos.x > 96 && mortar.vx > 0)
    ) {
      mortar.vx *= -1;
    }
    if (input.isJustPressed) {
      play("select");
      mortar.sightY = 90;
      multiplier = 1;
    }
  }
  if (shot.width != null) {
    shot.pos.y -= sqrt(difficulty) * 3;
    color("red");
    box(shot.pos.x, shot.pos.y + oy, shot.width, 6);
    if (shot.pos.y < -3) {
      shot.width = undefined;
    }
  }
  if (endCount > 0) {
    oy *= 0.5;
    if (endCount > 9) {
      end();
    }
  }
  color("black");
  char("a", mortar.pos.x, mortar.pos.y + oy);
  if (enemies.length === 0) {
    nextEnemyTicks = 0;
  }
  nextEnemyTicks--;
  if (nextEnemyTicks < 0) {
    const vy = rnd(0.5, sqrt(difficulty) * 2) * 0.1;
    const x = rnd(20, 80);
    times(rndi(5, 9), () => {
      enemies.push({
        pos: vec(x + rnds(9), -280 + rnds(9)),
        vy: vy * rnd(0.9, 1.1),
      });
    });
    nextEnemyTicks = (99 * sqrt(enemies.length)) / difficulty;
  }
  color("red");
  let my = -200;
  remove(enemies, (e) => {
    const c = char("b", e.pos.x, e.pos.y + oy).isColliding.rect;
    if (e.pos.y > 99) {
      play("lucky");
      text("X", e.pos.x, 97);
      endCount++;
    } else {
      let vy = (e.vy * sqrt(120 - maxEnemyY)) / 4;
      if (mortar.sightY != null) {
        vy *= 0.3;
      }
      e.pos.y += vy;
      if (c.red) {
        play("powerUp");
        addScore(multiplier, e.pos.x, e.pos.y + oy);
        multiplier++;
        return true;
      }
      if (e.pos.y > my) {
        my = e.pos.y;
      }
    }
  });
  maxEnemyY = my;
}
