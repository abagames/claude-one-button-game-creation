# PHOTON LINE (photon_line)

- Source: `reference/games/photon_line.js`
- Tags: rule:match, on_holding:rotate, field:1D

## Tag Summaries
- **rule:match**: Matching colors, numbers, and shapes. It is necessary to take actions at the appropriate timing and location while observing the arrangement of colors and other elements.
- **on_holding:rotate**: Rotate. Hold the button until the character is facing the appropriate direction.
- **field:1D**: The field is confined to one dimension. Restricting character movement to left-right (or up-down) directions only. To ensure a viable game within the limited field, it is necessary to appropriately simplify game rules.

## Key Functions
- `update` (line 100)

## Input Handling
- L306: `if (!player.isRotating && nextStepTicks < 0 && input.isJustPressed) {`
- L314: `if (!input.isPressed) {`

## Comment Notes
- L82: @type {{angle: number, isRotating: boolean, ta: number, hands:number[][] }}
- L84: @type {number[][]}}
- L86: @type {{ x: number, vx: number, index: number, w: number, isReflected: boolean }[]}
