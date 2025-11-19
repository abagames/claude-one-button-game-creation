# NUMBER BALL (number_ball)

- Source: `reference/games/number_ball.js`
- Tags: on_holding:adjust_angle, on_released:throw, rule:match, rule:mathematics, weapon:artillery, field:outpost, field:auto_scroll

## Tag Summaries
- **on_holding:adjust_angle**: Adjust the direction and distance. While pressing, the angle and distance change, and releasing the button causes firing or movement. It is possible to alter the destination based on the timing of button operations.
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.
- **rule:match**: Matching colors, numbers, and shapes. It is necessary to take actions at the appropriate timing and location while observing the arrangement of colors and other elements.
- **rule:mathematics**: The subject matter pertains to mathematics and numerical elements. It encompasses the tasks of equating numerical values and performing computations involving mathematical expressions.
- **weapon:artillery**: The object follows a parabolic trajectory due to the effect of gravity. It is often used in combination with the adjustment of the launch angle. Skill is required to successfully hit the intended target.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 31)

## Input Handling
- L132: `if (input.isJustPressed) {`
- L135: `if (input.isPressed) {`
- L140: `if (input.isJustReleased || b.vel.angle < -PI * 0.47) {`

## Comment Notes
- L17: @type {{ value: number, pos: Vector, vel: Vector, state: "stay" | "flying" | "onFloor" | "removing" | "falling" }[]}
- L25: @type {{value: number, x: number, width: number}[]}
