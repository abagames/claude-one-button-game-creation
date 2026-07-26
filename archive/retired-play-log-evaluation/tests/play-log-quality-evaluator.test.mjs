import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import legacyAdapter from "./fixtures/games/inert-timer/adapter.mjs";
import * as legacyPolicy from "./fixtures/games/inert-timer/private-policy.mjs";
import {
  assessPlayLogFeasibility,
  assertValidArtifact,
  runPlayLogQualityEvaluation,
} from "../runtime/index.mjs";

const root = path.resolve(import.meta.dirname, "..");

test("shared executor does not newly execute legacy plans", async () => {
  await assert.rejects(() => runPlayLogQualityEvaluation({
    adapter: legacyAdapter,
    policy: legacyPolicy,
    policyPath: "tests/fixtures/games/inert-timer/private-policy.mjs",
    planPath: "tests/fixtures/legacy-play-log-quality-plan.private.v1.json",
    parameters: undefined,
    requiredCoverage: ["marker", "drifter"],
  }), /require.*schema_version 2/);
});

test("batch driver only invokes the shared executor", () => {
  const driver = fs.readFileSync(path.resolve(root, "scripts/evaluate-batch8-v3.mjs"), "utf8");
  assert.doesNotMatch(driver, /generated\//);
  assert.doesNotMatch(driver, /runPrivatePool|runCriterionCounterfactuals|classifyCriteria/);
  assert.match(driver, /evaluateConfigModule/);
});

test("shared executor runs causal and risk plans independently", () => {
  const source = fs.readFileSync(
    path.resolve(root, "runtime/play-log-quality-evaluator.mjs"),
    "utf8",
  );
  assert.match(source, /counterfactual_plans\.causal_input_control/);
  assert.match(source, /counterfactual_plans\.risk_reward_coupling/);
  assert.doesNotMatch(source, /riskCases\s*=\s*causalCases\.map/);
});

test("development-only feasibility gate checks 3 criteria without touching analysis seeds", () => {
  const artifact = assessPlayLogFeasibility({
    qualification: [qualificationEpisode()],
    plan: feasibilityPlan(),
    qualityPlanSha256: "a".repeat(64),
    requiredCoverage: ["player", "hazard", "reward"],
  });
  assertValidArtifact("play_log_feasibility", artifact);
  assert.equal(artifact.status, "passed");
  assert.equal(artifact.analysis_seed_accessed, false);
  assert.equal(artifact.formal_verdict_generated, false);
  assert.deepEqual(artifact.checks.map((check) => check.criterion_id), [
    "causal_input_control",
    "risk_reward_coupling",
    "failure_agency",
  ]);
  assert.ok(artifact.checks.find((check) =>
    check.criterion_id === "risk_reward_coupling").source_risk_sample_count > 0);
});

test("when only tick 0 rewards exist, insufficient formal cases become instrument_insufficient", () => {
  const episode = qualificationEpisode();
  episode.private_steps.forEach((step) => { step.score = 1; });
  episode.result.final_score = 1;
  const artifact = assessPlayLogFeasibility({
    qualification: [episode],
    plan: feasibilityPlan(),
    qualityPlanSha256: "a".repeat(64),
    requiredCoverage: ["player", "hazard", "reward"],
  });
  assertValidArtifact("play_log_feasibility", artifact);
  assert.equal(artifact.status, "instrument_insufficient");
  assert.ok(artifact.reasons.includes(
    "causal_input_control:fewer_than_minimum_generated_cases",
  ));
});

test("feasibility does not pass without a risk threshold or finite samples", () => {
  const plan = feasibilityPlan();
  plan.risk_measurement.hazard_exposure_clearance_threshold = null;
  const artifact = assessPlayLogFeasibility({
    qualification: [qualificationEpisode()],
    plan,
    qualityPlanSha256: "a".repeat(64),
    requiredCoverage: ["player", "hazard", "reward"],
  });
  assert.equal(artifact.status, "instrument_insufficient");
  assert.ok(artifact.reasons.includes(
    "risk_reward_coupling:finite_source_risk_sample_missing",
  ));
});

function feasibilityPlan() {
  const best = {
    source_selection_rule: "best_private",
    anchor_event: "reward_event",
    lookback_ticks: 4,
    local_window_ticks: 4,
    operations: ["remove_press", "shift_press_minus_one", "shift_press_plus_one"],
    max_cases: 3,
    minimum_eligible_cases: 1,
  };
  return {
    game_id: "fixture-game",
    evaluation_id: "fixture-v1",
    seed_plan: { development: [1], analysis: [101] },
    role_mapping: {
      controllable: ["player"],
      hazards: ["hazard"],
      rewards: ["reward"],
    },
    risk_measurement: {
      mode: "hazard_clearance",
      hazard_exposure_clearance_threshold: 3,
    },
    counterfactual_plans: {
      causal_input_control: best,
      risk_reward_coupling: structuredClone(best),
      failure_agency: {
        source_selection_rule: "first_terminal_private_by_gameplay_seed",
        anchor_event: "terminal_event",
        lookback_ticks: 8,
        local_window_ticks: 4,
        operations: ["remove_press", "insert_press_window"],
        max_cases: 2,
        minimum_eligible_cases: 1,
      },
    },
  };
}

function qualificationEpisode() {
  const records = [
    drawingRecord("player", 10),
    drawingRecord("hazard", 13),
    drawingRecord("reward", 20),
  ];
  const privateSteps = Array.from({ length: 10 }, (_, logicalTick) => ({
    logicalTick,
    score: logicalTick >= 5 ? 1 : 0,
    phase: logicalTick === 9 ? "gameOver" : "game",
    input: {
      isPressed: logicalTick === 3,
      justPressed: logicalTick === 3,
      justReleased: logicalTick === 4,
    },
    privateDrawing: { records, diagnostics: [] },
  }));
  return {
    policy_role: "private_policy",
    result: {
      game_id: "fixture-game",
      gameplay_seed: 1,
      final_score: 1,
      executed_ticks: 10,
      termination: { kind: "game_over", logical_tick: 9 },
    },
    input_sequence: {
      schema_version: 1,
      duration_ticks: 10,
      transitions: [
        { tick: 0, pressed: false },
        { tick: 3, pressed: true },
        { tick: 4, pressed: false },
      ],
    },
    private_steps: privateSteps,
    release_count: 1,
    exact_replay: true,
  };
}

function drawingRecord(type, x) {
  return {
    subject: { kind: "descriptor", type },
    source: "box",
    pos: { x, y: 10 },
    size: { x: 2, y: 2 },
  };
}
