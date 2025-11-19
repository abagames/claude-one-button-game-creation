# TEETER (teeter)

- Source: `reference/games/teeter.js`
- Tags: rule:classify, on_pressed:reverse_state, rule:physics, field:pins

## Tag Summaries
- **rule:classify**: Classifying characters. Taking appropriate actions while confirming the classification of each character.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **field:pins**: Multiple pins are arranged in various configurations. They can be used in a variety of ways, such as hooking onto a pin, walking across pins, connecting pins to each other, or falling while hitting pins.

## Key Functions
- `update` (line 35)
- `addBar` (line 166)

## Input Handling
- L88: `if (input.isJustPressed) {`

## Comment Notes
- L25: @type {{pos: Vector, angle: number, width: number}[]}
- L28: @type {Vector}}
- L30: @type {Vector}}
- L32: @type {{pos: Vector, width: number, score: number, barCount: number}[]}
- L114: @ts-ignore
