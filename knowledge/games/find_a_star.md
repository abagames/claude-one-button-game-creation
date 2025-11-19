# FIND A STAR (find_a_star)

- Source: `reference/games/find_a_star.js`
- Tags: rule:find, on tapped location:select

## Tag Summaries
- **rule:find**: Distinguishing the target object. Searching for the target location based on the hints provided.
- **on tapped location:select**: Select a character or an item. Display multiple selectable items or locations on the screen, and choose among them. Arrow button cursor movement and the confirmation button can serve as substitutes.

## Key Functions
- `update` (line 49)

## Input Handling
- L56: `const ibx = floor((input.pos.x - boxLeftX + 3) / 6);`
- L57: `if (input.isJustPressed && ibx >= 0 && ibx < boxCount) {`
- L81: `} else if (input.isJustPressed && ibx >= 0 && ibx < boxCount) {`

## Comment Notes
- L42: @type { {y: number, sx: number, isOpened: boolean[]}[] }
- L45: @type { {pos: Vector, vy: number, angle: number, score: number}[] }
