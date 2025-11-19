# S LANES (s_lanes)

- Source: `reference/games/s_lanes.js`
- Tags: field:lanes, field:outpost, on_holding:shoot, on_holding:move

## Tag Summaries
- **field:lanes**: The character moves on multiple lanes. Avoiding obstacles that flow down the lanes by moving the lanes at the right timing.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **on_holding:shoot**: Fire a projectile. Continuously execute an attack while the button is pressed. Cease the attack based on the status of the enemy and transition to the next action.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.

## Key Functions
- `update` (line 63)
- `calcY` (line 170)

## Input Handling
- L91: `if (input.isPressed) {`
- L92: `if (input.isJustPressed) {`

## Comment Notes
- L43: @type {{pos: Vector, vx: number, laneIndex: number}[]}
- L46: @type {{pos: Vector, laneIndex: number}[]}
- L48: @type {{pos: Vector, vx: number}[]}
- L50: @type {{ pos: Vector, laneIndex: number, targetY: number, laneTicks: number, shotTicks: number }}
