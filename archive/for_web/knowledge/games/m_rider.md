# M RIDER (m_rider)

- Source: `reference/games/m_rider.js`
- Tags: rule:chain, on_holding:thrust, field:bottomless, field:auto_scroll

## Tag Summaries
- **rule:chain**: An occurrence ensues from a cascading effect. Greater rewards may be garnered through simultaneous annihilation.
- **on_holding:thrust**: Accelerate forward or upward with the player character. By holding the button longer, the player can achieve higher speeds, whereas shorter presses result in lower speeds, allowing for more precise control.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 54)

## Input Handling
- L63: `if (input.isJustPressed) {`
- L67: `rider.vel.x += (input.isPressed ? 0.04 : -0.02) * sqrt(difficulty);`
- L68: `rider.vel.y += (input.isPressed ? 0.01 : 0.05) * sqrt(difficulty);`
- L73: `m.vel.y += (input.isPressed ? -1 : 1) * 0.05 * difficulty;`

## Comment Notes
- L40: @type {{pos: Vector, vel: Vector}[]}
- L43: @type {{ pos: Vector, vel: Vector, removeTicks: number, baseRemoveTicks: number, }[]}
- L50: @type {{pos: Vector, vel: Vector, missile: any}}
