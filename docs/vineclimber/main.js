title = "VINE CLIMBER";

description = `
[Hold] Climb
[Release] Slide
`;

characters = [
  `
  ll
l ll l
 llll
  ll
 l  l
l    l 
`,
  `
  ll
  ll 
 llll
l ll l
 l  l
 l  l 
`,
  `
 lll
  l
 lll
l lll
 lll  
  `,
  `
 llll
l llll  
l llll  
l llll  
l llll  
 llll 
  `,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 7,
};

/**
 * @type {{
 * centerX: number, ticks: number,
 * amplitude: number, frequency: number, bending: number,
 * targetAmplitude: number, targetFrequency: number, targetBending: number
 * }} */
let vine;
/** @type {{pos: Vector, speed: number}} */
let player;
/** @type {{pos: Vector, speed: number}[]} */
let obstacles;
let nextObstacleTicks;
/** @type {{pos: Vector, vx: number}} */
let coin;
let multiplier;

function update() {
  if (!ticks) {
    // Initialize game objects and variables
    vine = {
      centerX: 50,
      ticks: 0,
      amplitude: 30,
      frequency: 0.03,
      bending: 0.5,
      targetAmplitude: 30,
      targetFrequency: 0.03,
      targetBending: 0.5,
    };
    player = { pos: vec(50, 80), speed: 1 };
    obstacles = [];
    nextObstacleTicks = 0;
    coin = undefined;
    multiplier = 1;
  }

  // Update player position
  let animIndex = 1;
  if (input.isPressed) {
    player.pos.y -= player.speed * 0.8 * difficulty;
    animIndex = floor(ticks / 20) % 2;
    if (ticks % 20 === 0) {
      play("click");
    }
  } else {
    if (input.isJustReleased) {
      play("hit");
    }
    player.pos.y += player.speed * 1.2 * difficulty;
  }
  player.pos.y = clamp(player.pos.y, 0, 99);
  player.pos.x =
    vine.centerX +
    Math.pow(
      Math.sin(
        ((vine.ticks + player.pos.y * vine.bending) * vine.frequency) / 2
      ),
      2
    ) *
      vine.amplitude *
      2 -
    vine.amplitude;
  vine.ticks++;
  vine.amplitude += (vine.targetAmplitude - vine.amplitude) * 0.01;
  vine.frequency += (vine.targetFrequency - vine.frequency) * 0.01;
  vine.bending += (vine.targetBending - vine.bending) * 0.01;
  if (rnd() < 0.005) {
    vine.targetAmplitude = rnd(25, 40);
    vine.targetFrequency = rnd(0.025, 0.04);
    vine.targetBending = rnd(0.45, 0.6);
  }

  color("green");
  for (let y = 0; y <= 100; y += 5) {
    const x =
      vine.centerX +
      Math.pow(
        Math.sin(((vine.ticks + y * vine.bending) * vine.frequency) / 2),
        2
      ) *
        vine.amplitude *
        2 -
      vine.amplitude;
    box(x, y, 2, 5);
  }
  if (vine.ticks * vine.frequency >= PI * 2) {
    vine.ticks = 0;
  }

  color("red");
  remove(obstacles, (o) => {
    o.speed += 0.01 * sqrt(difficulty);
    o.pos.y += o.speed;
    char("c", o.pos);
    return o.pos.y > 105;
  });
  nextObstacleTicks--;
  if (nextObstacleTicks < 0) {
    obstacles.push({
      pos: vec(rnd(10, 90), 0),
      speed: rnd(0.5) * difficulty,
    });
    nextObstacleTicks = rnd(70, 90) / difficulty;
  }

  color("blue");
  if (char(addWithCharCode("a", animIndex), player.pos).isColliding.char.c) {
    play("explosion");
    end();
  }

  if (coin == null) {
    const vx = rnds(0.18, 0.25) * difficulty;
    coin = {
      pos: vec(vx > 0 ? -10 : 110, rnd(10, 90)),
      vx,
    };
  }
  color("yellow");
  coin.pos.x += coin.vx;
  const c = char("d", coin.pos).isColliding.char;
  if (c.a || c.b) {
    play("coin");
    addScore(multiplier, coin.pos);
    multiplier = clamp(multiplier + 1, 1, 9);
    coin = undefined;
  } else if (coin.pos.x < -10 || coin.pos.x > 110) {
    multiplier = 1;
    coin = undefined;
  }
}
