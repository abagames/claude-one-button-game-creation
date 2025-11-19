# PILEUP (pileup)

- Source: `reference/games/pileup.js`
- Tags: obstacle:stack, obstacle:fall, on sliding:move

## Tag Summaries
- **obstacle:stack**: Stacking occurs. This can restrict the range of movement or lead to game over if it stacks to a certain extent. Therefore, it is necessary to devise ways to stack that can prevent these restrictions.
- **obstacle:fall**: Descend from a height. Avoid or destroy falling obstacles.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.

## Key Functions
- `update` (line 21)

## Input Handling
- L69: `pp.set(clamp(input.pos.x, 0, 99), by);`

## Comment Notes
- (no comments captured)
