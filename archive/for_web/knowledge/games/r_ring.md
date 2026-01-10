# R RING (r_ring)

- Source: `reference/games/r_ring.js`
- Tags: rule:pass through gap, on sliding:move

## Tag Summaries
- **rule:pass through gap**: Passing through gaps. Quickly moving the player character to fit through narrow gaps.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.

## Key Functions
- `update` (line 56)
- `fire` (line 208)

## Input Handling
- L176: `if (char("c", clamp(input.pos.x, 0, 99), 95).isColliding.rect.red) {`

## Comment Notes
- L40: @type {{ pos: Vector, posHistory:Vector[], targetPos: Vector, angle: number, stopTicks: number, moveTicks: number, fireTicks: number, }}
- L48: @type {{pos: Vector, vy: number, radius: number, isHit: boolean }[]}
- L50: @type {{pos :Vector, vy: number, color: Color}[]}
- L69: @ts-ignore
