title = "ROPE CORRAL";

description = `
[Hold] Anchor & swing
[Release] Roll on
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 45,
};

let player;
let buddy;
let enemies;
let spikes;
let swingA;
let swept;
let nextCritT;
let hitstop;
let shakeMag;
let shakeT;

// single-pixel "eye" toward a facing angle — bodies here are only 5px,
// too small for a readable whites+pupil pair, so one offset dot stands in
function eye(pos, ang, dist) {
  color("black");
  box(vec(pos.x + cos(ang) * dist, pos.y + sin(ang) * dist), 1);
}

function spawnCritter() {
  enemies.push({ pos: vec(rnd(15, 85), rnd(15, 85)), ang: rnd(PI * 2) });
}

function update() {
  if (!ticks) {
    player = { pos: vec(30, 50), vx: 0.75, vy: 0.32 };
    buddy = { pos: vec(20, 50) };
    enemies = [];
    spikes = [];
    times(5, () => {
      const p = vec(rnd(15, 85), rnd(15, 85));
      if (p.distanceTo(vec(30, 50)) < 18) p.x = wrap(p.x + 40, 15, 85);
      enemies.push({ pos: p, ang: rnd(PI * 2) });
    });
    times(3, () => {
      let p = vec(50, 50);
      for (let k = 0; k < 8; k++) {
        p = vec(rnd(10, 90), rnd(10, 90));
        let ok = p.distanceTo(vec(30, 50)) >= 20;
        spikes.forEach((s) => {
          if (s.pos.distanceTo(p) < 24) ok = false;
        });
        if (ok) break;
      }
      spikes.push({ pos: p });
    });
    swingA = 0;
    swept = 0;
    nextCritT = 200;
    hitstop = 0;
    shakeMag = 0;
    shakeT = 0;
  }
  const ROPE = 22;
  // difficulty = pace: everything moves faster
  const pace = 1 + (difficulty - 1) * 0.35;
  const frozen = hitstop > 0;
  if (frozen) hitstop--;

  if (input.isPressed) {
    // buddy anchors; you swing around it
    if (input.isJustPressed) {
      swingA = buddy.pos.angleTo(player.pos);
      swept = 0;
      play("select");
    }
    const w = 0.075 * pace;
    if (!frozen) {
      swingA += w;
      swept += w;
    }
    player.pos.set(
      buddy.pos.x + cos(swingA) * ROPE,
      buddy.pos.y + sin(swingA) * ROPE,
    );
    player.vx = -sin(swingA) * (ROPE * w * 0.8);
    player.vy = cos(swingA) * (ROPE * w * 0.8);
    // full revolution → corral everything inside the circle (critters AND spikes)
    if (swept >= PI * 2) {
      swept = 0;
      const inCircle = (p) => p.distanceTo(buddy.pos) < ROPE - 2;
      const nCrit = enemies.filter((e) => inCircle(e.pos)).length;
      const nSpike = spikes.filter((s) => inCircle(s.pos)).length;
      const n = nCrit + nSpike;
      if (n > 0) {
        // particle color/count escalate with corral size — the jackpot gets louder
        const chainColor =
          n >= 6 ? "magenta" : n >= 3 ? "light_red" : "light_yellow";
        color(chainColor);
        remove(enemies, (e) => {
          if (inCircle(e.pos)) {
            particle(e.pos, { count: 10 + n * 2, speed: 2 + n * 0.25 });
            return true;
          }
          return false;
        });
        remove(spikes, (s) => {
          if (inCircle(s.pos)) {
            particle(s.pos, { count: 10 + n * 2, speed: 2 + n * 0.25 });
            return true;
          }
          return false;
        });
        particle(buddy.pos, { count: 16 + n * 3, speed: 2.5 + n * 0.3 });
        addScore(n * n * 4, buddy.pos.x, buddy.pos.y);
        play("powerUp");
        hitstop = clamp(2 + n, 2, 8);
        shakeMag = clamp(1.5 + n, 1.5, 7);
        shakeT = 8;
        // everything removed (critters AND spikes) is immediately replaced by a critter —
        // clearing a spike this way nets +1 critter on screen, not just a like-for-like swap
        times(n, spawnCritter);
      } else {
        play("click");
      }
    }
  } else {
    // roll free; buddy trails behind on the rope
    if (!frozen) {
      player.pos.x += player.vx * pace;
      player.pos.y += player.vy * pace;
      if (player.pos.x < 6 || player.pos.x > 94) player.vx = -player.vx;
      if (player.pos.y < 6 || player.pos.y > 94) player.vy = -player.vy;
      player.pos.clamp(6, 94, 6, 94);
      const d = buddy.pos.distanceTo(player.pos);
      if (d > ROPE) {
        const a = buddy.pos.angleTo(player.pos);
        buddy.pos.set(
          player.pos.x - cos(a) * ROPE,
          player.pos.y - sin(a) * ROPE,
        );
      }
    }
  }

  if (!frozen) {
    nextCritT--;
    if (nextCritT < 0 && enemies.length < 8) {
      enemies.push({ pos: vec(rnd(15, 85), rnd(15, 85)), ang: rnd(PI * 2) });
      nextCritT = rnd(140, 220) / sqrt(difficulty);
    }
  }

  // spikes slowly accrue (telegraphed), spaced away from other spikes
  if (ticks % 700 === 699 && spikes.length < 6) {
    let p = vec(50, 50);
    for (let k = 0; k < 8; k++) {
      p = vec(rnd(10, 90), rnd(10, 90));
      let ok = p.distanceTo(player.pos) >= 20;
      spikes.forEach((s) => {
        if (s.pos.distanceTo(p) < 24) ok = false;
      });
      if (ok) break;
    }
    spikes.push({ pos: p, warm: 60 });
  }

  // critters wander; direct touch COLLECTS one (+1)
  let collected = 0;
  remove(enemies, (e) => {
    e.ang += rnd(-0.2, 0.2);
    e.pos.addWithAngle(e.ang, 0.28 * pace);
    e.pos.clamp(8, 92, 8, 92);
    if (e.pos.x <= 8 || e.pos.x >= 92) e.ang = PI - e.ang;
    if (e.pos.y <= 8 || e.pos.y >= 92) e.ang = -e.ang;
    if (e.pos.distanceTo(player.pos) < 4.5) {
      addScore(1, e.pos.x, e.pos.y);
      play("coin");
      particle(e.pos, { count: 8, speed: 1.5 });
      collected++;
      return true;
    }
    return false;
  });
  // each collected critter is immediately replaced, so the trickle never runs dry
  times(collected, spawnCritter);

  // decaying screen shake on a corral capture — decorative rope/arc only, never the box() hitboxes
  let shakeX = 0;
  let shakeY = 0;
  if (shakeT > 0) {
    shakeT--;
    const m = shakeMag * (shakeT / 8);
    shakeX = rnd(-m, m);
    shakeY = rnd(-m, m);
  }

  // draw: swing sweep indicator
  if (input.isPressed) {
    color("light_yellow");
    arc(
      vec(buddy.pos.x + shakeX, buddy.pos.y + shakeY),
      ROPE,
      1,
      swingA - swept,
      swingA,
    );
  }
  color("light_black");
  line(
    vec(player.pos.x + shakeX, player.pos.y + shakeY),
    vec(buddy.pos.x + shakeX, buddy.pos.y + shakeY),
    1,
  );

  // afterimage trail, algebraic from current velocity (straight-line roll only, no history array;
  // curved swing motion is excluded since a straight offset would misread the arc)
  if (!input.isPressed) {
    const spd = sqrt(player.vx * player.vx + player.vy * player.vy) * pace;
    if (spd > 1.5) {
      color("light_cyan");
      box(
        vec(
          clamp(player.pos.x - player.vx * pace * 2.5, 6, 94),
          clamp(player.pos.y - player.vy * pace * 2.5, 6, 94),
        ),
        4,
      );
      color("cyan");
      box(
        vec(
          clamp(player.pos.x - player.vx * pace * 5, 6, 94),
          clamp(player.pos.y - player.vy * pace * 5, 6, 94),
        ),
        3,
      );
    }
  }

  // spikes kill YOUR ball
  spikes.forEach((s) => {
    if (s.warm > 0) {
      s.warm--;
      if (s.warm % 8 < 4) {
        color("light_red");
        box(s.pos, 2);
      }
      return;
    }
    color("red");
    box(s.pos, 3);
    if (s.pos.distanceTo(player.pos) < 4) {
      play("explosion");
      particle(player.pos, { count: 25, speed: 3 });
      end();
    }
  });

  // critters (collectible — yellow), eye toward their own wander direction
  enemies.forEach((e) => {
    color("yellow");
    box(e.pos, 5, 4);
    eye(e.pos, e.ang, 1.2);
  });

  color("light_blue");
  box(buddy.pos, 5);
  eye(buddy.pos, buddy.pos.angleTo(player.pos), 1.4);
  color("cyan");
  box(player.pos, 5);
  eye(player.pos, atan2(player.vy, player.vx), 1.4);
}
