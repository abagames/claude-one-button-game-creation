# UP 1 WAY (up_1_way)

- Source: `reference/games/up_1_way.js`
- Tags: field:auto_scroll, field:lanes, on_pressed:jump, on_got_item:power_up

## Tag Summaries
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.
- **field:lanes**: The character moves on multiple lanes. Avoiding obstacles that flow down the lanes by moving the lanes at the right timing.
- **on_pressed:jump**: Perform a jump. It is possible to jump multiple times. Jump to avoid holes, enemies, and obstacles. Limit the number of jumps after landing, or reduce the jumping ability each time to limit the maximum jumping height.
- **on_got_item:power_up**: Upgrade and gain power. Enable the capability to counterattack enemies.

## Key Functions
- `floorIndexToY` (line 99)
- `update` (line 101)
- `checkHole` (line 251)

## Input Handling
- L138: `if (input.isJustPressed && player.floorIndex > 0) {`

## Comment Notes
- L81: @type {{ y: number, holeXs: number[], nextHoleDist: number, bambooXs: number[], skullXs: number[], powXs: number[] }[]}
- L95: @type {{pos: Vector, floorIndex: number, targetFi: number }}
