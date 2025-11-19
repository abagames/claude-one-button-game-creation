# BOTTOP (bottop)

- Source: `reference/games/bottop.js`
- Tags: player:inverted, field:auto_scroll, on_pressed:jump

## Tag Summaries
- **player:inverted**: The player character exists in a reversed state. There are multiple fields where the player character can move between, or in each field, there may be multiple player characters present. The player must be attentive to multiple fields simultaneously.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.

## Key Functions
- `update` (line 57)

## Input Handling
- L79: `if (!isJumping && input.isPressed) {`
- L85: `vy -= input.isPressed ? 0.1 : 0.3;`

## Comment Notes
- (no comments captured)
