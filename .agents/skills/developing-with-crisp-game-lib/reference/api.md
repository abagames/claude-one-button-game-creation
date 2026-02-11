# crisp-game-lib API Reference

## Drawing Functions

All drawing functions return collision detection results (`isColliding.rect.<color>`, `isColliding.char.<char>`, `isColliding.text.<char>`).

### Shapes

```javascript
rect(x, y, width, height); // Rectangle from top-left corner
box(position, width, height); // Box from center point (height defaults to width)
line(startPos, endPos, thickness); // Line between two points
bar(position, length, thickness, angle); // Rotatable bar from center
arc(position, radius, thickness, startAngle, endAngle); // Arc/circle
```

### Text and Characters

```javascript
text("Hello", x, y); // Normal text (6x6 per char)
text("Hello", x, y, { isSmallText: true }); // Small text (4x6 per char)
char("a", x, y); // Draw character from characters[]
addWithCharCode("a", 1); // Returns "b" (next character)
char(addWithCharCode("a", floor(ticks / 30) % 2), pos); // 2-frame animation
```

### Characters Array

Define pixel art as 6x6 grids using letters for colors:

- `l` = black, `r` = red, `g` = green, `b` = blue
- `y` = yellow, `p` = purple, `c` = cyan
- `L` = light_black, `R` = light_red, `G` = light_green, etc.

```javascript
characters = [
  `
llll
l  l
l  l
llll
`,
  `
 rr
rrrr
rrrr
 rr
`,
];
// characters[0] = "a", characters[1] = "b", etc.
```

## Colors

```javascript
color("red"); // Set current drawing color
```

Available colors:

- **Standard**: `red`, `green`, `blue`, `yellow`, `purple`, `cyan`, `black`, `white`
- **Light variants**: `light_red`, `light_green`, `light_blue`, `light_yellow`, `light_purple`, `light_cyan`, `light_black`
- **Special**: `transparent` — invisible but participates in collision detection

**Important**: `white` is invisible on all themes (matches background on both light and dark themes).

## Collision Detection

Drawing functions return collision results. Collision only works with shapes drawn **earlier** in the same frame.

```javascript
color("red");
box(enemy.pos, 10); // Draw enemy first

color("blue");
let c = box(player.pos, 8); // Then draw player
if (c.isColliding.rect.red) {
  end();
} // Player detects red shapes
if (c.isColliding.text.e) {
  /* hit letter 'e' */
} // Detect text collision
```

Use `color("transparent")` for invisible collision zones:

```javascript
color("transparent");
if (box(player.pos, 20).isColliding.rect.red) {
  /* proximity detection */
}
```

## Input

### Unified Input (Mouse / Touch)

```javascript
input.pos; // {x, y} current pointer position
input.isPressed; // true while pointer is held down
input.isJustPressed; // true only on the frame pointer is pressed
input.isJustReleased; // true only on the frame pointer is released
```

### Keyboard

```javascript
keyboard.code["Space"].isJustPressed;
keyboard.code["ArrowUp"].isPressed;
keyboard.code["ArrowDown"].isPressed;
keyboard.code["ArrowLeft"].isPressed;
keyboard.code["ArrowRight"].isPressed;
keyboard.code["KeyW"].isPressed; // WASD
keyboard.code["KeyA"].isPressed;
keyboard.code["KeyS"].isPressed;
keyboard.code["KeyD"].isPressed;
keyboard.code["Digit1"].isJustPressed;
```

Each key has: `.isPressed`, `.isJustPressed`, `.isJustReleased`

## Audio

```javascript
play("coin"); // Built-in sound effect
play("hit", { seed: 5, volume: 0.5, pitch: 60 }); // With options
```

Built-in sound types: `coin`, `powerUp`, `hit`, `explosion`, `laser`, `jump`, `select`, `click`, `random`

### External Audio

```javascript
audioFiles = {
  bgm: "path/to/music.mp3",
  explosion: "path/to/explosion.wav",
};
play("explosion");
```

## Vector (vec)

```javascript
vec(x, y); // Create vector
```

### Methods

```javascript
pos.set(x, y); // Set coordinates
pos.add(other); // Add vector or number
pos.sub(other); // Subtract vector or number
pos.mul(scalar); // Multiply by scalar
pos.div(scalar); // Divide by scalar
pos.addWithAngle(angle, length); // Move in direction
pos.clamp(xLow, xHigh, yLow, yHigh); // Constrain to bounds
pos.wrap(xLow, xHigh, yLow, yHigh); // Wrap around bounds
pos.normalize(); // Convert to unit vector
pos.rotate(angle); // Rotate by angle
pos.swapXy(); // Swap x and y
pos.floor(); // Floor coordinates
pos.round(); // Round coordinates
pos.ceil(); // Ceil coordinates
```

### Calculations

```javascript
pos.angleTo(target); // Angle to another point
pos.distanceTo(target); // Distance to another point
pos.isInRect(x, y, w, h); // Check if inside rectangle
pos.equals(other); // Compare vectors
pos.length; // Magnitude (property)
pos.angle; // Angle (property)
```

## Utility Functions

```javascript
times(count, fn); // Repeat function: times(5, i => { ... })
range(count); // Array [0, 1, ..., count-1]
remove(array, fn); // Remove elements where fn returns true
clamp(value, low, high); // Constrain value to range
wrap(value, low, high); // Wrap value around bounds
rnd(); // Random float 0-1
rnd(max); // Random float 0-max
rnd(min, max); // Random float min-max
rndi(max); // Random int 0-(max-1)
rndi(min, max); // Random int min-(max-1)
```

### Math Shortcuts

`PI`, `abs`, `sin`, `cos`, `atan2`, `sqrt`, `pow`, `floor`, `ceil`, `round`, `min`, `max`

## Game State

```javascript
ticks; // Frame counter (0 on first frame, increments each frame)
score; // Current score (managed by library)
difficulty; // Auto-increases over time (starts at 1)
```

### Game Control

```javascript
addScore(points); // Add to score
addScore(points, pos); // Add to score with floating text at position
addScore(points, x, y); // Add to score with floating text at x,y
end(); // Trigger game over
```

## Particle Effects

```javascript
// Preferred object format
particle(pos, { count: 10, speed: 2, angle: 0, angleWidth: PI });

// All options with defaults
particle(pos, {
  count: 16, // Number of particles
  speed: 1, // Initial speed
  angle: 0, // Center angle of emission
  angleWidth: PI * 2, // Spread angle
});
```

## Options

```javascript
options = {
  viewSize: { x: 100, y: 100 }, // Screen dimensions (default 100x100)
  theme: "simple", // simple | dark | shape | shapeDark | pixel | crt
  isPlayingBgm: false, // Enable background music
  isReplayEnabled: false, // Enable replay system
  audioSeed: 0, // Seed for sound generation
  isDrawingScoreFront: false, // Draw score in front of game
  isDrawingParticleFront: false, // Draw particles in front of game
  isShowingScore: true, // Show score display
  isUsingSmallText: false, // Use small text globally
};
```

### Theme Guide

| Theme       | Description             | Performance   |
| ----------- | ----------------------- | ------------- |
| `simple`    | Clean, light background | Best          |
| `dark`      | Dark background variant | Best          |
| `shape`     | 3D-style shapes, light  | Good          |
| `shapeDark` | 3D-style shapes, dark   | Good          |
| `pixel`     | Pixelated retro style   | Lower (WebGL) |
| `crt`       | CRT monitor effect      | Lower (WebGL) |

Use `simple` or `dark` for mobile. WebGL themes (`pixel`, `shape`, `shapeDark`, `crt`) may reduce performance on mobile.
