title = "EMBATTLED";

description = `
[Tap]  Turn
[Hold] Defense
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
];

options = {
  theme: "pixel",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 5,
};

/**
 * @type {{
 * pos: Vector, angle: number, speed: number, turretAngle: number,
 * targetPos: Vector,
 * fireTicks: number, fireInterval: number, side: number
 * }[]}
 */
let tanks;
let nextTankTicks;
let currentSide;
let sideChangeCount;
/** @type {{pos: Vector, vel: Vector, side: number}[]} */
let bullets;
/** @type {{pos: Vector, vy: number, pressedTicks: number}} */
let player;
let multiplier;
const tankAngleVel = 0.02;
const tankTurretAngleVel = 0.03;

function update() {
  if (!ticks) {
    tanks = [];
    nextTankTicks = 0;
    currentSide = 0;
    sideChangeCount = 0;
    bullets = [];
    player = { pos: vec(50, 30), vy: 1, pressedTicks: 0 };
    multiplier = 1;
  }
  if (
    input.isJustPressed ||
    (player.pos.y < 3 && player.vy < 0) ||
    (player.pos.y > 97 && player.vy > 0)
  ) {
    play("select");
    player.vy *= -1;
  }
  const pWall = player.pressedTicks > 10 / sqrt(difficulty);
  if (input.isPressed) {
    player.pressedTicks++;
  } else {
    player.pos.y += player.vy * difficulty * 0.5;
    player.pressedTicks = 0;
  }
  const playerHasWall = player.pressedTicks > 10 / sqrt(difficulty);
  if (!pWall && playerHasWall) {
    play("powerUp");
  }
  color(playerHasWall ? "cyan" : "blue");
  //@ts-ignore
  char(addWithCharCode("a", floor(ticks / 20) % 2), player.pos, {
    mirror: { x: player.vy },
  });
  let hwr = 1;
  if (playerHasWall) {
    box(player.pos.x - 5, player.pos.y, 5, 15);
    box(player.pos.x + 6, player.pos.y, 5, 15);
    hwr *= 2;
  }
  remove(bullets, (b) => {
    b.pos.add(vec(b.vel).mul(hwr));
    color(b.side === 0 ? "red" : "purple");
    const c = bar(b.pos, 3, 3, b.vel.angle).isColliding;
    if (c.rect.cyan) {
      play("hit");
      return true;
    }
    if (c.char.a || c.char.b) {
      play("lucky");
      end();
    }
  });
  if (tanks.length === 0) {
    nextTankTicks = 0;
  }
  nextTankTicks -= hwr;
  if (nextTankTicks < 0) {
    const side = currentSide;
    sideChangeCount--;
    if (sideChangeCount <= 0) {
      currentSide = currentSide === 0 ? 1 : 0;
      sideChangeCount = rndi(1, 4);
    }
    const pos = vec(side === 0 ? -5 : 105, rnd(99));
    const angle = pos.angleTo(player.pos);
    const fireInterval = rnd(300, 400) / difficulty;
    tanks.push({
      pos,
      angle,
      speed: rnd(1, difficulty) * 0.02,
      turretAngle: angle,
      targetPos: undefined,
      fireTicks: rnd(fireInterval),
      fireInterval,
      side,
    });
    nextTankTicks = rnd(60, 80) / difficulty;
  }
  remove(tanks, (t) => {
    let md;
    if (playerHasWall) {
      md = t.pos.distanceTo(player.pos);
      t.targetPos = player.pos;
    } else {
      md = 99;
      t.targetPos = undefined;
    }
    tanks.forEach((ot) => {
      if (t.side === ot.side) {
        return;
      }
      const d = t.pos.distanceTo(ot.pos);
      if (d < md) {
        md = d;
        t.targetPos = ot.pos;
      }
    });
    if (t.targetPos != null) {
      const ta = t.pos.angleTo(t.targetPos);
      let oa = wrap(ta - t.turretAngle, -PI, PI);
      let tv = tankTurretAngleVel * difficulty * hwr;
      if (abs(oa) < tv) {
        t.turretAngle = ta;
      } else {
        t.turretAngle += oa > 0 ? tv : -tv;
      }
      oa = wrap(ta - t.angle, -PI, PI);
      tv = tankAngleVel * difficulty;
      if (abs(oa) < tv) {
        t.angle = ta;
      } else {
        t.angle += oa > 0 ? tv : -tv;
      }
    }
    t.pos.addWithAngle(t.angle, t.speed * hwr);
    t.fireTicks -= hwr;
    if (t.fireTicks < 0) {
      play("laser");
      bullets.push({
        pos: vec(t.pos),
        vel: vec().addWithAngle(t.turretAngle, difficulty * 0.5),
        side: t.side,
      });
      t.fireTicks = t.fireInterval;
    }
    color(t.side === 0 ? "light_red" : "light_purple");
    const c = bar(t.pos, 1, 6, t.angle).isColliding;
    if (c.rect[t.side === 0 ? "purple" : "red"]) {
      play("explosion");
      color("black");
      particle(t.pos);
      addScore(multiplier, t.pos);
      multiplier++;
      return true;
    }
    if (c.char.a || c.char.b) {
      play("lucky");
      end();
    }
    color("black");
    bar(t.pos, 3, 3, t.turretAngle, 0);
    return !t.pos.isInRect(-5, -5, 110, 110);
  });
  color("transparent");
  remove(bullets, (b) => {
    const c = bar(b.pos, 3, 3, b.vel.angle).isColliding.rect;
    if (c[b.side === 0 ? "light_purple" : "light_red"]) {
      return true;
    }
  });
  if (ticks % 60 === 0 && multiplier > 1) {
    multiplier--;
  }
  color("black");
  text(`+${multiplier}`, 3, 9);
}
