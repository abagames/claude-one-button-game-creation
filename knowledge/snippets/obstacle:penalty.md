# obstacle:penalty

| Primary Role | Targets that penalize the player when incorrectly interacted with |
| --- | --- |
| Reference Games | `charge_beam` - reference/games/charge_beam.js:185-189, addCoinPenalty:272-283 |
| LLM Status | draft |

## Snippet
```js
  if (o.type === "coin") {
    const c = char("c", o.x, 30).isColliding.char;
    if (c.d || c.e) {
      addCoinPenalty(o, c);
      return false;
    }
    if (c.b || c.c) {
      return false;
    }
  }

  function addCoinPenalty(o, c) {
    play("powerUp");
    particle(o.x, 30, 9, 5);
    if (c.e) {
      shotX = undefined;
    }
    addScore(-coinPenaltyMultiplier, o.x + sqrt(coinPenaltyMultiplier) * 4, 50);
    if (coinPenaltyMultiplier < 64) {
      coinPenaltyMultiplier *= 2;
    }
    penaltyVx += 0.5;
  }
```

## Dependencies
- Global: `coinPenaltyMultiplier` – escalating penalty value that doubles each mistake (caps at 64)
- Global: `shotX` – current weapon position, cleared when penalty object hit by beam weapon
- Global: `penaltyVx` – velocity increase applied to scrolling speed after penalty
- Object structure: `o.type === "coin"` identifies penalty objects among regular enemies
- Collision detection: `c.d` (weapon impact), `c.e` (beam weapon impact), `c.b`/`c.c` (safe collection)
- API: `char`, `play`, `particle`, `addScore`, `sqrt` – engine helpers for rendering, audio, effects, scoring

## Integration Notes
- Initialize `coinPenaltyMultiplier = 1` at game start, reset on level completion
- Penalty objects should be visually distinct from enemies (typically coins or collectibles)
- Score deduction uses negative values: `addScore(-coinPenaltyMultiplier, x, y)`
- Escalation system: penalty doubles each hit until maximum of 64 points per mistake
- Consider adding penalty immunity period or reset mechanism for difficulty balance
- Weapon cancellation (`shotX = undefined`) prevents multi-hitting the same penalty object
- Speed increase (`penaltyVx += 0.5`) makes subsequent avoidance more challenging

## Validation
- 2025-10-03 - Manual trace of `reference/games/charge_beam.js:185-189, 272-283` to confirm penalty mechanics and escalation
- 2025-10-03 - Cross-check with `knowledge/tag_code_map.json` entry for `obstacle:penalty` prior to extraction