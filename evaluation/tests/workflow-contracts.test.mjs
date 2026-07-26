import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  assertValidArtifact,
  rankPlayLogQuality,
  renderPlayLogRanking,
  validateArtifact,
  verifyPlayLogRankingHashes,
} from "../runtime/index.mjs";

const root = path.resolve(import.meta.dirname, "..");
const sha = "a".repeat(64);

test("current artifact contracts are play-log-only", () => {
  for (const retired of [
    "metric_applicability",
    "preregistration",
    "report_result",
    "game_evaluation_plan",
    "batch_manifest",
    "batch_result",
  ]) {
    assert.throws(() => assertValidArtifact(retired, {}), /Unknown artifact contract/);
  }
});

test("quality plan separates development/analysis and has no aggregate metrics", () => {
  const plan = qualityPlan();
  assertValidArtifact("play_log_quality_plan", plan);
  const serialized = JSON.stringify(plan);
  assert.equal(serialized.includes("held_out"), false);
  assert.equal(serialized.includes("confidence_interval"), false);
  assert.equal(serialized.includes("exploit_resistance"), false);
  const overlap = structuredClone(plan);
  overlap.seed_plan.analysis[0] = overlap.seed_plan.development[0];
  assert.match(validateArtifact("play_log_quality_plan", overlap).join("; "), /overlaps development and analysis/);
});

test("quality plan v2 machine-verifies per-criterion sources and terminal anchors", () => {
  const plan = qualityPlanV2();
  assertValidArtifact("play_log_quality_plan", plan);
  assert.equal(plan.counterfactual_plans.failure_agency.source_selection_rule,
    "first_terminal_private_by_gameplay_seed");
  const invalid = structuredClone(plan);
  invalid.counterfactual_plans.failure_agency.minimum_eligible_cases = 5;
  invalid.counterfactual_plans.failure_agency.max_cases = 2;
  assert.match(validateArtifact("play_log_quality_plan", invalid).join("; "),
    /minimum_eligible_cases cannot exceed max_cases/);
  const withoutDevelopmentSeed = structuredClone(plan);
  withoutDevelopmentSeed.seed_plan.development = [];
  assert.match(validateArtifact("play_log_quality_plan", withoutDevelopmentSeed).join("; "),
    /must NOT have fewer than 1 items/);
});

test("quality plan v2 retires retry_count without breaking plans frozen before the retirement", () => {
  const current = qualityPlanV2();
  delete current.execution.retry_count;
  assertValidArtifact("play_log_quality_plan", current);
  const frozenBeforeRetirement = qualityPlanV2();
  assert.equal(frozenBeforeRetirement.execution.retry_count, 0);
  assertValidArtifact("play_log_quality_plan", frozenBeforeRetirement);
  const retrying = qualityPlanV2();
  retrying.execution.retry_count = 1;
  assert.match(validateArtifact("play_log_quality_plan", retrying).join("; "),
    /retry_count must be equal to constant/);
});

test("ranking evaluates only the 4 criteria with fixed weights", () => {
  const contract = rankingContract();
  const strong = qualityResult("strong-game", {
    causal_input_control: "confirmed",
    risk_reward_coupling: "confirmed",
    failure_agency: "mixed",
    outcome_coherence: "confirmed",
  });
  const weak = qualityResult("weak-game", {
    causal_input_control: "mixed",
    risk_reward_coupling: "contradicted",
    failure_agency: "confirmed",
    outcome_coherence: "confirmed",
  });
  assertValidArtifact("play_log_ranking_contract", contract);
  assertValidArtifact("play_log_quality_result", strong);
  assert.equal(JSON.stringify(contract).includes("baseline"), false);
  const result = rankPlayLogQuality(contract, [weak, strong], {
    contractSha256: sha,
    qualityResultHashes: { "strong-game": sha, "weak-game": sha },
  });
  assertValidArtifact("play_log_ranking_result", result);
  assert.deepEqual(result.games.map((game) => [game.game_id, game.weighted_total, game.rank]), [
    ["strong-game", 18, 1],
    ["weak-game", 10, 2],
  ]);
  assert.match(renderPlayLogRanking(result, { contract: sha, result: sha, renderer: sha }), /monotonic-input performance is not scored/);
});

