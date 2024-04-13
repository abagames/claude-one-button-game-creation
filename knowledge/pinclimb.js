// Define variables for objects.
// Cord:
// - Properties: pinned pin, length, angle
/** @type {{pinnedPin: {coordinate: Vector}, length: number, angle: number}} */
let cord;
const defaultCordLength = 7;
// Pins:
// Properties: coordinate
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
    // Pins:
    // - Initial state: A pin at the center of the top screen.
    pins = [{ coordinate: vec(50, 0) }];

    // Cord:
    // - Initial state: Pinned to the initial pin.
    cord = { pinnedPin: pins[0], length: defaultCordLength, angle: 0 };

    // Initialize all variables.
    scrollingSpeed = vec();
    scrolledDistance = vec();
  }
  // Implement the rules of the objects.

  // Cord:
  // - Shape: line
  // - Color: black
  // - Controls: Extends by holding down the button. Retracts to its original length by releasing the button.
  // - Behaviors: Rotates around the pinned pin.
  // - Collision events: If it collides with a pin other than the pinned one, the colliding pin becomes the new pinned pin.
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

  // Pins:
  // - Shape: rect (small)
  // - Color: blue
  // - Appearance rules: Each time the screen scrolls a certain distance, a new pin randomly appears at the top.
  // - Scrolling: Scrolls down until the pin to which the cord is pinned is just above the bottom edge of the screen.
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
