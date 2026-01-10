# CATE P (cate_p)

- Source: `reference/games/cate_p.js`
- Tags: on_pressed:turn, on_pressed:shoot

## Tag Summaries
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.

## Key Functions
- `update` (line 64)

## Input Handling
- L77: `if ((ticks && input.isJustPressed) || !player.pos.isInRect(9, 9, 82, 82)) {`
- L78: `if (shot == null && input.isJustPressed) {`

## Comment Notes
- L41: @type { {pos: Vector, angle: number, speed: number, ticks: number, isAppearing}[] }
- L43: @type { {pos: Vector, angle: number, speed: number, ticks: number, count: number} }
- L45: @type { {pos: Vector, angle: number, speed: number, ticks: number, isAppearing} }
- L48: @type { {pos: Vector, angle: number } }
- L50: @type { {pos: Vector, angle: number, multiplier: number } }
