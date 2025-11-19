# CARD Q (card_q)

- Source: `reference/games/card_q.js`
- Tags: on tapped location:select, rule:mathematics

## Tag Summaries
- **on tapped location:select**: Select a character or an item. Display multiple selectable items or locations on the screen, and choose among them. Arrow button cursor movement and the confirmation button can serve as substitutes.
- **rule:mathematics**: The subject matter pertains to mathematics and numerical elements. It encompasses the tasks of equating numerical values and performing computations involving mathematical expressions.

## Key Functions
- `update` (line 65)
- `placeCard` (line 226)
- `checkPlacedIndex` (line 256)
- `drawCard` (line 277)
- `calcPlayerCardPos` (line 296)
- `calcEnemyCardPos` (line 300)
- `calcPlacedCardX` (line 304)
- `calcCardX` (line 308)
- `movePos` (line 312)

## Input Handling
- L140: `const pci = floor((input.pos.x - 50) / cardIntervalX + cardColumnCount / 2);`
- L141: `if (input.isJustPressed) {`

## Comment Notes
- L42: @type {{num: number, pos: Vector, tPos:Vector, gPos:Vector }[]}
- L44: @type {{num: number, pos: Vector, tPos:Vector, gPos:Vector }[]}
- L46: @type {{num: number, pos: Vector, tPos:Vector }[]}
- L48: @type { number[]}
