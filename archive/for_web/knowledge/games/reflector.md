# REFLECTOR (reflector)

- Source: `reference/games/reflector.js`
- Tags: weapon:explosion, weapon:interference, player:reciprocate, on_holding:defenseless, weapon:vertical

## Tag Summaries
- **weapon:explosion**: Initiate an explosion. By involving a large number of enemies within the radius of the explosion, one can obtain numerous rewards. Explosions can sometimes trigger chain reactions.
- **weapon:interference**: Interfere with enemy attacks. Timing your own attack to coincide with the enemy's assault.
- **player:reciprocate**: The player character reciprocates horizontally or vertically. This is combined with mechanics that involve player-controlled movement and speed changes.
- **on_holding:defenseless**: The defense diminishes and weakens. While holding down the button, it is possible to launch attacks, but the defense becomes feeble.
- **weapon:vertical**: The projectile is fired in a direction that the player character is not facing, such as vertically. This allows for variations in enemy placement and attack patterns, as it enables attacks on enemies in directions other than the player's forward direction.

## Key Functions
- `update` (line 64)

## Input Handling
- L76: `input.isJustPressed ||`
- L83: `if (input.isPressed) {`
- L88: `ufo.pos.x += ufo.vx * sqrt(difficulty) * (input.isPressed ? 0.5 : 1) * 0.5;`
- L89: `if (!input.isPressed) {`

## Comment Notes
- L48: @type {{pos: Vector, vx: number, angle: number, power: number}}
- L50: @type {{ pos: Vector, vx: number, angle: number, angleVel: number, speed: number fireTicks: number, fireInterval: number, fireSpeed: number }[]}
- L58: @type {{pos: Vector, vel: Vector}[]}
- L60: @type {{pos: Vector, radius: number, ticks: number, duration: number}[]}
