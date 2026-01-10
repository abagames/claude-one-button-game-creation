# weapon:explosion

| Primary Role | Area-of-effect attack with expanding damage zone |
| --- | --- |
| Reference Games | `mortar` - reference/games/mortar.js:72-123, `bomb_up` - reference/games/bomb_up.js:48-126, `balls_bombs` - reference/games/balls_bombs.js:54-142, `reflector` - reference/games/reflector.js:129-134, 190-202 |
| LLM Status | draft |

## Snippet
```js
  if (explosion.radius != null) {
    color("red");
    explosion.radius += (explosion.targetRadius - explosion.radius) * 0.1;
    arc(explosion.pos.x, explosion.pos.y + oy, explosion.radius, 5);
    if (explosion.targetRadius - explosion.radius < 1) {
      explosion.radius = undefined;
    }
  } else if (mortar.sightY != null) {
    mortar.sightY -= sqrt(difficulty) * 2 * sightSpeedRatio;
    let radius = 0;
    if (mortar.sightY < 0) {
      oy += (90 - mortar.sightY - oy) * (0.05 * sqrt(difficulty) * sightSpeedRatio);
      radius = clamp(-mortar.sightY * 0.3, 0, 30);
    }
    radius += 2;
    color("black");
    arc(mortar.pos.x, mortar.sightY + oy, radius, 2);
    if (input.isJustReleased || mortar.sightY < -200) {
      if (radius === 2) {
        if (shot.width == null) {
          play("laser");
          shot.pos.set(mortar.pos);
          shot.width = ceil((91 - mortar.sightY) * 0.2);
        }
      } else {
        play("explosion");
        explosion.targetRadius = radius;
        explosion.radius = 0;
        explosion.pos.set(mortar.pos.x, mortar.sightY);
      }
      mortar.sightY = undefined;
      if (sightSpeedRatio > 1) {
        sightSpeedRatio--;
      }
    }
  }
```

## Dependencies
- Globals: `explosion`, `mortar`, `shot`, `oy`, `difficulty`, `sightSpeedRatio`
- Functions: `color`, `arc`, `clamp`, `sqrt`, `play`, `ceil`
- API: `input.isJustReleased`

## Integration Notes
- Pair with `weapon:artillery` to reuse the same targeting arc and hand off to this blast resolver once the shell lands.
- Combine with `field:holes` so explosions carve new pits; feed the resulting coordinates into the hole manager.
- Layer with `on holding:shoot` to allow beam weapons to charge and trigger an explosion when released.

## Validation
- 2025-10-03 - `node scripts/generate_metadata.js` (re-run to refresh tag coverage)
- 2025-10-03 - `node scripts/fetch_tag_snippets.js --tags "field:pins,field:lanes,weapon:explosion" --out tmp/agent_context_field_weapon.md --log field_weapon --verbose`
