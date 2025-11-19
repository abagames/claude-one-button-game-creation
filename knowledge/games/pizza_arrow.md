# PIZZA ARROW (pizza_arrow)

- Source: `reference/games/pizza_arrow.js`
- Tags: on_released:throw, rule:time_manipulation, rule:time_limit

## Tag Summaries
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.
- **rule:time_manipulation**: The flow of time undergoes alterations. Skip periods of time that do not require player interaction, and slow down time during scenes that necessitate intricate maneuvers.
- **rule:time_limit**: Depletion of time and resources leads to the game's termination. Combine with means of restoring time and resources.

## Key Functions
- `update` (line 36)

## Input Handling
- L77: `if (nextPizzaTicks < 0 && arrow == null && input.isPressed) {`
- L90: `if (input.isPressed) {`
- L93: `if (input.isJustReleased || arrow.x > 90) {`

## Comment Notes
- L24: @type {{from: number, to: number, angle: number, angleVel: number, y: number}}
- L26: @type {{from: number, to: number, angle: number, pos: Vector}}
- L28: @type {{x: number, vx: number}}
