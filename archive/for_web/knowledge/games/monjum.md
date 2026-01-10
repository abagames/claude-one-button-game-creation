# MONJUM (monjum)

- Source: `reference/games/monjum.js`
- Tags: on_holding:stop, on_released:throw, field:holes

## Tag Summaries
- **on_holding:stop**: Halt. The object comes to a complete stop either before making contact with an obstacle or when positioned in a location or direction suitable for attacking enemies.
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.
- **field:holes**: There are holes in the ground. To avoid falling into them, it is necessary to move and jump carefully. It is also possible to utilize the holes by hiding in them to evade enemy attacks.

## Key Functions
- `update` (line 52)
- `bitCount` (line 156)

## Input Handling
- L173: `if (input.isPressed) {`
- L179: `if (input.isJustReleased && ticks > 5) {`

## Comment Notes
- (no comments captured)
