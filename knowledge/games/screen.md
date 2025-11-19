# SCREEN (screen)

- Source: `reference/games/screen.js`
- Tags: player:inverted, on_pressed:shoot, weapon:ray, field:outpost

## Tag Summaries
- **player:inverted**: The player character exists in a reversed state. There are multiple fields where the player character can move between, or in each field, there may be multiple player characters present. The player must be attentive to multiple fields simultaneously.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **weapon:ray**: The line indicating the direction of fire is displayed. This is a useful aid for players in cases where there is automatic targeting or when it is difficult to target enemies.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 55)

## Input Handling
- L71: `input.isJustPressed`

## Comment Notes
- L46: @type {{pos: Vector, vy: number}[]}
- L49: @type {{pos: Vector, tx: number, angle: number, shotCount: number}}
- L51: @type {{pos: Vector, angle: number, speed: number}[]}
