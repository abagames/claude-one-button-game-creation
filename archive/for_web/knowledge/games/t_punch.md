# T PUNCH (t_punch)

- Source: `reference/games/t_punch.js`
- Tags: on_pressed:attack, on_holding:rotate, on_holding:extend

## Tag Summaries
- **on_pressed:attack**: Attack by extending the weapon or otherwise. Attack at the moment an enemy enters the attack range.
- **on_holding:rotate**: Rotate. Hold the button until the character is facing the appropriate direction.
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.

## Key Functions
- `update` (line 52)

## Input Handling
- L71: `if (input.isJustPressed) {`
- L80: `if (!input.isPressed || arm.length > 30) {`
- L84: `((input.isPressed ? 36 : 0) - arm.length) * 0.1 * sqrt(difficulty);`
- L85: `if (input.isPressed) {`

## Comment Notes
- L38: @type {{ angle: number, av: number, length: number, targetLength: number, isAttacking: boolean, isAlive: boolean[] }}
- L45: @type {{pos: Vector, vel: Vector}[]}
- L48: @type {{pos: Vector, vel: Vector, ticks: number}[]}
