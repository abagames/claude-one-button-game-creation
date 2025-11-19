# on pressed:jump

| Primary Role | Instantaneous impulse applied to player on button press |
| --- | --- |
| Reference Games | `floater` - reference/games/floater.js:48-132, `jujump` - reference/games/jujump.js:22-120, `survivor` - reference/games/survivor.js:24-118 |
| LLM Status | draft |

## Snippet
```js
  player.p.x -= sc;
  addScore(sc);
  if (player.on != null) {
    player.p.y = player.on.p.y - 6;
  } else {
    player.v.y += input.isPressed ? 0.05 : 0.2;
    player.p.add(player.v);
  }
  color("green");
  const pc = box(player.p, 7, 7);
  if (player.on != null) {
    if (input.isJustPressed) {
      player.v.x = 1;
      player.v.y = cos(player.on.a) * player.on.v * 20 - 1;
      player.on.isValid = false;
      player.on = undefined;
      play("jump");
    }
  } else {
    if (pc.isColliding.rect.light_black && player.v.y < 0) {
      player.v.y *= -0.25;
    }
    if (pc.isColliding.rect.blue) {
      play("laser");
      floaters.forEach((f) => {
        if (abs(f.p.x - player.p.x) < 12) {
          player.on = f;
        }
      });
    }
  }
  if (player.p.y > 99 || player.p.x < 0) {
    play("explosion");
    end();
  }
```

## Dependencies
- Global: `player` object with `{ p, v, on }`, `floaters` array, `sc` scroll speed
- Functions: `addScore`, `color`, `box`, `play`, `end`, `abs`
- API: `input.isPressed`, `input.isJustPressed`, `cos`
- Rendering: collision channels `rect.light_black` and `rect.blue` should be drawn earlier this frame

## Integration Notes
- Update `sc` (scroll rate) before this block; it both advances the level and drives score gain.
- Each floater element must expose `{ p, a, v, isValid }` so attachment and launch velocity work correctly.
- Clearing `player.on` to `undefined` enables gravity-driven free fall until another platform is detected.
- Tighten the attachment window (`abs(f.p.x - player.p.x) < 12`) if floaters are closer together.
- Combine with `field:bottomless` scrolling or `rule:physics` bumpers so post-jump arcs stay threatening, and consider pairing with `player:rotate` cords to swap between grapples and floater launches.

## Validation
- 2025-09-30 - Manual snippet extraction and formatting check (no runtime executed)
