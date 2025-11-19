# DESCENT S (descent_s)

- Source: `reference/games/descent_s.js`
- Tags: on_holding:thrust, rule:physics, field:weather

## Tag Summaries
- **on_holding:thrust**: Accelerate forward or upward with the player character. By holding the button longer, the player can achieve higher speeds, whereas shorter presses result in lower speeds, allowing for more precise control.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **field:weather**: Weather and wind are relevant factors. Players can be affected by natural obstacles and the influence of wind-generated phenomena.

## Key Functions
- `update` (line 45)

## Input Handling
- L70: `ship.vel.y += input.isPressed ? ship.up * 0.005 : ship.down * 0.005;`
- L71: `if (input.isJustPressed) {`
- L74: `if (input.isJustReleased) {`
- L125: `color(input.isPressed ? "yellow" : "cyan");`
- L130: `color(!input.isPressed ? "yellow" : "cyan");`

## Comment Notes
- L35: @type {{ pos:Vector, vel:Vector, up: number, down: number nextUp: number, nextDown: number }}
- L42: @type {{pos:Vector, width: number}[]}
