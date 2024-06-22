// Define variables for objects.
// # Cord
// - Properties: pinned pin, length, angle
/** @type {{pinnedPin: {coordinate: Vector}, length: number, angle: number}} */
let cord;
const defaultCordLength = 7;
// # Pins
// - Properties:
//   - position: Vector (x, y coordinates)
/** @type { {coordinate: Vector}[]} */
let pins;

// Define variables for games.
/** @type {Vector} */
let scrollingSpeed;
/** @type {Vector} */
let scrolledDistance;
const nextPinDistance = 10;

function update() {
  if (!ticks) {
    // Set the initial state of the game.
    // # Pins
    // - Initial state:
    //   - One pin at the center-top of the screen (cord's initial anchor)
    pins = [{ coordinate: vec(50, 0) }];

    // # Cord
    // - Initial state:
    //   - Attached to the initial pin at the center-top of the screen
    //   - length = defaultCordLength
    //   - angle = 0 (pointing rightwards)
    cord = { pinnedPin: pins[0], length: defaultCordLength, angle: 0 };

    // Initialize all variables.
    scrollingSpeed = vec();
    scrolledDistance = vec();
  }
  // Implement the rules of the objects.

  // # Cord:
  // - Shape: line
  // - Color: black
  // - One-button controls:
  //   - Press: Extend the cord (increase length)
  //   - Release: Retract the cord (decrease length)
  // - Behavior:
  //   - Continuously rotates around the anchor pin
  //   - Length changes based on button input
  //   - Automatically retracts if no input is given
  scrollingSpeed.y = 0.01;
  if (cord.pinnedPin.coordinate.y < 80) {
    scrollingSpeed.y += (80 - cord.pinnedPin.coordinate.y) * 0.1;
  }
  if (input.isPressed) {
    cord.length += 1;
  } else {
    cord.length += (defaultCordLength - cord.length) * 0.1;
  }
  cord.angle += 0.05;
  color("black");
  line(
    cord.pinnedPin.coordinate,
    vec(cord.pinnedPin.coordinate).addWithAngle(cord.angle, cord.length)
  );

  // # Pins
  // - Shape: small rectangle
  // - Color: blue
  // - Appearance rules:
  //   - New pins spawn at the top of the screen at regular scrolling distances
  //   - Pins are randomly positioned horizontally
  // - Scrolling:
  //   - All pins move downward to position the anchored pin near the screen's bottom
  //   - Pins that move off-screen are removed
  // - Collision events:
  //   - If the cord collides with a pin, that pin becomes the new anchor
  let currentPinnedPin = cord.pinnedPin;
  color("blue");
  remove(pins, (p) => {
    p.coordinate.y += scrollingSpeed.y;
    if (box(p.coordinate, 3).isColliding.rect.black && p !== currentPinnedPin) {
      cord.pinnedPin = p;
      cord.length = defaultCordLength;
    }
    return p.coordinate.y > 102;
  });
  scrolledDistance.add(scrollingSpeed);
  while (scrolledDistance.y > nextPinDistance) {
    scrolledDistance.y -= nextPinDistance;
    pins.push({ coordinate: vec(rnd(10, 90), -2 + scrolledDistance.y) });
  }
}
