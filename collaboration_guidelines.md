# Human-LLM Collaboration Guidelines

## Overview

This document provides practical guidelines for human-LLM collaboration in the game generation workflow. It focuses particularly on feedback collection, question management, and best practices.

**Target Audience:**

- LLM Agents: Learn effective communication methods with humans
- Human Operators: Understand how to provide effective feedback

**Related Documents:**

- `game_generation_workflow.md`: Complete details of the integrated workflow
- `one-button-game-design-guide.md`, `one-button-game-implementation-guide.md`: Original collaborative approaches

---

## Feedback Collection Templates

Collection of feedback templates for each phase.

### Phase 0: Tag Selection and Initial Validation

**Purpose:** Validate the feasibility and appeal of tag combinations

**Template:**

```markdown
【Tag Selection Feedback Request】

Please verify the feasibility of the selected tag combination:

【Selection Results】

- Tags: [list]
- Categories: [number] ([category names])
- Dominance rate: [max category] [percentage]%
- Novelty score: [value] (tag pair novelty rate)

【Questions】

1. Is this tag combination appealing?

   - Can you imagine any interesting interactions?
   - Are there any awkward combinations?

2. Is the category balance appropriate?

   - Do any specific categories feel lacking/excessive?

3. What problem category is expected from these tags?
   - Movement/Navigation
   - Resource/Collection
   - Timing/Coordination
   - Information/Visibility
   - State/Balance
   - Physics/Forces
   - Pattern/Signal

【Response Options】
✅ "Approved, proceed" + indicate expected problem category
🔄 "Change tag X to tag Y" → reselection
❌ "Overall appeal is weak" → complete reselection
```

**Expected Responses:**

```markdown
✅ Good: "Approved. Physics/Forces problem expected"
✅ Good: "Approved, proceed. Timing/Coordination looks interesting"
🔄 Adjustment: "Change weapon:explosion to weapon:beam"
🔄 Adjustment: "Lacking player tags. Add player:rotate"
❌ Reject: "Combination is bland. Complete reselection"
```

---

### Phase 1: Problem-Solution Structuring

**Purpose:** Validate the feasibility and logic of problem-solution logic

**Template:**

```markdown
【Problem-Solution Logic Validation Request】

Please verify the feasibility of the problem-solution logic:

【Problem Definition】

- Player wants to: [specific goal]
- Current obstacle: [what hinders]
- Environmental constraint: [why normal means don't work]

Is this problem definition clear and appealing?

【Solution】

- Baseline verb: "[base verb]"
- Light improvement: "[light twist]"
- Control:
  - Press: [immediate action]
  - Hold: [continuous action/parameter change]
  - Release: [action execution/state change]

Is this solution intuitive? Can it be understood within 3 seconds?

【Logic Chain】
Problem ([obstacle])
↓
Solution ([solution])
↓
Goal ([goal])

Does this logical flow feel natural? Are there any contradictions?

【Response Options】
✅ "Approved, logical and interesting"
🔄 "Adjust problem definition: [specific suggestion]"
🔄 "Adjust solution: [specific suggestion]"
❌ "Fundamental contradiction: [reason]" → Redesign Phase 1
```

**Expected Responses:**

```markdown
✅ Good: "Approved, logical and interesting"
✅ Good: "Simple and clear, proceed"
🔄 Adjustment: "Problem definition: 'place' is more accurate than 'collect objects'"
🔄 Adjustment: "Solution: timing explosion is more intuitive than charged explosion"
❌ Reject: "Contradictory that explosion can push back against gravity" → redesign
```

---

### Phase 2: Creative Synthesis and Novelty Assurance

**Purpose:** Validate creativity, differentiation, and implementability

**Template:**

