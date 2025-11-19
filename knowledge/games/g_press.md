# G PRESS (g_press)

- Source: `reference/games/g_press.js`
- Tags: obstacle:well_up, rule:time_limit, rule:gauge_management, on_pressed:attack

## Tag Summaries
- **obstacle:well_up**: Characters are spawning. Evade or eliminate the characters that emerge from the lower portion and travel towards the upper direction.
- **rule:time_limit**: Depletion of time and resources leads to the game's termination. Combine with means of restoring time and resources.
- **rule:gauge_management**: Manage a rising or falling gauge under pressure. Players monitor a shared meter and take actions to vent or refill it before it reaches a fail threshold.
- **on_pressed:attack**: Attack by extending the weapon or otherwise. Attack at the moment an enemy enters the attack range.

## Key Functions
- `update` (line 29)

## Input Handling
- L57: `if (input.isJustPressed) {`

## Comment Notes
- L15: @type {{y: number, vy: number, width: number, vw: number}}
- L17: @type {{pos: Vector, vel: Vector, size: number}[]}
- L20: @type {{pos: Vector, vel: Vector}[]}
