---
name: designing-one-button-games
description: "Design original one-button mini-games from scratch. Use when planning the mechanics, scoring, game-over conditions, and difficulty curve of a game controlled by a single input (tap / hold / release), independent of any specific engine or library."
---

# Designing One-Button Mini-Games

A library-agnostic guide for designing one-button mini-games. The aim is to produce a design that is intuitive, visually self-explanatory, rewards skilled play, and contains at least one mechanic the player has never seen before.

## 1. When to Use This Skill

Use this skill when you need to:
- Invent a new one-button game from a theme, prompt, or set of inspiration tags.
- Audit an existing one-button design for monotonous-input dominance, unfair death, or lack of novelty.
- Decide between competing mechanic ideas before implementation.

This skill covers **design only**. Implementation details (rendering, collision, audio) belong to engine-specific skills.

## 2. Design Challenges to Keep in Mind

- Producing diverse gameplay from a single binary input.
- Designing an appropriate difficulty curve and risk/reward system.
- Giving intuitive feedback for player actions.
- Preventing monotonous-input dominance (button mashing, hold-only, idle play).

## 3. Four Core Design Principles

Each principle pairs a "what to do" with an "evaluation question" used to verify it.

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

## 4. Interaction Patterns (Reference, Not Constraint)

Starting points for ideas based on button state. These are seeds, not a menu to pick one item from.

| Input       | Mechanic               | Application Examples                                              |
| :---------- | :--------------------- | :---------------------------------------------------------------- |
| **Press**   | Instant change         | Direction change (90°/180°), jump, shoot, teleport, split, toggle |
| **Hold**    | Accumulation/extension | Power/angle adjustment, stretch, shield deploy, charge            |
| **Release** | Release/recoil         | Projectile firing, charged-attack execution, state-release effect |

## 5. Movement and Environment Mechanics (Reference)

### 5.1 Player Movement / Actions
- **Auto-movement**: auto-run, constant bouncing, fixed oscillation, acceleration
- **Special movement**: gravity reversal, wall reflection, fixed-point rotation, teleport
- **Actions**: AoE attack, counter, physics projectiles, chain reactions, state toggle

### 5.2 Environment / Terrain Interaction
- **Terrain**: irregular ground, floating/moving platforms, chasms, temporary footholds
- **Gimmicks**: zones with changing behavior, hazards (spikes, crushers), physics puzzles

## 6. Starting Points When You Are Stuck

Use these when ideation stalls or when a tag/prompt feels too narrow.

### 6.1 Abstract Questions

| Perspective           | Example Questions                                                                       |
| :-------------------- | :-------------------------------------------------------------------------------------- |
| **Negation**          | What if there's no screen? No score? No failure?                                        |
| **Sensation**         | What moment raises heart rate? What is relief? What is "close call"?                    |
| **Beyond physics**    | What if probability could be manipulated? What if causality is reversed? Time branches? |
| **Cross-discipline**  | Musical tension/resolution, ecosystem predation, chemical chain reactions               |
| **Reverse from emotion** | How to create the feeling of "betrayal"? What is the joy of "discovery"?             |

### 6.2 Ideas From Constraints

Set "without ~" constraints and work backwards:
- No movement (gameplay arises only from on-screen state changes)
- No enemies (battle the environment or the self)
- No scoring (the goal is state maintenance or transformation)
- No visuals (works with sound or rhythm only)

## 7. Design Procedure (Use This Order)

When given tags, a theme, or a free prompt, design in this sequence.

1. **Free Association**: Verbalize the first images and sensations the input evokes (refer to §6).
2. **Deviation Exploration**: Consider the opposite, the negation, or the extreme of the input. Push toward unexpected directions.
3. **Core Experience Decision**: Define the "momentary sensation" you want the player to feel in a single phrase.
4. **Mechanics Construction**: Design the one-button operation that realizes the core experience.
5. **Consistency Verification**: Run the checklist in §9.

> Treat seeds (tags / prompts) as stimulus for steps 1–2. From step 3 onward, do not be bound by them. A finished design that no longer references the original tags is fine.

## 8. Tag / Prompt Contradiction = Creative Tension

When contradicting seeds are given, treat the contradiction as an invention prompt rather than an obstacle.

| Contradiction Example                              | Conventional Approach    | Creative Interpretation                                         |
| :------------------------------------------------- | :----------------------- | :-------------------------------------------------------------- |
| `field:1D` and `field:3D`                          | Adopt only one           | Space that looks 1D but has hidden depth, or 1D-like motion in 3D space |
| `on_pressed:jump` and `on_pressed:shoot`           | Pick one by priority     | Jump and shoot are the same action — the jump arc deals damage |
| `player:auto_move` and `on_holding:stop`           | Resolve dependencies     | Stopping itself is the risk                                     |

**Principle**: Don't *resolve* the contradiction — invent a new concept under which the contradiction becomes possible.

## 9. Design Quality Checklist

Confirm each item before declaring the design done.

- [ ] Does it complete with one button (no second input required)?
- [ ] Is the game-over condition single and visually obvious?
- [ ] Is button mashing / idle play clearly **not** an optimal strategy?
- [ ] Can you give a reasoned answer to all four principles in §3?
- [ ] Did the idea start from the seed but contain elements beyond it?
- [ ] Is there a "I've never seen this before" moment?
- [ ] Is this **not** a clone or minor variation of a widely-known existing game?

## 10. Recommended Output Format

Produce a design document in this structure (file location is project-dependent — e.g. `tmp/games/<slug>/README.md`):

```markdown
# <GAME_NAME> (<slug>)

**Seeds**: #seed1, #seed2, #seed3   (omit if no seeds were given)

## 1. Core Mechanics
<Input → Behavior → End condition, scoring system, difficulty progression>

## 2. Object Specifications
<Each object's shape, behavior, collision handling>

## 3. Design Principle Analysis
<Evaluation against the four core principles in §3>

## 4. Relationship with Seeds
<How the idea developed from the input seeds>

## 5. Basis for Novelty
<Elements that go beyond existing patterns>

## 6. Similarity Check
<List any known games with similar mechanics; explain key differences that make this design distinct.>
```

## Appendix: SCAMPER Method (Auxiliary Only)

Idea assistance through transformation of existing elements. **Auxiliary, not primary** — SCAMPER tends to produce variations of the familiar; pair it with §6 to push toward genuinely new concepts.

- **Substitute**: Replace jump with teleport or gravity reversal.
- **Combine**: Combine bounce mechanics with direction change.
- **Adapt**: Adapt arcade games or physical phenomena (pendulum, waves) to one button.
- **Modify**: Character grows giant with hold duration; danger scales with speed.
- **Put to other uses**: Use enemies as platforms or tools.
- **Eliminate**: Remove "obvious" elements like gravity or direct movement.
- **Rearrange**: Continually re-compose the stage layout.