```markdown
【Creativity and Implementability Validation Request】

Please verify creativity and implementability:

【Concept Evaluation】

- Does this game concept feel fresh and appealing?
- Is the difference from existing games clear?
- Would you want to play this?

【Differentiation Elements】
Explicitly excluded:

- Victory condition: "[new condition]" (not existing "[old condition]")
- Control method: "[new method]" (not existing "[old method]")
- Game loop: "[new loop]" (not existing "[old loop]")

Do these differentiations feel sufficient?

【Implementability】
Please review the logical walkthrough:
[step-by-step flow]

Are there any impossibilities or contradictions in this flow?

【Visual Communication】
Are the presented visual feedback specifications appropriate?

- Ease of problem recognition
- Immediate action feedback
- Clarity of progress

【Engagement/Innovation Judgment】
🤝 Please provide your intuitive judgment:

- Can this mechanic create strategic depth?
- Is there a risk of simple repetition?
- Does this "light twist" contribute to essential fun?
- Is it just a superficial gimmick?

【Response Options】
✅ "Approved, implementable and appealing"
🔄 "Adjust concept: [specific suggestion]"
🔄 "Add differentiation element: [specific suggestion]"
🔄 "Adjust visual feedback: [specific suggestion]"
❌ "Fundamental issue: [reason]" → Return to Phase 1
```

**Expected Responses:**

```markdown
✅ Good: "Approved, implementable and appealing"
✅ Good: "Clear differentiation, has strategic depth"
🔄 Adjustment: "Differentiation element: want visual representation difference too (colors etc.)"
🔄 Adjustment: "Visual feedback: emphasize charge display more"
❌ Reject: "Ends up being the same as existing gravity games" → Return to Phase 1
```

---

### Phase 3: Implementation and Prototyping

**Purpose:** Verify basic functionality and parameter tuning

**Template:**

```markdown
【Basic Functionality Verification Request】

Please verify basic functionality:

【Comprehensibility Test】

- Can you understand the game's objective within 3 seconds?
- Is what you should do clear?

【Reachability Test】

- Can you reach the goal with only button operations?
- Are there any unnatural or impossible operations?

【Control Feel Test】

- Is button press response immediate and clear?
- Is the hold (charge) effect easy to understand?
- Is the release (explosion) feedback appropriate?

【Visual Feedback Test】
Are the visual communication specifications designed in Phase 2 implemented?

- Problem recognition (danger zone, safe zone indication)
- Action feedback (explosion effects, charge display)
- Progress display (number of saved objects)
- Failure warning (warning when approaching center)

【Specific Feedback Examples】
✅ "Understood, interesting"
🔄 "Movement is too slow" → parameter adjustment
🔄 "Explosion is too weak" → parameter adjustment
🔄 "Charge display is hard to see" → visual adjustment
❌ "Cannot reach goal" → logic review

Please provide specific feedback.
```

**Expected Responses:**

```markdown
✅ Good: "Understood, interesting. Proceed"
✅ Good: "Control feel is good, visuals are clear"
🔄 Parameter: "Movement is too slow and boring"
→ LLM: "Adjust GRAVITY_STRENGTH 0.1 → 0.15"
🔄 Parameter: "Explosion is too weak"
→ LLM: "Adjust EXPLOSION_FORCE 2 → 2.5"
🔄 Visual: "Charge circle is hard to see"
→ LLM: "color('light_cyan') → color('cyan'), line width 2→3"
❌ Logic: "Gravity is working in the wrong direction"
→ Logic fix
```

---

### Phase 4: Validation and Balance Adjustment

**Purpose:** Balance judgment and parameter feel verification

**Template (4-1: Diagnosis Result Judgment):**

```markdown
【GA Diagnosis Result Judgment Request】

Please review the GA diagnosis results:

【Diagnosis Summary】

- GA Best Score: [value]
- Monotonous Best: [value] ([pattern name])
- Normalized GA score: [value] ([percentage]%)
- Normalized monotonous score: [value] ([percentage]%)
- GA Resistance: [Low/Moderate/High] ([score] points)

【Judgment Result】
Normalized monotonous score [≤/>] 0.5: [✅/❌] [interpretation]
Normalized GA score [value]: [judgment]

【Questions】

1. Is this vulnerability level ([Low/Moderate/High]) acceptable?

   - Is a [multiplier]x score difference with skill-based play sufficient?

2. Should we perform balance adjustment?

   - Target score: What is appropriate? (recommended: 100-150)
   - Target survival time: How many seconds? (recommended: 30-60 seconds)

3. Or should we review the game design?
   - Return to Phase 2 to strengthen differentiation elements?

【Response Options】
✅ "Acceptable range, proceed to Phase 5"
🔧 "Perform balance adjustment: target score [value], survival time [value] seconds"
🔄 "Review design: [specific improvement proposal]" → Return to Phase 2
```

