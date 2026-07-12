title = "BORE COMET";

description = `
[Hold] Drill thrust
[Release] Fall
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 39,
};

let player;
let obstacles;
let enemies;
let nextRockX;
let nextEnemyT;
let wasInRock;
let hitstop;
let shakeMag;
let shakeT;
let burstFx;
let destFx;

function update() {
  if (!ticks) {
    player = { pos: vec(35, 30), vy: 0 };
    obstacles = [];
    enemies = [];
    nextRockX = 20;
    nextEnemyT = 60;
    wasInRock = false;
    hitstop = 0;
    shakeMag = 0;
    shakeT = 0;
    burstFx = { pos: vec(0, 0), t: 0, color: "light_yellow", radius: 22 };
    destFx = { pos: vec(0, 0), t: 0, color: "light_black", radius: 0 };
  }
  const spd = 0.5 + difficulty * 0.1;
  const drilling = input.isPressed;
  const frozen = hitstop > 0;
  if (frozen) hitstop--;

  // rock overlap check
  let inRock = false;
  let curRock = null;
  obstacles.forEach((r) => {
    if (
      abs(player.pos.x - r.pos.x) < r.w / 2 + 2 &&
      abs(player.pos.y - r.pos.y) < r.h / 2 + 2
    ) {
      inRock = true;
      curRock = r;
    }
  });

  if (!frozen) {
    if (drilling) {
      player.vy -= inRock ? 0.06 : 0.11;
      if (inRock && ticks % 2 === 0) {
        particle(player.pos, { count: 3, speed: 1.5 });
      }
      // digging itself scores, every tick — no floating text (addScore with no position)
      if (inRock) {
        addScore(1);
        // sustained drilling can fully destroy the rock — a size-scaled bonus burst
        curRock.boreT++;
        const boreThreshold = round(sqrt(curRock.w * curRock.h) / (spd / 0.5));
        if (curRock.boreT >= boreThreshold) {
          const destRadius = 15 + (curRock.w + curRock.h) / 4;
          const m = enemies.filter(
            (e) => e.pos.distanceTo(player.pos) < destRadius,
          ).length;
          play("explosion");
          color("light_black");
          particle(curRock.pos, { count: 30, speed: 3 });
          // completion bonus, always awarded — matches the trickle just earned boring this rock
          addScore(boreThreshold, player.pos.x, player.pos.y - 6);
          if (m > 0) {
            remove(enemies, (e) => {
              if (e.pos.distanceTo(player.pos) < destRadius) {
                color("purple");
                particle(e.pos, { count: 10 + m * 2, speed: 2 });
                return true;
              }
              return false;
            });
            addScore(m * m * 3, player.pos.x, player.pos.y);
            play("powerUp");
          }
          hitstop = max(hitstop, clamp(3 + m, 3, 8));
          shakeMag = max(shakeMag, clamp(2 + m * 0.8, 2, 6));
          shakeT = 8;
          destFx.pos.set(curRock.pos.x, curRock.pos.y);
          destFx.radius = destRadius;
          destFx.t = 14;
          obstacles = obstacles.filter((o) => o !== curRock);
          inRock = false;
        }
      }
    }
    player.vy += 0.05;
    player.vy = clamp(player.vy, -1.5, 1.8);
    player.pos.y += player.vy * (inRock && drilling ? 0.45 : 1);
    if (player.pos.y < 10) {
      player.pos.y = 10;
      player.vy = 0;
    }
  }

  // exiting a rock while drilling → piercing burst, escalating with kill count
  if (wasInRock && !inRock && drilling) {
    const n = enemies.filter((e) => e.pos.distanceTo(player.pos) < 22).length;
    const burstColor =
      n >= 4 ? "light_red" : n >= 2 ? "yellow" : "light_yellow";
    play("explosion");
    color(burstColor);
    particle(player.pos, { count: 20 + n * 6, speed: 3 });
    burstFx.pos.set(player.pos.x, player.pos.y);
    burstFx.color = burstColor;
    burstFx.t = 12;
    if (n > 0) {
      remove(enemies, (e) => {
        if (e.pos.distanceTo(player.pos) < 22) {
          color(burstColor);
          particle(e.pos, { count: 10 + n * 2, speed: 2 });
          return true;
        }
        return false;
      });
      addScore(n * n * 3, player.pos.x, player.pos.y);
      play("powerUp");
      hitstop = max(hitstop, clamp(2 + n, 2, 8));
      shakeMag = max(shakeMag, clamp(1.2 + n * 0.8, 1.2, 6));
      shakeT = 8;
    }
  }
  wasInRock = inRock;

  if (!frozen) {
    nextRockX -= spd;
    if (nextRockX < 0) {
      obstacles.push({
        pos: vec(112, rnd(25, 75)),
        w: rnd(14, 30),
        h: rnd(10, 22),
        boreT: 0,
      });
      nextRockX = rnd(30, 55);
    }
    nextEnemyT--;
    if (nextEnemyT < 0) {
      enemies.push({ pos: vec(105, rnd(8, 84)), vx: -(spd + rnd(0.2, 0.5)) });
      nextEnemyT = rnd(50, 90) / sqrt(difficulty);
    }
  }

  // decaying screen shake on a kill burst — decorative bars only, never the sea hazard rect
  let shakeY = 0;
  if (shakeT > 0) {
    shakeT--;
    const m = shakeMag * (shakeT / 8);
    shakeY = rnd(-m, m);
  }
  color("light_cyan");
  rect(0, 6 + shakeY, 100, 1);
  color("light_red");
  rect(0, 90 + shakeY, 100, 2);

  // burst-radius rings: expand from 0 to the true kill radius over 12-14 frames, then vanish
  if (burstFx.t > 0) {
    burstFx.t--;
    color(burstFx.color);
    arc(
      vec(burstFx.pos.x, burstFx.pos.y + shakeY),
      burstFx.radius * (1 - burstFx.t / 12),
      2,
      0,
      PI * 2,
    );
  }
  if (destFx.t > 0) {
    destFx.t--;
    color(destFx.color);
    arc(
      vec(destFx.pos.x, destFx.pos.y + shakeY),
      destFx.radius * (1 - destFx.t / 14),
      2,
      0,
      PI * 2,
    );
  }

  // rocks
  remove(obstacles, (r) => {
    if (!frozen) r.pos.x -= spd;
    color("light_black");
    box(r.pos, r.w, r.h);
    return r.pos.x < -20;
  });

  // crash into rock while not drilling
  if (inRock && !drilling) {
    play("explosion");
    particle(player.pos, { count: 25, speed: 3 });
    end();
  }

  // enemies
  remove(enemies, (e) => {
    if (!frozen) e.pos.x += e.vx;
    color("red");
    box(e.pos, 5, 4);
    if (!inRock && e.pos.distanceTo(player.pos) < 5) {
      play("explosion");
      particle(player.pos, { count: 25, speed: 3 });
      end();
    }
    return e.pos.x < -8;
  });

  // sea below
  color("red");
  const sea = rect(0, 93, 100, 7);
  if (sea.isColliding.rect.cyan) {
    play("explosion");
    end();
  }

  // afterimage trail, algebraic from current vy (straight vertical motion, no history array)
  // clamped to the safe band so the trail can never dip into the sea's color-collision check
  if (abs(player.vy) > 1.0) {
    color(inRock && drilling ? "yellow" : "light_cyan");
    box(vec(player.pos.x, clamp(player.pos.y - player.vy * 2.5, 10, 88)), 4);
    color(inRock && drilling ? "light_yellow" : "cyan");
    box(vec(player.pos.x, clamp(player.pos.y - player.vy * 5, 10, 88)), 3);
  }

  // player (drawn after sea check needs order: draw player first next frame)
  color(inRock && drilling ? "yellow" : "cyan");
  box(player.pos, 5);
  if (drilling) {
    color("light_yellow");
    bar(vec(player.pos.x, player.pos.y - 4), 4, 2, -PI / 2);
  }
  if (player.pos.y > 91) {
    play("explosion");
    particle(player.pos, { count: 25, speed: 3 });
    end();
  }
}
