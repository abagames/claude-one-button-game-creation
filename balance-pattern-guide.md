# Balance Pattern Guide

This guide provides patterns for automatically adjusting game balance based on GA test results. The patterns are extracted from analysis of 12 games that were manually improved from zero-touch generation to polished versions.

## Overview

Balance adjustments fall into several categories:

1. **Difficulty Scaling** - How game parameters change with `difficulty` variable
2. **Scoring Systems** - Risk/reward and combo mechanics
3. **Boundary Behavior** - Wall collision and screen edge handling
4. **Self-Balancing Mechanisms** - Automatic difficulty adjustment
5. **Input Response** - How button states affect game behavior
6. **Spawn Patterns** - Enemy and obstacle placement

---

## 1. Difficulty Scaling Patterns

### Pattern 1.1: Linear to Square Root Conversion

**Problem**: Difficulty increases too quickly, game becomes unplayable.

**Diagnosis**: `ga.detailedLog.deathAnalysis` shows deaths concentrated at high difficulty.

**Before**:
```javascript
let speed = 0.5 + difficulty * 0.1;
let spawnRate = 60 - difficulty * 3;
```

**After**:
```javascript
let speed = 0.5 * sqrt(difficulty);
let spawnRate = 60 / sqrt(difficulty);
```

**Effect**: Decelerating growth curve - still gets harder but plateaus naturally.

### Pattern 1.2: Multiplicative Difficulty

**Problem**: Game feels the same at all difficulty levels.

**Diagnosis**: GA ratio close to 1.0 at all stages.

**Before**:
```javascript
player.pos.add(player.vel);
bladeAngle += rotateSpeed;
```

**After**:
```javascript
player.pos.add(vec(player.vel).mul(sqrt(difficulty)));
bladeAngle += rotateSpeed * sqrt(difficulty);
```

**Effect**: Everything scales together, maintaining consistent feel while increasing challenge.

### Pattern 1.3: Inverse Difficulty for Spawn Intervals

**Problem**: Spawn rate doesn't accelerate enough.

**Diagnosis**: `ga.detailedLog.spawnAnalysis.averageInterval` too high at late game.

**Before**:
```javascript
spawnTimer = 60 - difficulty * 3;  // Caps at difficulty 20
```

**After**:
```javascript
spawnTimer = 60 / difficulty;  // Continuously decreases
```

---

## 2. Scoring System Patterns

### Pattern 2.1: Risk-Based Scoring

**Problem**: Score doesn't reflect skill or risk-taking.

**Diagnosis**: `ga.detailedLog.scoringAnalysis.triggers` shows only one scoring method.

**Before**:
```javascript
addScore(10);  // Fixed points
```

**After**:
```javascript
addScore(obstacles.length);  // More risk = more reward
addScore(ceil(player.size)); // Bigger target = more points
addScore(multiplier);        // Consecutive success rewarded
```

**Games using this**: cling-hop, phaserun, geyser-hop

### Pattern 2.2: Score Scale Reduction

**Problem**: Scores inflate too quickly, numbers become meaningless.

**Diagnosis**: Final scores in millions, hard to compare runs.

**Before**:
```javascript
// Points per action
{ large: 10, medium: 20, small: 30 }
```

**After**:
```javascript
// Points per action
{ large: 1, medium: 2, small: 3 }
```

**Games using this**: splitzig

### Pattern 2.3: Exponential Combo Scoring

**Problem**: Multi-kills don't feel rewarding enough.

**Diagnosis**: `ga.detailedLog.scoringAnalysis.scoringRate` flat regardless of combo.

**Before**:
```javascript
addScore(destroyedCount * basePoints);
```

**After**:
```javascript
addScore(destroyedCount * destroyedCount);
```

**Games using this**: star-eater

### Pattern 2.4: Combo Multiplier System

**Problem**: No incentive for consecutive successes.

**Diagnosis**: `ga.detailedLog.inputAnalysis.pattern` shows no rhythm.

**Implementation**:
```javascript
let multiplier = 1;

// On success
multiplier = min(multiplier + 1, maxMultiplier);
addScore(basePoints * multiplier);

// On failure/miss
multiplier = max(multiplier - 1, 1);
```

**Games using this**: geyser-hop, geoerase, inkinh

---

## 3. Boundary Behavior Patterns

### Pattern 3.1: Game Over to Screen Wrap

**Problem**: Deaths concentrated at screen edges.

**Diagnosis**: `ga.detailedLog.deathAnalysis.position` clusters near boundaries.

**Before**:
```javascript
if (player.pos.x < 5 || player.pos.x > 95) {
  end();
}
```

