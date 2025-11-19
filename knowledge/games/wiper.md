# WIPER (wiper)

- Source: `reference/games/wiper.js`
- Tags: weapon:wipe, on_pressed:reverse_state, obstacle:fall, field:outpost

## Tag Summaries
- **weapon:wipe**: Mow down the enemy. Defeat a large number of enemies at once. By holding down the button, you can adjust the attack range to mow down enemies.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **obstacle:fall**: Descend from a height. Avoid or destroy falling obstacles.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 22)

## Input Handling
- L46: `if (input.isJustPressed) {`

## Comment Notes
- L16: @type {{pos: Vector, size: number}[]}
