# CATAPULT (catapult)

- Source: `reference/games/catapult.js`
- Tags: on_pressed:reverse_state, rule:physics, field:bottomless, field:auto_scroll

## Tag Summaries
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 28)

## Input Handling
- L42: `const ip = input.isPressed;`
- L79: `if (input.isJustPressed) {`
- L94: `if (input.isJustPressed) {`

## Comment Notes
- L16: @type {{pos: Vector, width: number, isPassed: boolean}[]}
- L19: @type {{ pos: Vector, vel: Vector, bar: any, barPos: number, grv: number }}
