# SCRAMBIRD (scrambird)

- Source: `reference/games/scrambird.js`
- Tags: on_pressed:flap, on_pressed:shoot, field:auto_scroll, field:roughness, field:spike, rule:combo_multiplier, rule:time_limit

## Tag Summaries
- **on_pressed:flap**: Accelerate upwards by flapping wings. Adjust the timing and frequency of button presses to avoid obstacles.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.
- **field:roughness**: The terrain is uneven. The behavior of movement and jumping is affected by the slope of the terrain. The uneven terrain can also act as obstacles or cover.
- **field:spike**: There are terrains in the game that result in game over upon contact. The player must avoid areas with spikes by jumping or moving to progress.
- **rule:combo_multiplier**: Maintain score bonuses by chaining successes. Successive hits raise a multiplier that resets on mistakes, rewarding streak-based play.
- **rule:time_limit**: Depletion of time and resources leads to the game's termination. Combine with means of restoring time and resources.

## Key Functions
- `update` (line 71)

## Input Handling
- L125: `if (input.isJustPressed) {`

## Comment Notes
- L53: @type {{x: number, height: number}[]}
- L57: @type {{pos: Vector, launchTicks: number}[]}
- L59: @type {Vector[]}
- L62: @type {{pos: Vector, vy: number}}
- L64: @type {Vector[]}
- L66: @type {{pos: Vector, vel: Vector}[]}
- L88: @type {Color}
- L89: @ts-ignore
