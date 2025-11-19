# REGENE (regene)

- Source: `reference/games/regene.js`
- Tags: field:regenerate, on tapped location:erase, player:reflect, on got item:spawn

## Tag Summaries
- **field:regenerate**: The terrain undergoes regeneration. One must skillfully avoid the regenerated topography.
- **on tapped location:erase**: Eliminate the character. In some cases, it is possible to only eliminate it if certain conditions are met, such as when the color matches.
- **player:reflect**: The player character reflects upon colliding with a wall or object. To anticipate the movement of the reflection, actions such as positioning walls should be taken.
- **on got item:spawn**: Spawn a character. The player character increases in number or size.

## Key Functions
- `update` (line 25)

## Input Handling
- L46: `const ip = input.pos.clamp(0, 99, 0, 99);`

## Comment Notes
- L16: @type {{pos:Vector, isBall: boolean}[]}
- L18: @type {Vector[]}
- L22: @type {{pos:Vector, vel: Vector, hitCount: number}[]}}
