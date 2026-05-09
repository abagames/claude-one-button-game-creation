# GHOST HOP (ghost_hop)

**Seeds**: #on_pressed-jump_into_another, #on_holding-stop, #weapon-interference

## 1. Core Mechanics

### Controls

| Phase | Action | Notes |
| :--- | :--- | :--- |
| Press | Begin a hop from the current platform to the next platform in a fixed ring order. | A hop has a short travel time and cannot be canceled. Pressing again during the hop is ignored, so timing matters more than input rate. |
| Hold | Freeze on the current platform inside a ghost shield. | The shield blocks ordinary bullets but drains a visible shield band and stops survival scoring while active. Bullets continue to build pressure around the player. |
| Release | Drop the shield and become able to hop again. | Releasing does not give a separate attack. Its value is choosing the moment when the platform route and incoming bullets make the next hop worth taking. |

- Behavior: The player rides one of five drifting ghost platforms arranged in a loop. Enemy bullets aim at the player's current platform position, while each press commits the player to the next platform in the loop. Landing creates a brief interference pulse that reflects nearby bullets if they are close enough, turning danger into score.
- Game-over: The player is hit by a hostile bullet while not shielded. This is fair to read because bullets are the only lethal object, the shield visibly covers the player, and the player is visibly exposed during hops and after shield release.
- Scoring: Score comes from two causal events: surviving while exposed and reflecting bullets with a landing pulse. Reflection is the main skill score because it requires hopping into danger at the right time instead of hiding or tapping blindly.

### Difficulty Scaling

| Quantity | Scaling | Reason |
| :--- | :--- | :--- |
| Bullet spawn interval | Gradually shortens with `sqrt(difficulty)`, with a readable lower cap. | More bullets create denser timing problems without immediately flooding the screen. |
| Bullet speed | Increases with `sqrt(difficulty)`. | Faster shots make shield timing and hop commitment more important while preserving reaction time. |
| Platform drift speed | Increases slightly with `sqrt(difficulty)`. | Moving landing points change the reflection timing without making the route random. |
| Reflection window | Stays constant or narrows only slightly. | The player should improve through timing and route choice, not by chasing a shrinking hidden number. |

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback | Decision Purpose |
| :--- | :--- | :--- | :--- |
| Current platform index | Advances by one when a press starts a hop; updates when the hop lands. | The active platform is highlighted, and the next platform is visually readable as the next stop in the ring. | Choose whether the next fixed destination is worth the exposure of hopping now. |
| Hop commitment | Starts on press and ends on landing. | The player leaves the platform, changes to a travel state, and cannot shield until landing. | Prevent mashing from becoming movement control; each hop must be planned against bullet timing. |
| Shield charge | Drains while held and recovers only while exposed on a platform. | The shield shell shrinks or fades around the player as charge falls, then reforms while exposed. | Choose temporary safety versus future safety and score opportunity. |
| Bullet pressure | Builds as hostile bullets approach the current or next platform; drops when bullets are reflected or leave play. | Incoming bullets visibly converge on platform positions. Reflected bullets reverse color/direction. | Decide whether to wait, shield, or hop through danger to convert nearby bullets into points. |

- Concrete behavior pair: `hold on the current platform to survive a bad lane` vs `release and hop when bullets are close enough to be reflected on landing`.
- Tradeoff explanation: Shielding protects the player from immediate impact but drains future protection and pauses survival score. Hopping creates the only high-value reflection opportunities, but the player is committed, exposed, and can land in a worse bullet pattern if the timing is wrong.
- Idle weakness: If the player never presses, bullets keep aiming at the same platform until an exposed hit occurs. Idle play may survive briefly, but it earns only low exposed-survival score and never creates landing reflections.
- Hold-only weakness: Holding blocks bullets only while charge remains, stops survival scoring, and lets pressure accumulate around the current platform. When the shield expires or is released, the player is surrounded without having converted bullets into reflected-score opportunities.
- Mashing weakness: Repeated pressing commits the player to hops without regard to bullet spacing. Because hops cannot be canceled or redirected, mashing often exposes the player mid-hop, misses reflection timing, and lands on platforms after the useful bullet cluster has already passed.
- Skilled play: The player watches where bullets are converging, briefly shields only to cover unavoidable impacts, releases before charge is exhausted, and presses so the landing pulse catches a close bullet cluster. Skilled play alternates safe pauses with deliberate exposed hops.
- Persistent consequence or safety cost: Shield charge is spent by safety and returns only while the player is exposed, so overusing safety creates a later period where the player must hop without protection.

## 2. Object Specifications

- Player: A small ghost marker attached to the current platform, traveling between platforms during a hop, and covered by a visible shell while shielding. Collides lethally with hostile bullets only when not shielded.
- Platforms: Five floating landing points in a fixed cyclic order. They drift slowly but remain readable as a route; the current platform and next platform must be visually distinct through size, outline, or motion.
- Hostile bullets: Projectiles spawned from screen edges toward the player's current or recent platform position. They are lethal on exposed contact and harmless against an active shield.
- Landing pulse: A short-lived ring emitted when the player lands from a hop. Hostile bullets inside the pulse become reflected bullets instead of killing the player.
- Reflected bullets: Converted projectiles that travel away from the player and award score when created. They should no longer threaten the player.
- Shield charge feedback: A world-side effect attached to the shield, not only a HUD number. Its size, opacity, or completeness shows how much protection remains.

## 3. Design Principle Analysis

### (1) Simplicity and Intuitiveness

The player has one route, one danger type, and one defensive state. Pressing moves to the next platform, holding creates a shield, and landing near bullets turns them around. Object roles should be readable from motion: platforms carry, red bullets threaten, the shield protects, and the landing pulse converts danger.

### (2) Visual Feedback and Game Over

Success is shown by bullets reversing on a landing pulse. Danger is shown by bullets converging on the current or next platform and by the shield visibly draining. Game over is a single exposed bullet hit, so the failure reason is clear: the player was not shielded and was touched by the only lethal object.

### (3) Skill-Based Scoring and Risk/Reward

The best score comes from timed landing reflections, not from raw tapping or passive survival. The safe choice is to hold shield and preserve position through a bad moment; the risky choice is to release and hop while bullets are close enough for a landing pulse. That risk is visible and causal because the same bullets that can kill the player are also the objects that can be reflected for points.

### (4) Novel Mechanics

The central rule is not normal dodging: the player uses fixed route commitment to interfere with enemy fire. A bullet pattern aimed at the player's last safe position becomes a scoring resource only if the player times a platform hop so the landing, not the button press itself, performs the counter.

## 4. Relationship with Seeds

- `on_pressed-jump_into_another`: Pressing commits the ghost to the next platform in the ring.
- `on_holding-stop`: Holding stops the player's movement in a shielded state, trading safety for lost score and spent charge.
- `weapon-interference`: Landing pulses interfere with incoming bullets by reflecting nearby shots.

## 5. Basis for Novelty

GHOST HOP combines route commitment, timed defensive freezing, and landing-based projectile conversion. The player is not freely steering away from bullets; they are choosing when to let bullets approach, when to become temporarily untouchable, and when to convert a dangerous cluster by arriving at a platform at the right moment.

## 6. Similarity Check

The design has surface similarities to fixed-lane dodging games and shield-timing arcade games, but its rule structure differs because movement is a cyclic hop between drifting platforms and scoring is tied to landing interference. It is not a pure survival dodger, a free-movement bullet hell, or a rhythm shield game: the main mastery pattern is deciding when a fixed next destination can turn aimed bullets into reflected score.
