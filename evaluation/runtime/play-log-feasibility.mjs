import {
  resolveCounterfactualOperations,
  selectCounterfactualSource,
} from "./counterfactual-evaluation.mjs";
import { derivePlayLogEvents } from "./play-log-analysis.mjs";

const criterionIds = Object.freeze([
  "causal_input_control",
  "risk_reward_coupling",
  "failure_agency",
]);

export class PlayLogInstrumentInsufficientError extends Error {
  constructor(artifact) {
    super(`play-log feasibility failed: ${artifact.reasons.join("; ")}`);
    this.name = "PlayLogInstrumentInsufficientError";
    this.code = "instrument_insufficient";
    this.feasibility = artifact;
  }
}

export function assessPlayLogFeasibility({
  qualification,
  plan,
  qualityPlanSha256,
  requiredCoverage,
}) {
  const sorted = [...qualification].sort(compareEpisodes);
  const best = sorted[0] == null
    ? null
    : { ...sorted[0], selection_id: "best-private" };
  const pool = qualification.map((episode) => (
    episode === sorted[0] ? best : episode
  ));
  const observedCoverage = annotationCoverage(qualification);
  const missingCoverage = requiredCoverage.filter((role) => !observedCoverage.includes(role));
  const checks = criterionIds.map((criterionId) => {
    const criterionPlan = plan.counterfactual_plans[criterionId];
    const source = criterionId === "failure_agency"
      ? selectCounterfactualSource(pool, criterionPlan)
      : best;
    const operations = source == null
      ? []
      : resolveCounterfactualOperations(source, criterionPlan);
    const sourceRiskSampleCount = criterionId === "risk_reward_coupling" && source != null
      ? countRiskSamples(source, operations, criterionPlan, plan)
      : null;
    // Probe-ability across every development episode, not just the one that happens to be selected. This is
    // the number an agent needs before freezing the plan: if only one development episode can carry the
    // frozen edits, the criterion will be unresolved on the analysis pool however the seeds fall, and the
    // fix belongs in the annotation plan, the policy, or the operation set — not in the source rule.
    const probeable = qualification
      .filter((episode) => criterionId !== "failure_agency"
        || episode.result?.termination?.kind === "game_over")
      .map((episode) => ({
        gameplay_seed: episode.result.gameplay_seed,
        generated_case_count: resolveCounterfactualOperations(episode, criterionPlan).length,
      }))
      .sort((left, right) => left.gameplay_seed - right.gameplay_seed);
    const replication = criterionPlan.minimum_replication_seeds ?? 1;
    const replicationReady = probeable
      .filter((item) => item.generated_case_count >= criterionPlan.minimum_eligible_cases).length;
    const reasons = [];
    if (replicationReady < replication) {
      reasons.push("fewer_development_episodes_than_minimum_replication_seeds");
    }
    if (source == null) reasons.push(
      criterionId === "failure_agency"
        ? "terminal_private_source_missing"
        : "counterfactual_source_missing",
    );
    if (operations.length < criterionPlan.minimum_eligible_cases) {
      reasons.push("fewer_than_minimum_generated_cases");
    }
    if (criterionId === "risk_reward_coupling" && sourceRiskSampleCount === 0) {
      reasons.push("finite_source_risk_sample_missing");
    }
    return {
      criterion_id: criterionId,
      source_available: source != null,
      anchor_tick: operations[0]?.anchor_tick ?? null,
      generated_case_count: operations.length,
      minimum_eligible_cases: criterionPlan.minimum_eligible_cases,
      source_risk_sample_count: sourceRiskSampleCount,
      probeable_development_episodes: probeable,
      minimum_replication_seeds: replication,
      replication_ready_episode_count: replicationReady,
      status: reasons.length === 0 ? "ready" : "insufficient",
      reasons,
    };
  });
  const reasons = [
    ...missingCoverage.map((role) => `required_annotation_coverage_missing:${role}`),
    ...checks.flatMap((check) =>
      check.reasons.map((reason) => `${check.criterion_id}:${reason}`)),
  ];
  const artifact = {
    schema_version: 1,
    artifact_class: "private_play_log_feasibility",
    game_id: plan.game_id,
    evaluation_id: plan.evaluation_id,
    trust_class: "simulator_only_unverified",
    quality_plan_sha256: qualityPlanSha256,
    development_seeds: plan.seed_plan.development,
    analysis_seed_accessed: false,
    formal_verdict_generated: false,
    required_annotation_coverage: [...requiredCoverage],
    observed_annotation_coverage: observedCoverage,
    checks,
    status: reasons.length === 0 ? "passed" : "instrument_insufficient",
    reasons,
  };
  return artifact;
}

function countRiskSamples(source, operations, criterionPlan, plan) {
  const mode = plan.risk_measurement.mode ?? "hazard_clearance";
  const threshold = mode === "indicator_displacement"
    ? plan.risk_measurement.indicator_exposure_threshold
    : plan.risk_measurement.hazard_exposure_clearance_threshold;
  if (!Number.isFinite(threshold)) return 0;
  const eventName = mode === "indicator_displacement"
    ? "indicator_displacement"
    : "hazard_clearance";
  const derived = derivePlayLogEvents(source.private_steps, plan);
  return operations.reduce((count, operation) => count + derived.events.filter((event) =>
    event.event === eventName
      && Number.isFinite(event.value)
      && event.logical_tick >= operation.edit_tick
      && event.logical_tick <= operation.edit_tick + criterionPlan.local_window_ticks).length, 0);
}

function annotationCoverage(pool) {
  return [...new Set(pool.flatMap((item) => item.private_steps.flatMap((step) =>
    (step.privateDrawing?.records ?? []).flatMap((record) => {
      const subject = record.subject;
      const role = subject?.kind === "group"
        ? subject.label
        : subject?.kind === "descriptor" || subject?.kind === "object"
          ? subject.type ?? null
          : null;
      return role == null ? [] : [role];
    }))))].sort();
}

function compareEpisodes(left, right) {
  return right.result.final_score - left.result.final_score
    || right.result.executed_ticks - left.result.executed_ticks
    || left.release_count - right.release_count
    || left.result.gameplay_seed - right.result.gameplay_seed;
}
