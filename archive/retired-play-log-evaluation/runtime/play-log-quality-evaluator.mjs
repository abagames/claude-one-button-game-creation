import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runAdapterConformance } from "./adapter-conformance.mjs";
import { assertValidArtifact } from "./artifact-contracts.mjs";
import { runBaselineMatrix } from "./baseline-matrix.mjs";
import {
  classifyFailureAgencyCases,
  compareCounterfactualRun,
  resolveCounterfactualOperations,
  selectCounterfactualSources,
} from "./counterfactual-evaluation.mjs";
import { expandPressedStates, hashCanonicalJson } from "./input-sequence.mjs";
import { derivePlayLogEvents, isInContact } from "./play-log-analysis.mjs";
import {
  assessPlayLogFeasibility,
  PlayLogInstrumentInsufficientError,
} from "./play-log-feasibility.mjs";
import { createSimulator } from "./simulator.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const controls = Object.freeze([
  Object.freeze({ role: "idle" }),
  Object.freeze({ role: "hold" }),
  Object.freeze({ role: "periodic", conditionId: "periodic-30-10", periodTicks: 30, pressedTicks: 10 }),
  Object.freeze({ role: "seeded_random", conditionId: "seeded-random-12", meanSegmentTicks: 12, policySeed: 70008 }),
]);
let simulator;

