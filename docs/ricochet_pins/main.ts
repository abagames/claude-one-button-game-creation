import "crisp-game-lib";

const title = "RICOCHET PINS";

const description = `
[Tap] Shoot pins
and recoil
`;

const characters = [
  // a: Player
  `
  cc
 c cc
cc  cc
 c cc
  cc
  `,
  // b: Pin
  `
r rr r
 rrrr
rrrrrr
 rrrr
r rr r
  `,
  // c: Item (shining gem)
  `
  yy
 yggy
ygggyy
 yggy
  yy
  `,
];

const options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
  theme: "dark" as ThemeName,
};

// Balance parameters (for co-evolution system)
const PLAYER_INITIAL_SPEED = 0.5;
const PLAYER_FRICTION = 0.98;
const PLAYER_BASE_SCALE = 1.0;
const RECOIL_FORCE = 2.0;
const PIN_SCALE = 1.0;
const INITIAL_PIN_COUNT = 5;
const PIN_COUNT_INCREMENT = 1;
const ITEM_SCALE = 1.2;
const MAX_HEAT = 100;
const HEAT_PER_SHOT = 25;
const COOLDOWN_RATE = 1.0;
const OVERHEAT_RECOVERY = 30;
const HEAT_SCALE_FACTOR = 0.008;
const MOVING_PIN_RATIO = 0.4;
const PIN_BASE_MOVE_SPEED = 0.3;
const PIN_SPEED_INCREASE_PER_DIFFICULTY = 0.05;

type Player = {
  pos: Vector;
  vel: Vector;
  heat: number;
  isOverheated: boolean;
};

type Pin = {
  pos: Vector;
  isMoving: boolean;
  moveDir: "horizontal" | "vertical";
  vel?: Vector;
};

type Item = {
  pos: Vector;
};

let player: Player;
let pins: Pin[];
let item: Item | null;
let currentPinCount: number;
let multiplier: number;
let shotTarget: Vector | null;
let shotTimer: number;

