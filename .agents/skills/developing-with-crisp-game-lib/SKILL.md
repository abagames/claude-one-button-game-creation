---
name: developing-with-crisp-game-lib
description: "Creates or repairs browser mini-games specifically using crisp-game-lib. Use only when the user explicitly asks for crisp-game-lib or the existing project already uses it; skip for Godot, Unity, Phaser, canvas-only, or unspecified engine requests."
---

# Developing with crisp-game-lib

Creates browser-based mini-games using crisp-game-lib, a JavaScript library for rapid arcade game development.

## 1. Purpose and Scope

Use this skill when asked to create or repair a mini-game with crisp-game-lib. If the user asks for Godot or another engine, or leaves the engine unspecified, do not use this skill unless the existing project is already a crisp-game-lib project.

This guide separates:
- ordered implementation steps (what to do in sequence)
- mandatory constraints (rules that always apply)
- reusable patterns and references (optional support)

## 2. Pre-Implementation Decisions

### Choose Project Setup

Choose the appropriate setup based on the project context.

#### Option A: CDN (Simplest — single HTML file)

Create a project directory with `index.html` and `main.js`. CDN is acceptable for final projects when the script URL is pinned to a verified version. For quick prototypes only, a clearly labeled draft may use `crisp-game-lib@latest`.

For reproducible assignments or committed projects:
- CDN is fine; the reproducibility issue is an unpinned moving version such as `@latest`.
- Pin only a version that is already specified by the project or that you have verified from package metadata/CDN access.
- Do not invent a crisp-game-lib version number.
- If using `algo-chip` helpers, the verified `crisp-game-lib` version must be `1.5.0` or later.
- If no verified version is available, treat version selection as a blocker for a final committed skeleton: ask for the existing project version or permission to check package/CDN metadata. You may show `@latest` only in a clearly labeled draft, not as the final committed form.

**index.html:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Game</title>
    <meta
      name="viewport"
      content="width=device-width, height=device-height, user-scalable=no, initial-scale=1, maximum-scale=1"
    />
    <!-- Optional: only required if you use algo-chip helpers -->
    <script src="https://unpkg.com/algo-chip@1.0.2/packages/core/dist/algo-chip.umd.js"></script>
    <script src="https://unpkg.com/algo-chip@1.0.2/packages/util/dist/algo-chip-util.umd.js"></script>
    <script src="https://unpkg.com/crisp-game-lib@<verified-version>/docs/bundle.js"></script>
    <script src="./main.js"></script>
    <script>
      window.addEventListener("load", onLoad);
    </script>
  </head>
  <body style="background: #ddd"></body>
</html>
```

Other optional script tags (add before `bundle.js` if needed):

```html
<!-- GIF capture: add if options.isCapturing is true -->
<script src="https://unpkg.com/gif-capture-canvas@1.1.0/build/index.js"></script>
<!-- WebGL themes (pixel, shape, shapeDark, crt): add if using these themes -->
<script src="https://unpkg.com/pixi.js@5.3.0/dist/pixi.min.js"></script>
<script src="https://unpkg.com/pixi-filters@3.1.1/dist/pixi-filters.js"></script>
```

#### Option B: npm + Bundler (Vite, Webpack, etc.)

Assumes a bundler is already configured (e.g. project has `package.json` and a Vite/Webpack/etc. dev-server entry). If not, bootstrap the bundler first (e.g. `npm create vite@latest`) before adding crisp-game-lib.

The other CDN-only optional tags (`gif-capture-canvas`, `pixi.js` + `pixi-filters`) have no documented npm replacement — keep them as `<script>` tags in `index.html` if used.

```bash
npm install crisp-game-lib
```

If this project also uses `algo-chip` helpers, install or pin `crisp-game-lib` at `1.5.0` or later.

**index.html:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Game</title>
    <meta
      name="viewport"
      content="width=device-width, height=device-height, user-scalable=no, initial-scale=1, maximum-scale=1"
    />
    <!-- Optional: only required if you use algo-chip helpers -->
    <script src="https://unpkg.com/algo-chip@1.0.2/packages/core/dist/algo-chip.umd.js"></script>
    <script src="https://unpkg.com/algo-chip@1.0.2/packages/util/dist/algo-chip-util.umd.js"></script>
    <script type="module" src="./main.js"></script>
  </head>
  <body style="background: #ddd"></body>
</html>
```

**main.js** (bundler version uses `const`, `import`, and `init()`):

```javascript
import "crisp-game-lib";

const title = "MY GAME";
const description = `[Control instructions]`;
const characters = [];
const options = {};

function update() {
  if (!ticks) {
    /* init */
  }
}

init({ update, title, description, characters, options });
```

## 3. Implementation Flow

### Step 1: Create `main.js`

Write `main.js` following the structure below.

Before and during implementation:
- Read `references/api.md` when you need exact function behavior, argument shapes, collision semantics, or available colors/sounds.
- Read `references/examples.md` when the requested game resembles one of the listed patterns, or when you need a complete working loop to adapt.
- For one-button games, state the exact input interpretation before coding (for example tap toggles state, tap applies impulse, hold charges, or release fires).

#### Required Structure (CDN / Repository)

```javascript
title = "GAME NAME";

description = `
[Control instructions]
`;

characters = []; // Optional pixel art (6x6 grid, use letters a-z)

options = {
  viewSize: { x: 100, y: 100 }, // Default screen size
  theme: "simple", // simple | dark | shape | shapeDark | pixel | crt
};

// Game state variables
let player, enemies;

function update() {
  if (!ticks) {
    // Initialize on first frame
    player = { pos: vec(50, 50) };
    enemies = [];
  }

  // Input → Physics → Spawn → Draw (with collision) → Score → Game Over
}
```

