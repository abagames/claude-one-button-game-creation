# on released:throw

| Primary Role | Charge power while holding, release to launch |
| --- | --- |
| Reference Games | `cast_n` - reference/games/cast_n.js:73-123, `number_ball` - reference/games/number_ball.js:44-122, `mortar` - reference/games/mortar.js:68-138 |
| LLM Status | draft |

## Snippet
```js
  if (nodesState === "ready" && input.isJustPressed) {
    play("select");
    throwPower = 1;
    nodesState = "angle";
    multiplier = 1;
  }
  if (nodesState === "angle") {
    throwPower += 0.05 * sqrt(difficulty);
    const a = 0.1 - throwPower * 0.2;
    line(startPos, vec(startPos).addWithAngle(a, throwPower * 5 + 3), 2);
    if (input.isJustReleased || throwPower > 3) {
      play("jump");
      throwPower = clamp(throwPower, 1, 3);
      nodesState = "throw";
      nodes[0].vel.set(sqrt(difficulty) * throwPower).rotate(a);
    }
  }
  if (nodesState === "throw") {
    const head = nodes[0];
    head.pos.x = clamp(head.pos.x, 0, 147);
    if (!char("a", head.pos).isColliding.rect.light_yellow) {
      const py = head.pos.y;
      head.pos.add(head.vel);
      if (py < waterY && head.pos.y >= waterY) {
        head.vel.x = 0;
        head.vel.y *= 0.1;
      }
      head.vel.y += (head.pos.y < waterY ? 0.05 : 0.01) * difficulty;
      head.vel.mul(0.99);
    }
    if (input.isJustPressed) {
      play("powerUp");
      nodesState = "pull";
    }
  }
```

## Dependencies
- Globals: `nodesState`, `nodes`, `throwPower`, `multiplier`, `difficulty`, `waterY`, `startPos`
- Functions: `play`, `line`, `vec`, `clamp`, `sqrt`, `char`, `addWithAngle`
- API: `input.isJustPressed`, `input.isJustReleased`

## Integration Notes
- Connect to `weapon:artillery` to reuse the charged angle and velocity when spawning explosive shells.
- Pair with `field:lanes` so released projectiles must pass through discrete corridors that change when an ally lane toggles.
- Combine with `on holding:extend` by mapping the same charge timer to tether length, signaling when a throw is optimal; update tail node constraints alongside this block to keep the rope synced.

## Validation
- 2025-10-03 - `node scripts/generate_metadata.js` (refresh after snippet creation)
