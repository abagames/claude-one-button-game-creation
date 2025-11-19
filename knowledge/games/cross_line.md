# CROSS LINE (cross_line)

- Source: `reference/games/cross_line.js`
- Tags: on tapped location:detach, field:connected, field:pins, rule:geometry

## Tag Summaries
- **on tapped location:detach**: Detach or attach a character. Select the connected pins or spaces between the pins, and detach or attach them.
- **field:connected**: Multiple objects are interconnected. One can sever the linkages or manipulate the interconnected components.
- **field:pins**: Multiple pins are arranged in various configurations. They can be used in a variety of ways, such as hooking onto a pin, walking across pins, connecting pins to each other, or falling while hitting pins.
- **rule:geometry**: Incorporate the principles of geometry. The player character traces geometric patterns through interactions with the terrain.

## Key Functions
- `update` (line 25)
- `addLineParticle` (line 141)

## Input Handling
- L61: `if (input.isJustPressed) {`
- L62: `box(input.pos, 5);`

## Comment Notes
- L16: @type {{pos: Vector, vy: number}[]}
- L22: @type {{from: Vector, to: Vector, fromVy: number, toVy: number, addedCount: number}[]}
