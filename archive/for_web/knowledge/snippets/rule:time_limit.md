# rule:time_limit

| Primary Role | Depleting resource that causes game over when exhausted |
| --- | --- |
| Reference Games | `g_press` - reference/games/g_press.js:143-150, `cast_n` - reference/games/cast_n.js:74-85, `scrambird` - reference/games/scrambird.js:125-140 |
| LLM Status | draft |

## Snippet
```js
  waterY += (targetWaterY - waterY) * 0.2;
  color("purple");
  rect(0, waterY, 100, 101 - waterY);
  if (
    press.vw === 0 &&
    drops.length === 0 &&
    waterY >= 100 &&
    targetWaterY >= 100
  ) {
    play("lucky");
    end();
  }
```

## Dependencies
- Global: `waterY` - current gauge level (smoothed)
- Global: `targetWaterY` - target gauge level (immediate updates)
- Global: `press`, `drops` - game-specific state objects (ensure stable state before fail check)
- API: `color`, `rect`, `play`, `end` - Crisp Game Library rendering/game control

## Integration Notes
- Gauge rises via negative actions (bubbles escaping: `targetWaterY += size * 0.03`) and falls via positive actions (destroying drops: `targetWaterY -= 0.35`).
- Smoothing via `waterY += (targetWaterY - waterY) * 0.2` prevents instant fail; adjust coefficient for urgency.
- Fail condition checks both current and target levels (`waterY >= 100 && targetWaterY >= 100`) to avoid false positives during smoothing.
- Additional stability checks (`press.vw === 0 && drops.length === 0`) ensure game state is quiescent before ending.
- Compatible with `rule:gauge_management` (shared pressure meter concept), `rule:proximity_bonus` (risk-reward balance).
- Visual: draw gauge as rising/falling colored rectangle (`rect(0, waterY, 100, 101 - waterY)`).
- Audio feedback: play alert sounds as gauge approaches threshold (see g_press.js:107-113 for warning beeps).

## Validation
- 2025-10-05 - Manual extraction from `reference/games/g_press.js:140-150` - code compiles, references verified
