# field:holes

| Primary Role | Terrain with destructible sections that create hazardous gaps |
| --- | --- |
| Reference Games | `grenadier` - reference/games/grenadier.js:93-148, `portal_j` - reference/games/portal_j.js:48-132, `golfme` - reference/games/golfme.js:52-126 |
| LLM Status | draft |

## Snippet
```js
  color("white");
  holes = holes.filter((h) => {
    h.x -= scr;
    if (box(h.x, 70, 6, 10).isColliding.char.e) {
      return false;
    }
    return h.x > -4;
  });
  color("black");
  grenades = grenades.filter((g) => {
    g.pos.add(g.vel);
    g.vel.y += 0.1 * difficulty;
    if (text("o", g.pos).isColliding.char.e) {
      return false;
    }
    if (g.pos.y > 68) {
      play("hit");
      particle(g.pos, 10, 1, -PI / 2, PI * 0.7);
      holes.push({ x: g.pos.x });
      return false;
    }
    return true;
  });
  tanks = tanks.filter((t) => {
    t.x -= t.vx * speedRatio + scr;
    color("transparent");
    if (box(t.x, 67, 6, 6).isColliding.text.o) {
      play("explosion");
      color("red");
      particle(t.x, 67, 20, 2, -PI / 2, PI * 1.2);
      addScore(t.x, t.x, 67);
      return false;
    }
    if (t.x > 150 && pState !== "in_hole" && --t.fireTicks < 0) {
      play("laser");
      t.fireTicks = t.fireInterval;
      bullets.push({ x: t.x - 5, vx: t.fireSpeed });
    }
    return t.x > -4;
  });
```

## Dependencies
- Globals: `holes`, `grenades`, `tanks`, `bullets`, `scr`, `speedRatio`, `pState`, `difficulty`
- Functions: `color`, `box`, `text`, `play`, `particle`, `addScore`
- API: `input` (used elsewhere for player state)

## Integration Notes
- Pair with `field:spike` to mix static pits and moving hazards; share the same `scr` so both scroll consistently.
- Combine with `on released:throw` to let released grenades carve new pits while the player relocates to safety.
- Link to `player:rotate` so each new pin drop forces the tether path across fresh holes.

## Validation
- 2025-10-03 - `node scripts/generate_metadata.js` (confirm refreshed references)
