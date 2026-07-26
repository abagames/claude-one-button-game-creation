import { assertValidInputSequence, expandPressedStates } from "./input-sequence.mjs";

export function mechanicalResultProjection(result) {
  return {
    game_id: result.game_id,
    gameplay_seed: result.gameplay_seed,
    input_sequence_sha256: result.input_sequence_sha256,
    episode_random_seed: result.episode_random_seed,
    executed_ticks: result.executed_ticks,
    final_score: result.final_score,
    termination: result.termination,
    frames: (result.frames ?? []).map((frame) => ({
      logical_tick: frame.logical_tick,
      input: frame.input,
      phase: frame.phase,
    })),
    diagnostics: result.diagnostics ?? null,
  };
}

export function derivePlayLogEvents(rawSteps, plan) {
  if (!Array.isArray(rawSteps) || rawSteps.length < 1) throw new Error("derivePlayLogEvents requires raw private steps");
  const controllable = new Set(plan.role_mapping.controllable);
  const hazards = new Set(plan.role_mapping.hazards);
  const rewards = new Set(plan.role_mapping.rewards ?? []);
  const riskMode = plan.risk_measurement?.mode ?? "hazard_clearance";
  const threshold = plan.risk_measurement?.hazard_exposure_clearance_threshold
    ?? plan.metrics?.find((metric) => metric.metric_id === "hazard_exposure_ticks")?.threshold
    ?? null;
  const indicatorThreshold = plan.risk_measurement?.indicator_exposure_threshold ?? null;
  const activeWhen = plan.risk_measurement?.hazard_active_when ?? "always";
  const globalShelters = plan.risk_measurement?.hazard_suppressed_while_overlapping ?? [];
  const hazardConditions = plan.risk_measurement?.hazard_conditions ?? {};
  const contactTolerance = plan.contact_tolerance ?? 0;
  const events = [];
  let previousScore = 0;
  let minimumClearance = null;
  let exposureTicks = 0;
  let rewardRecordCount = 0;
  let identifiedRewardRecordCount = 0;
  let unresolvedRewardIdentity = false;
  const uniqueRewardObjectsObserved = new Set();
  for (const step of rawSteps) {
    if ((step.privateDrawing?.diagnostics ?? []).length > 0) {
      throw new Error(`Annotation diagnostic at logical tick ${step.logicalTick}`);
    }
    if (step.input.justPressed) events.push({ event: "input_press", logical_tick: step.logicalTick });
    if (step.input.justReleased) events.push({ event: "input_release", logical_tick: step.logicalTick });
    const scoreDelta = step.score - previousScore;
    if (scoreDelta !== 0) events.push({ event: "score_delta", logical_tick: step.logicalTick, value: scoreDelta, attribution: "unresolved" });
    previousScore = step.score;
    const records = (step.privateDrawing?.records ?? []).flatMap((record) => {
      const subject = projectSubject(record.subject);
      return subject.label == null ? [] : [{ ...subject, pos: record.pos, size: record.size }];
    });
    for (const record of records.filter((record) => rewards.has(record.label))) {
      rewardRecordCount++;
      if (record.identityKey == null) {
        unresolvedRewardIdentity = true;
      } else {
        identifiedRewardRecordCount++;
      }
      if (record.identityKey != null && !uniqueRewardObjectsObserved.has(record.identityKey)) {
        uniqueRewardObjectsObserved.add(record.identityKey);
        events.push({
          event: "reward_object_observed",
          logical_tick: step.logicalTick,
          role: record.label,
          episode_ref: record.episodeRef,
        });
      }
    }
    const playerRecords = records.filter((record) => controllable.has(record.label));
    const hazardRecords = records.filter((record) => hazards.has(record.label));
    // A hazard can be inert: lethal only while the button is held or released, or neutralized while the
    // controllable subject sits inside a shelter role. Conditions are per role, because one game can mix a
    // hazard that only bites on release, a hazard a shelter hides the player from, and a hazard that is
    // always lethal. Ticks where a hazard is inactive contribute no clearance sample for that hazard, so
    // exposure is not counted where the annotations show there is no risk.
    const sheltered = (roles) => roles.length > 0 && playerRecords.some((player) => records.some(
      (record) => roles.includes(record.label) && isInContact(player, record, contactTolerance),
    ));
    const activeHazards = hazardRecords.filter((hazard) => {
      const condition = hazardConditions[hazard.label] ?? {};
      const when = condition.active_when ?? activeWhen;
      if (when === "input_pressed" && step.input.pressed !== true) return false;
      if (when === "input_released" && step.input.pressed === true) return false;
      return !sheltered(condition.suppressed_while_overlapping ?? globalShelters);
    });
    const clearances = playerRecords.flatMap(
      (player) => activeHazards.map((hazard) => aabbClearance(player, hazard)),
    );
    if (riskMode === "hazard_clearance" && clearances.length > 0) {
      const tickMinimum = Math.min(...clearances);
      minimumClearance = minimumClearance == null ? tickMinimum : Math.min(minimumClearance, tickMinimum);
      if (threshold != null && tickMinimum <= threshold) exposureTicks++;
      events.push({ event: "hazard_clearance", logical_tick: step.logicalTick, value: tickMinimum });
    }
    if (riskMode === "indicator_displacement") {
      const axis = plan.risk_measurement.indicator_axis;
      const neutral = plan.risk_measurement.indicator_neutral;
      const indicator = records.find((record) => record.label === plan.risk_measurement.indicator_role);
      if (indicator != null) {
        const center = indicator.pos[axis] + indicator.size[axis] / 2;
        const displacement = Math.abs(center - neutral);
        if (indicatorThreshold != null && displacement >= indicatorThreshold) exposureTicks++;
        events.push({
          event: "indicator_displacement",
          logical_tick: step.logicalTick,
          value: displacement,
        });
      }
    }
    if (step.phase === "gameOver") events.push({ event: "terminal", logical_tick: step.logicalTick, kind: "game_over" });
  }
  const identityTrackingStatus = rewards.size === 0
    ? "not_applicable"
    : rewardRecordCount === 0
      ? "unavailable"
      : unresolvedRewardIdentity
        ? "unresolved"
        : "available";
  const uniqueRewardObjectCount = identityTrackingStatus === "available" ? uniqueRewardObjectsObserved.size : null;
  const identityCoverage = rewards.size === 0 ? null : rewardRecordCount === 0
    ? 0
    : identifiedRewardRecordCount / rewardRecordCount;
  const finalScore = rawSteps.at(-1).score;
  return Object.freeze({
    schema_version: 1,
    artifact_class: "private_play_log_derived_events",
    game_id: plan.game_id,
    executed_ticks: rawSteps.length,
    final_score: finalScore,
    minimum_hazard_clearance: minimumClearance,
    hazard_exposure_ticks: riskMode === "indicator_displacement"
      ? (indicatorThreshold == null ? null : exposureTicks)
      : (threshold == null ? null : exposureTicks),
    identity_tracking_status: identityTrackingStatus,
    identity_coverage: identityCoverage,
    unique_reward_objects_observed: uniqueRewardObjectCount,
    score_per_unique_reward_object_observed: uniqueRewardObjectCount == null || uniqueRewardObjectCount === 0
      ? null
      : finalScore / uniqueRewardObjectCount,
    unique_scoring_objects_attributed: null,
    score_per_attributed_scoring_object: null,
    events,
  });
}

