# PIN CLIMB (pin_climb)

- Source: `reference/games/pin_climb.js`
- Tags: field:pins, player:bar, on_holding:extend, player:rotate, field:auto_scroll

## Tag Summaries
- **field:pins**: Multiple pins are arranged in various configurations. They can be used in a variety of ways, such as hooking onto a pin, walking across pins, connecting pins to each other, or falling while hitting pins.
- **player:bar**: The player character  has a rod-shaped form. When combined with rotational motion, it adds complexity to movements such as dodging obstacles and maneuvering.
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 31)

## Input Handling
- L46: `// 'input.isJustPressed' is set to true the moment the button is pressed.`
- L47: `if (input.isJustPressed) {`
- L51: `// 'input.isPressed' is set to true while the button is pressed.`
- L52: `if (input.isPressed) {`

## Comment Notes
- L1: Write the game name to 'title'.
- L4: 'description' is displayed on the title screen.
- L9: User-defined characters can be written here.
- L12: Configure game options.
- L16: If you want to play a different BGM or SE,
- L17: you can try changing the 'seed' value.
- L21: (Optional) Defining the types of variables is useful for
- L22: code completion and error detection.
- L23: @type {{angle: number, length: number, pin: Vector}}
- L25: @type {Vector[]}
