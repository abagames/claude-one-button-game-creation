# D FIGHT (d_fight)

- Source: `reference/games/d_fight.js`
- Tags: rule:shelter, weapon:auto aiming, weapon:ray, player:automatic, player:multiple, on sliding:move

## Tag Summaries
- **rule:shelter**: Hiding behind cover. Using cover to avoid attacks that are difficult to evade.
- **weapon:auto aiming**: The projectiles are automatically aimed at the direction of the enemy and fired. Understanding the characteristics of the automatically controlled trajectory, such as automatically targeting nearby enemies, is crucial for effective attacks. As the enemy attacks are highly accurate, some countermeasures such as cover are necessary. This mechanism is often used in conjunction with a targeting reticle or aiming line to indicate the attack direction.
- **weapon:ray**: The line indicating the direction of fire is displayed. This is a useful aid for players in cases where there is automatic targeting or when it is difficult to target enemies.
- **player:automatic**: The player character moves automatically without requiring input. The player character moves automatically along the terrain and avoids enemies on its own.
- **player:multiple**: There exist multiple player characters within the game. Necessitating the simultaneous handling of multiple characters and resulting in increased complexity.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.

## Key Functions
- `update` (line 66)
- `addAgent` (line 235)
- `getNearest` (line 251)

## Input Handling
- L122: `a.pos.x += (clamp(input.pos.x, 3, 197) - a.pos.x) * 0.2;`

## Comment Notes
- L47: @type {{x: number}[]}
- L50: @type {{ pos: Vector, vel: Vector, target: any, targetDistance: number, aimLength: number, fireLength: number, moveTicks: number, mirrorX: 1 | -1, type: "player" | "ally" | "enemy", isAlive: boolean }[]}
