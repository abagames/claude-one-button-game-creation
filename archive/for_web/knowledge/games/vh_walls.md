# VH WALLS (vh_walls)

- Source: `reference/games/vh_walls.js`
- Tags: player:reflect, on tapped location:locate, field:outpost

## Tag Summaries
- **player:reflect**: The player character reflects upon colliding with a wall or object. To anticipate the movement of the reflection, actions such as positioning walls should be taken.
- **on tapped location:locate**: Arrange characters and relocate them. Control player characters that move automatically based on the placement of terrain. Move objects to predetermined locations.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 36)
- `setTarget` (line 117)

## Input Handling
- L56: `if (input.isJustPressed && input.pos.isInRect(1, 1, 98, 98)) {`
- L59: `pos: vec(input.pos),`

## Comment Notes
- L28: @type {{pos: Vector, angle: number, isFixed: boolean}[]}
- L31: @type {{pos: Vector, vel: Vector}}
- L33: @type {{pos: Vector, size: number, initTicks: number}}
- L85: @ts-ignore
