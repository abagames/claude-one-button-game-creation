# M FIELD (m_field)

- Source: `reference/games/m_field.js`
- Tags: weapon:time_limit, weapon:explosion, rule:chain, rule:combo_multiplier, rule:friendly_fire, on_pressed:jump, player:step_on, field:auto_scroll

## Tag Summaries
- **weapon:time_limit**: It detonates after a set period of time. It is important to anticipate enemy movements or lure them into the explosion. It is often used in conjunction with chain explosions.
- **weapon:explosion**: Initiate an explosion. By involving a large number of enemies within the radius of the explosion, one can obtain numerous rewards. Explosions can sometimes trigger chain reactions.
- **rule:chain**: An occurrence ensues from a cascading effect. Greater rewards may be garnered through simultaneous annihilation.
- **rule:combo_multiplier**: Maintain score bonuses by chaining successes. Successive hits raise a multiplier that resets on mistakes, rewarding streak-based play.
- **rule:friendly_fire**: Even allies can be hit by weapons. Avoid entering the attack range of your own weapon and aim for the enemies to engage in friendly fire.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **player:step_on**: The player character can stomp on enemies. Providing a reward for the risk of timing a jump to stomp on an enemy from above can be implemented.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 63)
- `explode` (line 195)

## Input Handling
- L123: `((input.isPressed ? 1 : 0.3) * sqrt(difficulty) - player.vel.x) * 0.1;`
- L125: `player.vel.y += (input.isPressed ? 0.05 : 0.1) * difficulty;`
- L132: `if (player.jumpCount < 2 && input.isJustPressed) {`

## Comment Notes
- L50: @type {{x: number, ticks: number, isBlinking: boolean}[]}
- L53: @type {{x: number, ticks: number}[]}
- L55: @type {{x: number, vx: number}[]}
- L58: @type {{pos: Vector, vel: Vector, jumpCount: number}}
