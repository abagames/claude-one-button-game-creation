# SQUARE BAR (square_bar)

- Source: `reference/games/square_bar.js`
- Tags: rule:geometry, player:bar, player:rotate, on_holding:extend, on_holding:move

## Tag Summaries
- **rule:geometry**: Incorporate the principles of geometry. The player character traces geometric patterns through interactions with the terrain.
- **player:bar**: The player character  has a rod-shaped form. When combined with rotational motion, it adds complexity to movements such as dodging obstacles and maneuvering.
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.

## Key Functions
- `update` (line 36)
- `addItem` (line 199)

## Input Handling
- L71: `if (input.isJustPressed) {`
- L76: `if (input.isPressed) {`

## Comment Notes
- L17: @type {{ pos: Vector, length: number, spRatio: number, angle: number, tAngle: number, type: "player" | "enemy" }[]}
- L24: @type {{pos: Vector, type: "spike" | "gold", ticks: number, size: number}[]}
