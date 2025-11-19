# BAMBOO (bamboo)

- Source: `reference/games/bamboo.js`
- Tags: on_holding:avoid, player:reflect, field:1D, obstacle:well_up

## Tag Summaries
- **on_holding:avoid**: Capable of evading enemies and projectiles or traversing through them. By assuming a prone position to evade enemies or navigating through obstacles, alternate evasion strategies can be employed in addition to movement.
- **player:reflect**: The player character reflects upon colliding with a wall or object. To anticipate the movement of the reflection, actions such as positioning walls should be taken.
- **field:1D**: The field is confined to one dimension. Restricting character movement to left-right (or up-down) directions only. To ensure a viable game within the limited field, it is necessary to appropriately simplify game rules.
- **obstacle:well_up**: Characters are spawning. Evade or eliminate the characters that emerge from the lower portion and travel towards the upper direction.

## Key Functions
- `update` (line 43)

## Input Handling
- L54: `if (input.isJustPressed) {`
- L62: `input.isPressed ? "b" : addWithCharCode("a", floor(animTicks / 20) % 2),`
- L108: `if ((c.a || c.b) && !input.isPressed) {`

## Comment Notes
- L34: @type {{x: number, height: number, speed: number}[]}
