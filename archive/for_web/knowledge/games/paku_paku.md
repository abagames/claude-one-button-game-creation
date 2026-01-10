# PAKU PAKU (paku_paku)

- Source: `reference/games/paku_paku.js`
- Tags: field:1D, on_got_item:power_up, obstacle:chase, on_pressed:turn

## Tag Summaries
- **field:1D**: The field is confined to one dimension. Restricting character movement to left-right (or up-down) directions only. To ensure a viable game within the limited field, it is necessary to appropriately simplify game rules.
- **on_got_item:power_up**: Upgrade and gain power. Enable the capability to counterattack enemies.
- **obstacle:chase**: Pursue the player character. Evade by skillful guidance.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 84)
- `addDots` (line 185)

## Input Handling
- L95: `if (input.isJustPressed) {`

## Comment Notes
- L74: @type {{x: number, vx: number}}
- L76: @type {{x: number, eyeVx: number}}
- L78: @type {{x: number, isPower: boolean}[]}
- L112: @ts-ignore
- L162: @ts-ignore
