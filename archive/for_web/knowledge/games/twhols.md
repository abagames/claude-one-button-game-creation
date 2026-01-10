# TWHOLS (twhols)

- Source: `reference/games/twhols.js`
- Tags: player:reflect, on_pressed:turn, field:holes

## Tag Summaries
- **player:reflect**: The player character reflects upon colliding with a wall or object. To anticipate the movement of the reflection, actions such as positioning walls should be taken.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.
- **field:holes**: There are holes in the ground. To avoid falling into them, it is necessary to move and jump carefully. It is also possible to utilize the holes by hiding in them to evade enemy attacks.

## Key Functions
- `update` (line 17)

## Input Handling
- L42: `if (input.isJustPressed || p.x < 0 || p.x > 99) {`

## Comment Notes
- (no comments captured)
