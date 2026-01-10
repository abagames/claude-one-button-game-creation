# rule:combo_multiplier

| Primary Role | Score multiplier that increases with consecutive successes |
| --- | --- |
| Reference Games | `unctrl` - reference/games/unctrl.js:142-147, `hopping_p` - reference/games/hopping_p.js:170-177, `mirror_floor` - reference/games/mirror_floor.js:134-146 |
| LLM Status | draft |

## Snippet
```js
  color("red");
  remove(bullets, (b) => {
    b.pos.add(b.vel);
    const c = bar(b.pos, 4, 2, b.vel.angle, -0.5).isColliding;
    if (c.rect.blue) {
      play("coin");
      addScore(multiplier, b.pos);
      particle(b.pos, 9);
      if (multiplier < 64) {
        multiplier *= 2;
      }
      return true;
    }
    return !b.pos.isInRect(0, 0, 150, 100);
  });
  // On failure/reset:
  function setNextShot() {
    shot.pos.set(shotPos);
    shot.vel.set(0.5, 0.2);
    shot.state = "ready";
    multiplier = 1;
  }
```

## Dependencies
- Global: `multiplier` - current score multiplier (typically starts at 1)
- Global: `bullets` - array of enemy projectiles or targets
- API: `remove`, `bar`, `color`, `play`, `addScore`, `particle` - Crisp Game Library helpers

## Integration Notes
- Successful action (destroying enemy bullet: `c.rect.blue`) doubles multiplier up to cap (`multiplier < 64` then `multiplier *= 2`).
- Score uses current multiplier value (`addScore(multiplier, b.pos)`).
- Reset trigger: on player death, missed target, or new shot (`multiplier = 1` in `setNextShot()`).
- Common caps: 64 (unctrl), 32, 16 depending on game balance; adjust `< 64` threshold to taste.
- Compatible with `rule:chain` (both reward streaks), `on_got_item:power_up` (combine with temporary invincibility).
- Visual feedback: display multiplier as UI text or color intensity (see hopping_p.js:173 for particle scaling).
- Typical pattern: `multiplier *= 2` (exponential) or `multiplier++` (linear); exponential creates high-risk/high-reward tension.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/unctrl.js:137-147, 161-165` - code compiles, references verified
