# PARKING (parking)

- Source: `reference/games/parking.js`
- Tags: player:multiple, on_holding:thrust, field:auto_scroll, field:spike

## Tag Summaries
- **player:multiple**: There exist multiple player characters within the game. Necessitating the simultaneous handling of multiple characters and resulting in increased complexity.
- **on_holding:thrust**: Accelerate forward or upward with the player character. By holding the button longer, the player can achieve higher speeds, whereas shorter presses result in lower speeds, allowing for more precise control.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.
- **field:spike**: There are terrains in the game that result in game over upon contact. The player must avoid areas with spikes by jumping or moving to progress.

## Key Functions
- `update` (line 29)
- `drawCar` (line 149)

## Input Handling
- L113: `carAngle += (input.isPressed ? 1 : -1) * sqrt(difficulty) * 0.1;`

## Comment Notes
- L17: @type {{pos: Vector, color: Color}[]}
- L22: @type {{pos: Vector, angle: number, color: Color}[]}
- L93: @ts-ignore
- L108: @ts-ignore
