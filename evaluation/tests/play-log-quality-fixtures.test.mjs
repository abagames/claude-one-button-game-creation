import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  assertValidArtifact,
  rankPlayLogQuality,
  runPlayLogQualityEvaluation,
} from "../runtime/index.mjs";
import positiveAdapter from "./fixtures/games/causal-lane-runner/adapter.mjs";
import * as positivePolicy from "./fixtures/games/causal-lane-runner/private-policy.mjs";
import negativeAdapter from "./fixtures/games/inert-timer/adapter.mjs";
import * as negativePolicy from "./fixtures/games/inert-timer/private-policy.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Ground truth is defined by construction: causal-lane-runner couples input, reward, risk and death, while
// inert-timer ignores input entirely and cannot explain its own terminal from annotations.
const fixtures = {
  "causal-lane-runner": {
    adapter: positiveAdapter,
    policy: positivePolicy,
    requiredCoverage: ["player", "wall", "coin"],
  },
  "inert-timer": {
    adapter: negativeAdapter,
    policy: negativePolicy,
    requiredCoverage: ["marker", "drifter"],
  },
};

const evaluations = new Map();

async function evaluate(gameId) {
  if (!evaluations.has(gameId)) {
    const fixture = fixtures[gameId];
    fs.rmSync(path.join(root, `tmp/play-log-quality-fixtures/${gameId}`), { recursive: true, force: true });
    evaluations.set(gameId, await runPlayLogQualityEvaluation({
      adapter: fixture.adapter,
      policy: fixture.policy,
      policyPath: `tests/fixtures/games/${gameId}/private-policy.mjs`,
      planPath: `tests/fixtures/games/${gameId}/play-log-quality-plan.private.json`,
      parameters: undefined,
      requiredCoverage: fixture.requiredCoverage,
    }));
  }
  return evaluations.get(gameId);
}

function criterion(qualityResult, criterionId) {
  return qualityResult.criteria.find((item) => item.criterion_id === criterionId);
}

test("frozen fixture plans still describe the shipped fixture files", () => {
  for (const gameId of Object.keys(fixtures)) {
    const directory = `tests/fixtures/games/${gameId}`;
    const plan = JSON.parse(fs.readFileSync(path.join(root, directory, "play-log-quality-plan.private.json"), "utf8"));
    assertValidArtifact("play_log_quality_plan", plan);
    assert.equal(plan.provenance.adapter_path, `${directory}/adapter.mjs`);
    for (const [field, file] of [
      ["adapter_sha256", "adapter.mjs"],
      ["policy_sha256", "private-policy.mjs"],
      ["source_sha256", "instrumented/main.js"],
    ]) {
      assert.equal(
        plan.provenance[field],
        digest(path.join(root, directory, file)),
        `${gameId} ${field} is stale; regenerate the frozen fixture plan after editing ${file}`,
      );
    }
  }
});

test("a game whose input drives reward, risk and death is fully rankable", async () => {
  const { qualityResult, analysisResult } = await evaluate("causal-lane-runner");

  assert.equal(qualityResult.status, "completed");
  assert.equal(qualityResult.instrument_confidence, "sufficient");
  assert.equal(qualityResult.not_rankable_reasons, undefined);
  assert.equal(criterion(qualityResult, "causal_input_control").status, "confirmed");
  assert.equal(criterion(qualityResult, "risk_reward_coupling").status, "confirmed");
  assert.equal(criterion(qualityResult, "outcome_coherence").status, "confirmed");
  assert.equal(criterion(qualityResult, "failure_agency").ordinal_value >= 1, true);
  assert.equal(qualityResult.criteria.every((item) => item.ordinal_value != null), true);
  assert.equal(analysisResult.instrument_confidence.status, "sufficient");
});

