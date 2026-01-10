title = "BALL TOUR";

description = `
[Hold]
 Move forward
`;

characters = [
  `
llllll
l l ll
l l ll
llllll
 l  l
 l  l
  `,
  `
llllll
l l ll
l l ll
llllll
ll  ll
  `,
  `
 lll
ll ll
l lll
lllll
 lll
 ll
`,
];

options = {
  theme: "dark",
  isReplayEnabled: true,
  seed: 7,
};

/** @type {{pos: Vector, yAngle: number, vx: number, ticks: number}} */
let player;
/** @type {{pos: Vector, vy: number}[]} */
let spikes;
let nextSpikeDist;
/** @type {Vector[]} */
let balls;
let nextBallDist;
let multiplier;

function update() {
  if (!ticks) {
    if (!isReplaying) {
      sss.setTempo(80);
      // Play BGM at the start of the game.
      // The 'bgm' variable is assigned MML string copied from the clipboard.
      sss.playMml(bgm);
    }
    player = { pos: vec(90, 50), yAngle: 0, vx: 0, ticks: 0 };
    spikes = [];
    nextSpikeDist = 0;
    balls = [];
    nextBallDist = 9;
    multiplier = 1;
  }
  color("blue");
  rect(0, 90, 99, 9);
  nextSpikeDist -= player.vx;
  if (nextSpikeDist < 0) {
    spikes.push({
      pos: vec(-3, rnd(10, 80)),
      vy: rnd() < 0.2 ? rnds(1, difficulty) * 0.3 : 0,
    });
    nextSpikeDist += rnd(9, 49);
  }
  color("black");
  remove(spikes, (s) => {
    s.pos.x += player.vx;
    s.pos.y += s.vy;
    if (s.pos.y < 10 || s.pos.y > 80) {
      s.vy *= -1;
    }
    if (text("*", s.pos).isColliding.char.d) {
      return true;
    }
    return s.pos.x > 103;
  });
  const py = player.pos.y;
  player.yAngle += difficulty * 0.05;
  player.pos.y = sin(player.yAngle) * 30 + 50;
  player.ticks += clamp((py - player.pos.y) * 9 + 1, 0, 9);
  if (input.isJustPressed) {
    // Play the `hit` sound effect.
    play("hit");
  }
  player.vx = (input.isPressed ? 1 : 0.1) * difficulty;
  char(addWithCharCode("a", floor(player.ticks / 50) % 2), player.pos);
  color("red");
  if (char("c", player.pos.x, player.pos.y - 6).isColliding.text["*"]) {
    // Play the `explosion` sound effect.
    play("explosion");
    gameOver();
  }
  nextBallDist -= player.vx;
  if (nextBallDist < 0) {
    const p = vec(-3, rnd(20, 70));
    color("transparent");
    if (char("c", p).isColliding.text["*"]) {
      nextBallDist += 9;
    } else {
      balls.push(p);
      nextBallDist += rnd(25, 64);
    }
  }
  color("green");
  remove(balls, (b) => {
    b.x += player.vx;
    const c = char("c", b).isColliding.char;
    if (c.a || c.b || c.c) {
      addScore(floor(multiplier), player.pos);
      multiplier += 10;
      // Play the `select` sound effect.
      play("select");
      return true;
    }
    return b.x > 103;
  });
  multiplier = clamp(multiplier - 0.02 * difficulty, 1, 999);
  color("black");
  text(`x${floor(multiplier)}`, 3, 9);
}

function gameOver() {
  // Stop BGM at the end of the game.
  sss.stopMml();
  end();
}

// MML for BGM.
const bgm = [
  // Specify the tone as `@synth`.
  // `@s308454596`sets the random number seed to generate the tone.
  "@synth@s308454596 v50 l16 o4 r4b4 >c+erer8.<b b2 >c+2 <b2 >c+ec+<ar>c+r<a f+g+af+rf+er e2",
  "@synth@s771118616 v35 l4 o4 f+f+ f+1 >c+ <g+ f+f+ eg+ ab b2",
  "@synth@s848125671 v40 l4 o4 d+16d+16f+16e16e16e16e16<b16 >ee b8.b16r8>f+8 c+c+ <b>f+ <aa a2 bb",
  // Set the drum part with '@d'.
  "@explosion@d@s364411560 v40 l16 o4 cr8.cr8. cr8.cr8. cr8.cr8. cr8.cr8. cr8.cr8. cr8.cr8. cr8.cr8. cr8.cr8.",
  "@explosion@d@s152275772 v40 l16 o4 r8crcrcr8. cccrcr8. crcrcr8. crcrcr8. crcrcr8. crcrcr8. crcrcr8. crcrcr",
  "@hit@d@s234851483 v50 l16 o4 rcr4^16c rcr4. ccr4^16c rcr4.^16 cr4^16c rcr4.^16 cr4^16c rcr4.",
];
