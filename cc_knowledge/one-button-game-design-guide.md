# One-Button Game Idea Generation Guide

This guide demonstrates practical methods for designing games that are fun, understandable, and innovative.

**The verbs, methods, mechanics, types, genres, etc. mentioned in this guide should be treated as examples only. Feel free to think broadly and creatively beyond the content presented in this guide.**

## Chapter 1: Verb Matrix Generation Method

### 1.1 Basic Formula

#### Step 1: Verb Combination Selection

**Matrix Example:**

| Basic Verb | Transform Verb | World Effect | Concrete Example |
| ---------- | -------------- | ------------ | ---------------- |
| Push       | Expand         | Space expansion | Push walls apart to create paths |
| Stop       | Freeze         | Time stop    | Turn enemies into platforms |
| Absorb     | Contract       | Gravity increase | Turn obstacles into projectiles |
| Reverse    | Flip           | Gravity inversion | Ceiling becomes floor |
| Resonate   | Synchronize    | Chain reaction | Same-colored objects disappear |

**Verb Candidates:**

- Basic: Push, pull, rotate, stop, launch, absorb, emit, transform
- Transform: Expand, contract, split, merge, accelerate, decelerate, reverse, freeze
- Effect: Time manipulation, space distortion, gravity change, matter conversion, chain reaction

#### Step 2: Compatibility Check

```markdown
✅ Unified theme example: "Stop + Freeze + Time stop"
❌ Contradictory example: "Expand + Contract + Simultaneous activation"

Confirmation items:
□ Do they mutually enhance each other?
□ Are there no contradictions or cancellations?
□ Do new strategies emerge?
```

#### Step 3: Control Method Design

```markdown
Design player choices:

【Spatial Control】Direction/position selection
- Aiming system: Choose launch direction with pendulum
- Trajectory control: Adjust flight distance with hold time

【Temporal Control】Timing selection
- Timing window: Aim for periodic effective time
- Delayed activation: Current operations affect the future

【State Control】Mode selection
- Binary toggle: Press=attraction, release=repulsion
- Stage change: Change effect level with press count
- Accumulate & release: Charge up for powerful burst

【Cumulative Control】Resource management selection
- Energy management: Balance usage and recovery
- Material collection: Gather materials for powerful effects
- Experience growth: Effects improve with usage count

【Sequence Control】Operation order selection
- Action reservation: Pre-set multiple actions
- Chain design: Previous actions determine next choices
- Pattern memory: Reproduce successful operation sequences
```

#### One-Button Input Pattern Classification

**3 Basic Input Types:**

| Input Type | Mechanics | Application Examples |
| ---------- | --------- | -------------------- |
| **Press (Tap)** | **Instant Action** | Direction change, jump/flap, short hop, move to next point/floor, state toggle, action start |
|                 | **Hold Start** | Power charging, angle setting, element expansion start |
| **Hold (Long Press)** | **Parameter Adjustment** | **Angle/Power/Range:** Continuous launch parameter adjustment. **Growth/Expansion:** Size or range increase |
|                      | **State Maintenance** | **Propulsion:** Continuous upward force against gravity. **Defense/Shield:** Temporary protection state. **Slow fall:** Reduced falling speed |
| **Release** | **Action Execution** | **Launch/Shoot:** Execute action with parameters set during Hold. **Shrink/Contract:** Return elements to default state |
|            | **State Cancellation** | End temporary state started during Hold (e.g., stop propulsion) |
|            | **Action Confirmation** | Implicitly occurs after tap (e.g., jump confirmed after tap) |

#### Step 4: Goal and Risk Setting

**Goal Patterns:**

- Reach type: "Go to [place] by [method]"
- Survival type: "Survive [threat] for [time]"
- Collection type: "Collect [target] in [number]"
- Transformation type: "Change [state A] to [state B]"

**Risk Design:**

