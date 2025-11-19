# B BLAST (b_blast)

- Source: `reference/games/b_blast.js`
- Tags: obstacle:well_up, rule:physics, on_holding:extend, on_released:erase, obstacle:penalty

## Tag Summaries
- **obstacle:well_up**: Characters are spawning. Evade or eliminate the characters that emerge from the lower portion and travel towards the upper direction.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.
- **on_released:erase**: Erase or nullify characters within a specified range. Adjust and erase the range of attack by holding down the button.
- **obstacle:penalty**: There are objects interspersed that incur penalties upon contact or destruction. To avoid incurring penalties, it is necessary to deftly avoid the characters that are subject to penalty when launching an attack. This acts as a constraint against player characters with powerful attacks.

## Key Functions
- `update` (line 31)

## Input Handling
- L111: `if (input.isJustPressed) {`
- L113: `pos.set(input.pos).clamp(0, 99, 0, 99);`
- L116: `if (radius != null && input.isPressed) {`
- L121: `if (radius != null && input.isJustReleased) {`

## Comment Notes
- L19: @type {{ pos: Vector, vel: Vector, radius: number, targetRadius: number, isRed:boolean }[]}
