# T HANOI (t_hanoi)

- Source: `reference/games/t_hanoi.js`
- Tags: on tapped location:locate, obstacle:stack

## Tag Summaries
- **on tapped location:locate**: Arrange characters and relocate them. Control player characters that move automatically based on the placement of terrain. Move objects to predetermined locations.
- **obstacle:stack**: Stacking occurs. This can restrict the range of movement or lead to game over if it stacks to a certain extent. Therefore, it is necessary to devise ways to stack that can prevent these restrictions.

## Key Functions
- `update` (line 29)

## Input Handling
- L48: `if (input.isJustPressed) {`
- L49: `const i = clamp(floor(input.pos.x / (100 / barCount)), 0, barCount);`
- L78: `if (input.isPressed) {`
- L80: `const i = clamp(floor(input.pos.x / (100 / barCount)), 0, barCount);`

## Comment Notes
- L19: @type {{disks: number[], height: number}[]}
