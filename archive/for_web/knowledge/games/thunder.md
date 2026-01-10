# THUNDER (thunder)

- Source: `reference/games/thunder.js`
- Tags: on_pressed:turn, field:weather, rule:proximity_bonus, rule:combo_multiplier

## Tag Summaries
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.
- **field:weather**: Weather and wind are relevant factors. Players can be affected by natural obstacles and the influence of wind-generated phenomena.
- **rule:proximity_bonus**: Proximity to risk yields points. Place bonus items near obstacles and earn points or resources upon approaching obstacles. Utilize as a means to balance risk and reward.
- **rule:combo_multiplier**: Maintain score bonuses by chaining successes. Successive hits raise a multiplier that resets on mistakes, rewarding streak-based play.

## Key Functions
- `update` (line 51)

## Input Handling
- L125: `input.isJustPressed ||`

## Comment Notes
- L37: @type {{ from: Vector, to: Vector, vel: Vector, ticks: number, prevLine: any, isActive: boolean }[]}
- L45: @type {{pos: Vector, vel: Vector}[]}
- L47: @type {{x: number, vx: number}}
