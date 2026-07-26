import fs from "node:fs";
import { assertValidArtifact } from "../runtime/index.mjs";

const [resultPath, outputPath] = process.argv.slice(2);
if (resultPath == null || outputPath == null) throw new Error("Usage: node scripts/render-play-log-analysis.mjs <analysis-result.json> <ANALYSIS.md>");
const result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
const lines = result.artifact_class === "play_log_quality_result"
  ? renderQuality(result)
  : renderLegacyAnalysis(result);
fs.writeFileSync(outputPath, lines.join("\n"));

function renderQuality(value) {
  assertValidArtifact("play_log_quality_result", value);
  return [
    `# ${value.game_id} Simulator-Only Play-Log Mechanical Quality`, "",
    `> Status: \`${value.status}\``,
    `> Verdict: \`${value.verdict}\``,
    "> Trust class: `simulator_only_unverified`",
    "> Monotonic-input and diagnostic-control performance are not quality criteria.", "",
    "## Quality criteria", "",
    "| criterion | status | ordinal | evidence | rationale |",
    "| --- | --- | ---: | --- | --- |",
    ...value.criteria.map((item) => (
      `| ${item.criterion_id} | ${item.status} | ${item.ordinal_value ?? "not rankable"} | `
      + `${item.evidence_ids.join(", ") || "none"} | ${item.rationale} |`
    )),
    "", "## Instrument and provenance", "",
    `- Instrument confidence: \`${value.instrument_confidence}\``,
    `- Identity coverage: ${value.identity_coverage ?? "unavailable"}`,
    `- Analysis plan: ${value.analysis_plan_path} (${value.analysis_plan_sha256})`,
    `- Analysis result: ${value.analysis_result_path} (${value.analysis_result_sha256})`,
    `- Unresolved metrics: ${value.unresolved_metrics.join(", ") || "none"}`,
    `- Not-rankable reasons: ${(value.not_rankable_reasons ?? []).join(", ") || "none"}`,
    "", "## Limitations", "",
    ...value.limitations.map((item) => `- ${item}`),
    "", "## Claim limits", "", "Allowed:", "",
    ...value.allowed_claims.map((item) => `- ${item}`),
    "", "Forbidden:", "",
    ...value.forbidden_claims.map((item) => `- ${item}`), "",
  ];
}

function renderLegacyAnalysis(value) {
  assertValidArtifact("play_log_analysis_result", value);
  return [
  `# ${value.game_id} Simulator-Only Play-Log Analysis`, "",
  `> Status: \`${value.status}\``,
  `> Verdict: \`${value.verdict}\``,
  "> Trust class: `simulator_only_unverified`", "",
  "## Selected episodes", "",
  "| selection | policy | seed | score | ticks |",
  "| --- | --- | ---: | ---: | ---: |",
  ...value.selections.map((item) => `| ${item.selection_id} | ${item.policy_role} | ${item.gameplay_seed} | ${item.final_score} | ${item.executed_ticks} |`),
  "", "## Matched comparisons", "",
  "| comparison | metric | estimate | outcome |",
  "| --- | --- | ---: | --- |",
  ...value.comparisons.map((item) => `| ${item.comparison_id} | ${item.metric_id} | ${item.estimate ?? "unavailable"} | ${item.outcome} |`),
  "", "## Instrument confidence", "",
  `- Status: \`${value.instrument_confidence.status}\``,
  ...value.instrument_confidence.evidence.map((item) => `- ${item}`),
  "", "## Counterfactual summary", "",
  ...value.counterfactuals.map((item) => `- ${item.case_id}: ${item.operation}; score ${item.score_difference}; survival ${item.survival_difference}`),
  "", "## Limitations", "",
  ...value.limitations.map((item) => `- ${item}`),
  "", "## Claim limits", "", "Allowed:", "",
  ...value.allowed_claims.map((item) => `- ${item}`),
  "", "Forbidden:", "",
  ...value.forbidden_claims.map((item) => `- ${item}`), "",
  ];
}
