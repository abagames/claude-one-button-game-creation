title = "GRAPPLING H";

description = `
[Tap]
 Release hook
 Hold anchor
`;

options = {
  viewSize: { x: 100, y: 150 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

// Define variables for objects.
// Player:
// - Properties: position, velocity, attached anchor point
/** @type {{pos: Vector, vel: Vector, attachedAnchor: any}} */
let player;
const playerRadius = 4;
// Anchor Points:
// - Properties: position
/** @type {Vector[]} */
let anchorPoints;
const anchorRadius = 1;
// Collectibles:
// - Properties: position
/** @type {{pos: Vector}[]} */
let collectibles;
const collectibleRadius = 2;

let scrolledDistanceY;
const nextAnchorDistance = 20;
let scrolledDistanceYForScore;
let inputIsReleased;
let inputIsJustPressed;

function update() {
  if (!ticks) {
    // Set the initial state of the game.
    // Anchor Points:
    // - Initial state: Placed at the top of the screen
    anchorPoints = [vec(50, 0)];

    // Collectibles:
    // Player:
    // - Initial state: Attached to starting anchor point
    player = { pos: vec(30, 30), vel: vec(), attachedAnchor: anchorPoints[0] };

    // - Initial state: None
    collectibles = [];

    scrolledDistanceY = 0;
    inputIsReleased = false;
    inputIsJustPressed = false;
  }
  // Implement the rules of the objects.
  inputIsJustPressed = input.isJustPressed;
  let scrollY = 0.1 * difficulty;
  if (player.pos.y < 75) {
    scrollY += (75 - player.pos.y) * 0.1;
  }
  scrolledDistanceY += scrollY;
  scrolledDistanceYForScore += scrollY;
  while (scrolledDistanceY > nextAnchorDistance) {
    scrolledDistanceY -= nextAnchorDistance;
    anchorPoints.push(vec(rnd(10, 90), -5 + scrolledDistanceY));
  }

  // Anchor Points:
  // - Shape: Circle (small)
  // - Color: Black
  let attachableAnchor = null; // The anchor point that the player can attach to.
  let attachableDist = 25; // The distance to the attachable anchor point.
  anchorPoints.forEach((a) => {
    const dist = player.pos.distanceTo(a);
    if (player.attachedAnchor == null && dist < attachableDist) {
      attachableAnchor = a;
      attachableDist = dist;
    }
  });
  remove(anchorPoints, (a) => {
    a.y += scrollY;
    color(a === attachableAnchor ? "red" : "black");
    arc(a, anchorRadius).isColliding;
    // Attach to anchor point.
    if (a === attachableAnchor) {
      color("red");
      line(player.pos, a, 1);
      if (inputIsReleased && input.isPressed) {
        play("coin");
        player.attachedAnchor = a;
        if (scrolledDistanceYForScore > 0) {
          addScore(
            ceil(
              sqrt(scrolledDistanceYForScore * scrolledDistanceYForScore) * 0.1
            ),
            a
          );
        }
        inputIsJustPressed = false;
      }
    }
    return a.y > 155;
  });

  // Player:
  // - Shape: Circle
  // - Color: Blue
  // - Behaviors: Swings around anchor point
  // - One-button controls: Releasing hook or holding anchor
  color("blue");
  player.pos.add(player.vel);
  // Air resistance
  player.vel.mul(1 - abs(player.vel.length) * 0.001);
  player.vel.y += 0.1; // Gravity
  player.pos.y += scrollY;
  // Reflect with edges of the screen.
  if (
    (player.pos.x < 0 && player.vel.x < 0) ||
    (player.pos.x > 100 && player.vel.x > 0)
  ) {
    play("hit");
    player.vel.x *= -0.8;
  }
  if (player.attachedAnchor != null) {
    if (player.attachedAnchor.y > 150) {
      play("explosion");
      end();
    }
    // Add velocity to anchor.
    const dist = player.pos.distanceTo(player.attachedAnchor);
    const angle = player.pos.angleTo(player.attachedAnchor);
    const force = dist;
    player.vel.addWithAngle(angle, force * 0.01);
    line(player.pos, player.attachedAnchor, 2);
    if (inputIsJustPressed) {
      // Release from anchor.
      play("jump");
      player.attachedAnchor.set(0, 999);
      player.attachedAnchor = null;
      player.vel.addWithAngle(angle, force * 0.2);
      scrolledDistanceYForScore = 0;
      inputIsReleased = false;
    }
  } else {
    if (player.pos.y > 150 && player.vel.y > 0) {
      play("explosion");
      end();
    }
  }
  arc(player.pos, playerRadius, 2).isColliding;
  if (input.isJustReleased) {
    inputIsReleased = true;
  }
}
