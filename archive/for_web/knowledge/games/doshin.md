# DOSHIN (doshin)

- Source: `reference/games/doshin.js`
- Tags: field:press, on tapped location:select, obstacle:penalty, field:outpost

## Tag Summaries
- **field:press**: The terrain is capable of crushing the character. One can search for areas that do not result in crushing, or time the movements accurately to avoid getting crushed.
- **on tapped location:select**: Select a character or an item. Display multiple selectable items or locations on the screen, and choose among them. Arrow button cursor movement and the confirmation button can serve as substitutes.
- **obstacle:penalty**: There are objects interspersed that incur penalties upon contact or destruction. To avoid incurring penalties, it is necessary to deftly avoid the characters that are subject to penalty when launching an attack. This acts as a constraint against player characters with powerful attacks.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 49)

## Input Handling
- L82: `input.isJustPressed &&`
- L83: `input.pos.x > i * 50 &&`
- L84: `input.pos.x < (i + 1) * 50`

## Comment Notes
- (no comments captured)