- Concrete danger: "Expanding too much will crush yourself"
- Clear failure conditions: "Time up," "instant death trap"
- Learnable: Cause and improvement method are clear
- Simultaneous countermeasure design: Always provide means for players to actively address risks

## Chapter 2: Three Elements of Fun

### 2.1 Instant Understanding (3-Second Rule)

**Visually Clear Goals:**

```markdown
✅ Good examples: Glowing flag, approaching wall, falling pit
❌ Bad examples: Energy balance, quantum state

Design principles:
□ Understand purpose within 3 seconds of looking at screen
□ Understand basic operation with first button press
□ Failure reason is visually clear
```

**Clear Game Over Conditions:**

```markdown
Instantly understandable failure conditions:
□ Direct collision with obstacles or enemies (considering player state)
□ Falling/moving outside visible area
□ Contact with clearly defined danger zones (color, shape, range)

Design guidelines:
□ Single, understandable failure condition when possible
□ Clear visual/audio feedback on failure
□ Failure cause immediately understandable
```

### 2.2 Progressive Discovery

**Implicit Visual Feedback:**

```markdown
Visual communication of game state:
□ Player animation, color change, size change
□ Clear animation of collisions, state transitions, action results
□ Consistent visual language (danger=red, collectible=yellow, etc.)

Intuitive visual cues:
□ Blinking=interactable/dangerous
□ Shrinking bar=timer
□ Sparks=successful hit
□ Visual clarity of cause and effect
```

### 2.3 Risk and Reward Design

**Risk Visualization:**

| Type | Visual Representation | Player Psychology |
| ---- | -------------------- | ----------------- |
| Instant death | Red spikes | "Absolutely avoid" |
| Accumulative | Gauge rising | "Still okay" |
| Time-limited | Countdown | "Hurry!" |

**Action-Based Scoring:**

```markdown
Rewards for skillful actions:
□ Points for intentional, skilled actions (evasion, precise hit, item collection)
□ Directly linked to core mechanics mastery
□ Clear risk-reward relationship (high risk = high score)

Design principles:
□ High scores through skill improvement, not time passage
□ Multipliers for consecutive successes or high-difficulty operations
□ Score mechanics enhance core gameplay
```

### 2.4 Avoiding Unnecessary Complexity

**Simplicity Principles:**

```markdown
Recommended approach:
□ Deepen single core mechanics (rather than adding multiple systems)
□ Difficulty adjustment through procedural generation or simple patterns
□ Minimize resource management systems
□ Minimize UI elements (prioritize in-world state representation)
□ No explicit tutorials (design learnable through observation and experimentation)

Complexity to avoid:
□ Complex level design
□ HP, ammunition, complex timer systems
□ Many UI elements
□ Mechanics requiring explanation
```

## Chapter 3: Seven Methods for Innovation

### 3.1 Environment Types and Player Movement Pattern System

**6 Environment Types:**

| Environment Type | Primary Interaction | General Concept |
| ---------------- | ------------------- | --------------- |
| **Central Fixed Point/Orbital** | Player rotates around central point, interacts with fixed elements | Timing actions based on rotational position, focus on connections between fixed points |
| **Defined Path/Track** | Movement along constrained paths (shape edges, lines) | Managing speed, state, actions while following path |
| **Open Space (Physics)** | Simulation by gravity, propulsion, momentum, projectile physics | Managing forces, trajectories, collisions in unconstrained space |
| **Scrolling Environment** | Interaction with elements crossing scrolling background | Reacting to incoming elements, maintaining relative position to scroll |
| **Lane Control** | Gameplay divided into clear horizontal or vertical lanes | Lane switching, executing actions within specific lanes |
| **Dynamic Surface** | Shape/position changes of ground or primary interaction surfaces | Adapting movement to changing surface contours |

**8 Player Movement Patterns:**

