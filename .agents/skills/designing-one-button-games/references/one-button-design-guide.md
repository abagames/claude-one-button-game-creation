# One-Button Mini-Game Design Guide

Long-form companion to `designing-one-button-games`. This file is self-contained so the skill can be copied or installed without depending on sibling skills.

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

**Seeds**: #seed1, #seed2, #seed3   (omit if no seeds were given)

## 1. Core Mechanics
<Input → Behavior → End condition, scoring system, difficulty progression>
<difficulty variable convention: define initial value, growth cadence, and expected range>

## 1.5 State Model and Tradeoff

| State Variable | Increase/Decrease Triggers | In-World Feedback |
| :--- | :--- | :--- |
| <var_a> | <what changes it> | <where/how it is shown without text-only UI> |

- Concrete behavior pair: `<safe_action>` vs `<risky_action>`
- Tradeoff explanation: how improving one state or outcome worsens another

## 2. Object Specifications
<Each object's shape, behavior, collision handling>

## 3. Design Principle Analysis
<Evaluation against the four core principles in §2>

## 4. Relationship with Seeds
<How the idea developed from the input seeds>

## 5. Basis for Novelty
<Elements that go beyond existing patterns>

## 6. Similarity Check
<List any known games with similar mechanics; explain key differences that make this design distinct.>
```

## 9. Design Quality Checklist

- [ ] Does it complete with one button: press, hold, release, or a combination of those phases?
- [ ] Is the game-over condition single and visually obvious?
- [ ] Are mashing, hold-only, and idle play each worse than skilled play?
- [ ] Does score come from in-world causality rather than raw input facts?
- [ ] Can rules and object roles be understood without text?
- [ ] Does every state variable create a distinct player decision?
- [ ] Does every state variable have a non-text in-world feedback channel?
- [ ] Is there at least one explicit safe/risky tradeoff?
- [ ] Does at least one persistent world-side history remain from player actions?
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
