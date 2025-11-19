title = "TAPPUMP";

description = `
[Tap]  Jump
[Hold] Pump
`;

characters = [
  `
r r r
 r r
rrRrr
 r r
r r r
`,
  `
 yyyy
y yyYy
y yyYy
y yyYy
y yyYy
 yyyy
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 7,
};

/** @type {{pos: Vector, vel: Vector, radius: number, rv: number}} */
let player;
/** @type {Vector[]} */
let spikes;
let nextSpikeDist;
/** @type {Vector[]} */
let coins;
let coinY;
let coinVy;
let nextCoinDist;

function update() {
  if (!ticks) {
    player = { pos: vec(10, 20), vel: vec(), radius: 1, rv: 0 };
    spikes = [];
    coins = [];
    coinY = 50;
    coinVy = 0;
    nextSpikeDist = 40;
    nextCoinDist = 0;
  }
  const scr = player.pos.x > 20 ? (player.pos.x - 20) * 0.2 : 0;
  nextSpikeDist -= scr;
  if (nextSpikeDist < 0) {
    play("laser");
    spikes.push(vec(103, rnd(99)));
    nextSpikeDist += rnd(40, 140);
  }
  color("black");
  remove(spikes, (s) => {
    s.x -= scr;
    char("a", s);
    return s.x < -2;
  });
  color("green");
  player.vel.x = difficulty;
  if (input.isJustPressed) {
    play("select");
    player.vel.y -= sqrt(difficulty) * 2;
  }
  player.vel.y -= sqrt(difficulty) * (input.isPressed ? 0.03 : -0.12);
  if (input.isPressed) {
    player.rv += difficulty * 0.08;
    player.radius += player.rv;
  } else {
    player.radius += (1 - player.radius) * 0.04 * difficulty;
    player.rv = 0;
  }
  player.pos.add(player.vel);
  player.pos.x -= scr;
  const c = arc(player.pos, player.radius, 5).isColliding.char;
  if (
    c.a ||
    player.pos.y < -5 - player.radius ||
    player.pos.y > 105 + player.radius
  ) {
    play("explosion");
    end();
  }
  color("black");
  nextCoinDist -= scr;
  coinVy += rnds(0.1);
  coinVy *= 0.98;
  coinY += coinVy;
  if ((coinY < 10 && coinVy < 0) || (coinY > 90 && coinVy > 0)) {
    coinVy *= -1;
  }
  if (nextCoinDist < 0) {
    coins.push(vec(103, coinY + rnds(9)));
    nextCoinDist += rnd(6, 9);
  }
  remove(coins, (c) => {
    c.x -= scr;
    const cl = char("b", c).isColliding;
    if (cl.rect.green) {
      const sc = ceil(player.radius);
      play(sc < 20 ? "coin" : "powerUp");
      addScore(sc, c);
      return true;
    }
    return cl.char.a || c.x < -3;
  });
}
