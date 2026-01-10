# MIRROR FLOOR (mirror_floor)

- Source: `reference/games/mirror_floor.js`
- Tags: on_got_item:reverse_state, field:bottomless, on_pressed:jump, field:auto_scroll

## Tag Summaries
- **on_got_item:reverse_state**: Invert attributes, status, and direction. Upon acquisition of an item, gravity and orientation may be altered, allowing for transition to an alternate field.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 55)

## Input Handling
- L65: `if (input.isJustPressed) {`
- L75: `if (input.isPressed) {`

## Comment Notes
- L41: @type {{pos: Vector, width: number}[]}
- L44: @type {Vector[]}
- L46: @type {{ y: number, my: number, vy: number, speed: number, side: 1 | -1, state: "run" | "jump" }}
- L118: @ts-ignore
