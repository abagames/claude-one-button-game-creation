import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCounterfactualInput,
  classifyFailureAgencyCases,
  compareCounterfactualRun,
  derivePlayLogEvents,
  isInContact,
  mechanicalResultProjection,
  resolveCounterfactualOperations,
  selectCounterfactualSource,
  selectCounterfactualSources,
} from "../runtime/index.mjs";

test("group annotations are also included in non-operated-target divergence", () => {
  const sourceSteps = [step(0, 0, false, false, "inGame", 10), step(1, 0, false, false, "inGame", 10)];
  const branchSteps = [step(0, 0, false, false, "inGame", 10), step(1, 0, false, false, "inGame", 20)];
  const result = {
    final_score: 0,
    executed_ticks: 2,
    termination: { kind: "tick_budget", logical_tick: 1 },
  };
  const compared = compareCounterfactualRun(
    { result, private_steps: sourceSteps },
    { result, private_steps: branchSteps },
    {
      criterionId: "causal_input_control",
      criterionPlan: { anchor_event: "reward_event", lookback_ticks: 1, local_window_ticks: 1 },
      operation: { kind: "remove_press" },
      anchorTick: 2,
      editTick: 1,
      controllableRoles: ["player"],
    },
  );
  assert.equal(compared.pre_edit_equivalent, true);
  assert.equal(compared.first_noncontrollable_divergence_tick, 1);
});

test("counterfactual modifies only one press run and preserves duration", () => {
  const input = sequence([true, true, false, false, true, false]);
  const removed = buildCounterfactualInput(input, { kind: "remove_press", press_ordinal: 0 });
  const shifted = buildCounterfactualInput(input, { kind: "shift_press_plus_one", press_ordinal: 1 });
  assert.equal(removed.duration_ticks, input.duration_ticks);
  assert.deepEqual(removed.transitions, [{ tick: 0, pressed: false }, { tick: 4, pressed: true }, { tick: 5, pressed: false }]);
  assert.deepEqual(shifted.transitions, [{ tick: 0, pressed: true }, { tick: 2, pressed: false }, { tick: 5, pressed: true }]);
});

test("press window insertion for a terminal anchor modifies only the release interval", () => {
  const input = sequence([false, false, false, true, false]);
  const inserted = buildCounterfactualInput(input, {
    kind: "insert_press_window",
    start_tick: 1,
    pressed_ticks: 1,
  });
  assert.deepEqual(inserted.transitions, [
    { tick: 0, pressed: false },
    { tick: 1, pressed: true },
    { tick: 2, pressed: false },
    { tick: 3, pressed: true },
    { tick: 4, pressed: false },
  ]);
  assert.throws(() => buildCounterfactualInput(input, {
    kind: "insert_press_window",
    start_tick: 3,
    pressed_ticks: 1,
  }), /released source window/);
});

test("counterfactual resolver keeps the post-shift edit tick within the anchor lookback", () => {
  const source = episode("best-private", 10, "tick_budget");
  source.input_sequence = sequence([
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false,
    true, true, true, true, false,
  ]);
  source.result.executed_ticks = 79;
  source.private_steps = Array.from({ length: 79 }, (_, tick) => ({
    logicalTick: tick,
    score: tick >= 78 ? 1 : 0,
  }));
  const plan = {
    source_selection_rule: "best_private",
    anchor_event: "reward_event",
    lookback_ticks: 60,
    local_window_ticks: 60,
    operations: ["remove_press", "shift_press_minus_one", "shift_press_plus_one"],
    max_cases: 3,
    minimum_eligible_cases: 2,
  };
  const operations = resolveCounterfactualOperations(source, plan);
  assert.ok(operations.length >= 1);
  assert.ok(operations.every((item) =>
    item.edit_tick >= item.anchor_tick - plan.lookback_ticks
    && item.edit_tick < item.anchor_tick));
});