// `stopAfterFeasibility` runs Stages 6-8 only: conformance, the development-seed qualification pool, and the
// development-only feasibility gate. It returns before the first analysis episode, so the frozen analysis seed
// pool stays unburned and the plan may still be adapted to the game — which is the whole point of reading the
// feasibility report before freezing. Pool collection stays in this shared executor either way; a game-specific
// script must never rebuild it to get a feasibility report.
export async function runPlayLogQualityEvaluation(config, { stopAfterFeasibility = false } = {}) {
  validateEvaluationConfig(config);
  const gameId = config.adapter.game_id;
  const planPath = config.planPath;
  const plan = readJson(planPath);
  assertValidArtifact("play_log_quality_plan", plan);
  const base = resolveOutputBase(plan);
  if (plan.schema_version !== 2) {
    throw new Error("new play-log evaluations require play-log quality plan schema_version 2");
  }
  if (plan.game_id !== gameId) {
    throw new Error(`adapter/plan game_id mismatch: ${gameId}/${plan.game_id}`);
  }
  if (shaFile(plan.provenance.adapter_path) !== plan.provenance.adapter_sha256) {
    throw new Error("adapter hash does not match frozen plan provenance");
  }
  if (shaFile(config.policyPath) !== plan.provenance.policy_sha256) {
    throw new Error("private policy hash does not match frozen plan provenance");
  }
  simulator = createSimulator({
    runtimeBundleSha256: plan.provenance.runtime_bundle_sha256,
    adapters: [config.adapter],
  });

  const conformance = await runAdapterConformance({
    simulator,
    gameId,
    gameplaySeed: plan.seed_plan.development[0],
    durationTicks: 180,
    timeoutMs: plan.execution.timeout_ms,
    policies: controls,
  });
  if (!conformance.passed) throw new Error("adapter conformance failed");
  writeJson(`${base}/artifacts/simulator-conformance.json`, conformance);

  const qualification = await runPrivatePool(config, plan.seed_plan.development, plan);
  assertHealthyPrivatePool(qualification, [], false);
  writeJson(`${base}/artifacts/qualification-runtime.json`, summarizePool(qualification));
  const feasibilityPath = `${base}/artifacts/play-log-feasibility.private.json`;
  const feasibility = assessPlayLogFeasibility({
    qualification,
    plan,
    qualityPlanSha256: shaFile(planPath),
    requiredCoverage: config.requiredCoverage,
  });
  assertValidArtifact("play_log_feasibility", feasibility);
  writeJson(feasibilityPath, feasibility);
  if (feasibility.status !== "passed") {
    throw new PlayLogInstrumentInsufficientError(feasibility);
  }
  if (stopAfterFeasibility) return { plan, conformance, feasibility, stopped_after: "feasibility" };

  const baselineSteps = new Map();
  const baseline = await runBaselineMatrix(simulator, {
    gameId,
    gameplaySeeds: plan.seed_plan.analysis,
    durationTicks: plan.execution.tick_budget,
    timeoutMs: plan.execution.timeout_ms,
    policies: controls,
  }, {
    concurrency: 2,
    onPrivateFrame(step, entry) {
      const key = baselineKey(entry.request.gameplay_seed, entry.policy_role);
      if (!baselineSteps.has(key)) baselineSteps.set(key, []);
      baselineSteps.get(key).push(step);
    },
  });
  const baselineReplay = await simulator.runEpisodes(baseline.map((entry) => entry.request), { concurrency: 2 });
  baseline.forEach((entry, index) => {
    if (hashCanonicalJson(entry.result) !== hashCanonicalJson(baselineReplay[index])) {
      throw new Error(`diagnostic control exact replay failed: ${entry.request.gameplay_seed}/${entry.policy_role}`);
    }
    assertHealthyResult(entry.result);
  });
  writeJson(`${base}/artifacts/baseline-matrix.private.json`, {
    schema_version: 1,
    artifact_class: "private_diagnostic_control_matrix",
    game_id: gameId,
    records: baseline.map((entry) => ({
      condition_id: entry.condition_id,
      policy_role: entry.policy_role,
      policy_provenance: entry.policy_provenance,
      request: entry.request,
      result: entry.result,
      private_steps: baselineSteps.get(baselineKey(entry.request.gameplay_seed, entry.policy_role)),
      exact_replay: true,
    })),
  }, { compact: true });

  const privatePool = await runPrivatePool(config, plan.seed_plan.analysis, plan);
  assertHealthyPrivatePool(privatePool, config.requiredCoverage);
  writeJson(`${base}/artifacts/analysis-episode-pool.private.json`, {
    schema_version: 1,
    artifact_class: "private_analysis_episode_pool",
    game_id: gameId,
    private_policy: privatePool,
    diagnostic_controls: baseline.map((entry) => ({
      condition_id: entry.condition_id,
      policy_role: entry.policy_role,
      request: entry.request,
      result: entry.result,
      exact_replay: true,
    })),
  }, { compact: true });

  const sortedPrivate = [...privatePool].sort(compareEpisodes);
  const best = sortedPrivate[0];
  const median = sortedPrivate[Math.floor((sortedPrivate.length - 1) / 2)];
  const low = sortedPrivate.at(-1);
  const sameSeedControls = baseline.filter((entry) => entry.request.gameplay_seed === best.result.gameplay_seed);
  const periodic = sameSeedControls.find((entry) => entry.policy_role === plan.selection_rule.same_seed_control_role);
  const bestControl = [...sameSeedControls].sort((left, right) => compareResults(left.result, right.result))[0];
  if (periodic == null || bestControl == null) throw new Error("same-seed diagnostic control selection failed");
  const failureSources = selectCounterfactualSources(
    privatePool,
    plan.counterfactual_plans.failure_agency,
  );

  const selected = [
    selectedPrivate("best-private", best),
    selectedPrivate("median-private", median),
    selectedPrivate("low-or-failure-private", low),
    selectedControl("same-seed-periodic", periodic, baselineSteps),
    selectedControl("best-control-same-seed", bestControl, baselineSteps),
    ...failureSources,
  ];
  const selectedReplayResults = await simulator.runEpisodes(selected.map((item) => ({
    schema_version: 0,
    game_id: gameId,
    gameplay_seed: item.result.gameplay_seed,
    input_sequence: item.input_sequence,
    timeout_ms: plan.execution.timeout_ms,
    capture_canvas: false,
  })));
  selected.forEach((item, index) => {
    if (hashCanonicalJson(item.result) !== hashCanonicalJson(selectedReplayResults[index])) {
      throw new Error(`selected exact replay failed: ${item.selection_id}`);
    }
  });
  const derivedBySelection = new Map(selected.map((item) => [
    item.selection_id,
    derivePlayLogEvents(item.private_steps, plan),
  ]));
  const derivedArtifact = {
    schema_version: 1,
    artifact_class: "private_selected_derived_events",
    game_id: gameId,
    selections: Object.fromEntries(derivedBySelection),
  };
  writeJson(`${base}/artifacts/play-log-analysis/derived-events.private.json`, derivedArtifact, { compact: true });

  const causalCases = await runCriterionCounterfactuals(
    config,
    gameId,
    selectCounterfactualSources(selected, plan.counterfactual_plans.causal_input_control),
    "causal_input_control",
    plan.counterfactual_plans.causal_input_control,
    plan,
  );
  const riskCases = await runCriterionCounterfactuals(
    config,
    gameId,
    selectCounterfactualSources(selected, plan.counterfactual_plans.risk_reward_coupling),
    "risk_reward_coupling",
    plan.counterfactual_plans.risk_reward_coupling,
    plan,
  );
  const failureCases = failureSources.length === 0 ? [] : await runCriterionCounterfactuals(
    config,
    gameId,
    failureSources,
    "failure_agency",
    plan.counterfactual_plans.failure_agency,
    plan,
  );
  const counterfactualArtifact = {
    schema_version: 2,
    artifact_class: "private_local_counterfactuals",
    game_id: gameId,
    source_selection_ids: {
      causal_input_control: "best-private",
      risk_reward_coupling: "best-private",
      failure_agency: failureSources[0]?.selection_id ?? null,
    },
    cases: [...causalCases, ...riskCases, ...failureCases],
  };
  writeJson(`${base}/artifacts/play-log-analysis/counterfactuals.private.json`, counterfactualArtifact, { compact: true });
  const replayBundle = {
    schema_version: 1,
    artifact_class: "private_exact_replay_bundle",
    game_id: gameId,
    mode: "exact_result_v1",
    selections: selected.map((item, index) => ({
      selection_id: item.selection_id,
      policy_role: item.policy_role,
      input_sequence: item.input_sequence,
      original_result: item.result,
      replay_result: selectedReplayResults[index],
      exact_match: true,
    })),
  };
  writeJson(`${base}/artifacts/play-log-analysis/replay-runtime.private.json`, replayBundle, { compact: true });

  const selections = selected.map((item) => ({
    selection_id: item.selection_id,
    policy_role: item.policy_role,
    gameplay_seed: item.result.gameplay_seed,
    final_score: item.result.final_score,
    executed_ticks: item.result.executed_ticks,
  }));
  const metrics = buildMetrics(selected, derivedBySelection, counterfactualArtifact, plan);
  const comparisons = buildComparisons(selected, derivedBySelection, counterfactualArtifact);
  const counterfactuals = counterfactualArtifact.cases.map((item) => ({
    case_id: item.case_id,
    criterion_id: item.criterion_id,
    source_selection_id: item.source_selection_id,
    source_policy_role: item.source_policy_role,
    source_gameplay_seed: item.source_gameplay_seed,
    operation: item.operation,
    anchor_event: item.anchor_event,
    anchor_tick: item.anchor_tick,
    lookback_ticks: item.lookback_ticks,
    edit_tick: item.edit_tick,
    pre_edit_equivalent: item.pre_edit_equivalent,
    eligible: item.eligible,
    ineligibility_reasons: item.ineligibility_reasons,
    first_noncontrollable_divergence_tick: item.first_noncontrollable_divergence_tick,
    baseline_terminal: item.baseline_terminal,
    counterfactual_terminal: item.counterfactual_terminal,
    terminal_avoided: item.terminal_avoided,
    terminal_delay_ticks: item.terminal_delay_ticks,
    score_difference: item.score_difference,
    survival_difference: item.survival_difference,
    local_window_ticks: item.local_window_ticks,
    interpretation: item.interpretation,
  }));
  const classification = classifyCriteria(selected, derivedBySelection, counterfactualArtifact, plan);
  const criteria = classification.criteria;
  const hasUnresolvedCriterion = criteria.some((item) => item.ordinal_value == null);
  const bestDerived = derivedBySelection.get("best-private");
  const riskStatus = criteria.find((item) => item.criterion_id === "risk_reward_coupling").status;
  const instrumentConfidence = assessInstrumentConfidence({
    config,
    plan,
    derivedBySelection,
    counterfactualArtifact,
    criteria,
  });
  const instrumentInsufficient = instrumentConfidence.status !== "sufficient";
  const notRankableReasons = [
    ...instrumentConfidence.deficiencies.map((reason) => `instrument_confidence:${reason}`),
    ...classification.unresolved_reasons,
  ];
  const analysisVerdict = instrumentInsufficient
    ? "instrument_insufficient"
    : hasUnresolvedCriterion
      ? "not_applicable"
      : riskStatus === "confirmed"
        ? "risk_reward_supported"
        : riskStatus === "mixed"
          ? "mixed_or_seed_dependent"
          : "reward_without_observed_risk";
  const analysisResult = {
    schema_version: 2,
    artifact_class: "play_log_analysis_result",
    game_id: gameId,
    evaluation_id: plan.evaluation_id,
    status: instrumentInsufficient ? "instrument_insufficient" : "completed",
    trust_class: "simulator_only_unverified",
    provenance: {
      plan_sha256: shaFile(planPath),
      replay_bundle_sha256: shaFile(`${base}/artifacts/play-log-analysis/replay-runtime.private.json`),
      derived_events_sha256: shaFile(`${base}/artifacts/play-log-analysis/derived-events.private.json`),
      counterfactuals_sha256: shaFile(`${base}/artifacts/play-log-analysis/counterfactuals.private.json`),
    },
    selections,
    metrics,
    comparisons,
    counterfactuals,
    instrument_confidence: {
      status: instrumentConfidence.status,
      evidence: instrumentConfidence.evidence,
    },
    verdict: analysisVerdict,
    limitations: limitations(gameId),
    allowed_claims: plan.allowed_claims,
    forbidden_claims: plan.forbidden_claims,
  };
  assertValidArtifact("play_log_analysis_result", analysisResult);
  const analysisPath = `${base}/artifacts/play-log-analysis/analysis-result.json`;
  writeJson(analysisPath, analysisResult);

  const qualityResult = {
    schema_version: 1,
    artifact_class: "play_log_quality_result",
    game_id: gameId,
    evaluation_id: plan.evaluation_id,
    status: instrumentInsufficient
      ? "instrument_insufficient"
      : hasUnresolvedCriterion ? "not_rankable" : "completed",
    trust_class: "simulator_only_unverified",
    analysis_plan_path: planPath,
    analysis_plan_sha256: shaFile(planPath),
    analysis_result_path: analysisPath,
    analysis_result_sha256: shaFile(analysisPath),
    instrument_confidence: instrumentConfidence.status,
    identity_coverage: bestDerived.identity_coverage,
    criteria,
    verdict: instrumentInsufficient
      ? "instrument_insufficient"
      : hasUnresolvedCriterion
        ? "not_applicable"
        : riskStatus === "confirmed"
          ? "risk_reward_coupled"
          : riskStatus === "mixed"
            ? "mixed_or_seed_dependent"
            : "causal_reward_without_observed_risk",
    ...(notRankableReasons.length === 0 ? {} : { not_rankable_reasons: notRankableReasons }),
    unresolved_metrics: [
      "score_to_object_attribution_outside_v3_adjacent_tick_rule",
      "per_object_score_magnitude_attribution",
    ],
    limitations: limitations(gameId),
    allowed_claims: plan.allowed_claims,
    forbidden_claims: plan.forbidden_claims,
  };
  assertValidArtifact("play_log_quality_result", qualityResult);
  writeJson(`${base}/play-log-quality-result.json`, qualityResult);
  const resolvedStop = {
    schema_version: 1,
    artifact_class: "play_log_evaluation_stop",
    game_id: gameId,
    status: "resolved",
    reason_code: "evaluation_completed",
    message: "No unresolved evaluation stop remained after the common play-log evaluation.",
  };
  assertValidArtifact("play_log_evaluation_stop", resolvedStop);
  writeJson(`${base}/artifacts/technical-failure.json`, resolvedStop);
  return { plan, analysisResult, qualityResult };
}

