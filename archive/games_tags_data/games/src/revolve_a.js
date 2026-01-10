title = "REVOLVE A";

description = `
[Tap]
 Go forward
`;

characters = [
  `
 rrr
rrRrr
rRrLr
rrLLr
 rrr
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

/** @type {{pos: Vector, vel: Vector, angle: number}} */
let arrow;
/** @type {{pos: Vector, vel: Vector, isRemoved: boolean}[]} */
let enemies;
let nextEnemyTicks;
let multiplier;
const lineDist = 30;

function update() {
  if (!ticks) {
    arrow = { pos: vec(50, 50), vel: vec(1).rotate(PI / 4), angle: -PI / 2 };
    enemies = [];
    nextEnemyTicks = 0;
    multiplier = 1;
  }
  nextEnemyTicks--;
  if (nextEnemyTicks < 0) {
    const pos = vec(rnd(99), rnd() < 0.5 ? -3 : 103);
    if (rnd() < 0.5) {
      pos.swapXy();
    }
    enemies.push({
      pos,
      vel: vec(rnd(1, sqrt(difficulty)))
        .mul(0.3)
        .rotate(pos.angleTo(rnd(10, 90), rnd(10, 90))),
      isRemoved: false,
    });
    nextEnemyTicks = rnd(30, 40) / difficulty;
  }
  multiplier = 1;
  remove(enemies, (e) => {
    color("green");
    if (e.isRemoved) {
      particle(e.pos);
      addScore(multiplier, e.pos);
      multiplier++;
      return true;
    }
    e.pos.add(e.vel);
    enemies.forEach((ae) => {
      if (e === ae || e.pos.distanceTo(ae.pos) >= lineDist) {
        return;
      }
      line(e.pos, ae.pos);
    });
    return !e.pos.isInRect(-5, -5, 110, 110);
  });
  color("black");
  enemies.forEach((e) => {
    char("a", e.pos);
  });
  if (input.isJustPressed) {
    play("laser");
    arrow.vel.set(1).rotate(arrow.angle);
  }
  if (
    (arrow.pos.x < 3 && arrow.vel.x < 0) ||
    (arrow.pos.x > 97 && arrow.vel.x > 0)
  ) {
    arrow.vel.x *= -1;
  }
  if (
    (arrow.pos.y < 3 && arrow.vel.y < 0) ||
    (arrow.pos.y > 97 && arrow.vel.y > 0)
  ) {
    arrow.vel.y *= -1;
  }
  arrow.pos.add(vec(arrow.vel).mul(sqrt(difficulty) * 0.4));
  arrow.angle += 0.08 * sqrt(difficulty);
  color(input.isJustPressed ? "red" : "blue");
  const p = vec(arrow.pos).addWithAngle(arrow.angle, 2);
  let c = line(
    p,
    vec(arrow.pos).addWithAngle(arrow.angle + PI, 2),
    2
  ).isColliding;
  c = {
    ...c,
    ...line(p, vec(arrow.pos).addWithAngle(arrow.angle + PI / 2, 2), 2)
      .isColliding,
  };
  c = {
    ...c,
    ...line(p, vec(arrow.pos).addWithAngle(arrow.angle - PI / 2, 2), 2)
      .isColliding,
  };
  if (c.char.a) {
    play("explosion");
    end();
  } else if (c.rect.green) {
    play("powerUp");
    removeAroundEnemy(arrow.pos);
  }

  function removeAroundEnemy(p) {
    enemies.forEach((e) => {
      if (!e.isRemoved && e.pos.distanceTo(p) < lineDist) {
        e.isRemoved = true;
        removeAroundEnemy(e.pos);
      }
    });
  }
}