function update() {
  if (!ticks) {
    // Initialize
    player = {
      pos: vec(50, 50),
      vel: vec(PLAYER_INITIAL_SPEED, 0),
      heat: 0,
      isOverheated: false,
    };
    currentPinCount = INITIAL_PIN_COUNT;
    multiplier = 1;
    pins = [] as Pin[];
    item = null;
    spawnPins();
    shotTarget = null;
    shotTimer = 0;
  }

  // Update player
  player.pos.add(player.vel);
  player.vel.mul(PLAYER_FRICTION);

  // Heat cooldown
  if (player.heat > 0) {
    player.heat -= COOLDOWN_RATE;
    if (player.heat < 0) player.heat = 0;
  }

  // Overheat recovery check
  if (player.isOverheated && player.heat <= OVERHEAT_RECOVERY) {
    player.isOverheated = false;
  }

  // Calculate current player scale (increases with heat)
  const currentPlayerScale =
    PLAYER_BASE_SCALE + player.heat * HEAT_SCALE_FACTOR;
  const currentPlayerRadius = 3 * currentPlayerScale; // Character base radius 3px

  // Bounce off screen edges
  if (
    player.pos.x < currentPlayerRadius ||
    player.pos.x > 100 - currentPlayerRadius
  ) {
    player.vel.x *= -1;
    player.pos.clamp(
      currentPlayerRadius,
      100 - currentPlayerRadius,
      player.pos.y,
      player.pos.y
    );
    play("select");
  }
  if (
    player.pos.y < currentPlayerRadius ||
    player.pos.y > 100 - currentPlayerRadius
  ) {
    player.vel.y *= -1;
    player.pos.clamp(
      player.pos.x,
      player.pos.x,
      currentPlayerRadius,
      100 - currentPlayerRadius
    );
    play("select");
  }

  // Draw pins and collision detection
  pins.forEach((pin) => {
    // Update moving pin position and bounce off edges
    if (pin.isMoving && pin.vel) {
      pin.pos.add(pin.vel);

      const pinRadius = 3 * PIN_SCALE;

      if (pin.moveDir === "horizontal") {
        // Bounce off left/right walls
        if (pin.pos.x < pinRadius || pin.pos.x > 100 - pinRadius) {
          pin.vel.x *= -1;
          pin.pos.clamp(pinRadius, 100 - pinRadius, pin.pos.y, pin.pos.y);
        }
      } else {
        // Bounce off top/bottom walls
        if (pin.pos.y < pinRadius || pin.pos.y > 100 - pinRadius) {
          pin.vel.y *= -1;
          pin.pos.clamp(pin.pos.x, pin.pos.x, pinRadius, 100 - pinRadius);
        }
      }
    }

    // Pin base radius (from character definition)
    const pinRadius = 3 * PIN_SCALE;

    // Collision detection with player (varies with size)
    const dist = player.pos.distanceTo(pin.pos);
    const collisionDist = currentPlayerRadius + pinRadius;
    if (dist < collisionDist) {
      play("explosion");
      end();
    }

    // Danger warning (outer glow)
    if (dist < collisionDist + 10 && dist >= collisionDist) {
      color("yellow");
      if (ticks % 10 < 5) {
        arc(pin.pos, 12, 2);
      }
    }

    // Draw pin (moving pins are purple)
    color(pin.isMoving ? "purple" : "red");
    char("b", pin.pos, {
      scale: { x: PIN_SCALE, y: PIN_SCALE },
    });

    // Movement direction indicator for moving pins
    if (pin.isMoving) {
      color("light_purple");
      if (pin.moveDir === "horizontal") {
        line(vec(pin.pos.x - 8, pin.pos.y), vec(pin.pos.x + 8, pin.pos.y), 1);
      } else {
        line(vec(pin.pos.x, pin.pos.y - 8), vec(pin.pos.x, pin.pos.y + 8), 1);
      }
    }
  });

  // Draw item and collision detection
  if (item) {
    const itemDist = player.pos.distanceTo(item.pos);

    // Item collection check
    if (itemDist < 7) {
      play("coin");
      // Particle effect (execute before setting item to null)
      particle(item.pos, { count: 15, speed: 3 });
      addScore(10 * multiplier, player.pos);
      item = null;
      multiplier++;
    } else {
      // Draw item (pulsing animation)
      const pulseScale = ITEM_SCALE + Math.sin(ticks * 0.15) * 0.2;
      color("black");
      char("c", item.pos, {
        scale: { x: pulseScale, y: pulseScale },
      });
    }
  }

  // Find nearest pin
  let nearestPin: Pin | undefined = undefined;
  let nearestDist = Infinity;
  for (const pin of pins) {
    const dist = player.pos.distanceTo(pin.pos);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestPin = pin;
    }
  }

  // Display targeting line
  if (nearestPin) {
    color("light_black");
    line(player.pos, nearestPin.pos, 1);
  }

  // Draw player (color changes with heat state)
  if (player.isOverheated) {
    color("red");
    // Overheat particle effect
    if (ticks % 5 === 0) {
      particle(player.pos, { count: 3, speed: 1 });
    }
  } else if (player.heat > 75) {
    color("yellow");
  } else if (player.heat > 50) {
    color("light_cyan");
  } else {
    color("cyan");
  }

  // Player body
  char("a", player.pos, {
    scale: { x: currentPlayerScale, y: currentPlayerScale },
  });

  // Shot processing (laser beam effect) - draw on top of player
  if (shotTimer > 0) {
    if (shotTarget) {
      // Fade out effect (dims based on timer)
      const intensity = shotTimer / 5;

      // Outer glow (white)
      color("white");
      line(player.pos, shotTarget, 5 * intensity);

      // Middle layer (yellow)
      color("yellow");
      line(player.pos, shotTarget, 3 * intensity);

      // Muzzle flash
      if (shotTimer >= 5) {
        color("black");
        box(player.pos, 5 * intensity, 5 * intensity);
      }
    }
    shotTimer--;
  }

  // Tap processing
  if (input.isJustPressed && nearestPin && !player.isOverheated) {
    // Fire shot (capture nearestPin)
    const targetPin: Pin = nearestPin;
    play("hit");
    shotTarget = vec(targetPin.pos);
    shotTimer = 9;

    // Muzzle flash at player position
    particle(player.pos, { count: 5, speed: 2 });

    // Particles along beam trajectory
    const beamDir = vec(targetPin.pos).sub(player.pos);
    times(5, (i) => {
      const t = (i + 1) / 6;
      const particlePos = vec(player.pos).add(beamDir.mul(t));
      particle(particlePos, { count: 3, speed: 1 });
    });

    // Pin destruction (enhanced particles)
    particle(targetPin.pos, { count: 20, speed: 5 });
    remove(pins, (p) => p === targetPin);

    // Recoil
    const recoilDir = vec(player.pos).sub(targetPin.pos).normalize();
    player.vel.add(recoilDir.mul(RECOIL_FORCE));

    // Add score (with multiplier)
    addScore(multiplier, targetPin.pos);

    // Heat accumulation
    player.heat += HEAT_PER_SHOT;
    if (player.heat >= MAX_HEAT) {
      player.heat = MAX_HEAT;
      player.isOverheated = true;
      play("click");
    }

    // Check if all pins destroyed
    if (pins.length === 0) {
      play("powerUp");
      currentPinCount += PIN_COUNT_INCREMENT;
      spawnPins();
      addScore(currentPinCount * multiplier * 2, 50, 50);
    }
  }

  // Display score
  color("black");
  text(`x${multiplier}`, 3, 9, { isSmallText: true });
}

