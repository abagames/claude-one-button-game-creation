# THROW M (throw_m)

- Source: `reference/games/throw_m.js`
- Tags: weapon:artillery, player:reciprocate, on_holding:adjust_angle, on_released:throw

## Tag Summaries
- **weapon:artillery**: The object follows a parabolic trajectory due to the effect of gravity. It is often used in combination with the adjustment of the launch angle. Skill is required to successfully hit the intended target.
- **player:reciprocate**: The player character reciprocates horizontally or vertically. This is combined with mechanics that involve player-controlled movement and speed changes.
- **on_holding:adjust_angle**: Adjust the direction and distance. While pressing, the angle and distance change, and releasing the button causes firing or movement. It is possible to alter the destination based on the timing of button operations.
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.

## Key Functions
- `update` (line 72)

## Input Handling
- L170: `if (input.isJustPressed) {`
- L178: `if (input.isJustReleased || player.fireAngle > (PI / 8) * 11) {`

## Comment Notes
- L56: @type {{ pos: Vector, vy: number, fireInterval: number, fireTicks: number, color: Color, isFalling: boolean }[]}
- L64: @type {Vector[]}
- L66: @type {{pos: Vector, vy: number, fireAngle: number}}
- L68: @type {{pos: Vector, vel: Vector}[]}
- L99: @ts-ignore
