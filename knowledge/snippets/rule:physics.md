# rule:physics

| Primary Role | Physics simulation with velocity, gravity, and collision response |
| --- | --- |
| Reference Games | `flip_o` - reference/games/flip_o.js:24-128, `descent_s` - reference/games/descent_s.js:40-132 |
| LLM Status | draft |

## Snippet
```js
  remove(balls, (b) => {
    b.pp.set(b.pos);
    b.vel.y += 0.1;
    b.vel.mul(0.99);
    b.pos.add(vec(b.vel).mul(sqrt(difficulty) * 0.5));
    b.pos.y += scr;
    b.angle += b.vel.x * 0.03 + b.vel.y * 0.02;
    color("black");
    const c = arc(b.pos, ballRadius, 3, b.angle, b.angle + PI * 2).isColliding.rect;
    if (c.red || c.cyan) {
      addScore(b.multiplier * balls.length, b.pos);
      b.multiplier++;
      color("transparent");
      const cx = arc(b.pp.x, b.pos.y, ballRadius).isColliding.rect;
      const cy = arc(b.pos.x, b.pp.y, ballRadius).isColliding.rect;
      if (!(cx.red || cx.cyan)) {
        reflect(b, b.vel.x > 0 ? -PI : 0);
      }
      if (!(cy.red || cy.cyan)) {
        reflect(b, b.vel.y > 0 ? -PI / 2 : PI / 2);
      }
    }
    if (c.light_cyan) {
      play("hit");
      reflect(b, PI / 2, "light_cyan");
    }
    if (c.light_blue) {
      play("hit");
      reflect(b, b.pos.x < 50 ? 0 : PI, "light_blue");
    }
    if (c.blue) {
      reflect(b, b.pos.x < 50 ? 0.5 - PI / 2 : PI - 0.5 + PI / 2, "blue");
    }
    if (c.purple && input.isJustPressed) {
      play("laser");
      reflect(b, PI, "purple");
    }
    return b.pos.y > 105;
  });
```

## Dependencies
- Global: `balls` array of `{ pos, pp, vel, angle, multiplier }`
- Global: `scr`, `ballRadius`, `difficulty`
- Functions: `remove`, `vec`, `arc`, `reflect`, `addScore`, `color`, `play`
- API: `input.isJustPressed`, `sqrt`, `PI`
- Rendering: relies on Crisp color channels (`red`, `cyan`, `light_cyan`, `blue`, `purple`) to encode targets

## Integration Notes
- Ensure each ball stores its previous position `pp` for axis-aligned collision fallback.
- Call this block after drawing bumpers so the collision mask data is current before `arc()` queries.
- Adjust damping (`b.vel.mul(0.99)`) and gravity (`b.vel.y += 0.1`) to tailor responsiveness for heavier objects.
- Maintain `scr` as the upward scroll offset to mimic a vertical table; set to `0` if no scroll is needed.
- Works cleanly with `field:bottomless` scroll or `player:reflect` wall placement so rebounds respect shared color channels, and supports `weapon:artillery` shots by reusing the `reflect` helper for projectiles.

## Validation
- 2025-09-30 - Manual snippet extraction and formatting check (no runtime executed)
