title = "CUE CRUMB";

description = `
[Tap] Thrust forward
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 56,
};

let player;
let rocks;
let nextRockT;
let hitstop;
let shakeMag;
let shakeT;

function isCrumb(r) {
  return r.size <= 4.5 && r.hot <= 0;
}

function update() {
  if (!ticks) {
    player = { pos: vec(50, 50), face: rnd(PI * 2), vx: 0, vy: 0 };
    rocks = [];
    times(4, () => {
      const p = vec(rnd(12, 88), rnd(12, 88));
      if (p.distanceTo(vec(50, 50)) < 20) p.x = wrap(p.x + 35, 12, 88);
      rocks.push({ pos: p, size: 9, vx: 0, vy: 0, hot: 0 });
    });
    nextRockT = 300;
    hitstop = 0;
    shakeMag = 0;
    shakeT = 0;
  }

  const frozen = hitstop > 0;
  if (frozen) hitstop--;

  if (!frozen) player.face += 0.05 + difficulty * 0.008;

  if (input.isJustPressed) {
    player.vx += cos(player.face) * 1.7;
    player.vy += sin(player.face) * 1.7;
    play("laser");
  }

  if (!frozen) {
    player.vx *= 0.965;
    player.vy *= 0.965;
    player.pos.x += player.vx;
    player.pos.y += player.vy;
    if (player.pos.x < 5 || player.pos.x > 95) player.vx = -player.vx;
    if (player.pos.y < 5 || player.pos.y > 95) player.vy = -player.vy;
    player.pos.clamp(5, 95, 5, 95);
  }

  if (!frozen) {
    nextRockT--;
    if (nextRockT < 0 && rocks.filter((r) => !isCrumb(r)).length < 10) {
      const side = rndi(4);
      rocks.push({
        pos: vec(
          side === 1 ? 97 : side === 3 ? 3 : rnd(100),
          side === 0 ? 3 : side === 2 ? 97 : rnd(100),
        ),
        size: 9,
        vx: rnd(-0.2, 0.2),
        vy: rnd(-0.2, 0.2),
        hot: 0,
      });
      nextRockT = rnd(200, 320) / sqrt(difficulty);
    }
  }

  const spd = sqrt(player.vx * player.vx + player.vy * player.vy);

  // rock-rock interaction: elastic bumps; hot fast shrapnel splits big rocks
  if (!frozen) {
    for (let i = 0; i < rocks.length; i++) {
      for (let j = i + 1; j < rocks.length; j++) {
        const a = rocks[i];
        const b = rocks[j];
        const d = a.pos.distanceTo(b.pos);
        const minD = (a.size + b.size) / 2;
        if (d < minD && d > 0.01) {
          const ang = a.pos.angleTo(b.pos);
          // hot fast fragment cracks a big rock (chain fission)
          const aFast = sqrt(a.vx * a.vx + a.vy * a.vy);
          const bFast = sqrt(b.vx * b.vx + b.vy * b.vy);
          const frag =
            a.hot > 0 && aFast > 0.7 ? a : b.hot > 0 && bFast > 0.7 ? b : null;
          const target = frag === a ? b : a;
          if (
            frag &&
            target.size > 4.5 &&
            !target.splitQ &&
            rocks.filter((r) => !isCrumb(r)).length < 10
          ) {
            target.splitQ = true;
            target.splitFast = frag === a ? aFast : bFast;
            target.splitChainDepth = (frag.chainDepth || 1) + 1;
          } else {
            // elastic-ish separation
            a.vx -= cos(ang) * 0.3;
            a.vy -= sin(ang) * 0.3;
            b.vx += cos(ang) * 0.3;
            b.vy += sin(ang) * 0.3;
          }
        }
      }
    }
  }
  // resolve queued chain splits
  remove(rocks, (r) => {
    if (!r.splitQ) return false;
    const chainDepth = r.splitChainDepth || 2;
    const tier = r.splitFast > 1.6 ? 2 : r.splitFast > 1.0 ? 1 : 0;
    const burstColor =
      tier === 2 ? "light_red" : tier === 1 ? "red" : "light_black";
    play("hit");
    color(burstColor);
    particle(r.pos, { count: 12 + tier * 6, speed: 2 + tier * 0.5 });
    addScore(chainDepth, r.pos.x, r.pos.y - 6);
    hitstop = max(hitstop, clamp(2 + tier, 2, 5));
    shakeMag = max(shakeMag, clamp(1 + tier, 1, 4));
    shakeT = 7;
    const a0 = rnd(PI * 2);
    times(2, (i) => {
      const sa = a0 + (i === 0 ? -0.6 : 0.6);
      rocks.push({
        pos: vec(r.pos.x + cos(sa) * 4, r.pos.y + sin(sa) * 4),
        size: r.size * 0.62,
        vx: cos(sa) * 1.3,
        vy: sin(sa) * 1.3,
        hot: 55,
        chainDepth,
      });
    });
    return true;
  });

  remove(rocks, (r) => {
    if (!frozen) {
      if (r.hot > 0) r.hot--;
      r.vx *= 0.985;
      r.vy *= 0.985;
      r.pos.x += r.vx;
      r.pos.y += r.vy;
      if (r.pos.x < 4 || r.pos.x > 96) r.vx = -r.vx;
      if (r.pos.y < 4 || r.pos.y > 96) r.vy = -r.vy;
      r.pos.clamp(4, 96, 4, 96);
    }
    const rSpd = sqrt(r.vx * r.vx + r.vy * r.vy);

    const d = r.pos.distanceTo(player.pos);
    if (d < r.size / 2 + 3) {
      if (r.size <= 4.5 && r.hot <= 0) {
        // settled crumb: collect
        addScore(2 + floor(difficulty), r.pos.x, r.pos.y);
        play("coin");
        color("yellow");
        particle(r.pos, { count: 8, speed: 1.5 });
        return true;
      }
      if (r.hot > 0 && rSpd > 0.4) {
        // hot shrapnel kills
        play("explosion");
        color("light_red");
        particle(player.pos, { count: 30, speed: 3 });
        end();
      } else if (spd > 0.9 && r.size > 4.5) {
        // ram: split the rock, escalating with impact speed
        const tier = spd > 2.2 ? 2 : spd > 1.4 ? 1 : 0;
        const burstColor =
          tier === 2 ? "light_red" : tier === 1 ? "red" : "yellow";
        play("hit");
        color(burstColor);
        particle(r.pos, { count: 15 + tier * 6, speed: 2 + tier });
        addScore(1, r.pos.x, r.pos.y - 6);
        hitstop = max(hitstop, clamp(2 + tier * 2, 2, 6));
        shakeMag = max(shakeMag, clamp(1 + tier * 1.5, 1, 5));
        shakeT = 8;
        const a = player.pos.angleTo(r.pos);
        times(2, (i) => {
          const sa = a + (i === 0 ? -0.6 : 0.6);
          rocks.push({
            pos: vec(r.pos.x + cos(sa) * 4, r.pos.y + sin(sa) * 4),
            size: r.size * 0.62,
            vx: cos(sa) * (1.2 + spd * 0.4),
            vy: sin(sa) * (1.2 + spd * 0.4),
            hot: 55,
            chainDepth: 1,
          });
        });
        player.vx *= 0.3;
        player.vy *= 0.3;
        return true;
      } else {
        // slow bump: nudge apart
        const a = player.pos.angleTo(r.pos);
        r.vx += cos(a) * 0.5;
        r.vy += sin(a) * 0.5;
      }
    }

    color(r.hot > 0 ? "red" : r.size <= 4.5 ? "yellow" : "light_black");
    box(r.pos, r.size);
    return false;
  });

  // decaying screen shake on split impacts — the aim arrow only, never the collision boxes
  let shakeX = 0;
  let shakeY = 0;
  if (shakeT > 0) {
    shakeT--;
    const m = shakeMag * (shakeT / 8);
    shakeX = rnd(-m, m);
    shakeY = rnd(-m, m);
  }

  // afterimage trail on the cue ball, algebraic from current velocity
  if (spd > 1.2) {
    color("light_cyan");
    box(vec(player.pos.x - player.vx * 1.6, player.pos.y - player.vy * 1.6), 4);
    color("cyan");
    box(vec(player.pos.x - player.vx * 3.2, player.pos.y - player.vy * 3.2), 3);
  }

  // aim arrow + player
  color("light_blue");
  bar(
    vec(
      player.pos.x + cos(player.face) * 8 + shakeX,
      player.pos.y + sin(player.face) * 8 + shakeY,
    ),
    4,
    2,
    player.face,
  );
  color("cyan");
  box(player.pos, 5);
}
