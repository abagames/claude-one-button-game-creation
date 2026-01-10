# REVOLVE A (revolve_a)

- Source: `reference/games/revolve_a.js`
- Tags: on_pressed:go_forward, field:connected, rule:chain, field:pins, player:rotate

## Tag Summaries
- **on_pressed:go_forward**: Propel forward in the intended direction. The direction of movement changes over time, hence timely determination of the direction is crucial.
- **field:connected**: Multiple objects are interconnected. One can sever the linkages or manipulate the interconnected components.
- **rule:chain**: An occurrence ensues from a cascading effect. Greater rewards may be garnered through simultaneous annihilation.
- **field:pins**: Multiple pins are arranged in various configurations. They can be used in a variety of ways, such as hooking onto a pin, walking across pins, connecting pins to each other, or falling while hitting pins.
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.

## Key Functions
- `update` (line 32)
- `removeAroundEnemy` (line 119)

## Input Handling
- L76: `if (input.isJustPressed) {`
- L94: `color(input.isJustPressed ? "red" : "blue");`

## Comment Notes
- L24: @type {{pos: Vector, vel: Vector, angle: number}}
- L26: @type {{pos: Vector, vel: Vector, isRemoved: boolean}[]}
