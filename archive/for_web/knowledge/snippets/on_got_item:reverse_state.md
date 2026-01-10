# on_got_item:reverse_state

| Primary Role | Collecting item inverts fundamental game physics or player state |
| --- | --- |
| Reference Games | `mirror_floor` - reference/games/mirror_floor.js:134-141, `rebirth` - reference/games/rebirth.js:200-220, `lift_up` - reference/games/lift_up.js:141-145 |
| LLM Status | draft |

## Snippet
```js
  remove(coins, (c) => {
    c.x -= scr;
    color(player.side === 1 ? "yellow" : "light_yellow");
    const cl = char("c", c).isColliding.char;
    color(player.side === 1 ? "light_yellow" : "yellow");
    char("c", c.x, c.y + 8);
    if (cl.a || cl.b) {
      play("coin");
      addScore(multiplier, c);
      multiplier++;
      player.side *= -1;
      player.vy *= -1;
      player.y = player.my;
      return true;
    }
    if (c.x < -3) {
      if (multiplier > 1) {
        multiplier--;
      }
      return true;
    }
  });
```

## Dependencies
- Global: `coins` - array of collectible item positions
- Global: `scr` - scrolling speed (difficulty-based)
- Global: `player` - object with `{ side, vy, y, my }` where `side` is `1 | -1`
- Global: `multiplier` - score combo counter
- API: `remove`, `char`, `color`, `play`, `addScore` - Crisp Game Library helpers

## Integration Notes
- Collision with coin item triggers gravity flip (`player.side *= -1`) and velocity reversal (`player.vy *= -1`).
- `player.y = player.my` mirrors player to opposite floor/ceiling position (requires mirrored floor tracking via `player.my`).
- Compatible with `field:gravity` (requires bidirectional gravity support), `player:bounce` or `player:jump` (vertical movement systems).
- Combines well with `rule:combo_multiplier` (increments `multiplier++` on collection).
- Conflicts with `on_got_item:power_up` if both modify velocity; decide precedence or merge effects.
- Visual feedback: draw mirrored player sprite with `mirror: { y: -player.side }` option.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/mirror_floor.js:128-149` - code compiles, references verified
