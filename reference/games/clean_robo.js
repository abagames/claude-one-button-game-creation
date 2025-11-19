title = "CLEAN ROBO";

description = `
[Hold] Speed up
`;

characters = [];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 9,
};

const robotRadius = 10;
/** @type {{ pos: Vector, angle: number, vx: number, speed: number }} */
let robot;
/** @type {{poss: Vector[], dist: number, angle: number}[]} */
let walls;
/** @type {Vector} */
let garbage;
/** @type {Vector} */
let leftGarbage;
let multiplier;

function update() {
  if (!ticks) {
    robot = { pos: vec(90, 50), angle: 0, vx: 1, speed: 1 };
    walls = times(2, () => {
      return { poss: times(3, () => vec()), dist: 50, angle: 0 };
    });
    setWall(0, true);
    setWall(1, true);
    multiplier = 1;
    leftGarbage = undefined;
  }
  drawRoom();
  const gs = 4;
  if (leftGarbage != null) {
    color("red");
    box(leftGarbage, gs);
  }
  if (garbage != null) {
    color("yellow");
    box(garbage, gs);
  }
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isPressed) {
    robot.speed += 0.3;
  } else {
    robot.angle += 0.05 * difficulty;
    robot.speed += (1 - robot.speed) * 0.2;
    if (multiplier > 1) {
      multiplier -= 0.1;
    }
  }
  robot.pos.x += robot.vx * robot.speed * difficulty * 0.2;
  let icw = false;
  let icg = false;
  color("light_black");
  const rps = times(3, (i) => {
    const p = vec(robotRadius)
      .rotate(robot.angle + ((PI * 2) / 3) * i)
      .add(robot.pos);
    bar(p, 5, 3, ticks * 0.7 + i);
    return p;
  });
  color("black");
  times(3, (i) => {
    const c = line(rps[i], rps[wrap(i + 1, 0, 3)]);
    if (c.isColliding.rect.purple) {
      icw = true;
    }
    if (c.isColliding.rect.yellow) {
      icg = true;
    }
  });
  text(`x${ceil(multiplier)}`, 3, 9);
  if (icg) {
    play("powerUp");
    addScore(ceil(multiplier), garbage);
    multiplier += 10;
    garbage = undefined;
  }
  if ((robot.pos.x - 100) * robot.vx > 0 && icw) {
    robot.vx *= -1;
    leftGarbage = undefined;
    if (garbage != null) {
      play("explosion");
      leftGarbage = vec(garbage);
      robot.speed = 1;
      color("red");
      particle(garbage);
    } else {
      play("click");
    }
    const wli = (-robot.vx + 1) / 2;
    walls[wli].dist = clamp(
      walls[wli].dist + (garbage == null ? -10 : 20),
      30,
      100
    );
    setWall(wli, true);
    const wai = (robot.vx + 1) / 2;
    setWall(wai, false);
  }
}

function setWall(index, isChangingAngle) {
  const w = walls[index];
  const a = isChangingAngle ? rnds(PI / 7) : w.angle;
  const rr = robotRadius * 1.7;
  w.poss.forEach((p, i) => {
    p.set(rr);
    if (index == 0) {
      p.rotate(a + PI - ((PI * 2) / 3) * (i - 1)).add(100 - w.dist, 50);
    } else {
      p.rotate(a - ((PI * 2) / 3) * (-i + 1)).add(100 + w.dist, 50);
    }
  });
  w.angle = a;
  const p = w.poss[1];
  garbage = vec(p.x - 7 * (index * 2 - 1), (p.y - 50) * 0.5 + 50);
}

function drawRoom() {
  walls.forEach((w) => {
    color("purple");
    const ps = w.poss;
    const p = ps[1];
    if (p.x < 0 || p.x > 199) {
      color("red");
      play("random");
      end();
    }
    line(ps[0].x, 0, ps[0]);
    line(ps[0], ps[1]);
    line(ps[1], ps[2]);
    line(ps[2], ps[2].x, 99);
  });
}
