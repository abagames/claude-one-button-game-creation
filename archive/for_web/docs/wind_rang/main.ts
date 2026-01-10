import "crisp-game-lib";

const title = "WIND RANG";

const description = `
[Tap] Toggle wind
`;

const characters = [
  `
llllll
llllll
llllll
llllll
 l  l
 l  l
  `,
  `
llllll
llllll
llllll
llllll
ll  ll
  `,
  `
    ll
    ll
    ll
    ll
llllll
llllll
  `,
  `
  lll
ll l l
 llll
  ll
 l  l
 l  l
`,
  `
  lll
ll l l
 llll
 l  l
ll  ll
`,
];

const options = {
  viewSize: { x: 100, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 2,
};

// Balance parameters (for coevolution system)
const WIND_FORCE = 0.08;
const WIND_LINE_SPEED = 0.5;
const WIND_LINE_ACCEL = 0.05;
const WIND_LINE_WIDTH = 15;
const WIND_LINE_HEIGHT = 1;
const BOOMERANG_SPEED = 1.5;
const BOOMERANG_INTERVAL = 18;
const ENEMY_SPAWN_INTERVAL = 77;
const ENEMY_SPEED = 0.25;
const CATCH_RADIUS = 8;
const PLAYER_Y = 98;

type Boomerang = {
  pos: Vector;
  vel: Vector;
  state: "out" | "return";
  angle: number;
};
type Enemy = { pos: Vector; vel: Vector; charBase: string };
type WindLine = { pos: Vector; vel: Vector };

let boomerangs: Boomerang[];
let nextBoomerangTicks: number;
let enemies: Enemy[];
let nextEnemyTicks: number;
let windDirection: "left" | "right";
let multiplier: number;
let playerX: number;
let windLines: WindLine[];

function update() {
  if (!ticks) {
    boomerangs = [];
    nextBoomerangTicks = BOOMERANG_INTERVAL;
    enemies = [];
    nextEnemyTicks = ENEMY_SPAWN_INTERVAL;
    windDirection = "right";
    multiplier = 1;
    playerX = 50;
    // Initialize wind lines
    windLines = [];
    times(5, (i) => {
      windLines.push({
        pos: vec(rnd(100), 20 + i * 15),
        vel: vec(WIND_LINE_SPEED, rnd(-0.2, 0.2)),
      });
    });
  }

  // Toggle wind direction on tap
  if (input.isJustPressed) {
    windDirection = windDirection === "left" ? "right" : "left";
    play("select");
  }

  // Update and draw wind lines
  color("light_blue");
  windLines.forEach((w) => {
    // Apply acceleration based on wind direction
    if (windDirection === "left") {
      w.vel.x -= WIND_LINE_ACCEL;
    } else {
      w.vel.x += WIND_LINE_ACCEL;
    }

    // Random vertical acceleration
    w.vel.y += rnd(-WIND_LINE_ACCEL, WIND_LINE_ACCEL) * 0.2;

    // Limit velocity
    w.vel.x *= 0.98;
    w.vel.y *= 0.98;

    // Move wind
    w.pos.add(w.vel);

    // Wrap around horizontally
    if (w.pos.x < -WIND_LINE_WIDTH) {
      w.pos.x = 100 + WIND_LINE_WIDTH;
    } else if (w.pos.x > 100 + WIND_LINE_WIDTH) {
      w.pos.x = -WIND_LINE_WIDTH;
    }

    // Wrap around vertically
    if (w.pos.y < 0) {
      w.pos.y = 100;
    } else if (w.pos.y > 100) {
      w.pos.y = 0;
    }

    // Draw wind line
    box(w.pos, WIND_LINE_WIDTH, WIND_LINE_HEIGHT);
  });

  // Draw player with animation (switch between 'a' and 'b' every 15 frames)
  color("black");
  const playerChar = addWithCharCode("a", floor(ticks / 15) % 2);
  char(playerChar, playerX, PLAYER_Y);

  // Spawn boomerang automatically
  nextBoomerangTicks--;
  if (nextBoomerangTicks <= 0) {
    boomerangs.push({
      pos: vec(playerX, PLAYER_Y),
      vel: vec(0, -BOOMERANG_SPEED),
      state: "out",
      angle: 0,
    });
    nextBoomerangTicks = BOOMERANG_INTERVAL;
    play("click", { pitch: 60 });
  }

  // Update boomerangs
  remove(boomerangs, (b) => {
    // Apply wind force
    const windForce = windDirection === "left" ? -WIND_FORCE : WIND_FORCE;
    b.vel.x += windForce;

    // Move boomerang
    b.pos.add(b.vel);
    b.angle += 0.2;

    // State transition: out -> return
    if (b.state === "out" && b.pos.y < 10) {
      b.state = "return";
      b.vel.y = BOOMERANG_SPEED; // Start returning
    }

    // Draw boomerang with rotation (convert angle to integer rotation: 0-3)
    color("blue");
    const rotationStep = floor((b.angle / (PI / 2)) % 4);
    char("c", b.pos, { rotation: rotationStep });

    // Check catch
    if (b.state === "return" && b.pos.y > PLAYER_Y - 5) {
      const dist = abs(b.pos.x - playerX);
      if (dist < CATCH_RADIUS) {
        // Catch success
        play("powerUp");
        multiplier++;
        addScore(10 * multiplier, b.pos);
        particle(b.pos, { count: 10, speed: 2 });
        return true; // Remove boomerang
      } else {
        // Catch miss
        if (b.pos.y > 105) {
          return true; // Remove boomerang
        }
      }
    }

    // Remove if out of bounds
    return b.pos.x < -5 || b.pos.x > 105 || b.pos.y > 105;
  });

  // Spawn enemies
  nextEnemyTicks--;
  if (nextEnemyTicks <= 0) {
    enemies.push({
      pos: vec(rnd(10, 90), 0),
      vel: vec(0, ENEMY_SPEED * rnd(1, difficulty)),
      charBase: "d", // Base character for animation (d->e)
    });
    nextEnemyTicks = (ENEMY_SPAWN_INTERVAL * rnd(0.5, 2)) / difficulty;
  }

  // Update enemies
  remove(enemies, (e) => {
    // Apply wind force to enemies
    const windForce =
      windDirection === "left" ? -WIND_FORCE * 0.25 : WIND_FORCE * 0.25;
    e.vel.x += windForce;

    e.pos.add(e.vel);

    // Wrap around screen horizontally
    if (e.pos.x < 0) {
      e.pos.x = 100;
    } else if (e.pos.x > 100) {
      e.pos.x = 0;
    }

    // Game over if enemy reaches bottom
    if (e.pos.y > 100) {
      play("explosion");
      end();
    }

    // Draw enemy with animation (switch between 'd' and 'e' every 15 frames)
    color("red");
    const enemyChar = addWithCharCode(e.charBase, floor(ticks / 15) % 2);
    const isColliding = char(enemyChar, e.pos).isColliding.char?.c;

    // Check collision with boomerang
    if (isColliding) {
      play("coin");
      particle(e.pos, { count: 10, speed: 3 });
      addScore(1 * multiplier, e.pos);
      return true; // Remove enemy
    }

    // Check collision with player (game over)
    if (e.pos.y > PLAYER_Y - 5 && abs(e.pos.x - playerX) < 5) {
      play("explosion");
      end();
    }

    return false; // Keep enemy alive
  });

  // Draw multiplier
  color("black");
  text("x" + multiplier, 3, 9, { isSmallText: true });
}

init({ update, title, description, characters, options });