export function writePlayLogTechnicalFailure(config, error) {
  validateEvaluationConfig(config);
  const base = stopArtifactBase(config.planPath);
  const feasibilityPath = `${base}/artifacts/play-log-feasibility.private.json`;
  const status = error?.code === "instrument_insufficient"
    ? "instrument_insufficient"
    : "technical_failure";
  const artifact = {
    schema_version: 1,
    artifact_class: "play_log_evaluation_stop",
    game_id: config.adapter.game_id,
    status,
    reason_code: error?.code ?? "uncaught_evaluation_error",
    message: String(error?.message ?? error),
    error: String(error?.stack ?? error),
    ...(status === "instrument_insufficient" && fs.existsSync(path.resolve(root, feasibilityPath))
      ? {
          feasibility_path: feasibilityPath,
          feasibility_sha256: shaFile(feasibilityPath),
        }
      : {}),
  };
  assertValidArtifact("play_log_evaluation_stop", artifact);
  writeJson(`${base}/artifacts/technical-failure.json`, artifact);
}

const PLAY_LOG_ANALYSIS_SUFFIX = "/artifacts/play-log-analysis";

// The frozen plan owns the output location. Deriving the game output root from `output_directory` keeps the
// declared path authoritative instead of decorative, and fails closed when the plan and the actual layout
// disagree.
function resolveOutputBase(plan) {
  const declared = plan.output_directory;
  if (!declared.endsWith(PLAY_LOG_ANALYSIS_SUFFIX)) {
    throw new Error(`play-log quality plan output_directory must end with ${PLAY_LOG_ANALYSIS_SUFFIX}`);
  }
  const base = declared.slice(0, -PLAY_LOG_ANALYSIS_SUFFIX.length);
  if (base.length === 0) {
    throw new Error("play-log quality plan output_directory requires a game output root");
  }
  return base;
}

// Stop artifacts must also be writable when the plan itself is unreadable or invalid, so fall back to the
// plan directory instead of failing to record the failure.
function stopArtifactBase(planPath) {
  try {
    return resolveOutputBase(readJson(planPath));
  } catch {
    return path.posix.dirname(planPath);
  }
}

function validateEvaluationConfig(config) {
  if (config == null || typeof config !== "object") {
    throw new Error("play-log evaluation config must be an object");
  }
  if (typeof config.adapter?.game_id !== "string") {
    throw new Error("play-log evaluation config requires an adapter");
  }
  if (typeof config.policy?.createController !== "function"
    || typeof config.policy?.toObservation !== "function") {
    throw new Error("play-log evaluation config requires a private policy module");
  }
  if (typeof config.planPath !== "string" || path.isAbsolute(config.planPath)) {
    throw new Error("play-log evaluation config planPath must be workspace-relative");
  }
  if (typeof config.policyPath !== "string" || path.isAbsolute(config.policyPath)) {
    throw new Error("play-log evaluation config policyPath must be workspace-relative");
  }
  if (!Array.isArray(config.requiredCoverage) || config.requiredCoverage.length === 0) {
    throw new Error("play-log evaluation config requires annotation coverage roles");
  }
}

async function runPrivatePool(config, seeds, plan) {
  const steps = seeds.map(() => []);
  const sequences = new Array(seeds.length);
  const results = await simulator.runClosedLoopEpisodes(
    seeds.map((gameplaySeed) => ({
      game_id: config.adapter.game_id,
      gameplay_seed: gameplaySeed,
      duration_ticks: plan.execution.tick_budget,
      timeout_ms: plan.execution.timeout_ms,
    })),
    () => config.policy.createController(config.parameters),
    {
      concurrency: 2,
      toClosedLoopObservation: config.policy.toObservation,
      onPrivateFrame(step, index) { steps[index].push(step); },
      onClosedLoopActionSequence(sequence, index) { sequences[index] = sequence; },
    },
  );
  const replay = await simulator.runEpisodes(results.map((result, index) => ({
    schema_version: 0,
    game_id: config.adapter.game_id,
    gameplay_seed: result.gameplay_seed,
    input_sequence: sequences[index],
    timeout_ms: plan.execution.timeout_ms,
    capture_canvas: false,
  })), { concurrency: 2 });
  return results.map((result, index) => ({
    policy_role: "private_policy",
    result,
    input_sequence: sequences[index],
    private_steps: steps[index],
    release_count: countReleases(sequences[index]),
    exact_replay: hashCanonicalJson(result) === hashCanonicalJson(replay[index]),
  }));
}

