# B MATH (b_math)

- Source: `reference/games/b_math.js`
- Tags: rule:mathematics, on tapped location:select, rule:time limit

## Tag Summaries
- **rule:mathematics**: The subject matter pertains to mathematics and numerical elements. It encompasses the tasks of equating numerical values and performing computations involving mathematical expressions.
- **on tapped location:select**: Select a character or an item. Display multiple selectable items or locations on the screen, and choose among them. Arrow button cursor movement and the confirmation button can serve as substitutes.
- **rule:time limit**: Depletion of time and resources leads to the game's termination. Combine with means of restoring time and resources.

## Key Functions
- `update` (line 27)
- `nextQuestion` (line 99)

## Input Handling
- L55: `ansIndex = floor(input.pos.x / 20);`
- L56: `if (input.isJustPressed) {`

## Comment Notes
- L14: @type {number[]}
- L16: @type {"+" | "-" | "X" | "/"}
- L18: @type {number[]}
