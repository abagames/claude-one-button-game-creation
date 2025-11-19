# FLIP O (flip_o)

- Source: `reference/games/flip_o.js`
- Tags: player:multiple, rule:physics, on_pressed:reverse_state, field:auto_scroll

## Tag Summaries
- **player:multiple**: There exist multiple player characters within the game. Necessitating the simultaneous handling of multiple characters and resulting in increased complexity.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 28)
- `reflect` (line 185)

## Input Handling
- L52: `if (input.isJustPressed) {`
- L77: `if (input.isJustPressed) {`
- L120: `if (input.isJustPressed) {`

## Comment Notes
- L17: @type {{pos: Vector, pp: Vector, vel: Vector, angle: number, multiplier: 1}[]}
- L20: @type {{pos: Vector, hasBall: boolean}[]}