/**
 * Generate new pin group
 */
function spawnPins() {
  pins = [];
  times(currentPinCount, () => {
    let attempts = 0;
    let validPos = false;
    let newPos: Vector | undefined;

    // Place at position away from player
    while (!validPos && attempts < 50) {
      newPos = vec(rnd(15, 85), rnd(15, 85));
      const distToPlayer = newPos.distanceTo(player.pos);
      if (distToPlayer > 30) {
        validPos = true;
      }
      attempts++;
    }

    const finalPos = newPos || vec(rnd(15, 85), rnd(15, 85));

    // Make some pins moving
    const isMoving = rnd() < MOVING_PIN_RATIO;
    const moveDir = rnd() < 0.5 ? "horizontal" : "vertical";

    // Movement speed based on difficulty (difficulty is Crisp Game global variable)
    const currentSpeed =
      PIN_BASE_MOVE_SPEED + difficulty * PIN_SPEED_INCREASE_PER_DIFFICULTY;

    // Velocity vector (random direction)
    let velocity: Vector;
    if (isMoving) {
      if (moveDir === "horizontal") {
        velocity = vec(rnd() < 0.5 ? -currentSpeed : currentSpeed, 0);
      } else {
        velocity = vec(0, rnd() < 0.5 ? -currentSpeed : currentSpeed);
      }
    } else {
      velocity = vec(0, 0);
    }

    pins.push({
      pos: vec(finalPos),
      isMoving: isMoving,
      moveDir: moveDir as "horizontal" | "vertical",
      vel: velocity,
    });
  });

  // Place one item
  let itemAttempts = 0;
  let validItemPos = false;
  let itemPos: Vector | undefined;

  while (!validItemPos && itemAttempts < 50) {
    itemPos = vec(rnd(15, 85), rnd(15, 85));
    const distToPlayer = itemPos.distanceTo(player.pos);

    // Position away from player and pins
    let farFromPins = true;
    pins.forEach((pin) => {
      if (itemPos!.distanceTo(pin.pos) < 15) {
        farFromPins = false;
      }
    });

    if (distToPlayer > 20 && farFromPins) {
      validItemPos = true;
    }
    itemAttempts++;
  }

  item = {
    pos: itemPos || vec(rnd(15, 85), rnd(15, 85)),
  };
}

init({ options, title, description, characters, update });
