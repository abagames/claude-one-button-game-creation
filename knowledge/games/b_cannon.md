# B CANNON (b_cannon)

- Source: `reference/games/b_cannon.js`
- Tags: weapon:auto_aiming, obstacle:split, on_pressed:turn, on_holding:shoot

## Tag Summaries
- **weapon:auto_aiming**: The projectiles are automatically aimed at the direction of the enemy and fired. Understanding the characteristics of the automatically controlled trajectory, such as automatically targeting nearby enemies, is crucial for effective attacks. As the enemy attacks are highly accurate, some countermeasures such as cover are necessary. This mechanism is often used in conjunction with a targeting reticle or aiming line to indicate the attack direction.
- **obstacle:split**: Splitting occurs. It can occur through attacks or over time, leading to an increase in complexity. It is essential to select appropriate actions such as destruction of obstacles before the split occurs.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.

## Key Functions
- `update` (line 51)

## Input Handling
- L170: `if (input.isJustPressed) {`
- L174: `if (input.isPressed) {`

## Comment Notes
- L39: @type {{pos: Vector, vel: Vector, radius: number, invincibleTIcks: number}[]}
- L45: @type {{from: Vector, angle: number, length: number}}
- L47: @type {{x: number, angle: number, vx: -1 | 1, stopTicks: number, pos:Vector}}
- L161: @ts-ignore
- L164: @ts-ignore
- L208: @ts-ignore
