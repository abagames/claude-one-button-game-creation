# HOLES (holes)

- Source: `reference/games/holes.js`
- Tags: rule:physics, on_pressed:reverse_state, field:bottomless, field:auto_scroll

## Tag Summaries
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 33)
- `reflect` (line 117)
- `setCoin` (line 133)
- `addWalls` (line 145)

## Input Handling
- L44: `if (input.isJustPressed) {`

## Comment Notes
- L18: @type {{pos: Vector, vel: Vector, angle: number}[]}
- L20: @type {{pos: Vector, length: number, angle: number, index: number}[]}
- L22: @type {{pos: Vector, wall: any}}
- L189: @ts-ignore
