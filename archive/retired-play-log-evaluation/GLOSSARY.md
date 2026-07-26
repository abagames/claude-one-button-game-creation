# Glossary

- **annotation-only copy**: A copy of the original game with only `beginDrawing(subject)` / `endDrawing()`
  scopes added. Game logic, drawing/collision order, arguments, return values, and random call order are
  unchanged.
- **private drawing annotation**: HitBoxes and episode-local subject identities generated inside annotation
  scopes. Private instrumentation that may carry design meaning.
- **private policy**: A game-specific closed-loop policy that reacts to private annotations from a versioned
  allowlist.
- **policy qualification**: A gate that uses only development seeds to check mechanic reachability, technical
  health, and exact replay.
- **exact replay**: The hash of the result projection fixed in the quality plan matches when replaying from the
  same source/runtime/input/seed.
- **development seed**: A gameplay seed used only for developing the private policy and analysis settings;
  never used for formal quality judgment.
- **analysis seed**: A gameplay seed for quality evaluation that is not used in development and is opened only
  after the play-log quality plan is frozen.
- **diagnostic control**: Input sequences such as idle, hold, periodic, and seeded random. Used to check the
  instrument and causal hypotheses, but their scores or monotonicity are never used as quality points.
- **counterfactual branch**: An episode replayed from a source episode with one bounded input edit forced,
  then continued by the frozen private policy to the frozen tick budget. Because it is not truncated at the
  source terminal, a delayed or avoided terminal is a real observation rather than a replay artifact.
- **terminal signature**: How a terminal episode's last annotated frame explains its own death — hazard
  contact, contact with the runtime-observed view boundary, or `unmapped`. `unmapped` is an instrument limit
  and yields `unresolved`, never 0.
- **technical failure**: A technical failure of runtime, schema, timeout, replay, annotation scope, etc.
  Not a game-quality finding.
- **not_rankable**: A state where a mandatory axis or comparability is insufficient and no tier or rank is
  produced.
- **simulator_only_unverified**: A trust class that permits only mechanical evidence inside the tested Node VM.
  It makes no claims about the distribution runtime, presentation, perception, or human experience.
