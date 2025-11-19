title = "M RIDER";

description = `
[Hold] Go up
`;

characters = [
  `
  ll
  l  l
 llll
l l
 l l
ll  l
`,
  `
  ll
 l
llll
 l
  l  
   ll
`,
  `
l
ll
llllll
 ll
 l   
`,
];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

/** @type {{pos: Vector, vel: Vector}[]} */
let missiles;
let nextMissileTicks;
/**
 * @type {{
 * pos: Vector, vel: Vector, removeTicks: number, baseRemoveTicks: number,
 * }[]}
 */
let planes;
let nextPlaneTicks;
/** @type {{pos: Vector, vel: Vector, missile: any}} */
let rider;
let multiplier;

function update() {
  if (!ticks) {
    missiles = [{ pos: vec(30, 50), vel: vec(1) }];
    nextMissileTicks = 9;
    planes = [];
    nextPlaneTicks = 0;
    rider = { pos: vec(), vel: vec(), missile: missiles[0] };
    multiplier = 1;
  }
  if (input.isJustPressed) {
    play("select");
  }
  if (rider.missile == null) {
    rider.vel.x += (input.isPressed ? 0.04 : -0.02) * sqrt(difficulty);
    rider.vel.y += (input.isPressed ? 0.01 : 0.05) * sqrt(difficulty);
    rider.vel.mul(0.99);
    rider.pos.add(rider.vel);
  } else {
    const m = rider.missile;
    m.vel.y += (input.isPressed ? -1 : 1) * 0.05 * difficulty;
    m.vel.y *= 0.99;
    m.vel.x += (sqrt(difficulty) - m.vel.x) * 0.1;
    rider.pos.set(m.pos.x, m.pos.y - 4);
    rider.vel.set(m.vel);
  }
  const scr =
    rider.pos.x > 50 ? (rider.pos.x - 50) * 0.1 * sqrt(difficulty) : 0;
  rider.pos.x -= scr;
  color("black");
  char(
    rider.missile == null ? "b" : "a",
    rider.pos.x,
    clamp(rider.pos.y, -2, 99),
    {
      rotation: rider.missile != null ? 0 : floor(ticks / 10) % 4,
    }
  );
  if ((rider.missile != null && rider.pos.y < -1) || rider.pos.y > 99) {
    play("explosion");
    end();
  }
  nextMissileTicks--;
  if (nextMissileTicks < 0) {
    const pos = vec(210, rnd(40, 70));
    missiles.push({
      pos,
      vel: vec(rnd(0.4, 0.5) * sqrt(difficulty)).rotate(
        pos.angleTo(0, rnd(50, 60)) + PI
      ),
    });
    nextMissileTicks = rnd(60, 300) / sqrt(difficulty);
  }
  remove(missiles, (m) => {
    m.pos.add(m.vel);
    m.pos.x -= scr;
    color("light_red");
    box(m.pos.x - 9, m.pos.y, 5);
    particle(m.pos.x - 9, m.pos.y, m === rider.missile ? 3 : 2, 1, PI, 0.5);
    color(m === rider.missile ? "red" : "black");
    if (box(m.pos, 18, 3).isColliding.char.b) {
      play("powerUp");
      multiplier = ceil(multiplier * 0.5);
      rider.missile = m;
    }
    return !m.pos.isInRect(-9, -3, 230, 116);
  });
  nextPlaneTicks--;
  if (nextPlaneTicks < 0) {
    const pos = vec(203, rnd(30, 90));
    planes.push({
      pos,
      vel: vec(rnd(0.05, 0.3) * sqrt(difficulty)).rotate(
        pos.angleTo(0, rnd(40, 90)) + PI
      ),
      removeTicks: 0,
      baseRemoveTicks: 0,
    });
    nextPlaneTicks = rnd(20, 24) / sqrt(difficulty);
  }
  remove(planes, (p) => {
    p.pos.add(p.vel);
    p.pos.x -= scr;
    if (p.removeTicks > 0) {
      color("light_red");
      particle(p.pos, 1, 1);
      p.removeTicks -= sqrt(difficulty);
      if (p.removeTicks <= 0) {
        play("coin");
        particle(p.pos, 9, 2);
        addScore(multiplier, p.pos);
        multiplier++;
        const rt = p.baseRemoveTicks * 0.9;
        if (rt > 2) {
          planes.forEach((ap) => {
            if (ap === p) {
              return;
            }
            if (ap.pos.distanceTo(p.pos) < 36) {
              line(ap.pos, p.pos);
              ap.removeTicks = ap.baseRemoveTicks = rt;
            }
          });
        }
        return true;
      }
    }
    color("black");
    const c = char("c", p.pos).isColliding.rect;
    if (c.red) {
      if (rider.missile != null) {
        play("jump");
        particle(p.pos, 9, 3);
        rider.vel.y = -2 * sqrt(difficulty);
        rider.missile.pos.x = -99;
        rider.missile = undefined;
      }
      p.baseRemoveTicks = p.removeTicks = 9;
    }
    return !p.pos.isInRect(-3, -3, 206, 106);
  });
  color("black");
  text(`x${multiplier}`, 3, 9);
}
