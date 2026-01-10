# on pressed:turn

| Primary Role    | Reverse player movement direction on button press                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Reference Games | `paku_paku` - reference/games/paku_paku.js:68-156, `thunder` - reference/games/thunder.js:38-120, `zone_b` - reference/games/zone_b.js:60-146 |
| LLM Status      | draft                                                                                                                       |

## Snippet

```js
if (!ticks) {
  player = { x: 40, vx: 1 };
  enemy = { x: 100, eyeVx: 0 };
  multiplier = 0;
  addDots();
  powerTicks = animTicks = 0;
}
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
color("green");
const ai = floor(animTicks / 7) % 4;
const sprite = addWithCharCode("a", ai === 3 ? 1 : ai);
char(sprite, player.x, 30, { mirror: { x: player.vx } });
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

- Global: `ticks`, `difficulty`, `player`, `enemy`, `dots`, `multiplier`, `powerTicks`, `animTicks`
- Functions: `addDots`, `remove`, `color`, `text`, `char`, `addWithCharCode`, `play`, `addScore`
- API: `input.isJustPressed`, `floor`
- Rendering: sprite frames `"a"`, `"f"`, `"g"` must exist in the character set

## Integration Notes

- Wrap your player coordinate when crossing screen edges to preserve continuous loops.
- Maintain `enemy.eyeVx` externally; this block assumes zero indicates a chaser that only reacts when powered pellets are active.
- `addDots()` should seed `dots` with `{ x, isPower }` entries before this loop runs.
- Tune `0.5 * difficulty` to adjust travel speed after each flip.
- Layering with `on pressed:shoot` turns each reversal into an attack window, while mixing with `field:bottomless` keeps route selection tense in scrolling arenas.

## Validation

- 2025-09-30 - Manual snippet extraction and formatting check (no runtime executed)
