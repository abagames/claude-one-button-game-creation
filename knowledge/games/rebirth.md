# REBIRTH (rebirth)

- Source: `reference/games/rebirth.js`
- Tags: on_got_item:reverse_state, player:inverted, field:outpost, on_pressed:jump, on_pressed:fall

## Tag Summaries
- **on_got_item:reverse_state**: Invert attributes, status, and direction. Upon acquisition of an item, gravity and orientation may be altered, allowing for transition to an alternate field.
- **player:inverted**: The player character exists in a reversed state. There are multiple fields where the player character can move between, or in each field, there may be multiple player characters present. The player must be attentive to multiple fields simultaneously.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **on_pressed:fall**: Drop down, fall. Drop an object to a desired position or avoid obstacles by instantly dropping a jumping character to the ground.

## Key Functions
- `update` (line 92)

## Input Handling
- L132: `if (input.isJustPressed) {`
- L139: `player.vel.y += (input.isPressed ? 0.07 : 0.14) * difficulty;`
- L145: `if (input.isJustPressed) {`

## Comment Notes
- L74: @type {{x: number, vx: number, world: -1 | 1}[]}
- L78: @type {{pos: Vector, vx: number, world: -1 | 1}[]}
- L83: @type {{ pos: Vector, ox: number, vel: Vector, world: -1 | 1, state: "run" | "jump" | "land" | "hit" }}
