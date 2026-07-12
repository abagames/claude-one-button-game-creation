# Mini-Game Design Guide

Long-form companion to `designing-mini-games`. This file is self-contained so the skill can be copied or installed without depending on sibling skills. It covers every input scheme; subsections that apply only to one-button games are marked as such.

For implementation-facing translation of these design rules, use `implementing-gameplay-invariants`. This guide names what must be true in the design; that skill turns the claim into engine-neutral invariants and validation checks.

## 1. Design Challenges

- Producing diverse gameplay from minimal input — hardest with a single binary input, where tap / hold / release must carry everything.
- Designing a difficulty curve and risk/reward system that does not collapse into mashing.
- Conveying input semantics through play, without text.
- Preventing monotonous-input dominance (button mashing, hold-only, single-button spam, idle play).

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

## 3. Interaction Patterns (Reference)

Examples of mechanics based on input. These are starting points for ideas, not constraints. If a button-count limit is provided by the project brief, design within it.

### 3.1 One-Button State Patterns

| Input       | Mechanic               | Application Examples                                              |
| :---------- | :--------------------- | :---------------------------------------------------------------- |
| **Press**   | Instant change         | Direction change (90°/180°), jump, shoot, teleport, split, toggle |
| **Hold**    | Accumulation/extension | Power/angle adjustment, stretch, shield deploy, charge            |
| **Release** | Release/recoil         | Projectile firing, charged-attack execution, state-release effect |

### 3.2 Multi-Button Patterns (button_types ≥ 2)

| Pattern                | Mechanic                                                    | Application Examples                                   |
| :--------------------- | :---------------------------------------------------------- | :------------------------------------------------------ |
| **Role separation**    | Each button controls a distinct axis                        | Move / Attack, Left / Right, Jump / Shoot               |
| **Exclusive toggle**   | Only one button's effect is active                          | Stance switching (offense ↔ defense), element cycling   |
| **Simultaneous combo** | Pressing multiple buttons at once triggers a special action | Charged dash (move + attack), emergency brake           |
| **Sequential chain**   | Button order matters                                        | Input combos for special moves, rhythm sequences        |

## 4. Movement and Environment Mechanics (Reference)

Examples of movement pattern and terrain combinations. Ideas beyond these are welcome.

### 4.1 Player Movement / Actions

- **Auto-movement**: auto-run, constant bouncing, fixed oscillation, acceleration
- **Special movement**: gravity reversal, wall reflection, fixed-point rotation, teleport
- **Actions**: AoE attack, counter, physics projectiles, chain reactions, state toggle

### 4.2 Environment / Terrain Interaction

- **Terrain**: irregular ground, floating/moving platforms, chasms, temporary footholds
- **Gimmicks**: zones with changing behavior, hazards (spikes, crushers), physics puzzles

## 5. Role of Tags

Tags are not design specifications but inspiration starting points (seeds).

- **Stimulus, not constraint**: expand associations from tags; feel free to depart from them.
- **Contradiction is opportunity**: use contradicting tags as creative tension (see §7).
- **Deviation allowed**: no problem if the final design cannot be explained by the tags.
- **Purpose**: functions as randomness to "shift" LLM ideas away from existing patterns.

## 6. Starting Points When Stuck

Idea starting points independent of tags. Use when stuck or when pursuing novelty from the start.

### 6.1 Abstract Questions

| Perspective              | Example Questions                                                                       |
| :----------------------- | :-------------------------------------------------------------------------------------- |
| **Negation**             | What if there's no screen? No score? No failure?                                        |
| **Sensation**            | What moment raises heart rate? What is relief? What is "close call"?                    |
| **Beyond physics**       | What if probability could be manipulated? What if causality is reversed? Time branches? |
| **Cross-discipline**     | Musical tension/resolution, ecosystem predation, chemical chain reactions               |
| **Reverse from emotion** | How to create the feeling of "betrayal"? What is the joy of "discovery"?                |

