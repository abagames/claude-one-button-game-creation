---
name: maximizing-game-feel
description: "Improve the tactile satisfaction (\"game feel\") of action games whose visuals are functional but flat. Use when a game runs correctly but feels lifeless — applies to player, enemies, obstacles, projectiles, and items alike."
---

# Maximizing Game Feel

You are an experienced game programmer well-versed in **Game Feel** — the tactile sensation and moment-to-moment satisfaction of gameplay. Use this skill to upgrade action games whose visuals are functional but flat into something that feels alive.

## 1. When to Use This Skill

Use this skill when:
- A game's mechanics are correct but the visuals feel static or "dead".
- Hits, jumps, landings, or destructions don't feel impactful.
- Movement looks rigid — no anticipation, no follow-through, no weight.
- You want a single object (typically the player) to feel responsive, **and** want the rest of the world to match its energy.

## 2. Apply Techniques to Every Object, Not Just the Player

Each technique below can — and should — be applied not only to the player but to **enemies, obstacles, projectiles, and items**. Consistent application across multiple objects is what makes the entire game world feel lively, rather than producing a single expressive player in a dead world.

When in doubt, ask: *"Does this enemy / obstacle deserve the same level of expression as the player?"* The answer is usually yes.

## 3. Implementation Techniques

### 3.1 Squash & Stretch
- Stretch the object **vertically** at the start of a jump; squash **horizontally** on landing.
- During idle, add a subtle breathing-like expansion and contraction.
- **Enemies / obstacles**: an enemy that bounces off a wall squashes on impact and gradually returns to its original shape.

### 3.2 Dynamic Tilt / Rotation
- Tilt the object slightly in the direction of movement based on X-axis velocity or acceleration ("leaning forward").
- **Enemies / obstacles**: moving enemies spin proportionally to their velocity.
- Use rotation to telegraph state changes (charging, alerted, defeated) — not just movement.

### 3.3 Adding Expression (Eyes)
- Draw "whites and pupils" inside the body shape.
- Eyes should always look toward the **direction of movement** (or input direction, or the current target).
- **Enemies / obstacles**: add eyes to enemies so they look toward their movement direction or toward the player. This single change does enormous work for personality.

### 3.4 Particle Effects
- Scatter small fragments (dust clouds) from the feet on landing, jumping, dashing, or stopping; fade them out.
- Spawn particles on **wall bounces, destruction, and spawn-in** for any object — not just the player.
- Use color and density to communicate intent: dust is gentle, sparks are violent, glints are rewarding.

### 3.5 Afterimage (Trail)
- During fast movement or jumps, leave faded copies along the trajectory to emphasize speed.
- Apply trails to **fast enemies and projectiles** as well — it lets the player read motion vectors at a glance.

## 4. Order of Application

If you can only do a few of these, apply them in this rough order of impact-per-effort:

1. **Squash & Stretch on jump/land** — biggest impact for the smallest code change.
2. **Eyes on the player** — instantly adds personality.
3. **Particles on impact moments** — landing, hitting, destroying.
4. **Tilt on velocity** — sells weight and momentum.
5. **Eyes / particles / squash on enemies** — promote the rest of the world.
6. **Afterimage trails** — final polish for high-speed elements.

## 5. Pitfalls to Avoid

- **Don't add motion that obscures gameplay.** Squash should never make a hitbox visually misleading.
- **Don't apply effects uniformly to everything.** A scene where every object is bouncing/tilting/trailing reads as noise. Reserve the strongest effects for the most important moments.
- **Don't tilt or squash without a return-to-rest.** A permanently-tilted sprite reads as broken, not alive.
- **Don't trail slow objects.** Trails imply speed; if it's slow, a trail just looks like a smear.

## 6. Library / Engine Notes

The principles above are universal. Specific drawing primitives differ per engine — adapt as follows:

### When using crisp-game-lib
- **Rotation**: there is no `push/pop/translate/rotate`. Use `bar(x, y, length, thickness, rotate)` or `line()` to express rotated shapes. Rotation 0 = right, clockwise positive. For a vertical (upward-pointing) object, use `-PI/2` as the base rotation and add tilt offsets to that.
- **Particles**: the color of `particle()` is determined by the preceding `color()` call. You cannot specify color via parameters — call `color(...)` first, then `particle(pos, { count, speed, angle, angleWidth })`.

### When using a general 2D engine (Canvas / Pixi / Phaser / Unity / Godot)
- All techniques map directly to standard `scale`, `rotation`, particle systems, and trail renderers. Implement squash via non-uniform scale, tilt via rotation around the object's center of mass, and afterimage via either ghost sprites or motion-blur shaders.