export function buildCounterfactualInput(inputSequence, operation) {
  assertValidInputSequence(inputSequence);
  const states = expandPressedStates(inputSequence);
  // Release-timing edits. For hold-and-release games the decision under test is when the button goes up, and
  // neither deleting a whole press run nor nudging it by one tick probes that. These two operations move the
  // release boundary by a frozen number of ticks and leave the rest of the run intact.
  if (operation?.kind === "truncate_press_by_k" || operation?.kind === "extend_press_by_k") {
    const start = operation.start_tick;
    const ticks = operation.ticks;
    const end = start + ticks;
    if (!Number.isInteger(start) || !Number.isInteger(ticks) || ticks < 1 || start < 0 || end > states.length) {
      throw new Error(`Counterfactual ${operation.kind} is out of range`);
    }
    const expected = operation.kind === "truncate_press_by_k";
    if (states.slice(start, end).some((pressed) => pressed !== expected)) {
      throw new Error(`Counterfactual ${operation.kind} requires a uniform source window`);
    }
    const modified = [...states];
    for (let tick = start; tick < end; tick++) modified[tick] = !expected;
    return statesToSequence(modified);
  }
  if (operation?.kind === "insert_press_window") {
    const start = operation.start_tick;
    const end = start + operation.pressed_ticks;
    if (!Number.isInteger(start) || !Number.isInteger(operation.pressed_ticks)
      || operation.pressed_ticks < 1 || start < 0 || end > states.length) {
      throw new Error("Counterfactual insert_press_window is out of range");
    }
    if (states.slice(start, end).some(Boolean)) {
      throw new Error("Counterfactual insert_press_window requires a released source window");
    }
    for (let tick = start; tick < end; tick++) states[tick] = true;
    return statesToSequence(states);
  }
  const pressRuns = [];
  for (let tick = 0; tick < states.length; tick++) {
    if (states[tick] && (tick === 0 || !states[tick - 1])) {
      let end = tick + 1;
      while (end < states.length && states[end]) end++;
      pressRuns.push({ start: tick, end });
    }
  }
  const ordinal = operation?.press_ordinal;
  if (!Number.isInteger(ordinal) || ordinal < 0 || ordinal >= pressRuns.length) throw new Error("Counterfactual press_ordinal is out of range");
  const selected = pressRuns[ordinal];
  const modified = [...states];
  if (operation.kind === "remove_press") {
    for (let tick = selected.start; tick < selected.end; tick++) modified[tick] = false;
  } else if (operation.kind === "shift_press_minus_one" || operation.kind === "shift_press_plus_one") {
    const delta = operation.kind === "shift_press_minus_one" ? -1 : 1;
    const start = selected.start + delta;
    const end = selected.end + delta;
    if (start < 0 || end > modified.length) throw new Error("Counterfactual shift escapes the input duration");
    for (let tick = selected.start; tick < selected.end; tick++) modified[tick] = false;
    for (let tick = start; tick < end; tick++) modified[tick] = true;
  } else {
    throw new Error(`Unsupported counterfactual operation: ${operation?.kind}`);
  }
  return statesToSequence(modified);
}

