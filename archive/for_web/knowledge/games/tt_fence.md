# TT FENCE (tt_fence)

- Source: `reference/games/tt_fence.js`
- Tags: rule:surround, player:bar

## Tag Summaries
- **rule:surround**: Enclosing with characters. Creating enclosed spaces with blocks or strings. Additional rules such as aiming to enclose specific areas or enclosing large areas to earn more rewards can be considered.
- **player:bar**: The player character  has a rod-shaped form. When combined with rotational motion, it adds complexity to movements such as dodging obstacles and maneuvering.

## Key Functions
- `update` (line 52)
- `setBlock` (line 142)
- `checkBlock` (line 168)
- `checkBlockInGrid` (line 179)
- `checkBomb` (line 190)
- `fillBombDown` (line 207)
- `fillBombUp` (line 231)
- `bomb` (line 255)
- `addAngle` (line 315)
- `canPlaceGrid` (line 320)
- `existsGrid` (line 327)
- `drawGrid` (line 334)

## Input Handling
- L85: `if (input.isJustPressed) {`

## Comment Notes
- L16: @type {boolean[][]}
- L18: @type {boolean[][]}
- L20: @type {boolean[][]}
- L22: @type {boolean[][]}
- L24: @type {{pos: Vector, type: number, angle: number}}
