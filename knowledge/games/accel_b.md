# ACCEL B (accel_b)

- Source: `reference/games/accel_b.js`
- Tags: weapon:chase, on_pressed:shoot, rule:combo_multiplier, on_holding:move, field:auto_scroll

## Tag Summaries
- **weapon:chase**: Tracking enemies. The player can hit enemies without aiming directly at them, reducing their burden. However, this can be offset by increasing the number of enemies or other challenges to the player.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **rule:combo_multiplier**: Maintain score bonuses by chaining successes. Successive hits raise a multiplier that resets on mistakes, rewarding streak-based play.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 56)

## Input Handling
- L92: `((input.isPressed ? 2 : 0.2) * sqrt(difficulty) - player.vx) * 0.2;`
- L101: `if (input.isJustPressed) {`

## Comment Notes
- L28: @type {{pos: Vector, vx: number}}
- L30: @type {{ pos: Vector, vel: Vector, target: Vector, ticks: number, exTicks: number, smokeTicks: number, }[]}
- L37: @type {{ pos: Vector, vx: number, ma: number, fireTicks: number }[]}
- L44: @type {{ pos: Vector, angle: number, va: number, speed: number, smokeTicks: number, }[]}
- L50: @type {{pos: Vector, vel: Vector, ticks: number, isEnemy: boolean}[]}
- L52: @type {{pos: Vector, size: Vector}[]}
