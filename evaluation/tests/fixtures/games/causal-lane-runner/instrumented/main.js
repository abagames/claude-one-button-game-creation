title = "CAUSAL LANE";

description = `
[Hold] Rise
`;

characters = [];

options = {
  viewSize: { x: 100, y: 100 },
  theme: "dark",
  isPlayingBgm: false,
  isSoundEnabled: false,
  isReplayEnabled: false,
};

let player;
let walls;
let coins;
let spawnCountdown;

function update() {
  if (!ticks) {
    player = { pos: vec(18, 50), vy: 0 };
    walls = [];
    coins = [];
    spawnCountdown = 10;
  }

  player.vy = clamp(player.vy + (input.isPressed ? -0.21 : 0.19), -2.2, 2.2);
  player.pos.y += player.vy;

  spawnCountdown--;
  if (spawnCountdown <= 0) {
    spawnCountdown = 34;
    const gapCenter = 24 + rnd(52);
    walls.push({ pos: vec(104, gapCenter - 33), size: vec(7, 46) });
    walls.push({ pos: vec(104, gapCenter + 33), size: vec(7, 46) });
    coins.push({ pos: vec(104, gapCenter + 6) });
  }

  walls.forEach((wall) => {
    wall.pos.x -= 0.9;
  });
  coins.forEach((coin) => {
    coin.pos.x -= 0.9;
  });
  remove(walls, (wall) => wall.pos.x < -8);
  remove(coins, (coin) => coin.pos.x < -8);

  color("yellow");
  coins.forEach((coin) => {
    beginDrawing({ type: "coin", object: coin });
    box(coin.pos, 3);
    endDrawing();
  });

  color("red");
  walls.forEach((wall) => {
    beginDrawing({ type: "wall", object: wall });
    box(wall.pos, wall.size);
    endDrawing();
  });

  color("cyan");
  beginDrawing({ type: "player", object: player });
  const collision = box(player.pos, 5);
  endDrawing();

  const collected = coins.filter((coin) => (
    Math.abs(coin.pos.x - player.pos.x) <= 4 && Math.abs(coin.pos.y - player.pos.y) <= 4
  ));
  collected.forEach((coin) => {
    addScore(1, coin.pos.x, coin.pos.y);
  });
  remove(coins, (coin) => collected.indexOf(coin) >= 0);

  if (collision.isColliding.rect.red || player.pos.y <= 2.5 || player.pos.y >= 97.5) {
    end();
  }
}
