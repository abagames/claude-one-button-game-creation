title = `
STOMPING
BUBBLES
`;

description = `
[Hold] Stomp
`;

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  audioSeed: 5,
};

// Define variables for objects.
/** @type {{pos: Vector, vy: number}} */
let player;
const playerSize = 5;
let playerSpeed = 1.5;

/** @type {{pos: Vector, size: number, speed: number}[]} */
let bubbles;
let nextBubbleTicks;

/** @type {{pos: Vector, size: number, duration: number}[]} */
let chainReactions;
let multiplier;

const minBubbleSize = 5;
const maxBubbleSize = 9;
const minBubbleSpeed = 0.1;
const maxBubbleSpeed = 0.3;

function update() {
  if (!ticks) {
    // Initialize the game
    player = { pos: vec(50, 0), vy: 0 };
    bubbles = [];
    nextBubbleTicks = 0;
    chainReactions = [];
    multiplier = 1;
  }

  const sd = sqrt(difficulty);
  // Update player
  player.pos.x += playerSpeed * sd;
  if (
    (player.pos.x > 95 && playerSpeed > 0) ||
    (player.pos.x < 5 && playerSpeed < 0)
  ) {
    playerSpeed *= -1;
  }
  player.pos.y += player.vy * sd;
  player.vy += 0.01 * (input.isPressed ? 9 : 1);
  player.vy *= 0.99;
  if (player.pos.y < 0 && player.vy < 0) {
    player.vy *= -0.5;
  }
  if (player.pos.y > 99) {
    play("explosion");
    end();
  }
  if (input.isJustPressed) {
    play("select");
  }

  // Update bubbles
  nextBubbleTicks -= sd;
  if (nextBubbleTicks < 0) {
    const size = rnd(minBubbleSize, maxBubbleSize);
    bubbles.push({
      pos: vec(rnd(0, 100), 102 + size),
      size,
      speed: rnd(minBubbleSpeed, maxBubbleSpeed),
    });
    nextBubbleTicks += 9;
  }

  bubbles.forEach((b) => {
    b.pos.y -= b.speed * sd;
  });

  // Update chain reactions
  chainReactions.forEach((cr) => {
    cr.size += sd;
    cr.duration -= sd;
  });

  remove(chainReactions, (cr) => cr.duration <= 0);

  // Handle collisions and draw game objects
  color("red");
  box(player.pos, playerSize);

  // Chain Reactions
  color("yellow");
  chainReactions.forEach((reaction) => {
    arc(reaction.pos, reaction.size);
  });

  color("cyan");
  let isHit = false;
  remove(bubbles, (bubble) => {
    const c = arc(bubble.pos, bubble.size).isColliding.rect;
    if (c.red || c.yellow) {
      play("powerUp");
      particle(bubble.pos, { count: bubble.size * 2, speed: 3 });
      addScore(multiplier, bubble.pos);
      multiplier++;
      chainReactions.push({
        pos: vec(bubble.pos),
        size: bubble.size,
        duration: 5,
      });
      if (c.red && !isHit) {
        player.vy *= -1;
        player.pos.y += player.vy * 2;
        isHit = true;
      }
      return true;
    }
    return bubble.pos.y < -bubble.size;
  });
  if (chainReactions.length === 0) {
    multiplier = 1;
  }
}
