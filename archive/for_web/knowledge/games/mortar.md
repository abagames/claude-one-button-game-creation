# MORTAR (mortar)

- Source: `reference/games/mortar.js`
- Tags: player:limited_vision, weapon:explosion, on_holding:adjust_angle, on_released:throw

## Tag Summaries
- **player:limited_vision**: The player's vision is limited. This may be due to the restricted visible area on the screen or the existence of a means to observe off-screen situations. The skill of moving while anticipating situations outside of the field of vision is required.
- **weapon:explosion**: Initiate an explosion. By involving a large number of enemies within the radius of the explosion, one can obtain numerous rewards. Explosions can sometimes trigger chain reactions.
- **on_holding:adjust_angle**: Adjust the direction and distance. While pressing, the angle and distance change, and releasing the button causes firing or movement. It is possible to alter the destination based on the timing of button operations.
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.

## Key Functions
- `update` (line 52)

## Input Handling
- L90: `if (input.isJustReleased || mortar.sightY < -200) {`
- L117: `if (input.isJustPressed) {`

## Comment Notes
- L35: @type {{pos: Vector, vy: number}[]}
- L39: @type {{pos: Vector, vx: number, sightY: number}}
- L41: @type {{pos: Vector, width: number}}
- L43: @type {{pos: Vector, targetRadius: number, radius: number}}
- L49: @type {Vector[]}