| Pattern | Description | Primary Challenge |
| ------- | ----------- | ----------------- |
| **Static Action** | Player position fixed/minimal movement, focus on timing actions | Precise timing of output (shooting, expansion, reflection) |
| **Auto Movement** | Player constantly moving, button for individual actions (jump, direction change, etc.) | Perfect timing of actions against auto-movement and environmental elements |
| **Controlled Trajectory** | Hold/Release directly affects player movement path (angle, power) | Accurate parameter setting before launch/action |
| **Gravity & Propulsion** | Player counters constant downward force with button-controlled force | Effective management of vertical position and momentum |
| **Path Following** | Player character follows predefined paths or surfaces | Managing state (size, speed) on path, executing actions |
| **Point-to-Point Movement** | Player moves between individual points or anchors | Timing transitions between points for danger avoidance/goal achievement |
| **Physics-Based Floating** | Player position affected by dynamic environmental forces (waves, etc.) | Reacting to and utilizing unpredictable environmental forces |
| **State-Dependent Movement** | Player movement characteristics change based on game state | Choosing appropriate state/mode for current situation, transition timing |

### 3.2 Subverting Expectations

```markdown
Expectation: Jump → Result: Ground lowers
Expectation: Attack → Result: Self fragments

Corresponding control system: Spatial control (position relationship reversal)
Implementation considerations: Relative movement visualization, clear display of unexpected effects
```

### 3.3 Dual-Nature Mechanics

```markdown
Example: Attraction/repulsion button
Press=attraction (useful but danger also approaches)
Release=repulsion (safe but necessary things move away)

Corresponding control system: State control (mode switching)
Implementation considerations: Visual display of current mode, indication of effect range
```

### 3.4 Chain Effects

```markdown
Example: Resonance system
Wave generation → Same-colored objects vibrate → Chain propagation → Path formation

Corresponding control system: Spatial control (activation point selection)
Implementation considerations: Chain progress display, prediction lines for effect range
```

### 3.5 Temporal Displacement

```markdown
Example: Echo action
Press now → Jump occurs at that spot 2 seconds later

Corresponding control system: Sequence control (future reservation)
Implementation considerations: Display of reserved actions, visualization of execution timing
```

### 3.6 Cumulative Change

```markdown
Example: Gravity accumulation
Each press +10% gravity, each release -5%

Corresponding control system: Cumulative control (parameter management)
Implementation considerations: Display of current value, indication of change amount
```

### 3.7 Paradoxical Goals

```markdown
Example: Lose to win
Deliberately get defeated to create platforms

Corresponding control system: Spatial control (choosing where to be defeated)
Implementation considerations: Visual distinction of intentional failure, display of platform creation
```

### 3.8 Environmental Interaction

```markdown
Example: Tilting the world
Button tilts world, all objects roll

Corresponding control system: Temporal control (timing of tilt)
Implementation considerations: Display of tilt angle, prediction of object movement
```

## Chapter 4: Scientific Methods for Idea Generation

### 4.1 SCAMPER Method Application

**Systematic Idea Transformation:**

| SCAMPER Element | Application to One-Button Games | Concrete Examples |
| --------------- | ------------------------------- | ----------------- |
| **Substitute** | Replace standard actions with unexpected ones | Jump → Teleport, Direct attack → Reflection attack |
| **Combine** | Merge different mechanics | Bounce + Direction change, Timing + Resource collection |
| **Adapt** | Abstract sports or daily concepts | Aiming/Power → Abstract challenges |
| **Modify** | Dynamically change basic parameters | Player size change, Gravity effect change |
| **Put to other uses** | Convert obstacles to usable elements | Use enemy projectiles, Hazards as temporary platforms |
| **Eliminate** | Intentionally remove conventional elements | No gravity, No stable platforms, No direct movement control |
| **Reverse/Rearrange** | Reverse roles or controls | Player/enemy role reversal, Temporary control inversion |

### 4.2 Inspiration from Natural Phenomena & Physics

**Application of Physical Concepts:**

