# PORTAL J (portal_j)

- Source: `reference/games/portal_j.js`
- Tags: on_pressed:jump_into_another, field:holes, field:1D

## Tag Summaries
- **on_pressed:jump_into_another**: Leap to the next waypoint. Teleport instantly. The next waypoint is marked by a pin, so the player must assess whether it is safe to move there and then execute the teleportation with precision timing.
- **field:holes**: There are holes in the ground. To avoid falling into them, it is necessary to move and jump carefully. It is also possible to utilize the holes by hiding in them to evade enemy attacks.
- **field:1D**: The field is confined to one dimension. Restricting character movement to left-right (or up-down) directions only. To ensure a viable game within the limited field, it is necessary to appropriately simplify game rules.

## Key Functions
- `update` (line 30)

## Input Handling
- L112: `if (input.isJustPressed) {`

## Comment Notes
- L20: @type {{x: number, vx: number, width: number}[]}
- L24: @type {{x: number}[]}
