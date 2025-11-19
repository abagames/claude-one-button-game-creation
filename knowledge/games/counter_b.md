# COUNTER B (counter_b)

- Source: `reference/games/counter_b.js`
- Tags: rule:combo_multiplier, weapon:interference, on_holding:shoot, field:auto_scroll

## Tag Summaries
- **rule:combo_multiplier**: Maintain score bonuses by chaining successes. Successive hits raise a multiplier that resets on mistakes, rewarding streak-based play.
- **weapon:interference**: Interfere with enemy attacks. Timing your own attack to coincide with the enemy's assault.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 32)

## Input Handling
- L63: `((input.isPressed ? 0.2 : 2) * sqrt(sqrt(difficulty)) - player.speed) * 0.2;`
- L66: `if (input.isPressed) {`
- L101: `counter.radius + (input.isPressed ? 1 : -2) * sqrt(difficulty),`

## Comment Notes
- L17: @type {{pos: Vector, angle: number, speed: number, beamLength: number}[]}
- L20: @type {{ pos: Vector, speed: number, beamLength: number, baseX: number, invincibleTicks: number }}
- L27: @type {{pos: Vector, radius: number, enemy: any}}
