# player:rotate

| Primary Role | Player moves in circular motion around a pivot or tether point |
| --- | --- |
| Reference Games | `pin_climb` - reference/games/pin_climb.js:42-118, `roll_hold` - reference/games/roll_hold.js:80-168, `revolve_a` - reference/games/revolve_a.js:36-124 |
| LLM Status | draft |

## Snippet
```js
  let scr = difficulty * 0.02;
  if (cord.pin.y < 80) {
    scr += (80 - cord.pin.y) * 0.1;
  }
  if (input.isJustPressed) {
    play("select");
  }
  if (input.isPressed) {
    cord.length += difficulty;
  } else {
    cord.length += (cordLength - cord.length) * 0.1;
  }
  cord.angle += difficulty * 0.05;
  line(cord.pin, vec(cord.pin).addWithAngle(cord.angle, cord.length));
  if (cord.pin.y > 98) {
    play("explosion");
    end();
  }
  let nextPin;
  remove(pins, (p) => {
    p.y += scr;
    if (box(p, 3).isColliding.rect.black && p !== cord.pin) {
      nextPin = p;
    }
    return p.y > 102;
  });
  if (nextPin != null) {
    play("powerUp");
    addScore(ceil(cord.pin.distanceTo(nextPin)), nextPin);
    cord.pin = nextPin;
    cord.length = cordLength;
  }
  nextPinDist -= scr;
  while (nextPinDist < 0) {
    pins.push(vec(rnd(10, 90), -2 - nextPinDist));
    nextPinDist += rnd(5, 15);
  }
```

## Dependencies
- Global: `difficulty` – scales the orbit speed and vertical scroll
- Global: `cord` – object tracking `{ pin, angle, length }` for the tethered player
- Global: `pins` – mutable list of anchor vectors processed via `remove`
- Global: `nextPinDist` – countdown that drives spawning in the while loop
- Constant: `cordLength` – baseline tether length restored after latching to a new pin
- API: `input.isJustPressed`, `input.isPressed` – Crisp input edges for stretch timing
- API: `play`, `line`, `end`, `vec`, `box`, `remove`, `addScore`, `ceil`, `rnd` – engine helpers for audio, drawing, collision, scoring, and randomness

## Integration Notes
- Run inside `update()` after entities are initialised so `cord.pin` references a member of `pins`.
- Ensure each pin is a `Vector` and that `cord` and `pins` share object references; the equality check depends on reference identity.
- Maintain `nextPinDist` as a positive float and seed it with the spacing you expect between anchors.
- Adjust the constants `80`, `98`, `102`, and the spawn range if your `options.viewSize` differs from the default 100×100 canvas.
- Variant reference: see `knowledge/snippets/player:rotate_roll_hold.md` for a hold-to-fire turret interpretation of the rotation mechanic, and pair with `weapon:artillery` or `field:bottomless` to turn each new pin into a firing perch above scrolling voids.

## Validation
- 2025-09-30 - `node -e "const data=require('./knowledge/tag_code_map.json'); console.log(JSON.stringify(data['player:rotate'][0], null, 2));"` - confirmed source mapping before extraction
- 2025-09-30 - Manual review of `reference/games/pin_climb.js:42-91` - verified rotation tether behaviour without live playtest
