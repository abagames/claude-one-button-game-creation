# NOT TURN (not_turn)

- Source: `reference/games/not_turn.js`
- Tags: on_pressed:select_route, on_holding:move, field:lanes, field:auto_scroll

## Tag Summaries
- **on_pressed:select_route**: To determine the route of advancement. One must adeptly select the appropriate lane on a field containing multiple lanes and pathways connecting them.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.
- **field:lanes**: The character moves on multiple lanes. Avoiding obstacles that flow down the lanes by moving the lanes at the right timing.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 110)
- `calcBarX` (line 269)

## Input Handling
- L165: `pc = addWithCharCode("a", floor(ticks / (input.isPressed ? 10 : 20)) % 2);`
- L167: `if (player.noTurnDist < 0 && input.isPressed) {`
- L187: `pc = addWithCharCode("c", floor(ticks / (input.isPressed ? 10 : 20)) % 2);`
- L189: `if (input.isJustPressed) {`
- L192: `if (input.isJustReleased) {`
- L195: `player.speed += ((input.isPressed ? 4 : 1) - player.speed) * 0.2;`

## Comment Notes
- L88: @type {{pos: Vector}[]}
- L91: @type {{ pos: Vector, vel: Vector, xIndex: number, noTurnDist: number, dotDist: number }[]}
- L98: @type {{ pos: Vector, vel: Vector, xIndex: number, noTurnDist: number, speed: number }}
