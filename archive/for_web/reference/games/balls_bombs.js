title = "BALLS BOMBS";

description = `
[Hold] Walk
`;

characters = [
  `
 llll
llLlll
lLllll
llllll
llllll
 llll
`,
  `


 llll
lLLlll
llllll
 llll
`,
  `
llllll
ll l l
ll l l
llllll
 l  l
 l  l
  `,
  `
llllll
ll l l
ll l l
llllll
ll  ll
  `,
  `
    r
   l
 llll
llllll
llllll
 llll
`,
  `
   r
   l
 llll
llllll
llllll
  `,
  `
    r
   l
 llll
ll l l
ll l l
 llll
`,
  `
   r
   l
 llll
ll l l
ll l l
`,
];

options = {
  viewSize: { x: 150, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};

/** @type {{pos: Vector, vel: Vector}[]} */
let balls;
let nextBallDist;
let playerX;
let walkSpeed;
let isBombPlayer;
let bombX;
let nextBombDist;
let explosionX;
let explosionXRadius;
let wallX;
let multiplier;

function update() {
  if (!ticks) {
    balls = [];
    nextBallDist = 0;
    playerX = 30;
    walkSpeed = 1;
    bombX = undefined;
    isBombPlayer = false;
    nextBombDist = 50;
    explosionX = undefined;
    explosionXRadius = 0;
    wallX = 99;
    multiplier = 1;
  }
  const sd = sqrt(difficulty);
  const scr = playerX > 50 ? (playerX - 50) * 0.1 : 0;
  if (explosionX != null) {
    explosionX -= scr;
    explosionXRadius += 1;
    color(explosionXRadius > 60 ? "light_red" : "red");
    arc(explosionX, 87, explosionXRadius, 3, PI - 0.1, PI * 2 + 0.1);
    if (explosionXRadius > 64) {
      explosionX = undefined;
      multiplier = 1;
    }
  }
  color("light_black");
  rect(0, 90, 150, 10);
  wallX = wrap(wallX - scr, -5, 155);
  rect(wallX, 0, 1, 90);
  color("white");
  rect(wrap(wallX + 99, -5, 155), 90, 1, 10);
  color("black");
  nextBombDist -= isBombPlayer ? 0 : scr;
  if (nextBombDist < 0) {
    bombX = 153;
    nextBombDist += rnd(150, 180);
  }
  if (bombX != null) {
    bombX -= scr;
    char(addWithCharCode("e", floor(ticks / 20) % 2), bombX, 87);
  }
  if (input.isJustPressed) {
    play("laser");
    walkSpeed = 2;
  }
  playerX += (input.isPressed ? sd * clamp(walkSpeed, 0, 1) : 0) - scr;
  walkSpeed *= 0.998;
  const c = char(
    addWithCharCode(isBombPlayer ? "g" : "c", floor(ticks / 20) % 2),
    playerX,
    87
  ).isColliding.char;
  if (c.e || c.f) {
    play("powerUp");
    isBombPlayer = true;
    bombX = undefined;
  }
  nextBallDist -= clamp(scr, sd * 0.2, 99);
  if (nextBallDist < 0) {
    const pos = vec(rnd() < 0.1 ? rnd(-20, -3) : rnd(153, 200), rnd(10, 40));
    const vel = vec((pos.x < 0 ? 2 : -1) * rnd(0.3, 0.7), 0);
    balls.push({ pos, vel });
    nextBallDist += rnd(24, 32) / sd;
  }
  remove(balls, (b) => {
    b.vel.y += 0.1;
    b.pos.add(b.vel.x * sd - scr, b.vel.y * sd);
    if (b.pos.y > 87 && b.vel.y > 0) {
      play("hit");
      b.vel.y *= -1.01;
      b.pos.y = 87;
    }
    if (b.pos.x < 3 && b.vel.x < 0) {
      b.vel.x *= -1.01 * 2;
    }
    if (b.pos.x > 147 && b.vel.x > 0) {
      b.vel.x *= -1.01 / 2;
    }
    const c = char(
      addWithCharCode("a", b.pos.y > 80 && b.vel.y < 0 ? 1 : 0),
      b.pos.x,
      clamp(b.pos.y, 0, 87)
    ).isColliding;
    if (c.rect.red || c.rect.light_red) {
      play("coin");
      addScore(multiplier, b.pos);
      particle(b.pos);
      multiplier++;
      return true;
    } else if (c.char.c || c.char.d) {
      play("lucky");
      end();
    } else if (c.char.g || c.char.h) {
      play("explosion");
      explosionX = playerX;
      explosionXRadius = 6;
      bombX = undefined;
      isBombPlayer = false;
      return true;
    }
  });
}
