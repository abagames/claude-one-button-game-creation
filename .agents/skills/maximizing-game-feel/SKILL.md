---
name: maximizing-game-feel
description: "Improves the tactile satisfaction (\"game feel\") of action games whose visuals are functional but flat. Use when a game runs correctly but feels lifeless; applies to players, enemies, obstacles, projectiles, and items."
---

# Maximizing Game Feel

You are an experienced game programmer well-versed in **Game Feel** — the tactile sensation and moment-to-moment satisfaction of gameplay. Use this skill to upgrade action games whose visuals are functional but flat into something that feels alive.

Default artifacts:
- If a project directory is known, record the polish plan, thresholds, and effect budgets in `<PROJECT_DIR>/FEEL_TUNING.md`.
- For existing projects, inspect current entities/components/scripts, collision bounds, rendering hierarchy, particle/trail helpers, and performance notes before choosing file paths or effect names. If the path is absent, produce a standard path-based plan and say project inventory was skipped.
- If polish changes gameplay readability, difficulty, visual/audio direction, or telemetry expectations, update the relevant short summary in `<PROJECT_DIR>/README.md`.
- **Lightweight mode for small games**: for a mini-game on the order of one file / a few hundred lines, skip `FEEL_TUNING.md` and the project inventory; record the chosen register, the applied techniques, and any effect budgets as a roughly 3-line note in the README (or the main file's header comment) instead. Wherever this skill says to record something in `FEEL_TUNING.md`, that note is the substitute.

## 1. When to Use This Skill

Use this skill when:
- A game's mechanics are correct but the visuals feel static or "dead".
- Hits, jumps, landings, or destructions don't feel impactful.
- Movement looks rigid — no anticipation, no follow-through, no weight.
- You want a single object (typically the player) to feel responsive, **and** want the rest of the world to match its energy.

## 2. Apply Techniques to Every Object, Not Just the Player

Each technique below can — and should — be applied not only to the player but to **enemies, obstacles, projectiles, and items**. Consistent application across multiple objects is what makes the entire game world feel lively, rather than producing a single expressive player in a dead world.

When in doubt, ask: *"Does this enemy / obstacle deserve the same level of expression as the player?"* The answer is usually yes.

## 3. Match the Game's Expressive Register

Effects are not tone-neutral. Eyes and pronounced squash commit a game to a cute, character-driven look; the same effects can wreck an abstract, minimal, or serious game. Decide which register the game is in *before* applying techniques.

**Infer the register from the project, do not assume.** Use whatever signals exist:
- The game `title` and `description` text, the README, `FEEL_TUNING.md`, and any visual-direction notes.
- Object, sprite, and helper names (`slime`, `bug`, `mascot` vs `shard`, `drone`, `block`, `node`).
- The existing palette and shapes (rounded and saturated vs angular, neon, or monochrome).

If a `directing-game-visuals` artifact or other visual-direction doc exists, follow it; only infer when none is present. Record the register you picked and the evidence in `FEEL_TUNING.md`.

Map the game to a register, then prefer the effects that fit it:

| Register | Examples | Lean into | Avoid |
| :--- | :--- | :--- | :--- |
| **Character / playful** | creatures, mascots, cute arcade | every technique, including eyes and pronounced squash | — |
| **Abstract / minimal / geometric** | neon, puzzle, clean shapes | tilt, trails, particles, motion- and light-based juice | eyes and cartoon squash — express "looking / targeting" through orientation, a leading edge, or a focal highlight instead |
| **Serious / realistic / tense** | survival, horror, sim | restrained squash, weighty tilt, impact particles, hit pause | bouncy cartoon deformation; eyes only on a diegetic creature |

When unsure between registers, choose the more restrained one: motion-based juice (tilt, trails, particles) reads as "alive" in almost any register, while faces and bounce do not.

## 4. Implementation Techniques

Implementation baseline for 2D games:
- Keep gameplay/collision state authoritative. Put squash, tilt, trails, flashes, and particles on render-only visuals or presentation components; do not scale or rotate the collision geometry to sell feel.
- Clamp visual deformation and rotation, then always tween back to rest. If no project data exists yet, pick conservative starting limits and tune from a quick playtest.
- Gate trails, screen shake, dense particles, and hit pause by observed speed, charge, impact value, or failure importance. Avoid always-on polish.
- Use small local helpers or presentation components (for example `player_feel`, `hazard_feel`, `reward_feel`, `FeelController`, or `JuiceSystem`) rather than a large framework for a mini-game.
- For Web/mobile/low-end targets, cap active particles/trails, prefer short-lived pooled sprites or cheap engine-native particles, and define a minimum performance target such as stable 30 FPS.

### 4.1 Squash & Stretch
- Stretch the object **vertically** at the start of a jump; squash **horizontally** on landing.
- During idle, add a subtle breathing-like expansion and contraction.
- **Enemies / movable obstacles**: an enemy, or a bouncing/pushable obstacle, squashes on impact and gradually returns to its original shape. A fixed obstacle (a wall, a rooted spike) never lands or bounces, so squash doesn't apply — give it a hit-flash or particle burst instead (§4.7/§4.4).

### 4.2 Dynamic Tilt / Rotation
- Tilt the object slightly in the direction of movement based on X-axis velocity or acceleration ("leaning forward").
- **Enemies / movable obstacles**: moving enemies, and mobile obstacles like rolling boulders or bouncing hazards, spin or tilt proportionally to their velocity. A fixed obstacle (a wall, a rooted spike) has no velocity to tilt from.
- Use rotation to telegraph state changes (charging, alerted, defeated) — not just movement. This is how a fixed obstacle can still use rotation (e.g., a turret rotating to aim) without velocity-based tilt.

### 4.3 Adding Expression (Eyes)
- **Register gate**: eyes commit the game to a character / playful register. Only add them when the inferred register (see §3) supports faces. For abstract or serious themes, convey "looking / targeting" through orientation, a leading edge, or a focal highlight instead of drawing a face.
- Draw "whites and pupils" inside the body shape.
- Eyes should always look toward the **direction of movement** (or input direction, or the current target).
- **Any agentive object** — enemies, companions, collectibles, projectiles with a mind of their own — benefits equally, not just the player: add eyes so they look toward their movement direction or toward the player/target. This single change does enormous work for personality. Reserve the exception for genuinely inert obstacles (walls, spikes, static blocks) that don't act with intent — a face reads as false agency there. The real gate per object is legibility at its actual on-screen size (a 4–5px shape may not have room for a readable pupil), not its category.

### 4.4 Particle Effects
- Scatter small fragments (dust clouds) from the feet on landing, jumping, dashing, or stopping; fade them out.
- Spawn particles on **wall bounces, destruction, and spawn-in** for any object — not just the player.
- Use color and density to communicate intent: dust is gentle, sparks are violent, glints are rewarding.

### 4.5 Afterimage (Trail)
- During fast movement or jumps, leave faded copies along the trajectory to emphasize speed.
- Apply trails to **fast enemies and projectiles** as well — it lets the player read motion vectors at a glance.

### 4.6 Easing & Secondary Motion
- Move and scale through easing curves (ease-out for arrivals, ease-in for departures, a small overshoot-and-settle for "snap"), not linear ramps.
- Add **anticipation** before a big action (a brief crouch before a jump, a wind-up before an attack) and **follow-through** after it (overshoot, then settle). This directly answers the "no anticipation, no follow-through, no weight" symptom.
- Let dependent parts lag slightly behind the body (secondary motion) so motion reads as connected mass, not a rigid block.
- **Enemies**: telegraph attacks with a readable wind-up; let defeated enemies overshoot and settle rather than snapping to a pose.
- **Obstacles**: a destructible obstacle can get the same overshoot-and-settle on being destroyed instead of vanishing outright; a purely environmental hazard (a fixed wall or spike) has no attack or defeat to telegraph — its anticipation is instead a wind-up before it *activates* (e.g. a spike track that visibly winds up before triggering), not a snapping-to-pose bug.
- Register note: works in every register — keep overshoot subtle for serious/realistic, more pronounced for playful.

### 4.7 Hit Flash / Damage Tint
- On taking a hit, flash the whole sprite to a flat bright tint (white, or a hot color) for 1–3 frames, then return to normal.
- Use a brief contact/invulnerability window so repeated flashes read clearly instead of strobing.
- **Enemies / destructible obstacles**: flash on hit to confirm the hit registered even before it dies or breaks; tint toward red/white as health drops. A hazard with no health (a fixed spike, a wall) has nothing to flash for.
- Readability: keep the flash short and never let it mask the hazard silhouette during tight timing (see §6).

### 4.8 Hit Stop / Hit Pause
- On a strong impact (landing a hit, a kill, a hard landing), freeze the involved objects — or the whole scene — for a few frames, then resume; the brief pause makes the moment feel like it "connected".
- Scale duration with impact value: a light hit pauses 1–2 frames, a heavy or finishing blow several. Keep the total stop short so control never feels laggy.
- Freeze presentation while keeping queued input responsive; do not drop the player's buffered inputs during the pause.
- Register note: fits impact-driven games (action, combat, block-breakers). For calm or flowing games, use sparingly or skip.

### 4.9 Screen Shake & Camera Kick / Zoom Punch
- Offset the camera by a small random amount that decays to zero over a few frames on impacts, explosions, and big scoring events.
- Prefer **directional** kicks (push opposite the impact, or toward the aim/fire direction) over pure random jitter — it reads as force, not malfunction.
- A quick zoom-in-and-out ("zoom punch") on a key hit adds emphasis when shake would be too much.
- Gate intensity by impact value; reserve the strongest shake for the rarest, most important moments.
- Register note: heavy shake belongs to an aggressive/action register — for minimal or serious games use small, slow camera kicks instead of buzzy shake. Readability: cap displacement so hazards and the player never leave readable positions during tight timing (see §6).

### 4.10 Knockback / Recoil
- On impact, push the struck object back along the hit direction and ease it back; give the attacker a smaller opposite recoil so both sides feel the force.
- For firing, add weapon recoil (a short backward kick that returns) and optionally a launch impulse as the projectile spawns.
- Keep knockback on render/intent and reconcile with authoritative collision state; never shove the player into a hazard purely for feel.
- **Enemies / movable obstacles**: knock back on hit to confirm force and open space; heavier ones should resist more (less knockback). A fixed obstacle (a wall, a rooted spike) can't be knocked anywhere — give it a hit-flash/particle response instead (§4.7/§4.4).
- Register note: snappy, large knockback reads playful/arcade; smaller, weightier knockback reads serious.

### 4.11 Distinct Feedback Vocabulary
- Danger feedback should emphasize sharp edges, warning flashes, sparks, cold or hot alert colors, and short hard impacts.
- Reward feedback should emphasize glints, radial sparkles, soft pops, and brighter score confirmation.
- State changes should use gate/scene pulses, localized shakes, lighting shifts, or transition motifs.
- Near-miss feedback should be satisfying but less bright or valuable-looking than actual reward collection.

## 5. Order of Application

If you can only do a few of these, apply them in this rough order of impact-per-effort:

1. **Squash & Stretch on jump/land** — biggest impact for the smallest code change.
2. **Hit stop on strong impacts** — a few frozen frames make hits feel like they connect.
3. **Particles on impact moments** — landing, hitting, destroying.
4. **Eyes on the player** — instantly adds personality *(only in a character/playful register; see §3)*.
5. **Screen shake / camera kick on big impacts** — gate intensity by importance and register.
6. **Tilt on velocity** — sells weight and momentum.
7. **Eyes / particles / squash on enemies** — promote the rest of the world.
8. **Afterimage trails** — final polish for high-speed elements.

## 6. Pitfalls to Avoid

- **Don't add motion that obscures gameplay.** Squash should never make a hitbox visually misleading.
- **Don't apply effects uniformly to everything.** A scene where every object is bouncing/tilting/trailing reads as noise. Reserve the strongest effects for the most important moments.
- **Don't tilt or squash without a return-to-rest.** A permanently-tilted sprite reads as broken, not alive.
- **Don't trail slow objects.** Trails imply speed; if it's slow, a trail just looks like a smear.
- **Don't let polish hide hazard silhouettes.** Particles, reward pulses, screen shake, and trails should not cross over or blur the primary danger read during tight timing windows.
- **Don't tune feel without a readability check.** Use a temporary debug/readability mode or screenshots to compare collision shapes, visual bounds, active particles, and hazard edges.
- **Don't impose a cartoon register on an abstract or serious game.** Eyes and bouncy squash can clash with the intended tone; match the register from §3 before reaching for them.

## 7. Library / Engine Notes

The principles above are universal. Specific drawing primitives differ per engine — adapt as follows:

### When using crisp-game-lib
- **Drawing is collision**: drawn shapes are the collision geometry, so the §4 baseline of render-only deformation does not apply — squashing, stretching, or tilting a gameplay shape changes its hitbox. Prefer feedback that leaves gameplay shapes untouched: `color()` changes and hit flashes, `particle()`, `play()` sounds, and camera-style effects. If you do deform a drawn gameplay shape, keep the deformation small enough that the hitbox stays honest.
- **Rotation**: there is no `push/pop/translate/rotate`. Use `bar(x, y, length, thickness, rotate)` or `line()` to express rotated shapes. Rotation 0 = right, clockwise positive. For a vertical (upward-pointing) object, use `-PI/2` as the base rotation and add tilt offsets to that.
- **Particles**: the color of `particle()` is determined by the preceding `color()` call. You cannot specify color via parameters — call `color(...)` first, then `particle(pos, { count, speed, angle, angleWidth })`.

### When using a general 2D engine (Canvas / Pixi / Phaser / Unity / Godot)
- All techniques map directly to standard `scale`, `rotation`, particle systems, and trail renderers. Implement squash via non-uniform scale, tilt via rotation around the object's center of mass, and afterimage via either ghost sprites or motion-blur shaders.

### When using Godot
- Keep `CollisionShape2D` authoritative and apply squash, tilt, flashes, and trails to a child visual node such as `VisualRoot`.
- Use lightweight local scripts such as `player_feel`, `hazard_feel`, or `reward_feel` for mini-games.
- For Web export, cap active particles/trails and prefer short-lived pooled sprites or light `CPUParticles2D` when full GPU particles are too expensive.

## Companion skills

- `directing-game-visuals` defines palette roles and the protagonist / danger / reward read; respect those when picking polish colors and intensities.
- `evaluating-gameplay-balance` reports may flag readability or hazard-silhouette regressions caused by polish; rerun it after substantive feel changes.
- For Godot projects, `scaffolding-godot-mini-games` and `running-headless-godot` may define project structure, test flow, and Web-export constraints; follow them when present, but do not assume them for non-Godot games.
