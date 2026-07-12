# BORE COMET (bore-comet)

**Tags**: #on_pressed-pierce, #on_holding-thrust, #on_holding-shoot

## 1. Core Mechanics

A comet glides through a scrolling sky of floating rock islands over a
burning sea. Hold: drill-thrust upward — and while overlapping a rock,
you BORE through it (slow, grinding, invulnerable, drawn gold).
Release: you fall; touching rock while not drilling is a fatal crash.
The payoff: EXITING a rock while still drilling releases a piercing
burst that kills every bird within radius 22 — n birds pay 3n².
Birds cruise the sky lanes and kill on contact (unless you are inside
rock). Game over (single family): crash into rock undrilled, touch a
bird exposed, or fall into the red sea. Difficulty: scroll speed, bird
rate.

## 2. Object Specifications

- **Comet (`player`)**: cyan 5×5 (gold while boring); gravity
  0.05/tick, thrust −0.11 (−0.06 inside rock), motion damped ×0.45
  while boring.
- **Islands (`obstacles`)**: gray boxes 14–30 × 10–22 scrolling left.
- **Birds (`enemies`)**: red 5×4, fly left slightly faster than the
  scroll at random altitudes.
- **Burst**: radius-22 kill zone emitted at the rock-exit moment while
  drilling; 3n² scoring.

## 3. Design Guide Analysis

- *Simplicity*: hold = rise, and the gold-tint + grind particles make
  the bore state unmistakable on first contact.
- *Visual feedback / game over*: everything lethal is red; boring is
  loud and sparky; the exit burst is a screen-shaking payoff.
- *Skill-based scoring / risk-reward*: rocks are the only safe place
  and the only weapon, but entering one commits you to slow, blind
  passage while birds reposition; the 3n² bonus pays for exiting INTO
  danger — timing the exit when birds cluster near the face of the
  rock.
- *Novelty*: the obstacle is ammunition — you load yourself into
  terrain and fire yourself out of it.

## 4. Relationship with Tags

`on_holding-thrust`: the drill is the engine. `on_pressed-pierce`:
boring through islands and the exit shockwave. `on_holding-shoot`
deviated: instead of a bullet stream, the sustained hold "charges" a
single area burst delivered by terrain transit.

## 5. Basis for Novelty

First association ("gun whose recoil is thrust") was recorded and
forbidden (already built as dim-lance in batch 4). The kept design
moves the weapon into the terrain-transit loop: safety, travel, and
attack are one continuous held gesture.

## 6. Similarity Check

- *Drill games (Drill Dozer, Mr. Driller)*: drilling is traversal
  there; here it is also invulnerability and a positional bomb.
- *Flappy-with-obstacles*: shares gravity-vs-lift, but obstacles are
  enterable and weaponized rather than avoided.

## Tuning notes (Polish, 2026-07-04)

Human #1 (batch 5). "掘削で得点の方が単純で分かりやすい" — digging now
scores directly (+1 per 12 boring ticks, coin chime); the exit burst
stays as a bonus. Ceiling-camp immortality closed: ceiling clamp 6→10
and bird band 12–82 → 8–84 so hover-campers get clipped.

## Game-feel pass (2026-07-06)

Register: abstract/tense (blocky rock and bird shapes, no eyes or
cartoon squash; the burning sea and instant crash-death keep the tone
serious). Added: the exit-burst particles now escalate color and count
with birds killed (`light_yellow` → `yellow` → `light_red` at 0/2/4+
kills, count `20/10 + n·6/2`, reusing the existing kill-count `n`
rather than a new variable); a hit-stop (2–8 frames, scaled with kill
count) freezes the comet, rocks, and birds right after a scoring
burst so the kill reads as connecting; a decaying screen-shake offset
on the same burst, applied only to two new decorative bars (a sky line
at the ceiling, an ember-glow line above the sea) — the sea's actual
hazard rect never moves, so the crash boundary stays exact; a
2-segment cyan/light_cyan (yellow/light_yellow while boring)
afterimage trail on the comet, computed algebraically from its current
`vy` (no history array — motion is a straight vertical line), shown
only above 1.0 px/tick and clamped to the safe y-band (10–88) so a
fast upward thrust near the sea can never let the trail itself trigger
the sea's color-based collision check. Re-verified: smoke PASS (idle
4s + input 8s, no console errors).

## Feature: rock destruction by sustained drilling (2026-07-06, human's request)

