# KITE (kite)

- Source: `reference/games/kite.js`
- Tags: field:weather, player:string, field:spike, field:auto_scroll

## Tag Summaries
- **field:weather**: Weather and wind are relevant factors. Players can be affected by natural obstacles and the influence of wind-generated phenomena.
- **player:string**: The player character has the shape of a string or spring. Incorporating movements that involve being pulled by a string makes controlling the player character more intricate.
- **field:spike**: There are terrains in the game that result in game over upon contact. The player must avoid areas with spikes by jumping or moving to progress.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 66)

## Input Handling
- L106: `if (input.isJustPressed) {`
- L109: `if (input.isPressed) {`
- L168: `nextWindTicks -= input.isPressed ? 3 : 1;`
- L172: `vel: vec(rnd(1, 2) * sd * (input.isPressed ? 2 : 1), 0),`

## Comment Notes
- L48: @type {{pos: Vector, vel: Vector}}
- L50: @type {{pos: Vector, vel: Vector, ticks: number}}
- L52: @type {{pos: Vector, vel: Vector}[]}
- L55: @type {{pos: Vector, vel: Vector}[]}
- L59: @type {{pos: Vector, height: number}[]}
- L61: @type {{yAngle: number, hAngle: number}[]}
