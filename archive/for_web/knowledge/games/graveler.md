# GRAVELER (graveler)

- Source: `reference/games/graveler.js`
- Tags: field:gravity, on_holding:reverse_state, field:auto_scroll

## Tag Summaries
- **field:gravity**: Gravity and attraction forces are at work. To avoid being drawn in, one can alter direction or modify attributes of the player character.
- **on_holding:reverse_state**: Invert attributes and statuses. While holding down the button, a unique state manifests, featuring a reversal of gravity or direction, among other attributes.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 41)

## Input Handling
- L77: `color(input.isPressed ? "purple" : "cyan");`
- L86: `if (input.isPressed) {`
- L93: `grvOfs = wrap(grvOfs + difficulty * (input.isPressed ? 0.25 : -0.16), 0, 10);`
- L125: `if (input.isJustPressed) {`
- L127: `} else if (input.isJustReleased) {`

## Comment Notes
- L24: @type { {pos: Vector, width: number}[]}
- L26: @type { { y: number, vy: number, w: number, wy: number}}
- L34: @type { {pos: Vector, type: "coin" | "spike"}[]}
