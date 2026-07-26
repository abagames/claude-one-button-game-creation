# Artifact Contracts

## `game.manifest.json`

Normative schema: [`schemas/game-manifest.v1.schema.json`](schemas/game-manifest.v1.schema.json)

```json
{
  "schema_version": 1,
  "game_id": "stable-anonymous-id",
  "source": {
    "path": "original/main.js",
    "sha256": "64 lowercase hex characters",
    "repository": null,
    "commit": null
  },
  "instrumented_source": {
    "path": "instrumented/main.js",
    "sha256": "64 lowercase hex characters",
    "repository": null,
    "commit": null
  },
  "pair_id": null,
  "runtime": {
    "name": "crisp-game-lib",
    "version": "pinned version",
    "bundle_sha256": "64 lowercase hex characters"
  },
  "input_styles": ["hold", "release"],
  "execution_environment": "fresh_node_vm",
  "observation_channels": ["runtime_result", "private_drawing_annotation"],
  "trust_class": "simulator_only_unverified"
}
```

## `annotation-plan.private.json`

Normative schema: [`schemas/annotation-plan.private.v1.schema.json`](schemas/annotation-plan.private.v1.schema.json)

```json
{
  "schema_version": 1,
  "original_source_sha256": "64 lowercase hex characters",
  "instrumented_source_sha256": "64 lowercase hex characters",
  "scopes": [
    {
      "scope_id": "scope-001",
      "private_role": "controllable_subject",
      "identity_kind": "object_reference",
      "drawing_calls": ["box"],
      "collision_return_preserved": true,
      "confidence": "confirmed"
    }
  ],
  "unresolved_geometry": [],
  "nested_scopes": false,
  "non_annotation_diff_count": 0
}
```

Store `private_role` and subject identity only in private artifacts; do not output them to the evaluation
report.

## Episode result

The shared runtime result retains the following.

- Game ID
- Source/runtime/input hashes
- Gameplay/episode random seed
- Runtime-observed logical view size (`view_size`), or `null` when the episode failed before initialization
- Executed logical ticks
- Final score
- Terminal kind
- Input history
- Private annotation hash or reference to the private sink
- Diagnostics

Follow [RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md) for result fields and execution order. Do not add undefined
observation channels, and do not generate placeholder fields for values not acquired.

## Play-log analysis artifacts

Evidence results of new criterion-specific counterfactual evaluations follow
[`schemas/play-log-analysis-result.v2.schema.json`](schemas/play-log-analysis-result.v2.schema.json).
Keep the v1 schema for reproducing existing v1 artifacts.
Raw replays, frames, derived events, and counterfactuals are private artifacts. This result is play-log
evidence referenced by the 4 criteria, not a standalone cross-game score or aggregate quality evaluation.

Counterfactual branches are executed under the frozen tick budget with the edited input prefix forced and the
frozen private policy continuing afterwards. `terminal_avoided` therefore means "no terminal within the frozen
tick budget", never "the replayed input sequence ended". This section is the normative definition of the
counterfactual branch execution window.

`replay_gate.mode` is normally `exact_result_v1` with `annotation_migration: false`. Only when migrating
annotation-only instrumentation onto existing episodes, `mechanics_projection_v1` with
`annotation_migration: true` is allowed, and the excluded fields and reasons must be preserved.
This section is the normative definition of this replay gate rule.

The normative definition of the role-tagged object identity mechanism (`beginDrawing({type, object})`, WeakMap,
episode-local `episodeRef`, property non-retention) is the Annotation sink section of
[RUNTIME_CONTRACT.md](RUNTIME_CONTRACT.md). Identity coverage is the number of reward records with identity /
the total number of reward records.
`unique_reward_objects_observed` does not mean causal scoring opportunities. Unless the score-to-object
correspondence is unique, causal attribution metrics are `unresolved`. This section is the normative definition
of this distinction between observed object counts and causal attribution.

## Play-log quality result

Normative plan schema for new evaluations:
[`schemas/play-log-quality-plan.private.v2.schema.json`](schemas/play-log-quality-plan.private.v2.schema.json)
Keep the v1 schema for reading and verifying existing v1 artifacts, but the shared executor does not run v1.

Fix the following before accessing results: development/analysis seeds, diagnostic controls, selection rules,
replay gate, role mapping, judgment rules for the 4 criteria, criterion-specific counterfactual sources,
anchors, lookbacks, bounded operations, minimum eligible cases, minimum terminal delay, tick budget, and claim
limits. Select the failure source from terminal private episodes with a score-independent fixed rule.
Do not require legacy `preregistration` or held-out aggregate artifacts.

