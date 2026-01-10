# D PISTOLS (d_pistols)

- Source: `reference/games/d_pistols.js`
- Tags: on_pressed:shoot, on_holding:shoot, on_pressed:turn

## Tag Summaries
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 62)

## Input Handling
- L73: `if (input.isJustPressed) {`
- L84: `if (input.isPressed) {`

## Comment Notes
- L50: @type {{pos: Vector, my: -1 | 1}}
- L53: @type {{pos: Vector, angle: number}[]}
- L55: @type {{pos: Vector, vel: Vector, ticks: number}[]}
