# CUE CRUMB (cue-crumb)

**Tags**: #obstacle-split, #on_pressed-go_forward, #rule-friendly_fire

## 1. Core Mechanics

You are a cue ball with a constantly rotating aim arrow. Tap: thrust
along the arrow (momentum, drag, wall bounce). Gray rocks drift about:
ram one at speed and it SPLITS into two smaller chunks that fly off as
red-hot shrapnel — lethal to you for ~1 second while fast. Chunks
halve until crumb-size; SETTLED yellow crumbs are collected by touch
(+2+difficulty). So the mining loop is self-endangering: every break
shot fills your table with your own live shrapnel (friendly fire), and
the payout only comes after the debris cools. Game over (single):
touched by hot, fast shrapnel. Difficulty: aim rotation speed, rock
inflow.

## 2. Object Specifications

- **Cue (`player`)**: cyan 5×5; thrust impulse 1.7 along the rotating
  arrow (0.05 + 0.008×difficulty rad/tick), drag 0.965, wall
  reflection.
- **Rocks (`rocks`)**: size 9 → ×0.62 per split until ≤4.5 (crumb);
  split requires your speed > 0.9; children launch at 1.2 + 0.4×your
  speed with a 55-tick red "hot" phase; hot+fast = lethal, cooled =
  inert, crumbs = yellow collectibles. Slow bumps just nudge.
- Rock inflow from the edges keeps 10 max on the table.

## 3. Design Guide Analysis

- *Simplicity*: billiards intuition — line up, shoot, things break;
  color states (gray/red/yellow) carry the whole rule set.
- *Visible cause→effect*: splits burst exactly where you rammed; heat
  is literal color; crumbs chime on pickup.
- *Skill-based scoring / risk-reward*: a hard break (more speed) means
  hotter, faster shrapnel launched from point-blank — exactly where
  you are. Skill is break-shot geometry: striking so children fly
  AWAY, then weaving the cooldown window to harvest. Timid taps never
  reach split speed and score nothing.
- *Novelty*: Asteroids' split rule with the gun removed and the danger
  authored entirely by your own kinetic choices — the hazard field is
  your shot history.

## 4. Relationship with Tags

`on_pressed-go_forward`: thrust-only movement, aim by timing the
rotating arrow. `obstacle-split`: ram-triggered fission with size
floor. `rule-friendly_fire`: your break shots are the only source of
lethal objects.

## 5. Basis for Novelty

First association ("Asteroids — shoot rocks that split") was hard
forbidden. Removing projectiles and making the SPLIT itself the
danger (hot shrapnel from your own body-check) turns a shooter chore
into billiards-with-consequences.

## 6. Similarity Check

- *Asteroids*: split lineage acknowledged; no gun, no ship rotation
  control, heat-based lethality windows, and collection (not
  destruction) as the score.
- *bore-comet (batch 5, human #1)*: shares "your momentum is the
  tool"; there terrain was the weapon, here the debris cloud you mint
  is both wallet and minefield.

## Tuning notes (Polish, 2026-07-05)

Human #1 (batch 7): "岩同士が相互作用した方が面白そう" (with their own
runaway-risk caveat) — implemented conservatively: rocks now bump each
other apart elastically, and a HOT fast fragment cracking into a big
rock chain-splits it (children hot); runaway capped by the existing
10-rock limit and the fragments' rapid decay.

## Game-feel pass (2026-07-06)

Register: abstract/minimal (cue ball, rocks, shrapnel — no creature
theming), so no eyes; leaned on hit-stop/shake/trail/particle-color
instead. Split impacts (both player rams and rock-rock chain splits)
now hit-stop 2–6 frames and particle-escalate (yellow → red →
light_red) scaled by impact speed; a decaying shake offset is applied
only to the decorative aim-arrow bar, never to a collision `box()`;
the cue ball gets an algebraic two-step afterimage trail above 1.2
px/tick, computed from current velocity (no history array). Hit-stop
freezes position integration only (player/rock movement, rock spawn
timer, rock-rock interaction) — thrust impulses and collision
detection stay live so input never feels dropped, matching the
established freeze pattern from bore-comet/blast-buoy. Smoke PASS.
