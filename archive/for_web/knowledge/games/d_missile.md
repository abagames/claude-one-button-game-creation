# D MISSILE (d_missile)

- Source: `reference/games/d_missile.js`
- Tags: rule:control_weapons, obstacle:split, on_holding:rotate, on_pressed:shoot, player:multiple, field:outpost

## Tag Summaries
- **rule:control_weapons**: Manipulate weapons. Utilize weapons to aim at enemies and destroy them before their weapons approach.
- **obstacle:split**: Splitting occurs. It can occur through attacks or over time, leading to an increase in complexity. It is essential to select appropriate actions such as destruction of obstacles before the split occurs.
- **on_holding:rotate**: Rotate. Hold the button until the character is facing the appropriate direction.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **player:multiple**: There exist multiple player characters within the game. Necessitating the simultaneous handling of multiple characters and resulting in increased complexity.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 32)

## Input Handling
- L41: `if (input.isJustPressed) {`
- L46: `if (input.isJustReleased && tapTicks > 0) {`
- L61: `if (input.isPressed) {`

## Comment Notes
- L16: @type {{ pos: Vector, vel: Vector, from: Vector, ticks: number, id: number, isRemoving: boolean }[]}
- L25: @type {{pos: Vector, angle: number, speed: number}[]}
