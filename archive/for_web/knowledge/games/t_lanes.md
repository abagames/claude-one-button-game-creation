# T LANES (t_lanes)

- Source: `reference/games/t_lanes.js`
- Tags: player:multiple, field:lanes, on_got_item:spawn, on_pressed:reverse_state, field:auto_scroll

## Tag Summaries
- **player:multiple**: There exist multiple player characters within the game. Necessitating the simultaneous handling of multiple characters and resulting in increased complexity.
- **field:lanes**: The character moves on multiple lanes. Avoiding obstacles that flow down the lanes by moving the lanes at the right timing.
- **on_got_item:spawn**: Spawn a character. The player character increases in number or size.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 81)

## Input Handling
- L152: `if (input.isJustPressed) {`
- L157: `if (input.isJustPressed) {`
- L214: `if (input.isJustPressed && c.pos.x < 50) {`

## Comment Notes
- L60: @type {{pos: Vector, angle: -1 | 1, currentAngle: -1 | 0 | 1}[]}
- L65: @type {Vector[]}
- L68: @type {{ pos: Vector, angle: -1 | 0 | 1, speed: number, ty: number, onArrow: boolean, invDist: number }[]}
