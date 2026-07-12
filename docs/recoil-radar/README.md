# RECOIL RADAR (recoil-radar-b9g02)

**Tags**: #weapon-auto_aiming, #player-limited_vision, #rule-physics

## 1. Core Mechanics

Hold the single button to charge and expand a circular scan around the drifting player. The ring turns from gray to cyan when armed; releasing before then produces no shot or score. Release an armed scan to make the weapon automatically destroy the nearest rock inside it; the blast kicks the player directly away from the chosen target, turning target timing into indirect steering. A rock touching the player is the single game-over condition. Destroying a rock scores more when it is closer, so waiting is valuable but dangerous. Rock arrival frequency and drift speed rise smoothly with `sqrt(difficulty)` and are capped for readability.

## 2. Object Specifications

- **Player**: A cyan square with a blue velocity needle. It coasts with drag and bounces from the arena edges. It collides lethally with rocks.
- **Scan**: An expanding circle visible only while the button is held. It is gray while charging, then turns light cyan after 10 frames; only then do rocks inside it turn red and become eligible for auto-targeting.
- **Rocks**: Square silhouettes entering from all four edges and moving with physical velocity. Outside the scan they are dim; inside it they become red. Contact with the player ends the game.
- **Shot**: A brief yellow line from player to selected rock. It destroys that rock immediately, emits debris, awards proximity score, and applies opposite recoil to the player.

## 3. Design Guide Analysis

- **Simplicity and Intuitiveness**: One hold reveals the arena; one release produces a line, destruction, and recoil. Basic shapes and color changes expose each role without an extra control or HUD resource.
- **Visual Feedback and Game Over**: The scan circle, red revealed rocks, yellow shot, debris, and velocity needle show cause and effect. The only failure is direct rock contact.
- **Skill-Based Scoring and Risk/Reward**: Firing early is safer but yields fewer points and often weak steering. Letting a rock approach produces a larger score and stronger kick while increasing collision risk; choosing the moment when a useful rock is nearest determines the escape direction.
- **Novel Mechanics**: Auto-aim removes directional choice at the instant of firing, yet physics restores agency through timing: the target the weapon chooses becomes the surface the player pushes away from.

## 4. Relationship with Tags

The first obvious association was a conventional dark-arena shooter whose gun automatically tracks enemies. That was rejected because auto-aim would merely simplify a familiar shooting loop. The chosen design makes `weapon-auto_aiming` select a recoil direction, turns `player-limited_vision` into a hold-grown local scan, and uses `rule-physics` to make every successful attack also relocate the player. The tension is that seeing more targets helps awareness while allowing rocks to advance during the scan.

## 5. Basis for Novelty

The unusual moment is releasing without choosing a direction, watching the nearest revealed threat vanish, and realizing that its location has launched the player along a new route. Attacking and locomotion are the same physical event, while the expanding view changes which threats are legible without becoming a pointer-controlled aiming device.

## 6. Similarity Check

Asteroids-like games share drifting bodies and rock hazards, and radar games share local revelation. RECOIL RADAR differs by offering no direct movement or directional aiming: the only controllable quantity is when to stop scanning, after which nearest-target selection and opposite recoil jointly decide motion. It is not a conventional twin-stick, auto-shooter, or tap-to-dodge variation.

## Tuning notes

- Register: restrained abstract tension, expressed through geometric light, motion, and sound rather than character animation.
- Preserved the praised close-range release/recoil loop, edge danger, collision geometry, recoil strength, and hazard difficulty; a 10-frame gray-to-cyan charge gate now makes readiness visible and prevents rapid taps from firing or scoring.
- Narrowed the recoil reflection range from x=5–95 / y=9–95 to x=8–92 / y=9–92. This keeps the ship's visible edge about 5–6 px inside the arena, giving newly entering rocks a slightly more readable approach without changing their spawn rate, speed, or targeting.
- Strengthened the action-feedback chain without changing hitboxes: scan readiness gets one 6-particle pulse and cue, a successful shot adds 4 directional recoil particles at the ship, and a wall reflection gets a 2-frame inset flash plus 5 sparks and one impact sound (including corner hits).
- Effect budget remains event-gated: one 5-frame shot line, 16 particles per successful release, 6 once per completed charge, and 5 per wall impact. No shake, hit stop, trails, squash, or full-body collision-color change can obscure rocks or alter contact geometry.
