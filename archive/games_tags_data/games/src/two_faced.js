title = "TWO FACED";

description = `
[Tap]  Turn
[Hold] Go forward
`;

characters = [
  `
 RRRR
Rr rrR
R rrrR
RrrrrR
RrrrrR
 RRRR
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isDrawingScoreFront: true,
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 9,
};

/**
 * @type {{
 * pos: Vector, side: number, angle: number, av: number,
 * speed: number, baseSpeed: number
 * }}
 */
let head;
/** @type {{pos: Vector, side: number, angle: number}[]} */
let tails;
let tailCount;
let lightTailCount;
/** @type {{pos: Vector, side: number, angle: number}} */
let item;
let multiplier;

function update() {
  if (!ticks) {
    head = {
      pos: vec(0, 20),
      side: -1,
      angle: -PI / 2,
      av: 1,
      speed: 1,
      baseSpeed: 1,
    };
    tails = [];
    tailCount = multiplier = 3;
    lightTailCount = 2;
    item = { pos: vec(), side: -1, angle: 0 };
  }
  const sd = sqrt(difficulty);
  const v = vec();
  if (input.isJustPressed) {
    play("laser");
    head.av *= -1;
    head.speed += 0.1;
  }
  if (input.isPressed) {
    play("hit");
    head.speed += 0.01;
  } else {
    head.speed += (1 - head.speed) * 0.1;
    head.angle += head.av * 0.03 * sd * head.speed * head.baseSpeed;
  }
  head.baseSpeed *= 1.002;
  head.pos.addWithAngle(head.angle, sd * 0.5 * head.speed * head.baseSpeed);
  checkSide(head);
  tails.unshift({ pos: vec(head.pos), side: head.side, angle: head.angle });
  if (tails.length > 256) {
    tails.pop();
  }
  item.pos.addWithAngle(item.angle, sd * 0.2);
  checkSide(item);
  color("black");
  if (item.side === -1) {
    char("a", item.pos.x + 150, item.pos.y + 50);
  }
  if (item.side === 1) {
    char("a", item.pos.x + 50, item.pos.y + 50);
  }
  color("green");
  if (head.side === -1) {
    bar(head.pos.x + 150, head.pos.y + 50, 3, 4, head.angle);
  }
  if (head.side === 1) {
    bar(head.pos.x + 50, head.pos.y + 50, 3, 4, head.angle);
  }
  color("light_yellow");
  box(50, 50, 80);
  color("light_purple");
  box(150, 50, 80);
  color("black");
  if (item.side === -1) {
    char("a", item.pos.x + 50, item.pos.y + 50);
  }
  if (item.side === 1) {
    char("a", item.pos.x + 150, item.pos.y + 50);
  }
  color("light_green");
  lightTailCount += (2 - lightTailCount) * 0.03;
  times(tailCount, (i) => {
    const ti = i * 9;
    if (ti >= tails.length) {
      return;
    }
    color(i < lightTailCount ? "light_black" : "light_green");
    const t = tails[ti];
    if (t.side === -1) {
      const c = bar(t.pos.x + 50, t.pos.y + 50, 4, 3, t.angle).isColliding.char;
      if (item.side === -1 && c.a) {
        getItem(t.pos.x + 50, t.pos.y + 50);
      }
    }
    if (t.side === 1) {
      const c = bar(t.pos.x + 150, t.pos.y + 50, 4, 3, t.angle).isColliding
        .char;
      if (item.side === 1 && c.a) {
        getItem(t.pos.x + 150, t.pos.y + 50);
      }
    }
  });
  color("green");
  if (head.side === -1) {
    const c = bar(
      head.pos.x + 50,
      head.pos.y + 50,
      3,
      4,
      head.angle
    ).isColliding;
    if (item.side === -1 && c.char.a) {
      getItem(head.pos.x + 50, head.pos.y + 50);
    }
    if (c.rect.light_green) {
      play("explosion");
      end();
    }
  }
  if (head.side === 1) {
    const c = bar(
      head.pos.x + 150,
      head.pos.y + 50,
      3,
      4,
      head.angle
    ).isColliding;
    if (item.side === 1 && c.char.a) {
      getItem(head.pos.x + 150, head.pos.y + 50);
    }
    if (c.rect.light_green) {
      play("explosion");
      end();
    }
  }
  const pp = ceil(multiplier);
  multiplier -= 0.01;
  if (multiplier < 1) {
    multiplier = 1;
  }
  if (ceil(multiplier) < pp) {
    play("coin");
  }
  color("black");
  text(`x${ceil(multiplier)}`, 3, 9);

  function getItem(x, y) {
    play("powerUp");
    head.baseSpeed = 1;
    addScore(ceil(multiplier), x, y);
    if (tailCount < 25) {
      tailCount++;
    }
    multiplier += tailCount;
    item.pos.set(rnds(35), rnds(35));
    item.angle = rnds(PI);
    item.side = head.side * -1;
  }

  function checkSide(a) {
    v.set().addWithAngle(a.angle, 1);
    if ((a.pos.x < -40 && v.x < 0) || (a.pos.x > 40 && v.x > 0)) {
      a.side *= -1;
      v.x *= -1;
      if (a.hasOwnProperty("av")) {
        a.av *= -1;
        lightTailCount += 2;
      }
    }
    if ((a.pos.y < -40 && v.y < 0) || (a.pos.y > 40 && v.y > 0)) {
      a.side *= -1;
      v.y *= -1;
      if (a.hasOwnProperty("av")) {
        a.av *= -1;
        lightTailCount += 2;
      }
    }
    if (lightTailCount >= tailCount - 1) {
      lightTailCount = tailCount - 1;
    }
    a.angle = v.angle;
  }
}
