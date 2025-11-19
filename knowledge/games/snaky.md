# SNAKY (snaky)

- Source: `reference/games/snaky.js`
- Tags: rule:balance, field:connected, on_holding:thrust

## Tag Summaries
- **rule:balance**: Achieving equilibrium. Control the player character's inclination by observing its tilt state.
- **field:connected**: Multiple objects are interconnected. One can sever the linkages or manipulate the interconnected components.
- **on_holding:thrust**: Accelerate forward or upward with the player character. By holding the button longer, the player can achieve higher speeds, whereas shorter presses result in lower speeds, allowing for more precise control.

## Key Functions
- `update` (line 33)
- `addNode` (line 133)
- `removeNode` (line 143)

## Input Handling
- L42: `if (input.isJustPressed) {`
- L53: `n.angle + (input.isPressed ? -1 : 1) * 0.03 * sqrt(difficulty),`

## Comment Notes
- L25: @type {{angle: number, va: number, prevNode: any, nextNode: any}[]}
- L27: @type {{pos: Vector, vx: number, isRed: boolean}[]}
