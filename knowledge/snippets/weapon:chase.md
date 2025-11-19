# weapon:chase

| Primary Role | Projectile that actively pursues moving targets |
| --- | --- |
| Reference Games | `accel_b` - reference/games/accel_b.js:140-151, `sight_on` - reference/games/sight_on.js:143-144 |
| LLM Status | draft |

## Snippet
```js
  remove(playerMissiles, (m) => {
    m.pos.add(m.vel);
    m.pos.x += sqrt(difficulty) - scr;
    // ... explosion logic ...
    const d = m.pos.distanceTo(m.target);
    if (d < 9 || m.pos.y > 95 || m.ticks > 120) {
      play("powerUp");
      m.exTicks = 1;
      const s = m.vel.length;
      m.vel.set().addWithAngle(m.pos.angleTo(m.target), s);
    }
    const mv =
      (sqrt(difficulty) / sqrt(d + 9)) *
      (m.ticks < 9 ? 0.1 : m.ticks < 20 ? 3 : 1);
    m.vel.addWithAngle(m.pos.angleTo(m.target), mv);
    m.vel.mul(m.ticks < 20 ? 0.7 : 0.95);
    m.ticks += sqrt(difficulty);
    // ... rendering ...
  });
```

## Dependencies
- Entity properties: `pos`, `vel`, `target`, `ticks`, `exTicks` - position, velocity, target reference, age timer, explosion timer
- Global: `playerMissiles` - array of homing projectiles
- Global: `scr`, `difficulty` - scrolling offset, difficulty scaling
- API: `remove`, `sqrt`, `play`, `distanceTo`, `angleTo`, `addWithAngle` - Crisp Game Library helpers

## Integration Notes
- Homing formula: `vel.addWithAngle(pos.angleTo(target), mv)` applies steering force toward target each frame.
- Adaptive steering: `mv = (sqrt(difficulty) / sqrt(d + 9)) * stageFactor` increases turn rate when close to target.
- Stage-based acceleration: weak initial turn (`0.1` for ticks < 9), aggressive mid-flight (`3` for ticks < 20), stable cruise (`1` afterward).
- Damping: `vel.mul(0.7..0.95)` prevents runaway speed; lower value = sharper turns.
- Detonation trigger: explode when distance < 9, timeout (ticks > 120), or boundary collision (y > 95).
- Compatible with `weapon:auto_aiming` (target selection), `weapon:smoke` (trail particle effect via `smokeTicks`).
- Visual: draw missile as oriented bar (`bar(m.pos, 3, 2, m.vel.angle)`) and smoke trail particles.
- Balance: tune `mv` multiplier stages for difficulty curve; aggressive early turns vs late-game precision.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/accel_b.js:127-164` - code compiles, references verified
