# LINE B (line_b)

- Source: `reference/games/line_b.js`
- Tags: player:reflect, on_pressed:attack, field:outpost

## Tag Summaries
- **player:reflect**: The player character reflects upon colliding with a wall or object. To anticipate the movement of the reflection, actions such as positioning walls should be taken.
- **on_pressed:attack**: Attack by extending the weapon or otherwise. Attack at the moment an enemy enters the attack range.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 23)

## Input Handling
- L64: `if (input.isJustPressed) {`

## Comment Notes
- L16: @type {{pos: Vector, vel: Vector}[]}
- L18: @type {{p1: Vector, p2: Vector}[]}
- L20: @type {{pos: Vector, radius: number}}
