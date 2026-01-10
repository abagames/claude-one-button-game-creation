title = "T LANES";

description = `
[Tap]
 Change direction
`;

characters = [
  `
yyyyy
yllly
yllly
yyyyy
`,
  `
 yyy
yllly
 yllly
  yllly
   yyy
`,
  `
rrrrr
 rrrr
  rrr
   rr
    r
`,
  `
l
lll
lllll
lll
l
`,
  `
    b
   bb
  bbb
 bbbb
bbbbb
`,
  `
pLwwLp
LpwwpL
wwwwww
LpwwpL
pLwwLp
`,
];

options = {
  theme: "shape",
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 9,
};

/** @type {{pos: Vector, angle: -1 | 1, currentAngle: -1 | 0 | 1}[]} */
let crosses;
let nextCrossDist;
let nextCrossLanes;
let crossCount;
/** @type {Vector[]} */
let stops;
let nextStopDist;
/**
 * @type {{
 * pos: Vector, angle: -1 | 0 | 1, speed: number, ty: number, onArrow: boolean,
 * invDist: number
 * }[]}
 */
let cars;
let nextCarDist;
let scr;
let scrOfs;
const laneCount = 5;
const laneInterval = (100 - 20) / (laneCount - 1);

function update() {
  if (!ticks) {
    crosses = [];
    nextCrossDist = 0;
    nextCrossLanes = undefined;
    crossCount = 0;
    stops = [];
    nextStopDist = 199;
    const cy = 10 + laneInterval * floor(laneCount / 2);
    cars = [
      {
        pos: vec(20, cy),
        angle: 0,
        speed: 0.1,
        ty: 0,
        onArrow: false,
        invDist: 0,
      },
      {
        pos: vec(99, cy),
        angle: 0,
        speed: 0,
        ty: 0,
        onArrow: false,
        invDist: 0,
      },
    ];
    nextCarDist = 0;
    scr = 0;
    scrOfs = 0;
  }
  let carCount = 0;
  cars.forEach((c) => {
    if (c.speed > 0) {
      carCount++;
    }
  });
  if (carCount === 0) {
    end();
  }
  nextCrossDist -= scr;
  if (nextCrossDist < 0) {
    addScore(carCount);
    crossCount--;
    if (crossCount < 0) {
      nextCrossLanes = times(
        laneCount * 2,
        (i) => !(i === laneCount - 1 || i === laneCount)
      );
      crossCount = laneCount * 2 - 3;
    }
    let i = rndi(laneCount * 2);
    while (!nextCrossLanes[i]) {
      i = wrap(i + 1, 0, laneCount * 2);
    }
    nextCrossLanes[i] = false;
    const angle = i < laneCount ? 1 : -1;
    const currentAngle = rnd() < 0.5 ? 0 : angle;
    crosses.push({
      pos: vec(200, 10 + laneInterval * (i % laneCount)),
      angle,
      currentAngle,
    });
    nextCrossDist = 24;
  }
  color("light_black");
  times(laneCount, (i) => {
    const y = 10 + laneInterval * i;
    rect(0, y - 1, 200, 1);
    rect(0, y + 1, 200, 1);
  });
  if (input.isJustPressed) {
    play("select");
  }
  remove(crosses, (c) => {
    c.pos.x -= scr;
    if (input.isJustPressed) {
      c.currentAngle = c.currentAngle === 0 ? c.angle : 0;
    }
    color(
      c.currentAngle === 0
        ? "light_black"
        : c.currentAngle === -1
        ? "red"
        : "blue"
    );
    line(
      c.pos.x,
      c.pos.y - 1,
      c.pos.x + laneInterval,
      c.pos.y - 1 + laneInterval * c.angle,
      1
    );
    line(
      c.pos.x,
      c.pos.y + 1,
      c.pos.x + laneInterval,
      c.pos.y + 1 + laneInterval * c.angle,
      1
    );
    color("black");
    char(addWithCharCode("c", c.currentAngle + 1), c.pos.x + 3, c.pos.y);
    return c.pos.x < -laneInterval;
  });
  nextStopDist -= scr;
  if (nextStopDist < 0) {
    stops.push(vec(205, 10 + laneInterval * rndi(laneCount)));
    nextStopDist += rnd(99, 120);
  }
  color("black");
  remove(stops, (s) => {
    s.x -= scr;
    const c = char("f", s).isColliding.char;
    if (c.c || c.d || c.e) {
      return true;
    }
    return s.x < -3;
  });
  nextCarDist -= scr;
  if (nextCarDist < 0) {
    cars.push({
      pos: vec(203, 10 + laneInterval * rndi(laneCount)),
      angle: 0,
      speed: 0,
      ty: 0,
      onArrow: false,
      invDist: 0,
    });
    nextCarDist += rnd(40, 60);
  }
  let maxX = 0;
  remove(cars, (c) => {
    c.pos.x -= scr;
    if (input.isJustPressed && c.pos.x < 50) {
      c.pos.x -= (50 - c.pos.x) * 0.1;
    }
    if (c.speed > 0) {
      c.speed += (1 - c.speed) * 0.05;
    }
    c.pos.addWithAngle((PI / 4) * c.angle, c.speed * sqrt(difficulty));
    if (
      (c.angle === -1 && c.pos.y < c.ty) ||
      (c.angle === 1 && c.pos.y > c.ty)
    ) {
      c.pos.y = c.ty;
      c.angle = 0;
      c.invDist = 5;
    }
    color("black");
    const cl = char(c.angle === 0 ? "a" : "b", c.pos, {
      mirror: { y: c.angle === 0 ? 1 : c.angle },
    }).isColliding.char;
    c.invDist -= sqrt(difficulty);
    if (c.angle === 0 && c.invDist < 0 && cl.f) {
      if (c.speed > 0) {
        play("explosion");
        particle(c.pos);
      }
      return true;
    }
    if (c.speed === 0 && cl.a) {
      play("powerUp");
      addScore(carCount * 10, c.pos);
      c.speed = rnd(0.01, 0.3);
    }
    if (c.speed > 0 && c.angle === 0) {
      if (!c.onArrow) {
        const na = cl.c ? -1 : cl.e ? 1 : 0;
        if (na !== 0) {
          play("laser");
          color("transparent");
          for (let i = 0; i < 9; i++) {
            c.pos.x--;
            const cl = char("a", c.pos).isColliding.char;
            if (!(cl.c || cl.e)) {
              break;
            }
          }
          c.angle = na;
          c.ty = c.pos.y + laneInterval * na;
          c.onArrow = true;
        }
        if (cl.d) {
          c.onArrow = true;
        }
      } else {
        if (!(cl.c || cl.d || cl.e)) {
          c.onArrow = false;
        }
      }
    }
    if (c.speed > 0 && c.pos.x > maxX) {
      maxX = c.pos.x;
    }
    return c.pos.x < -3;
  });
  if (cars.length === 0) {
    end();
  }
  scr = maxX > 50 ? (maxX - 50) * 0.1 : 0;
}
