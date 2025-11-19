# ZONE B (zone_b)

- Source: `reference/games/zone_b.js`
- Tags: player:limited_vision, on_holding:shoot, on_pressed:turn

## Tag Summaries
- **player:limited_vision**: The player's vision is limited. This may be due to the restricted visible area on the screen or the existence of a means to observe off-screen situations. The skill of moving while anticipating situations outside of the field of vision is required.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 71)
- `checkCircleReflect` (line 295)

## Input Handling
- L232: `player.speed += ((input.isPressed ? 0 : 0.2) - player.speed) * 0.1;`
- L233: `if (input.isJustReleased) {`
- L240: `if (input.isPressed && player.speed < 0.04) {`

## Comment Notes
- L32: @type {{ pos: Vector, angle: number, speed: number, shotTicks: number, burstTicks: number, burstCount: number turnTicks: number, isReflecting: boolean }[]}
- L41: @type {{pos: Vector, width: number, angle: number}[]}
- L43: @type {{pos: Vector, angle: number, range: number, side: "player" | "enemy"}[]}
- L45: @type {{ pos: Vector, angle: number, speed: number, isReflecting: boolean, shotTicks: number }}
- L55: @type {{pos:Vector, radius: number}}
- L57: @type {{pos:Vector, radius: number}}
- L59: @type {{pos:Vector, radius: number}}
