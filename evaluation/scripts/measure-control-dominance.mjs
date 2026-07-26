// Monotonic-control dominance, measured on development seeds only.
//
// This is a screening signal, not a criterion: nothing it computes reaches a play-log quality verdict, and it
// writes no round artifact. It answers one question per game — how much of the private policy's scoring rate a
// monotonic diagnostic control reproduces without playing:
//
//   ratio = (best_control_final_score / control_executed_ticks) / (policy_final_score / policy_executed_ticks)
//
// Per-tick normalisation is part of the definition. A per-episode ratio is sensitive to how long passive play
// survives, which conflates "input does not affect score" with "passive play is not punished quickly enough";
// per-tick, the ratio is invariant to parameters that scale numerator and denominator together.
//
// Development seeds and the plan's own tick budget are used, so no analysis pool is touched and the measurement
// is re-runnable at any time. Two control sets are reported because "best control" is a maximum and therefore
// depends on which controls were offered: `evaluator` is the set the shared executor uses, so it is the one
// Phase B's `final_score_best_control_same_seed` will be comparable to; `smoke` is the wider set the per-game
// Stage 5-6 harnesses use. A ratio that moves between the two is a ratio decided by control selection.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  hashCanonicalJson,
  runBaselineMatrix,
  createSimulator,
  sha256File,
} from "../runtime/index.mjs";

// `monotonic` is idle and hold — the two controls whose input never changes, i.e. not playing at all. It is
// reported separately because "best control" and "best monotonic control" coincide on hold-dominant games and
// diverge on games where crude scripted tapping scores, and a signal whose verdict depends on which of the two
// it meant is a signal that has not been defined.
export const CONTROL_SETS = Object.freeze({
  monotonic: Object.freeze([
    Object.freeze({ role: "idle" }),
    Object.freeze({ role: "hold" }),
  ]),
  evaluator: Object.freeze([
    Object.freeze({ role: "idle" }),
    Object.freeze({ role: "hold" }),
    Object.freeze({ role: "periodic", conditionId: "periodic-30-10", periodTicks: 30, pressedTicks: 10 }),
    Object.freeze({ role: "seeded_random", conditionId: "seeded-random-12", meanSegmentTicks: 12, policySeed: 70008 }),
  ]),
  smoke: Object.freeze([
    Object.freeze({ role: "idle" }),
    Object.freeze({ role: "hold" }),
    Object.freeze({ role: "periodic", conditionId: "periodic-10-3", periodTicks: 10, pressedTicks: 3 }),
    Object.freeze({ role: "periodic", conditionId: "periodic-40-12", periodTicks: 40, pressedTicks: 12 }),
    Object.freeze({ role: "seeded_random", conditionId: "seeded-random-5", meanSegmentTicks: 5, policySeed: 2654435769 }),
  ]),
});

// Same order the shared executor uses to pick `best-control-same-seed`: highest final score, longer survival
// breaks the tie. Selecting by rate instead would be a different signal, so it is reported alongside rather
// than substituted — see `best_by_rate` in the per-seed output.
function compareResults(left, right) {
  return right.final_score - left.final_score || right.executed_ticks - left.executed_ticks;
}

export function episodeRate(result) {
  return result.executed_ticks > 0 ? result.final_score / result.executed_ticks : 0;
}

const rate = episodeRate;

