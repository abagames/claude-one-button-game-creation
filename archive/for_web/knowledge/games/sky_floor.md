# SKY FLOOR (sky_floor)

- Source: `reference/games/sky_floor.js`
- Tags: field:weather, on sliding:thrust, rule:physics

## Tag Summaries
- **field:weather**: Weather and wind are relevant factors. Players can be affected by natural obstacles and the influence of wind-generated phenomena.
- **on sliding:thrust**: Accelerate in the direction of the slide. As the player character moves with inertia, controlling it becomes complex.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.

## Key Functions
- `update` (line 35)

## Input Handling
- L131: `const o = input.pos.x - ball.pos.x;`

## Comment Notes
- L18: @type {{pos: Vector, size: Vector}[]}
- L21: @type {{pos: Vector, speed: number, angle: number, ticks: number}[]}
- L23: @type {Vector[]}
- L25: @type {{pos: Vector, vel: Vector, radius: number, isOut: boolean}}
- L27: @type {{pos: Vector, width: number, angle: number }[]}
- L30: @type {Vector}
