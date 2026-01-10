title = "HOARD SPOUT";

description = `
Gather same color sparks
[Hold] Thrust
`;

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 3,
};

// Define variables for objects.
// Player:
// - Properties: position, angle, speed, color, size
/** @type {{position: Vector, angle: number, speed: number, color: Color, size: number}} */
let player;

// Sparks:
// - Properties: position, velocity, color, size
/** @type {{position: Vector, velocity: Vector, color: Color, size: number}[]} */
let sparks;
let nextSparkTicks;

// Game Field:
// - Properties: width, height
const gameFieldWidth = 100;
const gameFieldHeight = 100;

function update() {
  if (!ticks) {
    // Set the initial state of the game.
    // Player:
    // - Initial state: Centered on the screen, medium size, red color, moving in a random direction
    player = {
      position: vec(50, 50),
      angle: rnd(2 * PI),
      speed: 1,
      color: "red",
      size: 3,
    };

    // Sparks:
    // - Initial state: Empty array
    sparks = [];
    nextSparkTicks = 0;

    // Initialize all variables.
  }

  // Implement the rules of the objects.

  // Player:
  // - Shape: bar
  // - Color: changes cyclically (red, blue)
  // - One-button control: Thrusts while holding down the button. Changes the color if released
  // - Behavior: Constantly moves in a straight line, bouncing off the edges of the screen
  // - Collision events:
  //   - If it collides with a spark of the same color, it eats the spark and increases in size slightly
  //   - If it collides with a spark of a different color, decreases in size slightly
  // x Size change: Constantly shrinks over time at a fixed rate
  player.position.addWithAngle(player.angle, player.speed);
  if (input.isJustReleased) {
    play("laser");
    player.color = player.color === "red" ? "blue" : "red";
  }
  if (input.isPressed) {
    if (player.speed < 2) {
      player.speed += 0.01 * difficulty;
    }
    player.angle += 0.01 * difficulty;
    nextSparkTicks -= sqrt(difficulty);
  } else {
    player.speed += (difficulty - player.speed) * 0.1;
  }
  nextSparkTicks -= 0.1 * sqrt(difficulty);
  if (nextSparkTicks < 0) {
    const velocity = vec(1, 0).rotate(player.angle + PI + rnds(0.2));
    const position = vec(player.position);
    sparks.push({
      position,
      velocity,
      color: player.color === "red" ? "blue" : "red",
      size: 1,
    });
    nextSparkTicks = 9;
  }
  if (player.position.x < 0) {
    player.angle = PI - player.angle;
    player.position.x = 0;
  }
  if (player.position.x > gameFieldWidth) {
    player.angle = -PI - player.angle;
    player.position.x = gameFieldWidth;
  }
  if (player.position.y < 0) {
    player.angle = -player.angle;
    player.position.y = 0;
  }
  if (player.position.y > gameFieldHeight) {
    player.angle = -player.angle;
    player.position.y = gameFieldHeight;
  }
  player.size -= 0.002 * difficulty;
  if (player.size < 1) {
    play("explosion");
    end();
  } else if (player.size > 9) {
    player.size = 9;
  }

  color(player.color);
  bar(player.position, player.size * 2.5, player.size * 1.5, player.angle);
  color("black");
  bar(player.position, player.size + 3, player.size, player.angle);

  // Sparks:
  // - Shape: rect
  remove(sparks, (s) => {
    s.position.add(s.velocity);
    // @ts-ignore
    color(`${s.size < 5 ? "light_" : ""}${s.color}`);
    if (s.size < 5) {
      s.size += 0.2 * difficulty;
    } else {
      s.size += 0.01 * difficulty;
    }
    if (s.size > 9) {
      particle(s.position, {
        angle: s.velocity.angle,
        angleWidth: 0.4,
        speed: s.velocity.length,
      });
      return true;
    }
    if (box(s.position, s.size).isColliding.rect.black && s.size >= 5) {
      if (s.color === player.color) {
        play("powerUp");
        addScore(floor(player.size), s.position);
        player.size += 0.2 * difficulty;
        return true;
      } else if (s.color !== player.color) {
        play("hit");
        particle(s.position, { count: 9, speed: 2 });
        player.size -= 0.4 * difficulty;
        return true;
      }
    }
    if (s.position.x < 0) {
      s.velocity.x *= -1;
      s.position.x = 0;
    }
    if (s.position.x > gameFieldWidth) {
      s.velocity.x *= -1;
      s.position.x = gameFieldWidth;
    }
    if (s.position.y < 0) {
      s.velocity.y *= -1;
      s.position.y = 0;
    }
    if (s.position.y > gameFieldHeight) {
      s.velocity.y *= -1;
      s.position.y = gameFieldHeight;
    }
  });
}
