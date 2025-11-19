# BALLS BOMBS (balls_bombs)

- Source: `reference/games/balls_bombs.js`
- Tags: obstacle:bounce, on_got_item:power_up, weapon:explosion, rule:combo_multiplier, field:auto_scroll, on_holding:move

## Tag Summaries
- **obstacle:bounce**: Continuously leaping. Evade bouncing obstacles by either maneuvering underneath or leaping over them.
- **on_got_item:power_up**: Upgrade and gain power. Enable the capability to counterattack enemies.
- **weapon:explosion**: Initiate an explosion. By involving a large number of enemies within the radius of the explosion, one can obtain numerous rewards. Explosions can sometimes trigger chain reactions.
- **rule:combo_multiplier**: Maintain score bonuses by chaining successes. Successive hits raise a multiplier that resets on mistakes, rewarding streak-based play.
- **field:auto_scroll**: The field continuously scrolls to drive pacing. Players must adapt positioning and timing as terrain, hazards, and rewards move past at a fixed rate.
- **on_holding:move**: Movement. The object moves while being pressed, and its movement speed increases. Skillful control of the player character's position is necessary to avoid obstacles.

## Key Functions
- `update` (line 91)

## Input Handling
- L133: `if (input.isJustPressed) {`
- L137: `playerX += (input.isPressed ? sd * clamp(walkSpeed, 0, 1) : 0) - scr;`

## Comment Notes
- L78: @type {{pos: Vector, vel: Vector}[]}
