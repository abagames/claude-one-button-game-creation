# UD CAVE (ud_cave)

- Source: `reference/games/ud_cave.js`
- Tags: field:multiple, player:inverted, on_holding:reverse_state

## Tag Summaries
- **field:multiple**: Multiple fields are displayed simultaneously. It is necessary to grasp the states of multiple fields simultaneously, and the game becomes complex.
- **player:inverted**: The player character exists in a reversed state. There are multiple fields where the player character can move between, or in each field, there may be multiple player characters present. The player must be attentive to multiple fields simultaneously.
- **on_holding:reverse_state**: Invert attributes and statuses. While holding down the button, a unique state manifests, featuring a reversal of gravity or direction, among other attributes.

## Key Functions
- `update` (line 35)

## Input Handling
- L127: `playerX + (input.isPressed ? 1 : -1) * difficulty * 0.5,`
- L131: `if (input.isJustPressed) {`
- L133: `} else if (input.isJustReleased) {`

## Comment Notes
- L24: @type {{pos: Vector, width: number, vy: number}[]}
- L27: @type {{x: number, vx: number, w: number, vw: number}[]}
- L29: @type {{pos: Vector, vy: number}[]}