test("null criteria become not_rankable, not zero points or last place", () => {
  const first = qualityResult("strong-game");
  const second = qualityResult("weak-game");
  second.status = "not_rankable";
  const criterion = second.criteria.find((item) => item.criterion_id === "failure_agency");
  criterion.status = "unresolved";
  criterion.ordinal_value = null;
  criterion.evidence_ids = [];
  const result = rankPlayLogQuality(rankingContract(), [first, second], {
    contractSha256: sha,
    qualityResultHashes: { "strong-game": sha, "weak-game": sha },
  });
  const unranked = result.games.find((game) => game.game_id === "weak-game");
  assert.equal(unranked.eligibility, "not_rankable");
  assert.equal(unranked.weighted_total, null);
  assert.equal(unranked.rank, null);
});

test("ranking preserves evaluation-stop provenance of not-rankable games", () => {
  const result = rankPlayLogQuality(rankingContract(), [qualityResult("strong-game")], {
    contractSha256: sha,
    qualityResultHashes: { "strong-game": sha },
    preflightErrors: { "weak-game": ["quality result is missing"] },
    evaluationStops: {
      "weak-game": {
        path: "generated/weak-game/artifacts/technical-failure.json",
        sha256: sha,
        status: "instrument_insufficient",
      },
    },
  });
  const game = result.games.find((item) => item.game_id === "weak-game");
  assert.equal(game.terminal_status, "instrument_insufficient");
  assert.equal(game.evaluation_stop_sha256, sha);
  assert.match(
    renderPlayLogRanking(result, { contract: sha, result: sha, renderer: sha }),
    /stop artifact.*technical-failure\.json/,
  );
});

test("fully equivalent games get a shared rank", () => {
  const result = rankPlayLogQuality(rankingContract(), [
    qualityResult("strong-game"),
    qualityResult("weak-game"),
  ], {
    contractSha256: sha,
    qualityResultHashes: { "strong-game": sha, "weak-game": sha },
  });
  assert.deepEqual(result.ranking, [{ rank: 1, game_ids: ["strong-game", "weak-game"] }]);
});

test("ranking hash sidecar detects tampering fail-closed", () => {
  const packagePath = path.join(root, "package.json");
  const entry = { path: "package.json", sha256: digest(fs.readFileSync(packagePath)) };
  const sidecar = { schema_version: 1, contract: entry, result: entry, renderer: entry, report: entry };
  assert.deepEqual(verifyPlayLogRankingHashes(sidecar, { rootDir: root }), []);
  sidecar.report.sha256 = sha;
  assert.match(verifyPlayLogRankingHashes(sidecar, { rootDir: root }).join("; "), /report SHA-256 mismatch/);
});

function rankingContract() {
  return {
    schema_version: 1,
    artifact_class: "play_log_ranking_contract",
    ranking_id: "fixture-play-log-ranking",
    frozen_before_quality_result_access: true,
    trust_class: "simulator_only_unverified",
    claim_scope: "play_log_mechanical_quality_only",
    games: [
      { game_id: "strong-game", quality_result_path: "generated/strong-game/play-log-quality-result.json" },
      { game_id: "weak-game", quality_result_path: "generated/weak-game/play-log-quality-result.json" },
    ],
    required_criteria: ["causal_input_control", "risk_reward_coupling", "failure_agency", "outcome_coherence"],
    weights: { causal_input_control: 4, risk_reward_coupling: 3, failure_agency: 2, outcome_coherence: 1 },
    ordinal_mapping: { confirmed: 2, mixed: 1, contradicted: 0, unresolved: null, not_applicable: null },
    tie_threshold: 0,
    tie_breakers: ["causal_input_control", "risk_reward_coupling", "failure_agency", "shared_rank"],
    missing_data: {
      required_null: "not_rankable",
      technical_failure: "not_rankable",
      negative_result: "retain_as_observed",
    },
    forbidden_claims: [
      "cross_game_raw_score_ranking",
      "human_fun",
      "human_fairness",
      "perceptual_quality",
      "distribution_runtime_compatibility",
    ],
  };
}

