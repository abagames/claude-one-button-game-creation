# PAINT BALL (paint_ball)

- Source: `reference/games/paint_ball.js`
- Tags: player:paint, player:rotate, on_pressed:go_forward, field:outpost, field:auto_scroll

## Tag Summaries
- **player:paint**: Painting the terrain. Painting the terrain can have an impact on the behavior of enemies, and can also provide rewards for the player, which encourages them to think more about their movements.
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.
- **on_pressed:go_forward**: Propel forward in the intended direction. The direction of movement changes over time, hence timely determination of the direction is crucial.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 45)

## Input Handling
- L96: `if (input.isJustPressed) {`

## Comment Notes
- L35: @type {number[][]}
- L38: @type {{pos: Vector, vel: Vector, color: number, paintingCount: number}[]}
- L41: @type {{pos: Vector, angle: number, va: number}}
- L70: @ts-ignore
