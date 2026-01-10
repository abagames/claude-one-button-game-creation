# MOLE N (mole_n)

- Source: `reference/games/mole_n.js`
- Tags: rule:find, on tapped location:select, rule:mathematics

## Tag Summaries
- **rule:find**: Distinguishing the target object. Searching for the target location based on the hints provided.
- **on tapped location:select**: Select a character or an item. Display multiple selectable items or locations on the screen, and choose among them. Arrow button cursor movement and the confirmation button can serve as substitutes.
- **rule:mathematics**: The subject matter pertains to mathematics and numerical elements. It encompasses the tasks of equating numerical values and performing computations involving mathematical expressions.

## Key Functions
- `update` (line 34)
- `existsMole` (line 204)
- `getRandomNumber` (line 217)

## Input Handling
- L67: `if (input.isJustPressed) {`
- L69: `const p = vec(input.pos).sub(1, numbersY).div(11).floor();`

## Comment Notes
- L18: @type {number[][]}
- L23: @type {{pos: Vector, value: number, removeTicks: number, score: number}[]}
