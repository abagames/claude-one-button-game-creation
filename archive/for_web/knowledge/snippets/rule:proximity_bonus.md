# rule:proximity_bonus

| Primary Role | Reward increases based on proximity to hazards or targets |
| --- | --- |
| Reference Games | `slashes` - reference/games/slashes.js:79-90, `meteo_planet` - reference/games/meteo_planet.js:85-105, `thunder` - reference/games/thunder.js:152-157 |
| LLM Status | draft |

## Snippet
```js
  const c = bar(50, 90, 4, 3, pa, 0.9).isColliding.rect;
  if (c.purple) {
    play("explosion");
    end();
  } else if (c.light_purple) {
    play("laser");
    speed += 0.03 * difficulty;
    addingScore += speed;
    particle(50, 90, 3, speed * 2, pa, 0.3);
  } else {
    particle(50, 90, 1, speed, pa, 0);
    if (addingScore > 0) {
      play("powerUp");
      addScore(addingScore, 50, 90);
      addingScore = 0;
    }
  }
```

## Dependencies
- Global: `addingScore` - accumulated bonus points during proximity
- Global: `speed` - player speed, may increase with risk-taking
- Collision zones: `purple` (danger), `light_purple` (bonus zone), none (safe)
- API: `bar`, `play`, `particle`, `addScore` - Crisp Game Library helpers

## Integration Notes
- Risk-reward zones: outer zone (`light_purple`) accumulates bonus, inner zone (`purple`) kills player.
- Accumulation: while in bonus zone, increment score buffer (`addingScore += speed`) without immediate reward.
- Cash-out: when leaving bonus zone (no collision), finalize accumulated score (`addScore(addingScore, ...); addingScore = 0`).
- Secondary effect: bonus zone may boost player stats (`speed += 0.03 * difficulty`) for additional risk-taking incentive.
- Visual/audio: play continuous feedback (`laser` sound, particles) during accumulation, climax sound (`powerUp`) on cash-out.
- Compatible with `rule:combo_multiplier` (multiply cashed-out bonus), `obstacle:penalty` (contrast safe vs risky paths).
- Balance: tune accumulation rate (`addingScore += speed`) and zone widths for difficulty curve.
- Variant: proximity to multiple obstacles can stack bonuses or create "threading the needle" challenges.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/slashes.js:74-91` - code compiles, references verified
