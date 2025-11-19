# METEO PLANET (meteo_planet)

- Source: `reference/games/meteo_planet.js`
- Tags: field:space, rule:proximity_bonus, obstacle:fall, field:rotate

## Tag Summaries
- **field:space**: The cosmos serves as a field. Incorporate the properties of celestial bodies such as planets and meteorites into the game.
- **rule:proximity_bonus**: Proximity to risk yields points. Place bonus items near obstacles and earn points or resources upon approaching obstacles. Utilize as a means to balance risk and reward.
- **obstacle:fall**: Descend from a height. Avoid or destroy falling obstacles.
- **field:rotate**: The field is in a state of rotation. To add variety to the player character's movement, besides left and right, and to create a cyclical field.

## Key Functions
- `update` (line 49)

## Input Handling
- L67: `if (input.isJustPressed) {`

## Comment Notes
- L39: @type {{dist: number, angle: number, type: number}[]}
- L46: @type {{dist: number, angle: number}[]}
