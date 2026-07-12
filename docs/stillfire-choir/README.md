# STILLFIRE CHOIR (stillfire-choir)

**Tags**: #weapon-ray, #on_got_item-spawn, #on_holding-stop

## 1. Core Mechanics

The blue choir members glide sideways and rebound from the screen edges. Hold the single button to fix the entire formation in place; release it to let every member move again. A light-cyan core fills upward inside every choir member toward the next synchronized pulse, then every member emits an instant vertical ray. Falling red hazards caught by a ray score points, while touching any choir member ends the game. Yellow sparks are collected by contact and immediately become new moving choir members.

Each duplicate adds another firing lane and increases the value of every ray hit, but it also adds another vulnerable body. Skilled play alternates between moving to spread or dodge and holding briefly to preserve a useful firing pattern for the next pulse. Hazard fall speed and spawn frequency rise with `sqrt(difficulty)`, while the volley interval shortens gradually but remains readable.

## 2. Object Specifications

- **Player**: A blue diamond-like lead block near the bottom. It drifts horizontally unless the button is held and rebounds at the side walls.
- **Allies**: Smaller blue duplicates created at the exact position where a yellow spark is collected. Each receives its own horizontal direction and speed, freezes with the player, fires in the same volley, and is also vulnerable to hazards.
- **Rays**: One-frame cyan vertical lines extending upward from each choir member. A thin rectangular collision carrier makes every ray measurable; hazards hit by it are removed and scored.
- **Hazards**: Red falling blocks. Contact with any blue member is the single game-over condition. A ray hit removes the hazard before body contact is resolved, allowing deliberate last-moment saves.
- **Sparks**: Yellow falling squares. Contact creates a duplicate, awards a small score, and gives immediate particles and sound feedback.
- **Volley charge**: A light-cyan core fills inside each blue body toward the next synchronized volley. It is presentation-only; the blue collision body keeps its original size.

## 3. Design Guide Analysis

### Simplicity and Intuitiveness

All active objects are basic colored shapes: blue bodies, red danger, yellow collectibles, and cyan weapons. The only control directly changes the visible motion state of the whole formation.

### Visual Feedback and Game Over

The filling cores forecast each volley at the emitters the player is already watching, then flicker briefly before cyan rays flash and fade into a thin afterglow. A short ring confirms the instant the formation is fixed, wall rebounds shed restrained directional sparks, and collected sparks resolve into new allies through a yellow settling ring. Holding remains readable through the formation actually stopping rather than by enlarging the lead body. Game over has one cause: a red block touching any blue body.

### Skill-Based Scoring and Risk/Reward

Score comes from causal ray hits and spark collection, not from time or input count. Moving permits dodging and formation spread, while holding preserves alignment but leaves every body stationary. More allies cover more lanes and raise ray-hit value, yet increase the formation's collision exposure.

### Novel Mechanics

The player does not directly aim or trigger the weapon. Instead, the button edits a moving multi-body firing diagram just before a shared automatic instant, turning “stop” into formation aiming.

## Tuning notes

- Abstract/geometric register; feedback uses light, rings, directional sparks, and existing sounds, with no faces, cartoon deformation, screen shake, or collision-shape changes.
- Mechanics were left unchanged because the human explicitly judged the existing power-versus-extra-body-risk balance playable; Stage-1 exploit flags remain detector notes, not grounds to erase that balance.
- Effect budget: three frames of non-colliding ray afterglow, five frames of lock rings, eight frames of one spawn ring, 2–3 particles only on rare wall rebounds, and at most the existing 9 impact particles per destroyed hazard.

## 4. Relationship with Tags

The first association was a conventional ship that stops and manually shoots a laser. That was rejected because stopping would merely be a standard aiming mode. The chosen design makes the ray an external synchronized event: holding fixes a whole chorus of independently moving emitters. `weapon-ray` becomes the instant vertical volley, `on_got_item-spawn` makes every collected spark join as another duplicate, and `on_holding-stop` fixes all emitters so their future firing lanes can be composed.

## 5. Basis for Novelty

The unusual moment is watching a disorderly flock become a frozen ray stencil just before the pulse arrives. Collecting is not a simple power-up: each pickup permanently changes the geometry, scoring potential, and danger surface of the same one-button decision.

## 6. Similarity Check

Fixed shooters such as *Space Invaders* use multiple player-triggered shots from one controlled body, while formation games such as *Snake* make added bodies primarily into a trail. STILLFIRE CHOIR differs by giving every independently drifting duplicate a synchronized straight-line weapon and by making temporary fixation, rather than steering or firing, the sole control. The automatic pulse timing and vulnerable multi-emitter geometry are the central rules, not a thematic variation on either reference.