test("counterfactual resolver does not use the uneditable tick 0 score as a reward anchor", () => {
  const source = episode("best-private", 10, "tick_budget");
  source.input_sequence = sequence([
    false, true, false, false, true, false, false, true, false, false,
    true, false, false, false, false, false, false, false, false, false,
    false, false, false, false,
  ]);
  source.result.executed_ticks = 24;
  source.private_steps = Array.from({ length: 24 }, (_, tick) => ({
    logicalTick: tick,
    score: tick === 0 ? 1 : tick >= 22 ? 2 : 1,
  }));
  const operations = resolveCounterfactualOperations(source, {
    source_selection_rule: "best_private",
    anchor_event: "reward_event",
    lookback_ticks: 20,
    local_window_ticks: 20,
    operations: ["remove_press", "shift_press_minus_one", "shift_press_plus_one"],
    max_cases: 3,
    minimum_eligible_cases: 2,
  });
  assert.ok(operations.length >= 2);
  assert.ok(operations.every((item) => item.anchor_tick === 22));
});

test("failure source is selected by terminal private seed order, not by score", () => {
  const selected = selectCounterfactualSource([
    episode("best-private", 1, "tick_budget"),
    episode("candidate-b", 20, "game_over"),
    episode("candidate-a", 10, "game_over"),
  ], { source_selection_rule: "first_terminal_private_by_gameplay_seed" });
  assert.equal(selected.selection_id, "failure-source-private");
  assert.equal(selected.result.gameplay_seed, 10);
});

test("terminal plan generates bounded operations and aggregates the failure ladder", () => {
  const source = episode("failure-source-private", 10, "game_over");
  source.input_sequence = sequence([false, true, false, false, true, false, false, false]);
  source.result.executed_ticks = 8;
  source.result.termination.logical_tick = 7;
  const plan = {
    source_selection_rule: "first_terminal_private_by_gameplay_seed",
    anchor_event: "terminal_event",
    lookback_ticks: 6,
    local_window_ticks: 6,
    operations: ["remove_press", "shift_press_minus_one", "shift_press_plus_one", "insert_press_window"],
    max_cases: 4,
    minimum_eligible_cases: 2,
    minimum_delay_ticks: 2,
  };
  const operations = resolveCounterfactualOperations(source, plan);
  assert.ok(operations.length >= 2);
  const classified = classifyFailureAgencyCases([
    failureCase({ terminal_delay_ticks: 3 }),
    failureCase({ terminal_avoided: true, counterfactual_terminal: { kind: "tick_budget", tick: 7 } }),
  ], plan);
  assert.equal(classified.status, "confirmed");
  const negative = classifyFailureAgencyCases([
    failureCase({ terminal_delay_ticks: -2 }),
    failureCase({ terminal_delay_ticks: 0 }),
  ], plan);
  assert.equal(negative.status, "contradicted");
});

test("derived events record input, score, terminal, and geometry", () => {
  const plan = {
    game_id: "fixture",
    role_mapping: { controllable: ["player"], hazards: ["hazard"], rewards: [] },
    risk_measurement: { hazard_exposure_clearance_threshold: 3 },
  };
  const derived = derivePlayLogEvents([
    step(0, 0, true, false, "inGame", 10),
    step(1, 5, false, true, "gameOver", 4),
  ], plan);
  assert.equal(derived.final_score, 5);
  assert.equal(derived.minimum_hazard_clearance, 2);
  assert.equal(derived.hazard_exposure_ticks, 1);
  assert.equal(derived.events.some((event) => event.event === "terminal"), true);
});

