# HYPER LASER (hyper_laser)

- Source: `reference/games/hyper_laser.js`
- Tags: on_holding:defenseless, on_holding:shoot, weapon:reflect, field:outpost, field:auto_scroll

## Tag Summaries
- **on_holding:defenseless**: The defense diminishes and weakens. While holding down the button, it is possible to launch attacks, but the defense becomes feeble.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.
- **weapon:reflect**: Reflected by walls. The projectile is able to hit enemies who are concealed behind obstacles, allowing for strategic attacks against the enemy's position.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 58)

## Input Handling
- L84: `const sp = input.pos.clamp(1, 99, 1, 99);`
- L87: `if (input.isPressed) {`
- L101: `const x = clamp(input.pos.x, 7, 93);`

## Comment Notes
- L37: @type {{pos: Vector, vel: Vector, ticks: number}[]}
- L39: @type {Vector[]}
- L42: @type {{pos: Vector, angle: number, laserTicks: number, hasShield: boolean}}
- L44: @type {{ pos: Vector, angle: number, targetAngle: number, turretAngle: number, shotAngle: number, burstTicks: number, burstIndex: number, burstCount: number shotTicks: number, shotInterval: number turnTicks: number }[]}
- L53: @type {{pos: Vector, vel: Vector}[]}
- L165: @ts-ignore
