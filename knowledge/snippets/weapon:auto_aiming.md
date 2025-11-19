# weapon:auto_aiming

| Primary Role | Weapon or targeting system that automatically tracks targets |
| --- | --- |
| Reference Games | `sight_on` - reference/games/sight_on.js:143-144, 165-171, `smoke_g` - reference/games/smoke_g.js:70-74, `b_cannon` - reference/games/b_cannon.js:170-180 |
| LLM Status | draft |

## Snippet
```js
  // Enemy auto-aiming at player target
  remove(enemies, (e) => {
    e.vel.x += wrap(e.target.pos.x - e.pos.x, -50, 50) * e.sink.x;
    e.vel.y += (e.target.pos.y - e.pos.y) * e.sink.y;
    e.vel.mul(0.997);
    e.pos.x += e.vel.x * (sqrt(difficulty) - 0.8);
    e.pos.y += e.vel.y * (sqrt(difficulty) - 0.8);
    // ... collision checks ...
  });

  // Player sight auto-aiming at nearest enemy
  sight.vel.x +=
    wrap((sightEnemy == null ? 50 : sightEnemy.pos.x) - sight.pos.x, -50, 50) *
    0.01;
  sight.vel.y +=
    ((sightEnemy == null ? 50 : sightEnemy.pos.y) - sight.pos.y) * 0.01;
  sight.vel.mul(0.97);
  sight.pos.x += sight.vel.x * (sqrt(difficulty) - 0.8);
  sight.pos.y += sight.vel.y * (sqrt(difficulty) - 0.8);
```

## Dependencies
- Entity properties: `pos`, `vel`, `target`, `sink` - position, velocity, target reference, tracking strength
- Global: `sightEnemy` - reference to nearest enemy for player aim
- Global: `difficulty` - scales movement speed
- API: `wrap`, `sqrt` - math utilities

## Integration Notes
- Tracking formula: `vel += (target.pos - pos) * sink` applies proportional steering toward target.
- `wrap(delta, -50, 50)` prevents excessive horizontal corrections across screen wrap boundaries.
- `vel.mul(0.997)` or `0.97` applies damping to prevent overshooting; adjust coefficient for responsiveness.
- Null check: default to center (`50, 50`) when no target exists.
- Speed scaling: `(sqrt(difficulty) - 0.8)` compensates for difficulty-based speed boost; adjust offset to taste.
- Compatible with `weapon:ray` (draw aiming line to target), `weapon:chase` (similar homing behavior for bullets).
- Visual feedback: draw targeting reticle or sight character at aim position (line 177: `char("b", sight.pos)`).
- Balance: tune `sink` (tracking strength) values; lower = smoother curves, higher = aggressive snap-to-target.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/sight_on.js:142-147, 165-174` - code compiles, references verified
