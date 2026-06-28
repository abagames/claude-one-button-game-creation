# One-Button Mini-Game Design Guide

## 1. Design Challenges

- Creating diverse gameplay experiences with minimal input.
- Designing appropriate difficulty curves and risk/reward systems.
- Providing intuitive feedback for player actions.
- Preventing monotonous operations (button mashing, idle play).

## 2. Four Core Design Principles and Evaluation Criteria

Integrate "principles (what to do)" and "evaluation (confirmation items)" to clarify design guidelines.

### (1) Simplicity and Intuitiveness

- Principle: Use basic shapes (circles, triangles, squares), keep backgrounds simple. Eliminate UI, explanations, and multiple resource management. Create a "self-explanatory" structure where rules are conveyed through play.
- Evaluation: Can rules and object roles be understood immediately without text?

### (2) Visual Feedback and Game Over

- Principle: Convey success, failure, and danger states through animation, color, and size changes. Game over conditions should be single and obvious at a glance, such as "collision" or "falling."
- Evaluation: Are action results visually clear? Are failure reasons fair and obvious?

### (3) Skill-Based Scoring and Risk/Reward

- Principle: Reward intentional actions and high-risk behavior (e.g., close calls) rather than simple tasks. Design so mastery directly reflects in score.
- Evaluation: Does score reflect player skill? Are there always meaningful choices (safe vs. challenging)?

### (4) Novel Mechanics

- Principle: Without being bound by existing concepts, invent surprising behaviors from physical laws (gravity, magnetism, inertia), geometric principles, or their negation.
- Evaluation:
  - Are there moments where players feel "I've never seen this before"?
  - Are there elements that cannot be explained by existing tag combinations alone?
  - Do diverse developments emerge from a single mechanic?

## 3. Interaction Patterns (Reference)

Examples of mechanics based on button state. However, these are starting points for ideas, not constraints.

| Input | Mechanic | Application Examples |
| :--- | :--- | :--- |
| **Press** | Instant change | Direction change (90/180°), jump, shoot, teleport, split, attribute toggle |
| **Hold** | Accumulation/Extension | Power/angle adjustment, stretch, shield deployment, energy charging |
| **Release** | Release/Recoil | Projectile firing, charged attack execution, state release effects |

## 4. Movement and Environment Mechanics (Reference)

Examples of movement pattern and terrain combinations. Ideas beyond these are welcome.

### 4.1 Player Movement/Actions

- **Auto-movement**: Auto-run, constant bouncing, fixed oscillation, acceleration
- **Special movement**: Gravity reversal, wall reflection, fixed-point rotation, teleport
- **Actions**: Area attack (AoE), counter, physics-based projectiles, chain reactions, state toggle

### 4.2 Environment/Terrain Interaction

- **Terrain**: Irregular ground, floating/moving platforms, chasms, temporary footholds
- **Gimmicks**: Environment zones with changing behavior, hazards (spikes, crushers), physics puzzles

## 5. Role of Tags

Tags are not design specifications but inspiration starting points (seeds).

- **Stimulus, not constraint**: Expand associations from tags, feel free to depart from them
- **Contradiction is opportunity**: Use contradicting tags as creative tension (see §8)
- **Deviation allowed**: No problem if final design cannot be explained by tags
- **Purpose**: Functions as randomness to "shift" LLM ideas from existing patterns

## 6. Starting Points for Ideas

Idea starting points independent of tags. Use when stuck or when pursuing novelty from the start.

### 6.1 Abstract Questions

| Perspective | Example Questions |
| :--- | :--- |
| **Negation** | What if there's no screen? No score? No failure? |
| **Sensation** | What moment raises heart rate? What is relief? What is "close call"? |
| **Beyond physics** | What if you could manipulate probability? What if causality is reversed? What if time branches? |
| **Cross-discipline** | Musical tension and resolution, ecosystem predation, chemical chain reactions |
| **Reverse from emotion** | How to create feeling of "betrayal"? What is the joy of "discovery"? |

### 6.2 Ideas from Constraints

Set constraints of "without ~" and work backwards:

- No movement (game that works with only on-screen changes)
- No enemies (battle against environment or self)
- No scoring (goal is state maintenance or change)
- No visuals (works with only sound or rhythm)

## 7. Procedure for Designing Games from Tags

Design in the following order from given tag groups.

1. **Free Association**: Look at tags, verbalize the first images or sensations that come to mind (refer to §6)
2. **Deviation Exploration**: Consider the "opposite," "negation," or "extreme" of tags, explore unexpected directions
3. **Core Experience Decision**: Define the "momentary sensation" you want to give the player in one phrase
4. **Mechanics Construction**: Design one-button operation that realizes the core experience
5. **Consistency Verification**: Verify design with the checklist in §10

※ Use tags as stimulus for steps 1-2, don't be bound by tags from step 3 onwards.

## 8. Tag Contradiction and Creative Tension

When contradicting tags are given, it's an opportunity for invention, not a constraint.

| Contradiction Example | Conventional Approach | Creative Interpretation |
| :--- | :--- | :--- |
| `field:1D` and `field:3D` | Adopt one | Space that looks 1D but has depth, or move 1D-like in 3D space |
| `on_pressed:jump` and `on_pressed:shoot` | Select by priority | Jump and shoot as same action (jumping trajectory becomes attack, etc.) |
| `player:auto_move` and `on_holding:stop` | Organize dependencies | Design where stopping itself is a risk |

**Principle**: Don't resolve contradiction, invent a new concept that makes contradiction possible.

## 9. Output Format

Output in the following format to `tmp/games/<slug>/README.md`.

```markdown
# <GAME_NAME> (<slug>)

**Tags**: #tag1, #tag2, #tag3

## 1. Core Mechanics

<Input → Behavior → End condition, scoring system, difficulty increase mechanism>

## 2. Object Specifications

<Each object's shape, behavior, collision handling>

## 3. Design Guide Analysis

<Evaluation against four core design principles>

## 4. Relationship with Tags

<Idea development from tags>

## 5. Basis for Novelty

<Elements beyond existing patterns>
```

Implement in JavaScript of about 150 lines, referring to `crisp-game-lib-guide.md`.

## 10. Design Quality Checklist

Confirm the following before completing design.

- [ ] Does it complete with one button (not requiring multiple inputs)?
- [ ] Is the game over condition single and visually obvious?
- [ ] Is button mashing/idle play not the optimal solution?
- [ ] Can you provide reasoned answers to all 4 principles in §2?
- [ ] Did ideas start from tags and have elements beyond existing patterns?
- [ ] Are there moments of feeling "I've never seen this before"?

## Appendix: SCAMPER Method (Auxiliary Technique)

Idea assistance through transformation of existing elements. However, this is an auxiliary for when stuck, not the primary ideation method.

- **Substitute**: Replace jump with teleport or gravity reversal.
- **Combine**: Combine bounce mechanics with direction change.
- **Adapt**: Adapt existing arcade games or physical phenomena (pendulum, waves) to one button.
- **Modify**: Character grows giant with hold duration. Danger increases with speed.
- **Put to other uses**: Use enemies as platforms or tools.
- **Eliminate**: Remove "obvious" elements like gravity or direct movement control.
- **Rearrange**: Stage composition constantly changes.

**Note**: SCAMPER method is transformation of existing elements and has limits for generating fundamentally new ideas. Use together with abstract questions in §6, aiming for "new concepts" beyond transformation.
