# FOOT LASER (foot_laser)

- Source: `reference/games/foot_laser.js`
- Tags: on_pressed:jump, weapon:vertical, on_pressed:fall

## Tag Summaries
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **weapon:vertical**: The projectile is fired in a direction that the player character is not facing, such as vertically. This allows for variations in enemy placement and attack patterns, as it enables attacks on enemies in directions other than the player's forward direction.
- **on_pressed:fall**: Drop down, fall. Drop an object to a desired position or avoid obstacles by instantly dropping a jumping character to the ground.

## Key Functions
- `update` (line 83)

## Input Handling
- L111: `player.vy += (input.isPressed ? 0.1 : 0.3) * df;`
- L126: `if (input.isJustPressed) {`

## Comment Notes
- L68: @type {{ pos: Vector, vy: number, jumpCount: number, isOnFloor: boolean, multiplier: number, shots: Vector[], nextShotTicks: number }}
- L75: @type {{ pos: Vector, vx: number, isFlying: boolean }[]}
