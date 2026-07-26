import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  assertValidArtifact,
  rankPlayLogQuality,
  renderPlayLogRanking,
} from "../runtime/index.mjs";

const root = path.resolve(import.meta.dirname, "..");
const [contractArgument, outputDirectoryArgument] = process.argv.slice(2);
if (contractArgument == null || outputDirectoryArgument == null) {
  throw new Error("Usage: node scripts/rank-play-log-quality.mjs <contract.json> <output-directory>");
}
const contractPath = path.resolve(root, contractArgument);
const output = path.resolve(root, outputDirectoryArgument);
const contractBytes = fs.readFileSync(contractPath);
const contract = JSON.parse(contractBytes);
assertValidArtifact("play_log_ranking_contract", contract);
const qualityResults = [];
const qualityResultHashes = {};
const preflightErrors = {};
const evaluationStops = {};
for (const entry of contract.games) {
  try {
    const bytes = fs.readFileSync(path.resolve(root, entry.quality_result_path));
    qualityResultHashes[entry.game_id] = sha(bytes);
    const quality = JSON.parse(bytes);
    assertValidArtifact("play_log_quality_result", quality);
    const plan = verifyReferencedArtifact(
      quality.analysis_plan_path,
      quality.analysis_plan_sha256,
      "play_log_quality_plan",
    );
    const analysis = verifyReferencedArtifact(
      quality.analysis_result_path,
      quality.analysis_result_sha256,
      "play_log_analysis_result",
    );
    if (plan.game_id !== quality.game_id || analysis.game_id !== quality.game_id) {
      throw new Error(`quality provenance game_id mismatch: ${quality.game_id}`);
    }
    verifyEvidenceIds(quality, analysis);
    qualityResults.push(quality);
  } catch (error) {
    preflightErrors[entry.game_id] = [String(error?.message ?? error)];
    const stop = readAdjacentEvaluationStop(entry);
    if (stop != null) evaluationStops[entry.game_id] = stop;
  }
}
const result = rankPlayLogQuality(contract, qualityResults, {
  contractSha256: sha(contractBytes),
  qualityResultHashes,
  preflightErrors,
  evaluationStops,
});
fs.mkdirSync(output, { recursive: true });
const resultPath = path.join(output, "play-log-ranking-result.json");
writeAtomic(resultPath, `${JSON.stringify(result, null, 2)}\n`);
const resultBytes = fs.readFileSync(resultPath);
const rendererPath = path.resolve(root, "runtime/play-log-ranking-renderer.mjs");
const rendererBytes = fs.readFileSync(rendererPath);
const hashes = { contract: sha(contractBytes), result: sha(resultBytes), renderer: sha(rendererBytes) };
const reportPath = path.join(output, "PLAY_LOG_RANKING.md");
writeAtomic(reportPath, renderPlayLogRanking(result, hashes));
const sidecar = {
  schema_version: 1,
  contract: artifact(contractPath, hashes.contract),
  result: artifact(resultPath, hashes.result),
  renderer: artifact(rendererPath, hashes.renderer),
  report: artifact(reportPath, sha(fs.readFileSync(reportPath))),
};
assertValidArtifact("play_log_ranking_hashes", sidecar);
writeAtomic(path.join(output, "play-log-ranking-hashes.json"), `${JSON.stringify(sidecar, null, 2)}\n`);
process.stdout.write(`${contract.ranking_id}: ${result.ranked_count}/${result.requested_count} ranked\n`);

function artifact(file, hash) {
  return { path: path.relative(root, file).split(path.sep).join("/"), sha256: hash };
}
function verifyReferencedArtifact(relativePath, expectedHash, kind) {
  const bytes = fs.readFileSync(path.resolve(root, relativePath));
  if (sha(bytes) !== expectedHash) throw new Error(`${kind} SHA-256 mismatch: ${relativePath}`);
  const value = JSON.parse(bytes);
  assertValidArtifact(kind, value);
  return value;
}
function verifyEvidenceIds(quality, analysis) {
  const available = new Set([
    ...analysis.selections.map((item) => `selection:${item.selection_id}`),
    ...analysis.metrics.map((item) => `metric:${item.metric_id}`),
    ...analysis.comparisons.map((item) => `comparison:${item.comparison_id}`),
    ...analysis.counterfactuals.map((item) => `counterfactual:${item.case_id}`),
  ]);
  for (const criterion of quality.criteria) {
    for (const evidenceId of criterion.evidence_ids) {
      if (!available.has(evidenceId)) throw new Error(`unknown evidence ID for ${quality.game_id}: ${evidenceId}`);
    }
  }
}
function readAdjacentEvaluationStop(entry) {
  const qualityPath = path.resolve(root, entry.quality_result_path);
  const stopPath = path.join(path.dirname(qualityPath), "artifacts", "technical-failure.json");
  if (!fs.existsSync(stopPath)) return null;
  try {
    const bytes = fs.readFileSync(stopPath);
    const value = JSON.parse(bytes);
    if (value.game_id !== entry.game_id) {
      throw new Error(`evaluation stop game_id mismatch: ${value.game_id}`);
    }
    if (value.schema_version === 1 && value.artifact_class === "play_log_evaluation_stop") {
      assertValidArtifact("play_log_evaluation_stop", value);
    } else if (!["technical_failure", "instrument_insufficient", "resolved"].includes(value.status)) {
      throw new Error(`unsupported legacy evaluation stop status: ${value.status}`);
    }
    return {
      path: path.relative(root, stopPath).split(path.sep).join("/"),
      sha256: sha(bytes),
      status: value.status,
    };
  } catch (error) {
    preflightErrors[entry.game_id].push(`evaluation stop unreadable: ${error?.message ?? error}`);
    return null;
  }
}
function sha(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function writeAtomic(file, content) {
  const temporary = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, content);
  fs.renameSync(temporary, file);
}
