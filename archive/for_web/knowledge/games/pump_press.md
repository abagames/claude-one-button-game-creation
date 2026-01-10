# PUMP PRESS (pump_press)

- Source: `reference/games/pump_press.js`
- Tags: weapon:disablement, field:1D, rule:chain, on_pressed:shoot, field:auto_scroll

## Tag Summaries
- **weapon:disablement**: Disable the enemy upon impact. This allows for various tactics such as dodging by disabling the enemy, or defeating the disabled enemy by other means.
- **field:1D**: The field is confined to one dimension. Restricting character movement to left-right (or up-down) directions only. To ensure a viable game within the limited field, it is necessary to appropriately simplify game rules.
- **rule:chain**: An occurrence ensues from a cascading effect. Greater rewards may be garnered through simultaneous annihilation.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 57)

## Input Handling
- L76: `shipSpeed += ((input.isPressed ? 1 : 0.5) - shipSpeed) * 0.1;`
- L77: `if (input.isPressed) {`
- L86: `if (shotX == null && input.isJustPressed) {`

## Comment Notes
- L40: @type {{ x: number, vx: number, size: number, isPressed: boolean, pressedOfs: Vector }[]}
