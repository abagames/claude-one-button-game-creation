# on holding:shoot

| Primary Role | Continuous weapon fire while button is held |
| --- | --- |
| Reference Games | `laser_fortress` - reference/games/laser_fortress.js:84-124, `roll_hold` - reference/games/roll_hold.js:80-168, `counter_b` - reference/games/counter_b.js:52-124 |
| LLM Status | draft |

## Snippet
```js
  color("blue");
  rect(0, 50, 200, 10);
  color("light_cyan");
  rect(0, 7, 14, 22);
  char("f", 17, 8);
  if (input.isJustPressed) {
    play("select");
    laserX = sightX;
    multiplier = 1;
    color("blue");
    particle(20, 8, 9, 3, 0, PI / 8);
  }
  if (laserX != null && input.isPressed) {
    play("laser");
    color("blue");
    line(laserX, 50, 20, 8, 2);
    laserX += difficulty * 2;
    particle(laserX, 50, 1, 2, -PI / 2, PI / 6);
    color("purple");
    box(laserX - 2, 50, 5, 1);
  }
  nextObjTicks--;
  if (nextObjTicks < 0) {
    objs.push({
      x: 163,
      vx: difficulty * (nextObjCount === highSpeedIndex ? 2 : 1),
      ticks: rndi(99),
      type: nextObjType,
    });
    nextObjCount--;
    nextObjTicks = nextObjCount < 0 ? rnd(20, 30) / difficulty : rnd(5, 8) / difficulty;
  }
```

## Dependencies
- Globals: `laserX`, `sightX`, `multiplier`, `nextObjTicks`, `nextObjCount`, `highSpeedIndex`, `nextObjType`, `objs`, `difficulty`
- Functions: `color`, `rect`, `char`, `play`, `particle`, `line`, `box`, `rnd`, `rndi`
- API: `input.isPressed`, `input.isJustPressed`

## Integration Notes
- Layer with `field:outpost` so the same purple collision channel handles both the sustained beam and base defense logic.
- Combine with `player:rotate` (or its turret variant) to swivel the beam origin while the button is held, switching `laserX` updates to match angular shots.
- Pair with `weapon:explosion` to trigger an overheat detonation when the player releases after a long hold.

## Validation
- 2025-10-03 - `node scripts/generate_metadata.js` (verifies source references after snippet addition)
