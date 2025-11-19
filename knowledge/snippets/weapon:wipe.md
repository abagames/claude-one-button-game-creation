# weapon:wipe

| Primary Role | Sweeping attack that hits multiple targets across its path |
| --- | --- |
| Reference Games | `laser_fortress` - reference/games/laser_fortress.js:96-104, 141-152, `wiper` - reference/games/wiper.js:46-65 |
| LLM Status | draft |

## Snippet
```js
  if (input.isJustPressed) {
    play("select");
    laserX = sightX;
    multiplier = 1;
    color("blue");
    particle(20, 8, 9, 3, 0, PI / 8);
  }
  if (laserX != null && input.isPressed) {
    play("laser");
    color("blue");
    line(laserX, 50, 20, 8, 2);
    laserX += difficulty * 2;
    particle(laserX, 50, 1, 2, -PI / 2, PI / 6);
    color("purple");
    box(laserX - 2, 50, 5, 1);
  }
  // Collision detection with sweeping beam
  remove(objs, (o) => {
    // ... movement ...
    if (char(...).isColliding.rect.purple) {
      if (o.type === "ally") {
        play("explosion");
        end();
      } else {
        play("hit");
        particle(o.x, 47);
        addScore(multiplier, o.x, 47);
        multiplier++;
      }
      return true;
    }
  });
```

## Dependencies
- Global: `laserX` - current horizontal position of sweeping laser beam (or `undefined` when inactive)
- Global: `sightX` - initial laser start position (aiming reticle)
- Global: `multiplier` - score multiplier incremented per enemy hit
- Global: `objs` - array of entities with `{ x, vx, ticks, type }` (position, velocity, animation, ally/enemy)
- Global: `difficulty` - scales sweep speed
- API: `input.isJustPressed`, `input.isPressed`, `line`, `box`, `char`, `particle`, `play`, `addScore`, `end` - Crisp Game Library

## Integration Notes
- Activation: `isJustPressed` initializes laser at aiming position (`laserX = sightX`), resets multiplier.
- Sweep: while `isPressed`, laser advances horizontally (`laserX += difficulty * 2`) with continuous sound/particle trail.
- Collision zone: draw purple hitbox (`box(laserX - 2, 50, 5, 1)`) ahead of visual beam for enemy detection.
- Multi-hit: all enemies intersecting purple box are destroyed in single frame (`multiplier++` per hit).
- Failure condition: hitting ally (`type === "ally"`) ends game; differentiate friend/foe collision.
- Compatible with `rule:combo_multiplier` (increments multiplier per wipe), `on holding:extend` (hold-to-charge pattern).
- Visual: draw beam as thick line from origin to current `laserX`, render particles at sweep front.
- Balance: tune `laserX += difficulty * N` sweep speed; too fast = trivial, too slow = tedious.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/laser_fortress.js:89-104, 135-152` - code compiles, references verified
