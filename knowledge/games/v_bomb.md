# V BOMB (v_bomb)

- Source: `reference/games/v_bomb.js`
- Tags: weapon:time_limit, rule:friendly_fire, on_pressed:turn

## Tag Summaries
- **weapon:time_limit**: It detonates after a set period of time. It is important to anticipate enemy movements or lure them into the explosion. It is often used in conjunction with chain explosions.
- **rule:friendly_fire**: Even allies can be hit by weapons. Avoid entering the attack range of your own weapon and aim for the enemies to engage in friendly fire.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 47)

## Input Handling
- L150: `input.isJustPressed ||`

## Comment Notes
- L36: @type {{pos: Vector, vx: number, targetVx: number}}
- L38: @type {{pos: Vector, vel: Vector, bombTicks: number}[]}
- L41: @type {{pos: Vector, count: number, vy: number}[]}
- L43: @type {{pos: Vector, height: number}[]}
