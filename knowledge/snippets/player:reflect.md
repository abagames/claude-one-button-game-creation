# player:reflect

| Primary Role | Control projectile trajectory by placing reflective surfaces |
| --- | --- |
| Reference Games | `vh_walls` - reference/games/vh_walls.js:56-128, `bamboo` - reference/games/bamboo.js:48-140, `line_b` - reference/games/line_b.js:44-126 |
| LLM Status | draft |

## Snippet
```js
  remove(walls, (w) => {
    //@ts-ignore
    color(`${w.isFixed ? "light_" : ""}${w.angle === 0 ? "blue" : "cyan"}`);
    const wd = w.isFixed ? 100 : 20;
    const c = box(w.pos, w.angle === 0 ? 2 : wd, w.angle === 0 ? wd : 2)
      .isColliding.rect;
    if (!w.isFixed && (c.purple || c.blue || c.cyan)) {
      particle(w.pos);
      return true;
    }
    if (c.red) {
      play("explosion");
      color("purple");
      text("X", w.pos);
      if (w.angle === 0) {
        text("X", w.pos.x, target.pos.y);
      } else {
        text("X", target.pos.x, w.pos.y);
      }
      end();
    }
    if (c.green) {
      play("hit");
      if (w.angle === 0) {
        ball.vel.x *= -1;
        ball.pos.x = w.pos.x + ball.vel.x * 4;
      } else {
        ball.vel.y *= -1;
        ball.pos.y = w.pos.y + ball.vel.y * 4;
      }
    }
  });
```

## Dependencies
- Global: `walls` – array of wall descriptors `{ pos, angle, isFixed }` iterated each frame
- Global: `ball` – active projectile with `pos` and `vel` vectors receiving reflections
- Global: `target` – shared target state whose collision color cues drive scoring and failure
- API: `remove`, `color`, `box`, `particle`, `play`, `text`, `end` – Crisp helpers for iteration, rendering, FX, and game over
- Constant: `difficulty` (indirect) – upstream speed scaling that determines collision frequency

## Integration Notes
- Run after updating `ball.pos` so contact checks reflect the latest trajectory.
- Preserve the `isFixed` flag to prevent freshly placed walls from surviving target collisions and to control removal logic.
- Adjust the `wd` span (100 vs. 20) if your playfield dimensions differ; horizontal (`angle === 0`) vs. vertical walls rely on these lengths.
- Mirror the `target` collision colors if your goal objects differ; red triggers failure, green grants a bounce reward.
- Combining with `rule:physics` keeps reflections consistent with gravity tables, and pairing with `field:outpost` lets the same wall array double as a defensive perimeter.

## Validation
- 2025-09-30 - Manual review of `reference/games/vh_walls.js:56-128`; snippet extracted and dependencies recorded (no runtime test pending engine restoration)
- 2025-09-30 - `node -e "console.log(require('./knowledge/tag_code_map.json')['player:reflect'].some(e=>e.slug==='vh_walls'))"` - confirmed tag mapping includes `vh_walls`