**Template (4-2: Post-Adjustment Verification):**

```markdown
【Post-Balance Adjustment Verification Request】

Please test the game after balance adjustment:

【Core Mechanic Understanding】

- Can you understand the unique system ([mechanic name]) operation?
- Are the mechanic interactions interesting?

【Difficulty Evaluation】

- Is the difficulty appropriate? (too easy/too difficult)
- Is the learning curve natural?

【Parameter Feel】
Verify the feel of adjusted parameters:

- Is [parameter 1] appropriate? (too fast/too slow)
- Is [parameter 2] appropriate? (too strong/too weak)
- Is [parameter 3] appropriate? (too fast/too slow)

【Risk-Reward Balance】

- Does taking risks feel worthwhile?
- Is the balance between safe and adventurous strategies appealing?

【Specific Feedback Examples】
✅ "Perfect, proceed"
🔄 "Still [parameter] is [too strong/weak/fast/slow]" → readjust
❌ "Too monotonous" → Return to Phase 2

We'll iterate adjustments until satisfied. Please provide specific feedback.
```

**Expected Responses:**

```markdown
【Diagnosis Result Judgment】
✅ Good: "Acceptable range, proceed to Phase 5"
✅ Good: "2.5x score difference is sufficient for skill-based"
🔧 Balance: "Perform balance adjustment: target score 100, survival time 45 seconds"
🔧 Balance: "High scores with HoldOnly is problematic. Please adjust"
🔄 Redesign: "Mechanic itself is monotonous. Review in Phase 2"

【Post-Adjustment Verification】
✅ Good: "Perfect, proceed"
✅ Good: "Good balance, interesting"
🔄 Parameter: "Gravity is still too strong"
→ LLM: "GRAVITY_STRENGTH 0.12 → 0.10"
🔄 Parameter: "Charge is slow"
→ LLM: "CHARGE_RATE 0.5 → 0.7"
❌ Depth: "No strategic depth, monotonous"
→ Return to Phase 2
```

---

### Phase 5: Final Validation and Completion Approval

**Purpose:** Final experience evaluation and completion judgment

**Template:**

```markdown
【Final Experience Evaluation Request】

Please provide final experience evaluation:

【Replay Motivation】

- Do you want to repeatedly play this game?
- Does it create a "one more time" feeling?
- Can you feel improvement after playing several times?

【Remaining Issues Check】

- Are there any remaining issues with balance or controls?
- Are there any visually unclear parts?
- Are game over conditions fair and clear?

【Completion Evaluation】

- Can this state be considered "complete"?
- Has it reached a level where others can enjoy it?

【Comprehensive Report Review】
Please review the presented comprehensive evaluation report:

- Overall Score: [value]/100
- Are each score reasonable?
- Are differentiation elements clear?

【Response Options】
✅ "Approved/Complete" → Record metrics, save logs
🔄 "Minor adjustment: [specific content]" → Return to Phase 4
❌ "Fundamental issue: [reason]" → Return to Phase [number] (human specifies)

Please provide final judgment.
```

**Expected Responses:**

```markdown
✅ Good: "Approved/Complete"
✅ Good: "Replay motivation present, completion sufficient"
🔄 Minor: "Minor adjustment: emphasize charge sound more"
→ LLM: "Adjust play('select') volume"
→ Re-present
🔄 Minor: "Move progress display to top"
→ LLM: "Adjust text() coordinates"
→ Re-present
❌ Major: "Too similar to existing games after all"
→ Return to Phase 2
❌ Major: "Problem-solution logic has contradictions"
→ Return to Phase 1
```

---

## Question Management Best Practices

### Level 1: Blocker Question (Implementation-Stopping Question)

**When to Use:**

- Fundamental implementation direction is unclear
- Can be clarified with Yes/No or 2-3 choices
- Implementation is impossible without this judgment

**Good Examples:**

