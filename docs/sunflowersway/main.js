title = "SUNFLOWER SWAY";

description = `
[Hold] Sunny
`;

characters = [
  `
 yyyy
ylllly
ylllly
ylllly
ylllly
 yyyy
`,
  `
  l
 lll
l lll
l lll
 lll
`,
  `
l ll l
 l  l
l ll l
llllll
 llll
l ll l
`,
  `
   ll
  lll
 llll
lllll
  ll
 ll
`,
  `
 llll
llllll
llllll
llllll
llllll
 llll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 1,
  isCapturing: true,
};

/** @type {{
  pos: Vector, height: number, angle: number,
  swayVelocity: number,
  leafPositions: number[]
}} */
let sunflower;

/** @type {{pos: Vector, speed: number}[]} */
let dewdrops;

/** @type {{pos: Vector, speed: number}[]} */
let insects;

let sunX;

let nextDewdropTicks;
let nextInsectTicks;

function update() {
  if (!ticks) {
    sunflower = {
      pos: vec(30, 95),
      height: 40,
      angle: 0,
      swayVelocity: 0.001,
      leafPositions: [0.2, 0.4, 0.6], // Positions of leaves along the stem (0-1)
    };
    dewdrops = [];
    insects = [];
    sunX = 120;
    nextDewdropTicks = 30;
    nextInsectTicks = 60;
  }

  color("yellow");
  rect(0, 90, 100, 10);

  // Update sunflower sway
  if (input.isPressed) {
    sunflower.swayVelocity += 0.005;
    sunX += (80 - sunX) * 0.1;
  } else {
    sunX += (120 - sunX) * 0.1;
  }
  if (input.isJustPressed) {
    play("select");
  }
  sunflower.swayVelocity *= 0.97;
  sunflower.angle += sunflower.swayVelocity;
  sunflower.swayVelocity -= sunflower.angle * 0.01;

  if (sunX < 110) {
    drawSun(sunX);
  }

  // Draw sunflower stem and leaves
  sunflower.height -= 0.045 * difficulty;
  if (sunflower.height > 70) {
    sunflower.height = 70;
  }
  if (sunflower.height < 9) {
    play("explosion");
    end();
  }

  color("green");
  let stemTop = vec(sunflower.pos).addWithAngle(
    sunflower.angle - PI / 2,
    sunflower.height
  );
  line(sunflower.pos, stemTop);

  // Draw leaves
  sunflower.leafPositions.forEach((leafPos, i) => {
    const leafPoint = vec(sunflower.pos).addWithAngle(
      sunflower.angle - PI / 2,
      sunflower.height * leafPos
    );
    const ox = i % 2 === 0 ? 1 : -1;
    char("d", leafPoint.x + ox * 3, leafPoint.y, { mirror: { x: ox } });
  });

  // Draw sunflower head
  color("black");
  char("a", stemTop, { scale: { x: 2, y: 2 } });

  // Update and draw dewdrops
  nextDewdropTicks--;
  if (nextDewdropTicks <= 0) {
    dewdrops.push({
      //pos: vec(rnd() < 0.25 ? rnd(20) : rnd(40, 99), -3),
      pos: vec(rnd(99), -3),
      speed: rnd(0.5, 1) * difficulty,
    });
    nextDewdropTicks = rnd(30, 40) / difficulty;
  }

  remove(dewdrops, (d) => {
    d.pos.y += d.speed;
    color("light_blue");
    let isColliding = char("b", d.pos).isColliding.char;
    if (isColliding.a) {
      play("coin");
      addScore(sunflower.height, stemTop);
      sunflower.height += 7;
      return true;
    }
    return d.pos.y > 90;
  });

  // Update and draw insects
  nextInsectTicks--;
  if (nextInsectTicks <= 0) {
    insects.push({
      pos: vec(rnd() < 0.25 ? rnd(20) : rnd(40, 99), -3),
      speed: rnd(0.3, 0.8) * difficulty,
    });
    nextInsectTicks = rnd(60, 70) / difficulty;
  }

  remove(insects, (i) => {
    i.pos.y += i.speed;
    color("red");
    let isColliding = char("c", i.pos).isColliding.char;
    if (isColliding.a) {
      play("hit");
      sunflower.height -= 15;
      return true;
    }
    return i.pos.y > 90;
  });
}

const p1 = vec();
const p2 = vec();

function drawSun(x) {
  color("yellow");
  p1.set(x, 10);
  char("e", p1);
  for (let i = 0; i < 7; i++) {
    const a = ticks * 0.05 + (i * PI * 2) / 7;
    const l = abs(sin(i + ticks * 0.05) * 5) + 10;
    p1.set(x, 10).addWithAngle(a, 7);
    p2.set(x, 10).addWithAngle(a, l);
    line(p1, p2);
  }
}
