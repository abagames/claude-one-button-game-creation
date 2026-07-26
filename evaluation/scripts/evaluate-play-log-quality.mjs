import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  runPlayLogQualityEvaluation,
  writePlayLogTechnicalFailure,
} from "../runtime/index.mjs";

export async function evaluateConfigModule(configModulePath, requestedGameIds = [], options = {}) {
  const { stopAfterFeasibility = false } = options;
  const absoluteConfigPath = path.resolve(configModulePath);
  const module = await import(pathToFileURL(absoluteConfigPath));
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

  const failures = [];
  for (const config of selected) {
    try {
      await runPlayLogQualityEvaluation(config, { stopAfterFeasibility });
      process.stdout.write(`${config.adapter.game_id}: ${stopAfterFeasibility ? "feasibility passed" : "completed"}\n`);
    } catch (error) {
      const status = error?.code === "instrument_insufficient"
        ? "instrument_insufficient"
        : "technical_failure";
      failures.push({ game_id: config.adapter.game_id, status, error: String(error?.stack ?? error) });
      writePlayLogTechnicalFailure(config, error);
      process.stderr.write(`${config.adapter.game_id}: ${status}: ${error?.message ?? error}\n`);
    }
  }
  return failures;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const argv = process.argv.slice(2);
  const stopAfterFeasibility = argv.includes("--feasibility-only");
  const [configModulePath, ...requestedGameIds] = argv.filter((value) => value !== "--feasibility-only");
  if (configModulePath == null) {
    throw new Error("usage: evaluate-play-log-quality.mjs <evaluation-config.mjs> [--feasibility-only] [game-id ...]");
  }
  const failures = await evaluateConfigModule(configModulePath, requestedGameIds, { stopAfterFeasibility });
  if (failures.length > 0) process.exitCode = 1;
}
