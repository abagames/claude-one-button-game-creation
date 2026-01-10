# field:bottomless

| Primary Role | Infinite scrolling playfield with continuously spawning platforms or terrain |
| --- | --- |
| Reference Games | `jujump` - reference/games/jujump.js:22-104, `holes` - reference/games/holes.js:33-107, `catapult` - reference/games/catapult.js:28-128 |
| LLM Status | draft |

## Snippet
```js
  if (!ticks) {
    p = vec(50, 50);
    v = vec();
    floors = [vec(50, 70)];
    jumpWay = jumpPower = floorAppDist = 1;
  }
  p.add(v);
  v.y += input.isPressed ? 0.05 : 0.1;
  score += scr = (p.y < 30 ? (30 - p.y) * 0.1 : 0) + difficulty * 0.1;
  if ((floorAppDist -= scr) < 0) {
    floorAppDist = rnd(99);
    floors.push(vec(rnd(99), -9));
  }
  p.y += scr;
  color("blue");
  floors = floors.filter((f) => {
    f.y += scr;
    box(f, 33, 7);
    return f.y < 99;
  });
  color("transparent");
  for (;;) {
    if (!box(p, 7, 7).isColliding.rect.blue) break;
    p.y--; v.set();
    jumpPower = 1;
  }
  color("green");
  box(p, 7, 7);
  if (input.isJustPressed) {
    play("jump");
    v.x = jumpWay *= -1;
    v.y = -3 * jumpPower;
    jumpPower *= 0.7;
  }
  if (p.y > 99) {
    play("explosion");
    end();
  }
```

## Dependencies
- Global: `p`, `v`, `floors`, `jumpWay`, `jumpPower`, `floorAppDist`, `scr`, `score`
- Global: `difficulty`, `ticks`
- Function: `vec`, `rnd`, `box`, `color`, `play`, `end`
- API: `input.isPressed`, `input.isJustPressed`
- Rendering helpers rely on Crisp Game Library defaults (view size 100x100)

## Integration Notes
- Call from the main `update()` loop to keep platform positions and player scroll in sync.
- Ensure `floors` contains vectors representing the center of each spawned platform; platforms are culled when their `y` exceeds 99.
- Reset `jumpWay` and `jumpPower` when landing so movement alternates correctly; this snippet assumes no other systems modify them concurrently.
- Pair with vertical escalation tags such as `rule:physics` to reuse the same scroll value for airborne hazards, or with `weapon:artillery` so respawned ledges double as artillery perches.
- Tune gravity and scroll constants (`0.05`, `0.1`, `difficulty * 0.1`) to match your level pacing if view size changes, and align the scroll speed with `player:rotate` tethers to avoid desync when mixing mechanics.

## Validation
- 2025-09-30 - Manual snippet extraction and formatting check (no runtime executed)
