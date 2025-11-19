# RAID (raid)

- Source: `reference/games/raid.js`
- Tags: weapon:artillery, on_pressed:shoot, on_holding:thrust, rule:chain, field:auto_scroll

## Tag Summaries
- **weapon:artillery**: The object follows a parabolic trajectory due to the effect of gravity. It is often used in combination with the adjustment of the launch angle. Skill is required to successfully hit the intended target.
- **on_pressed:shoot**: Fire a projectile. The action on the game varies greatly depending on the mechanics of the projectile being fired.
- **on_holding:thrust**: Accelerate forward or upward with the player character. By holding the button longer, the player can achieve higher speeds, whereas shorter presses result in lower speeds, allowing for more precise control.
- **rule:chain**: An occurrence ensues from a cascading effect. Greater rewards may be garnered through simultaneous annihilation.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 49)
- `addClouds` (line 189)

## Input Handling
- L86: `if (input.isPressed) {`
- L90: `if (bomb == null && ticks > 30 && input.isJustReleased) {`

## Comment Notes
- L33: @type {{ pos: Vector, vel: Vector, speed: number, downDist: number, bombVy: number, }}
- L39: @type {{pos: Vector, vel: Vector}}
- L41: @type {{height:number}[]}
- L43: @type {{pos: Vector, vy: number}[]}
- L45: @type {{pos: Vector, size: number}[]}
- L159: @ts-ignore
