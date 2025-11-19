# LIGHT DARK (light_dark)

- Source: `reference/games/light_dark.js`
- Tags: player:inverted, on_pressed:reverse_state, on_pressed:jump, field:spike, field:auto_scroll

## Tag Summaries
- **player:inverted**: The player character exists in a reversed state. There are multiple fields where the player character can move between, or in each field, there may be multiple player characters present. The player must be attentive to multiple fields simultaneously.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **field:spike**: There are terrains in the game that result in game over upon contact. The player must avoid areas with spikes by jumping or moving to progress.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 53)

## Input Handling
- L76: `if (input.isJustPressed) {`
- L85: `if (input.isJustPressed) {`
- L89: `vel.y -= (input.isPressed ? 0.1 : 0.5) * difficulty;`

## Comment Notes
- L42: @type {{x: number, type: "spike" | "coin", side: "light" | "dark" }[]}
