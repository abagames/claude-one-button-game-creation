# PAIRS DROP (pairs_drop)

- Source: `reference/games/pairs_drop.js`
- Tags: on tapped location:detach, rule:find

## Tag Summaries
- **on tapped location:detach**: Detach or attach a character. Select the connected pins or spaces between the pins, and detach or attach them.
- **rule:find**: Distinguishing the target object. Searching for the target location based on the hints provided.

## Key Functions
- `update` (line 39)
- `fallCards` (line 140)
- `addCards` (line 149)

## Input Handling
- L83: `input.isJustPressed &&`
- L84: `abs(c.pos.x - input.pos.x) < 5 &&`
- L85: `abs(c.pos.y - input.pos.y) < 6`

## Comment Notes
- L30: @type {{pos: Vector, n: number, isOpen: boolean, vy: number}[]}
- L32: @type {Vector}
