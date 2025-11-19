# FLIPBOMB (flipbomb)

- Source: `reference/games/flipbomb.js`
- Tags: on_pressed:reverse_state, weapon:explosion, rule:chain, rule:physics, field:outpost

## Tag Summaries
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **weapon:explosion**: Initiate an explosion. By involving a large number of enemies within the radius of the explosion, one can obtain numerous rewards. Explosions can sometimes trigger chain reactions.
- **rule:chain**: An occurrence ensues from a cascading effect. Greater rewards may be garnered through simultaneous annihilation.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 21)

## Input Handling
- L31: `if (input.isJustPressed) {`
- L61: `if (input.isJustPressed) {`

## Comment Notes
- (no comments captured)
