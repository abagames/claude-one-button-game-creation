import { assertValidArtifact } from "./artifact-contracts.mjs";

export function renderPlayLogRanking(result, hashes) {
  assertValidArtifact("play_log_ranking_result", result);
  const lines = [
    `# ${plain(result.ranking_id)} Play-Log Mechanical Quality Ranking`, "",
    `> Status: \`${result.status}\``,
    "> Trust class: `simulator_only_unverified`",
    "> Scope: play-log mechanical quality only; monotonic-input performance is not scored.", "",
    "## Ranking", "",
    "| rank | game | total / 20 | causal input | risk–reward | failure agency | outcome coherence |",
    "| ---: | --- | ---: | ---: | ---: | ---: | ---: |",
    ...result.games.filter((game) => game.eligibility === "ranked").map((game) => (
      `| ${game.rank} | ${cell(game.game_id)} | ${game.weighted_total} | `
      + `${game.criterion_values.causal_input_control} | ${game.criterion_values.risk_reward_coupling} | `
      + `${game.criterion_values.failure_agency} | ${game.criterion_values.outcome_coherence} |`
    )),
    "", "## Not rankable", "",
  ];
  const excluded = result.games.filter((game) => game.eligibility === "not_rankable");
  lines.push(...(excluded.length === 0
    ? ["- None"]
    : excluded.map((game) => {
        const provenance = game.evaluation_stop_path == null
          ? ""
          : `; terminal status: ${plain(game.terminal_status)}; stop artifact: `
            + `\`${plain(game.evaluation_stop_path)}\` (SHA-256 \`${game.evaluation_stop_sha256}\`)`;
        return `- ${plain(game.game_id)}: ${plain(game.errors.join("; "))}${provenance}`;
      })));
  lines.push(
    "", "## Limitations", "",
    ...result.limitations.map((item) => `- ${plain(item)}`),
    "", "## Forbidden claims", "",
    ...result.forbidden_claims.map((item) => `- ${plain(item)}`),
    "", "## Artifact hashes", "",
    `- Contract SHA-256: \`${hashes.contract}\``,
    `- Result SHA-256: \`${hashes.result}\``,
    `- Renderer SHA-256: \`${hashes.renderer}\``,
    "- Report SHA-256: stored in the adjacent hash sidecar", "",
  );
  return lines.join("\n");
}

function plain(value) { return String(value).replace(/[\r\n]+/g, " ").trim(); }
function cell(value) { return plain(value).replaceAll("|", "\\|"); }
