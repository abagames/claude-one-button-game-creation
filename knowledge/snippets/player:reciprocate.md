# player:reciprocate

| Primary Role | Player oscillates between boundaries with directional control |
| --- | --- |
| Reference Games | `reflector` - reference/games/reflector.js:66-154, `ball_tour` - reference/games/ball_tour.js:72-142, `tr_beam` - reference/games/tr_beam.js:44-128 |
| LLM Status | draft |

## Snippet
```js
  color("light_black");
  rect(0, 90, 100, 10);
  if (
    input.isJustPressed ||
    (ufo.pos.x < 3 && ufo.vx < 0) ||
    (ufo.pos.x > 97 && ufo.vx > 0)
  ) {
    play("select");
    ufo.vx *= -1;
  }
  if (input.isPressed) {
    ufo.power += (1 - ufo.power) * 0.05;
  } else {
    ufo.power *= 0.9;
  }
  ufo.pos.x += ufo.vx * sqrt(difficulty) * (input.isPressed ? 0.5 : 1) * 0.5;
  if (!input.isPressed) {
    ufo.angle = clamp(
      ufo.angle - ufo.vx * sqrt(difficulty) * 0.07,
      -PI / 4,
      PI / 4
    );
  }
  color("black");
  char(addWithCharCode("a", floor(ticks / 15) % 2), ufo.pos);
  color("blue");
  bar(
    vec(ufo.pos).addWithAngle(ufo.angle + PI / 2, 6),
    9 - ufo.power * 9,
    3 + ufo.power * 3,
    ufo.angle
  );
```

## Dependencies
- Global: `ufo` - active shuttle state with `{ pos, vx, angle, power }` (`reference/games/reflector.js:66`)
- Global: `difficulty` - difficulty scalar used for speed and acceleration normalization
- Global: `ticks` - frame counter driving animation swap cadence
- Helper: `vec` - returns copy for bar positioning (`reference/games/reflector.js:15`)
- Helper: `clamp` - bounds the aim angle within control range (`reference/games/reflector.js:15`)
- API: `color`, `rect`, `play`, `char`, `bar`, `sqrt`, `PI` - Crisp Game Library drawing and math utilities

## Integration Notes
- Call inside `update()` once `ufo` has been initialized and before spawning enemy actors so the position update informs downstream logic.
- Mirror this snippet alongside obstacle movement that references `ufo.pos.x`; reciprocation speed assumes a horizontal stage width near 100 units.
- When adapting, ensure taps invert `ufo.vx` and that `input.isPressed` toggles between full-speed travel and half-speed while charging.
- Combo with `on holding:move` to reuse the same throttle system across air-rail and ground lanes, or add `weapon:artillery` so charge time maps cleanly to the reciprocation power meter.

## Validation
- 2025-09-30 - Manual extraction - snippet recorded; build not rerun because `npm run generate` remains blocked pending generator restoration
