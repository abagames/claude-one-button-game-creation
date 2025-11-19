# LASER FORTRESS (laser_fortress)

- Source: `reference/games/laser_fortress.js`
- Tags: weapon:wipe, on_holding:shoot, obstacle:penalty, rule:classify, field:1D, field:outpost

## Tag Summaries
- **weapon:wipe**: Mow down the enemy. Defeat a large number of enemies at once. By holding down the button, you can adjust the attack range to mow down enemies.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.
- **obstacle:penalty**: There are objects interspersed that incur penalties upon contact or destruction. To avoid incurring penalties, it is necessary to deftly avoid the characters that are subject to penalty when launching an attack. This acts as a constraint against player characters with powerful attacks.
- **rule:classify**: Classifying characters. Taking appropriate actions while confirming the classification of each character.
- **field:1D**: The field is confined to one dimension. Restricting character movement to left-right (or up-down) directions only. To ensure a viable game within the limited field, it is necessary to appropriately simplify game rules.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 73)

## Input Handling
- L89: `if (input.isJustPressed) {`
- L96: `if (laserX != null && input.isPressed) {`

## Comment Notes
- L62: @type {{x: number, vx: number, ticks: number, type: "ally" | "enemy"}[]}
- L66: @type {"ally" | "enemy"}