test("mechanical indicator displacement is recorded as risk exposure", () => {
  const plan = {
    game_id: "indicator-fixture",
    role_mapping: { controllable: ["player"], hazards: [], rewards: [] },
    risk_measurement: {
      hazard_exposure_clearance_threshold: null,
      mode: "indicator_displacement",
      indicator_role: "tilt-meter",
      indicator_axis: "x",
      indicator_neutral: 50,
      indicator_exposure_threshold: 15,
    },
  };
  const steps = [50, 66].map((indicatorX, logicalTick) => ({
    logicalTick,
    score: 0,
    phase: "inGame",
    input: { pressed: false, justPressed: false, justReleased: false },
    privateDrawing: {
      diagnostics: [],
      records: [{
        subject: { kind: "group", label: "tilt-meter" },
        pos: { x: indicatorX - 1, y: 5 },
        size: { x: 2, y: 3 },
      }],
    },
  }));
  const derived = derivePlayLogEvents(steps, plan);
  assert.equal(derived.hazard_exposure_ticks, 1);
  assert.deepEqual(
    derived.events.filter((event) => event.event === "indicator_displacement").map((event) => event.value),
    [0, 16],
  );
});

test("reward identity distinguishes observed object counts from causal attribution", () => {
  const plan = {
    game_id: "fixture",
    role_mapping: { controllable: [], hazards: [], rewards: ["target"] },
    risk_measurement: { hazard_exposure_clearance_threshold: null },
  };
  const derived = derivePlayLogEvents([
    typedStep(0, 2, [10, 11]),
    typedStep(1, 5, [10]),
  ], plan);
  assert.equal(derived.identity_tracking_status, "available");
  assert.equal(derived.unique_reward_objects_observed, 2);
  assert.equal(derived.unique_scoring_objects_attributed, null);
});

test("mechanical replay projection excludes annotation provenance and preserves outcome", () => {
  const left = projectedResult("old-source", "old-step", 5);
  const right = projectedResult("new-source", "new-step", 5);
  assert.deepEqual(mechanicalResultProjection(left), mechanicalResultProjection(right));
  right.final_score = 6;
  assert.notDeepEqual(mechanicalResultProjection(left), mechanicalResultProjection(right));
});

function sequence(states) {
  const transitions = [];
  let previous = false;
  for (let tick = 0; tick < states.length; tick++) {
    if (tick === 0 || states[tick] !== previous) transitions.push({ tick, pressed: states[tick] });
    previous = states[tick];
  }
  return { schema_version: 1, duration_ticks: states.length, transitions };
}

function step(tick, score, justPressed, justReleased, phase, hazardX) {
  return {
    logicalTick: tick,
    score,
    phase,
    input: { pressed: justPressed && !justReleased, justPressed, justReleased },
    privateDrawing: {
      diagnostics: [],
      records: [
        { subject: { kind: "group", label: "player" }, pos: { x: 0, y: 0 }, size: { x: 2, y: 2 } },
        { subject: { kind: "group", label: "hazard" }, pos: { x: hazardX, y: 0 }, size: { x: 2, y: 2 } },
      ],
    },
  };
}

function typedStep(tick, score, episodeRefs) {
  return {
    logicalTick: tick,
    score,
    phase: "inGame",
    input: { pressed: false, justPressed: false, justReleased: false },
    privateDrawing: {
      diagnostics: [],
      records: episodeRefs.map((episodeRef, index) => ({
        subject: { kind: "object", type: "target", episodeRef },
        pos: { x: 10 + index * 10, y: 10 },
        size: { x: 2, y: 2 },
      })),
    },
  };
}

function projectedResult(sourceHash, privateStepHash, score) {
  return {
    game_id: "fixture",
    source_hash: sourceHash,
    runtime_bundle_sha256: sourceHash,
    gameplay_seed: 42,
    input_sequence_sha256: "input",
    episode_random_seed: 99,
    executed_ticks: 1,
    final_score: score,
    termination: { kind: "tick_budget", logical_tick: 0, message: null },
    frames: [{
      logical_tick: 0,
      input: { pressed: false, just_pressed: false, just_released: false },
      phase: "inGame",
      private_step_sha256: privateStepHash,
      canvas_sha256: null,
    }],
    diagnostics: [],
  };
}

function episode(selectionId, seed, terminationKind) {
  return {
    selection_id: selectionId,
    policy_role: "private_policy",
    input_sequence: sequence([false, true, false, false]),
    private_steps: [],
    result: {
      gameplay_seed: seed,
      executed_ticks: 4,
      final_score: seed,
      termination: { kind: terminationKind, logical_tick: 3, message: null },
    },
  };
}

