# TURBULENT (turbulent)

- Source: `reference/games/turbulent.js`
- Tags: field:roughness, on_pressed:jump, on_holding:thrust, rule:physics, field:water, field:auto_scroll

## Tag Summaries
- **field:roughness**: The terrain is uneven. The behavior of movement and jumping is affected by the slope of the terrain. The uneven terrain can also act as obstacles or cover.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **on_holding:thrust**: Accelerate forward or upward with the player character. By holding the button longer, the player can achieve higher speeds, whereas shorter presses result in lower speeds, allowing for more precise control.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **field:water**: The surface and the depths of water serve as the field. Various conditions can be created such as alterations in movement between the surface and air, changes in the surface due to the wind, and the opaque nature of the underwater environment.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 31)
- `getPoints` (line 163)

## Input Handling
- L114: `if (input.isJustPressed) {`
- L129: `ship.vel.y += input.isPressed ? 0.02 : 0.1;`

## Comment Notes
- L16: @type {{height: number, angle: number, va: number, x: number}[]}
- L18: @type {Vector[]}
- L20: @type {{x: number, vx: number}[]}
- L23: @type {{pos: Vector, pp: Vector, vel: Vector, angle: number, state: "float" | "jump" }}
