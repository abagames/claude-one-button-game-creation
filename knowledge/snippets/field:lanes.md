# field:lanes

| Primary Role | Gameplay divided into parallel lanes or tracks |
| --- | --- |
| Reference Games | `t_lanes` - reference/games/t_lanes.js:121-170, `up_1_way` - reference/games/up_1_way.js:66-134, `roll_s` - reference/games/roll_s.js:52-118 |
| LLM Status | draft |

## Snippet
```js
  nextCrossDist -= scr;
  if (nextCrossDist < 0) {
    addScore(carCount);
    crossCount--;
    if (crossCount < 0) {
      nextCrossLanes = times(laneCount * 2, (i) => !(i === laneCount - 1 || i === laneCount));
      crossCount = laneCount * 2 - 3;
    }
    let i = rndi(laneCount * 2);
    while (!nextCrossLanes[i]) {
      i = wrap(i + 1, 0, laneCount * 2);
    }
    nextCrossLanes[i] = false;
    const angle = i < laneCount ? 1 : -1;
    const currentAngle = rnd() < 0.5 ? 0 : angle;
    crosses.push({ pos: vec(200, 10 + laneInterval * (i % laneCount)), angle, currentAngle });
    nextCrossDist = 24;
  }
  color("light_black");
  times(laneCount, (i) => {
    const y = 10 + laneInterval * i;
    rect(0, y - 1, 200, 1);
    rect(0, y + 1, 200, 1);
  });
  if (input.isJustPressed) {
    play("select");
  }
  remove(crosses, (c) => {
    c.pos.x -= scr;
    if (input.isJustPressed) {
      c.currentAngle = c.currentAngle === 0 ? c.angle : 0;
    }
    color(c.currentAngle === 0 ? "light_black" : c.currentAngle === -1 ? "red" : "blue");
    line(c.pos.x, c.pos.y - 1, c.pos.x + laneInterval, c.pos.y - 1 + laneInterval * c.angle, 1);
    line(c.pos.x, c.pos.y + 1, c.pos.x + laneInterval, c.pos.y + 1 + laneInterval * c.angle, 1);
    color("black");
    char(addWithCharCode("c", c.currentAngle + 1), c.pos.x + 3, c.pos.y);
    return c.pos.x < -laneInterval;
  });
```

## Dependencies
- Globals: `nextCrossDist`, `scr`, `carCount`, `crossCount`, `nextCrossLanes`, `laneCount`, `laneInterval`, `crosses`
- Functions: `addScore`, `times`, `rndi`, `wrap`, `rnd`, `vec`, `color`, `rect`, `play`, `remove`, `line`, `char`, `addWithCharCode`
- API: `input.isJustPressed`

## Integration Notes
- Combine with `on pressed:reverse state` so lane switches reuse the same `crosses` array for polarity control.
- Overlay `field:spike` columns so closed lanes become hazardous walls while open lanes remain safe.
- Pair with `weapon:explosion` to clear switches en masse, forcing the lane schedule to regenerate sooner.

## Validation
- 2025-10-03 - `node scripts/generate_metadata.js` (updated references after snippet addition)
- 2025-10-03 - `node scripts/fetch_tag_snippets.js --tags "field:pins,field:lanes,weapon:explosion" --out tmp/agent_context_field_weapon.md --log field_weapon --verbose`
