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

function update() {
  if (!ticks) {
    groundY = 92;
    ceiling = 3;
    player = { x: 40, y: 40, vy: 0 };
    geysers = [];
    stompTimer = 0;
    // Initial geyser
    geysers.push({ x: 95, height: 40, vx: -1, stomped: false });
    spawnTicks = 60;
    multiplier = 1;
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

  // Ceiling pressure - must stomp to survive
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
  player.y += player.vy * sqrt(difficulty);

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

  // Draw player (target for collision)
  color("cyan");
  box(player.x, player.y, 6, 6);

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

    // Water particles
    color("light_blue");
    particle(g.x, gTop, 1, 0.7, -PI / 2, PI / 5);

    // Tutorial text for first geyser
    if (i === 0 && !g.stomped && score === 0) {
      color("black");
      text("v STOMP!", g.x, gTop - 12);
    }

    // Check stomp collision (top zone)
    if (!g.stomped && topCol.isColliding.rect.cyan) {
      if (player.vy > 0) {
        play("powerUp");
        addScore(multiplier, g.x, gTop);
        multiplier = min(multiplier + 1, 16);
        particle(g.x, gTop, 25, 2, 0, PI);
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
