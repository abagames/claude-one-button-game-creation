# TAPPUMP (tappump)

- Source: `reference/games/tappump.js`
- Tags: on_holding:extend, on_pressed:flap, player:circle, field:auto_scroll

## Tag Summaries
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.
- **on_pressed:flap**: Accelerate upwards by flapping wings. Adjust the timing and frequency of button presses to avoid obstacles.
- **player:circle**: The player character has a circular shape. By increasing the radius, there is a trade-off between the risk and reward of larger hitboxes and attack ranges.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 43)

## Input Handling
- L68: `if (input.isJustPressed) {`
- L72: `player.vel.y -= sqrt(difficulty) * (input.isPressed ? 0.03 : -0.12);`
- L73: `if (input.isPressed) {`

## Comment Notes
- L32: @type {{pos: Vector, vel: Vector, radius: number, rv: number}}
- L34: @type {Vector[]}
- L37: @type {Vector[]}
