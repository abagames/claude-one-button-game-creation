# HOPPING P (hopping_p)

- Source: `reference/games/hopping_p.js`
- Tags: player:bounce, obstacle:bounce, on_got_item:power_up

## Tag Summaries
- **player:bounce**: The player character is constantly bouncing. Utilizing vertical movements.,it timely avoids obstacles and collects items.
- **obstacle:bounce**: Continuously leaping. Evade bouncing obstacles by either maneuvering underneath or leaping over them.
- **on_got_item:power_up**: Upgrade and gain power. Enable the capability to counterattack enemies.

## Key Functions
- `update` (line 48)
- `checkCollision` (line 166)
- `drawHopping` (line 202)

## Input Handling
- L119: `if (h.type === "player" && input.isJustPressed) {`

## Comment Notes
- L16: @type {{ pos: Vector, vel:Vector, vx: number, hop:Vector, grv: number, hopTicks: number, type: "player" | "enemy" | "power"}[] }
- L35: @type { {[key:string]: Color} }
