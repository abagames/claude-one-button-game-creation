# DARK CAVE (dark_cave)

- Source: `reference/games/dark_cave.js`
- Tags: player:limited vision, on sliding:move, on got item:power up

## Tag Summaries
- **player:limited vision**: The player's vision is limited. This may be due to the restricted visible area on the screen or the existence of a means to observe off-screen situations. The skill of moving while anticipating situations outside of the field of vision is required.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.
- **on got item:power up**: Upgrade and gain power. Enable the capability to counterattack enemies.

## Key Functions
- `update` (line 25)

## Input Handling
- L45: `player.pos.x = clamp(input.pos.x, 3, 97);`

## Comment Notes
- L16: @type {{pos: Vector, type: "spike" | "coin"}[]}
- L20: @type {{pos: Vector, angle: number, range: number}}
