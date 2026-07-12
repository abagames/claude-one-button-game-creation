# BOLA THREAD (bola-thread)

**Tags**: #rule-pass_through_gap, #rule-proximity_bonus, #field-outpost

## 1. Core Mechanics

A bola — two orbs spinning around a ghost knot — flies down a scrolling
corridor. Hold: the orbs reel in (radius → 6). Release: they spread
(radius → 26). Only the ORBS collide; the knot passes through anything.
Two barrier types stream past: narrow-gap walls (thread them small or
phase-time them) and wide-gap walls with a center NUB exactly at knot
height — those force you to stay EXPANDED so both orbs straddle the nub
while still clearing the gap edges. Scoring: passing any wall pays up to
+6 proportional to your radius at the crossing (proximity to the gap
edges), and yellow beacons float at reckless heights, worth +8 to an orb
that reaches them. Game over (single): an orb touches red. Difficulty:
scroll speed, spin rate, narrower gaps, more nub walls.

## 2. Object Specifications

- **Orbs (`balls`)**: two cyan 4×4 boxes at knot ± (cos θ, sin θ)·r;
  spin 0.05 + 0.005×difficulty rad/tick; r slews 0.9/tick in, 0.7/tick
  out.
- **Knot (`player`)**: light-blue 3×3 dot at fixed (30, 50), non-lethal,
  connected by a tether line (visual only).
- **Barriers (`obstacles`)**: red 4px columns with a gap (gap always
  contains the knot line); ~25%→55% carry a red 4×8 nub centered at
  y=50 inside a wider gap.
- **Beacons (`items`)**: yellow 5×5 boxes at y=20–80.

## 3. Design Guide Analysis

- *Simplicity*: hold = small, release = big, spin is constant. The first
  nub wall teaches that small is not always safe.
- *Visual feedback / game over*: radius is the most visible quantity on
  screen; hits burst at the wall.
- *Skill-based scoring / risk-reward*: every point source demands span —
  wide crossings pay, beacons sit far off-axis — while span is exactly
  what clips walls. The radius-at-crossing bonus is a per-wall
  proximity wager, and rotation phase decides whether a chosen radius
  survives the crossing.
- *Novelty*: a size-pulsing rotating body where the "safe small" option
  is periodically outlawed by geometry (the nub), so the player must
  master passing through gaps in both size regimes.

## 4. Relationship with Tags

`rule-pass_through_gap`: both barrier archetypes are gap-threading with
a rotation-phase twist. `rule-proximity_bonus`: the radius-scaled pass
bonus and edge-hugging beacons pay for flying close to lethal geometry.
`field-outpost`: beacons are the touch-points that pull you off the
safe center line.

## 5. Basis for Novelty

First association ("graze the gate edges for points") was forbidden as
the whole design; grazing became a controllable body property (radius)
rather than a steering feat, and the nub inverts the contract-to-win
reflex.

## 6. Similarity Check

- *Flappy/gap games*: gap passage exists everywhere; a twin-orb rotor
  whose size is the sole control does not.
- *"Duet"* (two orbs rotating around a center): closest known relative —
  but Duet controls rotation with fixed radius; here rotation is
  autonomous and radius is controlled, and scoring (not survival) is
  tied to staying wide.

## Tuning notes (Polish, 2026-07-03)

Human #2 (batch 3); only complaint "難しすぎる" (tuning). Eased: rotation
0.05+0.005d → 0.04+0.004d, scroll 0.5+0.12d → 0.45+0.1d, narrow gaps
+2px, wall spacing 55–80 → 65–90, radius slew in/out 0.9/0.7 → 1.2/0.9
(intent lands within one crossing window). Nub economy untouched.

Polish iteration 2 (2026-07-03): nub-wall probability 0.25 → 0.35 base
(cap 0.6) — the eased pacing had strengthened hold-camping (HoldOnly
9→25 s, 24 pts); more nubs (the pattern the human liked most) break it:
verified HoldOnly now 4 s / 0 pts.

## Second-pass game-feel + tuning (2026-07-06)

