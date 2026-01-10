# GRENADIER (grenadier)

- Source: `reference/games/grenadier.js`
- Tags: weapon:change_field, field:holes, weapon:artillery, on_holding:adjust_angle, on_released:throw, field:1D, field:auto_scroll

## Tag Summaries
- **weapon:change_field**: Alter the terrain. The game can incorporate mechanisms that create advantages and disadvantages for players, such as creating holes in the terrain for escape routes via attacks or generating spikes through attacks.
- **field:holes**: There are holes in the ground. To avoid falling into them, it is necessary to move and jump carefully. It is also possible to utilize the holes by hiding in them to evade enemy attacks.
- **weapon:artillery**: The object follows a parabolic trajectory due to the effect of gravity. It is often used in combination with the adjustment of the launch angle. Skill is required to successfully hit the intended target.
- **on_holding:adjust_angle**: Adjust the direction and distance. While pressing, the angle and distance change, and releasing the button causes firing or movement. It is possible to alter the destination based on the timing of button operations.
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.
- **field:1D**: The field is confined to one dimension. Restricting character movement to left-right (or up-down) directions only. To ensure a viable game within the limited field, it is necessary to appropriately simplify game rules.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 78)

## Input Handling
- L168: `if (input.isJustPressed) {`
- L192: `} else if (input.isJustPressed) {`
- L199: `if (input.isJustReleased || pAngle < -1) {`

## Comment Notes
- L63: @type { {x: number}[] }
- L65: @type { {x: number, vx: number, fireTicks: number, fireInterval: number, fireSpeed: number}[] }
- L68: @type { {x: number, vx: number}[] }
- L71: @type { "in_hole" | "throwing" | "running"}
- L74: @type { {pos: Vector, vel: Vector}[] }
