title = "ANT LION";

description = `
[Hold] Walk
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

/** @type {{angle: number, av: number, dist: number, bar: any, barLength: number, ticks: number}} */
let ant;
/** @type {{angle: number, av: number, length: number, dist: number, speed: number}[]} */
let bars;
let nextBarTicks;
let sandTicks;
let multiplier;
const cp = vec(50, 50);

function update() {
  if (!ticks) {
    ant = {
      angle: PI / 2,
      av: 0,
      dist: 40,
      bar: undefined,
      barLength: 0,
      ticks: 0,
    };
    bars = [];
    nextBarTicks = 0;
    sandTicks = 0;
    multiplier = 0;
  }
  color("light_yellow");
  sandTicks += difficulty;
  arc(50, 50, wrap(70 - ((sandTicks / 3) % 70), 0, 70), 5);
  color("red");
  text("<", 48 + sin(ticks * 0.1) * 2, 50);
  text(">", 52 - sin(ticks * 0.1) * 2, 50);
  color("black");
  let c;
  let ap;
  if (ant.bar == null) {
    if (input.isPressed) {
      play("hit");
      ant.ticks += difficulty;
    }
    ap = vec(cp).addWithAngle(ant.angle, ant.dist);
    ant.av += ((input.isPressed ? 1 : -1) * 0.02 * difficulty - ant.av) * 0.1;
    ant.angle += ant.av;
    ant.dist -= 0.05 * difficulty * (ap.isInRect(0, 0, 99, 99) ? 1 : 2);
    c = bar(ap, 3, 3, ant.angle + PI / 2).isColliding.text;
    ap.addWithAngle(ant.angle, 3);
    bar(ap, 5, 2, ant.angle + PI / 2, 0.5 + sin(ant.ticks * 0.3) * 0.4);
    ap.addWithAngle(ant.angle, -6);
    bar(ap, 5, 2, ant.angle + PI / 2, 0.5 - sin(ant.ticks * 0.3) * 0.4);
  } else {
    play("laser");
    ant.ticks += difficulty;
    ant.barLength += difficulty * 0.3;
    ant.bar.speed += difficulty * 0.002;
    const b = ant.bar;
    ant.angle = b.angle;
    ant.dist = b.dist + ant.barLength;
    ap = vec(cp).addWithAngle(ant.angle, ant.dist);
    c = bar(ap, 3, 4, ant.angle).isColliding.text;
    ap.addWithAngle(ant.angle + PI / 2, 3);
    bar(ap, 5, 2, ant.angle, 0.5 + sin(ant.ticks * 0.3) * 0.4);
    ap.addWithAngle(ant.angle + PI / 2, -6);
    bar(ap, 5, 2, ant.angle, 0.5 - sin(ant.ticks * 0.3) * 0.4);
    if (ant.barLength > b.length + 6) {
      ant.bar = undefined;
    }
  }
  if (c["<"] || c[">"]) {
    play("explosion");
    end();
  }
  nextBarTicks--;
  if (nextBarTicks < 0) {
    const length = rnd(10, 30);
    bars.push({
      angle: rnd(PI * 2),
      av: (rnd(0.5, 1) * difficulty * -0.05) / length,
      length,
      dist: 75,
      speed: rnd(0.5, 1) * difficulty * 0.2,
    });
    nextBarTicks = rnd(150, 180) / difficulty;
  }
  color("blue");
  remove(bars, (b) => {
    b.angle += b.av;
    const p = vec(cp).addWithAngle(b.angle, b.dist);
    b.dist -= b.speed * (p.isInRect(0, 0, 99, 99) ? 1 : 5);
    if (
      bar(p, b.length, 3, b.angle, 0).isColliding.rect.black &&
      ant.bar == null
    ) {
      play("coin");
      multiplier += 2;
      addScore(multiplier, ap);
      ant.bar = b;
      ant.barLength = ant.dist - b.dist;
    }
    if (b.dist < 0) {
      b.length += b.dist;
      b.dist = 0;
    }
    if (b.length < 0) {
      play("select");
      if (ant.bar === b) {
        ant.bar = undefined;
      }
      if (multiplier > 1) {
        multiplier--;
      }
      return true;
    }
  });
  color("black");
  text(`x${multiplier}`, 3, 9);
}
