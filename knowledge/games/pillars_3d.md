# PILLARS 3D (pillars_3d)

- Source: `reference/games/pillars_3d.js`
- Tags: field:3D, field:bottomless, player:bounce

## Tag Summaries
- **field:3D**: An expansive three-dimensional view with depth. Taking advantage of the ability to see far distances, objects can be arranged over a wider area compared to 2D.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.
- **player:bounce**: The player character is constantly bouncing. Utilizing vertical movements.,it timely avoids obstacles and collects items.

## Key Functions
- `update` (line 23)

## Input Handling
- L48: `pos.x = clamp(input.pos.x, 6, 93);`

## Comment Notes
- L15: @type {{x: number, z: number, size: Vector, color: Color}[]}
