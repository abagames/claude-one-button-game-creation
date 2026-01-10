title = "GROWTH";

description = `
[Hold] Growth
`;

characters = [];

options = {
  theme: "pixel",
  viewSize: { x: 200, y: 70 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 3,
};

/** {{x: number, vx: number, size: number}} */
let player;
/** {{x: number, size: number}[]} */
let enemies;
let nextEnemyDist;
const floorY = 60;

function update() {
  if (!ticks) {
    player = { x: 9, vx: 1, size: 5 };
    enemies = [];
    nextEnemyDist = 0;
  }
  let scr = player.x > 9 ? (player.x - 9) * 0.5 : 0;
  color("light_blue");
  rect(0, floorY, 200, 10);
  if (input.isJustPressed) {
    play("laser");
  }
  player.size +=
    ((input.isPressed ? 50 : 5) - player.size) *
    clamp(player.vx, 1, 999) *
    0.01;
  player.vx += (15 / player.size - 1) * 0.02 * sqrt(difficulty);
  player.x += player.vx - scr;
  if (player.x + player.size / 2 < 1) {
    end();
  }
  color("yellow");
  rect(0, floorY, player.x + player.size / 2, -player.size);
  nextEnemyDist -= scr;
  if (nextEnemyDist < 0) {
    let size = rnd() < 0.8 ? 3 : rnd(5) * rnd(5) + 3;
    if (size < 7) {
      size = 3;
    }
    enemies.push({ x: 400, size });
    nextEnemyDist += rnd(30, 50);
  }
  remove(enemies, (e) => {
    e.x -= scr;
    color(e.size > player.size ? "red" : "cyan");
    const sc = e.x > 100 ? (e.x - 100) / 300 + 1 : 1;
    const sz = e.size / sc;
    const c = rect(e.x / sc, floorY, sz, -sz).isColliding.rect;
    if (c.yellow) {
      if (e.size > player.size) {
        play("explosion");
        end();
      } else {
        play(e.size < 5 ? "hit" : "powerUp");
        const ss = sqrt(e.size);
        particle(e.x, floorY - e.size / 2, ss, ss, 0, PI / 2);
        addScore(
          ceil(clamp(player.vx, 1, 999) * e.size),
          e.x,
          floorY - player.size
        );
      }
      return true;
    }
  });
}
