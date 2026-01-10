title = "LINE B";

description = `
[Tap] Grow
`;

characters = [];

options = {
  theme: "shape",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 30,
};

/** @type {{pos: Vector, vel: Vector}[]} */
let points;
/** @type {{p1: Vector, p2: Vector}[]} */
let pointsHistory;
/** @type {{pos: Vector, radius: number}} */
let gold;

function update() {
  if (!ticks) {
    points = times(2, (i) => {
      return {
        pos: vec(50, 50),
        vel: vec(1, 0).rotate(rnds(PI / 3) + i * PI),
      };
    });
    pointsHistory = [];
    gold = undefined;
  }
  if (gold == null) {
    color("white");
    line(points[0].pos, points[1].pos, 20);
    let pos = vec();
    color("transparent");
    for (let i = 0; i < 99; i++) {
      pos.set(vec(rnd(20, 80), rnd(20, 80)));
      if (!box(pos, 20).isColliding.rect.white) {
        break;
      }
    }
    gold = { pos, radius: 1 };
  }
  color("light_black");
  pointsHistory.forEach((ph, i) => {
    if (i % 9 === 8) {
      line(ph.p1, ph.p2, clamp(4 - ceil(i / 9), 1, 3));
    }
  });
  color("light_purple");
  rect(0, 0, 100, 3);
  rect(0, 97, 100, 3);
  rect(0, 0, 3, 100);
  rect(97, 0, 3, 100);
  color("yellow");
  let isHittingWall = false;
  if (arc(gold.pos, gold.radius).isColliding.rect.light_purple) {
    isHittingWall = true;
  }
  gold.radius += 0.05 * difficulty;
  if (input.isJustPressed) {
    play("laser");
    const cp = vec(points[0].pos).add(points[1].pos).div(2);
    points.forEach((p, i) => {
      p.vel.addWithAngle(p.pos.angleTo(cp), 9);
    });
  }
  points.forEach((p) => {
    p.pos.add(vec(p.vel).mul(sqrt(difficulty)));
    if ((p.pos.x < 4 && p.vel.x < 0) || (p.pos.x > 96 && p.vel.x > 0)) {
      play("hit");
      p.vel.x *= -1;
      p.vel.y += rnds(0.1, 0.2) / (abs(p.vel.y) + 1);
    }
    if ((p.pos.y < 5 && p.vel.y < 0) || (p.pos.y > 96 && p.vel.y > 0)) {
      play("hit");
      p.vel.y *= -1;
      p.vel.x += rnds(0.1, 0.2) / (abs(p.vel.x) + 1);
    }
    if (p.vel.length > 1) {
      p.vel.mul(0.9);
    }
    p.vel.mul(0.999);
  });
  pointsHistory.unshift({ p1: vec(points[0].pos), p2: vec(points[1].pos) });
  if (pointsHistory.length > 48) {
    pointsHistory.pop();
  }
  color("purple");
  if (line(points[0].pos, points[1].pos).isColliding.rect.yellow) {
    play("powerUp");
    addScore(ceil(gold.radius * sqrt(gold.radius)), gold.pos);
    gold = undefined;
  } else if (isHittingWall) {
    play("explosion");
    color("red");
    for (let i = 0; i < 4; i++) {
      const p = vec(gold.pos).addWithAngle((i * PI) / 2, gold.radius);
      if (p.x < 5 || p.x > 95 || p.y < 5 || p.y > 95) {
        text("X", p);
      }
    }
    end();
  }
}
