# DIVARR (divarr)

- Source: `reference/games/divarr.js`
- Tags: on_pressed:split, obstacle:penalty, on_pressed:turn, rule:control_weapons

## Tag Summaries
- **on_pressed:split**: Divide into multiple parts. It is necessary to simultaneously control weapons or player characters that have been divided into multiple parts.
- **obstacle:penalty**: There are objects interspersed that incur penalties upon contact or destruction. To avoid incurring penalties, it is necessary to deftly avoid the characters that are subject to penalty when launching an attack. This acts as a constraint against player characters with powerful attacks.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.
- **rule:control_weapons**: Manipulate weapons. Utilize weapons to aim at enemies and destroy them before their weapons approach.

## Key Functions
- `update` (line 54)

## Input Handling
- L65: `if (input.isJustPressed) {`

## Comment Notes
- (no comments captured)
