# UP DOWN PRESS (up_down_press)

- Source: `reference/games/up_down_press.js`
- Tags: player:step_on, on_holding:thrust, field:roughness, field:auto_scroll

## Tag Summaries
- **player:step_on**: The player character can stomp on enemies. Providing a reward for the risk of timing a jump to stomp on an enemy from above can be implemented.
- **on_holding:thrust**: Accelerate forward or upward with the player character. By holding the button longer, the player can achieve higher speeds, whereas shorter presses result in lower speeds, allowing for more precise control.
- **field:roughness**: The terrain is uneven. The behavior of movement and jumping is affected by the slope of the terrain. The uneven terrain can also act as obstacles or cover.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 40)
- `calcRoad` (line 186)

## Input Handling
- L101: `if (input.isJustPressed) {`
- L110: `myCar.vy += input.isPressed ? 0.05 : 0.2;`
- L114: `(myCarSpeed * (input.isPressed ? 2.5 : 0.5) - myCar.speed) * 0.1;`

## Comment Notes
- L17: @type {{from: Vector, to: Vector, angle: number }[]}
- L20: @type {{ x: number, vx: number, angle: number, size: number, color: Color, speed: number, currentSpeed: number, }[]}
- L29: @type {{ pos: Vector, vy: number, vx: number, angle: number, speed: number, state: "ground" | "jump" | "damaged" }}
- L140: @ts-ignore