### 6.2 Ideas From Constraints

Set "without ~" constraints and work backwards:

- No movement (gameplay arises only from on-screen state changes)
- No enemies (battle the environment or the self)
- No scoring (the goal is state maintenance or transformation)
- No visuals (works with sound or rhythm only)

## 7. Tag / Prompt Contradiction = Creative Tension

When contradicting seeds are given, treat the contradiction as an invention prompt rather than an obstacle.

| Contradiction Example                    | Conventional Approach | Creative Interpretation                                                 |
| :--------------------------------------- | :-------------------- | :---------------------------------------------------------------------- |
| `field:1D` and `field:3D`                | Adopt only one        | Space that looks 1D but has hidden depth, or 1D-like motion in 3D space |
| `on_pressed:jump` and `on_pressed:shoot` | Pick one by priority  | Jump and shoot are the same action — the jump arc deals damage          |
| `player:auto_move` and `on_holding:stop` | Resolve dependencies  | Stopping itself is the risk                                             |

**Principle**: Don't _resolve_ the contradiction — invent a new concept under which the contradiction becomes possible.

## 8. State, Tradeoff, and History Checks

Use state variables sparingly. Add a state only when it creates a player decision that the existing rules cannot express.

**Designs may use zero state variables.** In such cases, complexity must emerge from player-environment geometry, timing, or physical interaction, not from hidden state. If the design uses no state variables, write a brief justification in the State Model and Tradeoff section under a `State variables: none` header.

- Every state variable needs an in-world manifestation: behavior, terrain, shape, speed, sound, color, or animation. A HUD number alone is not enough.
- Every state variable needs a decision purpose: it should make the player choose between at least two viable actions or risk levels.
- Define at least one concrete tradeoff, such as safe timing vs. high-score timing, short hold vs. long hold, or preserving terrain vs. spending terrain for score.
- Prefer persistent world-side consequences from player actions: scars, altered paths, moved hazards, spent platforms, chain reactions, or changed rhythms.
- Avoid state that only adds bookkeeping. If removing a variable leaves the same decisions intact, remove it.

### 8.1 Monotonous-Input Rejection

The monotonous policy set depends on the input scheme:

- **Always**: idle (never pressing), mashing (rapid repeated pressing of anything).
- **One-button**: hold-only (permanent holding).
- **Multi-button**: single-button spam (using only one of the buttons), hold-everything (holding all buttons permanently).

Before implementation, write why each policy in the scheme's set is worse than skilled play:

- **Idle weakness**: what eventually happens if the player never presses?
- **Hold-only weakness** (or hold-everything for multi-button): what cost or missed opportunity prevents permanent holding from dominating?
- **Mashing weakness**: what makes repeated tapping/releasing worse than timed action?
- **Single-button-spam weakness** (multi-button only): why is ignoring the other buttons strictly worse?
- **Skilled play**: what observable pattern does the player learn that produces better score or survival?

Common structural answers:

- Safety has a cost: fuel drain, lost scoring, shrinking space, closing walls, exposed hitbox, cooldown, or recovery time.
- Power has exposure: larger body, faster movement, vulnerable weapon, rising pressure, or delayed cash-out.
- Missed hazards leave consequences: rising stack, crumbling platform, lost multiplier, missed fuel, altered terrain, or compressed route.
- Random tapping loses precision: overshoots route, resets combo, enters a vulnerable transition, wastes a cooldown, or breaks aim alignment.

If an input phase or button is intentionally unused, say so explicitly and explain why the remaining inputs still create skill. Do not invent a meaningless hold, release, or extra button just to fill the table.

If a monotonous policy can survive indefinitely, do not rely on death as its weakness. State the score cap, score starvation rule, missed-opportunity math, resource drain, or multiplier decay that makes it worse than skilled play.

### 8.1.1 Implementation-Invariant Sketch

