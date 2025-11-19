# FLOATER (floater)

- Source: `reference/games/floater.js`
- Tags: field:floors, on_pressed:jump, field:bottomless

## Tag Summaries
- **field:floors**: Multiple platforms are suspended in the air. To traverse the platforms, it is necessary to jump with precise timing to avoid falling off. Some platforms may also move, affecting the movement of the player character.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.

## Key Functions
- `update` (line 21)

## Input Handling
- L73: `player.v.y += input.isPressed ? 0.05 : 0.2;`
- L79: `if (input.isJustPressed) {`

## Comment Notes
- (no comments captured)
