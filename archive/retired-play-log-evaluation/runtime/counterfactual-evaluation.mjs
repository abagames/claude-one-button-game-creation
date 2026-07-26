import {
  buildCounterfactualInput,
} from "./play-log-analysis.mjs";
import {
  expandPressedStates,
  hashCanonicalJson,
} from "./input-sequence.mjs";

// A criterion answered from one episode is a statement about one seed. `source_count` draws additional
// sources in the frozen selection order so the same edit family can be re-run on an independent seed, which
// is what `minimum_replication_seeds` then checks at classification time.
export function selectCounterfactualSources(episodePool, criterionPlan) {
  const count = criterionPlan?.source_count ?? 1;
  if (criterionPlan?.source_selection_rule === "best_private") {
    const order = ["best-private", "median-private", "low-or-failure-private"];
    const sources = order
      .map((selectionId) => episodePool.find((item) => item.selection_id === selectionId))
      .filter((item) => item != null);
    if (sources.length === 0) throw new Error("best_private source selection requires best-private");
    return dedupeBySeed(sources).slice(0, count);
  }
  const terminals = episodePool
    .filter((item) => item.policy_role === "private_policy")
    .filter((item) => item.result?.termination?.kind === "game_over")
    .sort((left, right) => left.result.gameplay_seed - right.result.gameplay_seed);
  if (criterionPlan?.source_selection_rule !== "first_terminal_private_by_gameplay_seed") {
    throw new Error(`Unsupported counterfactual source rule: ${criterionPlan?.source_selection_rule}`);
  }
  // Terminal sources are taken in seed order, never filtered by how much they offer to edit. Skipping
  // episodes whose final ticks are passive would quietly drop exactly the deaths where the player was doing
  // nothing, which is the population failure agency most needs to include.
  return terminals.slice(0, count).map((item, index) => ({
    ...item,
    selection_id: index === 0 ? "failure-source-private" : `failure-source-private-${index + 1}`,
  }));
}

function dedupeBySeed(sources) {
  const seen = new Set();
  return sources.filter((item) => {
    const seed = item.result.gameplay_seed;
    if (seen.has(seed)) return false;
    seen.add(seed);
    return true;
  });
}

export function selectCounterfactualSource(episodePool, criterionPlan) {
  if (!Array.isArray(episodePool) || episodePool.length < 1) {
    throw new Error("counterfactual source selection requires an episode pool");
  }
  if (criterionPlan?.source_selection_rule === "best_private") {
    const best = episodePool.find((item) => item.selection_id === "best-private");
    if (best == null) throw new Error("best_private source selection requires best-private");
    return best;
  }
  if (criterionPlan?.source_selection_rule === "first_terminal_private_by_gameplay_seed") {
    const candidates = episodePool
      .filter((item) => item.policy_role === "private_policy")
      .filter((item) => item.result?.termination?.kind === "game_over")
      .sort((left, right) => left.result.gameplay_seed - right.result.gameplay_seed);
    return candidates.length === 0
      ? null
      : { ...candidates[0], selection_id: "failure-source-private" };
  }
  throw new Error(`Unsupported counterfactual source rule: ${criterionPlan?.source_selection_rule}`);
}

export function resolveCounterfactualOperations(source, criterionPlan) {
  if (source?.input_sequence == null || source?.result == null) {
    throw new Error("counterfactual operation resolution requires a source episode");
  }
  const anchors = resolveAnchors(source, criterionPlan);
  if (anchors.length === 0) return [];
  const operations = [];
  // Anchors are drawn round-robin as well, so one moment of the episode cannot absorb the whole case budget.
  // A single anchor makes the criterion a statement about one instant; spreading the budget over the frozen
  // anchor ordinals makes it a statement about the episode.
  const perAnchor = anchors.map((anchorTick) => resolveAnchorOperations(source, criterionPlan, anchorTick));
  const depth = Math.max(0, ...perAnchor.map((items) => items.length));
  for (let index = 0; index < depth; index++) {
    for (const items of perAnchor) {
      if (items[index] == null) continue;
      const applied = applyResolvedOperation(items[index].operation, {
        source,
        anchorTick: items[index].anchor_tick,
        minimumTick: items[index].minimum_tick,
        operations,
      });
      if (applied != null) operations.push(applied);
      if (operations.length >= criterionPlan.max_cases) return operations;
    }
  }
  return operations;
}

