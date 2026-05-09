# One-Button Mini-Game Design Guide

Long-form companion to `designing-one-button-games`. This file is self-contained so the skill can be copied or installed without depending on sibling skills.

Background: see `archive/zero-touch-redesign-validation/analysis.md` for the zero-touch vs revised comparison that produced the stricter state, scoring, and monotonous-input rules.

For implementation-facing translation of these design rules, use `implementing-gameplay-invariants`. This guide names what must be true in the design; that skill turns the claim into engine-neutral invariants and validation checks.

## 1. Design Challenges Specific to One Button

- Producing diverse gameplay from a single binary input.
- Designing a difficulty curve and risk/reward system that does not collapse into mashing.
- Conveying tap / hold / release semantics through play, without text.
- Preventing monotonous-input dominance (button mashing, hold-only, idle play).

## 2. Four Core Design Principles

Each principle pairs a design rule with an evaluation question.

### (1) Simplicity and Intuitiveness
- **Principle**: Use basic shapes (circles, triangles, squares), keep the background simple, eliminate UI / explanations / multiple resource management. The rules should be conveyed through play itself.
- **Check**: Can the rules and the role of every on-screen object be understood immediately, without text?

### (2) Visual Feedback and Game Over
- **Principle**: Convey success, failure, and danger through animation, color change, and size change. The game-over condition must be **single** and obvious at a glance — typically "collision" or "falling".
- **Check**: Are action results visually clear? Is the failure reason fair and obvious?

### (3) Skill-Based Scoring and Risk/Reward
- **Principle**: Reward intentional, high-risk actions (close calls, precise timing) more than safe ones. Score should track mastery directly.
- **Check**: Does score actually reflect player skill? Is there a meaningful "safe vs. challenging" choice at every moment?
- **Scoring rule**: Prefer in-world causal events: stomp, graze, batch erase, precise catch, cluster clear, route selection, chain reaction, or pressure cash-out. Survival score is acceptable only when survival itself is the central skill expression; in that case, state the observable survival pattern that skilled play performs and monotonous policies cannot.

### (4) Novel Mechanics
- **Principle**: Don't be bound by existing genres. Invent surprising behavior from physical laws (gravity, magnetism, inertia), geometric principles, or their negation.
- **Check**:
  - Is there a moment where the player thinks "I've never seen this before"?
  - Is there an element that cannot be fully explained by combining existing references?
  - Does diverse gameplay emerge from a single mechanic?

## 3. Input Patterns (one-button)

| Input       | Mechanic               | Application Examples                                              |
| :---------- | :--------------------- | :---------------------------------------------------------------- |
| **Press**   | Instant change         | Direction change (90°/180°), jump, shoot, teleport, split, toggle |
| **Hold**    | Accumulation/extension | Power/angle adjustment, stretch, shield deploy, charge            |
| **Release** | Release/recoil         | Projectile firing, charged-attack execution, state-release effect |

## 4. Movement and Environment Mechanics (Reference)

### 4.1 Player Movement / Actions
- **Auto-movement**: auto-run, constant bouncing, fixed oscillation, acceleration
- **Special movement**: gravity reversal, wall reflection, fixed-point rotation, teleport
- **Actions**: AoE attack, counter, physics projectiles, chain reactions, state toggle

### 4.2 Environment / Terrain Interaction
- **Terrain**: irregular ground, floating/moving platforms, chasms, temporary footholds
- **Gimmicks**: zones with changing behavior, hazards (spikes, crushers), physics puzzles

## 5. Starting Points When Stuck

### 5.1 Abstract Questions

| Perspective           | Example Questions                                                                       |
| :-------------------- | :-------------------------------------------------------------------------------------- |
| **Negation**          | What if there's no screen? No score? No failure?                                        |
| **Sensation**         | What moment raises heart rate? What is relief? What is "close call"?                    |
| **Beyond physics**    | What if probability could be manipulated? What if causality is reversed? Time branches? |
| **Cross-discipline**  | Musical tension/resolution, ecosystem predation, chemical chain reactions               |
| **Reverse from emotion** | How to create the feeling of "betrayal"? What is the joy of "discovery"?             |

### 5.2 Ideas From Constraints

Set "without ~" constraints and work backwards:
- No movement (gameplay arises only from on-screen state changes)
- No enemies (battle the environment or the self)
- No scoring (the goal is state maintenance or transformation)
- No visuals (works with sound or rhythm only)

## 6. State, Tradeoff, and History Checks

Use state variables sparingly. Add a state only when it creates a player decision that the existing rules cannot express.

- Every state variable needs an in-world manifestation: behavior, terrain, shape, speed, sound, color, or animation. A HUD number alone is not enough.
- Every state variable needs a decision purpose: it should make the player choose between at least two viable actions or risk levels.
- Define at least one concrete tradeoff, such as safe timing vs. high-score timing, short hold vs. long hold, or preserving terrain vs. spending terrain for score.
- Prefer persistent world-side consequences from player actions: scars, altered paths, moved hazards, spent platforms, chain reactions, or changed rhythms.
- Avoid state that only adds bookkeeping. If removing a variable leaves the same decisions intact, remove it.