Register: abstract/minimal (no eyes) — orbs/knot/barriers/beacons are
inanimate physics shapes, no creature naming or rounded/cute palette.
Applied: hit-stop (2–6 frames) + particle color/count escalation
(`light_cyan`→`cyan`→`yellow`) on wall-pass proximity bonus, scaled by
the existing bonus-tier; decaying shake on the tether line + knot only
(both purely decorative, never collision-checked); algebraic afterimage
trail on the orbs derived analytically from the radius/angle slew rates
(no history array, despite the circular path), colored to avoid `cyan`
so ghost boxes can't trip the walls'/beacons' `isColliding.rect.cyan`
checks. Radius slew halved per user request: contract 1.2→0.6/tick,
expand 0.9→0.45/tick (roughly doubles time-to-extreme-radius).
Rotation speed also halved per follow-up request: `0.04+difficulty
×0.004` → `0.02+difficulty×0.002` rad/tick. Smoke PASS.

Bug found after the rotation halving (user, 2026-07-06): a nub wall is
lethal-unavoidable if the orbit happens to be "sideways" (`ang` near
0/π, both orbs near knot height) when the wall reaches the knot,
because vertical separation is `sin(ang)·r` — at `sin(ang)≈0` no
radius clears it, and the slower rotation now lets that phase persist
through a whole crossing. Fix: since rotation has no randomness, the
phase at arrival is exactly predictable from the current tick — at
spawn time, project `ang` forward by `dAngNow × (108−30)/spd` (ticks
until the wall reaches the knot's fixed x=30) and only keep the `nub`
flag if that predicted phase is comfortably vertical
(`abs(sin(predictedAng)) > 0.8`, i.e. within ~37° of 90°/270°, far
above the ~0.23 physically required even at max radius); otherwise the
wall silently falls back to an ordinary narrow-gap wall. Uses the same
`rnd()` call structure as before (only the boolean is ANDed with a
deterministic predicate), so no RNG-desync risk. Verified the
prediction against a standalone tick simulation — matches actual
future `ang` to within ~0.01 sin-units across difficulty 0–8. Smoke
PASS.

Tuning request (user, 2026-07-07): nub-wall passes no longer pay the
radius-proximity bonus (`addScore`/sound/hit-stop/shake/particle all
now gated on `!o.nub`) — the nub is its own reward (surviving the
forced expand-timing), the bonus is now plain-wall only. Smoke PASS.

Follow-up (user, 2026-07-07): the bonus was too subtle at low radius to
read as "working" — fully contracted (r=6) paid `floor((6-6)/3)=0`, no
score/sound/feedback at all for a clean pass. Changed to
`max(1, floor((r-6)/3))` so every wall pass pays at least +1
regardless of radius, still scaling up from there with proximity to
the edges. Also reverted the previous nub-exemption: nub passes pay
the same bonus again (the `!o.nub` gate removed), since the "own
reward" framing made passing invisible in the same way. Smoke PASS.

Tuning request (user, 2026-07-07): nub-spawn roll `clamp(0.35+difficulty
×0.06, 0, 0.6)` → fixed `0.36` (no difficulty scaling); plain-wall
`gapH` `rnd(32,40) - min(difficulty×1.5, 8)` → fixed `rnd(25,40)` (no
difficulty scaling — the 25 floor keeps roughly the same minimum width
the old formula's difficulty-8 cap gave, `rnd(32,40)-8` ≈ 24–32).

User asked whether the phase-prediction nub-safety guarantee (above)
still holds given `spd` and `dAngNow` keep growing unboundedly with
difficulty. Verified with an extended tick-by-tick simulation (real
`difficulty = 1 + ticks/3600` evolution, not the constant-rate
approximation the in-game predictor uses): **holds with wide margin
through difficulty 300 (~5 hours of continuous, unbroken play, checked
at 0.05 rad angle resolution, zero violations)**. It technically
degrades only past difficulty ≈374 (~6.2 hours) — `dAngNow` by then
approaches a size where a *single tick's* rotation is comparable to
the whole safety-margin zone width, so the predictor's constant-rate
assumption stops holding within its own prediction window. This is a
theoretical ceiling, not a practical one: no real playthrough survives
anywhere near that long (both `spd` and `dAngNow` are already large
enough by minute 10–20 that the plain narrow gates alone are brutal),
so the guarantee holds for every difficulty a game session will ever
actually reach.
