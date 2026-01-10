# LIFT UP (lift_up)

- Source: `reference/games/lift_up.js`
- Tags: on_got_item:reverse_state, on_holding:move, field:spike, field:auto_scroll

## Tag Summaries
- **on_got_item:reverse_state**: Invert attributes, status, and direction. Upon acquisition of an item, gravity and orientation may be altered, allowing for transition to an alternate field.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.
- **field:spike**: There are terrains in the game that result in game over upon contact. The player must avoid areas with spikes by jumping or moving to progress.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 71)

## Input Handling
- L90: `pressRatio += ((input.isPressed ? 1 : 0) - pressRatio) * 0.1;`
- L141: `if (input.isJustPressed) {`

## Comment Notes
- L54: @type {{pos: Vector, width: number}[]}
- L58: @type {{pos: Vector, vx: number, ty: number}}
- L61: @type {{pos: Vector, type: "turn" | "bonus"}[]}
