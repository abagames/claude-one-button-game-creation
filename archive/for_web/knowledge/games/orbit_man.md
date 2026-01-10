# ORBIT MAN (orbit_man)

- Source: `reference/games/orbit_man.js`
- Tags: player:rotate, on_pressed:go_forward, field:space, field:pins, field:auto_scroll

## Tag Summaries
- **player:rotate**: The player character rotates. Timing must be coordinated to advance or fire bullets, as the direction of movement and the firing direction of bullets change over time.
- **on_pressed:go_forward**: Propel forward in the intended direction. The direction of movement changes over time, hence timely determination of the direction is crucial.
- **field:space**: The cosmos serves as a field. Incorporate the properties of celestial bodies such as planets and meteorites into the game.
- **field:pins**: Multiple pins are arranged in various configurations. They can be used in a variety of ways, such as hooking onto a pin, walking across pins, connecting pins to each other, or falling while hitting pins.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 26)

## Input Handling
- L94: `if (input.isJustPressed) {`

## Comment Notes
- L16: @type {{pos: Vector, radius: number, isDestroyed: boolean}[]}
- L19: @type {{planet: any, angle: number, av: number, pos: Vector, target: Vector}}
- L23: @type {{pos: Vector, vy: number}[]}
