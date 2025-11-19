# CIRCLE W (circle_w)

- Source: `reference/games/circle_w.js`
- Tags: player:circle, field:pins, obstacle:penalty, field:auto_scroll

## Tag Summaries
- **player:circle**: The player character has a circular shape. By increasing the radius, there is a trade-off between the risk and reward of larger hitboxes and attack ranges.
- **field:pins**: Multiple pins are arranged in various configurations. They can be used in a variety of ways, such as hooking onto a pin, walking across pins, connecting pins to each other, or falling while hitting pins.
- **obstacle:penalty**: There are objects interspersed that incur penalties upon contact or destruction. To avoid incurring penalties, it is necessary to deftly avoid the characters that are subject to penalty when launching an attack. This acts as a constraint against player characters with powerful attacks.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 29)

## Input Handling
- L38: `if (input.isJustPressed) {`
- L44: `playerRadius += sqrt(difficulty) * (input.isPressed ? 1 : -1) * 0.5;`

## Comment Notes
- L16: @type {{ pos: Vector, radius: number, type: "normal" | "player" | "danger" }[]}
- L59: @ts-ignore
