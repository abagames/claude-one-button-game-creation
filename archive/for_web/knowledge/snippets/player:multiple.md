# player:multiple

| Primary Role | Control multiple player characters simultaneously |
| --- | --- |
| Reference Games | `survivor` - reference/games/survivor.js:80-159, addPlayers:213-218, addPlayer:220-231 |
| LLM Status | draft |

## Snippet
```js
  players = players.filter((p) => {
    p.ticks++;
    if (p.underFoot == null) {
      players.forEach((ap) => {
        if (p !== ap && p.isOnFloor && p.pos.distanceTo(ap.pos) < 4) {
          play("select");
          let bp = p;
          for (let i = 0; i < 99; i++) {
            if (bp.underFoot == null) {
              break;
            }
            bp = bp.underFoot;
          }
          let tp = ap;
          for (let i = 0; i < 99; i++) {
            if (tp.onHead == null) {
              break;
            }
            tp = tp.onHead;
          }
          tp.onHead = bp;
          bp.underFoot = tp;
        }
      });
    }
    if (
      input.isJustPressed &&
      (p.isOnFloor || (p.underFoot != null && p.underFoot.isJumped))
    ) {
      play("jump");
      p.vel.set(0, -1.5);
      particle(p.pos, 10, 2, PI / 2, 0.5);
      p.isOnFloor = false;
      p.isJumping = true;
      if (p.underFoot != null) {
        p.underFoot.onHead = undefined;
        p.underFoot = undefined;
      }
    }
    if (p.underFoot != null) {
      p.pos.set(p.underFoot.pos).add(0, -6);
      p.vel.set();
    } else {
      p.pos.add(p.vel.x * difficulty, p.vel.y * difficulty);
      p.vel.x *= 0.95;
      if ((p.pos.x < 7 && p.vel.x < 0) || (p.pos.x >= 77 && p.vel.x > 0)) {
        p.vel.x *= -0.5;
      }
    }
    return p.pos.y < 120;
  });
```

## Dependencies
- Global: `players` – array of player objects with `pos`, `vel`, `isOnFloor`, `underFoot`, `onHead` properties
- Global: `difficulty` – scaling factor for movement speed
- Player object structure: `{ pos: Vector, vel: Vector, isOnFloor: boolean, isJumping: boolean, underFoot: Player|undefined, onHead: Player|undefined, ticks: number }`
- API: `input.isJustPressed` – single button press detection for jumping
- API: `play`, `particle`, `vec` – engine helpers for audio, visual effects, and vector operations

## Integration Notes
- Initialize `players` array during game setup, populate with `addPlayer()` function that creates players with randomized starting positions
- Each player tracks vertical stacking relationships via `underFoot` (player below) and `onHead` (player above) references
- Automatic stacking occurs when players are within distance 4 of each other on the ground
- Single button press controls all players simultaneously - stacked players move together, unstacked players jump independently
- Players outside the screen bounds (y > 120) are filtered out automatically
- The 99-iteration loops prevent infinite chains when traversing stacked player relationships

## Validation
- 2025-10-03 - Manual trace of `reference/games/survivor.js:80-159` to confirm multi-player stacking and movement mechanics
- 2025-10-03 - Cross-check with `knowledge/tag_code_map.json` entry for `player:multiple` prior to extraction