**After**:
```javascript
player.pos.x = wrap(player.pos.x, 0, 100);
```

**Games using this**: splitzig

### Pattern 3.2: Moving Boundaries

**Problem**: Stationary gameplay, no positional challenge.

**Diagnosis**: `ga.detailedLog.inputAnalysis` shows timing-only patterns.

**Before**:
```javascript
gate = { x: 50, y: 92, isLight: false };  // Fixed position
```

**After**:
```javascript
gate = { x: 50, y: 92, vx: 1, isLight: false };
// In update:
gate.x += gate.vx * sqrt(difficulty);
if (gate.x > 90 || gate.x < 10) gate.vx *= -1;
```

**Games using this**: dark_sort

### Pattern 3.3: Bounce Instead of Death

**Problem**: Wall collision ends game too abruptly.

**Before**:
```javascript
if (player.x > 90) end();
```

**After**:
```javascript
if (player.x > 90) {
  player.x = 90;
  player.vx *= -1;
}
```

**Games using this**: stompshelter

---

## 4. Self-Balancing Mechanisms

### Pattern 4.1: Resource Decay

**Problem**: Accumulated advantage makes game trivial.

**Diagnosis**: GA easily reaches high scores by accumulating resources.

**Before**:
```javascript
stackHeight += points;  // Only increases
```

**After**:
```javascript
stackHeight += points;
stackHeight *= 0.998;  // Constant decay
```

**Games using this**: splitzig

### Pattern 4.2: Cooldown Reduction on Success

**Problem**: Good play should be rewarded with more action.

**Implementation**:
```javascript
let baseCooldown = 40;
// On combo success
cooldown = floor(baseCooldown / (1 + comboCount * 0.5));
if (cooldown < minCooldown) cooldown = minCooldown;
```

**Games using this**: wipe-blade

### Pattern 4.3: Penalty for Missed Opportunities

**Problem**: No consequence for passive play.

**Diagnosis**: `ga.detailedLog.inputAnalysis.pattern` shows "no_input" works.

**Implementation**:
```javascript
// When geyser leaves screen without being stomped
if (!g.stomped && g.x < -15) {
  multiplier = max(multiplier - 1, 1);
}
```

**Games using this**: geyser-hop

---

## 5. Input Response Patterns

### Pattern 5.1: State-Dependent Speed

**Problem**: No skill expression through input timing.

**Diagnosis**: `ga.detailedLog.inputAnalysis` shows hold or spam is optimal.

**Before**:
```javascript
laserAngle += laserSpeed;  // Constant speed
```

**After**:
```javascript
laserAngle += laserSpeed * (input.isPressed ? 1 : 2) * sqrt(difficulty);
// Faster rotation when NOT pressing - rewards timing
```

**Games using this**: geoerase, inkinh

### Pattern 5.2: Hold-to-Grow Mechanics

**Problem**: No risk/reward in holding vs tapping.

**Implementation**:
```javascript
if (input.isPressed) {
  player.targetSize += growthRate;  // Grows while holding
}
// Scoring based on size
addScore(ceil(player.size));  // Bigger = more points but also more vulnerable
```

**Games using this**: phaserun

### Pattern 5.3: Hold Accelerates Danger

**Problem**: Holding has no downside.

**Implementation**:
```javascript
// Wall press speed depends on input
wallPress += (input.isPressed ? 0.2 : 0.05) * sqrt(difficulty);
```

**Games using this**: pressbound

---

## 6. Spawn Patterns

### Pattern 6.1: Safety Distance Check

**Problem**: Unfair instant deaths on spawn.

**Diagnosis**: `ga.detailedLog.deathAnalysis.recentFrames` shows death right after spawn.

**Before**:
```javascript
asteroids.push({ pos: vec(rnd(100), 0), ... });
```

**After**:
```javascript
let pos = vec(rnd(100), 0);
if (pos.distanceTo(player.pos) > safeDistance) {
  asteroids.push({ pos: pos, ... });
}
```

**Games using this**: star-eater, inkinh

### Pattern 6.2: Countdown vs Ticks-Based Spawning

**Problem**: Spawn timing is too predictable or too random.

**Before**:
```javascript
if (ticks % 60 === 0) spawnEnemy();  // Predictable
```

**After**:
```javascript
nextSpawnTicks--;
if (nextSpawnTicks <= 0) {
  spawnEnemy();
  nextSpawnTicks = rnd(baseInterval * 0.8, baseInterval * 1.2) / sqrt(difficulty);
}
```

