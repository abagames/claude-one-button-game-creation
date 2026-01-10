# THRUST LR (thrust_lr)

- Source: `reference/games/thrust_lr.js`
- Tags: on sliding:thrust, rule:physics

## Tag Summaries
- **on sliding:thrust**: Accelerate in the direction of the slide. As the player character moves with inertia, controlling it becomes complex.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.

## Key Functions
- `update` (line 23)
- `addRect` (line 82)

## Input Handling
- L38: `const tx = -(clamp(input.pos.x, 0, 100) - 50);`

## Comment Notes
- L16: @type {{pos: Vector, vx: number, size: number}[]}
- L19: @type {{x: number, vx: number}}
