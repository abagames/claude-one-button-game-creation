# TWO FACED (two_faced)

- Source: `reference/games/two_faced.js`
- Tags: field:multiple, player:follow, player:inverted, on_got_item:spawn, player:rotate, on_holding:stop, on_holding:move

## Tag Summaries
- **field:multiple**: Multiple fields are displayed simultaneously. It is necessary to grasp the states of multiple fields simultaneously, and the game becomes complex.
- **player:follow**: To follow the player character. To increase the reward by attracting many characters. As a tradeoff, the risk of increasing collision detection arises.
- **player:inverted**: The player character exists in a reversed state. There are multiple fields where the player character can move between, or in each field, there may be multiple player characters present. The player must be attentive to multiple fields simultaneously.
- **on_got_item:spawn**: Spawn a character. The player character increases in number or size.
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.
- **on_holding:stop**: Halt. The object comes to a complete stop either before making contact with an obstacle or when positioned in a location or direction suitable for attacking enemies.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.

## Key Functions
- `update` (line 42)
- `getItem` (line 172)
- `checkSide` (line 185)

## Input Handling
- L59: `if (input.isJustPressed) {`
- L64: `if (input.isPressed) {`

## Comment Notes
- L27: @type {{ pos: Vector, side: number, angle: number, av: number, speed: number, baseSpeed: number }}
- L34: @type {{pos: Vector, side: number, angle: number}[]}
- L38: @type {{pos: Vector, side: number, angle: number}}
