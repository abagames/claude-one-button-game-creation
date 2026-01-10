# BOMB UP (bomb_up)

- Source: `reference/games/bomb_up.js`
- Tags: weapon:blow_off, weapon:explosion, obstacle:well_up, on_pressed:shoot, on_pressed:attack, field:auto_scroll

## Tag Summaries
- **weapon:blow_off**: Propel the character away. By manipulating the character's movement using weapons, effects other than destruction can be achieved.
- **weapon:explosion**: Initiate an explosion. By involving a large number of enemies within the radius of the explosion, one can obtain numerous rewards. Explosions can sometimes trigger chain reactions.
- **obstacle:well_up**: Characters are spawning. Evade or eliminate the characters that emerge from the lower portion and travel towards the upper direction.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **on_pressed:attack**: Attack by extending the weapon or otherwise. Attack at the moment an enemy enters the attack range.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 56)

## Input Handling
- L91: `if (input.isJustPressed) {`

## Comment Notes
- L42: @type {{pos: Vector, vel: Vector}}
- L44: @type {{pos: Vector, vel: Vector}}
- L46: @type {{pos: Vector, ticks: number}}
- L48: @type {{pos: Vector, vel: Vector}[]}
