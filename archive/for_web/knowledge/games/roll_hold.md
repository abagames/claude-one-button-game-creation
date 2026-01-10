# ROLL HOLD (roll_hold)

- Source: `reference/games/roll_hold.js`
- Tags: player:rotate, on_holding:stop, on_holding:shoot

## Tag Summaries
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.
- **on_holding:stop**: Halt. The object comes to a complete stop either before making contact with an obstacle or when positioned in a location or direction suitable for attacking enemies.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.

## Key Functions
- `update` (line 65)
- `setNextEnemy` (line 195)

## Input Handling
- L103: `if (input.isJustPressed) {`
- L110: `if (!input.isPressed) {`

## Comment Notes
- L50: @type {{pos: Vector, angle: number}[]}
- L53: @type {{pos: Vector, vx: number, score: number, isFired: boolean}[]}
- L55: @type {{pos: Vector, vx: number}}
- L58: @type {{pos: Vector, vel: Vector}[]}
- L60: @type {{pos: Vector, size: Vector}[]}
