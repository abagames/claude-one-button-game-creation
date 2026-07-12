title = "SPIN CELL";

description = `
[Tap] Rotate the cell
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 25,
};

let player;
let walls;
let gem;
let creepT;
let warnSeg;
let rotFx;
let trail;
let dying;
let dieT;
let nudgeT;

function update() {
  if (!ticks) {
    player = { pos: vec(50, 40), vx: rnd(0.4, 0.8), vy: 0 };
    walls = [];
    times(12, () => walls.push({ spike: false }));
    walls[1].spike = true;
    walls[7].spike = true;
    gem = { corner: rndi(4) };
    creepT = 400;
    warnSeg = -1;
    rotFx = 0;
    trail = [];
    dying = false;
    dieT = 0;
    nudgeT = 0;
  }

  if (!dying) {
    if (input.isJustPressed) {
      // one-step clockwise shift along the perimeter (12 positions)
      const nw = [];
      times(12, () => nw.push(null));
      times(12, (i) => {
        nw[(i + 1) % 12] = walls[i];
      });
      walls = nw;
      if (warnSeg >= 0) warnSeg = (warnSeg + 1) % 12;
      // floor drag: shifting while the ball rides the floor nudges it
      if (player.pos.y > 87) {
        player.vx -= 0.6;
        player.vx = clamp(player.vx, -1.4, 1.4);
        nudgeT = 8;
        color("light_cyan");
        particle(player.pos, {
          count: 8,
          speed: 2,
          angle: 0,
          angleWidth: PI / 4,
        });
        play("click");
      }
      rotFx = 12;
      play("select");
    }

    creepT--;
    if (creepT < 0) {
      if (warnSeg < 0) {
        const cand = [];
        times(12, (i) => {
          if (!walls[i].spike) cand.push(i);
        });
        if (cand.length > 4) {
          warnSeg = cand[rndi(cand.length)];
          creepT = 90;
        } else {
          creepT = 500;
        }
      } else {
        walls[warnSeg].spike = true;
        color("red");
        particle(segCenter(warnSeg), { count: 10, speed: 1.5 });
        warnSeg = -1;
        let spikeCount = 0;
        times(12, (i) => {
          if (walls[i].spike) spikeCount++;
        });
        creepT = (200 * sqrt(spikeCount + 1)) / sqrt(difficulty);
        play("hit");
      }
    }

    player.vy += 0.06;
    player.pos.x += player.vx;
    player.pos.y += player.vy;

    trail.push(vec(player.pos.x, player.pos.y));
    if (trail.length > 4) trail.shift();

    let hitSide = -1;
    let t = 0;
    if (player.pos.y < 9) {
      hitSide = 0;
      t = (player.pos.x - 7) / 86;
      player.pos.y = 9;
      player.vy = abs(player.vy) * 0.9;
    } else if (player.pos.x > 91) {
      hitSide = 1;
      t = (player.pos.y - 7) / 86;
      player.pos.x = 91;
      player.vx = -abs(player.vx) * 0.95;
    } else if (player.pos.y > 91) {
      hitSide = 2;
      t = (player.pos.x - 7) / 86;
      player.pos.y = 91;
      player.vy = -(3.0 + difficulty * 0.1);
      player.vx += rnd(-0.25, 0.25);
      player.vx = clamp(player.vx, -1.2, 1.2);
      play("jump");
    } else if (player.pos.x < 9) {
      hitSide = 3;
      t = (player.pos.y - 7) / 86;
      player.pos.x = 9;
      player.vx = abs(player.vx) * 0.95;
    }
    if (hitSide >= 0) {
      let idx = clamp(floor(t * 3), 0, 2);
      if (hitSide === 2 || hitSide === 3) idx = 2 - idx;
      if (walls[hitSide * 3 + idx].spike) {
        dying = true;
        dieT = 8;
        play("explosion");
        particle(player.pos, { count: 25, speed: 3 });
      }
    }
  }

  // rotation pulse: a fading ring sells "the whole field just moved"
  if (rotFx > 0) {
    rotFx--;
    color("light_black");
    arc(vec(50, 50), 44 * (1 - rotFx / 12), 1, 0, PI * 2);
  }

  // draw walls (true clockwise perimeter: bottom/left drawn reversed)
  times(12, (i) => {
    const side = floor(i / 3);
    const idx = i % 3;
    const L = 86 / 3;
    if (walls[i].spike) color("red");
    else if (i === warnSeg && creepT % 10 < 5) color("light_red");
    else color("light_black");
    if (side === 0) rect(7 + idx * L, 3, L, 4);
    if (side === 1) rect(93, 7 + idx * L, 4, L);
    if (side === 2) rect(7 + (2 - idx) * L, 93, L, 4);
    if (side === 3) rect(3, 7 + (2 - idx) * L, 4, L);
  });

  // gem
  const corners = [vec(14, 14), vec(86, 14), vec(86, 86), vec(14, 86)];
  const gp = corners[gem.corner];
  color("yellow");
  box(gp, 5);
  if (!dying && player.pos.distanceTo(gp) < 8) {
    const spikeIdx = [];
    times(12, (i) => {
      if (walls[i].spike) spikeIdx.push(i);
    });
    addScore(pow(max(spikeIdx.length, 1), 2), gp.x, gp.y);
    play("coin");
    particle(gp, { count: 12, speed: 2 });
    if (spikeIdx.length > 0) {
      const revert = spikeIdx[rndi(spikeIdx.length)];
      walls[revert].spike = false;
      color("light_black");
      particle(segCenter(revert), { count: 10, speed: 1.5 });
      play("powerUp");
    }
    gem.corner = (gem.corner + 1 + rndi(3)) % 4;
  }

  // afterimage trail, only while the ball is moving fast enough to read as speed
  const spd = sqrt(player.vx * player.vx + player.vy * player.vy);
  if (spd > 1.5) {
    trail.forEach((p, i) => {
      color(i % 2 === 0 ? "light_cyan" : "cyan");
      box(p, 3);
    });
  }

  if (nudgeT > 0) {
    nudgeT--;
    color(nudgeT % 2 === 0 ? "light_cyan" : "cyan");
  } else {
    color("cyan");
  }
  box(player.pos, 5);

  if (dying) {
    dieT--;
    if (dieT <= 0) end();
  }
}

function segCenter(i) {
  const side = floor(i / 3);
  const idx = i % 3;
  const L = 86 / 3;
  if (side === 0) return vec(7 + idx * L + L / 2, 5);
  if (side === 1) return vec(95, 7 + idx * L + L / 2);
  if (side === 2) return vec(7 + (2 - idx) * L + L / 2, 95);
  return vec(5, 7 + (2 - idx) * L + L / 2);
}