### 6.1 Monotonous-Input Rejection

Before implementation, write why each policy is worse than skilled play:

- **Idle weakness**: what eventually happens if the player never presses?
- **Hold-only weakness**: what cost or missed opportunity prevents permanent holding from dominating?
- **Mashing weakness**: what makes repeated tapping/releasing worse than timed action?
- **Skilled play**: what observable pattern does the player learn that produces better score or survival?

Common structural answers:

- Safety has a cost: fuel drain, lost scoring, shrinking space, closing walls, exposed hitbox, cooldown, or recovery time.
- Power has exposure: larger body, faster movement, vulnerable weapon, rising pressure, or delayed cash-out.
- Missed hazards leave consequences: rising stack, crumbling platform, lost multiplier, missed fuel, altered terrain, or compressed route.
- Random tapping loses precision: overshoots route, resets combo, enters a vulnerable transition, wastes a cooldown, or breaks aim alignment.

If an input phase is intentionally unused, say so explicitly and explain why the remaining phases still create skill. Do not invent a meaningless hold or release just to fill the table.

If a monotonous policy can survive indefinitely, do not rely on death as its weakness. State the score cap, score starvation rule, missed-opportunity math, resource drain, or multiplier decay that makes it worse than skilled play.

### 6.1.1 Implementation-Invariant Sketch

For every weakness claim that balance depends on, add a testable implementation invariant. This is not engine code. It is the rule the later implementation must preserve.

Do not over-specify constants in the design pass unless the threshold is central to the idea. Prefer qualitative but enforceable wording such as "inputs during the recovery window cannot score" or "a bloom younger than the minimum age cannot create a pad"; the implementation/invariant pass can then bind the rule to frame counts after seeing the engine tick rate and first hazards.

Use this format:

```markdown
- Idle invariant: <what code-level condition prevents idle from scoring or surviving competitively>
- Hold-only invariant: <what condition caps, drains, exposes, or blocks permanent holding>
- Mashing invariant: <what condition makes rapid repeated input worse than timed input>
- Skilled-play invariant: <what condition lets intentional timing outperform the bad policies>
- Seed/precheck invariant (if randomness shapes early hazards): <what the first validation-seed outcomes must satisfy>
```

Example:

- `Mashing invariant: landing pulses have a 20-frame cooldown and can score each bullet only once.`

For the full catalog of mashing, hold-only, idle, pulse/reflection, combo, and difficulty-bound patterns, use `implementing-gameplay-invariants/references/invariant-patterns.md`.

When the project checker uses a deterministic seed, preview the first 5-10 random hazard/gap/spawn outcomes if they determine early survivability. Confirm those outcomes are compatible with the intended skilled route and do not accidentally make a monotonous route optimal.

If there is no implementation or seeded generator yet, do not invent fake seed outcomes. Add a `Seeded early cases` invariant that says what the first generated cases must satisfy, and require the implementation pass to perform the actual preview before full validation.

Weak examples:

- `Mashing is bad because timing matters.` This is a design hope, not an invariant.
- `Holding is risky.` Say what makes it risky: exposure, drain, score lockout, larger hitbox, or world pressure.
- `Skilled players get more score.` Say which event gives that score.

### 6.2 Difficulty Intent

State what scales with difficulty and why. Good defaults:

- Use `sqrt(difficulty)` for smooth increases in movement speed, spawn rate, orbit speed, gravity pressure, or enemy drift.
- Use steeper `difficulty` scaling only when the game intentionally needs escalating pressure.
- Cap or bound rates where readability would collapse.
- Do not tune numbers only to defeat a test policy; the scaling should preserve readable play.

## 7. Tag / Prompt Contradiction = Creative Tension

When contradicting seeds are given, treat the contradiction as an invention prompt rather than an obstacle.

| Contradiction Example                              | Conventional Approach    | Creative Interpretation                                         |
| :------------------------------------------------- | :----------------------- | :-------------------------------------------------------------- |
| `field:1D` and `field:3D`                          | Adopt only one           | Space that looks 1D but has hidden depth, or 1D-like motion in 3D space |
| `on_pressed:jump` and `on_pressed:shoot`           | Pick one by priority     | Jump and shoot are the same action — the jump arc deals damage |
| `player:auto_move` and `on_holding:stop`           | Resolve dependencies     | Stopping itself is the risk                                     |

**Principle**: Don't *resolve* the contradiction — invent a new concept under which the contradiction becomes possible.

## 8. Recommended Output Format

Produce a design document in this structure (file location is project-dependent — e.g. `tmp/games/<slug>/README.md`):