function failureCase(overrides = {}) {
  return {
    eligible: true,
    first_noncontrollable_divergence_tick: 5,
    terminal_avoided: false,
    terminal_delay_ticks: 1,
    counterfactual_terminal: { kind: "game_over", tick: 8 },
    ...overrides,
  };
}

test("release timing edits move only the press boundary", () => {
  const input = sequence([false, true, true, true, true, false, false]);
  const truncated = buildCounterfactualInput(input, {
    kind: "truncate_press_by_k",
    start_tick: 3,
    ticks: 2,
  });
  const extended = buildCounterfactualInput(input, {
    kind: "extend_press_by_k",
    start_tick: 5,
    ticks: 2,
  });

  assert.equal(truncated.duration_ticks, input.duration_ticks);
  assert.deepEqual(truncated.transitions, [
    { tick: 0, pressed: false },
    { tick: 1, pressed: true },
    { tick: 3, pressed: false },
  ]);
  assert.equal(extended.duration_ticks, input.duration_ticks);
  assert.deepEqual(extended.transitions, [
    { tick: 0, pressed: false },
    { tick: 1, pressed: true },
  ]);
  // A window that is not uniformly pressed (or released) must fail closed rather than silently reshaping
  // more of the sequence than the operation claims.
  assert.throws(() => buildCounterfactualInput(input, {
    kind: "truncate_press_by_k",
    start_tick: 4,
    ticks: 3,
  }), /uniform source window/);
});

test("release timing edits are resolved inside the anchor lookback for a hold-dominant episode", () => {
  const states = Array.from({ length: 60 }, (_, tick) => tick >= 10 && tick < 50);
  const source = {
    input_sequence: sequence(states),
    result: { executed_ticks: 60, final_score: 5, termination: { kind: "game_over", logical_tick: 59 } },
    private_steps: Array.from({ length: 60 }, (_, tick) => typedStep(tick, tick >= 40 ? 1 : 0, [1])),
  };
  const operations = resolveCounterfactualOperations(source, {
    anchor_event: "reward_event",
    lookback_ticks: 20,
    local_window_ticks: 10,
    operations: ["truncate_press_by_k", "remove_press"],
    press_edit_ticks: 5,
    max_cases: 4,
    minimum_eligible_cases: 1,
  });

  const truncate = operations.find((item) => item.operation.kind === "truncate_press_by_k");
  assert.ok(truncate != null, "a hold-dominant episode must still yield a release-timing edit");
  assert.equal(truncate.anchor_tick, 40);
  assert.equal(truncate.edit_tick, 35);
  // The whole-run deletion is the blunt instrument this operation exists to complement: it edits 30 ticks
  // earlier, outside the frozen lookback, and is dropped.
  assert.equal(operations.some((item) => item.operation.kind === "remove_press"), false);
});

test("a hazard that is inert while sheltered or released contributes no exposure", () => {
  const plan = {
    game_id: "fixture-game",
    role_mapping: { controllable: ["player"], hazards: ["hazard"], rewards: [] },
    risk_measurement: {
      mode: "hazard_clearance",
      hazard_exposure_clearance_threshold: 4,
      hazard_active_when: "input_released",
      hazard_suppressed_while_overlapping: ["shelter"],
    },
    contact_tolerance: 0,
  };
  const build = (pressed, sheltered) => ({
    logicalTick: 0,
    score: 0,
    phase: "inGame",
    input: { pressed, justPressed: false, justReleased: false },
    privateDrawing: {
      diagnostics: [],
      records: [
        { subject: { kind: "group", label: "player" }, pos: { x: 10, y: 10 }, size: { x: 2, y: 2 } },
        { subject: { kind: "group", label: "hazard" }, pos: { x: 11, y: 10 }, size: { x: 2, y: 2 } },
        ...(sheltered
          ? [{ subject: { kind: "group", label: "shelter" }, pos: { x: 10, y: 10 }, size: { x: 4, y: 4 } }]
          : []),
      ],
    },
  });

  assert.equal(derivePlayLogEvents([build(false, false)], plan).hazard_exposure_ticks, 1);
  assert.equal(derivePlayLogEvents([build(true, false)], plan).hazard_exposure_ticks, 0);
  assert.equal(derivePlayLogEvents([build(false, true)], plan).hazard_exposure_ticks, 0);
  assert.equal(
    derivePlayLogEvents([build(true, false)], plan).events.some((event) => event.event === "hazard_clearance"),
    false,
  );
});