### Step 2: Implement Core Game Loop

Fill `update()` with a clear per-frame order:

- Input handling
- Physics/state updates
- Spawning
- Drawing (with collision checks)
- Score updates
- Game-over conditions

Use `if (!ticks) { ... }` for one-time initialization.

### Step 3: Apply Mandatory Rules and Validate

Apply section 4 (Mandatory Rules) as required validation criteria, then run the section 6 checklist on desktop and/or mobile.

For this repository's automated testers:
- In generated test fixtures for this repository, keep game-specific helper logic inside `update()`; tester execution can miss helpers defined outside it. In normal user projects, small top-level helpers are acceptable if the target build/test harness runs them correctly.
- Name moving hazard arrays with detectable terms such as `obstacles`, `enemies`, or `hazards` when useful. Verbose GA logs use those names to populate spawn analysis.
- Prefer `addScore(points, x, y)` over `addScore(points, pos)` when you need accurate score-event positions in tester logs.

## 4. Mandatory Rules (Always Apply)

Follow these rules strictly. Violations cause silent bugs.

**Drawing order determines collision detection.** Objects can ONLY detect collision with shapes drawn BEFORE them in the same frame:

```javascript
// ✅ CORRECT: Draw targets first, then detectors
color("red");
enemies.forEach((e) => box(e.pos, 10)); // Draw enemies FIRST
color("blue");
if (box(player.pos, 8).isColliding.rect.red) {
  end();
} // Player detects enemies

// ❌ WRONG: Checking collision with something not yet drawn
color("blue");
if (box(player.pos, 8).isColliding.rect.red) {
  end();
} // red not drawn yet!
color("red");
enemies.forEach((e) => box(e.pos, 10));
```

**Do NOT manually draw the score.** The library automatically displays it. Never call `text()` for score display.

**White color is invisible** on all themes (matches background). Use `light_` variants or other colors instead.

**Use `particle()` with object format:**

```javascript
particle(pos, { count: 5, speed: 2, angle: PI }); // ✅ Preferred
particle(pos, 5, 2, PI, PI); // ❌ Legacy format
```

## 5. Common Implementation Patterns (Optional)

#### One-Button / Tap Game (Best for Mobile)

```javascript
if (input.isJustPressed) {
  /* jump, shoot, or change direction */
}
```

#### Slide Control

```javascript
player.pos.x = input.pos.x;
player.pos.clamp(5, 95, 5, 95);
```

#### Spawning with Difficulty Scaling

```javascript
// Declare at game state level
let nextEnemyTicks;

// In update(), initialize on first frame
if (!ticks) {
  nextEnemyTicks = 0;
}

// Countdown and spawn
nextEnemyTicks--;
if (nextEnemyTicks < 0) {
  enemies.push({ pos: vec(110, rnd(90) + 5) });
  nextEnemyTicks = rnd(60, 120) / difficulty;
}
```

#### Entity Update with remove()

```javascript
remove(enemies, (e) => {
  e.pos.x -= difficulty * 0.5;
  color("red");
  box(e.pos, 8);
  return e.pos.x < -10; // Remove when off-screen
});
```

#### Physics (Gravity + Jump)

```javascript
player.vy += 0.15; // Gravity
player.pos.y += player.vy;
if (player.pos.y >= ground) {
  // Ground collision
  player.pos.y = ground;
  player.vy = 0;
  player.onGround = true;
}
if (input.isJustPressed && player.onGround) {
  player.vy = -4;
  play("jump");
}
```

## 6. Verification Checklist

Open the game in a browser and check:

- Game initializes without errors
- Controls respond correctly
- Collision detection works (drawing order is correct)
- Score increases appropriately
- `end()` triggers game over correctly
- Mobile: touch controls work if applicable

## 7. Key API Quick Reference

| Category | Functions                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------- |
| Drawing  | `rect(x,y,w,h)` `box(pos,w,h)` `line(p1,p2,t)` `bar(pos,len,t,angle)` `arc(pos,r,t,start,end)`  |
| Text     | `text(str,x,y)` `char(ch,x,y)` `addWithCharCode(ch,offset)`                                     |
| Color    | `color("red")` — red, green, blue, yellow, purple, cyan, black, light\_\* variants, transparent |
| Input    | `input.pos` `input.isPressed` `input.isJustPressed` `keyboard.code["Space"].isJustPressed`      |
| Audio    | `play("coin")` — listed names: coin, powerUp, hit, jump, select, lucky. **Treat this list as illustrative; consult `references/api.md` for the complete enumeration before invoking other names.** |
| Vector   | `vec(x,y)` `.add()` `.sub()` `.mul()` `.clamp(xMin,xMax,yMin,yMax)` `.wrap()` `.addWithAngle()` `.distanceTo()`    |
| Utility  | `times(n,fn)` `range(n)` `remove(arr,fn)` `rnd(max)` `rndi(max)` `clamp(v,min,max)` `wrap(v,min,max)` — note the free-function `clamp` / `wrap` take a scalar; the Vector method on the same name takes 4 axis bounds. |
| State    | `ticks` `score` `difficulty` `addScore(points)` `addScore(points,pos)` `addScore(points,x,y)` `end()` |
| Effects  | `particle(pos, {count, speed, angle, angleWidth})`                                              |