async function runCriterionCounterfactuals(config, gameId, sources, criterionId, criterionPlan, plan) {
  const cases = [];
  for (const source of sources) {
    cases.push(...await runSourceCounterfactuals(
      config,
      gameId,
      source,
      criterionId,
      criterionPlan,
      plan,
      cases.length,
    ));
  }
  return cases;
}

async function runSourceCounterfactuals(config, gameId, source, criterionId, criterionPlan, plan, offset) {
  const sourceDerived = derivePlayLogEvents(source.private_steps, plan);
  const operations = resolveCounterfactualOperations(source, criterionPlan);
  const cases = [];
  for (let index = 0; index < operations.length; index++) {
    const resolved = operations[index];
    const { result, privateSteps, inputSequence } = await runCounterfactualBranch(
      config,
      gameId,
      source,
      resolved.input_sequence,
      plan,
    );
    assertHealthyResult(result);
    const derived = derivePlayLogEvents(privateSteps, plan);
    const comparison = compareCounterfactualRun(source, { result, private_steps: privateSteps }, {
      criterionId,
      criterionPlan,
      operation: resolved.operation,
      anchorTick: resolved.anchor_tick,
      editTick: resolved.edit_tick,
      controllableRoles: plan.role_mapping.controllable,
    });
    const sourceLocalReward = localRewardTotal(
      sourceDerived,
      resolved.edit_tick,
      criterionPlan.local_window_ticks,
    );
    const counterfactualLocalReward = localRewardTotal(
      derived,
      resolved.edit_tick,
      criterionPlan.local_window_ticks,
    );
    const rewardDifference = counterfactualLocalReward - sourceLocalReward;
    const sourceLocalExposureRate = localExposureRate(
      sourceDerived,
      resolved.edit_tick,
      criterionPlan.local_window_ticks,
      plan,
    );
    const counterfactualLocalExposureRate = localExposureRate(
      derived,
      resolved.edit_tick,
      criterionPlan.local_window_ticks,
      plan,
    );
    const hazardExposureRateDifference = counterfactualLocalExposureRate - sourceLocalExposureRate;
    cases.push({
      ...comparison,
      case_id: `${{
        causal_input_control: "causal",
        risk_reward_coupling: "risk",
        failure_agency: "failure",
      }[criterionId]}-case-${offset + index + 1}`,
      source_selection_id: source.selection_id,
      source_policy_role: source.policy_role,
      source_gameplay_seed: source.result.gameplay_seed,
      input_sequence: inputSequence,
      result,
      private_steps: privateSteps,
      derived_events: derived,
      local_geometry_diverged: comparison.first_noncontrollable_divergence_tick != null,
      baseline_local_reward: sourceLocalReward,
      counterfactual_local_reward: counterfactualLocalReward,
      baseline_local_hazard_exposure_rate: sourceLocalExposureRate,
      counterfactual_local_hazard_exposure_rate: counterfactualLocalExposureRate,
      reward_difference: rewardDifference,
      hazard_exposure_rate_difference: hazardExposureRateDifference,
      reward_exposure_aligned: rewardDifference !== 0
        && hazardExposureRateDifference !== 0
        && Math.sign(rewardDifference) === Math.sign(hazardExposureRateDifference),
      survival_responsive: comparison.survival_difference !== 0,
      terminal_window_eligible: criterionPlan.anchor_event === "terminal_event"
        && comparison.baseline_terminal.kind === "game_over",
      terminal_delayed_or_avoided: comparison.terminal_avoided
        || (comparison.terminal_delay_ticks ?? 0) > 0,
      strong_failure_branch: comparison.terminal_avoided
        || (comparison.terminal_delay_ticks ?? 0) >= (criterionPlan.minimum_delay_ticks ?? Number.POSITIVE_INFINITY),
      local_window_ticks: criterionPlan.local_window_ticks,
      interpretation: criterionPlan.anchor_event === "terminal_event"
        ? "The edit is bounded to the preregistered lookback before the source terminal; the frozen private policy continues to the frozen tick budget after the edited prefix, so a delayed or avoided terminal is observed under the same budget as the source episode."
        : "The edit is bounded to the preregistered lookback before the reward anchor and interpreted only inside the local window; the frozen private policy continues to the frozen tick budget after the edited prefix.",
    });
  }
  return cases;
}

// A counterfactual branch must be observable past the source terminal, otherwise "the terminal was avoided"
// cannot be distinguished from "the replayed input sequence ran out". The edited prefix is forced tick by
// tick, and the frozen private policy keeps playing to the frozen tick budget afterwards, so the branch is
// judged under the same budget and the same tested policy as its source episode.
async function runCounterfactualBranch(config, gameId, source, editedSequence, plan) {
  const forcedStates = expandPressedStates(editedSequence);
  const privateSteps = [];
  let executedSequence = null;
  const [result] = await simulator.runClosedLoopEpisodes(
    [{
      game_id: gameId,
      gameplay_seed: source.result.gameplay_seed,
      duration_ticks: plan.execution.tick_budget,
      timeout_ms: plan.execution.timeout_ms,
    }],
    () => {
      const controller = config.policy.createController(config.parameters);
      return {
        nextPressed(context) {
          return context.logical_tick < forcedStates.length
            ? forcedStates[context.logical_tick]
            : controller.nextPressed(context);
        },
        observe(observation) {
          return controller.observe(observation);
        },
      };
    },
    {
      concurrency: 1,
      toClosedLoopObservation: config.policy.toObservation,
      onPrivateFrame(step) { privateSteps.push(step); },
      onClosedLoopActionSequence(sequence) { executedSequence = sequence; },
    },
  );
  if (executedSequence == null) throw new Error("counterfactual branch did not record an input sequence");
  const executedStates = expandPressedStates(executedSequence);
  const forcedPrefix = forcedStates.slice(0, executedStates.length);
  if (forcedPrefix.some((pressed, tick) => executedStates[tick] !== pressed)) {
    throw new Error("counterfactual branch did not execute the edited input prefix");
  }
  return { result, privateSteps, inputSequence: executedSequence };
}

