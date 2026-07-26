import { buildBaselineMatrix } from "./baseline-matrix.mjs";
import { hashCanonicalJson } from "./input-sequence.mjs";

export async function runAdapterConformance(options) {
  const {
    simulator,
    gameId,
    gameplaySeed,
    durationTicks = 120,
    timeoutMs = 30000,
    policies = defaultPolicies,
    requireAnnotations = true,
  } = options ?? {};
  const entries = buildBaselineMatrix({
    gameId,
    gameplaySeeds: [gameplaySeed],
    durationTicks,
    timeoutMs,
    policies,
  });
  const firstSteps = entries.map(() => []);
  const firstResults = await simulator.runEpisodes(entries.map((entry) => entry.request), {
    onPrivateFrame(step, requestIndex) { firstSteps[requestIndex].push(step); },
  });
  const replayResults = await simulator.runEpisodes(entries.map((entry) => entry.request));
  const checks = [];
  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index];
    const result = firstResults[index];
    const steps = firstSteps[index];
    add(checks, entry, "non_technical_termination", !["load_error", "runtime_error", "timeout"].includes(result.termination.kind));
    add(checks, entry, "frame_count", result.frames.length === result.executed_ticks);
    add(checks, entry, "private_step_count", steps.length === result.executed_ticks);
    add(checks, entry, "runtime_diagnostics", Object.values(result.diagnostics).every((values) => values.length === 0));
    add(checks, entry, "annotation_diagnostics", steps.every((step) => step.privateDrawing?.diagnostics?.length === 0));
    add(checks, entry, "annotation_records", !requireAnnotations || steps.some((step) => step.privateDrawing?.records?.length > 0));
    add(checks, entry, "exact_replay", hashCanonicalJson(result) === hashCanonicalJson(replayResults[index]));
  }
  return Object.freeze({
    executor_id: simulator.descriptor.executor_id,
    runtime_bundle_sha256: simulator.descriptor.runtime_bundle_sha256,
    game_id: gameId,
    gameplay_seed: gameplaySeed,
    duration_ticks: durationTicks,
    passed: checks.every((check) => check.passed),
    first_results_sha256: hashCanonicalJson(firstResults),
    replay_results_sha256: hashCanonicalJson(replayResults),
    checks,
  });
}

const defaultPolicies = Object.freeze([
  Object.freeze({ role: "idle" }),
  Object.freeze({ role: "hold" }),
  Object.freeze({ role: "periodic", conditionId: "periodic-10-3", periodTicks: 10, pressedTicks: 3 }),
  Object.freeze({ role: "seeded_random", meanSegmentTicks: 5, policySeed: 2654435769 }),
]);

function add(checks, entry, checkId, passed) {
  checks.push({ condition_id: entry.condition_id, policy_role: entry.policy_role, check_id: checkId, passed });
}
