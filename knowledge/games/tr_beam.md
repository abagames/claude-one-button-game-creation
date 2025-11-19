# TR BEAM (tr_beam)

- Source: `reference/games/tr_beam.js`
- Tags: on_holding:inhale, obstacle:penalty, rule:physics, player:reciprocate, obstacle:well_up

## Tag Summaries
- **on_holding:inhale**: Inhale. By combining with the laws of physics, complex movements can be achieved.
- **obstacle:penalty**: There are objects interspersed that incur penalties upon contact or destruction. To avoid incurring penalties, it is necessary to deftly avoid the characters that are subject to penalty when launching an attack. This acts as a constraint against player characters with powerful attacks.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **player:reciprocate**: The player character reciprocates horizontally or vertically. This is combined with mechanics that involve player-controlled movement and speed changes.
- **obstacle:well_up**: Characters are spawning. Evade or eliminate the characters that emerge from the lower portion and travel towards the upper direction.

## Key Functions
- `update` (line 44)

## Input Handling
- L54: `if (input.isJustPressed) {`
- L58: `if (input.isPressed) {`

## Comment Notes
- L32: @type {{pos: Vector, angle: number, trLength: number}}
- L34: @type {{ pos: Vector, vel: Vector, radius: number, isRed: boolean, isBeamed: boolean }[]}