function buildMetrics(selected, derivedBySelection, counterfactualArtifact, plan) {
  const metrics = [];
  for (const item of selected) {
    const derived = derivedBySelection.get(item.selection_id);
    const suffix = item.selection_id;
    const attribution = scoreAttribution(item.private_steps, plan);
    const terminalCoherence = terminalSignatureCoherence(item, plan);
    metrics.push(
      metric(`final_score_${suffix}`, item.selection_id, item.result.final_score, "within_game_score"),
      metric(`hazard_exposure_rate_${suffix}`, item.selection_id,
        derived.hazard_exposure_ticks == null ? null : derived.hazard_exposure_ticks / item.result.executed_ticks,
        "fraction_of_executed_ticks"),
      metric(`identity_coverage_${suffix}`, item.selection_id, derived.identity_coverage, "fraction_of_reward_records"),
      metric(`unique_reward_objects_observed_${suffix}`, item.selection_id,
        derived.unique_reward_objects_observed, "episode_local_objects"),
      metric(`score_event_candidate_match_rate_${suffix}`, item.selection_id,
        attribution.candidateMatchRate, "fraction_of_score_delta_ticks"),
      metric(`score_event_unique_attribution_rate_${suffix}`, item.selection_id,
        attribution.uniqueAttributionRate, "fraction_of_score_delta_ticks"),
      metric(`terminal_signature_coherence_${suffix}`, item.selection_id,
        terminalCoherence, "boolean"),
      metric(`tolerance_dependent_contacts_${suffix}`, item.selection_id,
        toleranceDependentContacts(item, plan), "contact_decisions"),
      {
        metric_id: `unique_scoring_objects_attributed_${suffix}`.replaceAll("-", "_"),
        status: attribution.uniqueAttributedObjects == null ? "unresolved" : "available",
        selection_id: item.selection_id,
        estimate: attribution.uniqueAttributedObjects,
        unit: "episode_local_objects",
        evidence: "Adjacent-tick reward identity transition rule frozen in the v2 criterion ladder.",
      },
    );
  }
  for (const item of counterfactualArtifact.cases) {
    const selectionId = item.source_selection_id;
    metrics.push(
      metric(`counterfactual_eligible_${item.case_id}`, selectionId, item.eligible ? 1 : 0, "boolean"),
      metric(`local_nonplayer_divergence_${item.case_id}`, selectionId,
        item.local_geometry_diverged ? 1 : 0, "boolean"),
      metric(`local_reward_change_${item.case_id}`, selectionId, item.reward_difference, "within_game_score"),
      metric(`local_exposure_rate_change_${item.case_id}`, selectionId,
        item.hazard_exposure_rate_difference, "fraction_of_local_executed_ticks"),
      metric(`reward_exposure_alignment_${item.case_id}`, selectionId,
        item.reward_exposure_aligned ? 1 : 0, "boolean"),
      metric(`terminal_window_eligible_${item.case_id}`, selectionId,
        item.terminal_window_eligible ? 1 : 0, "boolean"),
      metric(`terminal_delayed_or_avoided_${item.case_id}`, selectionId,
        item.terminal_delayed_or_avoided ? 1 : 0, "boolean"),
    );
  }
  return metrics;
}

function metric(metricId, selectionId, estimate, unit) {
  return {
    metric_id: metricId.replaceAll("-", "_"),
    status: estimate == null ? "unavailable" : "available",
    selection_id: selectionId,
    estimate,
    unit,
    evidence: "derived-events.private.json",
  };
}

function buildComparisons(selected, derivedBySelection, counterfactualArtifact) {
  const best = selected.find((item) => item.selection_id === "best-private");
  const periodic = selected.find((item) => item.selection_id === "same-seed-periodic");
  const bestDerived = derivedBySelection.get(best.selection_id);
  const periodicDerived = derivedBySelection.get(periodic.selection_id);
  const riskCases = counterfactualArtifact.cases
    .filter((item) => item.criterion_id === "risk_reward_coupling");
  const bestRate = bestDerived.hazard_exposure_ticks / best.result.executed_ticks;
  const periodicRate = periodicDerived.hazard_exposure_ticks / periodic.result.executed_ticks;
  return [
    comparison("best-vs-periodic-exposure-rate", "hazard_exposure_rate", bestRate - periodicRate),
    comparison("eligible-counterfactual-count", "counterfactual_eligible_count",
      riskCases.filter((item) => item.eligible).length),
    comparison("aligned-risk-reward-pair-count", "aligned_risk_reward_pair_count",
      riskCases.filter((item) => item.reward_exposure_aligned).length),
  ];
}

function comparison(comparisonId, metricId, estimate) {
  return {
    comparison_id: comparisonId,
    left_selection_id: "best-private",
    right_selection_id: "same-seed-periodic",
    metric_id: metricId,
    estimate: Number.isFinite(estimate) ? estimate : null,
    outcome: Number.isFinite(estimate) && estimate !== 0 ? "supported" : "indeterminate",
  };
}

