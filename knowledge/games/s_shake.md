# S SHAKE (s_shake)

- Source: `reference/games/s_shake.js`
- Tags: on_pressed:change_field, field:outpost, field:auto_scroll

## Tag Summaries
- **on_pressed:change_field**: Alter the field. Modify the behavior of objects by altering the field.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 40)

## Input Handling
- L53: `if (input.isJustPressed) {`
- L102: `if (input.isJustPressed) {`

## Comment Notes
- L32: @type {{pos: Vector, angle: number, height: number}[]}
- L35: @type {{pos: Vector, vel: Vector, isOnGround: boolean, ticks: number}[]}
