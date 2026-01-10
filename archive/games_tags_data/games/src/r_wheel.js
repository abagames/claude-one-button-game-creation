title = "R WHEEL";

description = `
[Tap] 
 Multiple jumps
`;

characters = [
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
 llll
  ll

 llll

llllll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 5,
};

/** @type {{height: number, isHit: boolean}[]} */
let spikes;
let angleOfs;
/** @type {{angle: number, radius: number}[]} */
let bonuses;
/** @type {{y: number, vy: number}} */
let player;
/** @type {{pos: Vector, width: number, isSpike: boolean}[]} */
let bars;
let multiplier;
let validSpikeCount;
const wheelRadius = 40;
const spikeCount = 32;

function update() {
  if (!ticks) {
    spikes = times(spikeCount, () => {
      return { height: 0, isHit: false };
    });
    angleOfs = 0;
    bonuses = [];
    player = { y: 0, vy: 0 };
    bars = [];
    multiplier = 1;
    validSpikeCount = 0;
  }
  const sd = sqrt(difficulty);
  if (input.isJustPressed) {
    play("jump");
    player.vy = -2 * sd;
    spikes.forEach((s) => {
      s.isHit = false;
    });
    if (player.y === 0) {
      player.y += player.vy;
      multiplier = 0;
      addBonus();
    }
  }
  if (player.y < 0) {
    const pvy = player.vy;
    player.vy += (input.isPressed ? 1 : 3) * 0.03 * difficulty;
    player.vy *= 0.98;
    if (player.y < -wheelRadius * 2 + 6 && player.vy < 0) {
      player.vy *= -0.5;
    }
    if (pvy * player.vy <= 0) {
      play("laser");
      bars.push({
        pos: vec(50, 50 + wheelRadius + player.y),
        width: 0,
        isSpike: true,
      });
    }
    player.y += player.vy;
    if (player.y > 0) {
      player.y = player.vy = 0;
    }
  }
  color("black");
  char(
    player.y > 0 ? "a" : addWithCharCode("a", floor(ticks / 10) % 2),
    50,
    50 + wheelRadius + player.y - 3
  );
  const va = 0.03 * sd;
  color("yellow");
  remove(bonuses, (b) => {
    const p = vec(50, 50).addWithAngle(b.angle, b.radius);
    b.angle += va;
    const c = char("c", p).isColliding.char;
    if (c.a || c.b) {
      play("coin");
      bars.push({
        pos: vec(50, 50 + wheelRadius + player.y),
        width: 0,
        isSpike: false,
      });
      return true;
    }
  });
  remove(bars, (b) => {
    if (b.isSpike) {
      b.width += sd;
      b.pos.y += sd * 3;
      color("purple");
    } else {
      b.width += sd * 2;
      b.pos.y += sd * 2;
      color("yellow");
    }
    box(b.pos, b.width, 3);
    return b.pos.y > 103;
  });
  angleOfs += va;
  color("black");
  arc(50, 50, wheelRadius + 3, 3, angleOfs, angleOfs + PI * 2);
  let a = angleOfs;
  validSpikeCount = 0;
  spikes.forEach((s) => {
    color(s.height > 0 ? "red" : "transparent");
    const p = vec(50, 50).addWithAngle(a, wheelRadius * (1 - s.height * 0.1));
    const bp = vec(50, 50).addWithAngle(a, wheelRadius);
    const l = 0.05 + s.height * 0.1;
    let c = line(
      p,
      vec(bp).addWithAngle(a - PI / 2, 50 / spikeCount)
    ).isColliding;
    c = {
      ...c,
      ...line(p, vec(bp).addWithAngle(a + PI / 2, 50 / spikeCount)).isColliding,
    };
    if (!s.isHit && c.rect.purple) {
      play("hit");
      s.height++;
      s.isHit = true;
    }
    if (s.height > 0) {
      if (c.rect.yellow) {
        play("select");
        multiplier += s.height;
        addScore(multiplier, p);
        s.height = 0;
      } else if (c.char.a || c.char.b) {
        play("explosion");
        end();
      }
    }
    a += (PI * 2) / spikeCount;
    if (s.height > 0) {
      validSpikeCount++;
    }
  });
  if (validSpikeCount === 0) {
    spikes[
      wrap(floor((-angleOfs - PI / 4) / ((PI * 2) / spikeCount)), 0, spikeCount)
    ].height = 1;
    spikes[
      wrap(
        floor((-angleOfs - (PI / 4) * 3) / ((PI * 2) / spikeCount)),
        0,
        spikeCount
      )
    ].height = 1;
    addBonus();
  }

  function addBonus() {
    times(ceil(validSpikeCount / 9), () => {
      bonuses.push({
        angle: (-PI / 3) * 2 + rnds((PI / 4) * 3),
        radius: rnd(10, 30),
      });
    });
  }
}
