# ROPE CORRAL (rope-corral)

**Tags**: #rule-physics, #field-connected, #rule-surround

## 1. Core Mechanics

Two balls, one rope. You (cyan) roll and ricochet off the walls; your
buddy (blue) trails behind on the 16px rope. Hold: the BUDDY anchors
and you whip around it in a circle — a glowing arc shows how far
you've swept; complete a FULL revolution and everything inside the
rope circle is corralled: n critters pay 4n². Release: momentum from
the swing becomes your new roll direction (tangential launch — your
steering). Critters are COLLECTIBLE: touching one directly gathers it
for +1 (the corral is the jackpot). Game over (single): touch a red
spike. Difficulty: overall PACE rises (roll, swing, and critter speed
×(1+0.35(d−1))) and spikes slowly accrue (telegraphed, max 6).

## 2. Object Specifications

- **You (`player`)**: cyan 5×5, free-rolling with wall bounces; while
  swinging, position follows the anchor circle and velocity is kept
  tangential (release = slingshot).
- **Buddy (`buddy`)**: light-blue 5×5; trails on the rope when you
  roll (dragged when taut), becomes the fixed anchor while held.
- **Critters (`enemies`)**: yellow 5×4 wanderers, up to 8; collected
  on touch (+1) or corralled in bulk (4n²).
- **Spikes (`spikes`)**: red 6×6, 3 at start, +1 per ~12 s (blink-in
  telegraph, max 6); the only lethal object.
- **Sweep arc**: light-yellow arc from swing start to current angle —
  the corral progress bar drawn in world space.

## 3. Design Guide Analysis

- *Simplicity*: rope, swing, circle — playground physics; the sweep
  arc makes "one full turn" visually explicit.
- *Visible cause→effect*: capture fires exactly when the arc closes;
  the release slingshot is felt immediately.
- *Skill-based scoring / risk-reward*: 4n² pays for anchoring where
  critters CLUSTER, but a full revolution takes ~90 ticks during
  which you barrel through spike-adjacent space on a fixed circle —
  and wandering critters may exit (or blunder into your hull) before
  the loop closes. Where you anchor, when you commit, and where the
  slingshot throws you next are one braided decision.
- *Novelty*: area-capture drawn by a physical tether's revolution —
  the enclosure is a swept circle with a live progress arc, not a
  drawn trail; and the capture tool doubles as the movement system
  (slingshot steering).

## 4. Relationship with Tags

`field-connected`: the rope couples anchor, sweep radius, and
steering. `rule-physics`: tangential release velocity, dragged buddy.
`rule-surround`: full-revolution corral.

## 5. Basis for Novelty

First association ("lasso a group by drawing a loop around them") was
forbidden as drawn-trail capture (Qix-family, and batch-5 loop-rail).
The kept design makes the loop a RIGID physical revolution with
committed geometry, and reuses its exit momentum as the only steering.

## 6. Similarity Check

- *Qix / loop-rail (batch 5)*: enclosure via free/graph trails; here
  the enclosure is always a circle of fixed radius — the choice is
  placement and timing, not shape.
- *Rope-swing games (pinclimb, grapplingh, etc.)*: swing for
  TRAVERSAL; none capture by completed revolutions or score by
  enclosed count.

## Tuning notes (Polish, 2026-07-05)

Human #1 (batch 6). Iteration 1 recolored the critters purple to fix
the color-language violation ("黄色いアイテムを取るゲームかと思った").
Iteration 2 (user direction): the human's reading IS the better game —
critters stay YELLOW and are collectible: direct touch collects one
(+1), the full-revolution corral remains the jackpot (4n²). Critter
touch no longer kills; the only death is spikes. Difficulty now scales
as PACE (roll/swing/critter speed ×1+0.35(d−1)) plus a slow, telegraphed
spike accrual (max 6).

Iteration 3 (2026-07-05, user note): spike placement now retries up to
8 times to keep ≥24px from other spikes and ≥20px from the player
(applies to the initial 3 and each accrued spike) — no more unfair
clusters blocking swing space.

## Game-feel pass (2026-07-06)

Register: character-playful ("buddy" + critters, playground-physics
framing). Initial call was to skip eyes (5×5 boxes assumed too small
to read) but a zoomed screenshot check disproved that: a single 1px
offset "eye" dot reads clearly against each body color at real game
scale, so eyes were added after all — player and buddy look toward
their current facing angle (`atan2(vy, vx)` / angle-to-player), each
critter toward its own wander `ang`; genuinely inert objects (spikes)
were left without eyes, since they don't act with intent (see the
generalized eyes guidance in `maximizing-game-feel/SKILL.md` §4.3).
Applied: hit-stop (2–8 frames) + particle color escalation
(light_yellow → light_red → magenta at n≥3/6) on the corral capture
only, scaled by `n`, so the jackpot reads distinct from the critter
trickle; decaying shake applied ONLY to the decorative sweep-arc and
rope line (never the box() hitboxes); algebraic afterimage trail on
the player above 1.5 px/tick, gated to the free-roll (straight-line)
state only — excluded during the swing since a straight offset would
misread the circular arc. Critter wander's per-tick `rnd()` jitter is
deliberately left unfrozen by hit-stop, per the RNG-desync lesson in
`../BACKLOG.md`. Smoke PASS.

## Feature request round (2026-07-06)

`ROPE` (anchor-to-player distance) 16 → 22, on user request, to make
clustering critters into one corral easier — also lengthens the
free-roll tether and the swept-circle area, so bigger group corrals
are more reachable per revolution.

Spikes are now corral-capturable, same mechanism as critters: any
spike inside the swept circle (`distanceTo(buddy) < ROPE - 2`) is
removed and folded into the same `n` as captured critters, scored by
the same `n²×4`, same particle/hit-stop/shake escalation. This is
safe by construction, not just by luck: the player's swing always
traces the circle's outer *edge* (radius exactly `ROPE` from the
buddy — that's the only place the lethal spike-contact check can
fire), while capture requires being *inside* that edge by a 2px
margin. A spike sitting on the swing path stays exactly as lethal as
before; only spikes already tucked inside the loop get swept away —
so corralling near a spike is a deliberate risk/reward routing
choice, not a hidden safe zone. Destroying a spike this way is
permanent as that spike (it does not respawn itself, though the
existing timer can still accrue new spikes up to the cap of 6), so a
good corral doubles as hazard cleanup. Smoke PASS.

Spike size (`box`) halved: active 6→3, telegraph blink 4→2; the
lethal-contact radius was tightened 5.5→4 to match (kept as the sum
of half-widths — spike half 1.5 + player half 2.5 — same convention
as before, not an arbitrary number). Smoke PASS.

Every critter or spike removed (direct collect, corral capture, or
corral-destroyed spike) is immediately replaced by a freshly spawned
critter at a random position (`spawnCritter()`), uncapped by the
natural spawn timer's population limit. Net effect: collecting or
corralling critters is population-neutral (each one removed is one
respawned), but clearing a spike via corral is a net +1 — the
on-screen critter total grows every time a spike is cleared this way,
since nothing else was removed to offset it. Smoke PASS.

Release (slingshot) speed toned down twice on user request: the
tangential launch velocity's `ROPE * w` multiplier went ×1.2
(artificial boost past true rim speed) → ×1.0 (true rim speed) →
×0.8 (below true rim speed) for a noticeably gentler roll-on after
release. Smoke PASS each step.