```markdown
Rotation/Orbit: Rotational motion around central points, planetary orbit patterns
Gravity/Thrust: Balance of gravity and thrust, orbital escape
Wave/Vibration: Wave propagation, resonance phenomena, interference patterns
Elasticity/Reflection: Elastic collision of objects, light reflection principles
Magnetism/Attraction: Interaction of attraction and repulsion, magnetic field effects
Fluid/Growth: Liquid flow, organic growth patterns
```

**Utilization of Geometric Principles:**

```markdown
Symmetry: Symmetrical patterns and changes
Constrained regions: Interaction within limited spaces
Path following: Movement along geometric shapes
```

### 4.3 Creative Constraint Design

**Innovation Through Constraints:**

```markdown
Object count limitation: Maximum diversity with minimal elements
Screen space limitation: Efficient movement in limited space
Operation type limitation: Diverse effects with single button
Removal of expected elements: No direct horizontal control, no constant gravity
```

**Constraint Design Principles:**

```markdown
Moderate constraints = Room for ingenuity = Fun creation
Example: Aiming sway → Need for precise operation, Number limits → Efficient placement strategy
Confirmation: Creativity stimulation, Existence of reversal strategies, Learning promotion effect
```

## Chapter 5: Integrated Verification Checklist

### 5.1 Basic Requirements Check

**Fun:**
□ Purpose clear within first 3 seconds
□ Failure reason is clear
□ Has "one more time" element
□ Can feel improvement
□ Want to recommend to others

**Understandability:**
□ Button effects visually clear
□ Goals obvious at a glance
□ Progress trackable
□ Success/failure difference clear

**Innovation:**
□ Not simple combination of existing games
□ Has unexpected elements
□ Has "Aha!" moments
□ Provides experience unavailable elsewhere

### 5.2 Mechanics Integration Check

**Integration:**
□ Multiple mechanics mutually enhance
□ One doesn't nullify others
□ All mechanics contribute to strategic goals
□ Combinations create new strategies

**Control:**
□ Rich strategic choices
□ Choice results predictable
□ Choices visually clear
□ Single operation enables meaningful choice

### 5.3 Feasibility Check

**Physical Consistency:**
□ Goal achievement possible with set forces/actions
□ No contradiction with gravity/inertia/energy conservation
□ Clear specific mechanism for "use X to do Y"
□ Logically traceable from player action to goal achievement

**Causal Relationship Clarity:**
□ Complete chain: Button press → System response → Goal achievement
□ No logical leaps in intermediate steps
□ Abstract expressions ("use," "utilize") concretized
□ Counter-intuitive results have physical basis

### 5.4 Warning Signs Check

**Items Requiring Reconsideration:**
□ Mechanics explanation requires existing game names
□ Fun depends only on "speed increase"
□ Strategy is only "timing alignment"
□ Failure reason is only "slow reaction"
□ Innovation element is afterthought gimmick
□ Can clear by ignoring one mechanic
□ No proactive countermeasures designed for risks
□ Specific method for "use X to do Y" unclear
□ Forces/actions needed for goal achievement don't exist
□ Phenomena violating physics laws occur without basis

### 5.5 Comprehensive Evaluation Criteria

**Control & Feedback:**

```markdown
□ Button actions (tap, hold, release) and game responses are immediate, clear, and consistent
□ Rich implicit visual/audio feedback for actions, state changes, collisions, scoring, hazards
□ Timing requirements fair and learnable, clearly signal "when" action needed
□ Easy to distinguish results of different input patterns (tap vs hold)
□ Visual effects enhance understanding (not clutter)
```

**Balance & Progression:**

```markdown
□ Risk-reward relationships attractive, motivate players to take calculated risks
□ Difficulty increases smoothly and perceptibly, new challenges or speed/density increases
□ Monotony resistance: Cannot easily clear with simple repetitive input (button mashing, holding)
□ Players feel meaningful agency within constraints
□ Game over conditions fair, result of player error not random or unclear mechanics
```

**Visual Design & Simplicity:**

