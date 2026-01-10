# LIE DOWN (lie_down)

- Source: `reference/games/lie_down.js`
- Tags: on_holding:avoid, field:holes, field:auto_scroll

## Tag Summaries
- **on_holding:avoid**: Capable of evading enemies and projectiles or traversing through them. By assuming a prone position to evade enemies or navigating through obstacles, alternate evasion strategies can be employed in addition to movement.
- **field:holes**: There are holes in the ground. To avoid falling into them, it is necessary to move and jump carefully. It is also possible to utilize the holes by hiding in them to evade enemy attacks.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 71)

## Input Handling
- L143: `if (input.isJustPressed) {`
- L149: `if (!input.isPressed) {`
- L160: `input.isPressed ? "c" : addWithCharCode("a", floor(ticks / 20) % 2),`
- L162: `input.isPressed ? 39 : 37`
- L174: `if (input.isPressed) {`

## Comment Notes
- L58: @type {{x: number, height: number, speed: number}[]}
- L61: @type {{x: number, height: number, speed: number}[]}
- L64: @type {{x: number, vx: number, targetVx: number}[]}
- L66: @type {{x: number, vx: number, y: number}}
