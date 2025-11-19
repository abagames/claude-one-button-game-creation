# on holding:thrust

| Primary Role | Apply continuous force in one direction when button is held, opposite when released |
| --- | --- |
| Reference Games | `descent_s` - reference/games/descent_s.js:70-123, `raid` - reference/games/raid.js:44-118, `snaky` - reference/games/snaky.js:36-104 |
| LLM Status | draft |

## Snippet
```js
  ship.vel.y += input.isPressed ? ship.up * 0.005 : ship.down * 0.005;
  if (input.isJustPressed) play("coin");
  if (input.isJustReleased) play("laser");
  ship.pos.y += ship.vel.y;
  color(ship.vel.y > 1 ? "red" : ship.vel.y > 0.6 ? "yellow" : "blue");
  rect(1, 20, 3, ship.vel.y * 20);
  let scrY = 0;
  if (ship.pos.y > 19) {
    scrY = (19 - ship.pos.y) * 0.2;
  } else if (ship.pos.y < 9) {
    scrY = (9 - ship.pos.y) * 0.2;
  }
  ship.pos.y += scrY;
  decks.forEach((d, i) => {
    color(i === 0 ? "black" : "light_black");
    d.pos.add(-ship.vel.x, scrY);
    rect(d.pos, d.width, 3);
  });
  color("black");
  const c = char("a", ship.pos).isColliding.rect;
  if (c.black) {
    if (ship.vel.y > 1) {
      play("explosion");
      end();
    } else {
      const d = decks.shift();
      play("powerUp");
      addScore(floor(d.pos.x + d.width - ship.pos.x + 1), ship.pos);
      const ld = decks[decks.length - 1];
      decks.push({ pos: vec(ld.pos.x + ld.width * 0.7 + rnd(30), ld.pos.y + rnd(20, 40)), width: rnd(25, 50) });
      ship.up = ship.nextUp;
      ship.down = ship.nextDown;
      ship.nextUp = floor(-difficulty * 4 + rnds(difficulty * 3));
      ship.nextDown = floor(difficulty * 4 + rnds(difficulty * 2));
      ship.vel.set(difficulty * 0.2, 0);
    }
  }
```

## Dependencies
- Global: `ship` with `{ pos, vel, up, down, nextUp, nextDown }`
- Globals: `decks`, `difficulty`
- Functions: `play`, `rect`, `color`, `char`, `end`, `addScore`, `vec`, `rnd`, `rnds`, `floor`, `abs`
- API: `input.isPressed`, `input.isJustPressed`, `input.isJustReleased`

## Integration Notes
- Combine with `field:spike` or `field:holes` so thrust decisions matter against lethal floor layouts.
- Pair with `weapon:explosion` to trigger a blast when thrust reverses direction after a long hold, rewarding controlled burns.
- Works with `on holding:extend` by sharing thrust values to stretch or contract tether length depending on climb velocity.

## Validation
- 2025-10-03 - `node scripts/generate_metadata.js` (post-update metadata refresh)