test("contact counts touching geometry and the frozen tolerance", () => {
  const player = { pos: { x: 0, y: 0 }, size: { x: 4, y: 4 } };
  const touching = { pos: { x: 4, y: 0 }, size: { x: 4, y: 4 } };
  const near = { pos: { x: 6, y: 0 }, size: { x: 4, y: 4 } };
  assert.equal(isInContact(player, touching), true);
  assert.equal(isInContact(player, near), false);
  assert.equal(isInContact(player, near, 2), true);
});

test("hazard conditions are per role, so one game can mix hazard kinds", () => {
  const plan = {
    game_id: "fixture-game",
    role_mapping: { controllable: ["player"], hazards: ["rock", "enemy", "sea"], rewards: [] },
    risk_measurement: {
      mode: "hazard_clearance",
      hazard_exposure_clearance_threshold: 4,
      hazard_conditions: {
        rock: { active_when: "input_released" },
        enemy: { suppressed_while_overlapping: ["rock"] },
      },
    },
    contact_tolerance: 0,
  };
  const build = (pressed) => ({
    logicalTick: 0,
    score: 0,
    phase: "inGame",
    input: { pressed, justPressed: false, justReleased: false },
    privateDrawing: {
      diagnostics: [],
      records: [
        { subject: { kind: "group", label: "player" }, pos: { x: 10, y: 10 }, size: { x: 4, y: 4 } },
        { subject: { kind: "group", label: "rock" }, pos: { x: 9, y: 9 }, size: { x: 6, y: 6 } },
        { subject: { kind: "group", label: "enemy" }, pos: { x: 12, y: 10 }, size: { x: 4, y: 4 } },
        { subject: { kind: "group", label: "sea" }, pos: { x: 0, y: 90 }, size: { x: 100, y: 7 } },
      ],
    },
  });

  // Drilling inside the rock: the rock is inert, the enemy is sheltered by the rock, only the distant sea
  // remains active, so this tick is not exposure.
  const drilling = derivePlayLogEvents([build(true)], plan);
  assert.equal(drilling.hazard_exposure_ticks, 0);
  assert.ok(drilling.minimum_hazard_clearance > 4);

  // Releasing inside the same rock is the lethal state, and it is counted as exposure.
  const released = derivePlayLogEvents([build(false)], plan);
  assert.equal(released.hazard_exposure_ticks, 1);
  assert.equal(released.minimum_hazard_clearance, 0);
});

test("the case budget is shared across operation kinds instead of drained by one ladder", () => {
  // A hold-dominant episode with one short release gap inside the lookback: the truncate ladder and the
  // press-window insertion both have material to work with.
  const states = Array.from({ length: 80 }, (_, tick) => (
    (tick >= 10 && tick < 41) || (tick >= 45 && tick < 60)
  ));
  const source = {
    input_sequence: sequence(states),
    result: { executed_ticks: 80, final_score: 5, termination: { kind: "game_over", logical_tick: 79 } },
    private_steps: Array.from({ length: 80 }, (_, tick) => typedStep(tick, tick >= 50 ? 1 : 0, [1])),
  };
  const operations = resolveCounterfactualOperations(source, {
    anchor_event: "reward_event",
    lookback_ticks: 30,
    local_window_ticks: 10,
    operations: ["truncate_press_by_k", "insert_press_window"],
    press_edit_ticks: 5,
    max_cases: 4,
    minimum_eligible_cases: 2,
  });

  const kinds = new Set(operations.map((item) => item.operation.kind));
  assert.ok(operations.length >= 2);
  assert.ok(kinds.has("truncate_press_by_k"));
  assert.ok(kinds.has("insert_press_window"), "a second frozen operation must still be executed");
  // The ladder still deepens once every kind has contributed its first case.
  assert.equal(operations[0].operation.kind, "truncate_press_by_k");
  assert.equal(operations[1].operation.kind, "insert_press_window");
});

