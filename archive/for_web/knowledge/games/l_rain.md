# L RAIN (l_rain)

- Source: `reference/games/l_rain.js`
- Tags: rule:proximity bonus, on sliding:move

## Tag Summaries
- **rule:proximity bonus**: Proximity to risk yields points. Place bonus items near obstacles and earn points or resources upon approaching obstacles. Utilize as a means to balance risk and reward.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.

## Key Functions
- `update` (line 37)

## Input Handling
- L49: `ship.pos.x = clamp(input.pos.x, 0, 99);`

## Comment Notes
- L25: @type {{pos: Vector, vy: number, width: number, ticks: number}[]}
- L29: @type {{pos: Vector, vy: number, size: Vector, color: Color}[]}
- L31: @type {{pos: Vector, px: number, energy: number, invincible: number}}
