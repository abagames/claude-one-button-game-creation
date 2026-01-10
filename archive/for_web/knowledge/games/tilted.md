# TILTED (tilted)

- Source: `reference/games/tilted.js`
- Tags: on_pressed:jump, on_pressed:turn, field:floors, field:bottomless, rule:physics, field:auto_scroll

## Tag Summaries
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.
- **field:floors**: Multiple platforms are suspended in the air. To traverse the platforms, it is necessary to jump with precise timing to avoid falling off. Some platforms may also move, affecting the movement of the player character.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 69)

## Input Handling
- L96: `if (input.isJustPressed) {`
- L105: `if (input.isJustPressed) {`
- L116: `player.vel.y += input.isPressed ? 0.05 : 0.1;`

## Comment Notes
- L59: @type {{pos: Vector, angle: number, length: number}[]}
- L63: @type {{pos: Vector, vel: Vector, ticks: number}[]}
- L66: @type {{pos: Vector, vel: Vector, bar: any, jumpCount: number}}
