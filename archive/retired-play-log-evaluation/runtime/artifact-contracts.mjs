import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const schemaFiles = Object.freeze({
  game_manifest: "game-manifest.v1.schema.json",
  annotation_plan: "annotation-plan.private.v1.schema.json",
  play_log_analysis_result: Object.freeze({
    1: "play-log-analysis-result.v1.schema.json",
    2: "play-log-analysis-result.v2.schema.json",
  }),
  play_log_quality_plan: Object.freeze({
    1: "play-log-quality-plan.private.v1.schema.json",
    2: "play-log-quality-plan.private.v2.schema.json",
  }),
  play_log_quality_result: "play-log-quality-result.v1.schema.json",
  play_log_feasibility: "play-log-feasibility.private.v1.schema.json",
  play_log_evaluation_stop: "play-log-evaluation-stop.v1.schema.json",
  play_log_ranking_contract: "play-log-ranking-contract.v1.schema.json",
  play_log_ranking_result: "play-log-ranking-result.v1.schema.json",
  play_log_ranking_hashes: "play-log-ranking-hashes.v1.schema.json",
});
const ajv = new Ajv2020({ allErrors: true, strict: true });
const validators = new Map(Object.entries(schemaFiles).map(([kind, fileOrVersions]) => {
  if (typeof fileOrVersions === "string") return [kind, compile(fileOrVersions)];
  return [kind, new Map(Object.entries(fileOrVersions).map(([version, file]) => [
    Number(version),
    compile(file),
  ]))];
}));

export function validateArtifact(kind, value) {
  const registered = validators.get(kind);
  if (registered == null) throw new Error(`Unknown artifact contract: ${kind}`);
  const validate = registered instanceof Map ? registered.get(value?.schema_version) : registered;
  if (validate == null) return [`unsupported ${kind} schema_version: ${value?.schema_version}`];
  const errors = validate(value)
    ? []
    : (validate.errors ?? []).map((error) => `${error.instancePath || "/"} ${error.message}`);
  errors.push(...crossFieldErrors(kind, value));
  return [...new Set(errors)];
}

export function assertValidArtifact(kind, value) {
  const errors = validateArtifact(kind, value);
  if (errors.length > 0) throw new Error(`Invalid ${kind}: ${errors.join("; ")}`);
  return value;
}

export const artifactContractKinds = Object.freeze(Object.keys(schemaFiles));