function statesToSequence(states) {
  const transitions = [];
  let previous = false;
  for (let tick = 0; tick < states.length; tick++) {
    if (tick === 0 || states[tick] !== previous) transitions.push({ tick, pressed: states[tick] });
    previous = states[tick];
  }
  return assertValidInputSequence({ schema_version: 1, duration_ticks: states.length, transitions });
}

// Contact, not strict overlap. A game whose collision uses a radius or an inflated box kills the player at
// an edge-to-edge distance the drawn geometry never crosses, so exact touching must count and a frozen
// tolerance must be able to express the extra margin that is in the source but not in the drawing.
export function isInContact(left, right, tolerance = 0) {
  return aabbClearance(left, right) <= tolerance;
}

export function aabbClearance(left, right) {
  const leftCenterX = left.pos.x + left.size.x / 2;
  const leftCenterY = left.pos.y + left.size.y / 2;
  const rightCenterX = right.pos.x + right.size.x / 2;
  const rightCenterY = right.pos.y + right.size.y / 2;
  const dx = Math.max(0, Math.abs(leftCenterX - rightCenterX) - (left.size.x + right.size.x) / 2);
  const dy = Math.max(0, Math.abs(leftCenterY - rightCenterY) - (left.size.y + right.size.y) / 2);
  return Math.hypot(dx, dy);
}

function projectSubject(subject) {
  if (subject?.kind === "group") {
    return { label: subject.label, identityKey: null, episodeRef: null };
  }
  if (subject?.kind === "descriptor") {
    return { label: subject.type, identityKey: `descriptor:${subject.type}:${subject.id}`, episodeRef: null };
  }
  if (subject?.kind === "object" && typeof subject.type === "string" && Number.isInteger(subject.episodeRef)) {
    return { label: subject.type, identityKey: `object:${subject.episodeRef}`, episodeRef: subject.episodeRef };
  }
  return { label: null, identityKey: null, episodeRef: null };
}
