# BALL TOUR (ball_tour)

- Source: `reference/games/ball_tour.js`
- Tags: player:reciprocate, on_holding:move

## Tag Summaries
- **player:reciprocate**: The player character reciprocates horizontally or vertically. This is combined with mechanics that involve player-controlled movement and speed changes.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.

## Key Functions
- `update` (line 50)
- `gameOver` (line 132)

## Input Handling
- L91: `if (input.isJustPressed) {`
- L95: `player.vx = (input.isPressed ? 1 : 0.1) * difficulty;`

## Comment Notes
- L40: @type {{pos: Vector, yAngle: number, vx: number, ticks: number}}
- L42: @type {{pos: Vector, vy: number}[]}
- L45: @type {Vector[]}
- L54: Play BGM at the start of the game.
- L55: The 'bgm' variable is assigned MML string copied from the clipboard.
- L92: Play the `hit` sound effect.
- L99: Play the `explosion` sound effect.
- L121: Play the `select` sound effect.
- L133: Stop BGM at the end of the game.
- L138: MML for BGM.