function classifyCriteria(selected, derivedBySelection, counterfactualArtifact, plan) {
  const privateSelections = selected.filter((item) => item.policy_role === "private_policy");
  const best = selected.find((item) => item.selection_id === "best-private");
  const cases = counterfactualArtifact.cases
    .filter((item) => item.criterion_id === "causal_input_control");
  const riskCases = counterfactualArtifact.cases
    .filter((item) => item.criterion_id === "risk_reward_coupling");
  const failureCases = counterfactualArtifact.cases
    .filter((item) => item.criterion_id === "failure_agency");

  const causalReplication = plan.counterfactual_plans.causal_input_control.minimum_replication_seeds ?? 1;
  const eligible = cases.filter((item) => item.eligible);
  const causalSatisfied = eligible.filter((item) =>
    item.local_geometry_diverged
    && (item.reward_difference !== 0
      || item.survival_difference !== 0
      || item.result.termination.kind !== best.result.termination.kind));
  // Replication is a seed count, not a case count: several edits inside one episode still describe one seed.
  const causalSeeds = seedSpan(causalSatisfied);
  // Replication is required symmetrically. A verdict of any kind — including contradicted — resting on one
  // analysis seed is a statement about that seed, so it stays unresolved and the game leaves the ranking.
  const causalStatus = eligible.length < 2 || seedSpan(eligible) < causalReplication
    ? "unresolved"
    : causalSatisfied.length >= 2 && causalSeeds >= causalReplication
      ? "confirmed"
      : causalSatisfied.length >= 1 || eligible.filter((item) => item.local_geometry_diverged).length > 0
        ? "mixed"
        : "contradicted";

  const riskEligible = riskCases.filter((item) => item.eligible).filter((item) =>
    item.baseline_local_reward !== 0
    && Number.isFinite(item.baseline_local_hazard_exposure_rate)
    && Number.isFinite(item.counterfactual_local_hazard_exposure_rate));
  const aligned = riskEligible.filter((item) => item.reward_exposure_aligned);
  const reverse = riskEligible.filter((item) =>
    item.reward_difference !== 0
    && item.hazard_exposure_rate_difference !== 0
    && Math.sign(item.reward_difference) !== Math.sign(item.hazard_exposure_rate_difference));
  const rewardResponsive = riskEligible.filter((item) => item.reward_difference !== 0);
  // With no local reward variation at all there is nothing to couple to exposure, so the criterion is
  // unmeasured rather than partially supported. Scoring it `mixed` would hand out a point for zero evidence.
  const riskReplication = plan.counterfactual_plans.risk_reward_coupling.minimum_replication_seeds ?? 1;
  const riskStatus = riskEligible.length < 2 || seedSpan(riskEligible) < riskReplication
    ? "unresolved"
    : rewardResponsive.length === 0
      ? "unresolved"
      : aligned.length >= 2 && reverse.length === 0 && seedSpan(aligned) >= riskReplication
        ? "confirmed"
        : aligned.length > 0 || reverse.length > 0
          ? "mixed"
          : rewardResponsive.length >= 2
            ? "contradicted"
            : "mixed";

  const failureClassification = classifyFailureAgencyCases(
    failureCases,
    plan.counterfactual_plans.failure_agency,
  );
  const failureStatus = failureClassification.status;

  const outcome = classifyOutcomeCoherence(privateSelections, plan);
  const firstCaseId = cases[0]?.case_id;
  const firstRiskCaseId = riskCases[0]?.case_id;
  const firstTerminalCaseId = failureCases[0]?.case_id;
  const causalEvidence = [
    ...(firstCaseId == null ? [] : [
      `counterfactual:${firstCaseId}`,
      `metric:local_nonplayer_divergence_${firstCaseId.replaceAll("-", "_")}`,
    ]),
    "selection:best-private",
  ];
  const riskEvidence = [
    "comparison:aligned-risk-reward-pair-count",
    ...(firstRiskCaseId == null ? [] : [
      `metric:reward_exposure_alignment_${firstRiskCaseId.replaceAll("-", "_")}`,
    ]),
  ];
  const failureEvidence = [
    ...(selected.some((item) => item.selection_id === "failure-source-private")
      ? ["selection:failure-source-private"]
      : ["selection:low-or-failure-private"]),
    ...(firstTerminalCaseId == null ? [] : [
      `metric:terminal_delayed_or_avoided_${firstTerminalCaseId.replaceAll("-", "_")}`,
      `counterfactual:${firstTerminalCaseId}`,
    ]),
  ];
  const unresolvedReasons = [
    ...(causalStatus === "unresolved"
      ? [`causal_input_control:${eligible.length < 2
        ? `fewer_than_minimum_eligible_cases:${eligible.length}`
        : `fewer_than_minimum_replication_seeds:${seedSpan(eligible)}`}`]
      : []),
    ...(riskStatus === "unresolved"
      ? [`risk_reward_coupling:${riskEligible.length < 2
        ? `fewer_than_minimum_eligible_cases:${riskEligible.length}`
        : seedSpan(riskEligible) < riskReplication
          ? `fewer_than_minimum_replication_seeds:${seedSpan(riskEligible)}`
          : "no_local_reward_variation"}`]
      : []),
    ...(failureStatus === "unresolved" ? [`failure_agency:${failureClassification.reason}`] : []),
    ...(outcome.status === "unresolved"
      ? (outcome.reasons ?? []).map((reason) => `outcome_coherence:${reason}`)
      : []),
  ];
  const criteria = [
    criterion("causal_input_control", causalStatus,
      causalEvidence,
      `${causalSatisfied.length}/${eligible.length} eligible edits across ${seedSpan(eligible)} analysis seeds changed both non-controllable local state and a relevant outcome, on ${causalSeeds} distinct seeds.`
      + (causalStatus === "unresolved" ? " Fewer eligible bounded edits than the frozen minimum." : "")),
    criterion("risk_reward_coupling", riskStatus,
      riskEvidence,
      `${aligned.length}/${riskEligible.length} eligible local reward pairs changed reward and normalized hazard exposure in the same direction on ${seedSpan(aligned)} distinct seeds; reverse pairs: ${reverse.length}.`
      + (riskStatus === "unresolved"
        ? riskEligible.length < 2
          ? " Fewer eligible reward-bearing edits than the frozen minimum."
          : " No eligible edit changed local reward, so there was nothing to couple to exposure."
        : "")),
    criterion("failure_agency", failureStatus,
      failureEvidence,
      `${failureClassification.delayed_or_avoided_count}/${failureClassification.eligible_count} eligible terminal-anchored edits delayed or avoided terminal after non-controllable divergence; strong branches: ${failureClassification.strong_count}.`),
    criterion("outcome_coherence", outcome.status,
      ["metric:score_event_unique_attribution_rate_best_private", "metric:terminal_signature_coherence_best_private", "selection:best-private"],
      outcome.rationale),
  ];
  return { criteria, unresolved_reasons: unresolvedReasons };
}

function seedSpan(cases) {
  return new Set(cases.map((item) => item.source_gameplay_seed)).size;
}

function criterion(criterionId, status, evidenceIds, rationale) {
  return {
    criterion_id: criterionId,
    status,
    ordinal_value: { confirmed: 2, mixed: 1, contradicted: 0, unresolved: null }[status],
    evidence_ids: status === "unresolved" ? evidenceIds : evidenceIds,
    rationale,
  };
}

function selectedPrivate(selectionId, episode) {
  return { selection_id: selectionId, ...episode };
}

function selectedControl(selectionId, entry, stepMap) {
  return {
    selection_id: selectionId,
    policy_role: entry.policy_role,
    result: entry.result,
    input_sequence: entry.request.input_sequence,
    private_steps: stepMap.get(baselineKey(entry.request.gameplay_seed, entry.policy_role)),
    release_count: countReleases(entry.request.input_sequence),
    exact_replay: true,
  };
}

function compareEpisodes(left, right) {
  return compareResults(left.result, right.result)
    || left.release_count - right.release_count
    || left.result.gameplay_seed - right.result.gameplay_seed;
}

function compareResults(left, right) {
  return right.final_score - left.final_score || right.executed_ticks - left.executed_ticks;
}

function assertHealthyPrivatePool(pool, requiredCoverage, requireMechanicalEvent = true) {
  if (pool.some((item) => !item.exact_replay)) throw new Error("private policy exact replay failed");
  for (const item of pool) assertHealthyResult(item.result);
  const observed = new Set(pool.flatMap((item) => item.private_steps.flatMap((step) =>
    (step.privateDrawing?.records ?? []).flatMap((record) =>
      subjectRole(record.subject) == null ? [] : [subjectRole(record.subject)]))));
  const missing = requiredCoverage.filter((role) => !observed.has(role));
  if (missing.length > 0) throw new Error(`required annotation coverage missing: ${missing.join(", ")}`);
  const reachedMechanicalEvent = pool.some((item) =>
    item.result.final_score !== 0
    || item.result.termination.kind === "game_over"
    || item.private_steps.some((step) => (step.privateDrawing?.records ?? []).length > 1));
  if (requireMechanicalEvent && !reachedMechanicalEvent) {
    throw new Error("private policy did not reach a qualifying mechanical event");
  }
}

function assertHealthyResult(result) {
  if (["runtime_error", "load_error", "timeout"].includes(result.termination.kind)) {
    throw new Error(`technical episode termination: ${result.termination.kind}`);
  }
  if (result.frames.length !== result.executed_ticks) throw new Error("episode frame count mismatch");
  if (Object.values(result.diagnostics).some((messages) => messages.length > 0)) {
    throw new Error("runtime diagnostic was not empty");
  }
}

