import { assertValidArtifact } from "./artifact-contracts.mjs";

const CRITERIA = Object.freeze([
  "causal_input_control",
  "risk_reward_coupling",
  "failure_agency",
  "outcome_coherence",
]);

export function rankPlayLogQuality(contract, qualityResults, {
  contractSha256,
  qualityResultHashes = {},
  preflightErrors = {},
  evaluationStops = {},
}) {
  assertValidArtifact("play_log_ranking_contract", contract);
  const byGame = new Map(qualityResults.map((result) => [result.game_id, result]));
  const games = contract.games.map((entry) => evaluate(
    entry,
    byGame.get(entry.game_id),
    qualityResultHashes[entry.game_id] ?? null,
    preflightErrors[entry.game_id] ?? [],
    evaluationStops[entry.game_id] ?? null,
    contract,
  ));
  const ranked = games.filter((game) => game.eligibility === "ranked").sort((left, right) => compare(left, right, contract));
  assignRanks(ranked, contract);
  const notRankable = games.filter((game) => game.eligibility === "not_rankable")
    .sort((left, right) => left.game_id.localeCompare(right.game_id));
  const ordered = [...ranked, ...notRankable];
  const ranking = [];
  for (const game of ranked) {
    const group = ranking.find((item) => item.rank === game.rank);
    if (group == null) ranking.push({ rank: game.rank, game_ids: [game.game_id] });
    else group.game_ids.push(game.game_id);
  }
  for (const group of ranking) group.game_ids.sort();
  const result = {
    schema_version: 1,
    artifact_class: "play_log_ranking_result",
    ranking_id: contract.ranking_id,
    status: notRankable.length === 0 ? "completed" : "completed_with_not_rankable",
    trust_class: "simulator_only_unverified",
    contract_sha256: contractSha256,
    ordering: "rank_ascending_then_game_id",
    requested_count: games.length,
    ranked_count: ranked.length,
    not_rankable_count: notRankable.length,
    games: ordered,
    ranking,
    limitations: [
      "Ranking uses only schema-valid play-log mechanical quality criteria.",
      "Monotonic-input and baseline performance do not contribute to quality scores.",
      "Null, not-applicable, unresolved, and technical failures are not converted to zero.",
      "Rendered appearance, perceptual clarity, audio, human experience, and distribution runtime compatibility were not evaluated.",
    ],
    forbidden_claims: contract.forbidden_claims,
  };
  assertValidArtifact("play_log_ranking_result", result);
  return result;
}

function evaluate(entry, quality, qualityResultSha256, preflightErrors, evaluationStop, contract) {
  const emptyValues = Object.fromEntries(CRITERIA.map((criterion) => [criterion, null]));
  if (preflightErrors.length > 0) {
    return notRankable(entry, emptyValues, qualityResultSha256, preflightErrors, evaluationStop);
  }
  if (quality == null) return notRankable(entry, emptyValues, null, ["quality result is missing"], evaluationStop);
  try {
    assertValidArtifact("play_log_quality_result", quality);
  } catch (error) {
    return notRankable(entry, emptyValues, qualityResultSha256, [String(error.message)], evaluationStop);
  }
  if (quality.game_id !== entry.game_id) return notRankable(entry, emptyValues, qualityResultSha256, ["quality result game_id mismatch"], evaluationStop);
  const values = Object.fromEntries(CRITERIA.map((criterionId) => [
    criterionId,
    quality.criteria.find((criterion) => criterion.criterion_id === criterionId)?.ordinal_value ?? null,
  ]));
  const errors = [];
  if (quality.status !== "completed") errors.push(`quality result status is ${quality.status}`);
  if (quality.instrument_confidence !== "sufficient") errors.push("instrument confidence is insufficient");
  for (const criterionId of contract.required_criteria) {
    if (values[criterionId] == null) errors.push(`required criterion is null: ${criterionId}`);
  }
  if (errors.length > 0) return notRankable(entry, values, qualityResultSha256, errors, evaluationStop);
  const weightedTotal = CRITERIA.reduce((sum, criterionId) => (
    sum + values[criterionId] * contract.weights[criterionId]
  ), 0);
  return {
    game_id: entry.game_id,
    eligibility: "ranked",
    quality_result_path: entry.quality_result_path,
    quality_result_sha256: qualityResultSha256,
    evaluation_stop_path: evaluationStop?.path ?? null,
    evaluation_stop_sha256: evaluationStop?.sha256 ?? null,
    terminal_status: evaluationStop?.status ?? null,
    criterion_values: values,
    weighted_total: weightedTotal,
    rank: null,
    errors: [],
  };
}

function notRankable(entry, values, hash, errors, evaluationStop) {
  return {
    game_id: entry.game_id,
    eligibility: "not_rankable",
    quality_result_path: entry.quality_result_path,
    quality_result_sha256: hash,
    evaluation_stop_path: evaluationStop?.path ?? null,
    evaluation_stop_sha256: evaluationStop?.sha256 ?? null,
    terminal_status: evaluationStop?.status ?? "not_rankable",
    criterion_values: values,
    weighted_total: null,
    rank: null,
    errors,
  };
}

function compare(left, right, contract) {
  const totalDifference = right.weighted_total - left.weighted_total;
  if (Math.abs(totalDifference) > contract.tie_threshold) return totalDifference;
  for (const criterionId of contract.tie_breakers.filter((item) => item !== "shared_rank")) {
    const difference = right.criterion_values[criterionId] - left.criterion_values[criterionId];
    if (difference !== 0) return difference;
  }
  return left.game_id.localeCompare(right.game_id);
}

function assignRanks(games, contract) {
  for (let index = 0; index < games.length; index++) {
    if (index === 0) games[index].rank = 1;
    else games[index].rank = equivalent(games[index - 1], games[index], contract)
      ? games[index - 1].rank
      : index + 1;
  }
}

function equivalent(left, right, contract) {
  if (Math.abs(left.weighted_total - right.weighted_total) > contract.tie_threshold) return false;
  return contract.tie_breakers
    .filter((item) => item !== "shared_rank")
    .every((criterionId) => left.criterion_values[criterionId] === right.criterion_values[criterionId]);
}