// The frozen anchor ordinals decide which reward moments are probed. Terminal-anchored plans keep their
// single, unambiguous anchor.
function resolveAnchors(source, criterionPlan) {
  if (criterionPlan.anchor_event === "terminal_event") {
    const anchorTick = source.result.executed_ticks - 1;
    return Number.isInteger(anchorTick) && anchorTick >= 1 ? [anchorTick] : [];
  }
  const rewardAnchors = findRewardAnchors(source.private_steps);
  if (rewardAnchors.length === 0) return [];
  const ordinals = criterionPlan.anchor_ordinals ?? ["first"];
  const picked = ordinals.map((ordinal) => {
    if (ordinal === "first") return rewardAnchors[0];
    if (ordinal === "last") return rewardAnchors.at(-1);
    return rewardAnchors[Math.floor((rewardAnchors.length - 1) / 2)];
  });
  return [...new Set(picked)].sort((left, right) => left - right);
}

function resolveAnchorOperations(source, criterionPlan, anchorTick) {
  const minimumTick = Math.max(0, anchorTick - criterionPlan.lookback_ticks);
  const runs = pressRuns(source.input_sequence);
  const editTicks = criterionPlan.press_edit_ticks ?? 1;
  // Round-robin across the frozen operation kinds before going deeper into any one ladder. Draining one
  // kind first would let a ladder consume the whole case budget, so the other operations the plan froze
  // would never be executed and the evidence would rest on a single family of edits.
  const byKind = criterionPlan.operations.map((kind) => resolveOperationCandidates(kind, {
    source,
    criterionPlan,
    runs,
    anchorTick,
    minimumTick,
    editTicks,
  }));
  const ordered = [];
  const depth = Math.max(0, ...byKind.map((candidates) => candidates.length));
  for (let index = 0; index < depth; index++) {
    for (const candidates of byKind) {
      if (candidates[index] == null) continue;
      ordered.push({ operation: candidates[index], anchor_tick: anchorTick, minimum_tick: minimumTick });
    }
  }
  return ordered;
}

// One press-run edit is not one case. On a hold-dominant episode the only bounded edits available near the
// anchor are release-timing edits of different depth, so those two operations expand into a ladder of k,
// 2k, 3k ... ticks. Without the ladder a game whose ending is a single long hold can never reach the frozen
// minimum number of cases, and the criterion would stop as instrument-insufficient for a shape of play the
// instrument can in fact probe.
function resolveOperationCandidates(kind, { source, criterionPlan, runs, anchorTick, minimumTick, editTicks }) {
  const candidates = [];
  if (kind === "truncate_press_by_k") {
    // Release earlier: cut the last k pressed ticks before the anchor out of the run that covers it.
    const covering = runs.filter((run) => run.start < anchorTick).at(-1);
    if (covering == null) return candidates;
    const cut = Math.min(covering.end, anchorTick);
    for (let step = 1; step <= criterionPlan.max_cases; step++) {
      const ticks = editTicks * step;
      const start = cut - ticks;
      if (start < covering.start || start < minimumTick) break;
      candidates.push({ kind, start_tick: start, ticks });
    }
    return candidates;
  }
  if (kind === "insert_press_window") {
    // Acting where the source did nothing. A terminal window spent released is not unprobeable: it carries a
    // family of "press for k ticks, this late / this early" interventions. Generating only one of them was
    // what made passive deaths look unmeasurable and invited a biased source rule instead.
    const states = expandPressedStates(source.input_sequence);
    const collect = (width) => {
      const windows = [];
      let cursor = anchorTick - 1;
      while (cursor >= minimumTick && windows.length < criterionPlan.max_cases) {
        const start = cursor - width + 1;
        if (start < minimumTick) break;
        if (states.slice(start, start + width).every((pressed) => pressed === false)) {
          windows.push({ kind, start_tick: start, pressed_ticks: width });
          cursor = start - 1;
        } else {
          cursor--;
        }
      }
      return windows;
    };
    // Prefer the frozen edit width, but a narrow release gap still deserves a probe rather than silence.
    const wide = collect(editTicks);
    return wide.length > 0 || editTicks === 1 ? wide : collect(1);
  }
  if (kind === "extend_press_by_k") {
    // Release later: hold k more ticks past a run that already ended before the anchor.
    const preceding = runs.filter((run) => run.end <= anchorTick).at(-1);
    if (preceding == null || preceding.end < minimumTick) return candidates;
    const states = expandPressedStates(source.input_sequence);
    for (let step = 1; step <= criterionPlan.max_cases; step++) {
      const ticks = editTicks * step;
      const end = preceding.end + ticks;
      if (end > states.length) break;
      if (!states.slice(preceding.end, end).every((pressed) => pressed === false)) break;
      candidates.push({ kind, start_tick: preceding.end, ticks });
    }
    return candidates;
  }
  const single = resolveSingleOperation(kind, { source, runs, anchorTick, minimumTick });
  return single == null ? candidates : [single];
}

