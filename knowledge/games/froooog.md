# FROOOOG (froooog)

- Source: `reference/games/froooog.js`
- Tags: on_holding:adjust_angle, on_released:throw, field:auto_scroll

## Tag Summaries
- **on_holding:adjust_angle**: Adjust the direction and distance. While pressing, the angle and distance change, and releasing the button causes firing or movement. It is possible to alter the destination based on the timing of button operations.
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 35)
- `drawFrog` (line 114)
- `updateLanes` (line 132)
- `addLane` (line 161)

## Input Handling
- L70: `if (input.isPressed) {`
- L90: `if (input.isJustReleased || frog.targetY < 9) {`

## Comment Notes
- L16: @type {{ y: number, vx: number, width: number, color: Color, interval: number, ticks: number }[]}
- L24: @type {{pos: Vector, vx: number, width: number, color: Color}[]}
- L27: @type {{ y: number, py: number, targetY: number, isSafe: boolean state: "stop" | "bend" | "jump" }}
- L171: @ts-ignore