For every weakness claim that balance depends on, add a testable implementation invariant. This is not engine code. It is the rule the later implementation must preserve.

Do not over-specify constants in the design pass unless the threshold is central to the idea. Prefer qualitative but enforceable wording such as "inputs during the recovery window cannot score" or "a bloom younger than the minimum age cannot create a pad"; the implementation/invariant pass can then bind the rule to frame counts after seeing the engine tick rate and first hazards.

Use this format, with one bullet per policy in the scheme's monotonous set:

```markdown
- Idle invariant: <what code-level condition prevents idle from scoring or surviving competitively>
- Hold-only invariant (one-button) / hold-everything invariant (multi-button): <what condition caps, drains, exposes, or blocks permanent holding>
- Mashing invariant: <what condition makes rapid repeated input worse than timed input>
- Single-button-spam invariant (multi-button): <what condition makes using only one button strictly worse>
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

### 8.2 Difficulty Intent

State what scales with difficulty and why. Good defaults:

- Use `sqrt(difficulty)` for smooth increases in movement speed, spawn rate, orbit speed, gravity pressure, or enemy drift.
- Use steeper `difficulty` scaling only when the game intentionally needs escalating pressure.
- Cap or bound rates where readability would collapse.
- Do not tune numbers only to defeat a test policy; the scaling should preserve readable play.

## 9. Design Quality Checklist

- [ ] Is the input scheme within the button-count limit chosen in the project brief? For one-button briefs: does it complete with press, hold, release, or a combination of those phases — no second input?
- [ ] Is the game-over condition single and visually obvious?
- [ ] Is each monotonous policy in the scheme's set (see §8.1) explicitly documented as worse than skilled play?
- [ ] Does each key weakness include a testable implementation invariant, not just prose?
- [ ] Does the design record the first association and an explicit reason for rejecting it (the Intentional Deviation content)?
- [ ] Does score come from in-world causality rather than raw input facts? If survival score is used, is survival itself the central skill expression?
- [ ] Can rules and object roles be understood without text?
- [ ] Does every state variable create a distinct player decision, or is the absence of state variables justified by a geometric/physical decision space?
- [ ] Does every state variable have a non-text in-world feedback channel?
- [ ] Is there at least one explicit safe/risky tradeoff?
- [ ] Does at least one persistent consequence or safety cost exist where the game needs one?
- [ ] Does the design state what scales with difficulty and why?
- [ ] Is there a "I've never seen this before" moment that is not just a reskin of a known game?

## Appendix A: Recommended Output Format (example)

This is a default layout, not a fixed contract — adapt the section numbering and placement to your project's workflow. The checklist above requires the *content* below, not these exact headings.

Produce a design document in this structure (file location is project-dependent — e.g. `tmp/games/<slug>/README.md`):

```markdown
# <GAME_NAME> (<slug>)

## 0. Seed Record

- Seeds: #seed1, #seed2, #seed3
- button_types: <1-5>
- Unexpected pair check (if the project has a novelty rule): `<pair_a> + <pair_b>` satisfies it

Omit lines that do not apply (e.g. no seeds were given).

## 0.5 Intentional Deviation

Document the design deviation process to prevent automatic pattern adoption.

- **First association**: <the mechanic or image that first came to mind>
- **Why it was rejected**: <specific reason for forbidding the first association>
- **Chosen approach's unusual element**: <what makes the final design different from the obvious interpretation>

If an `avoid_pattern` was provided (e.g., from the tag selector), state it here and explain how the design avoids it.

## 1. Core Mechanics

### Controls

For one-button games, one row per input phase:

| Phase   | Action                      | Notes                                                      |
| :------ | :-------------------------- | :--------------------------------------------------------- |
| Press   | <what happens on press/tap> | <context, cooldown, or intentionally unused: reason>       |
| Hold    | <what happens while held>   | <cost, risk, or intentionally unused: reason>              |
| Release | <what happens on release>   | <cash-out, recoil, reset, or intentionally unused: reason> |

