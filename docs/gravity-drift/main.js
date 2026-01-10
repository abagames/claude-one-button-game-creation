title = "GRAVITY DRIFT";

description = `
[Hold] Thrust up
`;

characters = [
  `
 llll
l ll l
l ll l
llllll
 l  l
ll  ll
`,
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 2,
};

let player;
let asteroids;
let stars;
let reversed;
let multiplier;

function update() {
  if (!ticks) {
    player = { x: 20, y: 50, vy: 0 };
    asteroids = [];
    stars = [];
    reversed = false;
    multiplier = 1;
  }

  const spd = 0.5 + difficulty * 0.5;

  let targetX = reversed ? 80 : 20;
  player.x += (targetX - player.x) * 0.05;

  if (input.isPressed) {
    player.vy -= 0.25;
    color("cyan");
    particle(player.x, player.y + 2, 1, 1, PI / 2, 0.5);
  }
  if (input.isJustPressed) {
    play("click");
  }
  player.vy += 0.12;
  player.vy *= 0.95;
  player.y += player.vy;

  if (player.y < 0 || player.y > 100) {
    play("explosion");
    end();
  }

  if (ticks % ceil(25 / spd) === 0) {
    let targetY = player.y + rnd(-9, 9);
    targetY = clamp(targetY, 0, 100);
    if (reversed) {
      asteroids.push({ x: -5, y: targetY, size: rnd(5, 10) });
    } else {
      asteroids.push({ x: 105, y: targetY, size: rnd(5, 10) });
    }
  }

  if (ticks % 120 === 0) {
    if (reversed) {
      stars.push({ x: -5, y: rnd(20, 80) });
    } else {
      stars.push({ x: 105, y: rnd(20, 80) });
    }
  }

  color("cyan");
  char("a", player.x, player.y);

  color("yellow");
  stars = stars.filter((s) => {
    if (reversed) {
      s.x += spd * 0.5;
    } else {
      s.x -= spd * 0.5;
    }
    const col = box(s.x, s.y, 4);
    if (col.isColliding.char.a) {
      play("powerUp");
      reversed = !reversed;
      multiplier++;
      return false;
    }
    return s.x > -10 && s.x < 110;
  });

  color(reversed ? "blue" : "red");
  asteroids = asteroids.filter((a) => {
    if (reversed) {
      a.x += spd;
    } else {
      a.x -= spd;
    }
    const col = box(a.x, a.y, a.size);
    if (col.isColliding.char.a) {
      play("explosion");
      end();
    }
    return a.x > -10 && a.x < 110;
  });

  addScore(multiplier);

  color("black");
  text(`x${multiplier}`, 3, 9, { isSmallText: true });
}
