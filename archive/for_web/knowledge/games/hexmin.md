# HEXMIN (hexmin)

- Source: `reference/games/hexmin.js`
- Tags: field:outpost, player:multiple, on_pressed:turn

## Tag Summaries
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **player:multiple**: There exist multiple player characters within the game. Necessitating the simultaneous handling of multiple characters and resulting in increased complexity.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 25)
- `drawHex` (line 100)

## Input Handling
- L35: `if (input.isJustPressed) {`

## Comment Notes
- L16: @type {{value: number}[]}