function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export async function measureControlDominance(config, { verifyProvenance = true } = {}) {
  const gameId = config.adapter.game_id;
  const plan = JSON.parse(fs.readFileSync(config.planPath, "utf8"));
  if (plan.game_id !== gameId) throw new Error(`adapter/plan game_id mismatch: ${gameId}/${plan.game_id}`);
  if (verifyProvenance) {
    if (sha256File(plan.provenance.adapter_path) !== plan.provenance.adapter_sha256) {
      throw new Error(`${gameId}: adapter hash does not match frozen plan provenance`);
    }
    if (sha256File(config.policyPath) !== plan.provenance.policy_sha256) {
      throw new Error(`${gameId}: private policy hash does not match frozen plan provenance`);
    }
  }
  const seeds = plan.seed_plan.development;
  const durationTicks = plan.execution.tick_budget;
  const timeoutMs = plan.execution.timeout_ms;
  const simulator = createSimulator({
    runtimeBundleSha256: plan.provenance.runtime_bundle_sha256,
    adapters: [config.adapter],
  });

  // Private policy, run exactly as the shared executor runs its pools, including the exact-replay check. A
  // policy that does not replay is not a measurement of anything and must not silently become a denominator.
  const sequences = new Array(seeds.length);
  const policyResults = await simulator.runClosedLoopEpisodes(
    seeds.map((gameplay_seed) => ({
      game_id: gameId,
      gameplay_seed,
      duration_ticks: durationTicks,
      timeout_ms: timeoutMs,
    })),
    () => config.policy.createController(config.parameters),
    {
      concurrency: 2,
      toClosedLoopObservation: config.policy.toObservation,
      onClosedLoopActionSequence(sequence, index) { sequences[index] = sequence; },
    },
  );
  const policyReplays = await simulator.runEpisodes(policyResults.map((result, index) => ({
    schema_version: 0,
    game_id: gameId,
    gameplay_seed: result.gameplay_seed,
    input_sequence: sequences[index],
    timeout_ms: timeoutMs,
    capture_canvas: false,
  })), { concurrency: 2 });
  policyResults.forEach((result, index) => {
    if (hashCanonicalJson(result) !== hashCanonicalJson(policyReplays[index])) {
      throw new Error(`${gameId}: private policy exact replay failed on seed ${result.gameplay_seed}`);
    }
  });

  const controlsBySet = {};
  for (const [setName, policies] of Object.entries(CONTROL_SETS)) {
    controlsBySet[setName] = await runBaselineMatrix(simulator, {
      gameId,
      gameplaySeeds: seeds,
      durationTicks,
      timeoutMs,
      policies,
    }, { concurrency: 2 });
  }

  const { perSeed, summary } = computeControlDominance({ seeds, policyResults, controlsBySet });

  return {
    game_id: gameId,
    plan_path: config.planPath,
    development_seeds: seeds,
    tick_budget: durationTicks,
    policy_parameters: config.parameters ?? null,
    control_sets: CONTROL_SETS,
    per_seed: perSeed,
    summary,
  };
}

// Pure: everything from here down is arithmetic over episode results, with no simulator involved. It is
// separated so the part that decides a gate can be tested without running a game.
export function computeControlDominance({ seeds, policyResults, controlsBySet }) {
  const perSeed = seeds.map((seed, index) => {
    const policy = policyResults[index];
    const policyRate = rate(policy);
    const sets = {};
    for (const [setName, entries] of Object.entries(controlsBySet)) {
      const sameSeed = entries.filter((entry) => entry.request.gameplay_seed === seed);
      const best = [...sameSeed].sort((left, right) => compareResults(left.result, right.result))[0];
      const bestByRate = [...sameSeed].sort((left, right) => rate(right.result) - rate(left.result))[0];
      sets[setName] = {
        best_control_role: best.policy_role,
        best_control_condition_id: best.condition_id,
        best_control_final_score: best.result.final_score,
        best_control_executed_ticks: best.result.executed_ticks,
        best_control_rate: rate(best.result),
        ratio: policyRate > 0 ? rate(best.result) / policyRate : null,
        best_by_rate: {
          condition_id: bestByRate.condition_id,
          rate: rate(bestByRate.result),
          ratio: policyRate > 0 ? rate(bestByRate.result) / policyRate : null,
        },
        controls: sameSeed.map((entry) => ({
          condition_id: entry.condition_id,
          final_score: entry.result.final_score,
          executed_ticks: entry.result.executed_ticks,
          termination_kind: entry.result.termination.kind,
          rate: rate(entry.result),
        })),
      };
    }
    return {
      gameplay_seed: seed,
      policy_final_score: policy.final_score,
      policy_executed_ticks: policy.executed_ticks,
      policy_termination_kind: policy.termination.kind,
      policy_rate: policyRate,
      sets,
    };
  });

  // Two aggregates, because they answer different questions and can disagree. The median of the per-seed ratios
  // is the typical episode; the pooled ratio (total score over total ticks on each side) is the whole
  // development matrix treated as one long episode, and it is the one a single very long or very high-scoring
  // seed can dominate.
  const summary = {};
  for (const setName of Object.keys(controlsBySet)) {
    const ratios = perSeed.map((entry) => entry.sets[setName].ratio).filter((value) => value != null);
    const controlScore = perSeed.reduce((total, entry) => total + entry.sets[setName].best_control_final_score, 0);
    const controlTicks = perSeed.reduce((total, entry) => total + entry.sets[setName].best_control_executed_ticks, 0);
    const policyScore = perSeed.reduce((total, entry) => total + entry.policy_final_score, 0);
    const policyTicks = perSeed.reduce((total, entry) => total + entry.policy_executed_ticks, 0);
    const pooledPolicyRate = policyTicks > 0 ? policyScore / policyTicks : 0;
    summary[setName] = {
      ratio_median: median(ratios),
      ratio_min: ratios.length === 0 ? null : Math.min(...ratios),
      ratio_max: ratios.length === 0 ? null : Math.max(...ratios),
      ratio_pooled: pooledPolicyRate > 0 ? (controlTicks > 0 ? controlScore / controlTicks : 0) / pooledPolicyRate : null,
      seeds_with_ratio: ratios.length,
    };
  }

  return { perSeed, summary };
}