function resolveSingleOperation(kind, { source, runs, anchorTick, minimumTick }) {
  {
    let operation = null;
    if (kind === "insert_press_window") {
      return null;
    } else {
      const candidates = runs
        .map((run, index) => ({ run, index }))
        .filter(({ run }) => run.start >= minimumTick && run.start < anchorTick)
        .filter(({ run }) => kind !== "shift_press_minus_one" || run.start > 0)
        .filter(({ run }) => kind !== "shift_press_plus_one" || run.end < source.input_sequence.duration_ticks);
      const selected = candidates.at(-1);
      if (selected != null) operation = { kind, press_ordinal: selected.index };
    }
    return operation;
  }
}

function applyResolvedOperation(operation, { source, anchorTick, minimumTick, operations }) {
  let inputSequence;
  try {
    inputSequence = buildCounterfactualInput(source.input_sequence, operation);
  } catch {
    return null;
  }
  if (hashCanonicalJson(inputSequence) === hashCanonicalJson(source.input_sequence)) return null;
  const editTick = firstInputDifference(source.input_sequence, inputSequence);
  if (editTick < minimumTick || editTick >= anchorTick) return null;
  const duplicate = operations.some(
    (item) => hashCanonicalJson(item.input_sequence) === hashCanonicalJson(inputSequence),
  );
  if (duplicate) return null;
  return {
    operation,
    input_sequence: inputSequence,
    anchor_tick: anchorTick,
    edit_tick: editTick,
  };
}

export function compareCounterfactualRun(source, branch, {
  criterionId,
  criterionPlan,
  operation,
  anchorTick,
  editTick,
  controllableRoles,
}) {
  const controllable = new Set(controllableRoles);
  const preEditEquivalent = equivalentBeforeEdit(source.private_steps, branch.private_steps, editTick, controllable);
  const firstDivergence = findStructuralDivergence(
    source.private_steps,
    branch.private_steps,
    editTick,
    criterionPlan.local_window_ticks,
    controllable,
  );
  const ineligibilityReasons = [];
  if (editTick < anchorTick - criterionPlan.lookback_ticks || editTick >= anchorTick) {
    ineligibilityReasons.push("edit_outside_anchor_lookback");
  }
  if (!preEditEquivalent) ineligibilityReasons.push("pre_edit_mismatch");
  const baselineTerminal = terminalProjection(source.result);
  const counterfactualTerminal = terminalProjection(branch.result);
  const terminalAvoided = baselineTerminal.kind === "game_over"
    && counterfactualTerminal.kind !== "game_over";
  const terminalDelayTicks = baselineTerminal.kind === "game_over" && counterfactualTerminal.kind === "game_over"
    ? counterfactualTerminal.tick - baselineTerminal.tick
    : null;
  return {
    criterion_id: criterionId,
    operation: operation.kind,
    anchor_event: criterionPlan.anchor_event,
    anchor_tick: anchorTick,
    lookback_ticks: criterionPlan.lookback_ticks,
    edit_tick: editTick,
    pre_edit_equivalent: preEditEquivalent,
    eligible: ineligibilityReasons.length === 0,
    ineligibility_reasons: ineligibilityReasons,
    first_noncontrollable_divergence_tick: firstDivergence,
    baseline_terminal: baselineTerminal,
    counterfactual_terminal: counterfactualTerminal,
    terminal_avoided: terminalAvoided,
    terminal_delay_ticks: terminalDelayTicks,
    survival_difference: branch.result.executed_ticks - source.result.executed_ticks,
    score_difference: branch.result.final_score - source.result.final_score,
  };
}

