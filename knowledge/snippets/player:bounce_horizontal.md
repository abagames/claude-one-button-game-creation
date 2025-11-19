# player:bounce_horizontal

| Primary Role | Player bounces horizontally with direction control (variant of bounce) |
| --- | --- |
| Reference Games | `hopping_p` - reference/games/hopping_p.js:118-164 |
| LLM Status | draft |
| Variant Type | Horizontal bounce with wall reflection and direction reversal |
| Use When | Games require left-right movement with automatic hopping and player-controlled direction changes |

## Snippet
```js
  hoppings = hoppings.filter((h) => {
    if (h.type === "player" && input.isJustPressed) {
      play("hit");
      h.vx *= -1;
      h.vel.x *= -1;
    }
    if (h.hopTicks > 0) {
      h.hopTicks -= difficulty;
      if (h.hopTicks <= 0) {
        color("black");
        const isPlayer = h.type === "player";
        play(isPlayer ? "jump" : "laser");
        particle(h.pos, isPlayer ? 9 : 4, -h.hop.y, -PI / 2, PI / 2);
        h.vel.set(h.hop.x * h.vx * difficulty, h.hop.y * difficulty);
      } else {
        const r = h.hopTicks < 5 ? 1 - h.hopTicks / 5 : (h.hopTicks - 5) / 5;
        color("black");
        box(h.pos.x, h.pos.y - 2 * r, 2, 4 * r);
        box(h.pos.x, h.pos.y - 5 * r, 6, 2 * r);
        const c = drawHopping(h, r);
        return checkCollision(h, c);
      }
    }
    h.pos.add(h.vel);
    h.vel.y += h.grv * difficulty * difficulty;
    if (h.pos.y > 90) {
      h.pos.y = 90;
      h.hopTicks = 9;
    }
    if ((h.pos.x < 0 && h.vx < 0) || (h.pos.x > 199 && h.vx > 0)) {
      h.vx *= -1;
      h.vel.x *= -1;
    }
    color("black");
    box(h.pos.x, h.pos.y - 2, 2, 4);
    box(h.pos.x, h.pos.y - 5, 6, 2);
    const c = drawHopping(h, 1);
    return checkCollision(h, c);
  });
```

## Dependencies
- Global: `hoppings` - array of active actors filtered in place
- Global: `difficulty` - normalizes timing for hop decay and gravity scaling
- Function: `drawHopping` - renders the hopping sprite and returns collision info
- Function: `checkCollision` - resolves hits with enemies/items and returns keep/remove flag
- API: `input.isJustPressed` - Crisp Game Library input edge detection
- API: `play`, `particle`, `color`, `box` - standard rendering/FX helpers

## Integration Notes
- Call inside your `update()` loop after advancing spawn timers so `hoppings` already contains the current actors.
- Each hopping entity must track `{ pos, vel, vx, hop, grv, hopTicks, type }` where `type` matches strings used here (`player`, `enemy`, `power`).
- World bounds (`0..199` on x, `<=90` on y) should align with your `options.viewSize`; adjust constants if using a different canvas.
- **Key characteristic**: Horizontal movement with wall reflection (lines 29-32) and tap-to-reverse (lines 2-5).
- **Compared to vertical variant**: This variant includes horizontal velocity (`vx`), wall bouncing, and player-controlled direction changes.
- Works well with `field:bottomless` or `rule:physics` vertical scroll, and `on pressed:turn` for direction control.

## Validation
- 2025-01-04 - Extracted from hopping_p.js - draft
