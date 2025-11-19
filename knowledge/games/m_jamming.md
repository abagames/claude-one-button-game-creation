# M JAMMING (m_jamming)

- Source: `reference/games/m_jamming.js`
- Tags: weapon:explosion, rule:chain, player:automatic, obstacle:chase, on_holding:extend, on_released:erase, field:auto_scroll

## Tag Summaries
- **weapon:explosion**: Initiate an explosion. By involving a large number of enemies within the radius of the explosion, one can obtain numerous rewards. Explosions can sometimes trigger chain reactions.
- **rule:chain**: An occurrence ensues from a cascading effect. Greater rewards may be garnered through simultaneous annihilation.
- **player:automatic**: The player character moves automatically without requiring input. The player character moves automatically along the terrain and avoids enemies on its own.
- **obstacle:chase**: Pursue the player character. Evade by skillful guidance.
- **on_holding:extend**: Extend and expand an object. Ability to adjust the range of attack or movement. The risk of increasing the hitbox by expanding the range is offset by the high reward of being able to attack over a wider area.
- **on_released:erase**: Erase or nullify characters within a specified range. Adjust and erase the range of attack by holding down the button.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.

## Key Functions
- `update` (line 43)

## Input Handling
- L80: `if (input.isJustPressed) {`
- L83: `if (input.isPressed || input.isJustReleased) {`
- L92: `if (input.isJustReleased || robot.radius > 50) {`

## Comment Notes
- L27: @type {{pos: Vector, vel: Vector, radius: number}}
- L29: @type {{ pos: Vector, angle: number, angleVel: number, speed: number, explosionRadius: number }[]}
- L37: @type {{pos: Vector, radius: number, targetRadius: number, vr: number}[]}
- L39: @type {{pos: Vector, spRatio: number, color: Color}[]}
- L49: @ts-ignore
- L197: @ts-ignore
