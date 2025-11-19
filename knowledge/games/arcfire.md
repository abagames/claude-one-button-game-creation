# ARCFIRE (arcfire)

- Source: `reference/games/arcfire.js`
- Tags: weapon:arc, field:outpost, on_holding:adjust_angle, player:rotate, on_released:throw

## Tag Summaries
- **weapon:arc**: The weapon has an arched shape. By considering the trade-off between range and spreading angle, there is room to devise attack ranges.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.
- **on_holding:adjust_angle**: Adjust the direction and distance. While pressing, the angle and distance change, and releasing the button causes firing or movement. It is possible to alter the destination based on the timing of button operations.
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.

## Key Functions
- `update` (line 66)

## Input Handling
- L107: `if (isPressing && input.isJustReleased) {`
- L116: `if (input.isJustPressed) {`

## Comment Notes
- (no comments captured)
