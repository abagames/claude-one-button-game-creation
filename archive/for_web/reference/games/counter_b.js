title = "COUNTER B";

description = `
[Hold] Beam
`;

characters = [];

options = {
  theme: "pixel",
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 10,
};

/** @type {{pos: Vector, angle: number, speed: number, beamLength: number}[]} */
let enemies;
let nextEnemyTicks;
/**
 * @type {{
 * pos: Vector, speed: number, beamLength: number, baseX: number,
 * invincibleTicks: number
 * }}
 */
let player;
/** @type {{pos: Vector, radius: number, enemy: any}} */
let counter;
let scrX;
let multiplier;

function update() {
  if (!ticks) {
    player = {
      pos: vec(20, 60),
      speed: 0,
      beamLength: 0,
      baseX: 30,
      invincibleTicks: 0,
    };
    enemies = [
      { pos: vec(205, player.pos.y), angle: PI, speed: 0.5, beamLength: 0 },
    ];
    nextEnemyTicks = 9;
    counter = { pos: undefined, radius: 0, enemy: undefined };
    multiplier = 1;
    scrX = 0;
  }
  const scr = (player.pos.x - player.baseX) * 0.1;
  player.baseX += (30 - player.baseX) * 0.001;
  if (player.pos.x < 0) {
    play("explosion");
    player.pos.x = 0;
    end();
  }
  color("yellow");
  rect(0, 90, 200, 10);
  scrX = wrap(scrX - scr, 0, 200);
  color("white");
  rect(scrX, 90, 2, 10);
  const beamSpeed = 4 * sqrt(difficulty);
  player.speed +=
    ((input.isPressed ? 0.2 : 2) * sqrt(sqrt(difficulty)) - player.speed) * 0.2;
  player.pos.x += player.speed - scr;
  if (counter.pos == null) {
    if (input.isPressed) {
      if (player.beamLength <= 0) {
        play("select");
        color("cyan");
        particle(player.pos, 20, 3, 0, 0.3);
      }
      player.beamLength = clamp(player.beamLength + beamSpeed, 0, 300);
    } else {
      player.beamLength = 0;
    }
  } else {
    player.beamLength = counter.pos.x - player.pos.x;
    if (player.beamLength < 0 && counter.enemy != null) {
      counter.enemy.beamLength = -9999;
      counter.enemy = undefined;
    }
  }
  if (player.beamLength > 0) {
    color("light_cyan");
    rect(player.pos.x, player.pos.y - 1, player.beamLength, 3);
    color("cyan");
    box(player.pos.x + player.beamLength, player.pos.y, 5);
  }
  if (counter.pos != null) {
    counter.pos.x -= scr;
    color("purple");
    arc(counter.pos, counter.radius, 6, ticks * 0.1, ticks * 0.1 + PI * 2);
    particle(counter.pos, 1, counter.radius * 0.1);
    if (counter.enemy == null) {
      counter.radius -= sqrt(difficulty) * 2;
      if (counter.radius < 1) {
        counter.pos = undefined;
      }
    } else {
      counter.radius = clamp(
        counter.radius + (input.isPressed ? 1 : -2) * sqrt(difficulty),
        0,
        30
      );
      if (counter.radius < 1) {
        if (counter.enemy != null) {
          counter.enemy.beamLength = -9999;
        }
        counter.pos = undefined;
      }
    }
  }
  nextEnemyTicks--;
  if (nextEnemyTicks < 0) {
    const pos = rnd() < 0.6 ? vec(rnd(150, 300), -5) : vec(205, rnd(85));
    const tp =
      rnd() < 0.05
        ? vec(player.pos.x + 9, player.pos.y)
        : vec(pos.x - rnd(30, 150), player.pos.y);
    enemies.push({
      pos,
      angle: pos.angleTo(tp),
      speed: rnd(1, sqrt(difficulty)),
      beamLength: -rnd(sqrt(difficulty) * 20),
    });
    nextEnemyTicks = rnd(30, 40) / difficulty;
  }
  remove(enemies, (e) => {
    e.pos.addWithAngle(e.angle, e.speed);
    e.pos.x -= scr;
    if (counter.enemy === e && counter.pos != null) {
      e.beamLength = e.pos.distanceTo(counter.pos);
      e.speed *= 0.8;
    } else {
      e.beamLength += beamSpeed * 0.2;
      if (e.beamLength - beamSpeed * 0.3 < 0 && e.beamLength >= 0) {
        play("laser");
        color("red");
        particle(e.pos, 9, 3, e.angle, 0.5);
      }
    }
    if (e.beamLength > 0) {
      color("light_red");
      const bp = vec(e.pos).addWithAngle(e.angle, e.beamLength);
      line(e.pos, bp);
      color("red");
      const c = box(bp, 5).isColliding.rect;
      if (counter.pos == null && c.cyan) {
        play("powerUp");
        multiplier = 1;
        counter.pos = vec(player.pos.x + player.beamLength, player.pos.y);
        counter.enemy = e;
        counter.radius = 1;
        color("purple");
        particle(counter.pos, 30, 5);
      }
      if (counter.enemy !== e && (c.purple || bp.y > 90 || bp.x < -99)) {
        e.beamLength = -9999;
      }
    }
    color("black");
    bar(vec(e.pos).addWithAngle(e.angle + (PI / 5) * 4, 3), 1, 2, e.angle);
    const c = bar(e.pos, 2, 3, e.angle).isColliding.rect;
    if (c.purple || c.light_cyan) {
      if (c.purple) {
        play("coin");
        addScore(multiplier, e.pos);
        if (multiplier < 64) {
          multiplier *= 2;
        }
      } else {
        play("hit");
      }
      particle(e.pos);
      if (counter.enemy === e) {
        counter.enemy = undefined;
      }
      return true;
    }
    if (e.beamLength < -999) {
      if (e.speed < 1) {
        e.speed += (1 - e.speed) * 0.1;
      }
      if (e.angle > 0) {
        e.angle += (PI - e.angle) * 0.05;
      }
    }
    return e.pos.x < -5;
  });
  color(
    player.invincibleTicks > 0 && player.invincibleTicks % 10 < 5
      ? "transparent"
      : "blue"
  );
  box(vec(player.pos).addWithAngle(-(PI / 5) * 4, 3), 3, 2);
  player.invincibleTicks--;
  if (
    box(player.pos, 5, 3).isColliding.rect.light_red &&
    player.invincibleTicks < 0 &&
    !(
      counter.pos != null &&
      counter.pos.distanceTo(player.pos) < counter.radius + 9
    )
  ) {
    play("explosion");
    particle(player.pos, 50, 4);
    player.baseX -= 10;
    player.pos.x -= 10;
    player.invincibleTicks = 60;
  }
}
