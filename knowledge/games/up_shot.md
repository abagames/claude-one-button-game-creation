# UP SHOT (up_shot)

- Source: `reference/games/up_shot.js`
- Tags: weapon:vertical, on_holding:stop, on_holding:shoot, obstacle:fall, field:auto_scroll

## Tag Summaries
- **weapon:vertical**: The projectile is fired in a direction that the player character is not facing, such as vertically. This allows for variations in enemy placement and attack patterns, as it enables attacks on enemies in directions other than the player's forward direction.
- **on_holding:stop**: Halt. The object comes to a complete stop either before making contact with an obstacle or when positioned in a location or direction suitable for attacking enemies.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.
- **obstacle:fall**: Descend from a height. Avoid or destroy falling obstacles.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 51)

## Input Handling
- L71: `if (input.isPressed) {`
- L72: `if (input.isJustPressed) {`
- L81: `} else if (input.isJustReleased) {`
- L152: `input.isPressed ? "b" : addWithCharCode("a", floor(ticks / 20) % 2),`

## Comment Notes
- L34: @type {{ x: number, size: number, speed: number, interval: number, intervalVariation: number, ticks: number }[]}
- L42: @type {{pos: Vector, vy: number, size: number, speed: number}[]}
- L44: @type {{pos: Vector, vx: number, shotTicks: number}}
- L46: @type {{pos: Vector, vy: number}[]}