function summarizePool(pool) {
  return {
    schema_version: 1,
    artifact_class: "private_policy_qualification",
    game_id: pool[0].result.game_id,
    exact_replay_passed: pool.every((item) => item.exact_replay),
    episodes: pool.map((item) => ({
      gameplay_seed: item.result.gameplay_seed,
      final_score: item.result.final_score,
      executed_ticks: item.result.executed_ticks,
      termination: item.result.termination,
      release_count: item.release_count,
      exact_replay: item.exact_replay,
    })),
  };
}

function countReleases(inputSequence) {
  return inputSequence.transitions.filter((item) => item.pressed === false && item.tick > 0).length;
}

function localRewardTotal(derived, startTick, windowTicks) {
  return derived.events
    .filter((event) => event.event === "score_delta")
    .filter((event) => event.logical_tick >= startTick && event.logical_tick <= startTick + windowTicks)
    .reduce((sum, event) => sum + event.value, 0);
}

function localExposureRate(derived, startTick, windowTicks, plan) {
  if (plan.risk_measurement.mode === "indicator_displacement") {
    const threshold = plan.risk_measurement.indicator_exposure_threshold;
    if (threshold == null) return null;
    const displacements = derived.events
      .filter((event) => event.event === "indicator_displacement")
      .filter((event) => event.logical_tick >= startTick && event.logical_tick <= startTick + windowTicks);
    if (displacements.length === 0) return null;
    return displacements.filter((event) => event.value >= threshold).length / displacements.length;
  }
  const threshold = plan.risk_measurement.hazard_exposure_clearance_threshold;
  if (threshold == null) return null;
  const clearances = derived.events
    .filter((event) => event.event === "hazard_clearance")
    .filter((event) => event.logical_tick >= startTick && event.logical_tick <= startTick + windowTicks);
  if (clearances.length === 0) return null;
  return clearances.filter((event) => event.value <= threshold).length / clearances.length;
}

function scoreAttribution(steps, plan) {
  const rewardRoles = new Set(plan.role_mapping.rewards);
  const controllableRoles = new Set(plan.role_mapping.controllable);
  const tolerance = plan.contact_tolerance ?? 0;
  const rewardKey = (record) => {
    const subject = record.subject;
    return subject?.kind === "object" && rewardRoles.has(subject.type)
      ? `${subject.type}:${subject.episodeRef}`
      : null;
  };
  const rewardSets = steps.map((step) => new Set((step.privateDrawing?.records ?? [])
    .flatMap((record) => (rewardKey(record) == null ? [] : [rewardKey(record)]))));
  // Contact candidates cover scoring that never produces a spawn/despawn transition — drilling, riding, or
  // holding a zone scores tick after tick while the same object stays on screen. Without them a continuous
  // scoring game looks unattributable even though the causing object is visibly in contact.
  const contactSets = steps.map((step) => {
    const records = step.privateDrawing?.records ?? [];
    const controllable = records.filter((record) => controllableRoles.has(subjectRole(record.subject)));
    if (controllable.length === 0) return new Set();
    return new Set(records.flatMap((record) => {
      const key = rewardKey(record);
      if (key == null) return [];
      return controllable.some((subject) => isInContact(subject, record, tolerance)) ? [key] : [];
    }));
  });
  let previousScore = 0;
  let totalScoreEvents = 0;
  let candidateMatches = 0;
  let uniqueMatches = 0;
  const uniqueObjects = new Set();
  for (let tick = 0; tick < steps.length; tick++) {
    const scoreDelta = steps[tick].score - previousScore;
    previousScore = steps[tick].score;
    if (scoreDelta === 0) continue;
    totalScoreEvents++;
    const previous = rewardSets[tick - 1] ?? new Set();
    const current = rewardSets[tick] ?? new Set();
    const next = rewardSets[tick + 1] ?? new Set();
    const appeared = [...current].filter((key) => !previous.has(key));
    const disappearedAtScore = [...previous].filter((key) => !current.has(key));
    const disappearedAfterScore = [...current].filter((key) => !next.has(key));
    const inContact = [...(contactSets[tick] ?? new Set())];
    const candidates = [...new Set([
      ...appeared,
      ...disappearedAtScore,
      ...disappearedAfterScore,
      ...inContact,
    ])];
    if (candidates.length > 0) candidateMatches++;
    if (candidates.length === 1) {
      uniqueMatches++;
      uniqueObjects.add(candidates[0]);
    }
  }
  return {
    totalScoreEvents,
    candidateMatchRate: totalScoreEvents === 0 ? null : candidateMatches / totalScoreEvents,
    uniqueAttributionRate: totalScoreEvents === 0 ? null : uniqueMatches / totalScoreEvents,
    uniqueAttributedObjects: totalScoreEvents === 0 ? null : uniqueObjects.size,
  };
}

// Terminal signatures separate "the terminal contradicts the annotated world" from "the annotation cannot
// explain the terminal". Only the former is evidence against the game; the latter is an instrument limit and
// must stay unresolved instead of scoring zero. Boundary tests use the runtime-observed view rectangle, so
// games with a non-default `options.viewSize` are neither over- nor under-detected.
function terminalSignature(item, plan) {
  if (item.result.termination.kind !== "game_over") return "no_terminal";
  const step = item.private_steps.at(-1);
  if (step == null || step.phase !== "gameOver") return "phase_mismatch";
  const controllableRoles = new Set(plan.role_mapping.controllable);
  const hazardRoles = new Set(plan.role_mapping.hazards);
  const records = step.privateDrawing?.records ?? [];
  const controllable = records.filter((record) => controllableRoles.has(subjectRole(record.subject)));
  const hazards = records.filter((record) => hazardRoles.has(subjectRole(record.subject)));
  if (controllable.length === 0) return "unmapped";
  const tolerance = plan.contact_tolerance ?? 0;
  if (controllable.some((left) => hazards.some((right) => isInContact(left, right, tolerance)))) {
    return "hazard_contact";
  }
  const viewSize = item.result.view_size;
  if (viewSize != null && controllable.some((record) =>
    record.pos.y <= 0 || record.pos.y + record.size.y >= viewSize.y
    || record.pos.x <= 0 || record.pos.x + record.size.x >= viewSize.x)) {
    return "view_boundary";
  }
  return "unmapped";
}

const COHERENT_TERMINAL_SIGNATURES = new Set(["no_terminal", "hazard_contact", "view_boundary"]);

function terminalSignatureCoherence(item, plan) {
  const signature = terminalSignature(item, plan);
  if (signature === "unmapped") return null;
  return COHERENT_TERMINAL_SIGNATURES.has(signature) ? 1 : 0;
}

