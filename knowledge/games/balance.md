# BALANCE (balance)

- Source: `reference/games/balance.js`
- Tags: rule:balance, on sliding:move

## Tag Summaries
- **rule:balance**: Achieving equilibrium. Control the player character's inclination by observing its tilt state.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.

## Key Functions
- `update` (line 26)

## Input Handling
- L39: `const o = input.pos.x - pillar.x;`

## Comment Notes
- L16: @type {{x: number, vx: number, angle: number, length: number, angleVel: number}}
- L18: @type {{pos: Vector, vel: Vector}[]}
