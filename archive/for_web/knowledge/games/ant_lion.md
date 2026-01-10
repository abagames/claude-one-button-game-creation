# ANT LION (ant_lion)

- Source: `reference/games/ant_lion.js`
- Tags: field:gravity, field:rotate, on_holding:move

## Tag Summaries
- **field:gravity**: Gravity and attraction forces are at work. To avoid being drawn in, one can alter direction or modify attributes of the player character.
- **field:rotate**: The field is in a state of rotation. To add variety to the player character's movement, besides left and right, and to create a cyclical field.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.

## Key Functions
- `update` (line 24)

## Input Handling
- L49: `if (input.isPressed) {`
- L54: `ant.av += ((input.isPressed ? 1 : -1) * 0.02 * difficulty - ant.av) * 0.1;`

## Comment Notes
- L15: @type {{angle: number, av: number, dist: number, bar: any, barLength: number, ticks: number}}
- L17: @type {{angle: number, av: number, length: number, dist: number, speed: number}[]}