export async function measureConfigModule(configModulePath, requestedGameIds = []) {
  const module = await import(pathToFileURL(path.resolve(configModulePath)));
  const configs = module.evaluationConfigs;
  if (!Array.isArray(configs) || configs.length === 0) {
    throw new Error("evaluation config module must export a non-empty evaluationConfigs array");
  }
  const requested = new Set(requestedGameIds);
  const selected = requested.size === 0
    ? configs
    : configs.filter((config) => requested.has(config.adapter.game_id));
  const missing = [...requested].filter((gameId) =>
    !selected.some((config) => config.adapter.game_id === gameId));
  if (missing.length > 0) throw new Error(`unknown game id: ${missing.join(", ")}`);
  const measurements = [];
  for (const config of selected) measurements.push(await measureControlDominance(config));
  return measurements;
}

function formatMeasurement(measurement) {
  const lines = [`${measurement.game_id} (tick budget ${measurement.tick_budget}, seeds ${measurement.development_seeds.join(",")})`];
  for (const entry of measurement.per_seed) {
    const evaluatorSet = entry.sets.evaluator;
    const smokeSet = entry.sets.smoke;
    lines.push([
      `  ${entry.gameplay_seed}`,
      `policy=${entry.policy_final_score}/${entry.policy_executed_ticks}=${entry.policy_rate.toFixed(4)}/tick`,
      `evaluator_best=${evaluatorSet.best_control_condition_id}:${evaluatorSet.best_control_final_score}/${evaluatorSet.best_control_executed_ticks}=${evaluatorSet.best_control_rate.toFixed(4)}`,
      `ratio=${evaluatorSet.ratio == null ? "n/a" : evaluatorSet.ratio.toFixed(3)}`,
      `smoke_ratio=${smokeSet.ratio == null ? "n/a" : smokeSet.ratio.toFixed(3)}`,
      `monotonic_ratio=${entry.sets.monotonic.ratio == null ? "n/a" : entry.sets.monotonic.ratio.toFixed(3)}`,
    ].join(" "));
  }
  for (const [setName, values] of Object.entries(measurement.summary)) {
    lines.push([
      `  ${setName}:`,
      `median=${values.ratio_median == null ? "n/a" : values.ratio_median.toFixed(3)}`,
      `pooled=${values.ratio_pooled == null ? "n/a" : values.ratio_pooled.toFixed(3)}`,
      `range=[${values.ratio_min == null ? "n/a" : values.ratio_min.toFixed(3)}, ${values.ratio_max == null ? "n/a" : values.ratio_max.toFixed(3)}]`,
      `seeds=${values.seeds_with_ratio}/${measurement.development_seeds.length}`,
    ].join(" "));
  }
  return lines.join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const argv = process.argv.slice(2);
  const outIndex = argv.indexOf("--out");
  const outPath = outIndex === -1 ? null : argv[outIndex + 1];
  const positional = argv.filter((value, index) =>
    value !== "--out" && index !== outIndex + 1);
  const [configModulePath, ...requestedGameIds] = positional;
  if (configModulePath == null) {
    throw new Error("usage: measure-control-dominance.mjs <evaluation-config.mjs> [--out <path>] [game-id ...]");
  }
  const measurements = await measureConfigModule(configModulePath, requestedGameIds);
  for (const measurement of measurements) process.stdout.write(`${formatMeasurement(measurement)}\n`);
  if (outPath != null) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, `${JSON.stringify(measurements, null, 2)}\n`);
    process.stdout.write(`wrote ${outPath}\n`);
  }
}
