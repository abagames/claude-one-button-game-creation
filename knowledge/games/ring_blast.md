# RING BLAST (ring_blast)

- Source: `reference/games/ring_blast.js`
- Tags: rule:physics, rule:time_limit, weapon:arc

## Tag Summaries
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **rule:time_limit**: Depletion of time and resources leads to the game's termination. Combine with means of restoring time and resources.
- **weapon:arc**: The weapon has an arched shape. By considering the trade-off between range and spreading angle, there is room to devise attack ranges.

## Key Functions
- `update` (line 51)
- `addCollidingVelocity` (line 216)

## Input Handling
- L82: `input.pos.angleTo(50, 120),`
- L86: `stoneSpeed = clamp((input.pos.y - 120) / 10 + 1, 1, 4);`

## Comment Notes
- L35: @type {{pos: Vector, vel: Vector, side: number, blastTicks: number}[]}
- L46: @type {{radius: number, angle: number, angleWidth: number, angleWidthVel: number}[]}
