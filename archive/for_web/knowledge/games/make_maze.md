# MAKE MAZE (make_maze)

- Source: `reference/games/make_maze.js`
- Tags: on tapped location:locate, player:automatic, player:scaffold, player:multiple, field:outpost

## Tag Summaries
- **on tapped location:locate**: Arrange characters and relocate them. Control player characters that move automatically based on the placement of terrain. Move objects to predetermined locations.
- **player:automatic**: The player character moves automatically without requiring input. The player character moves automatically along the terrain and avoids enemies on its own.
- **player:scaffold**: The player character moves along the scaffolds or terrain. The player creates scaffolding and guides the player character through their actions. The complexity arises from the inability to directly control the player character.
- **player:multiple**: There exist multiple player characters within the game. Necessitating the simultaneous handling of multiple characters and resulting in increased complexity.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 73)
- `getWall` (line 269)
- `removeGold` (line 277)
- `checkGold` (line 290)
- `checkDownExit` (line 300)

## Input Handling
- L125: `if (input.isPressed) {`
- L126: `const wp = vec(input.pos)`

## Comment Notes
- L42: @type {boolean[][]}
- L45: @type {boolean[][]}
- L48: @type {{ pos: Vector, angle: number, angleVel: number, scPos: Vector, moveInterval: number, ticks: number, isAngry: boolean }[]}
- L56: @type {Vector[]}
