# TOTOGE (totoge)

- Source: `reference/games/totoge.js`
- Tags: player:limited_vision, on_pressed:jump, field:spike, field:auto_scroll

## Tag Summaries
- **player:limited_vision**: The player's vision is limited. This may be due to the restricted visible area on the screen or the existence of a means to observe off-screen situations. The skill of moving while anticipating situations outside of the field of vision is required.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **field:spike**: There are terrains in the game that result in game over upon contact. The player must avoid areas with spikes by jumping or moving to progress.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 55)

## Input Handling
- L129: `if (vel.y > 0 && nextWallY < 150 && input.isJustPressed) {`

## Comment Notes
- L41: @type {Vector}
- L43: @type {Vector}
- L45: @type {{pos:Vector, c: string}[]}
- L51: @type {Vector[]}
