# COLOR ROLL (color_roll)

- Source: `reference/games/color_roll.js`
- Tags: on_pressed:pierce, rule:match

## Tag Summaries
- **on_pressed:pierce**: Pierce through in a group. Matching colors or other criteria before piercing can yield significant rewards.
- **rule:match**: Matching colors, numbers, and shapes. It is necessary to take actions at the appropriate timing and location while observing the arrangement of colors and other elements.

## Key Functions
- `update` (line 28)
- `addLane` (line 121)
- `addBars` (line 138)

## Input Handling
- L45: `if (input.isJustPressed) {`

## Comment Notes
- L16: @type {{x: number, y: number, vx: number, bars: {width: number, color: Color}[]}[]}
