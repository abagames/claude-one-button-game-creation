# PRESS M (press_m)

- Source: `reference/games/press_m.js`
- Tags: field:press, on sliding:move

## Tag Summaries
- **field:press**: The terrain is capable of crushing the character. One can search for areas that do not result in crushing, or time the movements accurately to avoid getting crushed.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.

## Key Functions
- `update` (line 45)

## Input Handling
- L165: `let p = vec(clamp(input.pos.x, 3, 96), 50);`

## Comment Notes
- L29: @type {{ pos: Vector, sy: number, ey: number, ney: number }[]}
- L31: @type { "press" | "return" }
- L39: @type {{pos: Vector, wall, wallOy: number}[]}
- L41: @type {{pos: Vector, speed: number}[]}
