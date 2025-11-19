# SHINY (shiny)

- Source: `reference/games/shiny.js`
- Tags: field:weather, field:holes, on_holding:reverse_state, on_holding:move

## Tag Summaries
- **field:weather**: Weather and wind are relevant factors. Players can be affected by natural obstacles and the influence of wind-generated phenomena.
- **field:holes**: There are holes in the ground. To avoid falling into them, it is necessary to move and jump carefully. It is also possible to utilize the holes by hiding in them to evade enemy attacks.
- **on_holding:reverse_state**: Invert attributes and statuses. While holding down the button, a unique state manifests, featuring a reversal of gravity or direction, among other attributes.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.

## Key Functions
- `update` (line 85)
- `addDrop` (line 262)

## Input Handling
- L126: `const isRainy = input.isPressed;`
- L127: `if (input.isJustPressed) {`
- L132: `if (input.isJustReleased) {`

## Comment Notes
- L65: @type { { pos: Vector, speed: number, ticks: number, isRunning: boolean, isFalling: boolean }[ ]}
- L70: @type {{pos: Vector, vel: Vector, type: "strong" | "weak" }[]}
- L72: @type { {pos: Vector, size: number }[]}
- L74: @type { {pos: Vector, rainyPos: Vector, shinyPos: Vector, radius: number, weakDropTicks: number, strongDropTicks:number }[]}
