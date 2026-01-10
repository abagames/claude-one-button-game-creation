# FUTURE WAKE (future_wake)

- Source: `reference/games/future_wake.js`
- Tags: rule:time manipulation, player:reflect, on sliding:move

## Tag Summaries
- **rule:time manipulation**: The flow of time undergoes alterations. Skip periods of time that do not require player interaction, and slow down time during scenes that necessitate intricate maneuvers.
- **player:reflect**: The player character reflects upon colliding with a wall or object. To anticipate the movement of the reflection, actions such as positioning walls should be taken.
- **on sliding:move**: Transport to the location of the slide. Move the player character to the designated location specified by the pointer. Arrow button manipulation can serve as a substitute.

## Key Functions
- `update` (line 30)
- `updateBall` (line 89)

## Input Handling
- L50: `const rx = clamp(input.pos.x, 17, 83);`

## Comment Notes
- L16: @type {{pos: Vector, vel: Vector, speed: number}}
- L18: @type {{pos: Vector, vel: Vector}}
- L21: @type {Color}}
- L65: @ts-ignore
