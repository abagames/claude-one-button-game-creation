# player:inverted

| Primary Role | Player navigates dual parallel worlds or states with transitions between them |
| --- | --- |
| Reference Games | `rebirth` - reference/games/rebirth.js:125-174 |
| LLM Status | draft |

## Snippet
```js
  player.pos.add(player.vel);
  player.vel.mul(0.99);
  player.vel.x *= 0.8;
  let pc;
  if (player.state === "run") {
    player.pos.x += (100 + player.world * player.ox - player.pos.x) * 0.05;
    player.ox = clamp(player.ox + sqrt(difficulty) * 0.3, 10, 80);
    if (input.isJustPressed) {
      play("jump");
      player.state = "jump";
      player.vel.y = -2 * sqrt(difficulty);
    }
    pc = addWithCharCode("b", floor(ticks / 10) % 2);
  } else if (player.state === "jump") {
    player.vel.y += (input.isPressed ? 0.07 : 0.14) * difficulty;
    if (player.pos.y > 37) {
      player.pos.y = 37;
      player.vel.y = 0;
      player.state = "run";
    }
    if (input.isJustPressed) {
      play("laser");
      player.state = "land";
      player.vel.y = 4 * sqrt(difficulty);
    }
    pc = "d";
  }
  const pw = player.pos.x < 100 ? -1 : 1;
  color(pw > 0 ? "black" : "white");
  const c = char(pc, player.pos, { mirror: { x: pw } }).isColliding.char;
  if (c.a && abs(player.vel.x) < 2) {
    play("hit");
    player.vel.x =
      (player.world > 0 ? -1 : 1) * player.ox * 0.2 * sqrt(difficulty);
    player.world = player.world > 0 ? -1 : 1;
    player.ox = 10;
  }
```

## Dependencies
- Global: `player` – object with `{ pos: Vector, ox: number, vel: Vector, world: -1|1, state: "run"|"jump"|"land" }`
- Global: `difficulty` – scaling factor for movement speed and gravity
- Global: `ticks` – frame counter for animation cycles
- Player states: "run" (ground movement), "jump" (ascending), "land" (fast descent)
- World system: `player.world` determines which side (left/right) the player occupies, affecting color and movement
- API: `input.isJustPressed`, `input.isPressed` – button press detection for jump and slam
- API: `play`, `clamp`, `sqrt`, `floor`, `abs`, `addWithCharCode`, `color`, `char` – engine helpers

## Integration Notes
- Screen is split at x=100: left side (world -1) uses white color, right side (world 1) uses black color
- Player automatically moves toward the edge of their current world (`player.ox` increases over time)
- Collision with obstacles (char "a") triggers world flip: player bounces to opposite side with momentum
- Jump mechanics: first press jumps up, second press while airborne slams down quickly
- Character sprite mirrors based on which world the player is in (`pw` determines mirror direction)
- Requires dual-world obstacle system where obstacles appear on alternating sides
- Reset `player.ox = 10` after world switches to restart the outward movement cycle

## Validation
- 2025-10-03 - Manual trace of `reference/games/rebirth.js:125-174` to confirm dual-world mechanics and state transitions
- 2025-10-03 - Cross-check with `knowledge/tag_code_map.json` entry for `player:inverted` prior to extraction