# field:spike

| Primary Role | Moving hazardous obstacles that advance through the playfield |
| --- | --- |
| Reference Games | `totoge` - reference/games/totoge.js:84-135, `r_wheel` - reference/games/r_wheel.js:48-122, `scrambird` - reference/games/scrambird.js:60-132 |
| LLM Status | draft |

## Snippet
```js
  spikeAddDist -= scr;
  if (spikeAddDist < 0) {
    play("laser");
    const width = rndi(2, 5);
    spikes.push({
      pos: vec(clamp(nextSpikeX, 12, 93 - width * 6), 199),
      c: times(width, () => "c").join(""),
    });
    spikeAddDist = rnd(99, 199);
    nextSpikeX += nextSpikeVx * width * 6;
    if ((nextSpikeX < 9 && nextSpikeVx < 0) || (nextSpikeX > 90 && nextSpikeVx > 0)) {
      nextSpikeVx *= -1;
    }
  }
  color("black");
  spikes = spikes.filter((s) => {
    s.pos.y -= scr;
    char(s.c, s.pos.x, clamp(s.pos.y, -99, 99));
    return s.pos.y > -99;
  });
  color("transparent");
  const cp = vec(pos);
  for (let i = 0; i < clamp(vel.y / 6, 1, 99); i++) {
    if (char("a", cp).isColliding.char.c) {
      play("lucky");
      end();
    }
    cp.y -= 6;
  }
  color("black");
  char(vel.y > 0 ? "a" : "b", pos, { mirror: { x: vel.x > 0 ? -1 : 1 } });
  pos.x += vel.x * difficulty;
  pos.y += vel.y * difficulty - scr;
  vel.y += 0.05;
  if ((pos.x < 9 && vel.x < 0) || (pos.x > 90 && vel.x > 0)) {
    vel.x *= -1;
  }
```

## Dependencies
- Globals: `spikes`, `spikeAddDist`, `nextSpikeX`, `nextSpikeVx`, `scr`, `pos`, `vel`, `difficulty`
- Functions: `play`, `rndi`, `rnd`, `vec`, `clamp`, `times`, `char`, `end`
- API: `input` (press handling occurs elsewhere)

## Integration Notes
- Pair with `on holding:thrust` so vertical thrust determines how quickly the avatar sweeps past incoming spike rings.
- Combine with `field:lanes` by translating each spike column into blocked lanes that toggle via `on pressed:reverse state`.
- Link to `weapon:explosion` to let destroyed spikes clear adjacent columns but keep the spawn timer intact.

## Validation
- 2025-10-03 - `node scripts/generate_metadata.js` (post-snippet confirmation)
