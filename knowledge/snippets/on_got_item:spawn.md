# on_got_item:spawn

| Primary Role | Collecting item spawns additional player entities or increases capacity |
| --- | --- |
| Reference Games | `in_tow` - reference/games/in_tow.js:127-134, `t_lanes` - reference/games/t_lanes.js:200-209, `two_faced` - reference/games/two_faced.js:172-184 |
| LLM Status | draft |

## Snippet
```js
  remove(floors, (f) => {
    f.pos.x -= scr;
    color("light_yellow");
    const c = box(f.pos, f.width, 4).isColliding.rect;
    // ... other logic ...
    if (f.hasChick) {
      color("black");
      const c = char("c", f.pos.x, f.pos.y - 5).isColliding.char;
      if (c.a || c.b) {
        if (chicks.length < 30) {
          chicks.push({ index: 0, targetIndex: 0 });
        }
        play("select");
        addScore(chicks.length, f.pos.x, f.pos.y - 5);
        f.hasChick = false;
      }
    }
    return f.pos.x < -f.width / 2;
  });
```

## Dependencies
- Global: `chicks` - array of spawned follower entities
- Global: `scr` - scrolling speed
- API: `remove`, `box`, `char`, `color`, `play`, `addScore` - Crisp Game Library helpers
- Entity property: `hasChick` - boolean flag indicating spawn item availability on platform

## Integration Notes
- Collision with spawn item (`char "c"`) triggers addition of new entity to `chicks` array.
- Cap at 30 followers to prevent performance issues (`chicks.length < 30`).
- Score scales with current follower count (`addScore(chicks.length, ...)`), rewarding late-game collection.
- Compatible with `player:multiple` (multi-character management), `on_holding:extend` (follower chain visualization).
- Combine with `on pressed:throw` or `weapon:*` to consume spawned characters as resources.
- Visual feedback: draw follower characters trailing behind player at positions from `bird.posHistory` array (see in_tow.js:138-144).

## Validation
- 2025-10-05 - Manual extraction from `reference/games/in_tow.js:115-137` - code compiles, references verified