Rocks previously never went away — they only scrolled off-screen. Each
rock now tracks its own drilling progress (`boreT`, persists across
exits so a partially-bored rock can be finished later); once `boreT`
reaches `sqrt(w·h) / (spd / 0.5)` ticks, the rock is destroyed outright
and detonates a bonus burst centered on the comet, with radius
`15 + (w+h)/4` (~20–28, size-scaled) — killing birds in range for
`m²×3` points, on top of whatever the digging score already paid out
during the bore.

The threshold formula went through three iterations because a rock is
a moving target, not a stationary one: the comet's x is fixed, so a
rock only overlaps it for `(w+4)/spd` ticks as it scrolls past — the
first formula (`w·h/3`, 47–220 ticks) exceeded that dwell time for
every rock at every difficulty, so nothing was ever destructible. The
final `sqrt(w·h) / (spd/0.5)` form keeps `threshold/dwell` at a
constant ~33–38% regardless of size *and* difficulty (both the
threshold and the dwell scale as `1/spd`, so the ratio between them
doesn't drift as `spd` climbs with difficulty over a long run) — a
static tick count would have worked at low difficulty and drifted back
to impossible at high difficulty, since `spd = 0.5 + difficulty·0.1`
grows unbounded.

This coexists with the existing exit-while-drilling burst (radius 22,
unchanged) rather than replacing it: quick in-and-out dodges stay
viable for fast, precisely-timed kills, while committing to fully bore
through a rock is a slower, safer, size-scaled payoff. Destroying a
rock also clears `inRock` for that frame, so the pre-existing exit
burst fires naturally in the same frame using the comet's position —
enemies killed by the destruction burst are removed from `enemies`
first, so the two bursts can never double-count or double-score the
same bird. Hit-stop/shake from both bursts combine via `max()` rather
than the second overwriting the first, so a destruction landing in the
same frame as an exit burst doesn't get shrunk back down. Distinct
feedback: destruction debris particles are `light_black` (rock-colored)
plus `purple` on each bird killed (a tier above the exit-burst's
yellow-scale colors), separate from the exit burst's own escalating
palette. Re-verified: smoke PASS after each iteration.

## Tuning: digging score → +1/tick silent, rock-destruction completion bonus (2026-07-06, human's request)

Digging score changed from a discrete +1 per 12 ticks (with a coin
chime and a floating "+1") to +1 every tick while boring, via
`addScore(1)` with no position argument — that omits the floating
text, so the payout is a silent, continuous trickle instead of a
rhythmic tick (the `carveT` counter this replaced is removed as
dead code). Over a full bore-through this pays out exactly
`boreThreshold` points (the same tick count the destruction check
already uses), since both now advance in lockstep every drilling tick.

This made rock destruction with zero birds nearby pay literally 0
bonus on top of that trickle, so a completion bonus was added:
`addScore(boreThreshold, ...)` on every destruction, unconditional of
kills — it doubles the take for finishing a rock outright, scales with
size/difficulty for free since `boreThreshold` already encodes both,
and is shown with its own floating text 6px above the comet so it
doesn't visually stack on top of the kill-bonus text at the same spot.
The existing kill-bonus formula (`m²×3` / `n²×3`, both bursts)
deliberately was **not** rescaled: a 2-bird kill (12 pts) already
matches a small rock's full trickle, and a 4+ kill (48+ pts) dwarfs
even a large rock's, so risking a bird-rich exit stays the higher-
value play relative to the new faster trickle without further tuning.
Re-verified: smoke PASS.

## Game-feel: burst-radius rings (2026-07-06, human's request)

Neither burst previously showed its actual kill radius — birds inside
either the 22-unit exit-burst or the size-scaled destruction radius
just died, with no on-screen indication of *why* a given bird was or
wasn't caught. Especially for the destruction burst, whose radius
varies ~20–28 with the rock just bored through, this made the range
unreadable by anything but trial and error. Added two independent
fading rings (`burstFx` for the exit burst, `destFx` for destruction),
each an `arc()` that expands from 0 to the burst's true radius over
12–14 frames then vanishes — same growing-shockwave technique as
blast-buoy's `blastFx`. Both fire on every burst attempt, including a
0-kill exit, since the point is teaching the range, not just
celebrating a hit. Two separate state slots (rather than one shared
one) so a destruction that chains into the same-frame exit burst (see
the rock-destruction feature above) shows both rings instead of the
second overwriting the first. Colors are the already-computed burst
tier color for the exit ring and `light_black` (rock-colored) for the
destruction ring — never `cyan`, so the ring can't trip the sea's
color-based collision check. Re-verified: smoke PASS.
