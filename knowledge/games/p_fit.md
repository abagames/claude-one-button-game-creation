# P FIT (p_fit)

- Source: `reference/games/p_fit.js`
- Tags: rule:match, on sliding:move, field:press

## Tag Summaries
- **rule:match**: Matching colors, numbers, and shapes. It is necessary to take actions at the appropriate timing and location while observing the arrangement of colors and other elements.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.
- **field:press**: The terrain is capable of crushing the character. One can search for areas that do not result in crushing, or time the movements accurately to avoid getting crushed.

## Key Functions
- `update` (line 29)

## Input Handling
- L69: `wallX + input.pos.x,`
- L83: `const wi = wrap(floor((input.pos.x - 5) / 10), 0, 11);`
- L97: `? wrap(w.pos.x + wallX + input.pos.x, -wallWidth, 100)`
- L124: `wallX + input.pos.x,`

## Comment Notes
- L15: @type {{ pos: Vector, width: number, height: number, targetY: number, type: "fix" | "move" | "end" }[]}
