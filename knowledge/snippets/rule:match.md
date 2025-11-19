# rule:match

| Primary Role | Gameplay based on matching attributes between game elements |
| --- | --- |
| Reference Games | `number_ball` - reference/games/number_ball.js:58-75, `color_roll` - reference/games/color_roll.js:90-110, `forfour` - reference/games/forfour.js:120-145 |
| LLM Status | draft |

## Snippet
```js
  remove(floors, (f, i) => {
    f.x -= scr;
    color(i == 0 ? "light_red" : "light_green");
    rect(f.x, 50, f.width - 2, 10);
    rx = f.x + f.width;
    if (f.value != null) {
      color("red");
      text(`${f.value}`, f.x + 7, 55);
      let isRemoving = false;
      balls.forEach((b) => {
        if (
          b.state === "onFloor" &&
          b.pos.x > f.x - 3 &&
          b.pos.x < rx + 3 &&
          f.value === b.value
        ) {
          isRemoving = true;
        }
      });
      if (isRemoving) {
        play("coin");
        addScore(f.value * multiplier, f.x + 7, 50);
        if (multiplier < 16) {
          multiplier *= 2;
        }
        return true;
      }
    }
  });
```

## Dependencies
- Global: `floors` - array of target zones with `{ value, x, width }`
- Global: `balls` - array of player objects with `{ value, pos, state }`
- Global: `scr`, `multiplier` - scrolling offset, score multiplier
- API: `remove`, `rect`, `text`, `color`, `play`, `addScore` - Crisp Game Library helpers

## Integration Notes
- Match condition: `f.value === b.value` compares numerical values; adapt for colors (`f.color === b.color`) or shapes.
- Spatial constraint: ball must be on floor (`b.state === "onFloor"`) and within zone bounds (`b.pos.x > f.x - 3 && b.pos.x < rx + 3`).
- Scoring: multiply base value by current multiplier (`f.value * multiplier`), then double multiplier up to cap (16).
- Visual feedback: display value/color as text or sprite on both ball and floor zone for player recognition.
- Compatible with `rule:combo_multiplier` (increments multiplier per match), `rule:classify` (sorting before matching).
- Variants: color matching (use `Color` type), shape matching (use character codes), pattern matching (check sequences).
- Balance: tune match tolerance (spatial bounds `± 3`) and multiplier cap for difficulty curve.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/number_ball.js:49-76` - code compiles, references verified
