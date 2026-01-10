title = "GEOCENT";

description = `
[Hold]
 Speed up & Turn
`;

characters = [];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

/**
 * @type {{
 * cPos: Vector, radius: number, angle: number, av: number,
 * size: number, color: Color, pos: Vector
 * }[]}
 */
let stars;
/**
 * @type {{
 * angle: number, va: number, dist: number, speed: number,
 * posHistory: Vector[], crates: number[],
 * }}
 */
let rocket;
/** @type {Vector[]} */
let bgStars;

function update() {
  if (!ticks) {
    let av = 0.03;
    // @ts-ignore
    stars = times(9, (i) => {
      av *= 0.7;
      return {
        cPos: vec(),
        radius: i * 4,
        angle: rnd(PI * 2),
        av,
        size: [3, 1, 1, 2, 1, 1, 1, 1, 1][i],
        color: [
          "yellow",
          "red",
          "red",
          "cyan",
          "red",
          "red",
          "red",
          "red",
          "red",
        ][i],
        pos: vec(),
      };
    });
    rocket = {
      angle: 0,
      va: 0,
      dist: undefined,
      speed: 0,
      posHistory: [],
      crates: [],
    };
    bgStars = times(20, () => vec(rnd(99), rnd(99)));
  }
  color("light_black");
  bgStars.forEach((s) => {
    box(s, 1);
  });
  stars.forEach((s) => {
    s.angle += s.av * difficulty;
    s.cPos.set(50, 50).addWithAngle(s.angle, s.radius);
  });
  let ep = stars[3].cPos;
  stars.forEach((s) => {
    s.pos.set(s.cPos).sub(ep).add(50, 50);
    color(s.color);
    arc(s.pos, s.size);
  });
  if (rocket.dist == null) {
    rocket.angle = ((rndi(4) + 0.3 + rnd(0.4)) * PI) / 2;
    rocket.dist = abs(sin(rocket.angle * 2)) * 25 + 36;
    rocket.speed = 0;
    rocket.posHistory = [];
    const cn = rocket.crates.length + 1;
    rocket.crates = times(cn, (i) => (i + 1) * 9);
  }
  if (input.isJustPressed) {
    play("select");
    rocket.speed += difficulty;
  }
  rocket.speed +=
    ((input.isPressed ? 5 : 1) * difficulty * 0.1 - rocket.speed) * 0.5;
  rocket.dist -= rocket.speed;
  rocket.va +=
    ((input.isPressed ? 0.03 : -0.003) * difficulty - rocket.va) * 0.05;
  rocket.angle += rocket.va;
  const p = vec(50, 50).addWithAngle(rocket.angle, rocket.dist);
  rocket.posHistory.unshift(vec(p));
  color("black");
  remove(rocket.crates, (c) => {
    const cp = c >= rocket.posHistory.length ? p : rocket.posHistory[c];
    const cc = box(cp, 2).isColliding.rect;
    if (cc.red || cc.yellow) {
      play("hit");
      particle(cp);
      return true;
    }
  });
  color("red");
  particle(p, 1, rocket.speed * 3, rocket.angle, 0.5);
  color("blue");
  bar(vec(p).addWithAngle(rocket.angle, 2), 2, 3, rocket.angle + PI / 2);
  color("black");
  const c = bar(p, 1, 3, rocket.angle).isColliding.rect;
  if (c.cyan) {
    play("coin");
    addScore(rocket.crates.length, p);
    rocket.dist = undefined;
  } else if (c.red || c.yellow) {
    play("explosion");
    end();
  }
}
