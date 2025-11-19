# R WHEEL (r_wheel)

- Source: `reference/games/r_wheel.js`
- Tags: weapon:change_field, weapon:vertical, field:spike, field:rotate, on_pressed:jump, on_pressed:shoot, on_got_item:power_up

## Tag Summaries
- **weapon:change_field**: Alter the terrain. The game can incorporate mechanisms that create advantages and disadvantages for players, such as creating holes in the terrain for escape routes via attacks or generating spikes through attacks.
- **weapon:vertical**: The projectile is fired in a direction that the player character is not facing, such as vertically. This allows for variations in enemy placement and attack patterns, as it enables attacks on enemies in directions other than the player's forward direction.
- **field:spike**: There are terrains in the game that result in game over upon contact. The player must avoid areas with spikes by jumping or moving to progress.
- **field:rotate**: The field is in a state of rotation. To add variety to the player character's movement, besides left and right, and to create a cyclical field.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **on_got_item:power_up**: Upgrade and gain power. Enable the capability to counterattack enemies.

## Key Functions
- `update` (line 54)
- `addBonus` (line 187)

## Input Handling
- L67: `if (input.isJustPressed) {`
- L81: `player.vy += (input.isPressed ? 1 : 3) * 0.03 * difficulty;`

## Comment Notes
- L40: @type {{height: number, isHit: boolean}[]}
- L43: @type {{angle: number, radius: number}[]}
- L45: @type {{y: number, vy: number}}
- L47: @type {{pos: Vector, width: number, isSpike: boolean}[]}
