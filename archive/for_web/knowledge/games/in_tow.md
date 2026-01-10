# IN TOW (in_tow)

- Source: `reference/games/in_tow.js`
- Tags: player:follow, field:auto_scroll, field:floors, on_got_item:spawn

## Tag Summaries
- **player:follow**: To follow the player character. To increase the reward by attracting many characters. As a tradeoff, the risk of increasing collision detection arises.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.
- **field:floors**: Multiple platforms are suspended in the air. To traverse the platforms, it is necessary to jump with precise timing to avoid falling off. Some platforms may also move, affecting the movement of the player character.
- **on_got_item:spawn**: Spawn a character. The player character increases in number or size.

## Key Functions
- `update` (line 64)

## Input Handling
- L80: `if (chicks.length > 0 && input.isJustPressed) {`
- L88: `bird.vy += (input.isPressed ? 0.05 : 0.2) * difficulty;`
- L97: `if (input.isJustPressed) {`

## Comment Notes
- L50: @type {{pos: Vector, vy: number, posHistory: Vector[], isJumping: boolean}}
- L52: @type {{index: number, targetIndex: number}[]}
- L54: @type {{pos: Vector, vy: number}[]}
- L56: @type {{pos: Vector, width: number, hasChick: boolean}[]}
- L59: @type {{pos: Vector, vx: number}[]}
