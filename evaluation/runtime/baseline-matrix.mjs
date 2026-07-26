import { generateBaselinePolicy } from "./baseline-policies.mjs";

export function buildBaselineMatrix(plan) {
  const {
    gameId,
    gameplaySeeds,
    durationTicks,
    timeoutMs,
    policies,
  } = plan ?? {};
  if (!/^[a-z0-9-]+$/.test(gameId ?? "")) throw new Error("baseline matrix requires a valid gameId");
  if (!Array.isArray(gameplaySeeds) || gameplaySeeds.length < 1 || new Set(gameplaySeeds).size !== gameplaySeeds.length) {
    throw new Error("baseline matrix requires unique gameplaySeeds");
  }
  if (!Number.isInteger(durationTicks) || durationTicks < 1) throw new Error("durationTicks must be positive");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new Error("timeoutMs must be positive");
  if (!Array.isArray(policies) || policies.length < 1) throw new Error("baseline matrix requires policies");

  const generatedPolicies = policies.map((policy) => {
    const generated = generateBaselinePolicy({ ...policy, durationTicks });
    return { condition_id: policy.conditionId ?? generated.provenance.policy_id, ...generated };
  });
  const conditionIds = generatedPolicies.map((value) => value.condition_id);
  if (new Set(conditionIds).size !== conditionIds.length) throw new Error("baseline condition IDs must be unique");

  return gameplaySeeds.flatMap((gameplaySeed) => {
    if (!Number.isInteger(gameplaySeed) || gameplaySeed < 0 || gameplaySeed > 0xffffffff) {
      throw new Error("gameplaySeeds must contain uint32 values");
    }
    return generatedPolicies.map((policy) => ({
      condition_id: policy.condition_id,
      policy_role: policy.provenance.policy_role,
      policy_provenance: policy.provenance,
      request: {
        schema_version: 0,
        game_id: gameId,
        gameplay_seed: gameplaySeed,
        input_sequence: policy.inputSequence,
        timeout_ms: timeoutMs,
        capture_canvas: false,
      },
    }));
  });
}

export async function runBaselineMatrix(simulator, plan, options = {}) {
  if (simulator == null || typeof simulator.runEpisodes !== "function") {
    throw new Error("runBaselineMatrix requires a simulator");
  }
  const entries = buildBaselineMatrix(plan);
  const {
    onPrivateFrame,
    concurrency,
    retainFrames,
  } = options;
  const results = await simulator.runEpisodes(entries.map((entry) => entry.request), {
    ...(concurrency == null ? {} : { concurrency }),
    ...(retainFrames == null ? {} : { retainFrames }),
    ...(onPrivateFrame == null ? {} : {
      onPrivateFrame(step, requestIndex) {
        return onPrivateFrame(step, entries[requestIndex], requestIndex);
      },
    }),
  });
  return entries.map((entry, index) => ({ ...entry, result: results[index] }));
}