test("the failure source is never filtered by how much it offers to edit", () => {
  const criterionPlan = {
    source_selection_rule: "first_terminal_private_by_gameplay_seed",
    anchor_event: "terminal_event",
    lookback_ticks: 20,
    local_window_ticks: 10,
    operations: ["truncate_press_by_k", "insert_press_window"],
    press_edit_ticks: 5,
    max_cases: 4,
    minimum_eligible_cases: 2,
  };
  // The lower seed ends after a long release, so its terminal window offers a single insertion. The higher
  // seed ends mid-hold and can carry the frozen ladder.
  const barren = terminalEpisode(101, Array.from({ length: 40 }, (_, tick) => tick < 12));
  const usable = terminalEpisode(202, Array.from({ length: 40 }, (_, tick) => tick >= 5 && tick !== 30));

  // Selecting the source by how probeable it is would drop exactly the passive deaths failure agency needs.
  const selected = selectCounterfactualSource([barren, usable], criterionPlan);
  assert.equal(selected.result.gameplay_seed, 101);
  assert.equal(selected.selection_id, "failure-source-private");
  assert.deepEqual(
    selectCounterfactualSources([barren, usable], { ...criterionPlan, source_count: 2 })
      .map((item) => item.result.gameplay_seed),
    [101, 202],
  );
  assert.throws(() => selectCounterfactualSources([barren, usable], {
    ...criterionPlan,
    source_selection_rule: "first_terminal_private_with_sufficient_cases_by_gameplay_seed",
  }), /Unsupported counterfactual source rule/);
});

function terminalEpisode(gameplaySeed, states) {
  return {
    policy_role: "private_policy",
    input_sequence: sequence(states),
    result: {
      gameplay_seed: gameplaySeed,
      final_score: 1,
      executed_ticks: states.length,
      termination: { kind: "game_over", logical_tick: states.length - 1 },
    },
    private_steps: states.map((_, tick) => typedStep(tick, 0, [1])),
    release_count: 1,
    exact_replay: true,
  };
}

test("frozen anchor ordinals spread the case budget across reward moments", () => {
  const states = Array.from({ length: 120 }, (_, tick) => tick % 12 < 7);
  const scoreTicks = new Set([20, 60, 100]);
  let score = 0;
  const steps = Array.from({ length: 120 }, (_, tick) => {
    if (scoreTicks.has(tick)) score += 1;
    return typedStep(tick, score, [1]);
  });
  const source = {
    input_sequence: sequence(states),
    result: { executed_ticks: 120, final_score: 3, termination: { kind: "game_over", logical_tick: 119 } },
    private_steps: steps,
  };
  const criterionPlan = {
    anchor_event: "reward_event",
    lookback_ticks: 12,
    local_window_ticks: 10,
    operations: ["truncate_press_by_k"],
    press_edit_ticks: 3,
    max_cases: 6,
    minimum_eligible_cases: 2,
  };

  const single = resolveCounterfactualOperations(source, criterionPlan);
  assert.deepEqual([...new Set(single.map((item) => item.anchor_tick))], [20]);

  const spread = resolveCounterfactualOperations(source, {
    ...criterionPlan,
    anchor_ordinals: ["first", "median", "last"],
  });
  assert.deepEqual([...new Set(spread.map((item) => item.anchor_tick))].sort((a, b) => a - b), [20, 60, 100]);
  // Round-robin, so the budget is not spent on the first anchor before the later ones are reached.
  assert.deepEqual(spread.slice(0, 3).map((item) => item.anchor_tick), [20, 60, 100]);
});

