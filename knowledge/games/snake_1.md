# SNAKE 1 (snake_1)

- Source: `reference/games/snake_1.js`
- Tags: player:follow, on_got_item:reverse_state, on_pressed:turn

## Tag Summaries
- **player:follow**: To follow the player character. To increase the reward by attracting many characters. As a tradeoff, the risk of increasing collision detection arises.
- **on_got_item:reverse_state**: Invert attributes, status, and direction. Upon acquisition of an item, gravity and orientation may be altered, allowing for transition to an alternate field.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 35)

## Input Handling
- L52: `if (!isHeadTurning && input.isJustPressed) {`

## Comment Notes
- L16: @type { {pos: Vector, angle: number, rotation: number} }
- L21: @type { Vector[] }
- L23: @type { Vector[] }
