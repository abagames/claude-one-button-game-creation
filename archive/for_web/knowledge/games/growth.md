# GROWTH (growth)

- Source: `reference/games/growth.js`
- Tags: on_holding:extend, field:3D, field:auto_scroll

## Tag Summaries
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.
- **field:3D**: An expansive three-dimensional view with depth. Taking advantage of the ability to see far distances, objects can be arranged over a wider area compared to 2D.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 24)

## Input Handling
- L33: `if (input.isJustPressed) {`
- L37: `((input.isPressed ? 50 : 5) - player.size) *`

## Comment Notes
- L17: {{x: number, vx: number, size: number}}
- L19: {{x: number, size: number}[]}
