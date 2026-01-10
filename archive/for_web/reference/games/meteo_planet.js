title = "METEO PLANET";

description = `
[Tap] Move
`;

characters = [
  `
llllll
ll l l
ll l l
llllll
 l  l
 l  l
  `,
  `
llllll
ll l l
ll l l
llllll
ll  ll
  `,
  `
 lll
l l l
l lll
ll ll
 lll
`,
];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 6,
};

/** @type {{dist: number, angle: number, type: number}[]} */
let fallings;
let nextFallingsTicks;
let nextFallingAngle;
let angle;
let targetAngle;
let animTicks;
/** @type {{dist: number, angle: number}[]} */
let stars;

function update() {
  if (!ticks) {
    fallings = [{ dist: 53, angle: (rndi(4) * PI) / 2, type: 0 }];
    nextFallingsTicks = 0;
    nextFallingAngle = rndi(1, 4);
    angle = 0;
    targetAngle = 0;
    animTicks = 0;
    stars = times(24, (_) => ({ dist: rnd(10, 70), angle: rnd(PI * 2) }));
  }
  const sd = sqrt(difficulty);
  color("light_black");
  const sp = vec();
  stars.forEach((s) => {
    sp.set(50, 50).addWithAngle(s.angle - angle, s.dist);
    box(sp, 1);
  });
  color("black");
  if (input.isJustPressed) {
    play("select");
    targetAngle += PI / 2;
  }
  if (angle < targetAngle) {
    angle += 0.3 * sd;
    if (angle > targetAngle) {
      angle = targetAngle;
      if (angle > PI * 2.2) {
        angle = targetAngle = PI / 2;
      }
    }
    animTicks += sd;
  }
  char(addWithCharCode("a", floor(animTicks / 3) % 2), 50, 42);
  arc(50, 50, 3, 2, -angle + PI * 0.2, -angle + PI * 2.2);
  nextFallingsTicks--;
  if (nextFallingsTicks < 0) {
    const cc = rndi(6);
    let dist = 70;
    let angle = nextFallingAngle * (PI / 2);
    times(11, (i) => {
      let type = abs(i - 5);
      if (type <= cc) {
        fallings.push({
          dist,
          angle,
          type: type === 0 ? 0 : cc - type + 1,
        });
      }
      dist += 6;
    });
    nextFallingsTicks = rnd(30, 50) / sqrt(sd);
    nextFallingAngle += rndi(1, 4);
  }
  const fp = vec();
  remove(fallings, (f) => {
    f.dist -= 0.5 * sd;
    fp.set(50, 50).addWithAngle(f.angle - angle, f.dist);
    if (f.type === 0) {
      color("black");
      const c = char("c", fp).isColliding.char;
      if (c.a || c.b) {
        play("explosion");
        end();
      }
    } else {
      color("yellow");
      const c = box(fp, f.type).isColliding.char;
      if (c.a || c.b) {
        play("powerUp");
        addScore(f.type, fp);
        return true;
      }
    }
    if (f.dist < 5) {
      if (f.type === 0) {
        play("hit");
        particle(fp);
      }
      return true;
    }
  });
}
