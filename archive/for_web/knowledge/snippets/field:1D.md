# field:1D

| Primary Role    | Gameplay confined to a single axis (horizontal, vertical, or diagonal)                                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Reference Games | `paku_paku` - reference/games/paku_paku.js:84-132, `charge_beam` - reference/games/charge_beam.js:52-118, `photon_line` - reference/games/photon_line.js:38-124 |
| LLM Status      | draft                                                                                                                                         |

## Snippet

```js
animTicks += difficulty;
color("black");
text(`x${multiplier}`, 3, 9);
if (input.isJustPressed) {
  player.vx *= -1;
}
player.x += player.vx * 0.5 * difficulty;
if (player.x < -3) {
  player.x = 103;
} else if (player.x > 103) {
  player.x = -3;
}
color("blue");
rect(0, 23, 100, 1);
rect(0, 25, 100, 1);
rect(0, 34, 100, 1);
rect(0, 36, 100, 1);
color("green");
const ai = floor(animTicks / 7) % 4;
char(addWithCharCode("a", ai === 3 ? 1 : ai), player.x, 30, {
  mirror: { x: player.vx },
});
remove(dots, (d) => {
  color(d.isPower && floor(animTicks / 7) % 2 === 0 ? "transparent" : "yellow");
  const c = char(d.isPower ? "g" : "f", d.x, 30).isColliding.char;
  if (c.a || c.b || c.c) {
    if (d.isPower) {
      play("jump");
      if (enemy.eyeVx === 0) {
        powerTicks = 120;
      }
    } else {
      play("hit");
    }
    addScore(multiplier);
    return true;
  }
});
```

## Dependencies

- Globals: `player`, `enemy`, `dots`, `multiplier`, `powerTicks`, `animTicks`, `difficulty`
- Functions: `color`, `text`, `char`, `addWithCharCode`, `remove`, `play`, `addScore`, `floor`
- API: `input.isJustPressed`

## Integration Notes

- Overlay `field:lanes` markings by swapping the lane rectangles for collider channels that drive lane toggles.
- Combine with `on holding:thrust` to let thrust only adjust speed along the line, keeping motion 1D while altering tempo.
- Pair with `weapon:explosion` to distribute shockwaves that travel along the same axis for predictable reach.

## Validation

- 2025-10-03 - `node scripts/generate_metadata.js` (ensured reference coverage)
