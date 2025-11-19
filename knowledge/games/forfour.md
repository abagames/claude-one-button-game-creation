# FORFOUR (forfour)

- Source: `reference/games/forfour.js`
- Tags: rule:match, on_pressed:turn

## Tag Summaries
- **rule:match**: Matching colors, numbers, and shapes. It is necessary to take actions at the appropriate timing and location while observing the arrangement of colors and other elements.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 31)
- `checkConnection` (line 186)
- `checkSize` (line 244)

## Input Handling
- L164: `if (input.isJustPressed) {`

## Comment Notes
- L35: @type {Color[]}
- L37: @type {Color[]}
