# BOARDING (boarding)

- Source: `reference/games/boarding.js`
- Tags: rule:classify, rule:physics, field:pins, on_holding:stop, on_pressed:reverse_state, field:auto_scroll

## Tag Summaries
- **rule:classify**: Classifying characters. Taking appropriate actions while confirming the classification of each character.
- **rule:physics**: Incorporate the principles of physics. Manipulate objects by taking into account their collisions and rebounds.
- **field:pins**: Multiple pins are arranged in various configurations. They can be used in a variety of ways, such as hooking onto a pin, walking across pins, connecting pins to each other, or falling while hitting pins.
- **on_holding:stop**: Halt. The object comes to a complete stop either before making contact with an obstacle or when positioned in a location or direction suitable for attacking enemies.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 85)
- `addBoard` (line 224)

## Input Handling
- L137: `if (input.isPressed && !isFirstPressing) {`
- L156: `if (input.isJustReleased) {`

## Comment Notes
- (no comments captured)
