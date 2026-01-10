# REFBALS (refbals)

- Source: `reference/games/refbals.js`
- Tags: player:multiple, player:reflect, field:floors, field:bottomless

## Tag Summaries
- **player:multiple**: There exist multiple player characters within the game. Necessitating the simultaneous handling of multiple characters and resulting in increased complexity.
- **player:reflect**: The player character reflects upon colliding with a wall or object. To anticipate the movement of the reflection, actions such as positioning walls should be taken.
- **field:floors**: Multiple platforms are suspended in the air. To traverse the platforms, it is necessary to jump with precise timing to avoid falling off. Some platforms may also move, affecting the movement of the player character.
- **field:bottomless**: When the character falls off the bottom of the screen, the game is over. To prevent this, it is necessary to navigate skillfully using the terrain and avoid falling off the bottom.

## Key Functions
- `update` (line 22)

## Input Handling
- L37: `// 'input.isPressed' returns true if`
- L39: `w.x -= input.isPressed ? 2 : 1;`

## Comment Notes
- L1: Title of the game
- L4: Description is displayed on the title screen
- L9: User defined text characters
- L12: Game options
- L21: 'update()' is called per frame (1 frame = 1/60 second)
- L23: 'ticks' counts the number of frames from the start of the game
- L25: Initialize variables at the first frame (ticks === 0)
- L27: 'vec()' creates a 2d vector instance
- L31: 'rnd()' returns a random number
- L34: 'color()' sets a drawing color