export function classifyFailureAgencyCases(cases, criterionPlan) {
  const eligible = cases.filter((item) => item.eligible);
  const replication = criterionPlan.minimum_replication_seeds ?? 1;
  const eligibleSeeds = new Set(eligible.map((item) => item.source_gameplay_seed)).size;
  if (eligible.length < criterionPlan.minimum_eligible_cases || eligibleSeeds < replication) {
    return {
      status: "unresolved",
      ordinal_value: null,
      eligible_count: eligible.length,
      delayed_or_avoided_count: 0,
      strong_count: 0,
      replication_seed_count: eligibleSeeds,
      reason: eligible.length < criterionPlan.minimum_eligible_cases
        ? "fewer_than_minimum_eligible_terminal_cases"
        : "fewer_than_minimum_replication_seeds",
    };
  }
  const delayedOrAvoided = eligible.filter((item) =>
    item.first_noncontrollable_divergence_tick != null
    && (item.terminal_avoided || (item.terminal_delay_ticks ?? 0) > 0));
  const strong = delayedOrAvoided.filter((item) =>
    item.terminal_avoided || item.terminal_delay_ticks >= criterionPlan.minimum_delay_ticks);
  const seeds = new Set(delayedOrAvoided.map((item) => item.source_gameplay_seed)).size;
  const status = delayedOrAvoided.length >= criterionPlan.minimum_eligible_cases
    && strong.length > 0
    && seeds >= replication
    ? "confirmed"
    : delayedOrAvoided.length > 0
      ? "mixed"
      : "contradicted";
  return {
    status,
    ordinal_value: { confirmed: 2, mixed: 1, contradicted: 0 }[status],
    eligible_count: eligible.length,
    delayed_or_avoided_count: delayedOrAvoided.length,
    strong_count: strong.length,
    replication_seed_count: seeds,
    reason: status === "confirmed"
      ? "replicated_terminal_delay_or_avoidance"
      : status === "mixed"
        ? "partial_terminal_delay_or_avoidance"
        : "eligible_edits_did_not_delay_or_avoid_terminal",
  };
}

function terminalProjection(result) {
  return {
    kind: result.termination.kind === "game_over" ? "game_over" : "tick_budget",
    tick: result.termination.logical_tick,
  };
}

function findRewardAnchors(steps) {
  const anchors = [];
  let previousScore = 0;
  for (const step of steps ?? []) {
    if (step.score !== previousScore && step.logicalTick >= 1) anchors.push(step.logicalTick);
    previousScore = step.score;
  }
  return anchors;
}

function pressRuns(inputSequence) {
  const states = expandPressedStates(inputSequence);
  const runs = [];
  for (let tick = 0; tick < states.length; tick++) {
    if (states[tick] && (tick === 0 || !states[tick - 1])) {
      let end = tick + 1;
      while (end < states.length && states[end]) end++;
      runs.push({ start: tick, end });
    }
  }
  return runs;
}

function firstInputDifference(left, right) {
  const leftStates = expandPressedStates(left);
  const rightStates = expandPressedStates(right);
  const length = Math.min(leftStates.length, rightStates.length);
  for (let tick = 0; tick < length; tick++) {
    if (leftStates[tick] !== rightStates[tick]) return tick;
  }
  return length;
}

function equivalentBeforeEdit(leftSteps, rightSteps, editTick, controllable) {
  for (let tick = 0; tick < editTick; tick++) {
    const left = leftSteps[tick];
    const right = rightSteps[tick];
    if (left == null || right == null) return false;
    if (worldSignature(left, controllable) !== worldSignature(right, controllable)) return false;
  }
  return true;
}

function findStructuralDivergence(leftSteps, rightSteps, editTick, windowTicks, controllable) {
  for (let tick = editTick; tick <= editTick + windowTicks; tick++) {
    const left = leftSteps[tick];
    const right = rightSteps[tick];
    if (left == null && right == null) break;
    if (left == null || right == null) return tick;
    if (worldSignature(left, controllable) !== worldSignature(right, controllable)) return tick;
  }
  return null;
}

function worldSignature(step, controllable) {
  const records = (step.privateDrawing?.records ?? [])
    .map((record) => ({ record, role: subjectRole(record.subject) }))
    .filter(({ role }) => role != null && !controllable.has(role))
    .map(({ record, role }) => ({
      role,
      subject_kind: record.subject.kind,
      episode_ref: record.subject.kind === "object" ? record.subject.episodeRef ?? null : null,
      descriptor_id: record.subject.kind === "descriptor" ? record.subject.id : null,
      source: record.source,
      pos: roundedPoint(record.pos),
      size: roundedPoint(record.size),
    }))
    .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
  return JSON.stringify({ phase: step.phase, score: step.score, records });
}

function subjectRole(subject) {
  if (subject?.kind === "group") return subject.label;
  if (subject?.kind === "descriptor" || subject?.kind === "object") return subject.type ?? null;
  return null;
}

function roundedPoint(value) {
  return {
    x: Math.round(value.x * 1e6) / 1e6,
    y: Math.round(value.y * 1e6) / 1e6,
  };
}