**Games using this**: star-eater, phaserun, geyser-hop

### Pattern 6.3: Adaptive Spawn Position

**Problem**: Player can camp in safe spot.

**Diagnosis**: `ga.detailedLog.deathAnalysis.position` shows player stays in one area.

**Before**:
```javascript
let side = rnd() < 0.5;  // Random side
```

**After**:
```javascript
let side = player.pos.x > 50;  // Spawn from opposite side
```

**Games using this**: cling-hop

### Pattern 6.4: Distance-Based Enemy Spawn

**Problem**: Enemy spawn doesn't relate to player progress.

**Before**:
```javascript
if (ticks % 100 === 0) spawnEnemy();
```

**After**:
```javascript
nextEnemyDist -= scrollAmount;  // Tied to player progress
if (nextEnemyDist < 0) {
  spawnEnemy();
  nextEnemyDist = rnd(100, 200) / sqrt(difficulty);
}
```

**Games using this**: stompshelter

---

## 7. Mechanic Addition Patterns

### Pattern 7.1: Attack/Defense Toggle

**Problem**: Player is purely passive, only avoiding.

**Diagnosis**: `ga.detailedLog.inputAnalysis.pattern` shows "no_input" or evasion only.

**Implementation**: Add ability to destroy obstacles in specific state.

```javascript
// In cling-hop: player can destroy obstacles when airborne (yellow)
// vs invulnerable when clinging (cyan)
color(clingTarget != null ? "cyan" : "yellow");
// ... later in obstacle collision:
if (obsCol.cyan) { end(); }
else if (obsCol.yellow) {
  // Destroy obstacle
  play("powerUp");
  particle(obs.pos, { count: 20, speed: 3 });
  return true;  // Remove obstacle
}
```

**Games using this**: cling-hop

### Pattern 7.2: Movement Control Addition

**Problem**: Player movement is purely automatic.

**Implementation**:
```javascript
// Original: fixed horizontal position
player.x += (50 - player.x) * 0.01;

// Revised: add player control
player.x += player.vx * (input.isPressed ? 1 : 0.1);
if (player.x > 90 || player.x < 10) player.vx *= -1;
```

**Games using this**: stompshelter

---

## Quick Reference: Problem → Pattern

| Problem | Pattern |
|:--------|:--------|
| Deaths at screen edges | 3.1 Screen Wrap or 3.3 Bounce |
| Deaths at high difficulty | 1.1 sqrt() Conversion |
| No skill expression | 5.1 State-Dependent Speed |
| Spam is optimal | 4.3 Miss Penalty, 5.3 Hold Danger |
| Hold is optimal | 5.1 State Speed, 2.1 Risk Scoring |
| No input is optimal | 4.3 Miss Penalty, 7.2 Movement Control |
| Instant deaths on spawn | 6.1 Safety Distance |
| Score inflation | 2.2 Score Reduction |
| No combo incentive | 2.4 Multiplier System |
| Static gameplay | 3.2 Moving Boundaries, 6.3 Adaptive Spawn |

---

## Implementation Checklist

When applying balance patterns:

1. **Run GA test first** to identify problems
2. **Check the problem → pattern table** above
3. **Apply ONE pattern at a time**
4. **Re-run GA test** to verify improvement
5. **If GA ratio still ≤ 1.5**, apply additional patterns

### GA Analysis Focus Areas

```javascript
// From ga.detailedLog:

// 1. Death Analysis
deathAnalysis.position     // Where deaths occur
deathAnalysis.recentFrames // What happened before death

// 2. Input Analysis
inputAnalysis.pattern      // "spam", "hold_heavy", "no_input", "varied"
inputAnalysis.totalPresses // How many inputs in a run

// 3. Scoring Analysis
scoringAnalysis.triggers   // What causes scoring
scoringAnalysis.scoringRate // Score distribution over time

// 4. Spawn Analysis
spawnAnalysis.spatialDistribution // Where things spawn
spawnAnalysis.averageInterval     // How often things spawn
```

---

## Example: Full Balance Pass

Given a game with GA ratio = 0.8:

1. **Check input pattern**: "spam" → Apply Pattern 5.3 (Hold Danger)
2. **Re-test**: GA ratio = 1.1
3. **Check death positions**: clustered at edges → Apply Pattern 3.1 (Screen Wrap)
4. **Re-test**: GA ratio = 1.3
5. **Check scoring**: single source → Apply Pattern 2.4 (Combo Multiplier)
6. **Re-test**: GA ratio = 1.8 ✓

This systematic approach allows LLM to automatically improve game balance through iterative pattern application.
