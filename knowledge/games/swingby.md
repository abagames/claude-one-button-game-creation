# SWINGBY (swingby)

- Source: `reference/games/swingby.js`
- Tags: field:gravity, on_holding:rotate, field:space

## Tag Summaries
- **field:gravity**: Gravity and attraction forces are at work. To avoid being drawn in, one can alter direction or modify attributes of the player character.
- **on_holding:rotate**: Rotate. Hold the button until the character is facing the appropriate direction.
- **field:space**: The cosmos serves as a field. Incorporate the properties of celestial bodies such as planets and meteorites into the game.

## Key Functions
- `update` (line 28)
- `addStar` (line 112)

## Input Handling
- L86: `if (input.isPressed) {`

## Comment Notes
- L17: @type {{pos: Vector, screenPos: Vector, radius: number}[]}
- L19: @type {Vector}
- L21: @type {{pos: Vector, vel: Vector}}
- L25: @type {{pos: Vector, velRatio: number}[]}
