# on pressed:shoot

| Primary Role | Spawn projectiles on button press with reload constraints |
| --- | --- |
| Reference Games | `accel_b` - reference/games/accel_b.js:78-146, `scrambird` - reference/games/scrambird.js:60-146 |
| LLM Status | draft |

## Snippet
```js
  player.vx += ((input.isPressed ? 2 : 0.2) * sqrt(difficulty) - player.vx) * 0.2;
  player.pos.x += player.vx - scr;
  color("blue");
  char("a", player.pos);
  color("purple");
  rect(player.pos.x - 3, player.pos.y, -player.vx * 3, 1);
  if (playerMissiles.length === 0) {
    color("cyan");
    box(player.pos.x, player.pos.y + 3, 5, 2);
    if (input.isJustPressed) {
      play("select");
      multiplier = 1;
      enemies.forEach((e) => {
        playerMissiles.push({
          pos: vec(player.pos.x, player.pos.y + 3),
          vel: vec(sqrt(difficulty) * 2),
          target: e.pos,
          ticks: 0,
          exTicks: 0,
          smokeTicks: 0,
        });
      });
      missiles.forEach((m) => {
        playerMissiles.push({
          pos: vec(player.pos.x, player.pos.y + 3),
          vel: vec(sqrt(difficulty) * 2),
          target: m.pos,
          ticks: 0,
          exTicks: 0,
          smokeTicks: 0,
        });
      });
    }
  }
```

## Dependencies
- Global: `player`, `playerMissiles`, `enemies`, `missiles`, `multiplier`, `scr`
- Functions: `vec`, `color`, `char`, `rect`, `box`, `play`
- API: `input.isPressed`, `input.isJustPressed`, `sqrt`
- Rendering: ensure missile bay indicator (`box`) is drawn before collision checks

## Integration Notes
- Gate new shots behind `playerMissiles.length === 0` to enforce reload timing; adapt to ammo counts by relaxing the condition.
- Limit volley size by trimming `enemies` or `missiles` before pushing when you want fewer homing rockets.
- Reuse `player.pos` offsets to align muzzle across different ship sprites; adjust the `+ 3` offsets if your art differs.
- Store `target` references defensively (`{x, y}` copies) when enemy objects might be removed mid-flight.
- Rescale the boost term `(input.isPressed ? 2 : 0.2)` to tune how pre-fire acceleration feels.
- Works well atop `field:outpost` sieges (same targeting list) or `player:rotate` turrets so rotation determines the volley spread.

## Validation
- 2025-09-30 - Manual snippet extraction and formatting check (no runtime executed)
