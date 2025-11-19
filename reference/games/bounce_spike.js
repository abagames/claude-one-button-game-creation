title = "BOUNCE SPIKE";

description = `
[Tap] Reverse direction
`;

characters = [
  `
 lll
lllll
lllll
 lll
`,
  `
 ppp
 ppp
ppppp
 ppp
`,
  `
cccccc
ccccc
cccc
ccc
cc
c
`,
];

options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 42,
};

// Balance-tunable parameters (グローバル定数)
const PLAYER_GRAVITY = 0.15;
const PLAYER_HOP_X = 2;
const PLAYER_HOP_Y = -4;
const PLAYER_HOP_TICKS = 9;
const SCROLL_SPEED = 0.5;
const SPIKE_INITIAL_DIST = 30;
const SPIKE_INTERVAL_MIN = 40;
const SPIKE_INTERVAL_MAX = 80;
const SPIKE_WIDTH_MIN = 2;
const SPIKE_WIDTH_MAX = 5;
const MISSILE_INTERVAL = 30;
const MISSILE_HIT_DISTANCE = 9;
const MISSILE_TIMEOUT = 180;
const MISSILE_STEERING_WEAK = 0.1;
const MISSILE_STEERING_STRONG = 3;
const MISSILE_STEERING_NORMAL = 1;
const MISSILE_DAMPING_EARLY = 0.7;
const MISSILE_DAMPING_LATE = 0.95;
const MISSILE_SCORE_REWARD = 10;

/** @type {{pos: Vector, vel: Vector, vx: number, hopTicks: number, grv: number, hop: Vector}} */
let player;
/** @type {{pos: Vector, width: number, age: number}[]} */
let spikes;
/** @type {{pos: Vector, vel: Vector, targetX: number, targetY: number, ticks: number}[]} */
let missiles;
let spikeAddDist;
let nextSpikeX;
let nextSpikeVx;
let missileTimer;
let scr;

function update() {
  if (!ticks) {
    player = {
      pos: vec(50, 70),
      vel: vec(0, 0),
      vx: 1,
      hopTicks: PLAYER_HOP_TICKS,
      grv: PLAYER_GRAVITY,
      hop: vec(PLAYER_HOP_X, PLAYER_HOP_Y),
    };
    spikes = [];
    missiles = [];
    spikeAddDist = SPIKE_INITIAL_DIST;
    nextSpikeX = 50;
    nextSpikeVx = 1;
    missileTimer = 0;
    scr = 0;
  }

  scr = sqrt(difficulty) * SCROLL_SPEED;

  // Player bounce logic
  if (player.hopTicks > 0) {
    player.hopTicks -= difficulty;
    if (player.hopTicks <= 0) {
      play("jump");
      particle(player.pos, 9, -player.hop.y, -PI / 2, PI / 2);
      player.vel.set(player.hop.x * player.vx * difficulty, player.hop.y * difficulty);
    } else {
      const r = player.hopTicks < 5 ? 1 - player.hopTicks / 5 : (player.hopTicks - 5) / 5;
      color("cyan");
      box(player.pos.x, player.pos.y - 2 * r, 3, 4 * r);
    }
  }

  player.pos.add(player.vel);
  player.vel.y += player.grv * difficulty * difficulty;

  if (player.pos.y > 95) {
    player.pos.y = 95;
    player.hopTicks = PLAYER_HOP_TICKS;
  }

  if ((player.pos.x < 5 && player.vx < 0) || (player.pos.x > 95 && player.vx > 0)) {
    player.vx *= -1;
    player.vel.x *= -1;
  }

  if (input.isJustPressed) {
    play("hit");
    player.vx *= -1;
    player.vel.x *= -1;
  }

  color("black");
  const pc = char(String.fromCharCode("a".charCodeAt(0) + floor(ticks / 10) % 2), player.pos);
  if (pc.isColliding.char.c) {
    play("explosion");
    end();
  }

  // Spike generation and movement
  spikeAddDist -= scr;
  if (spikeAddDist < 0) {
    play("laser");
    const width = rndi(SPIKE_WIDTH_MIN, SPIKE_WIDTH_MAX);
    spikes.push({
      pos: vec(clamp(nextSpikeX, 12, 88 - width * 6), 0),
      width: width,
      age: 0,
    });
    spikeAddDist = rnd(SPIKE_INTERVAL_MIN, SPIKE_INTERVAL_MAX);
    nextSpikeX += nextSpikeVx * width * 6;
    if ((nextSpikeX < 15 && nextSpikeVx < 0) || (nextSpikeX > 85 && nextSpikeVx > 0)) {
      nextSpikeVx *= -1;
    }
  }

  color("red");
  spikes = spikes.filter((s) => {
    s.pos.y += scr;
    s.age++;
    for (let i = 0; i < s.width; i++) {
      char("c", s.pos.x + i * 6, s.pos.y);
    }
    return s.pos.y < 120;
  });

  // Missile spawning (chase weapon)
  missileTimer -= difficulty;
  if (missileTimer < 0 && spikes.length > 0) {
    const targetSpike = spikes[rndi(0, spikes.length)];
    const targetX = targetSpike.pos.x + targetSpike.width * 3;
    const targetY = targetSpike.pos.y;
    missiles.push({
      pos: vec(player.pos.x, player.pos.y - 5),
      vel: vec(0, -1),
      targetX: targetX,
      targetY: targetY,
      ticks: 0,
    });
    play("powerUp");
    missileTimer = MISSILE_INTERVAL / difficulty;
  }

  // Missile chase logic
  color("yellow");
  missiles = missiles.filter((m) => {
    m.pos.add(m.vel);
    m.ticks += sqrt(difficulty);

    const dx = m.targetX - m.pos.x;
    const dy = m.targetY - m.pos.y;
    const d = sqrt(dx * dx + dy * dy);

    if (d < MISSILE_HIT_DISTANCE) {
      play("coin");
      particle(m.pos, 20, 2);
      addScore(MISSILE_SCORE_REWARD, m.pos);
      const idx = spikes.findIndex((s) =>
        abs(s.pos.x + s.width * 3 - m.targetX) < 10 && abs(s.pos.y - m.targetY) < 10
      );
      if (idx >= 0) {
        spikes.splice(idx, 1);
      }
      return false;
    }

    if (m.pos.y < -5 || m.pos.y > 105 || m.ticks > MISSILE_TIMEOUT) {
      return false;
    }

    const targetAngle = atan2(dy, dx);
    const mv = (sqrt(difficulty) / sqrt(d + 9)) * (m.ticks < 9 ? MISSILE_STEERING_WEAK : m.ticks < 20 ? MISSILE_STEERING_STRONG : MISSILE_STEERING_NORMAL);
    m.vel.addWithAngle(targetAngle, mv);
    m.vel.mul(m.ticks < 20 ? MISSILE_DAMPING_EARLY : MISSILE_DAMPING_LATE);

    char(String.fromCharCode("a".charCodeAt(0) + floor(m.ticks / 3) % 2), m.pos);
    return true;
  });
}
