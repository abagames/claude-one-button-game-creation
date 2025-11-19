# ZARTAN (zartan)

- Source: `reference/games/zartan.js`
- Tags: player:string, field:pins, on_pressed:jump_into_another, field:bottomless, field:auto_scroll

## Tag Summaries
- **player:string**: The player character has the shape of a string or spring. Incorporating movements that involve being pulled by a string makes controlling the player character more intricate.
- **field:pins**: Multiple pins are arranged in various configurations. They can be used in a variety of ways, such as hooking onto a pin, walking across pins, connecting pins to each other, or falling while hitting pins.
- **on_pressed:jump_into_another**: Leap to the next waypoint. Teleport instantly. The next waypoint is marked by a pin, so the player must assess whether it is safe to move there and then execute the teleportation with precision timing.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 25)

## Input Handling
- L55: `if (input.isJustPressed) {`
- L60: `if (input.isPressed && anchor) {`
- L67: `if (input.isJustReleased) {`

## Comment Notes
- (no comments captured)
