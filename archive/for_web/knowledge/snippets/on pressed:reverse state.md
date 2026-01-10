# on pressed:reverse state

| Primary Role    | Button press toggles binary state affecting game elements                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Reference Games | `t_lanes` - reference/games/t_lanes.js:98-176, `flip_o` - reference/games/flip_o.js:24-104, `ns_climb` - reference/games/ns_climb.js:22-96 |
| LLM Status      | draft                                                                                                                    |

## Snippet

```js
if (input.isJustPressed) {
  play("select");
}
remove(crosses, (c) => {
  c.pos.x -= scr;
  if (input.isJustPressed) {
    c.currentAngle = c.currentAngle === 0 ? c.angle : 0;
  }
  color(
    c.currentAngle === 0
      ? "light_black"
      : c.currentAngle === -1
      ? "red"
      : "blue"
  );
  line(
    c.pos.x,
    c.pos.y - 1,
    c.pos.x + laneInterval,
    c.pos.y - 1 + laneInterval * c.angle,
    1
  );
  line(
    c.pos.x,
    c.pos.y + 1,
    c.pos.x + laneInterval,
    c.pos.y + 1 + laneInterval * c.angle,
    1
  );
  color("black");
  char(addWithCharCode("c", c.currentAngle + 1), c.pos.x + 3, c.pos.y);
  return c.pos.x < -laneInterval;
});
```

## Dependencies

- Global: `crosses` array of lane switches `{ pos, angle, currentAngle }`
- Global: `scr`, `laneInterval`
- Functions: `remove`, `play`, `color`, `line`, `char`, `addWithCharCode`
- API: `input.isJustPressed`
- Rendering: pre-render `line` collisions to encode blockades along each lane edge

## Integration Notes

- Spawn `crosses` ahead of the player using your lane generation logic; this block only handles toggling and drawing.
- Keep `currentAngle` values in `{ -1, 0, 1 }` so the ternary coloring stays aligned with sprite expectations.
- Ensure `scr` scroll speed matches your car movement so switches translate smoothly across the field.
- Adjust lane width constants if your `laneInterval` differs from 12px.
- Pairing with `field:outpost` reinforces the stakes of a missed toggle, while comboing with `on pressed:shoot` lets each polarity swap also trigger a counter-fire volley.

## Validation

- 2025-09-30 - Manual snippet extraction and formatting check (no runtime executed)
