# SMILY ANGRY (smily_angry)

- Source: `reference/games/smily_angry.js`
- Tags: obstacle:foresee, on_pressed:turn

## Tag Summaries
- **obstacle:foresee**: Anticipate the movements of the player character. Observing the direction in which you are traveling and launching an attack towards their intended path. In the event that the player character maintains the same pattern of movement, they will be vulnerable to an incoming assault.
- **on_pressed:turn**: Change direction. By pressing the button, the direction changes by 90 or 180 degrees. Alternatively, it may turn in the direction of the pressed arrow button.

## Key Functions
- `update` (line 62)
- `fire` (line 157)

## Input Handling
- L118: `if (input.isJustPressed) {`

## Comment Notes
- L48: @type {{ pos: Vector, targetPos: Vector, fireInterval: number, fireSpeed: number, fireTicks: number isSmile: boolean, isRed: boolean }[]}
- L56: @type {{pos: Vector, vel:Vector, isRed: boolean, isBonus: boolean}[]}
- L58: @type {{pos: Vector, vx: 1 | -1, speed: number}}
- L156: @type {(pos: Vector, speed: Number, isSmile: Boolean, isRed: boolean) => void}