```markdown
# <GAME_NAME> (<slug>)

**Seeds**: #seed1, #seed2, #seed3

Omit the entire `**Seeds**` line if no seeds were given.

## 1. Core Mechanics

### Controls

| Phase | Action | Notes |
| :--- | :--- | :--- |
| Press | <what happens on press/tap> | <context, cooldown, or intentionally unused: reason> |
| Hold | <what happens while held> | <cost, risk, or intentionally unused: reason> |
| Release | <what happens on release> | <cash-out, recoil, reset, or intentionally unused: reason> |

- Behavior: <main loop in 2-4 sentences>
- Game-over: <single visually obvious condition; explain why it is fair to read>
- Scoring: <causal scoring event and any combo/multiplier/cash-out rule>

### Difficulty Scaling

| Quantity | Scaling | Reason |
| :--- | :--- | :--- |
| <spawn interval> | </ sqrt(difficulty), capped range, etc.> | <why this pressure changes> |
| <hazard speed> | <* sqrt(difficulty), linear, etc.> | <why this remains readable or intentionally escalates> |

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback | Decision Purpose |
| :--- | :--- | :--- | :--- |
| <var_a> | <what changes it> | <where/how it is shown without text-only UI> | <what choice this creates> |

- Concrete behavior pair: `<safe_action>` vs `<risky_action>`  
  Use the table's `Decision Purpose` cell for the abstract choice the state creates. Use this behavior pair for the concrete actions the player will actually perform. Example: `charge` decision purpose = "choose blast radius vs. hitbox risk"; behavior pair = "release now for small safe blast vs. hold longer for larger dangerous blast".
- Tradeoff explanation: how improving one state or outcome worsens another
- Idle weakness: <why doing nothing loses or scores poorly>
- Hold-only weakness: <why permanent holding loses or scores poorly>
- Mashing weakness: <why repeated tapping/releasing loses or scores poorly>
- Skilled play: <what timed/intentional pattern beats the monotonous policies>
- Persistent consequence or safety cost (if needed): <e.g., rising stack, crumbling platform, shrinking orbit, fuel drain, exposed hitbox>

### Implementation Invariants

The bullets above describe what the player experiences. The table below specifies what the code must enforce. Each row should be testable by a policy or telemetry; do not restate the bullet in different words.

| Promise | Invariant | Validation |
| :--- | :--- | :--- |
| Idle weakness | <testable rule that makes idle weak> | <NoInput expected result> |
| Hold-only weakness | <testable rule that makes permanent hold weak> | <HoldOnly expected result> |
| Mashing weakness | <testable rule that makes repeated input weak> | <SpamPress / alternating spam expected result> |
| Skilled play | <testable rule that creates a higher-skill route> | <what skilled/GA/human policy should beat> |
| Seeded early cases (if relevant) | <first validation-seed hazards/gaps remain compatible with the invariants> | <first 5-10 seeded cases checked by simulation or calculation> |

Example row: `Idle weakness | World pressure rises 1 px per 30 frames while no scoring window is taken | NoInput final score < 10% of skilled/GA best`

## 2. Object Specifications
<Each object's shape, behavior, collision handling>

## 3. Design Principle Analysis

### (1) Simplicity and Intuitiveness
<Can the rules and object roles be understood immediately?>

### (2) Visual Feedback and Game Over
<How are success, danger, and the single failure condition shown?>

### (3) Skill-Based Scoring and Risk/Reward
<Why does score measure skill, and what safe/risky choice exists?>

### (4) Novel Mechanics
<What rule-level idea goes beyond a familiar clone?>

## 4. Relationship with Seeds
<How the idea developed from the input seeds>

## 5. Basis for Novelty
<Elements that go beyond existing patterns>

## 6. Similarity Check
<List any known games with similar mechanics; explain rule-level differences, not just theme or visual differences.>
```

## 9. Design Quality Checklist

- [ ] Does it complete with one button: press, hold, release, or a combination of those phases?
- [ ] Is the game-over condition single and visually obvious?
- [ ] Are mashing, hold-only, and idle play each explicitly documented as worse than skilled play?
- [ ] Does each key weakness include a testable implementation invariant, not just prose?
- [ ] Does score come from in-world causality rather than raw input facts? If survival score is used, is survival itself the central skill expression?
- [ ] Can rules and object roles be understood without text?
- [ ] Does every state variable create a distinct player decision?
- [ ] Does every state variable have a non-text in-world feedback channel?
- [ ] Is there at least one explicit safe/risky tradeoff?
- [ ] Does at least one persistent consequence or safety cost exist where the game needs one?
- [ ] Does the design state what scales with difficulty and why?
- [ ] Is there a "I've never seen this before" moment that is not just a reskin of a known game?

## 10. Appendix: SCAMPER Method (Auxiliary Only)

Idea assistance through transformation of existing elements. **Auxiliary, not primary** — SCAMPER tends to produce variations of the familiar; pair it with §5 to push toward genuinely new concepts.

- **Substitute**: Replace jump with teleport or gravity reversal.
- **Combine**: Combine bounce mechanics with direction change.
- **Adapt**: Adapt arcade games or physical phenomena (pendulum, waves) to one button.
- **Modify**: Character grows giant with hold duration; danger scales with speed.
- **Put to other uses**: Use enemies as platforms or tools.
- **Eliminate**: Remove "obvious" elements like gravity or direct movement.
- **Rearrange**: Continually re-compose the stage layout.
