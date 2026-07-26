import { evaluateConfigModule } from "./evaluate-play-log-quality.mjs";

const failures = await evaluateConfigModule(
  "batches/batch8-play-log-v3/evaluation-config.mjs",
  process.argv.slice(2),
);
if (failures.length > 0) process.exitCode = 1;
