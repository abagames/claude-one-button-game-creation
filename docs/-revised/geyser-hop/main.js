title = "GEYSER HOP";

description = `
[Hold] Rise
Stomp geysers!
`;

characters = [];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 0,
};

let player;
let geysers;
let spawnTicks;
let ceiling;
let groundY;
let stompTimer;
let multiplier;
let trails;
let prevVy;

function update() {
  if (!ticks) {
    groundY = 92;
    ceiling = 3;
    player = { x: 40, y: 40, vy: 0 };
    geysers = [];
    trails = [];
    stompTimer = 0;
    geysers.push({ x: 95, height: 40, vx: -1, stomped: false });
    spawnTicks = 60;
    multiplier = 1;
    prevVy = 0;
  }

  let baseSpeed = sqrt(difficulty);

  // Spawn geysers
  spawnTicks--;
  if (spawnTicks < 0) {
    let h = 30 + floor(rnd(10, 30));
    geysers.push({
      x: 110,
      height: h,
      vx: -baseSpeed,
      stomped: false,
    });
    spawnTicks = 90 / sqrt(difficulty);
  }

  // Ceiling pressure
  stompTimer++;
  if (stompTimer > 200) {
    ceiling += 0.1;
  }

  // Player physics
  if (input.isPressed) {
    player.vy -= 0.16;
  } else {
    player.vy += 0.13;
  }
  player.vy = clamp(player.vy, -2.2, 3);

  // Direction change particles
  if (prevVy < 0 && player.vy > 0) {
    color("cyan");
    particle(player.x, player.y - 3, 5, 1, -PI / 2, PI / 4);
  }
  prevVy = player.vy;

  player.y += player.vy * sqrt(difficulty);

  // Add trail
  if (abs(player.vy) > 1) {
    trails.push({ x: player.x, y: player.y, life: 8 });
  }

  // Boundaries
  if (player.y < ceiling || player.y > groundY) {
    play("explosion");
    end();
  }

  // Draw ceiling danger zone
  color("red");
  rect(0, 0, 100, ceiling);
  if (stompTimer > 150) {
    color("yellow");
    text("!", 50, ceiling + 7);
  }

  // Draw ground
  color("green");
  rect(0, groundY, 100, 8);

  // Draw trails (afterimage)
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    t.life--;
    if (t.life <= 0) {
      trails.splice(i, 1);
      continue;
    }
    color("light_cyan");
    box(t.x, t.y, 4 * (t.life / 8), 4 * (t.life / 8));
  }

  // Draw player with squash & stretch
  let stretch = clamp(-player.vy * 0.4, -1.5, 1.5);
  let pw = 6 - stretch;
  let ph = 6 + stretch;
  color("cyan");
  box(player.x, player.y, pw, ph);

  // Player eyes
  let eyeOffsetY = player.vy > 0 ? 0.8 : player.vy < -0.5 ? -0.8 : 0;
  color("white");
  box(player.x - 1.5, player.y - 0.5, 2.5, 3);
  box(player.x + 1.5, player.y - 0.5, 2.5, 3);
  color("black");
  rect(player.x - 2, player.y - 0.5 + eyeOffsetY, 1, 1.5);
  rect(player.x + 1, player.y - 0.5 + eyeOffsetY, 1, 1.5);

  // Process geysers
  for (let i = geysers.length - 1; i >= 0; i--) {
    let g = geysers[i];
    g.x += g.vx;

    if (g.x < -15) {
      geysers.splice(i, 1);
      if (!g.stomped) {
        multiplier = max(multiplier - 1, 1);
      }
      continue;
    }

    let gTop = groundY - g.height;

    // Draw geyser column
    color("blue");
    let bodyCol = rect(g.x - 5, gTop + 4, 10, g.height - 4);

    // Draw stomp zone (yellow top)
    color(g.stomped ? "purple" : "yellow");
    let topCol = rect(g.x - 6, gTop, 12, 6);

    // Geyser eyes (look at player)
    if (!g.stomped) {
      let lookX = clamp((player.x - g.x) * 0.05, -1, 1);
      let lookY = clamp((player.y - gTop) * 0.03, -1, 1);
      color("white");
      box(g.x - 2.5, gTop + 3, 3, 4);
      box(g.x + 2.5, gTop + 3, 3, 4);
      color("black");
      rect(g.x - 3 + lookX, gTop + 2.5 + lookY, 1, 2);
      rect(g.x + 2 + lookX, gTop + 2.5 + lookY, 1, 2);
    }

    // Water particles
    color("light_blue");
    particle(g.x, gTop, 1, 0.7, -PI / 2, PI / 5);

    // Tutorial text
    if (i === 0 && !g.stomped && score === 0) {
      color("black");
      text("v STOMP!", g.x, gTop - 12);
    }

    // Check stomp collision
    if (!g.stomped && topCol.isColliding.rect.cyan) {
      if (player.vy > 0) {
        play("powerUp");
        addScore(multiplier, g.x, gTop);
        multiplier = min(multiplier + 1, 16);
        color("yellow");
        particle(g.x, gTop, 30, 3, 0, PI);
        player.vy = -2.8;
        g.stomped = true;
        g.height = 8;
        stompTimer = 0;
        ceiling = max(3, ceiling - 8);
      } else {
        play("hit");
        end();
      }
    }

    // Body collision = death
    if (!g.stomped && bodyCol.isColliding.rect.cyan) {
      play("explosion");
      end();
    }
  }

  // Slowly center player horizontally
  player.x += (45 - player.x) * 0.01;

  color("black");
  text(`x${multiplier}`, 3, 9, { isSmallText: true });
}
