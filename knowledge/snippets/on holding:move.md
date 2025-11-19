# on holding:move

| Primary Role | Player movement speed increases while button is held |
| --- | --- |
| Reference Games | `ball_tour` - reference/games/ball_tour.js:72-142, `accel_b` - reference/games/accel_b.js:78-146, `square_bar` - reference/games/square_bar.js:30-108 |
| LLM Status | draft |

## Snippet
```js
  const py = player.pos.y;
  player.yAngle += difficulty * 0.05;
  player.pos.y = sin(player.yAngle) * 30 + 50;
  player.ticks += clamp((py - player.pos.y) * 9 + 1, 0, 9);
  if (input.isJustPressed) {
    play("hit");
  }
  player.vx = (input.isPressed ? 1 : 0.1) * difficulty;
  char(addWithCharCode("a", floor(player.ticks / 50) % 2), player.pos);
  color("red");
  if (char("c", player.pos.x, player.pos.y - 6).isColliding.text["*"]) {
    play("explosion");
    gameOver();
  }
  nextBallDist -= player.vx;
  if (nextBallDist < 0) {
    const p = vec(-3, rnd(20, 70));
    color("transparent");
    if (char("c", p).isColliding.text["*"]) {
      nextBallDist += 9;
    } else {
      balls.push(p);
      nextBallDist += rnd(25, 64);
    }
  }
  color("green");
  remove(balls, (b) => {
    b.x += player.vx;
    const c = char("c", b).isColliding.char;
    if (c.a || c.b || c.c) {
      addScore(floor(multiplier), player.pos);
      multiplier += 10;
      play("select");
      return true;
    }
    return b.x > 103;
  });
  multiplier = clamp(multiplier - 0.02 * difficulty, 1, 999);
  color("black");
  text(`x${floor(multiplier)}`, 3, 9);
```

## Dependencies
- Global: `player`, `balls`, `nextBallDist`, `multiplier`, `difficulty`
- Functions: `play`, `char`, `addWithCharCode`, `remove`, `addScore`, `text`, `color`, `vec`, `rnd`
- API: `input.isPressed`, `input.isJustPressed`, `sin`, `clamp`, `floor`
- Game flow: requires `gameOver()` handler to terminate runs when collisions occur

## Integration Notes
- Update `player.pos` oscillation before applying the button-driven horizontal velocity so vertical bobbing remains smooth.
- Use the `(input.isPressed ? 1 : 0.1)` factor to keep idle drift; tweak coefficients to reflect desired cruise vs boost speeds.
- Generate spawn candidates into `balls` only after subtracting `nextBallDist` so cadence scales with current velocity.
- Clamp `multiplier` decay to avoid negative scores during long stretches without collectibles.
- When pairing with `player:reciprocate`, treat `player.vx` as the shuttle’s throttle so tap reversals inherit the boosted drift; combining with `weapon:artillery` lets charged shots inherit the same momentum window.

## Validation
- 2025-09-30 - Manual snippet extraction and formatting check (no runtime executed)