```markdown
✅ "Confirmation: When colliding with enemies, does it immediately game over?
Or does health decrease?
(This judgment changes the game loop design)"

✅ "Confirmation: Is the safe zone a fixed position on screen?
Or does it move dynamically?
(This judgment changes the explosion timing design)"

✅ "Confirmation: Does the player control multiple objects simultaneously?
Or only one object?
(This judgment changes the state management design)"
```

**Bad Examples:**

```markdown
❌ "Please explain enemy behavior in detail"
→ Too broad. Should break into specific questions

❌ "What is this game's concept?"
→ Should already be defined in Phase 1-2

❌ "What score is good?"
→ Should be treated as Level 3 (Parameter Question)
```

**Response Pattern:**

```markdown
🤖 Question: [clear question]
🤝 Human Answer: [Yes/No/choice]
🤖 Acknowledgment: "Understood. Will proceed with design as [decision content]"
```

---

### Level 2: Assumption Clarification

**When to Use:**

- Reasonable default values exist for implementation
- Typical patterns can be inferred from tags and categories
- Implementation is possible with human approval

**Good Examples:**

```markdown
✅ "Assumption: Player warps to opposite side when reaching screen edge

Reason: Tag 'field:wrap' is selected, which is a typical implementation
pattern in Crisp Game Library.
May I proceed with this assumption?"

✅ "Assumption: Use 5 objects

Reason: In existing games with player:multiple tag (knowledge/tag_code_map.json),
3-7 objects is the standard range. Starting with mid-value of 5.
Is this assumption acceptable?"

✅ "Assumption: Explosion effect uses particle() function

Reason: Common pattern in existing implementations with weapon:explosion tag.
May I proceed with this assumption?"
```

**Bad Examples:**

```markdown
❌ "Assumption: Game will be fun"
→ Too vague. Not a specific implementation decision

❌ "Assumption: Score is 100 points"
→ Should be treated as Level 3. Parameter, not assumption

❌ "Assumption: This game has high novelty"
→ Evaluation, not decision. Should verify with similarity check
```

**Response Pattern:**

```markdown
🤖 Assumption: [specific assumption]
Reason: [rationale]
Please approve.

🤝 Human Response:
✅ "Approved" → continue implementation
🔄 "Change: [specific content]" → follow instructions
❌ "Inappropriate" → present alternatives
```

---

### Level 3: Parameter Question

**Basic Policy:**

- **Don't ask before implementing**
- Implement with standard values → present → collect feedback
- Wait for specific adjustment instructions based on human experience

**Good Flow:**

```markdown
🤖 "Implemented with MOVE_SPEED = 1.0. Please test"
🤝 "Movement is too slow"
🤖 "Will adjust MOVE_SPEED to 1.5"
[Code update]
🤖 "Adjustment complete. Please retest"
🤝 "Improved. Proceed"
```

**Bad Flow:**

```markdown
❌ 🤖 "Which is better for MOVE_SPEED: 0.5, 1.0, or 1.5?"
→ Burdens human. Should ask after implementing

❌ 🤖 "Please tell me optimal MOVE_SPEED"
→ Abstract. Implement → experience → feedback is correct

❌ 🤖 "Will implement with MOVE_SPEED = 2.0, any issues?"
→ No need for pre-confirmation. Implement and let them experience
```

**Parameter Categories:**

```markdown
【Physical Parameters】

- Speed: MOVE_SPEED, ROTATION_SPEED
- Gravity: GRAVITY_STRENGTH
- Jump: JUMP_POWER
  → Implement with default values, adjust after experience

【Timing Parameters】

- Intervals: SPAWN_INTERVAL, ATTACK_INTERVAL
- Charge: CHARGE_RATE, MAX_CHARGE_TIME
  → Implement with mid-values, adjust after experience

【Balance Parameters】

- Quantities: OBJECT_COUNT, ENEMY_COUNT
- Ranges: EXPLOSION_RADIUS, SAFE_ZONE_RADIUS
  → Implement with typical values, adjust after experience
```

---

## Communication Patterns

### Effective Feedback Solicitation

**LLM Side Best Practices:**

