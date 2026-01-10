# FROM TWO SIDES (from_two_sides)

- Source: `reference/games/from_two_sides.js`
- Tags: on sliding:move, rule:pass through gap

## Tag Summaries
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.
- **rule:pass through gap**: Passing through gaps. Quickly moving the player character to fit through narrow gaps.

## Key Functions
- `update` (line 38)

## Input Handling
- L94: `const x = clamp(input.pos.x, 1, 98);`

## Comment Notes
- L32: @type {{pos:Vector, vy: number, wy: -1 | 1}[]}
- L35: @type {{x: number, vx: number}[]}
