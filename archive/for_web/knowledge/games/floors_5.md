# FLOORS 5 (floors_5)

- Source: `reference/games/floors_5.js`
- Tags: rule:match, on_pressed:jump, player:paint, field:bottomless

## Tag Summaries
- **rule:match**: Matching colors, numbers, and shapes. It is necessary to take actions at the appropriate timing and location while observing the arrangement of colors and other elements.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **player:paint**: Painting the terrain. Painting the terrain can have an impact on the behavior of enemies, and can also provide rewards for the player, which encourages them to think more about their movements.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.

## Key Functions
- `update` (line 65)
- `addFloorScore` (line 189)

## Input Handling
- L104: `car.vel.y += input.isPressed ? 0.03 : 0.18;`
- L136: `input.isJustPressed`
- L145: `if (input.isJustPressed) {`

## Comment Notes
- L50: @type { {pos: Vector, width: number, index: number, paintFrom: number, paintTo:number }[] }
- L55: @type { Color[] }
- L57: @type { {pos:Vector, vel: Vector, floor: any, by: number, bvy: number, fallTicks: number, jumpCount: number }}
