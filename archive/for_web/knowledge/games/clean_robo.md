# CLEAN ROBO (clean_robo)

- Source: `reference/games/clean_robo.js`
- Tags: rule:pass_through_gap, rule:geometry, player:rotate, on_holding:stop, on_holding:move

## Tag Summaries
- **rule:pass_through_gap**: Passing through gaps. Quickly moving the player character to fit through narrow gaps.
- **rule:geometry**: Incorporate the principles of geometry. The player character traces geometric patterns through interactions with the terrain.
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.
- **on_holding:stop**: Halt. The object comes to a complete stop either before making contact with an obstacle or when positioned in a location or direction suitable for attacking enemies.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.

## Key Functions
- `update` (line 27)
- `setWall` (line 112)
- `drawRoom` (line 129)

## Input Handling
- L48: `if (input.isJustPressed) {`
- L51: `if (input.isPressed) {`

## Comment Notes
- L17: @type {{ pos: Vector, angle: number, vx: number, speed: number }}
- L19: @type {{poss: Vector[], dist: number, angle: number}[]}
- L21: @type {Vector}
- L23: @type {Vector}