test("source_count draws replication sources in the frozen selection order", () => {
  const selections = [
    { selection_id: "best-private", policy_role: "private_policy", result: { gameplay_seed: 900 } },
    { selection_id: "median-private", policy_role: "private_policy", result: { gameplay_seed: 901 } },
    { selection_id: "low-or-failure-private", policy_role: "private_policy", result: { gameplay_seed: 902 } },
  ];
  const one = selectCounterfactualSources(selections, { source_selection_rule: "best_private" });
  assert.deepEqual(one.map((item) => item.selection_id), ["best-private"]);

  const two = selectCounterfactualSources(selections, {
    source_selection_rule: "best_private",
    source_count: 2,
  });
  assert.deepEqual(two.map((item) => item.selection_id), ["best-private", "median-private"]);

  // A pool whose median repeats the best episode must not be counted twice as replication.
  const degenerate = selectCounterfactualSources([
    selections[0],
    { ...selections[1], result: { gameplay_seed: 900 } },
    selections[2],
  ], { source_selection_rule: "best_private", source_count: 2 });
  assert.deepEqual(degenerate.map((item) => item.result.gameplay_seed), [900, 902]);
});

test("failure agency needs positive evidence on the frozen number of distinct seeds", () => {
  const base = {
    eligible: true,
    first_noncontrollable_divergence_tick: 5,
    terminal_avoided: true,
    terminal_delay_ticks: null,
  };
  const criterionPlan = { minimum_eligible_cases: 2, minimum_delay_ticks: 5, minimum_replication_seeds: 2 };
  // Evidence confined to one seed cannot produce any verdict, positive or negative.
  const oneSeed = classifyFailureAgencyCases([
    { ...base, source_gameplay_seed: 10 },
    { ...base, source_gameplay_seed: 10 },
  ], criterionPlan);
  assert.equal(oneSeed.status, "unresolved");
  assert.equal(oneSeed.reason, "fewer_than_minimum_replication_seeds");
  assert.equal(oneSeed.replication_seed_count, 1);

  const twoSeeds = classifyFailureAgencyCases([
    { ...base, source_gameplay_seed: 10 },
    { ...base, source_gameplay_seed: 11 },
  ], criterionPlan);
  assert.equal(twoSeeds.status, "confirmed");
  assert.equal(twoSeeds.replication_seed_count, 2);
});

test("a passive terminal window is probed instead of being treated as unprobeable", () => {
  // The final 30 ticks are entirely released: the player was falling, doing nothing. That is the population
  // failure agency most needs to include, so it must yield bounded edits without any source filtering.
  const states = Array.from({ length: 80 }, (_, tick) => tick < 45);
  const source = {
    policy_role: "private_policy",
    input_sequence: sequence(states),
    result: {
      gameplay_seed: 5,
      final_score: 1,
      executed_ticks: 80,
      termination: { kind: "game_over", logical_tick: 79 },
    },
    private_steps: Array.from({ length: 80 }, (_, tick) => typedStep(tick, 0, [1])),
  };
  const operations = resolveCounterfactualOperations(source, {
    source_selection_rule: "first_terminal_private_by_gameplay_seed",
    anchor_event: "terminal_event",
    lookback_ticks: 30,
    local_window_ticks: 10,
    operations: ["insert_press_window"],
    press_edit_ticks: 5,
    max_cases: 4,
    minimum_eligible_cases: 2,
  });

  assert.ok(operations.length >= 2, "a released terminal window must carry more than one intervention");
  assert.ok(operations.every((item) => item.operation.pressed_ticks === 5));
  // Windows are distinct and ordered from the latest opportunity backwards.
  const starts = operations.map((item) => item.operation.start_tick);
  assert.equal(new Set(starts).size, starts.length);
  assert.ok(starts[0] > starts[1]);
  assert.ok(starts.every((start) => start >= 79 - 30 && start < 79));
});
