# JUMP ON (jump_on)

- Source: `reference/games/jump_on.js`
- Tags: on_pressed:select_route, obstacle:chase, field:auto_scroll

## Tag Summaries
- **on_pressed:select_route**: To determine the route of advancement. One must adeptly select the appropriate lane on a field containing multiple lanes and pathways connecting them.
- **obstacle:chase**: Pursue the player character. Evade by skillful guidance.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 130)

## Input Handling
- L296: `if (input.isPressed) {`

## Comment Notes
- L106: @type {{ pos: Vector, hole:any, nextDotsDist: number, state: "up" | "down" | "walk" | "jumpTo" | "jumpFrom" }[]}
- L116: @type {{x: number, animTicks: number}[]}
- L119: @type {{ pos: Vector, hole:any, state: "up" | "down" | "walk" | "jumpTo" | "jumpFrom" }}
- L126: @type {{pos: Vector}[]}
