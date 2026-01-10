# SIGHT ON (sight_on)

- Source: `reference/games/sight_on.js`
- Tags: weapon:auto_aiming, weapon:explosion, field:outpost, on_pressed:shoot

## Tag Summaries
- **weapon:auto_aiming**: The projectiles are automatically aimed at the direction of the enemy and fired. Understanding the characteristics of the automatically controlled trajectory, such as automatically targeting nearby enemies, is crucial for effective attacks. As the enemy attacks are highly accurate, some countermeasures such as cover are necessary. This mechanism is often used in conjunction with a targeting reticle or aiming line to indicate the attack direction.
- **weapon:explosion**: Initiate an explosion. By involving a large number of enemies within the radius of the explosion, one can obtain numerous rewards. Explosions can sometimes trigger chain reactions.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.

## Key Functions
- `update` (line 51)

## Input Handling
- L178: `if (input.isJustPressed) {`

## Comment Notes
- L33: @type {{pos: Vector, vel: Vector, sink: Vector, target: any}[]}
- L40: @type {{pos: Vector, vel: Vector}[]}
- L42: @type {{pos: Vector, ticks: number}[]}
- L44: @type {{pos: Vector, vel: Vector}}
- L48: @type {{pos: Vector, color: Color, ticks: number}[]}
- L64: @ts-ignore
- L166: @ts-ignore
- L170: @ts-ignore
