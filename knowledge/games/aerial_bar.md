# AERIAL BAR (aerial_bar)

- Source: `reference/games/aerial_bar.js`
- Tags: player:bar, on_pressed:jump_into_another, field:auto_scroll

## Tag Summaries
- **player:bar**: The player character  has a rod-shaped form. When combined with rotational motion, it adds complexity to movements such as dodging obstacles and maneuvering.
- **on_pressed:jump_into_another**: Leap to the next waypoint. Teleport instantly. The next waypoint is marked by a pin, so the player must assess whether it is safe to move there and then execute the teleportation with precision timing.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 34)

## Input Handling
- L70: `if (input.isJustPressed) {`
- L85: `player.vel.y += (input.isPressed ? 0.01 : 0.1) * sqrt(difficulty);`
- L86: `player.vel.mul(input.isPressed ? 0.99 : 0.95);`

## Comment Notes
- L16: @type {{ x: number, length: number, angle: number, angleVel: number, isHeld: boolean }[]}
- L23: @type {{ pos: Vector, length: number, angle: number, angleVel: number, center: number, bar: any, vel: Vector, }}