// Makes the frozen `contact_tolerance` auditable: how many contact decisions in this episode were true only
// because of it. A tolerance that never changes a decision is an unused tuning knob, and the reader can see
// that from the result instead of having to trust the plan's justification.
function toleranceDependentContacts(item, plan) {
  const tolerance = plan.contact_tolerance ?? 0;
  if (tolerance === 0) return 0;
  const controllableRoles = new Set(plan.role_mapping.controllable);
  const otherRoles = new Set([...plan.role_mapping.hazards, ...(plan.role_mapping.rewards ?? [])]);
  let count = 0;
  for (const step of item.private_steps) {
    const records = step.privateDrawing?.records ?? [];
    const controllable = records.filter((record) => controllableRoles.has(subjectRole(record.subject)));
    for (const record of records) {
      if (!otherRoles.has(subjectRole(record.subject))) continue;
      for (const subject of controllable) {
        if (isInContact(subject, record, tolerance) && !isInContact(subject, record, 0)) count++;
      }
    }
  }
  return count;
}

function hasRewardRecords(item, plan) {
  const rewardRoles = new Set(plan.role_mapping.rewards ?? []);
  return item.private_steps.some((step) => (step.privateDrawing?.records ?? [])
    .some((record) => rewardRoles.has(subjectRole(record.subject))));
}

// Score/collision/terminal coherence can be contradicted only by positive evidence: a terminal whose phase
// disagrees with the annotated frame, or score events that never coincide with observed reward objects.
// Everything else that cannot be measured stays unresolved, which keeps the game out of the ranking instead
// of giving it a zero it did not earn.
function classifyOutcomeCoherence(privateSelections, plan) {
  const attributions = privateSelections.map((item) => scoreAttribution(item.private_steps, plan));
  const signatures = privateSelections.map((item) => terminalSignature(item, plan));
  const scored = attributions.filter((item) => item.totalScoreEvents > 0);
  const rewardRolesDeclared = (plan.role_mapping.rewards ?? []).length > 0;
  const rewardRecordsObserved = privateSelections.some((item) => hasRewardRecords(item, plan));
  const signatureSummary = `terminal signatures: ${signatures.join(", ")}`;

  if (signatures.includes("phase_mismatch")) {
    return {
      status: "contradicted",
      rationale: `A terminal episode ended without a game-over annotation frame (${signatureSummary}).`,
    };
  }
  if (rewardRolesDeclared && rewardRecordsObserved && scored.length > 0
    && scored.every((item) => item.candidateMatchRate === 0)) {
    return {
      status: "contradicted",
      rationale: `${scored.length} scored private selections produced score events that never coincided with an observed reward object (${signatureSummary}).`,
    };
  }

  const reasons = [];
  if (signatures.includes("unmapped")) reasons.push("terminal_not_mappable_to_annotated_roles");
  if (!rewardRolesDeclared) reasons.push("no_reward_role_declared");
  else if (!rewardRecordsObserved) reasons.push("no_reward_records_observed");
  if (scored.length === 0) reasons.push("no_score_events_in_private_selections");
  if (reasons.length > 0) {
    return {
      status: "unresolved",
      reasons,
      rationale: `Outcome coherence could not be measured (${reasons.join(", ")}; ${signatureSummary}).`,
    };
  }

  const uniquelyAttributed = scored.filter((item) => item.uniqueAttributionRate === 1);
  if (uniquelyAttributed.length === scored.length) {
    return {
      status: "confirmed",
      rationale: `${uniquelyAttributed.length}/${scored.length} scored private selections had complete unique adjacent-tick or contact attribution (${signatureSummary}).`,
    };
  }
  if (scored.some((item) => (item.candidateMatchRate ?? 0) > 0)) {
    return {
      status: "mixed",
      rationale: `${uniquelyAttributed.length}/${scored.length} scored private selections had complete unique adjacent-tick or contact attribution (${signatureSummary}).`,
    };
  }
  return {
    status: "unresolved",
    reasons: ["score_attribution_candidates_unavailable"],
    rationale: `No score event could be matched to an observed reward object (${signatureSummary}).`,
  };
}

// Instrument confidence is derived, never assumed: without it the ranking gate on
// `instrument_confidence !== "sufficient"` can never fire.
function assessInstrumentConfidence({ config, plan, derivedBySelection, counterfactualArtifact, criteria }) {
  const best = derivedBySelection.get("best-private");
  const eligibleCases = counterfactualArtifact.cases.filter((item) => item.eligible);
  const deficiencies = [];
  if (eligibleCases.length === 0) deficiencies.push("no_eligible_counterfactual_case");
  if ((plan.role_mapping.rewards ?? []).length > 0 && !(best.identity_coverage > 0)) {
    deficiencies.push("reward_identity_coverage_zero");
  }
  if (criteria.every((item) => item.ordinal_value == null)) deficiencies.push("no_resolved_criterion");
  return {
    status: deficiencies.length === 0 ? "sufficient" : "insufficient",
    deficiencies,
    evidence: [
      "All selected episodes reproduced with exact_result_v1.",
      `Required annotation types were observed: ${config.requiredCoverage.join(", ")}.`,
      `Best episode reward identity coverage was ${best.identity_coverage}.`,
      `${eligibleCases.length} bounded counterfactual edits were eligible after pre-edit equivalence checks.`,
      "Criterion-specific, terminal-anchored counterfactuals and duration-normalized hazard exposure were computed from private drawing annotations.",
      ...deficiencies.map((reason) => `Instrument deficiency: ${reason}.`),
    ],
  };
}

function subjectRole(subject) {
  if (subject?.kind === "group") return subject.label;
  if (subject?.kind === "descriptor" || subject?.kind === "object") return subject.type ?? null;
  return null;
}

function limitations(gameId) {
  return [
    `${gameId} was tested only in the fixed fresh-Node-VM simulator with the frozen policy, seeds, and tick budget.`,
    "Diagnostic-control score and private-policy advantage are descriptive and do not contribute to quality criteria.",
    "Hazard comparison uses exposure ticks normalized by executed ticks; the absolute clearance threshold is frozen per game and is not comparable across games.",
    "Structural divergence compares non-controllable annotation records together with runtime phase and score, not geometry alone.",
    "Counterfactual branches force the edited input prefix and then continue under the frozen private policy to the frozen tick budget.",
    "Observed reward-object counts are not scoring opportunities or uniquely attributed scoring causes.",
    "Rendered appearance, perceptual clarity, audio, human experience, and distribution-runtime compatibility were not evaluated.",
  ];
}

function baselineKey(seed, role) {
  return `${seed}:${role}`;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(root, relativePath), "utf8"));
}

function writeJson(relativePath, value, options = {}) {
  const absolute = path.resolve(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  const serialized = options.compact
    ? `${JSON.stringify(value)}\n`
    : `${JSON.stringify(value, null, 2)}\n`;
  fs.writeFileSync(absolute, serialized);
}

function shaFile(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.resolve(root, relativePath))).digest("hex");
}
