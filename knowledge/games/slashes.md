# SLASHES (slashes)

- Source: `reference/games/slashes.js`
- Tags: rule:proximity_bonus, on_pressed:turn

## Tag Summaries
- **rule:proximity_bonus**: Proximity to risk yields points. Place bonus items near obstacles and earn points or resources upon approaching obstacles. Utilize as a means to balance risk and reward.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 23)

## Input Handling
- L38: `if (input.isJustPressed) {`

## Comment Notes
- L16: @type { {pos: Vector, angle: number, width: number, isAppearing: boolean}[]}
