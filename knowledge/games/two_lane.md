# TWO LANE (two_lane)

- Source: `reference/games/two_lane.js`
- Tags: field:lanes, on_pressed:reverse_state, on_holding:thrust

## Tag Summaries
- **field:lanes**: The character moves on multiple lanes. Avoiding obstacles that flow down the lanes by moving the lanes at the right timing.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **on_holding:thrust**: Accelerate forward or upward with the player character. By holding the button longer, the player can achieve higher speeds, whereas shorter presses result in lower speeds, allowing for more precise control.

## Key Functions
- `update` (line 51)

## Input Handling
- L70: `if (input.isJustPressed) {`
- L80: `} else if (input.isPressed) {`

## Comment Notes
- L35: @type {{ y: number, type: "left" | "right" | "both", coin: "left" | "right"| "none", index: number }[]}
