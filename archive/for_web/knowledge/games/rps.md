# RPS (rps)

- Source: `reference/games/rps.js`
- Tags: field:lanes, rule:match, weapon:blow_off, on_pressed:reverse_state, field:outpost

## Tag Summaries
- **field:lanes**: The character moves on multiple lanes. Avoiding obstacles that flow down the lanes by moving the lanes at the right timing.
- **rule:match**: Matching colors, numbers, and shapes. It is necessary to take actions at the appropriate timing and location while observing the arrangement of colors and other elements.
- **weapon:blow_off**: Propel the character away. By manipulating the character's movement using weapons, effects other than destruction can be achieved.
- **on_pressed:reverse_state**: Invert attributes or states. Various attributes exist, such as the direction of an object, the state of a path, the lane or field to pass through, and the polarity.
- **field:outpost**: There are points in the game where reaching an enemy or an item leads to a game over. Besides the player character being defeated, it is possible to set other game over conditions. These may include a time limit, which adds complexity to the game as players need to consider the placement of enemies and respond accordingly.

## Key Functions
- `update` (line 62)

## Input Handling
- L134: `if (myHand.freezeTicks < 0 && input.isJustPressed) {`

## Comment Notes
- L44: @type {{ lane: any, y: number, my: number, baseMy: number, type: number, isDestroyed: boolean }[]}
- L51: @type {{x: number, handType: number, nextTicks: number}[]}
- L53: @type {{ laneIndex: number, pos: Vector, ty: number, vy: number, type: number freezeTicks: number, }}
- L104: @ts-ignore
- L150: @ts-ignore
