# ROLL S (roll_s)

- Source: `reference/games/roll_s.js`
- Tags: on_holding:avoid, on_holding:shoot, on_pressed:turn, field:auto_scroll, field:lanes

## Tag Summaries
- **on_holding:avoid**: Capable of evading enemies and projectiles or traversing through them. By assuming a prone position to evade enemies or navigating through obstacles, alternate evasion strategies can be employed in addition to movement.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.
- **field:lanes**: The character moves on multiple lanes. Avoiding obstacles that flow down the lanes by moving the lanes at the right timing.

## Key Functions
- `update` (line 82)

## Input Handling
- L96: `if (input.isJustReleased) {`
- L105: `if (input.isPressed) {`

## Comment Notes
- L69: @type {{pos: Vector, angle: number, va: number, ticks: number, fireTicks: number}}
- L71: @type {{pos: Vector, vel: Vector}[]}
- L73: @type {{pos: Vector, vel: Vector, angle: number, ticks: number, fireTicks: number}[]}
- L76: @type {{pos: Vector, vel: Vector}[]}
