# C NODES (c_nodes)

- Source: `reference/games/c_nodes.js`
- Tags: field:connected, on tapped location:detach

## Tag Summaries
- **field:connected**: Multiple objects are interconnected. One can sever the linkages or manipulate the interconnected components.
- **on tapped location:detach**: Detach or attach a character. Select the connected pins or spaces between the pins, and detach or attach them.

## Key Functions
- `update` (line 27)
- `checkRedNodes` (line 120)

## Input Handling
- L38: `if (input.isJustPressed && input.pos.y > fixedY) {`
- L40: `box(input.pos, 7);`
- L116: `if (input.isPressed) {`

## Comment Notes
- L16: @type {{pos: Vector, vel: Vector, color: "black" | "red" | "blue"}[]}
- L19: @type {{node1: any, node2: any, length: number}[]}
- L65: @ts-ignore
