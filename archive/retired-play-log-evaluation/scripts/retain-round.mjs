import path from "node:path";
import { archiveRound, planRoundArchive, planRoundPrune, pruneRound } from "../runtime/index.mjs";

// Usage:
//   node scripts/retain-round.mjs archive <game-id> <evaluation-id> [--force]
//   node scripts/retain-round.mjs prune   <game-id> <evaluation-id> [--apply]
//
// `archive` copies the round's non-regenerable agent work into the tracked records/ tree. `prune` removes the
// bulk private evidence from generated/, and refuses to run until the archive exists and matches. Prune is a
// dry run unless --apply is given.

const root = path.resolve(import.meta.dirname, "..");
const [command, gameId, evaluationId, ...flags] = process.argv.slice(2);
const usage = "Usage: node scripts/retain-round.mjs <archive|prune> <game-id> <evaluation-id>"
  + " [--force] [--apply]";
if (command == null || gameId == null || evaluationId == null) throw new Error(usage);

if (command === "archive") {
  const result = archiveRound({ root, gameId, evaluationId, force: flags.includes("--force") });
  report(`archived ${gameId}/${evaluationId} -> ${path.relative(root, result.recordDirectory)}`, [
    ...result.written.map((file) => `  + ${file}`),
    ...result.unchanged.map((file) => `  = ${file}`),
  ]);
} else if (command === "prune") {
  const apply = flags.includes("--apply");
  const result = pruneRound({ root, gameId, evaluationId, apply });
  if (!result.ready) {
    report(`cannot prune ${gameId}/${evaluationId}: archive the round first`,
      result.blockers.map((blocker) => `  ! ${blocker}`));
    process.exitCode = 1;
  } else {
    const megabytes = (result.bytes / 1024 / 1024).toFixed(1);
    report(`${apply ? "pruned" : "would prune"} ${result.removable.length} files (${megabytes} MB)`
      + ` from ${path.relative(root, result.roundDirectory)}`,
      result.removable.map((file) => `  - ${file.path} (${file.bytes} bytes)`));
    if (!apply) process.stdout.write("Dry run. Re-run with --apply to delete.\n");
  }
} else if (command === "plan") {
  const archive = planRoundArchive({ root, gameId, evaluationId });
  const prune = planRoundPrune({ root, gameId, evaluationId });
  process.stdout.write(`${JSON.stringify({ archive, prune }, null, 2)}\n`);
} else {
  throw new Error(usage);
}

function report(headline, lines) {
  process.stdout.write(`${[headline, ...lines].join("\n")}\n`);
}
