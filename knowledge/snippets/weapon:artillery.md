# weapon:artillery

| Primary Role | Projectile weapon with ballistic trajectory affected by gravity |
| --- | --- |
| Reference Games | `throw_m` - reference/games/throw_m.js:85-210, `grenadier` - reference/games/grenadier.js:152-236, `raid` - reference/games/raid.js:44-138 |
| LLM Status | draft |

## Snippet
```js
  remove(shots, (s) => {
    s.pos.add(s.vel);
    s.vel.y += difficulty * 0.07;
    char("e", s.pos);
    return s.pos.y > 103;
  });

  if (player.fireAngle == null) {
    if (input.isJustPressed) {
      player.fireAngle = (PI / 4) * 3;
    }
  }
  if (player.fireAngle != null) {
    player.fireAngle += 0.1 * difficulty;
    color("black");
    line(player.pos, vec(player.pos).addWithAngle(player.fireAngle, 5), 2);
    if (input.isJustReleased || player.fireAngle > (PI / 8) * 11) {
      play("laser");
      shots.push({
        pos: vec(player.pos),
        vel: vec().addWithAngle(player.fireAngle, sqrt(difficulty) * 3),
      });
      player.fireAngle = undefined;
      multiplier = 1;
    }
  }
```

## Dependencies
- Array `shots`: elements `{ pos: Vector, vel: Vector }`
- Object `player` with `pos: Vector`, `fireAngle?: number`
- Globals: `difficulty`, `multiplier`
- Functions: `remove`, `vec`, `char`, `color`, `line`, `play`
- API: `input.isJustPressed`, `input.isJustReleased`, `sqrt`, `PI`

## Integration Notes
- Call the snippet within the main update loop after resolving player movement so `player.pos` is current before drawing the aiming guide.
- Ensure `shots` is initialized (e.g., `shots = []`) and that a gravity step elsewhere increments `ticks` so `difficulty` scaling remains consistent.
- Couple with an enemy collision routine that consumes `shots` hits; see `knowledge/snippets/rule:physics.md` for gravity helpers and `knowledge/snippets/field:outpost.md` for defensive collision patterns.
- Reset or clamp `player.fireAngle` if additional states (e.g., weapon cooldowns) are layered on top of the base artillery mechanic.
- Sync with `player:rotate` to arc from rotating arms, or combine with `field:bottomless` to reward accurate drops over a scrolling void.

## Validation
- 2025-10-02 - Extracted from `throw_m` and cross-checked with `grenadier`; formatting review only
- 2025-10-02 - `node scripts/fetch_tag_snippets.js --tags player:rotate,field:outpost,rule:physics,weapon:artillery --out tmp/agent_context_rotor_outpost.md --log rotor_outpost --verbose` (passes; snippet included)