For multi-button games, one row per button (plus rows for chords or sequences if used):

| Button   | Action                | Notes                                        |
| :------- | :-------------------- | :-------------------------------------------- |
| <button> | <what it does>        | <cost, risk, cooldown, or interaction rules> |

- Behavior: <main loop in 2-4 sentences>
- Game-over: <single visually obvious condition; explain why it is fair to read>
- Scoring: <causal scoring event and any combo/multiplier/cash-out rule>

### Difficulty Scaling

Difficulty variable convention: define its initial value, growth cadence, and expected range.

| Quantity         | Scaling                                  | Reason                                                 |
| :--------------- | :--------------------------------------- | :----------------------------------------------------- |
| <spawn interval> | </ sqrt(difficulty), capped range, etc.> | <why this pressure changes>                            |
| <hazard speed>   | <\* sqrt(difficulty), linear, etc.>      | <why this remains readable or intentionally escalates> |

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback                            | Decision Purpose           |
| :------------- | :------------------------- | :------------------------------------------- | :------------------------- |
| <var_a>        | <what changes it>          | <where/how it is shown without text-only UI> | <what choice this creates> |

- Concrete behavior pair: `<safe_action>` vs `<risky_action>`. Use the table's
  `Decision Purpose` cell for the abstract choice the state creates. Use this
  behavior pair for the concrete actions the player will actually perform.
  Example: `charge` decision purpose = "choose blast radius vs. hitbox risk";
  behavior pair = "release now for small safe blast vs. hold longer for larger
  dangerous blast".
- Tradeoff explanation: how improving one state or outcome worsens another
- Idle weakness: <why doing nothing loses or scores poorly>
- Hold-only weakness (one-button) / hold-everything weakness (multi-button): <why permanent holding loses or scores poorly>
- Mashing weakness: <why repeated tapping/releasing loses or scores poorly>
- Single-button-spam weakness (multi-button only): <why using only one button loses or scores poorly>
- Skilled play: <what timed/intentional pattern beats the monotonous policies>
- Persistent consequence or safety cost (if needed): <e.g., rising stack, crumbling platform, shrinking orbit, fuel drain, exposed hitbox>

### Implementation Invariants

The bullets above describe what the player experiences. The table below specifies what the code must enforce. Each row should be testable by a policy or telemetry; do not restate the bullet in different words. Include one row per policy in the scheme's monotonous set.

| Promise                          | Invariant                                                                  | Validation                                                     |
| :------------------------------- | :------------------------------------------------------------------------- | :------------------------------------------------------------- |
| Idle weakness                    | <testable rule that makes idle weak>                                       | <NoInput expected result>                                      |
| Hold-only / hold-everything weakness | <testable rule that makes permanent hold weak>                         | <HoldOnly expected result>                                     |
| Mashing weakness                 | <testable rule that makes repeated input weak>                             | <SpamPress / alternating spam expected result>                 |
| Single-button-spam weakness (multi-button) | <testable rule that makes one-button-only play weak>             | <single-button policy expected result>                         |
| Skilled play                     | <testable rule that creates a higher-skill route>                          | <what skilled/GA/human policy should beat>                     |
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

## Appendix B: SCAMPER Method (Auxiliary Only)

Idea assistance through transformation of existing elements. **Auxiliary, not primary** — SCAMPER tends to produce variations of the familiar; pair it with §6 to push toward genuinely new concepts.

- **Substitute**: Replace jump with teleport or gravity reversal.
- **Combine**: Combine bounce mechanics with direction change.
- **Adapt**: Adapt arcade games or physical phenomena (pendulum, waves) to the chosen `button_types` constraint.
- **Modify**: Character grows giant with hold duration; danger scales with speed.
- **Put to other uses**: Use enemies as platforms or tools.
- **Eliminate**: Remove "obvious" elements like gravity or direct movement.
- **Rearrange**: Continually re-compose the stage layout.
