# BREED C (breed_c)

- Source: `reference/games/breed_c.js`
- Tags: rule:match, on tapped location:erase

## Tag Summaries
- **rule:match**: Matching colors, numbers, and shapes. It is necessary to take actions at the appropriate timing and location while observing the arrangement of colors and other elements.
- **on tapped location:erase**: Eliminate the character. In some cases, it is possible to only eliminate it if certain conditions are met, such as when the color matches.

## Key Functions
- `update` (line 36)
- `drawGrid` (line 126)
- `addGrid` (line 144)
- `addHorizontal` (line 161)
- `addVertical` (line 185)
- `downHorizontal` (line 209)
- `downVertical` (line 233)
- `checkErasingDown` (line 257)
- `checkErasingUp` (line 286)

## Input Handling
- L48: `floor((input.pos.x - 50) / 6 + gridSize / 2),`
- L49: `floor((input.pos.y - 53) / 6 + gridSize / 2)`
- L76: `if (input.isJustPressed) {`
- L94: `addScore(-tec, input.pos);`
- L99: `addScore(tec * multiplier, input.pos);`

## Comment Notes
- L19: @type {number[][]}
- L21: @type {number[][]}
- L23: @type {boolean[][]}
- L29: @type {number[]}
- L134: @ts-ignore