```markdown
□ Game objects easily distinguishable by shape, color, movement
□ Background supports gameplay clarity
□ Players instantly understand object function and state visually
□ Visual style consistent and purposeful
□ Animations effectively communicate actions and states without distraction
```

**Scoring & Motivation:**

```markdown
□ Scoring directly tied to skillful execution of core mechanics
□ High-risk operations and difficult achievements appropriately rewarded (score multipliers, special items)
□ Scoring system intuitive with immediate feedback
□ Scoring promotes replayability and mastery
□ Path to high scores involves skill development, not grinding
```

**Innovation & Engagement:**

```markdown
□ Unique twist on one-button concept, or novel combination of familiar mechanics
□ Core mechanics instantly satisfying and engaging
□ Single button input yields surprisingly deep or varied gameplay results
□ Creates memorable moments of tension, success, near-misses
□ Challenging yet feels "fair"
```

## Chapter 6: Idea Generation Template

### 6.1 Basic Format (Implementation Guide Compatible)

**Standard output format for implementation guide integration:**

```markdown
# Game Title: [Name]

## Core Mechanics

- Button action: [What happens when pressed]
- World response: [How the world changes as a result]
- Input pattern: [Which combination of Press/Hold/Release]
- Environment type: [Central fixed point/Defined path/Open space/Scrolling/Lane/Dynamic surface]
- Movement pattern: [Static/Auto/Controlled trajectory/Gravity propulsion/Path following/Point-to-point/Physics floating/State dependent]

## System Interactions

- Control target: [Elements directly affected by player]
- Action method: [What changes/effects occur from button operation]
- Effect range: [Targets/areas/conditions affected]
- Response pattern: [How affected elements change/respond]
- Constraint conditions: [Prerequisites/limitations/costs for action activation]
- Causal relationship concretization: [Clearly show logical chain of action → response → goal achievement]
- Physical constraint consistency: [Confirm no contradictions with gravity, inertia, conservation laws]

## Game Loop

- Objective: [Specifically what to achieve]
- Action: [Actions player takes]
- Obstacle: [What interferes]
- Reward: [Payoff for success]

## Failure Conditions (Clear Game Over)

- Primary failure condition: [Single, understandable condition]
- Visual feedback: [How failure is displayed]
- Avoidability: [Avoidable through player skill]
- Countermeasures: [Actions player can proactively take against this risk]

## Innovative Elements

[Unique mechanics inspired by SCAMPER method or natural phenomena]

## Mechanics Integration

- Number of mechanics used: [Single (recommended)/Multiple]
- Mechanics compatibility: [Mutually enhancing/Independent/Points of concern]
- Control evaluation: [Richness of choices/Predictability/Visual clarity]

## Feasibility Verification

- Goal achievement path: [Specific steps to achieve game objective]
- Logical contradiction check: [Confirm no conflicts/cancellations/cycles between mechanics]
- Feasibility under constraints: [Verify goal achievement possible within set constraints]
- Minimum mechanical requirements: [Identify minimum physical forces/energy/actions needed for goal achievement]

## Implementation Priority

- Phase 1: [Minimal implementation (core mechanics only)]
- Phase 2: [Basic expansion (enhanced visual feedback)]
- Phase 3: [Optimization (performance/balance adjustment)]

## Additional Game Rules for Implementation
```

## Chapter 7: Idea Concretization Phase

**One question, one answer session bridging Idea → Implementation**

After organizing ideas in the template format from Chapter 6, this is the detailed elaboration phase before implementation. Ask questions one at a time about the generated idea to clarify whether optimal actions for players to avoid risks and gain rewards are clear, whether players can intentionally take those actions, whether game objects and their interactions can perform appropriate behaviors to realize such game rules, etc. Each question is based on the user's previous answers, with the ultimate goal of creating detailed ideas that can be handed over to developers. Repeat this process to drill down into all relevant details. Only one question at a time.

Questions about detailed parameters and game balance are prohibited. Game balance adjustment follows the subsequent implementation guide.

When showing multiple answer examples, number the examples to reduce user response burden.