For new Stage 8–13 executions, only `runtime/play-log-quality-evaluator.mjs` generates formal results. Batch
configurations list only adapters, policies, policy parameters, required annotation coverage, and plan paths;
they do not override the execution or classification of criterion plans.

Normative schema:
[`schemas/play-log-quality-result.v1.schema.json`](schemas/play-log-quality-result.v1.schema.json)

This is the only formal quality result for each game in the new workflow. It always holds exactly one entry for
each of the 4 criteria. This section is the normative definition of the formal criterion set and ordinal
mapping (other documents refer to this section).

- `causal_input_control`
- `risk_reward_coupling`
- `failure_agency`
- `outcome_coherence`

The status-to-ordinal mapping is fixed as `confirmed=2`, `mixed=1`, `contradicted=0`, `unresolved=null`, and
`not_applicable=null`. confirmed/mixed/contradicted require `evidence_ids` pointing to formal derived events,
comparisons, and counterfactuals. Monotonic input, control scores, and private-policy advantage are not
criteria.

`contradicted` is a positive finding and requires counter-evidence; anything that could not be measured is
`unresolved`. In particular, no local reward variation among eligible counterfactual cases makes
`risk_reward_coupling` unresolved, and a terminal that cannot be mapped to annotated roles makes
`outcome_coherence` unresolved. Because the two observation channels cannot separate "the annotation is
missing" from "the world contradicts the outcome", `outcome_coherence` reaches `contradicted` only for a
terminal episode without a game-over annotation frame, or for score events that never coincide with observed
reward objects; in practice this criterion resolves to confirmed, mixed, or unresolved.

`instrument_confidence` is derived by the shared executor from eligible counterfactual cases, reward identity
coverage, and resolved criteria. It is never asserted as a constant, so the ranking gate on
`instrument_confidence !== "sufficient"` is effective.

`not_rankable_reasons` is optional but required in practice for `not_rankable` results: it lists why each
criterion stayed null (for example `risk_reward_coupling:no_local_reward_variation`). A `completed` result
must not carry it.

Contact between annotated geometry is edge-to-edge and boundary inclusive: exact touching is contact. Games
whose collision uses a radius or an inflated box kill the player at a distance the drawn boxes never strictly
overlap, so a strict-overlap test would report their terminals as unmapped. `contact_tolerance` extends this
for a margin that exists in the source but not in the drawing, and is frozen with the rest of the plan. The
same rule decides reward attribution by contact, which is what makes continuous scoring — drilling, riding,
holding a zone — attributable at all; transition-based attribution alone only sees pickups.

`execution.retry_count` is reserved: the shared executor does not retry episodes, and a technical termination
stops the game. Freeze it at 0 until retries are implemented.

`criterion_rules` in the plan is descriptive preregistration text. The normative classifier is
`runtime/play-log-quality-evaluator.mjs`; keep the frozen text in agreement with it, and treat any
disagreement as a documentation defect rather than as a competing rule.

`completed` requires instrument confidence sufficient and non-null ordinal values for all 4 entries. Missing
data, insufficient instrumentation, and technical failures are ranking-stop states, not low scores.

## Play-log ranking contract and result

Normative schemas:

- [`schemas/play-log-ranking-contract.v1.schema.json`](schemas/play-log-ranking-contract.v1.schema.json)
- [`schemas/play-log-ranking-result.v1.schema.json`](schemas/play-log-ranking-result.v1.schema.json)
- [`schemas/play-log-ranking-hashes.v1.schema.json`](schemas/play-log-ranking-hashes.v1.schema.json)

Fix the contract before accessing quality results, and list two or more game IDs and quality result paths.
This section is the normative definition of the ranking ordinal values, weights, tie-breaks, and missing-data
rules (other documents refer to this section).
The weights are causal input=4, risk–reward=3, failure agency=2, outcome coherence=1, with a maximum total of
20. After sorting by total descending, tie-break by causal input, risk–reward, then failure agency; if still
identical, assign a shared rank.
`tie_threshold` is fixed at 0.

Null required criteria, `not_applicable`, insufficient instrumentation, and technical failures are
`not_rankable`; do not convert them to zero points or last place. Use the following for the ranker and
renderer.

```bash
npm run validate:artifact -- play_log_ranking_contract batches/<ranking-id>/play-log-ranking-contract.json
npm run rank:play-logs -- batches/<ranking-id>/play-log-ranking-contract.json batches/<ranking-id>
npm run verify:play-log-ranking-hashes -- batches/<ranking-id>/play-log-ranking-hashes.json
```