```markdown
【Good Request Methods】
✅ "Phase 3 implementation complete. Please verify basic functionality.
Please check especially the following points:

- Can objective be understood within 3 seconds
- Can goal be reached with button operations only
- Is operation response immediate and clear

Please provide specific feedback."

✅ "Parameter adjustment complete. Please retest.
Regarding previous feedback (movement too slow), changed MOVE_SPEED 1.0→1.5.
Please confirm improvement."

【Bad Request Methods】
❌ "How is it?"
→ Unclear what to evaluate

❌ "Perfect, right?"
→ Leading. Hinders objective evaluation

❌ "I think there's no problem, but please check anyway"
→ Passive. Doesn't encourage serious evaluation
```

### Interpreting Human Feedback

**Feedback Interpretation Patterns:**

```markdown
【Clear Feedback】
✅ "Movement is too slow"
→ Increase MOVE_SPEED (e.g., 1.0 → 1.5)

✅ "Explosion is too weak"
→ Increase EXPLOSION_FORCE (e.g., 2 → 2.5)

✅ "Charge is too fast"
→ Decrease CHARGE_RATE (e.g., 1.0 → 0.7)

【Ambiguous Feedback】
⚠️ "Something's off"
→ 🤖 Clarification question: "Is it speed/timing/difficulty?"

⚠️ "Not quite right"
→ 🤖 Clarification question: "At what point do you feel issues: first 10 seconds/mid-game/end-game?"

⚠️ "Not fun"
→ 🤖 Clarification question: "Is the mechanic monotonous, or is it a difficulty issue?"

【Gradual Narrowing】
🤖 "First, is control feel okay? (Yes/No)"
🤝 "Yes"
🤖 "Is difficulty appropriate? (Yes/No)"
🤝 "No, too difficult"
🤖 "Understood. Will reduce difficulty"
```

**Determining Adjustment Direction:**

```markdown
【Typical Feedback → Adjustment Mapping】

"Too fast" → Reduce parameter to 70-80%
"Too slow" → Increase parameter to 120-150%
"Too strong" → Reduce parameter to 70-80%
"Too weak" → Increase parameter to 120-150%

"A bit fast" → Reduce parameter to 85-90%
"A bit slow" → Increase parameter to 110-120%

"Very fast" → Reduce parameter to 50-60%
"Very slow" → Increase parameter to 150-200%

【Adjustment Range Principles】

- First adjustment: ±20-50% (bold)
- Second adjustment: ±10-20% (moderate)
- Third+ adjustment: ±5-10% (fine-tuning)
```

---

## Best Practices

### For LLM Agents

**DO (Recommended Actions):**

```markdown
✅ Strictly adhere to completion criteria for each phase

- Don't proceed until obtaining clear human approval

✅ Immediately detect and resolve ambiguities

- Level 1 Blocker: Stop implementation and ask
- Level 2 Assumption: State assumption and wait for approval
- Level 3 Parameter: Implement first, then let them experience

✅ Request feedback specifically

- State evaluation points
- Present specific answer examples

✅ Keep adjustment cycles short

- Change only one parameter per adjustment
- Rapid iteration of: adjust → test → feedback

✅ Visualize progress

- Clearly mark start/completion of each phase
- Record adjustment history
```

**DON'T (Actions to Avoid):**

```markdown
❌ Present multiple options and make humans choose

- "Which is better: Plan A or Plan B?"
- → Correct: single implementation → feedback → adjustment

❌ Implement after making assumptions, then report

- "Implemented based on this judgment"
- → State assumptions beforehand and get approval

❌ Accept ambiguous feedback as-is

- "Something's off" → adjust without clarification questions
- → Gradually narrow down

❌ Proceed to next phase without meeting completion criteria

- "Seems about right, so on to Phase 4"
- → Wait for clear human approval

❌ Change multiple parameters at once

- Adjust MOVE_SPEED, JUMP_POWER, GRAVITY simultaneously
- → Unclear which change was effective
```

---

### For Human Operators

**DO (Recommended Actions):**

