# CAST N (cast_n)

- Source: `reference/games/cast_n.js`
- Tags: on_released:throw, obstacle:penalty, on_holding:adjust_angle, rule:time_limit, weapon:artillery, field:water

## Tag Summaries
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.
- **obstacle:penalty**: There are objects interspersed that incur penalties upon contact or destruction. To avoid incurring penalties, it is necessary to deftly avoid the characters that are subject to penalty when launching an attack. This acts as a constraint against player characters with powerful attacks.
- **on_holding:adjust_angle**: Adjust the direction and distance. While pressing, the angle and distance change, and releasing the button causes firing or movement. It is possible to alter the destination based on the timing of button operations.
- **rule:time_limit**: Depletion of time and resources leads to the game's termination. Combine with means of restoring time and resources.
- **weapon:artillery**: The object follows a parabolic trajectory due to the effect of gravity. It is often used in combination with the adjustment of the launch angle. Skill is required to successfully hit the intended target.
- **field:water**: The surface and the depths of water serve as the field. Various conditions can be created such as alterations in movement between the surface and air, changes in the surface due to the wind, and the opaque nature of the underwater environment.

## Key Functions
- `update` (line 47)

## Input Handling
- L74: `if (input.isJustPressed) {`
- L85: `if (input.isJustReleased || throwPower > 3) {`
- L119: `if (input.isJustPressed) {`

## Comment Notes
- L33: @type {{pos: Vector, vel: Vector, nextNode: any}[]}
- L35: @type {"ready" | "angle" | "throw" | "pull"}
- L38: @type {{pos: Vector, vel: Vector, type: number}[]}
