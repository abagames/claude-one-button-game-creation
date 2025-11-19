# G TAIL (g_tail)

- Source: `reference/games/g_tail.js`
- Tags: obstacle:chase, rule:proximity bonus, on sliding:move

## Tag Summaries
- **obstacle:chase**: Pursue the player character. Evade by skillful guidance.
- **rule:proximity bonus**: Proximity to risk yields points. Place bonus items near obstacles and earn points or resources upon approaching obstacles. Utilize as a means to balance risk and reward.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.

## Key Functions
- `update` (line 45)

## Input Handling
- L72: `shipPos.x = clamp(input.pos.x, 0, 99);`

## Comment Notes
- L33: @type {{ pos: Vector, vel: Vector, accel: number, posHistory: Vector[], golds: number[] }[]}
- L42: @type {{pos: Vector, vy: number, color: Color}[]}
- L51: @ts-ignore
