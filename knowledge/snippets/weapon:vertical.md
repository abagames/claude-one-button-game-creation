# weapon:vertical

| Primary Role | Projectiles fired perpendicular to player facing or movement direction |
| --- | --- |
| Reference Games | `foot_laser` - reference/games/foot_laser.js:120-155, `up_shot` - reference/games/up_shot.js:71-85, `reflector` - reference/games/reflector.js:76-90 |
| LLM Status | draft |

## Snippet
```js
  if (!player.isOnFloor) {
    player.nextShotTicks--;
    if (player.nextShotTicks < 0) {
      player.shots.push(vec(player.pos.x + 2, player.pos.y + 9));
      player.nextShotTicks += rnd(4, 9);
    }
  }
  // ... player movement ...
  if (!player.isOnFloor) {
    color("light_blue");
    rect(player.pos.x + 2, player.pos.y, 2, floorHeight - player.pos.y);
  }
  color("purple");
  remove(player.shots, (s) => {
    if (s.y > floorHeight) {
      particle(player.pos.x + 3, floorHeight, 3, 3, -PI / 2, PI / 7);
      return true;
    }
    rect(s, 2, -9);
    s.y += 6;
  });
```

## Dependencies
- Global: `player` - object with `{ pos, shots[], nextShotTicks, isOnFloor }`
- Global: `floorHeight` - vertical boundary for shot termination
- API: `vec`, `remove`, `rect`, `particle`, `rnd` - Crisp Game Library helpers

## Integration Notes
- Vertical firing: shots spawn below player (`pos.y + 9`) and travel downward (`s.y += 6`).
- Conditional firing: only shoot while airborne (`!player.isOnFloor`) to differentiate from grounded state.
- Auto-fire pattern: decrement `nextShotTicks`, spawn shot when < 0, reset timer with randomized interval (`rnd(4, 9)`).
- Visual feedback: draw aiming line downward (`rect(player.pos.x + 2, player.pos.y, 2, floorHeight - player.pos.y)`) while airborne.
- Termination: remove shot when reaching floor (`s.y > floorHeight`), spawn impact particles.
- Compatible with `player:jump` (airborne state tracking), `weapon:auto` (similar auto-fire pattern).
- Directional variation: reverse for upward shots (e.g., `s.y -= 6`, spawn at `pos.y - offset`).
- Balance: tune shot interval (`rnd(4, 9)`) and speed (`s.y += 6`) for coverage vs precision trade-off.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/foot_laser.js:120-155` - code compiles, references verified
