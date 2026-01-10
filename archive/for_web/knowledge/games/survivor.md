# SURVIVOR (survivor)

- Source: `reference/games/survivor.js`
- Tags: player:multiple, on_pressed:jump

## Tag Summaries
- **player:multiple**: There exist multiple player characters within the game. Necessitating the simultaneous handling of multiple characters and resulting in increased complexity.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.

## Key Functions
- `update` (line 37)
- `addPlayers` (line 213)
- `addPlayer` (line 220)

## Input Handling
- L122: `input.isJustPressed &&`

## Comment Notes
- (no comments captured)
