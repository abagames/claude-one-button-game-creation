# EAROCK (earock)

- Source: `reference/games/earock.js`
- Tags: field:outpost, field:gravity, on_holding:thrust, field:space

## Tag Summaries
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **field:gravity**: Gravity and attraction forces are at work. To avoid being drawn in, one can alter direction or modify attributes of the player character.
- **on_holding:thrust**: Accelerate forward or upward with the player character. By holding the button longer, the player can achieve higher speeds, whereas shorter presses result in lower speeds, allowing for more precise control.
- **field:space**: The cosmos serves as a field. Incorporate the properties of celestial bodies such as planets and meteorites into the game.

## Key Functions
- `update` (line 36)
- `turnTo` (line 146)
- `reflect` (line 157)

## Input Handling
- L63: `if (input.isJustPressed) {`
- L69: `if (input.isPressed) {`
- L75: `if (input.isJustReleased) {`

## Comment Notes
- L26: @type {Vector}
- L28: @type {Vector}
