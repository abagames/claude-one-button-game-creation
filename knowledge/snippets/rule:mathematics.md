# rule:mathematics

| Primary Role | Scoring or progression based on mathematical operations |
| --- | --- |
| Reference Games | `dango` - reference/games/dango.js:57-71, `number_ball` - reference/games/number_ball.js:58-75, `number_line` - reference/games/number_line.js:80-95 |
| LLM Status | draft |

## Snippet
```js
  if (stickTicks > 19) {
    stickTicks = 0;
    if (expStr.startsWith("+")) {
      expStr = expStr.substring(1);
    } else if (expStr.startsWith("*")) {
      expStr = `0${expStr}`;
    }
    expAdd = expStr.length === 0 ? 0 : Function(`return ${expStr};`)();
    addScore(expAdd);
    const sl = stickLeft;
    stickLeft = clamp(stickLeft + floor(expAdd / 100), -1, 9);
    stickAdd = stickLeft - sl;
    if (stickAdd > 0) {
      play("powerUp");
    } else if (expAdd > 0) {
      play("coin");
    }
  }
```

## Dependencies
- Global: `expStr` - accumulated mathematical expression string (e.g., `"3+5*2"`)
- Global: `expAdd`, `stickLeft`, `stickAdd` - computed result, resource counter, delta
- API: `Function`, `addScore`, `play`, `clamp`, `floor` - dynamic evaluation and game helpers

## Integration Notes
- Expression building: accumulate operators and operands into `expStr` during gameplay (see dango.js:105-120 for digit/operator collection).
- Sanitization: remove leading `+` (`substring(1)`), prepend `0` to leading `*` to prevent syntax errors.
- Dynamic evaluation: `Function('return ${expStr};')()` executes JavaScript expression; **security**: only use with game-controlled strings, never user input.
- Scoring: computed result (`expAdd`) awards score and may restore resources (`stickLeft += floor(expAdd / 100)`).
- Audio feedback: `powerUp` for resource gain, `coin` for successful calculation.
- Compatible with `rule:match` (combine matching with arithmetic), `rule:combo_multiplier` (multiply expression results).
- Alternative: manual parsing (`split('+')`, `eval` alternatives) for safer evaluation or custom operators.
- Balance: tune resource conversion rate (`floor(expAdd / 100)`) and expression complexity for difficulty.

## Validation
- 2025-10-05 - Manual extraction from `reference/games/dango.js:55-72` - code compiles, references verified
