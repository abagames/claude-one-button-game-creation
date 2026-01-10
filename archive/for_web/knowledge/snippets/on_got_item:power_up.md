# on_got_item:power_up

| Primary Role | Collecting item grants temporary power state with gameplay advantages |
| --- | --- |
| Reference Games | `hopping_p` - reference/games/hopping_p.js:182-196, `paku_paku` - reference/games/paku_paku.js:112-130, `up_1_way` - reference/games/up_1_way.js:175-192 |
| LLM Status | draft |

## Snippet
```js
  function checkCollision(h, c) {
    // ... other collision types ...
    if (h.type === "power") {
      if (c.o) {
        play("powerUp");
        color("yellow");
        particle(h.pos, 29, 3);
        powerTicks = floor(
          (300 / sqrt(difficulty)) * sqrt(sqrt(hoppings.length))
        );
        hoppings.forEach((h) => {
          if (h.type !== "player") {
            h.vel.x *= -1;
            h.vx *= -1;
          }
        });
        return false;
      }
    }
    return true;
  }
```

## Dependencies
- Global: `powerTicks` - countdown timer controlling power-up duration
- Global: `hoppings` - array of all active entities (`player`, `enemy`, `power`)
- Global: `difficulty` - used to scale power-up duration
- API: `play`, `color`, `particle` - Crisp Game Library sound/visual effects
- API: `floor`, `sqrt` - standard math functions

## Integration Notes
- Collision detection with power item (type `"power"`) triggers temporary invincibility state via `powerTicks` timer.
- Duration formula `(300 / sqrt(difficulty)) * sqrt(sqrt(hoppings.length))` balances player advantage: shorter duration at high difficulty or many enemies.
- Side effect: reverses all non-player entity velocities (`h.vel.x *= -1, h.vx *= -1`) to create tactical breathing room.
- Integrate with `player:bounce` or similar movement systems that check `powerTicks > 0` to alter collision behavior (e.g., enemies become destroyable instead of lethal).
- Compatible with `rule:combo_multiplier` (power-up state can multiply score per enemy defeated).
- Conflicts with `on_got_item:reverse_state` if both reverse velocities (decide which takes precedence or merge behaviors).

## Validation
- 2025-10-05 - Manual extraction from `reference/games/hopping_p.js:182-196` - code compiles, references verified
