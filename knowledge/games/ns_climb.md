# NS CLIMB (ns_climb)

- Source: `reference/games/ns_climb.js`
- Tags: on_pressed:reverse_state, field:gravity, field:auto_scroll

## Tag Summaries
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **field:gravity**: Gravity and attraction forces are at work. To avoid being drawn in, one can alter direction or modify attributes of the player character.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 28)

## Input Handling
- L45: `if (input.isJustPressed) {`

## Comment Notes
- L15: @type {{pos: Vector, type: "N" | "S" | "", wallIndex: number}[]}
- L17: @type {{ type: "N" | "S" | "", prevType: "N" | "S", count: number, x: number, vx: number }[]}
