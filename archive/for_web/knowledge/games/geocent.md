# GEOCENT (geocent)

- Source: `reference/games/geocent.js`
- Tags: field:space, player:follow, on_holding:move, on_holding:rotate

## Tag Summaries
- **field:space**: The cosmos serves as a field. Incorporate the properties of celestial bodies such as planets and meteorites into the game.
- **player:follow**: To follow the player character. To increase the reward by attracting many characters. As a tradeoff, the risk of increasing collision detection arises.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.
- **on_holding:rotate**: Rotate. Hold the button until the character is facing the appropriate direction.

## Key Functions
- `update` (line 34)

## Input Handling
- L92: `if (input.isJustPressed) {`
- L97: `((input.isPressed ? 5 : 1) * difficulty * 0.1 - rocket.speed) * 0.5;`
- L100: `((input.isPressed ? 0.03 : -0.003) * difficulty - rocket.va) * 0.05;`

## Comment Notes
- L17: @type {{ cPos: Vector, radius: number, angle: number, av: number, size: number, color: Color, pos: Vector }[]}
- L24: @type {{ angle: number, va: number, dist: number, speed: number, posHistory: Vector[], crates: number[], }}
- L31: @type {Vector[]}
- L37: @ts-ignore
