# BLAST BUOY (blast-buoy)

**Tags**: #weapon-explosion, #field-water, #on_holding-reverse_state

## 1. Core Mechanics

You are a drifting mine in open water. Released: you float upward. Held:
your density reverses and you sink. Submarines patrol horizontally at
random depths and fire torpedoes when roughly level with you. Touching a
sub detonates YOUR body: an area blast that destroys every sub and
torpedo within radius 25, scores (5 + 8 per extra sub) × combo, and
hurls you away from the blast with 40 ticks of invulnerability. Combo
increments per blast and lapses 2 seconds after the last one. Game over
(single): a torpedo hits you outside i-frames. Difficulty: sub count,
speed, torpedo speed.

## 2. Object Specifications

- **Player (mine)**: cyan 6×6 box; buoyancy −0.05/tick released,
  +0.06/tick held; clamped to water column (y 10–90). Blinks light-cyan
  during i-frames.
- **Subs (`enemies`)**: green 9×4 boxes, horizontal patrol from either
  edge, depth fixed. Fire when |Δy| < 10.
- **Torpedoes (`bullets`)**: red 5×2 boxes, horizontal, speed scales
  with difficulty. Destroyed by blasts.
- **Blast**: radius-25 distance check + particles; recoil vector points
  from blast center to player.

## 3. Design Guide Analysis

- *Simplicity*: hold = sink, release = rise; collide = explode. First
  contact teaches everything.
- *Visual feedback / game over*: blasts are big particle bursts with
  floating score; death is a torpedo explosion.
- *Skill-based scoring / risk-reward*: singles pay 5; luring subs into
  a cluster before detonating pays 8 per extra plus combo scaling. The
  richest clusters form where the most torpedoes fly, and the blast
  recoil throws you somewhere you didn't fully choose.
- *Novelty*: the player's only weapon is their own body, and every
  attack doubles as forced movement (blast recoil is the game's third
  motion verb).

## 4. Relationship with Tags

`field-water` gives the buoyancy axis; `on_holding-reverse_state` is
literal (hold flips your buoyant state to sinking); `weapon-explosion`
was deviated from "drop bombs" to "you are the bomb, repeatedly" —
area damage, chain potential, and self-knockback included.

## 5. Basis for Novelty

Depth-control games and kamikaze-touch games exist; the loop here —
survive torpedo lanes on one axis, then convert a deliberate collision
into cluster score plus an uncontrolled recoil reposition — makes each
detonation both the reward and the next positioning problem.

## 6. Similarity Check

- *Submarine/depth-charge arcade games (e.g. Depth Bomb)*: those drop
  ordnance at ships; here there is no ordnance separate from the player.
- *Balloon Fight / Flappy variants*: share one-axis buoyancy control but
  have no self-detonation scoring economy.

## Tuning notes (Polish, 2026-07-03)

Human #1 (batch 3). Added an expanding light-red blast ring (14 ticks,
to r=25) so the chain radius is learnable ("連鎖破壊の条件が分からない");
sub spawn band 20–85 → 13–87 so surface/floor camping is no longer
idle-safe (Stage-1: NoInput/HoldOnly survived 60 s).

Polish iteration 2 (2026-07-03): player y-clamp 10–90 → 13–87 so the
surface/floor poles sit inside sub/torpedo reach (pole camping at y=10
was genuinely out of reach of subs spawning ≥13). Verified after the
adapter difficulty-0 fix: NoInput dies at ~8 s (was a false 60 s — the
tester's first-frame difficulty=0 made spawn intervals Infinity).

## Game-feel pass (2026-07-06)

Register: abstract/tense (no eyes, no cartoon squash). Added: hit-stop
(2–8 frames, scaled by kills-per-blast) so a detonation reads as
connecting; chain-size color escalation (light_red → red → purple)
carried through the blast ring and particles; a background-only screen
shake (water line + floor band, never the hitboxes) scaled by kill
count; a 2-segment torpedo afterimage for readability of the fastest
object on screen. Re-verified with repeated Stage-1 runs: GA best
(23) stayed above every monotonous probe across 3 trials — no new
scoring exploit from the freeze/shake.