function qualityPlan() {
  return {
    schema_version: 1,
    artifact_class: "private_play_log_quality_plan",
    game_id: "strong-game",
    evaluation_id: "v1",
    trust_class: "simulator_only_unverified",
    provenance: {
      adapter_path: "generated/strong-game/adapter.mjs",
      adapter_sha256: sha,
      source_sha256: sha,
      runtime_bundle_sha256: sha,
      policy_sha256: sha,
    },
    seed_plan: { development: [1, 2], analysis: [101, 102, 103] },
    policy_roles: {
      private_policy: "private_policy",
      diagnostic_controls: ["idle", "hold", "periodic", "seeded_random"],
    },
    selection_rule: {
      private_episode_roles: ["best", "median", "low_or_failure"],
      score_order: "descending",
      tie_breakers: ["survival_ticks_descending", "release_count_ascending", "gameplay_seed_ascending"],
      same_seed_control_role: "periodic",
    },
    replay_gate: { mode: "exact_result_v1", annotation_migration: false, reason: "normal evaluation" },
    role_mapping: {
      controllable: ["player"],
      hazards: ["hazard"],
      rewards: ["reward"],
      projectiles_or_zones: [],
      unresolved: [],
    },
    risk_measurement: { hazard_exposure_clearance_threshold: 3 },
    criterion_rules: [
      "causal_input_control",
      "risk_reward_coupling",
      "failure_agency",
      "outcome_coherence",
    ].map((criterionId) => ({
      criterion_id: criterionId,
      confirmed_rule: `${criterionId} confirmed`,
      mixed_rule: `${criterionId} mixed`,
      contradicted_rule: `${criterionId} contradicted`,
      required_evidence_types: ["comparison", "counterfactual"],
    })),
    counterfactual: { operations: ["remove_press"], max_per_episode: 1, local_window_ticks: 30 },
    execution: { tick_budget: 3600, timeout_ms: 1000, retry_count: 0 },
    output_directory: "generated/strong-game/artifacts/play-log-analysis",
    allowed_claims: ["tested play-log mechanics only"],
    forbidden_claims: ["human_fun", "human_fairness", "perceptual_quality", "distribution_runtime_compatibility"],
  };
}

function qualityPlanV2() {
  const plan = qualityPlan();
  plan.schema_version = 2;
  delete plan.counterfactual;
  const bestPlan = {
    source_selection_rule: "best_private",
    anchor_event: "reward_event",
    lookback_ticks: 60,
    local_window_ticks: 60,
    operations: ["remove_press", "shift_press_minus_one", "shift_press_plus_one"],
    max_cases: 3,
    minimum_eligible_cases: 2,
  };
  plan.counterfactual_plans = {
    causal_input_control: bestPlan,
    risk_reward_coupling: structuredClone(bestPlan),
    failure_agency: {
      source_selection_rule: "first_terminal_private_by_gameplay_seed",
      source_tie_breakers: ["gameplay_seed_ascending"],
      anchor_event: "terminal_event",
      lookback_ticks: 120,
      local_window_ticks: 120,
      operations: [
        "remove_press",
        "shift_press_minus_one",
        "shift_press_plus_one",
        "insert_press_window",
      ],
      max_cases: 4,
      minimum_eligible_cases: 2,
      minimum_delay_ticks: 30,
    },
  };
  return plan;
}

function qualityResult(gameId, statuses = {}) {
  const values = { confirmed: 2, mixed: 1, contradicted: 0 };
  return {
    schema_version: 1,
    artifact_class: "play_log_quality_result",
    game_id: gameId,
    evaluation_id: "v1",
    status: "completed",
    trust_class: "simulator_only_unverified",
    analysis_plan_path: `generated/${gameId}/play-log-quality-plan.private.json`,
    analysis_plan_sha256: sha,
    analysis_result_path: `generated/${gameId}/analysis-result.json`,
    analysis_result_sha256: sha,
    instrument_confidence: "sufficient",
    identity_coverage: 1,
    criteria: ["causal_input_control", "risk_reward_coupling", "failure_agency", "outcome_coherence"].map((criterionId) => {
      const status = statuses[criterionId] ?? "confirmed";
      return {
        criterion_id: criterionId,
        status,
        ordinal_value: values[status],
        evidence_ids: ["comparison:best-vs-control"],
        rationale: `${criterionId} fixture evidence`,
      };
    }),
    verdict: "risk_reward_coupled",
    unresolved_metrics: [],
    limitations: ["simulator-only fixture"],
    allowed_claims: ["tested play-log mechanics only"],
    forbidden_claims: ["human_fun", "human_fairness", "perceptual_quality", "distribution_runtime_compatibility"],
  };
}

function digest(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
