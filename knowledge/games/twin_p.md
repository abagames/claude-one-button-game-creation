# TWIN P (twin_p)

- Source: `reference/games/twin_p.js`
- Tags: player:bar, player:rotate, on_pressed:reverse_state, on_holding:extend

## Tag Summaries
- **player:bar**: The player character  has a rod-shaped form. When combined with rotational motion, it adds complexity to movements such as dodging obstacles and maneuvering.
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.

## Key Functions
- `update` (line 29)

## Input Handling
- L54: `if (input.isJustReleased) {`
- L60: `} else if (input.isPressed) {`

## Comment Notes
- L17: @type {Vector}
- L23: @type {{pos:Vector, vel: Vector, type: "o" | "x", isIn: boolean}[]}
