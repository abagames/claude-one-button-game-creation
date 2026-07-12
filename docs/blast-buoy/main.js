title = "BLAST BUOY";

description = `
[Hold] Sink
[Release] Float
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 12,
};

let player;
let enemies;
let bullets;
let combo;
let comboT;
let iframes;
let nextSubTicks;
let blastFx;
let hitstop;
let shakeMag;
let shakeT;

function update() {
  if (!ticks) {
    player = { pos: vec(30, 40), vy: 0, vx: 0 };
    enemies = [];
    bullets = [];
    combo = 1;
    comboT = 0;
    iframes = 0;
    nextSubTicks = 0;
    blastFx = { pos: vec(0, 0), t: 0, color: "light_red" };
    hitstop = 0;
    shakeMag = 0;
    shakeT = 0;
  }

  const frozen = hitstop > 0;
  if (frozen) hitstop--;

  if (!frozen) {
    player.vy += input.isPressed ? 0.06 : -0.05;
    player.vy = clamp(player.vy, -1.1, 1.1);
    player.vx *= 0.95;
    player.pos.y += player.vy;
    player.pos.x += player.vx;
    player.pos.clamp(5, 95, 13, 87);
    if (player.pos.y <= 13 || player.pos.y >= 87) player.vy = 0;

    if (iframes > 0) iframes--;
    if (comboT > 0) comboT--;
    else combo = 1;

    nextSubTicks--;
    if (nextSubTicks < 0) {
      const dir = rnd() < 0.5 ? 1 : -1;
      enemies.push({
        pos: vec(dir > 0 ? -8 : 108, rnd(13, 87)),
        dir,
        spd: rnd(0.2, 0.45) * sqrt(difficulty),
        fireT: rnd(60, 120),
      });
      nextSubTicks = rnd(50, 90) / sqrt(difficulty);
    }
  }

  let shakeY = 0;
  if (shakeT > 0) {
    shakeT--;
    const m = shakeMag * (shakeT / 8);
    shakeY = rnd(-m, m);
  }

  color("light_blue");
  rect(0, 8 + shakeY, 100, 1);
  color("light_black");
  rect(0, 93 + shakeY, 100, 7);

  if (blastFx.t > 0) {
    blastFx.t--;
    color(blastFx.color);
    arc(
      vec(blastFx.pos.x, blastFx.pos.y + shakeY),
      25 * (1 - blastFx.t / 14),
      2,
      0,
      PI * 2,
    );
  }

  color(iframes % 8 >= 4 ? "blue" : "cyan");
  box(player.pos, 6);

  let blastAt = null;
  remove(enemies, (e) => {
    if (!frozen) {
      e.pos.x += e.dir * e.spd;
      e.fireT--;
      if (
        e.fireT < 0 &&
        abs(e.pos.y - player.pos.y) < 10 &&
        e.pos.x > 0 &&
        e.pos.x < 100
      ) {
        if (e.pos.distanceTo(player.pos) > 36) {
          const d = player.pos.x > e.pos.x ? 1 : -1;
          bullets.push({
            pos: vec(e.pos.x + d * 6, e.pos.y),
            vx: d * (0.8 + difficulty * 0.15),
          });
          play("laser");
        }
        e.fireT = rnd(90, 150);
      }
    }
    color("green");
    const c = box(e.pos, 9, 4);
    if (!blastAt && c.isColliding.rect.cyan) {
      blastAt = vec(e.pos.x, e.pos.y);
      return true;
    }
    return e.pos.x < -12 || e.pos.x > 112;
  });

  if (blastAt) {
    const kills =
      1 + enemies.filter((o) => o.pos.distanceTo(blastAt) < 25).length;
    const chainColor = kills >= 4 ? "purple" : kills >= 2 ? "red" : "light_red";

    play("explosion");
    color(chainColor);
    particle(blastAt, { count: 30 + kills * 5, speed: 4 });
    blastFx.pos.set(blastAt.x, blastAt.y);
    blastFx.t = 14;
    blastFx.color = chainColor;

    let n = 0;
    remove(enemies, (o) => {
      if (o.pos.distanceTo(blastAt) < 25) {
        color(chainColor);
        particle(o.pos, { count: 12 + kills * 2, speed: 3 });
        n++;
        return true;
      }
      return false;
    });
    remove(bullets, (b) => b.pos.distanceTo(blastAt) < 25);
    addScore((5 + n * 8) * combo, blastAt.x, blastAt.y);
    combo++;
    comboT = 120;
    const a = blastAt.angleTo(player.pos);
    player.vx = cos(a) * 2.2;
    player.vy = sin(a) * 2.2;
    iframes = 40;

    hitstop = clamp(2 + kills, 2, 8);
    shakeMag = clamp(1.5 + kills, 1.5, 7);
    shakeT = 8;
  }

  remove(bullets, (b) => {
    if (!frozen) b.pos.x += b.vx;
    color("light_red");
    box(vec(b.pos.x - b.vx * 3, b.pos.y), 3, 1.5);
    box(vec(b.pos.x - b.vx * 6, b.pos.y), 2, 1);
    color("red");
    const c = box(b.pos, 5, 2);
    if (c.isColliding.rect.cyan) {
      if (iframes > 0) return true;
      play("explosion");
      particle(player.pos, { count: 25, speed: 3 });
      end();
    }
    return b.pos.x < -5 || b.pos.x > 105;
  });

  if (combo > 1) {
    color("black");
    text("x" + combo, 3, 12, { isSmallText: true });
  }
}
