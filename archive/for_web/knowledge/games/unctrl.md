# UNCTRL (unctrl)

- Source: `reference/games/unctrl.js`
- Tags: rule:control_weapons, rule:combo_multiplier, on_holding:rotate

## Tag Summaries
- **rule:control_weapons**: Manipulate weapons. Utilize weapons to aim at enemies and destroy them before their weapons approach.
- **rule:combo_multiplier**: Maintain score bonuses by chaining successes. Successive hits raise a multiplier that resets on mistakes, rewarding streak-based play.
- **on_holding:rotate**: Rotate. Hold the button until the character is facing the appropriate direction.

## Key Functions
- `update` (line 56)
- `setNextShot` (line 161)

## Input Handling
- L73: `if (input.isJustPressed) {`
- L78: `if (input.isJustPressed) {`
- L81: `if (input.isJustReleased) {`
- L84: `shot.vel.y += input.isPressed ? -0.1 : 0.1;`

## Comment Notes
- L43: @type {{pos:Vector, bulletAngle: number, fireTicks: number, animTicks: number}[]}
- L46: @type {{pos:Vector, vel:Vector}[]}
- L48: @type {{pos:Vector, vel:Vector, state: "ready" | "fired"}}
