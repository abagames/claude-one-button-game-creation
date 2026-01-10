# BS FISH (bs_fish)

- Source: `reference/games/bs_fish.js`
- Tags: field:water, on_holding:move, field:auto_scroll

## Tag Summaries
- **field:water**: The surface and the depths of water serve as the field. Various conditions can be created such as alterations in movement between the surface and air, changes in the surface due to the wind, and the opaque nature of the underwater environment.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 47)

## Input Handling
- L56: `if (input.isJustPressed) {`
- L60: `bird.vx += ((input.isPressed ? 3 * sqrt(difficulty) : 0.1) - bird.vx) * 0.2;`

## Comment Notes
- L34: @type {{pos: Vector, vx: number, ticks: number}}
- L36: @type {{ pos: Vector, vel: Vector, type: "normal" | "eye" | "big" | "fake" }[]}
- L87: @ts-ignore
