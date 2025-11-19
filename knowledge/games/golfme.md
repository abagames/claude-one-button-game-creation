# GOLFME (golfme)

- Source: `reference/games/golfme.js`
- Tags: on_holding:adjust_angle, on_released:throw, field:holes, field:bottomless, field:auto_scroll

## Tag Summaries
- **on_holding:adjust_angle**: Adjust the direction and distance. While pressing, the angle and distance change, and releasing the button causes firing or movement. It is possible to alter the destination based on the timing of button operations.
- **on_released:throw**: Throw or move forward. Combine it with holding down a button to adjust the direction and range of attack or movement.
- **field:holes**: There are holes in the ground. To avoid falling into them, it is necessary to move and jump carefully. It is also possible to utilize the holes by hiding in them to evade enemy attacks.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 25)

## Input Handling
- L51: `if (input.isPressed) {`
- L54: `if (input.isJustReleased) {`

## Comment Notes
- (no comments captured)
