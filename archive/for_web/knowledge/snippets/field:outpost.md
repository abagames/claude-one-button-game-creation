# field:outpost

| Primary Role | Defend a stationary position from approaching threats |
| --- | --- |
| Reference Games | `laser_fortress` - reference/games/laser_fortress.js:96-154, `rebirth` - reference/games/rebirth.js:72-134, `paint_ball` - reference/games/paint_ball.js:38-118 |
| LLM Status | draft |

## Snippet
```js
  let minX = 200;
  remove(objs, (o) => {
    o.x -= o.vx;
    if (o.type === "enemy" && o.x < minX) {
      minX = o.x;
    }
    o.ticks++;
    color(o.type === "ally" ? "blue" : "red");
    const sprite = addWithCharCode(o.type === "ally" ? "a" : "c", floor(o.ticks / 12) % 2);
    if (char(sprite, o.x, 47, { mirror: { x: -1 } }).isColliding.rect.purple) {
      if (o.type === "ally") {
        play("explosion");
        end();
      } else {
        play("hit");
        particle(o.x, 47);
        addScore(multiplier, o.x, 47);
        multiplier++;
      }
      return true;
    }
    if (o.x < 0) {
      if (o.type === "enemy") {
        play("explosion");
        color("red");
        text("X", 3, 47);
        end();
      }
      return true;
    }
  });
  if (minX < 200) {
    sightX += (minX - difficulty * 3 - 5 - sightX) * 0.3;
  }
```

## Dependencies
- Global: `objs` array of approaching units (`{ x, vx, type, ticks }`)
- Global: `multiplier`, `sightX`, `difficulty`
- Functions: `remove`, `char`, `addWithCharCode`, `color`, `particle`, `play`, `end`, `text`
- API: `floor`, `PI`, `input` (press logic handled outside this block)
- Rendering: expects fortress beam stored in `rect.purple` collision channel

## Integration Notes
- Invoke after laser collision rendering so `rect.purple` reflects the beam segment for the current frame.
- Maintain `objs` as a queue of enemy/ally objects with `type` equal to `"enemy"` or `"ally"`.
- Reset `multiplier` when a run ends; this snippet increments it only on enemy hits.
- Adjust the `minX` steering term if your cannon origin differs from `(sightX, 47)`.
- Combine with pressure tags like `on pressed:shoot` to let a single press both steer the defensive beam and spawn projectiles, or drop it over `field:bottomless` layouts so failed interceptions send attackers into void pits instead of the base.

## Validation
- 2025-09-30 - Manual snippet extraction and formatting check (no runtime executed)
