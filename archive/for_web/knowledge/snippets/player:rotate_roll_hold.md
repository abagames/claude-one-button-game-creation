# player:rotate (Roll Hold Turret)

| Primary Role | Rotating turret with direction control and continuous fire (variant of rotate) |
| --- | --- |
| Reference Games | `roll_hold` - reference/games/roll_hold.js:80-168, `orbit_man` - reference/games/orbit_man.js:36-126, `arcfire` - reference/games/arcfire.js:40-132 |
| LLM Status | draft |

## Snippet
```js
  if (input.isJustPressed) {
    play("select");
    turretVa *= -1;
    fireTicks = 0;
  }
  const tp = vec(turretRadius).rotate(turretAngle).add(playerPos);
  color("light_cyan");
  if (!input.isPressed) {
    turretAngle = wrap(turretAngle + turretVa * 0.07 * df, -PI, PI);
  } else {
    fireTicks -= df;
    if (fireTicks < 0) {
      play("laser");
      shots.push({ pos: vec(tp), angle: turretAngle });
      fireTicks = 9;
      particle(tp, 3, 1, turretAngle, 0.5);
    }
    bar(tp, 4, 1, turretAngle + (turretVa > 0 ? PI / 2 : -PI / 2), -0.5);
  }
  color("cyan");
  remove(shots, (s) => {
    s.pos.addWithAngle(s.angle, df * 2);
    bar(s.pos, 3, 2, s.angle);
    return !s.pos.isInRect(-9, -9, 120, 120);
  });
  color("black");
  char("a", playerPos, {
    mirror: { x: turretAngle < -PI / 2 || turretAngle > PI / 2 ? -1 : 1 },
  });
  color("blue");
  bar(tp, 2, 3, turretAngle);
```

## Dependencies
- Local: `df` – frame-scaled difficulty term shared across update logic (`reference/games/roll_hold.js:80`)
- Global: `turretAngle` – radians describing the current aim direction
- Global: `turretVa` – signed angular velocity toggled each tap
- Global: `turretRadius` – length of the rotating arm from the player anchor
- Global: `playerPos` – base position used to offset turret tip
- Global: `fireTicks` – cooldown counter that throttles shot emission
- Global: `shots` – array of active projectiles processed via `remove`
- API: `input`, `play`, `vec`, `color`, `wrap`, `bar`, `particle`, `remove`, `char` – Crisp helpers for control, audio/visuals, and iteration

## Integration Notes
- Precompute `df = sqrt(difficulty)` once per frame before this block to keep timing consistent with other systems.
- Maintain `turretVa` as either `1` or `-1`; the sign flip on each tap governs which side the turret swings toward when idle.
- Reset `fireTicks` when rewiring spawn rates; the cooldown of `9` frames assumes the global 60 FPS loop and may need scaling for different firing cadences.
- Ensure `shots` removal code runs after rendering so the iterator cannot drop newly spawned lasers in the same frame.
- The mirror logic expects the player sprite id `"a"` to face right by default; adjust if you swap character assets.
- See base snippet `knowledge/snippets/player:rotate.md` for the tether-style anchor implementation when mixing rotation modes, and consider layering with `on pressed:shoot` or `field:outpost` so toggled fire arcs defend a static base.

## Validation
- 2025-09-30 - Manual trace of `reference/games/roll_hold.js:80-180` to confirm rotation/hold behaviour and dependency map
- 2025-09-30 - Cross-check with `knowledge/tag_code_map.json` entry for `player:rotate` (`roll_hold`) prior to extraction