```markdown
✅ Provide specific feedback

- Good: "Movement is too slow"
- Bad: "Something's off"

✅ Focus on evaluation points for each phase

- Phase 0: Tag appeal
- Phase 1: Logic feasibility
- Phase 2: Creativity and differentiation
- Phase 3: Basic functionality
- Phase 4: Balance
- Phase 5: Completion

✅ Point out problems early

- If logical contradictions found in Phase 1, point out immediately
- Don't drag to Phase 5

✅ Clear approval/rejection

- Good: "Approved, proceed"
- Good: "Rejected, [reason]"
- Bad: "Well, I guess it's okay"
```

**DON'T (Actions to Avoid):**

```markdown
❌ Ambiguous feedback

- "Something's off", "Not quite right", "So-so"
- → LLM spends time on narrowing questions

❌ Point out multiple problems simultaneously

- "Speed, timing, and difficulty are all problems"
- → Adjust one at a time in order

❌ Postpone problems

- Approve despite feeling off in Phase 1
- → Major rework occurs in Phase 4

❌ Rejection without reason

- Just "No"
- → LLM cannot determine improvement direction
```

---

## Troubleshooting Common Issues

### Issue 1: Prolonged Feedback Cycles

**Symptom:** 10+ adjustment iterations in the same phase

**Cause Analysis:**

```markdown
1. Parameter adjustment range too small
   → 5% adjustments each time slow convergence

2. Human feedback is ambiguous
   → "Something's off" doesn't indicate direction

3. Simultaneous adjustment of multiple parameters
   → Unclear which change was effective
```

**Solution:**

```markdown
🤖 LLM Side:

- First adjustment should be bold (±30-50%)
- Actively use clarification questions
- Show adjustment history to display trends

🤝 Human Side:

- Point out specific issues
- Relative evaluation: "better/worse than before"
- Approve immediately when satisfied
```

---

### Issue 2: Frequent Rework

**Symptom:** Major rework like Phase 4→Phase 1, Phase 5→Phase 2

**Cause Analysis:**

```markdown
1. Insufficient validation in early phases
   → Missed logical contradictions in Phase 1

2. Loose application of completion criteria
   → Proceeded with "about OK"

3. Overlooked warning signs
   → Ignored Red Flags
```

**Solution:**

```markdown
🤖 LLM Side:

- Strictly apply completion criteria
- Don't overlook warning signs
- Emphasize "final confirmation before implementation" at Phase 2 completion

🤝 Human Side:

- Strict evaluation in Phase 1/2
- Point out immediately if something feels off
- Be careful with "approval"
```

---

### Issue 3: Repeated Rejections in Similarity Check

**Symptom:** 70%+ similarity for 3+ consecutive times in Phase 3

**Cause Analysis:**

```markdown
1. Insufficient differentiation in Phase 2
   → Exclusion filtering is weak

2. Tag selection issues
   → Same tag combination as existing games

3. Only superficial changes
   → Changed victory condition but same control method
```

**Solution:**

```markdown
🤖 LLM Side:

- Strengthen exclusion filtering in Phase 2
- Multi-level differentiation (victory condition + control + visual)
- Propose returning to Phase 0 after 3 rejections

🤝 Human Side:

- Suggest creative breakthroughs in Phase 2
- Ideas for "interesting uses not in existing games"
- Judgment on tag reselection
```

---

## Templates Summary

| Phase | Template Name                       | Purpose                        | Key Questions                                    |
| ----- | ----------------------------------- | ------------------------------ | ------------------------------------------------ |
| 0     | Tag Selection Feedback              | Tag feasibility validation     | Appealing? Balanced? Expected problem?           |
| 1     | Problem-Solution Logic Validation   | Logic validation               | Clear? Intuitive? Any contradictions?            |
| 2     | Creativity & Implementability Check | Differentiation, feasibility   | Fresh? Differentiated? Any impossibilities?      |
| 3     | Basic Functionality Verification    | Basic operation, control feel  | Understandable? Reachable? Response?             |
| 4-1   | GA Diagnosis Result Judgment        | Balance judgment               | Acceptable range? Adjust?                        |
| 4-2   | Post-Adjustment Verification        | Parameter feel                 | Understandable? Difficulty? Feel?                |
| 5     | Final Experience Evaluation         | Completion judgment            | Want to replay? Complete?                        |
