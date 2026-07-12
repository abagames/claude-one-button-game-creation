# SPIN CELL (spin-cell)

**Tags**: #on_pressed-change_field, #field-spike, #rule-geometry

## 1. Core Mechanics

A ball bounces under gravity inside a square cell whose 12 wall
segments (3 per side) are a mix of safe stone and lethal spikes. Tap:
the entire cell rotates 90° clockwise — spikes, warnings, and the
corner gem all remap — while the ball keeps its position and momentum
and gravity stays down. The floor is a kicker (constant bounce height),
so the ball never settles. A gem waits in one corner (+8, then moves).
Spikes CREEP: every few seconds a blinking segment turns spiked
(max 8 of 12). Game over (single): the ball lands on a spiked segment.
Difficulty: bounce energy and creep rate rise.

## 2. Object Specifications

- **Ball (`player`)**: cyan 5×5 box; gravity 0.06; floor bounce
  −(2.2 + 0.15·difficulty) with slight horizontal jitter; side walls
  reflect at 0.95.
- **Walls (`walls`)**: 12 segments (~29px), red = spike, gray = safe,
  blinking light-red = converting in 1.5 s. Rotation remaps each
  segment one side clockwise.
- **Gem**: yellow 5×5 at one inner corner; rotation carries it to the
  next corner; collection re-rolls the corner.

## 3. Design Guide Analysis

- *Simplicity*: ball bounces by itself; one tap visibly spins the whole
  world a quarter turn. The safe/deadly coloring is binary.
- *Visual feedback / game over*: creep segments blink before arming;
  the rotation is a full-screen state change you cannot miss.
- *Skill-based scoring / risk-reward*: the gem sits in a corner — the
  hardest place to visit safely — and every rotation you use to dodge
  also moves the gem. You must plan two geometries at once: where the
  ball WILL land, and what the wall pattern BECOMES after the spin.
- *Novelty*: the dodge verb moves the hazards, not the player; a
  90°-rotation prediction puzzle running on pinball physics.

## 4. Relationship with Tags

`on_pressed-change_field`: the press changes the field, never the ball.
`field-spike`: spike segments are the sole death. `rule-geometry`:
square symmetry, quarter-turn remapping, and trajectory prediction are
the entire skill.

## 5. Basis for Novelty

First association ("toggle spike walls on/off with the button") was
forbidden. Rotation-instead-of-toggle makes every input a permutation
of the danger layout — dodges are moves in a group, not switches.

## 6. Similarity Check

- *Rotating-maze gravity puzzlers (e.g. And Yet It Moves)*: those
  rotate to steer the PLAYER's fall direction; here gravity never
  changes and rotation redistributes hazards.
- *Pinball*: shares the kicker floor, but there is no flipper — timing
  the world-spin is the only interaction.

## Tuning notes (Polish, 2026-07-04)

Human #1 (batch 4, full-batch recalibration). Adopted the player's two
proposals: rotation 90° → ONE-STEP clockwise perimeter shift (12
positions, finer prediction game), and floor-drag steering (shifting
while the ball rides the floor nudges it left — indirect ball control
at last). Also fixed the judge finding "top corner gems unreachable":
floor kick 2.2+0.15d → 3.0+0.1d (apex now clears y≈16), gems at
(14,14)/(86,14)/(86,86)/(14,86) with catch radius 8; bottom/left
segments now draw in true clockwise perimeter order.

Human verification (2026-07-04): one-step shift + floor-drag steering
confirmed better by the player ("この操作の方が良い").

## Game-feel pass (2026-07-06)

Register: abstract/tense (geometric cell, panic-driven — no eyes, no
cartoon squash; trajectory-prediction readability comes first).
Added: a fading ring pulse centered on the cell on every rotation, so
the core verb (the whole field just moved) gets its own visible beat
in addition to the wall remap itself; a particle burst at the moment a
creeping segment arms into a spike (the blink telegraph already
existed — this adds the payoff); a short hit-stop (8 frames, ball and
input frozen) before game-over so a spike death reads as connecting
rather than an instant cut; a 4-frame cyan/light_cyan afterimage
trail on the ball, shown only above 1.5 px/tick so it doesn't smear
during slow drifts. No screen shake / camera kick: this game's core
skill is reading exact wall-segment position, so a moving camera was
judged more likely to hurt than help. Re-verified: smoke PASS
(idle 4s + input 8s, no console errors).

