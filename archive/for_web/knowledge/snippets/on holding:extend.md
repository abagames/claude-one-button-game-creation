# on holding:extend

| Primary Role | Continuously increase size or range while button is held |
| --- | --- |
| Reference Games | `growth` - reference/games/growth.js:30-75, `pin_climb` - reference/games/pin_climb.js:42-91, `square_bar` - reference/games/square_bar.js:30-108 |
| LLM Status | draft |

## Snippet
```js
  let scr = player.x > 9 ? (player.x - 9) * 0.5 : 0;
  color("light_blue");
  rect(0, floorY, 200, 10);
  if (input.isJustPressed) {
    play("laser");
  }
  player.size += ((input.isPressed ? 50 : 5) - player.size) * clamp(player.vx, 1, 999) * 0.01;
  player.vx += (15 / player.size - 1) * 0.02 * sqrt(difficulty);
  player.x += player.vx - scr;
  if (player.x + player.size / 2 < 1) {
    end();
  }
  color("yellow");
  rect(0, floorY, player.x + player.size / 2, -player.size);
  nextEnemyDist -= scr;
  if (nextEnemyDist < 0) {
    let size = rnd() < 0.8 ? 3 : rnd(5) * rnd(5) + 3;
    if (size < 7) {
      size = 3;
    }
    enemies.push({ x: 400, size });
    nextEnemyDist += rnd(30, 50);
  }
  remove(enemies, (e) => {
    e.x -= scr;
    color(e.size > player.size ? "red" : "cyan");
    const sc = e.x > 100 ? (e.x - 100) / 300 + 1 : 1;
    const sz = e.size / sc;
    if (rect(e.x / sc, floorY, sz, -sz).isColliding.rect.yellow) {
      if (e.size > player.size) {
        play("explosion");
        end();
      } else {
        play(e.size < 5 ? "hit" : "powerUp");
        const ss = sqrt(e.size);
        particle(e.x, floorY - e.size / 2, ss, ss, 0, PI / 2);
        addScore(ceil(clamp(player.vx, 1, 999) * e.size), e.x, floorY - player.size);
      }
      return true;
    }
  });
```

## Dependencies
- Global: `player` object with `{ x, vx, size }`
- Globals: `enemies`, `nextEnemyDist`, `floorY`, `difficulty`
- Functions: `color`, `rect`, `play`, `end`, `clamp`, `sqrt`, `rnd`, `remove`, `particle`, `addScore`, `ceil`
- API: `input.isPressed`, `input.isJustPressed`

## Integration Notes
- Reuse the growth curve for tether mechanics (`player:rotate`) by mapping `player.size` to cord length; both rely on smooth easing toward a target when held.
- Pair with `field:pins` so each new anchor requires you to extend before latching; defeating enemies can reset `nextEnemyDist` to pace pin spawning.
- Combine with `weapon:explosion` to convert the fully extended state into an explosive discharge when released.

## Validation
- 2025-10-03 - `node scripts/generate_metadata.js` (regenerated tag mappings after snippet creation)
