# TAPE J (tape_j)

- Source: `reference/games/tape_j.js`
- Tags: on_holding:extend, obstacle:fall, field:roughness, field:auto_scroll

## Tag Summaries
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.
- **obstacle:fall**: Descend from a height. Avoid or destroy falling obstacles.
- **field:roughness**: The terrain is uneven. The behavior of movement and jumping is affected by the slope of the terrain. The uneven terrain can also act as obstacles or cover.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 35)

## Input Handling
- L51: `if (input.isJustPressed) {`
- L54: `if (input.isPressed) {`

## Comment Notes
- L17: @type {{x: number, size: Vector}[]}
- L20: @type {{from: Vector, to: Vector}[]}
- L22: @type {{ from: Vector, to: Vector, type: "ground" | "up" | "top" | "down", rect }}
- L28: @type {{pos: Vector, vel: Vector, size: number}[]}
