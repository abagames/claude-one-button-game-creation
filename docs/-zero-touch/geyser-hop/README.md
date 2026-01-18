# GEYSER HOP (geyser-hop)

**Tags**: #obstacle-well_up, #rule-find, #player-step_on

## 1. Core Mechanics

**Input**: Hold button to rise, release to fall

**Core Loop**:
- Player floats in the play area, controlling vertical position
- Geysers scroll in from the right with yellow stomp targets on top
- Player must stomp on geyser tops (descend onto them) to score
- Missing the top and hitting the body = game over
- Ceiling descends if player doesn't stomp regularly (forcing engagement)
- Successful stomps push ceiling back up

**Scoring**: 
- +1 point per successful stomp

**Difficulty Increase**:
- Geysers move faster
- Spawn rate increases
- Variable geyser heights

## 2. Object Specifications

**Player**: 
- 6x6 cyan box
- Hold to rise, release to fall
- Bounces up on successful stomp

**Geysers**:
- Blue water columns with yellow tops
- Scroll left across screen
- Stomped geysers turn purple and shrink

**Ceiling**:
- Red danger zone at top
- Descends if no stomping for ~3 seconds
- Successful stomps push it back

## 3. Design Guide Analysis

- **Simplicity**: One button controls vertical movement - intuitive
- **Visual Feedback**: Yellow targets, particle bursts on stomp, ceiling warning
- **Skill-Based**: Must time descent precisely to hit yellow zone
- **Risk/Reward**: Ceiling mechanic forces risky stomping attempts

## 4. Relationship with Tags

- **obstacle-well_up**: Geysers erupting from ground are the core obstacle
- **rule-find**: Must identify and reach the yellow stomp zone
- **player-step_on**: Victory comes from stomping on geyser tops

## 5. Basis for Novelty

Combines vertical flight control with precision stomping. The descending ceiling creates urgency and prevents passive play.

## Simulation Results

| Metric           | Value |
|:-----------------|:------|
| GA Best Score    | 2     |
| Monotonous Max   | 0     |
| GA Ratio         | ∞     |
| Evaluation       | Pass  |
