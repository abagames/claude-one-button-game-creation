# player:bounce

| Primary Role | Player character bounces or reflects off surfaces (walls, floors, ceilings) |
| --- | --- |
| Reference Games | `hopping_p` - reference/games/hopping_p.js:118-164 |
| LLM Status | draft |
| Available Variants | `player:bounce_horizontal.md` (wall reflection + direction control) |

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
- Function: `drawHopping` - renders the hopping sprite and returns collision info (`reference/games/hopping_p.js:200`)
- Function: `checkCollision` - resolves hits with enemies/items and returns keep/remove flag (`reference/games/hopping_p.js:166`)
- API: `input.isJustPressed` - Crisp Game Library input edge detection
- API: `play`, `particle`, `color`, `box` - standard rendering/FX helpers

## Integration Notes
- **This is the base snippet** showing the most common bounce pattern (horizontal movement with ground-triggered auto-jump).
- Call inside your `update()` loop after advancing spawn timers so `hoppings` already contains the current actors.
- Ensure each hopping entity tracks `{ pos, vel, vx, hop, grv, hopTicks, type }` and that `type` matches the strings used here (`player`, `enemy`, `power`).
- World bounds (`0..199` on x, `<=90` on y) should align with your `options.viewSize`; adjust constants if using a different canvas.
- **When to use variants**:
  - Use `player:bounce_horizontal.md` if you need explicit wall reflection and player-controlled direction reversal
- Layer with `field:bottomless` or `rule:physics` vertical scroll to keep hops meaningful, and add `on pressed:turn` to let the same tap both flip direction and retime hop launches.

## Validation
- 2025-09-30 - `npm run generate` - failed (`src/generator.js` missing; build pipeline needs restoration before runtime check)
