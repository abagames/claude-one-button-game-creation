title = "LANE HOP";

description = `
[Tap] Flip direction
`;

characters = [];

options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 7
};

// Balance parameters
const PLAYER_HOP_INTERVAL = 9;
const PLAYER_HOP_X_SPEED = 2.5;
const PLAYER_HOP_Y_SPEED = -1.5;
const PLAYER_GRAVITY = 0.12;
const LANE_COUNT = 3;
const LANE_INTERVAL = 20;
const LANE_BASE_Y = 30;
const OBSTACLE_SPAWN_INTERVAL = 60;
const OBSTACLE_SPEED = 1.0;
const MISSILE_SPAWN_INTERVAL = 90;
const MISSILE_BASE_SPEED = 0.5;
const MISSILE_ACCEL = 0.03;
const MISSILE_MAX_SPEED = 2.5;
const MATCH_ZONE_WIDTH = 25;
const MATCH_ZONE_SPEED = 0.8;
const SCORE_PER_MATCH = 5;

/** @type {{pos: Vector, vel: Vector, vx: number, hopTicks: number, lane: number, color: number}} */
let player;
/** @type {{pos: Vector, lane: number}[]} */
let obstacles;
/** @type {{pos: Vector, vel: Vector, targetLane: number}[]} */
let missiles;
/** @type {{x: number, color: number}[]} */
let matchZones;
let nextObstacleTicks;
let nextMissileTicks;
let nextMatchZoneTicks;

function update() {
  if (!ticks) {
    player = {
      pos: vec(30, LANE_BASE_Y + LANE_INTERVAL),
      vel: vec(0, 0),
      vx: 1,
      hopTicks: 0,
      lane: 1,
      color: rndi(3)
    };
    obstacles = [];
    missiles = [];
    matchZones = [];
    nextObstacleTicks = OBSTACLE_SPAWN_INTERVAL;
    nextMissileTicks = MISSILE_SPAWN_INTERVAL;
    nextMatchZoneTicks = 30;
  }

  // Draw lanes
  color("light_black");
  for (let i = 0; i < LANE_COUNT; i++) {
    const y = LANE_BASE_Y + LANE_INTERVAL * i;
    rect(0, y - 1, 200, 1);
    rect(0, y + 1, 200, 1);
  }

  // Player movement
  if (input.isJustPressed) {
    play("select");
    player.vx *= -1;
  }

  player.hopTicks--;
  if (player.hopTicks <= 0) {
    play("jump");
    player.vel.set(PLAYER_HOP_X_SPEED * player.vx * difficulty, PLAYER_HOP_Y_SPEED * difficulty);
    player.hopTicks = PLAYER_HOP_INTERVAL;
    particle(player.pos, 5, 1, -PI / 2, PI / 2);
  }

  player.vel.y += PLAYER_GRAVITY * difficulty;
  player.pos.add(player.vel);

  // Lane constraint
  const targetY = LANE_BASE_Y + LANE_INTERVAL * player.lane;
  if (player.pos.y >= targetY) {
    player.pos.y = targetY;
    player.vel.y = 0;
  }

  // Lane switching
  if (player.pos.y < targetY - LANE_INTERVAL * 0.7 && player.lane > 0) {
    player.lane--;
  } else if (player.pos.y < targetY - LANE_INTERVAL * 0.3 && player.lane < LANE_COUNT - 1) {
    player.lane++;
  }

  // Screen wrap
  if (player.pos.x < 0) {
    player.pos.x += 200;
  } else if (player.pos.x > 200) {
    player.pos.x -= 200;
  }

  // Draw player
  color(player.color === 0 ? "cyan" : player.color === 1 ? "yellow" : "purple");
  const pc = char("a", player.pos);

  // Spawn obstacles
  nextObstacleTicks -= difficulty;
  if (nextObstacleTicks < 0) {
    const lane = rndi(LANE_COUNT);
    obstacles.push({
      pos: vec(200, LANE_BASE_Y + LANE_INTERVAL * lane),
      lane
    });
    nextObstacleTicks = OBSTACLE_SPAWN_INTERVAL / difficulty;
  }

  // Update obstacles
  color("red");
  remove(obstacles, (o) => {
    o.pos.x -= OBSTACLE_SPEED * difficulty;
    const oc = box(o.pos, 4);
    if (oc.isColliding.char.a) {
      play("explosion");
      end();
    }
    return o.pos.x < -5;
  });

  // Spawn missiles
  nextMissileTicks -= difficulty;
  if (nextMissileTicks < 0) {
    const targetLane = rndi(LANE_COUNT);
    missiles.push({
      pos: vec(200, LANE_BASE_Y + LANE_INTERVAL * targetLane),
      vel: vec(-MISSILE_BASE_SPEED * difficulty, 0),
      targetLane
    });
    nextMissileTicks = MISSILE_SPAWN_INTERVAL / difficulty;
  }

  // Update missiles
  color("blue");
  remove(missiles, (m) => {
    const targetY = LANE_BASE_Y + LANE_INTERVAL * m.targetLane;
    const dy = targetY - m.pos.y;
    m.vel.y += dy * 0.05;
    m.vel.x = clamp(m.vel.x - MISSILE_ACCEL * difficulty, -MISSILE_MAX_SPEED * difficulty, -MISSILE_BASE_SPEED);
    m.pos.add(m.vel);

    const mc = char("b", m.pos);
    if (mc.isColliding.char.a) {
      play("explosion");
      end();
    }
    return m.pos.x < -5;
  });

  // Spawn match zones
  nextMatchZoneTicks -= difficulty;
  if (nextMatchZoneTicks < 0) {
    matchZones.push({
      x: 200,
      color: rndi(3)
    });
    nextMatchZoneTicks = 150 / difficulty;
  }

  // Update match zones
  remove(matchZones, (z) => {
    z.x -= MATCH_ZONE_SPEED * difficulty;
    color(z.color === 0 ? "light_cyan" : z.color === 1 ? "light_yellow" : "light_purple");
    rect(z.x, 0, MATCH_ZONE_WIDTH, 100);

    // Check match
    if (player.pos.x > z.x && player.pos.x < z.x + MATCH_ZONE_WIDTH) {
      if (player.color === z.color) {
        play("coin");
        addScore(SCORE_PER_MATCH, player.pos);
        return true;
      }
    }

    return z.x < -MATCH_ZONE_WIDTH;
  });
}
