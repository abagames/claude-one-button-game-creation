# SUB JUMP (sub_jump)

- Source: `reference/games/sub_jump.js`
- Tags: field:water, field:roughness, on_pressed:jump, field:auto_scroll

## Tag Summaries
- **field:water**: The surface and the depths of water serve as the field. Various conditions can be created such as alterations in movement between the surface and air, changes in the surface due to the wind, and the opaque nature of the underwater environment.
- **field:roughness**: The terrain is uneven. The behavior of movement and jumping is affected by the slope of the terrain. The uneven terrain can also act as obstacles or cover.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 56)

## Input Handling
- L117: `if (input.isJustPressed) {`
- L120: `if (input.isPressed) {`

## Comment Notes
- L43: @type {Vector[]}
- L45: @type {"sea" | "land"}
- L49: @type {{pos: Vector, vel: Vector}}
- L51: @type {Vector[]}