function crossFieldErrors(kind, value) {
  if (kind === "annotation_plan") {
    return duplicateErrors(value?.scopes?.map((scope) => scope.scope_id), "scope_id");
  }
  if (kind === "play_log_analysis_result") {
    const errors = [
      ...duplicateErrors(value?.selections?.map((selection) => selection.selection_id), "analysis selection_id"),
      ...duplicateErrors(value?.comparisons?.map((comparison) => comparison.comparison_id), "analysis comparison_id"),
      ...duplicateErrors(value?.counterfactuals?.map((item) => item.case_id), "analysis counterfactual case_id"),
    ];
    if (value?.schema_version === 2) {
      for (const item of value.counterfactuals ?? []) {
        if (item.eligible && (!item.pre_edit_equivalent || item.ineligibility_reasons.length > 0)) {
          errors.push(`eligible counterfactual ${item.case_id} requires pre-edit equivalence and no ineligibility reasons`);
        }
        if (item.edit_tick < item.anchor_tick - item.lookback_ticks || item.edit_tick >= item.anchor_tick) {
          errors.push(`counterfactual ${item.case_id} edit_tick must be inside the frozen anchor lookback`);
        }
        if (item.criterion_id === "failure_agency" && item.baseline_terminal.kind !== "game_over") {
          errors.push(`failure counterfactual ${item.case_id} requires a game-over baseline`);
        }
        if (item.terminal_avoided !== (item.baseline_terminal.kind === "game_over"
          && item.counterfactual_terminal.kind !== "game_over")) {
          errors.push(`counterfactual ${item.case_id} terminal_avoided is inconsistent`);
        }
      }
    }
    return errors;
  }
  if (kind === "play_log_quality_plan") {
    const errors = duplicateErrors(value?.criterion_rules?.map((rule) => rule.criterion_id), "quality plan criterion_id");
    errors.push(...overlapErrors(value?.seed_plan?.development, value?.seed_plan?.analysis, "development", "analysis"));
    const risk = value?.risk_measurement;
    if (risk?.mode === "indicator_displacement") {
      for (const field of [
        "indicator_role",
        "indicator_axis",
        "indicator_neutral",
        "indicator_exposure_threshold",
      ]) {
        if (risk[field] == null) errors.push(`indicator_displacement risk measurement requires ${field}`);
      }
    }
    for (const criterionId of [
      "causal_input_control",
      "risk_reward_coupling",
      "failure_agency",
      "outcome_coherence",
    ]) {
      if (!(value?.criterion_rules ?? []).some((rule) => rule.criterion_id === criterionId)) {
        errors.push(`quality plan criterion_rules must include ${criterionId}`);
      }
    }
    for (const claim of ["human_fun", "human_fairness", "perceptual_quality", "distribution_runtime_compatibility"]) {
      if (!(value?.forbidden_claims ?? []).includes(claim)) errors.push(`quality plan forbidden_claims must include ${claim}`);
    }
    if (value?.schema_version === 2) {
      for (const [criterionId, counterfactualPlan] of Object.entries(value.counterfactual_plans ?? {})) {
        if (counterfactualPlan.minimum_eligible_cases > counterfactualPlan.max_cases) {
          errors.push(`${criterionId} minimum_eligible_cases cannot exceed max_cases`);
        }
      }
    }
    return errors;
  }
  if (kind === "play_log_quality_result") {
    const errors = duplicateErrors(value?.criteria?.map((criterion) => criterion.criterion_id), "quality criterion_id");
    const required = [
      "causal_input_control",
      "risk_reward_coupling",
      "failure_agency",
      "outcome_coherence",
    ];
    for (const criterionId of required) {
      if (!(value?.criteria ?? []).some((criterion) => criterion.criterion_id === criterionId)) {
        errors.push(`quality criteria must include ${criterionId}`);
      }
    }
    const ordinal = { confirmed: 2, mixed: 1, contradicted: 0, unresolved: null, not_applicable: null };
    for (const criterion of value?.criteria ?? []) {
      if (criterion.ordinal_value !== ordinal[criterion.status]) {
        errors.push(`ordinal_value for ${criterion.criterion_id} must match ${criterion.status}`);
      }
      if (["confirmed", "mixed", "contradicted"].includes(criterion.status) && criterion.evidence_ids.length === 0) {
        errors.push(`quality criterion ${criterion.criterion_id} requires evidence_ids`);
      }
    }
    if (value?.status === "completed") {
      if (value.instrument_confidence !== "sufficient") errors.push("completed quality result requires sufficient instrument confidence");
      if ((value.not_rankable_reasons ?? []).length > 0) {
        errors.push("completed quality result cannot carry not-rankable reasons");
      }
      if ((value?.criteria ?? []).some((criterion) => criterion.ordinal_value == null)) {
        errors.push("completed quality result cannot contain null required criteria");
      }
      if (["instrument_insufficient", "technical_failure"].includes(value.verdict)) {
        errors.push("completed quality result cannot use a failure verdict");
      }
    }
    if (value?.status === "instrument_insufficient") {
      if (value.instrument_confidence !== "insufficient") errors.push("instrument_insufficient status requires insufficient confidence");
      if (value.verdict !== "instrument_insufficient") errors.push("instrument_insufficient status requires matching verdict");
    }
    if (value?.status === "not_rankable" && (value.not_rankable_reasons ?? []).length === 0) {
      errors.push("not_rankable quality result requires at least one not_rankable_reasons entry");
    }
    if (value?.status === "technical_failure" && value.verdict !== "technical_failure") {
      errors.push("technical_failure status requires matching verdict");
    }
    for (const claim of ["human_fun", "human_fairness", "perceptual_quality", "distribution_runtime_compatibility"]) {
      if (!(value?.forbidden_claims ?? []).includes(claim)) errors.push(`quality forbidden_claims must include ${claim}`);
    }
    return errors;
  }
  if (kind === "play_log_feasibility") {
    const errors = duplicateErrors(value?.checks?.map((check) => check.criterion_id), "feasibility criterion_id");
    for (const criterionId of [
      "causal_input_control",
      "risk_reward_coupling",
      "failure_agency",
    ]) {
      if (!(value?.checks ?? []).some((check) => check.criterion_id === criterionId)) {
        errors.push(`feasibility checks must include ${criterionId}`);
      }
    }
    if (value?.status === "passed") {
      if ((value?.checks ?? []).some((check) => check.status !== "ready")) {
        errors.push("passed feasibility requires every check to be ready");
      }
      if ((value?.reasons ?? []).length > 0) errors.push("passed feasibility cannot have reasons");
    }
    if (value?.status === "instrument_insufficient" && (value?.reasons ?? []).length === 0) {
      errors.push("instrument_insufficient feasibility requires reasons");
    }
    return errors;
  }
  if (kind === "play_log_ranking_contract") {
    const errors = duplicateErrors(value?.games?.map((game) => game.game_id), "ranking game_id");
    for (const claim of [
      "cross_game_raw_score_ranking",
      "human_fun",
      "human_fairness",
      "perceptual_quality",
      "distribution_runtime_compatibility",
    ]) {
      if (!(value?.forbidden_claims ?? []).includes(claim)) errors.push(`ranking forbidden_claims must include ${claim}`);
    }
    return errors;
  }
  if (kind === "play_log_ranking_result") {
    const errors = duplicateErrors(value?.games?.map((game) => game.game_id), "ranking result game_id");
    const games = value?.games ?? [];
    const ranked = games.filter((game) => game.eligibility === "ranked");
    const notRankable = games.filter((game) => game.eligibility === "not_rankable");
    if (value?.requested_count !== games.length) errors.push("ranking requested_count must equal games length");
    if (value?.ranked_count !== ranked.length) errors.push("ranking ranked_count must equal ranked games");
    if (value?.not_rankable_count !== notRankable.length) errors.push("ranking not_rankable_count must equal not-rankable games");
    if (value?.status === "completed" && notRankable.length !== 0) errors.push("completed ranking cannot contain not-rankable games");
    if (value?.status === "completed_with_not_rankable" && notRankable.length === 0) {
      errors.push("completed_with_not_rankable requires a not-rankable game");
    }
    for (const game of ranked) {
      if (game.rank == null || game.weighted_total == null) errors.push(`ranked game ${game.game_id} requires rank and weighted_total`);
      if (game.quality_result_sha256 == null) errors.push(`ranked game ${game.game_id} requires quality_result_sha256`);
      if (Object.values(game.criterion_values).some((item) => item == null)) errors.push(`ranked game ${game.game_id} requires all criterion values`);
    }
    for (const game of notRankable) {
      if (game.rank != null || game.weighted_total != null) errors.push(`not-rankable game ${game.game_id} cannot have rank or weighted_total`);
    }
    const flattened = (value?.ranking ?? []).flatMap((group) => group.game_ids.map((gameId) => ({ rank: group.rank, gameId })));
    if (flattened.length !== ranked.length) errors.push("ranking groups must contain every ranked game exactly once");
    errors.push(...duplicateErrors(flattened.map((item) => item.gameId), "ranking group game_id"));
    for (const game of ranked) {
      const entry = flattened.find((item) => item.gameId === game.game_id);
      if (entry == null || entry.rank !== game.rank) errors.push(`ranking group mismatch for ${game.game_id}`);
    }
    return errors;
  }
  return [];
}

function compile(file) {
  const schema = JSON.parse(fs.readFileSync(fileURLToPath(new URL(`../schemas/${file}`, import.meta.url)), "utf8"));
  return ajv.compile(schema);
}

function duplicateErrors(values, label) {
  if (!Array.isArray(values)) return [];
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].map((value) => `duplicate ${label}: ${value}`);
}

function overlapErrors(left = [], right = [], leftName, rightName) {
  const rightSet = new Set(right);
  return left.filter((seed) => rightSet.has(seed)).map((seed) => (
    `gameplay seed ${seed} overlaps ${leftName} and ${rightName} pools`
  ));
}
