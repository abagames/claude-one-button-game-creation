# SCAFFOLD (scaffold)

- Source: `reference/games/scaffold.js`
- Tags: player:scaffold, on_pressed:turn, on_holding:extend, field:auto_scroll

## Tag Summaries
- **player:scaffold**: The player character moves along the scaffolds or terrain. The player creates scaffolding and guides the player character through their actions. The complexity arises from the inability to directly control the player character.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 78)

## Input Handling
- L125: `if (input.isJustReleased) {`
- L135: `if (input.isPressed) {`

## Comment Notes
- L58: @type {{pos: Vector, type: number}[]}
- L60: @type {Vector}
- L65: @type {Vector}
- L67: @type {{ pos: Vector, vy: number, d: number, distance: number, type: "spike" | "gold" }[]}
- L74: @type {Vector}
