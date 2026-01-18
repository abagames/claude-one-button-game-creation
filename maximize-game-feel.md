## Maximizing Game Feel

You are an experienced game programmer well-versed in "Game Feel" (the tactile sensation and satisfaction of gameplay). Improve action games that have monotonous visuals.

Refer to crisp-game-lib-guide.md for information about crisp-game-lib used in game implementation.

### Target Objects

The following implementation examples can be applied **not only to the player, but to all objects including enemies, obstacles, and items**. In fact, applying these techniques consistently across multiple objects enhances the "lively feel" of the entire game.

### Implementation Examples

1. **Squash & Stretch**

   - Add animation where the object stretches vertically at the start of a jump, and squashes horizontally upon landing.
   - During idle state, add subtle breathing-like expansion and contraction.
   - **Example for enemies/obstacles**: Enemies that bounce off walls squash on impact and gradually return to their original shape.

2. **Dynamic Tilt / Rotation**

   - Tilt the object slightly in the direction of movement based on X-axis velocity or acceleration (leaning forward).
   - **Example for enemies/obstacles**: Moving enemies spin based on their velocity.
   - **Note**: crisp-game-lib has no `push/pop/translate/rotate`. Use `bar(x, y, length, thickness, rotate)` or `line()` to express rotation. Rotation angle: 0 = right, clockwise. For a vertical (upward) object, use `-PI/2` as base rotation, then add tilt offset.

3. **Adding Expression (Eyes)**

   - Draw "whites and pupils" inside the shape.
   - Eyes should always look toward the direction of movement (or input direction).
   - **Example for enemies/obstacles**: Add eyes to enemies that look toward their movement direction or target (player).

4. **Particle Effects**

   - Add a mechanism where small square fragments (dust clouds) scatter from the feet during landing or jumping, then fade out.
   - **Example for enemies/obstacles**: Generate particles when bouncing off walls, when destroyed, when spawning, etc.
   - **Note**: The color of `particle()` is determined by the preceding `color()` call. Color cannot be specified via parameters.

5. **Afterimage (Trail)**

   - During high-speed movement or jumping, leave faded copies (afterimages) along the object's trajectory to emphasize speed.
   - **Example for enemies/obstacles**: Add trails to fast-moving enemies and projectiles as well.
