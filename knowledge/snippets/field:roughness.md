# field:roughness

| Primary Role | Procedurally generated uneven terrain that affects movement |
| --- | --- |
| Reference Games | `up_down_press` - reference/games/up_down_press.js:67-86, calcRoad:186-197 |
| LLM Status | draft |

## Snippet
```js
  nextRoadDist -= scr.x;
  while (nextRoadDist < 0) {
    const lr = roads[roads.length - 1];
    const from = vec(lr.to);
    let to = vec(lr.to);
    const w = rnd(20, 60);
    to.x += w;
    if (lr.from.y - lr.to.y === 0) {
      to.y += rnds(0.4, 1.1) * w;
    }
    roads.push({ from, to, angle: from.angleTo(to) });
    nextRoadDist += w;
  }
  color("light_black");
  remove(roads, (r) => {
    r.from.sub(scr);
    r.to.sub(scr);
    line(r.from, r.to);
    return r.to.x < -50;
  });

  function calcRoad(x) {
    let road = [undefined, undefined];
    roads.forEach((r) => {
      if (r.from.x <= x && x < r.to.x) {
        road = [
          ((r.from.y - r.to.y) * (x - r.to.x)) / (r.from.x - r.to.x) + r.to.y,
          r.angle,
        ];
      }
    });
    return road;
  }
```

## Dependencies
- Global: `roads` – array of road segments with `{ from: Vector, to: Vector, angle: number }`
- Global: `nextRoadDist` – countdown for spawning new terrain segments
- Global: `scr` – scrolling vector that moves terrain leftward
- Global: `difficulty` – affects terrain generation frequency and variation
- API: `vec`, `rnd`, `rnds`, `remove`, `line`, `color` – engine helpers for vectors, randomness, iteration, drawing

## Integration Notes
- Initialize with flat starting segment: `roads = [{ from: vec(0, 50), to: vec(100, 50), angle: 0 }]`
- Terrain slopes are generated procedurally: flat segments get random vertical offsets, existing slopes continue trends
- Height variation scales with segment width: `to.y += rnds(0.4, 1.1) * w` creates realistic slope gradients
- `calcRoad(x)` returns `[height, angle]` for any x-coordinate, enabling physics calculations for vehicles
- Segments automatically scroll left with `scr` and clean up when `r.to.x < -50`
- Consider pairing with `player:bounce` for vehicles that react to slope angles
- Combine with `rule:physics` to apply momentum and gravity effects based on terrain angle

## Validation
- 2025-10-03 - Manual trace of `reference/games/up_down_press.js:67-86, 186-197` to confirm terrain generation and physics integration
- 2025-10-03 - Cross-check with `knowledge/tag_code_map.json` entry for `field:roughness` prior to extraction