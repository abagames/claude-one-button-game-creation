# field:pins

| Primary Role    | Scrolling field populated with discrete anchor points or targets                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Reference Games | `pin_climb` - reference/games/pin_climb.js:66-92, `orbit_man` - reference/games/orbit_man.js:32-108, `revolve_a` - reference/games/revolve_a.js:44-128 |
| LLM Status      | draft                                                                                                                                |

## Snippet

```js
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
line(cord.pin, vec(cord.pin).addWithAngle(cord.angle, cord.length));
if (cord.pin.y > 98) {
  play("explosion");
  end();
}
```

## Dependencies

- Global: `cord` (`{ pin, angle, length }`) and constants `cordLength`, `scr`
- Globals: `pins`, `nextPinDist`, `difficulty`
- Functions: `remove`, `box`, `play`, `addScore`, `ceil`, `vec`, `rnd`, `line`, `end`

## Integration Notes

- Combine with `player:rotate` so the field logic and tether both reference the same `cord` object.
- Pair with `on holding:extend` to stretch the tether when no next pin is detected, telegraphing safe gaps between anchors.
- Add `weapon:explosion` so detonations can clear or spawn pins dynamically, altering the climb path.

## Validation

- 2025-10-03 - `node scripts/generate_metadata.js` (ensured refreshed tag references)
- 2025-10-03 - `node scripts/fetch_tag_snippets.js --tags "field:pins,field:lanes,weapon:explosion" --out tmp/agent_context_field_weapon.md --log field_weapon --verbose`
