# SMOKE G (smoke_g)

- Source: `reference/games/smoke_g.js`
- Tags: weapon:smoke, weapon:auto_aiming, weapon:ray, on_pressed:shoot, field:auto_scroll

## Tag Summaries
- **weapon:smoke**: The effect of smoke that obstructs the line of sight can be observed. It allows the player to create active cover and provides alternative methods of evading attacks besides simply avoiding them.
- **weapon:auto_aiming**: The projectiles are automatically aimed at the direction of the enemy and fired. Understanding the characteristics of the automatically controlled trajectory, such as automatically targeting nearby enemies, is crucial for effective attacks. As the enemy attacks are highly accurate, some countermeasures such as cover are necessary. This mechanism is often used in conjunction with a targeting reticle or aiming line to indicate the attack direction.
- **weapon:ray**: The line indicating the direction of fire is displayed. This is a useful aid for players in cases where there is automatic targeting or when it is difficult to target enemies.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 59)

## Input Handling
- L70: `if (input.isJustPressed && smokes.length < 9) {`
- L74: `target: vec(input.pos).clamp(0, 99, 0, 99),`

## Comment Notes
- L46: @type {{pos: Vector, target: Vector, ticks: number}[]}
- L48: @type {{pos: Vector, radius: number, isExtending: boolean}[]}
- L50: @type {{pos: Vector, angle: number}[]}
- L55: @type {{pos: Vector, angle: number}}
- L135: @ts-ignore