## Feature: gem clears a spike (2026-07-06, human's proposal)

Human suggestion: collecting the gem should also revert one (random)
spiked segment back to safe. Previously the gem and the spike-creep
system never touched — score was the only reward for a corner visit,
even though corners are the riskiest place on the board. Implemented:
on pickup, one random currently-spiked segment (if any) reverts to
safe, with its own particle burst + `powerUp` sound distinct from the
coin chime. This makes the two systems interact the way the design
doc already claimed ("plan two geometries at once") — a gem run is
now both the score play and the pressure-relief valve against the
creep, so risking a corner has a second payoff. Re-verified: smoke
PASS.

## Feedback: floor-drag nudge confirmation (2026-07-06, human's request)

The floor-drag steering (tap while `player.pos.y > 87` shifts `vx` by
−0.6, always leftward — see Tuning notes above) previously had no
feedback of its own; it shared the rotation's ring pulse and `select`
sound, so a successful nudge was not distinguishable from a plain
rotation tap. Added, only on the frames the nudge condition actually
fires: a rightward-biased particle burst at the ball (kick-off spray,
opposite the push direction), a `click` sound distinct from rotation's
`select`, and an 8-frame cyan/light_cyan flash on the ball itself.
Re-verified: smoke PASS.

## Tuning: creep rearm rate (2026-07-06, human's request)

Since gem pickup can now clear a spike (see above), the human noted
the creep cycle should run a bit faster to compensate, so total spike
pressure doesn't just trend downward as gems accumulate. Rearm quiet
time (the wait after one segment arms before the next starts blinking)
550/√difficulty → **400/√difficulty** (≈27% faster at every difficulty
level; the fixed 90-tick blink-telegraph window and the max-8/12 cap
are unchanged). Re-verified: smoke PASS.

## Tuning: initial spikes 3 → 2 (2026-07-06, human's request)

Starting layout eased from 3 spiked segments (top-middle, bottom-middle,
left-top) to 2 (top-middle + bottom-middle only, walls index 1 and 7) —
a softer, symmetric open before the creep and difficulty ramp take
over. Re-verified: smoke PASS.

## Tuning: start direction fixed rightward (2026-07-06, human's request)

Initial `vx` was `rnd(0.4, 0.8) * (rnd() < 0.5 ? 1 : -1)` — a 50/50
left/right coin flip. The human noted this was never actually biased
(confirmed: no automatic code path pushes the ball left without input —
the −0.6 floor-drag nudge only fires on `input.isJustPressed` — the
perceived drift was the fixed `seed: 25` happening to roll a leftward
start), but since the one-step-clockwise rotation makes a leftward
open harder to dodge into, fixed the start to always rightward:
`vx: rnd(0.4, 0.8)`. Re-verified: smoke PASS.

## Tuning: gem score = spikes² (2026-07-06, human's proposal)

Gem payout changed from a flat +8 to a function of board danger at the
moment of pickup: `max(spikeCount, 1)²` — spikeCount 0 or 1 → +1,
2 → +4, 3 → +9, and so on up to the 8/12 cap (→ +64). Measured on the
spiked-segment count *before* this pickup's own one-spike reversion
(see the "gem clears a spike" note above), so the reward reflects how
dangerous the board was when you risked the corner, not how safe it
becomes afterward. This makes letting spikes accumulate before a gem
run a deliberate (high-risk, high-payout) strategy, on top of the
existing pressure-relief effect. Re-verified: smoke PASS.

## Tuning: creep rearm tied to spike count AND difficulty (2026-07-06, human's proposal)

Rearm quiet time changed again, from the time-based `400/√difficulty`
to **`200·√(spikeCount + 1) / √difficulty`**, measured on the spike
count right after the segment that just armed (so it includes that
new spike). This makes the creep self-regulating on top of the
existing time-based ramp: near-empty boards (spikeCount 0–1) rearm
faster than near-capped ones (spikeCount 7–8) at any given difficulty,
while the whole timer still speeds up as `difficulty` climbs over the
run (first proposed without the `/√difficulty` term; restored per
human request so both axes apply together). `difficulty` also still
drives the floor-bounce energy (see Object Specifications), independent
of this timer. Re-verified: smoke PASS.
