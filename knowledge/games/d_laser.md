# D LASER (d_laser)

- Source: `reference/games/d_laser.js`
- Tags: rule:shelter, rule:gauge_management, on_pressed:turn, on_holding:stop, field:auto_scroll

## Tag Summaries
- **rule:shelter**: Hiding behind cover. Using cover to avoid attacks that are difficult to evade.
- **rule:gauge_management**: Manage a rising or falling gauge under pressure. Players monitor a shared meter and take actions to vent or refill it before it reaches a fail threshold.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.
- **on_holding:stop**: Halt. The object comes to a complete stop either before making contact with an obstacle or when positioned in a location or direction suitable for attacking enemies.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 51)
- `resetLaser` (line 171)

## Input Handling
- L136: `if (input.isJustPressed) {`
- L141: `if (!input.isPressed) {`

## Comment Notes
- L38: @type {{pos: Vector, isHit: boolean}[]}
- L43: @type {{pos: Vector, tx: number}[]}
- L46: @type {{pos: Vector, vx: -1 | 1, ticks: number, dist: number}}
