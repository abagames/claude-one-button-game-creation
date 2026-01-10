title = "CATAPULT";

description = `
[Tap] Throw
`;

characters = [];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

/** @type {{pos: Vector, width: number, isPassed: boolean}[]} */
let bars;
let nextBarDist;
/**
 * @type {{
 * pos: Vector, vel: Vector, bar: any, barPos: number, grv: number
 * }}
 */
let ball;
let baseScore;
let passedCount;

function update() {
  if (!ticks) {
    bars = [{ pos: vec(200, 60), width: 20, isPassed: true }];
    nextBarDist = 50;
    ball = {
      pos: vec(200, 60),
      vel: vec(),
      bar: bars[0],
      barPos: -10,
      grv: 0.1,
    };
    baseScore = 1;
    passedCount = 0;
  }
  const ip = input.isPressed;
  let scr = difficulty * 0.05;
  if (ball.pos.x > 30) {
    scr += (ball.pos.x - 30) * 0.1;
  }
  ball.pos.x -= scr;
  if (ball.bar != null) {
    ball.barPos += (ip ? -1 : 1) * difficulty * 0.2;
    if (baseScore > 1) {
      baseScore -= 0.5;
    }
    ball.pos.set(
      vec(ball.bar.pos)
        .addWithAngle(ip ? -PI / 4 : (-PI / 4) * 3, 4)
        .addWithAngle(ip ? -(PI / 4) * 3 : (PI / 4) * 3, ball.barPos)
    );
    if (abs(ball.barPos) > ball.bar.width * 0.65) {
      ball.bar = undefined;
      ball.vel.set();
    } else if (ball.barPos > 0) {
      color(ball.barPos > ball.bar.width * 0.45 ? "light_red" : "light_black");
      let p = vec(ball.bar.pos)
        .addWithAngle(-PI / 4, 4)
        .addWithAngle((-PI / 4) * 3, ball.barPos);
      let v = vec().addWithAngle(-PI / 4, sqrt(ball.barPos) * sqrt(difficulty));
      p.add(v);
      for (let i = 0; i < 99; i++) {
        p.add(v);
        v.y += ball.grv;
        if (i % 5 === 0) {
          box(p, 3);
        }
        if (p.y > 99) {
          break;
        }
      }
      color("black");
      if (input.isJustPressed) {
        play("jump");
        ball.vel
          .set()
          .addWithAngle(-PI / 4, sqrt(ball.barPos) * sqrt(difficulty));
        ball.pos.add(ball.vel);
        ball.bar = undefined;
        passedCount = 0;
      }
    }
  } else {
    ball.pos.add(ball.vel);
    ball.vel.y += ball.grv;
    baseScore += ball.vel.x * 0.1;
  }
  if (input.isJustPressed) {
    play("laser");
  }
  box(ball.pos, 5);
  if (ball.pos.y > 99 || ball.pos.x < 0) {
    play("explosion");
    end();
  }
  remove(bars, (b) => {
    b.pos.x -= scr;
    if (
      bar(b.pos, b.width, 3, ip ? PI / 4 : -PI / 4).isColliding.rect.black &&
      ball.bar == null
    ) {
      play("powerUp");
      addScore(ceil(baseScore), ball.pos);
      const p = vec(b.pos).addWithAngle(ip ? -PI / 4 : (-PI / 4) * 3, 4);
      ball.bar = b;
      ball.barPos = clamp(
        p.distanceTo(ball.pos) * (ball.pos.x > p.x ? -1 : 1),
        -b.width * 0.4,
        b.width * 0.4
      );
      ball.grv = 0.1 * difficulty;
      b.isPassed = true;
    }
    if (!b.isPassed && b.pos.x + b.width * 0.5 < ball.pos.x) {
      play("coin");
      b.isPassed = true;
      passedCount++;
      baseScore += passedCount * 10;
      addScore(passedCount * 10, b.pos);
    }
    return b.pos.x < -b.width / 2;
  });
  nextBarDist -= scr;
  if (nextBarDist < 0) {
    const width = rnd(20, 30);
    bars.push({
      pos: vec(200 + width / 2, rnd(50, 90)),
      width,
      isPassed: false,
    });
    nextBarDist += width / 2 + rnd(30, 50);
  }
  text(`+${ceil(baseScore)}`, 3, 9);
}
