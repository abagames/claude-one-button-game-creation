# STOMPSHELTER (stompshelter)

**Tags**: #player-step_on, #player-scaffold, #rule-shelter

## 1. Core Mechanics

- **Input**: Tap to jump (double-jump allowed)
- **Behavior**: Player jumps between crumbling platforms. Rising lava forces upward movement. Platforms degrade when stood upon and from debris impacts. Stomp enemies for bonus points.
- **End Condition**: Fall into lava OR get hit by debris while exposed OR collide with enemy from side
- **Scoring**: +1 per scroll unit, +8-20 per enemy stomp (combo bonus)
- **Difficulty**: Faster lava, more debris, faster debris

## 2. Object Specifications

| Object | Shape | Color | Behavior |
|:-------|:------|:------|:---------|
| Player | box(6) | cyan | Double-jump, drifts to center |
| Platform | rect(w,4) | black→blue→red | Crumbles when stood on or hit by debris |
| Enemy | box(7) | red | Walks on platforms, stompable from above |
| Lava | rect(100,h) | yellow | Rises constantly, instant death |
| Debris | box(4) | purple | Falls from top, damages platforms, hurts exposed player |

## 3. Design Guide Analysis

- **Simplicity**: One button jump - intuitive
- **Visual Feedback**: Platforms change color when weakening, lava visible, shelter indicator
- **Skill-Based Scoring**: Strategic jumping for height and enemy stomping
- **Novel Mechanics**: Crumbling platforms + shelter system creates unique tension

## 4. Relationship with Tags

- `player-step_on`: Stomping enemies is a scoring method and gives bounce
- `player-scaffold`: Platforms essential but temporary (crumble mechanic)
- `rule-shelter`: Being under a platform protects from falling debris

## 5. Basis for Novelty

Crumbling platforms create constant pressure to move. The dual-threat of rising lava AND falling debris forces players to balance ascending (scoring) with seeking shelter. Stomping enemies provides both score and emergency height recovery.

## 6. Similarity Check

- Similar to: Doodle Jump (vertical ascent), Mario (stomping)
- Key differences:
  - Platforms degrade over time and from debris
  - Shelter mechanic (protection under platforms)
  - Dual threats from above and below

---

# Game Generation Report: STOMPSHELTER

## Selected Tags

- player-step_on (stomp from above)
- player-scaffold (platform movement)
- rule-shelter (safe zones)

## Simulation Results

| Metric | Initial | After Improvement |
|:-------|:--------|:------------------|
| NoInput Survival | 25.8s | 1.4s |
| SpamPress Score | 10 | 99 |
| GA Best Score | 0 | 1863 |
| GA Ratio | N/A | **18.8x** |

## Improvements Made

1. **Simplified jump mechanic**: Changed from hold-release to tap-to-jump with double-jump. The hold-release mechanic was too complex for the simulator to discover.

2. **Added crumbling platforms**: Platforms now have HP (120) and lose 2 HP per frame when stood upon. Debris impacts also damage platforms (-15 HP). This prevents "stand still" survival strategy.

3. **Enhanced visual feedback**: Platforms change color as they weaken (black → blue → light_red), giving players warning before collapse.

4. **Debris damages platforms**: Creates emergent gameplay where debris gradually destroys the playing field, forcing upward movement.

## Final Evaluation

**PASS** - GA Ratio of 18.8x demonstrates that skilled input is strongly rewarded over monotonous strategies.
