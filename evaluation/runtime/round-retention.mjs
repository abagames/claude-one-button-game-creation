import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// Retention of evaluation rounds. `generated/<game-id>/<evaluation-id>/` holds two kinds of file: work that
// only an agent could produce (the annotation-only copy, the adapter, the private policy, the frozen plan) and
// bulk private evidence that the shared executor regenerates from them. The first kind is curated into the
// tracked `records/` tree; the second kind may be pruned once the record exists, because its content hashes
// stay recorded inside the retained `analysis-result.json`.

export const CURATED_REQUIRED_FILES = Object.freeze([
  "instrumented/main.js",
  "adapter.mjs",
  "private-policy.mjs",
  "play-log-quality-plan.private.json",
  "game.manifest.json",
  "intake.json",
]);

// Present in some rounds only: an annotation plan carried forward from an earlier round of the same game, a
// round that stopped before Stage 12, a round with no rendered analysis.
export const CURATED_OPTIONAL_FILES = Object.freeze([
  "annotation-plan.private.json",
  "play-log-quality-result.json",
  "ANALYSIS.md",
  "artifacts/annotation-diff.json",
  "artifacts/simulator-conformance.json",
  "artifacts/qualification-runtime.json",
  "artifacts/play-log-feasibility.private.json",
  "artifacts/technical-failure.json",
  "artifacts/play-log-analysis/analysis-result.json",
]);

// `original/main.js` is deliberately absent from both lists: it is a byte copy of the published source, whose
// SHA-256 is pinned in `intake.json` and `game.manifest.json`.

export const PRUNABLE_FILES = Object.freeze([
  "artifacts/analysis-episode-pool.private.json",
  "artifacts/baseline-matrix.private.json",
  "artifacts/play-log-analysis/counterfactuals.private.json",
  "artifacts/play-log-analysis/derived-events.private.json",
  "artifacts/play-log-analysis/replay-runtime.private.json",
]);

export function roundPaths(root, gameId, evaluationId) {
  return {
    roundDirectory: path.join(root, "generated", gameId, evaluationId),
    recordDirectory: path.join(root, "records", gameId, evaluationId),
  };
}

export function planRoundArchive({ root, gameId, evaluationId }) {
  const { roundDirectory, recordDirectory } = roundPaths(root, gameId, evaluationId);
  if (!fs.existsSync(roundDirectory)) {
    throw new Error(`round directory does not exist: ${path.relative(root, roundDirectory)}`);
  }
  const missingRequired = CURATED_REQUIRED_FILES
    .filter((relative) => !fs.existsSync(path.join(roundDirectory, relative)));
  const files = [...CURATED_REQUIRED_FILES, ...CURATED_OPTIONAL_FILES]
    .filter((relative) => fs.existsSync(path.join(roundDirectory, relative)))
    .map((relative) => describeFile(roundDirectory, relative));
  const conflicts = files.filter((file) => {
    const recorded = path.join(recordDirectory, file.path);
    return fs.existsSync(recorded) && fileSha256(recorded) !== file.sha256;
  }).map((file) => file.path);
  return { gameId, evaluationId, roundDirectory, recordDirectory, files, missingRequired, conflicts };
}

export function archiveRound({ root, gameId, evaluationId, force = false }) {
  const plan = planRoundArchive({ root, gameId, evaluationId });
  if (plan.missingRequired.length > 0) {
    throw new Error(`round ${gameId}/${evaluationId} is missing curated files: ${plan.missingRequired.join(", ")}`);
  }
  if (plan.conflicts.length > 0 && !force) {
    throw new Error(
      `record for ${gameId}/${evaluationId} already holds different content: ${plan.conflicts.join(", ")}`
      + " (a frozen round should never change; pass --force only when replacing a record you know is wrong)");
  }
  const written = [];
  const unchanged = [];
  for (const file of plan.files) {
    const target = path.join(plan.recordDirectory, file.path);
    if (fs.existsSync(target) && fileSha256(target) === file.sha256) {
      unchanged.push(file.path);
      continue;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(plan.roundDirectory, file.path), target);
    written.push(file.path);
  }
  return { ...plan, written, unchanged };
}

export function planRoundPrune({ root, gameId, evaluationId }) {
  const { roundDirectory, recordDirectory } = roundPaths(root, gameId, evaluationId);
  if (!fs.existsSync(roundDirectory)) {
    throw new Error(`round directory does not exist: ${path.relative(root, roundDirectory)}`);
  }
  const blockers = [];
  for (const relative of CURATED_REQUIRED_FILES) {
    const recorded = path.join(recordDirectory, relative);
    const source = path.join(roundDirectory, relative);
    if (!fs.existsSync(recorded)) {
      blockers.push(`not archived: ${relative}`);
      continue;
    }
    if (fs.existsSync(source) && fileSha256(recorded) !== fileSha256(source)) {
      blockers.push(`archived copy differs: ${relative}`);
    }
  }
  const removable = PRUNABLE_FILES
    .filter((relative) => fs.existsSync(path.join(roundDirectory, relative)))
    .map((relative) => describeFile(roundDirectory, relative));
  return {
    gameId,
    evaluationId,
    roundDirectory,
    recordDirectory,
    removable,
    bytes: removable.reduce((total, file) => total + file.bytes, 0),
    blockers,
    ready: blockers.length === 0,
  };
}

export function pruneRound({ root, gameId, evaluationId, apply = false }) {
  const plan = planRoundPrune({ root, gameId, evaluationId });
  if (!apply) return { ...plan, pruned: [], applied: false };
  if (!plan.ready) {
    throw new Error(`refusing to prune ${gameId}/${evaluationId}: ${plan.blockers.join("; ")}`);
  }
  for (const file of plan.removable) fs.rmSync(path.join(plan.roundDirectory, file.path));
  const recordPath = path.join(plan.recordDirectory, "round-retention-record.json");
  const previous = fs.existsSync(recordPath)
    ? JSON.parse(fs.readFileSync(recordPath, "utf8")).pruned_files ?? []
    : [];
  const prunedFiles = mergePruned(previous, plan.removable);
  const record = {
    schema_version: 1,
    artifact_class: "round_retention_record",
    game_id: gameId,
    evaluation_id: evaluationId,
    pruned_files: prunedFiles,
    note: "Bulk private evidence removed from generated/. Its SHA-256 values stay recorded here and inside the"
      + " retained artifacts/play-log-analysis/analysis-result.json; regenerating it requires re-running the"
      + " round, which per CONTRACTS.md means a new evaluation ID and an unused analysis seed pool.",
  };
  fs.mkdirSync(plan.recordDirectory, { recursive: true });
  fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`);
  return { ...plan, pruned: plan.removable, applied: true, recordPath };
}

function mergePruned(previous, removable) {
  const merged = new Map(previous.map((file) => [file.path, file]));
  for (const file of removable) merged.set(file.path, file);
  return [...merged.values()].sort((left, right) => left.path.localeCompare(right.path));
}

function describeFile(directory, relative) {
  const absolute = path.join(directory, relative);
  return { path: relative, sha256: fileSha256(absolute), bytes: fs.statSync(absolute).size };
}

function fileSha256(absolute) {
  return crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
}