test("counterfactual branches outlive the source terminal instead of being truncated", async () => {
  const { analysisResult } = await evaluate("causal-lane-runner");
  const failureCases = analysisResult.counterfactuals.filter((item) => item.criterion_id === "failure_agency");
  assert.ok(failureCases.length >= 2);

  // A branch may only claim avoidance when no terminal occurred inside the frozen tick budget, never because
  // the replayed input sequence ran out at the source terminal.
  for (const item of failureCases) {
    assert.equal(item.baseline_terminal.kind, "game_over");
    if (item.terminal_avoided) {
      assert.equal(item.counterfactual_terminal.kind, "tick_budget");
      assert.equal(item.survival_difference > 0, true);
    }
  }
  assert.ok(failureCases.some((item) => (item.terminal_delay_ticks ?? 0) > 0));
});

test("a game that ignores input is contradicted where measurable and unresolved where not", async () => {
  const { qualityResult } = await evaluate("inert-timer");

  assert.equal(criterion(qualityResult, "causal_input_control").status, "contradicted");
  assert.equal(criterion(qualityResult, "causal_input_control").ordinal_value, 0);
  assert.equal(criterion(qualityResult, "failure_agency").status, "contradicted");

  // No local reward variation and no annotated reward object: these are instrument limits, not zero scores.
  assert.equal(criterion(qualityResult, "risk_reward_coupling").status, "unresolved");
  assert.equal(criterion(qualityResult, "risk_reward_coupling").ordinal_value, null);
  assert.equal(criterion(qualityResult, "outcome_coherence").status, "unresolved");
  assert.equal(criterion(qualityResult, "outcome_coherence").ordinal_value, null);

  assert.equal(qualityResult.status, "not_rankable");
  assert.equal(qualityResult.verdict, "not_applicable");
  assert.ok(qualityResult.not_rankable_reasons.includes("risk_reward_coupling:no_local_reward_variation"));
  assert.ok(qualityResult.not_rankable_reasons
    .includes("outcome_coherence:terminal_not_mappable_to_annotated_roles"));
});

test("the frozen output_directory owns where evaluation artifacts are written", async () => {
  await evaluate("inert-timer");
  const base = path.join(root, "tmp/play-log-quality-fixtures/inert-timer");
  for (const relative of [
    "play-log-quality-result.json",
    "artifacts/play-log-feasibility.private.json",
    "artifacts/play-log-analysis/analysis-result.json",
    "artifacts/play-log-analysis/counterfactuals.private.json",
  ]) {
    assert.ok(fs.existsSync(path.join(base, relative)), `${relative} was not written under output_directory`);
  }
  assert.equal(fs.existsSync(path.join(root, "tests/fixtures/games/inert-timer/artifacts")), false);
});

test("an unmeasurable game is kept out of the ranking instead of ranked last", async () => {
  const positive = (await evaluate("causal-lane-runner")).qualityResult;
  const negative = (await evaluate("inert-timer")).qualityResult;
  const result = rankPlayLogQuality(
    rankingContract(),
    [positive, negative],
    {
      contractSha256: "b".repeat(64),
      qualityResultHashes: {
        "causal-lane-runner": "c".repeat(64),
        "inert-timer": "d".repeat(64),
      },
    },
  );

  assert.equal(result.ranked_count, 1);
  assert.equal(result.not_rankable_count, 1);
  const ranked = result.games.find((item) => item.game_id === "causal-lane-runner");
  const excluded = result.games.find((item) => item.game_id === "inert-timer");
  assert.equal(ranked.eligibility, "ranked");
  assert.equal(ranked.rank, 1);
  assert.equal(excluded.eligibility, "not_rankable");
  assert.equal(excluded.weighted_total, null);
  assert.equal(excluded.rank, null);
  assert.ok(excluded.errors.some((item) => /risk_reward_coupling/.test(item)));
});

function digest(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function rankingContract() {
  return {
    schema_version: 1,
    artifact_class: "play_log_ranking_contract",
    ranking_id: "fixture-control-ranking",
    frozen_before_quality_result_access: true,
    trust_class: "simulator_only_unverified",
    claim_scope: "play_log_mechanical_quality_only",
    games: [
      {
        game_id: "causal-lane-runner",
        quality_result_path: "tmp/play-log-quality-fixtures/causal-lane-runner/play-log-quality-result.json",
      },
      {
        game_id: "inert-timer",
        quality_result_path: "tmp/play-log-quality-fixtures/inert-timer/play-log-quality-result.json",
      },
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
