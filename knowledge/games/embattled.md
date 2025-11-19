# EMBATTLED (embattled)

- Source: `reference/games/embattled.js`
- Tags: on_holding:defend, rule:friendly_fire, player:reciprocate, on_pressed:turn

## Tag Summaries
- **on_holding:defend**: Entering a defensive stance. While maintaining pressure, there are trade-offs such as immunity to incoming attacks but loss of mobility.
- **rule:friendly_fire**: Even allies can be hit by weapons. Avoid entering the attack range of your own weapon and aim for the enemies to engage in friendly fire.
- **player:reciprocate**: The player character reciprocates horizontally or vertically. This is combined with mechanics that involve player-controlled movement and speed changes.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 52)

## Input Handling
- L63: `input.isJustPressed ||`
- L71: `if (input.isPressed) {`

## Comment Notes
- L33: @type {{ pos: Vector, angle: number, speed: number, turretAngle: number, targetPos: Vector, fireTicks: number, fireInterval: number, side: number }[]}
- L44: @type {{pos: Vector, vel: Vector, side: number}[]}
- L46: @type {{pos: Vector, vy: number, pressedTicks: number}}
- L82: @ts-ignore
