title = "BOLA THREAD";

description = `
[Hold] Contract
[Release] Expand
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 7,
};

let player;
let balls;
let obstacles;
let items;
let ang;
let r;
let nextWallX;
let nextBeaconT;
let hitstop;
let shakeMag;
let shakeT;

function update() {
  if (!ticks) {
    player = { pos: vec(30, 50) };
    balls = [{ pos: vec(0, 0) }, { pos: vec(0, 0) }];
    obstacles = [];
    items = [];
    ang = 0;
    r = 20;
    nextWallX = 60;
    nextBeaconT = 100;
    hitstop = 0;
    shakeMag = 0;
    shakeT = 0;
  }

  const frozen = hitstop > 0;
  if (frozen) hitstop--;

  const spd = 0.45 + difficulty * 0.1;

  // radius slew, analytically tracked (dr/dAng) so the orbit velocity below
  // needs no position-history array even though the path itself is circular
  const dAngNow = 0.02 + difficulty * 0.002; // nominal rate, used below to predict phase at a wall's arrival regardless of this tick's freeze state
  let dr = 0;
  let dAng = 0;
  if (!frozen) {
    const prevR = r;
    if (input.isPressed) r = max(6, r - 0.6);
    else r = min(26, r + 0.45);
    dr = r - prevR;
    dAng = dAngNow;
    ang += dAng;
  }

  balls[0].pos.set(30 + cos(ang) * r, 50 + sin(ang) * r);
  balls[1].pos.set(30 - cos(ang) * r, 50 - sin(ang) * r);

  if (!frozen) {
    nextWallX -= spd;
    if (nextWallX < 0) {
      const nub = rnd() < 0.36;
      // a nub is only ever lethal-avoidable if the orbit is vertical-ish
      // when it reaches the knot (sin(ang) large) — sideways (ang near 0/pi)
      // gives near-zero vertical separation no matter the radius. Predict
      // the phase at arrival (rotation is deterministic, no rnd() involved)
      // and only keep the nub if that phase will be comfortably vertical;
      // otherwise fall back to an ordinary narrow-gap wall.
      const ticksToArrival = (108 - 30) / spd;
      const predictedAng = ang + dAngNow * ticksToArrival;
      const nubSafe = abs(sin(predictedAng)) > 0.8;
      const finalNub = nub && nubSafe;
      obstacles.push({
        pos: vec(108, 50),
        gapY: rnd(42, 58),
        gapH: finalNub ? rnd(42, 54) : rnd(25, 40),
        nub: finalNub,
        passed: false,
      });
      nextWallX = rnd(65, 90);
    }
    nextBeaconT--;
    if (nextBeaconT < 0) {
      items.push({ pos: vec(108, rnd(20, 80)) });
      nextBeaconT = rnd(90, 150);
    }
  }

  // decaying screen shake on a wall-pass bonus — the tether/knot are purely
  // decorative (never collision-checked), never the orbs' or walls' hitboxes
  let shakeX = 0;
  let shakeY = 0;
  if (shakeT > 0) {
    shakeT--;
    const m = shakeMag * (shakeT / 8);
    shakeX = rnd(-m, m);
    shakeY = rnd(-m, m);
  }

  // tether visual
  color("light_black");
  line(
    vec(balls[0].pos.x + shakeX, balls[0].pos.y + shakeY),
    vec(balls[1].pos.x + shakeX, balls[1].pos.y + shakeY),
    1,
  );
  color("light_blue");
  box(vec(player.pos.x + shakeX, player.pos.y + shakeY), 3);

  // afterimage trail, algebraic from the analytic orbit velocity (dr/dAng
  // above) — colored to avoid "cyan" so the ghost boxes can't trip the
  // walls'/beacons' isColliding.rect.cyan checks
  const tvx = dr * cos(ang) - r * dAng * sin(ang);
  const tvy = dr * sin(ang) + r * dAng * cos(ang);
  if (tvx * tvx + tvy * tvy > 1) {
    color("light_cyan");
    box(vec(balls[0].pos.x - tvx * 1.4, balls[0].pos.y - tvy * 1.4), 3);
    box(vec(balls[1].pos.x + tvx * 1.4, balls[1].pos.y + tvy * 1.4), 3);
    color("light_black");
    box(vec(balls[0].pos.x - tvx * 2.8, balls[0].pos.y - tvy * 2.8), 2);
    box(vec(balls[1].pos.x + tvx * 2.8, balls[1].pos.y + tvy * 2.8), 2);
  }

  // balls (collision carriers)
  color("cyan");
  balls.forEach((b) => box(b.pos, 4));

  // barriers
  remove(obstacles, (o) => {
    if (!frozen) o.pos.x -= spd;
    const x = o.pos.x;
    color("red");
    const top = rect(x - 2, 0, 4, o.gapY - o.gapH / 2);
    const bot = rect(x - 2, o.gapY + o.gapH / 2, 4, 100 - o.gapY - o.gapH / 2);
    let hit = top.isColliding.rect.cyan || bot.isColliding.rect.cyan;
    if (o.nub) {
      const nb = box(x, 50, 4, 8);
      if (nb.isColliding.rect.cyan) hit = true;
    }
    if (hit) {
      play("explosion");
      particle(vec(x, 50), { count: 25, speed: 3 });
      end();
    }
    if (!o.passed && x < 30) {
      o.passed = true;
      // every wall pays out, even fully contracted (min +1) — proximity to
      // the gap edges (bigger radius) scales it up from there
      const bonus = max(1, floor((r - 6) / 3));
      addScore(bonus, x, o.gapY);
      play("select");
      const tier = bonus >= 5 ? 2 : bonus >= 3 ? 1 : 0;
      hitstop = max(hitstop, clamp(2 + tier * 2, 2, 6));
      shakeMag = max(shakeMag, clamp(1 + tier, 1, 3));
      shakeT = 8;
      color(tier === 2 ? "yellow" : tier === 1 ? "cyan" : "light_cyan");
      particle(vec(x, o.gapY), {
        count: 8 + tier * 6,
        speed: 1.5 + tier * 0.5,
      });
    }
    return x < -5;
  });

  // beacons
  remove(items, (g) => {
    if (!frozen) g.pos.x -= spd;
    color("yellow");
    const c = box(g.pos, 5);
    if (c.isColliding.rect.cyan) {
      addScore(8, g.pos.x, g.pos.y);
      play("coin");
      particle(g.pos, { count: 12, speed: 2 });
      return true;
    }
    return g.pos.x < -5;
  });
}
