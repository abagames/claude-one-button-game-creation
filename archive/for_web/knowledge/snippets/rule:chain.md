# rule:chain

| Primary Role | Cascading effects that propagate through nearby game elements |
| --- | --- |
| Reference Games | `flipbomb` - reference/games/flipbomb.js:85-96, `m_rider` - reference/games/m_rider.js:100-120, `m_jamming` - reference/games/m_jamming.js:120-145 |
| LLM Status | draft |

## Snippet
```js
  bombs = bombs.filter((b) => {
    b.p.add(b.v);
    color("red");
    const bc = box(b.p, 5, 5).isColliding.rect;
    if (bc.cyan || bc.purple) {
      play("hit");
      explosions.push({ p: b.p, t: 0, a: rnds(PI) });
      color("purple");
      particle(b.p, 16, 3);
      addScore(multiplier, b.p);
      multiplier++;
      return false;
    }
    if (b.p.y > 99 || bc.blue) {
      play("explosion");
      end();
    }
    return true;
  });
```

## Dependencies
- Global: `bombs` - array of bomb entities with `{ p: Vector, v: Vector }` (position, velocity)
- Global: `explosions` - array of active explosion effects `{ p: Vector, t: number, a: number }` (position, timer, angle)
- Global: `multiplier` - score multiplier incremented per chain hit
- API: `filter`, `box`, `color`, `play`, `particle`, `addScore`, `end` - Crisp Game Library helpers

## Integration Notes
- Chain trigger: bomb collision with existing explosion (`bc.purple`) creates new explosion (`explosions.push(...)`).
- Each chained explosion increments multiplier (`multiplier++`), rewarding strategic placement for maximum chain length.
- Explosion rendering loop (lines 39-50) draws expanding/contracting purple boxes that serve as collision zones for chain detection.
- Compatible with `rule:combo_multiplier` (both increment multiplier), `weapon:explosion` (provides initial explosion trigger).
- Typical pattern: explosion array with timer (`t`), collision check against explosion color (`bc.purple`), recursive spawn on hit.
- Balance: limit chain depth or explosion duration to prevent runaway cascades (see `e.t < 30` termination in line 49).
- Visual: draw explosion with animated rotation (`e.a += 0.2`) and pulsing radius for clear feedback.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/flipbomb.js:85-103` - code compiles, references verified
