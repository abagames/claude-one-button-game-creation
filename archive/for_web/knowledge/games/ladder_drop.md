# LADDER DROP (ladder_drop)

- Source: `reference/games/ladder_drop.js`
- Tags: player:automatic, player:scaffold, on_pressed:fall, field:auto_scroll

## Tag Summaries
- **player:automatic**: The player character moves automatically without requiring input. The player character moves automatically along the terrain and avoids enemies on its own.
- **player:scaffold**: The player character moves along the scaffolds or terrain. The player creates scaffolding and guides the player character through their actions. The complexity arises from the inability to directly control the player character.
- **on_pressed:fall**: Drop down, fall. Drop an object to a desired position or avoid obstacles by instantly dropping a jumping character to the ground.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 109)
- `drawPanel` (line 305)
- `addPanel` (line 334)

## Input Handling
- L147: `if (input.isJustPressed) {`

## Comment Notes
- L85: @type {{ pos: Vector, size: Vector, lxs: number[], state: "wait" | "drop" | "fix", hasCoin: boolean }[]}
- L95: @type {{ pos: Vector, vx: -1 | 1, state: "walk" | "up" | "down" | "downWalk" | "drop" }}
- L102: @type {Vector[]}
