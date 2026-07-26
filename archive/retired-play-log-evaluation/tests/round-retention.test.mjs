import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  archiveRound,
  CURATED_REQUIRED_FILES,
  planRoundPrune,
  PRUNABLE_FILES,
  pruneRound,
} from "../runtime/index.mjs";

const workspace = path.resolve(import.meta.dirname, "..", "tmp/round-retention");

function makeRound(gameId, evaluationId, { skip = [] } = {}) {
  const root = path.join(workspace, `${gameId}-${evaluationId}`);
  fs.rmSync(root, { recursive: true, force: true });
  const roundDirectory = path.join(root, "generated", gameId, evaluationId);
  const files = [
    ...CURATED_REQUIRED_FILES.filter((relative) => !skip.includes(relative)),
    "original/main.js",
    "artifacts/play-log-analysis/analysis-result.json",
    ...PRUNABLE_FILES,
  ];
  for (const relative of files) {
    const absolute = path.join(roundDirectory, relative);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, `${relative} of ${gameId}/${evaluationId}\n`);
  }
  return { root, roundDirectory, recordDirectory: path.join(root, "records", gameId, evaluationId) };
}

test("archiving a round curates the agent work and leaves the published source out", () => {
  const gameId = "retention-game";
  const evaluationId = "round-1";
  const { root, recordDirectory } = makeRound(gameId, evaluationId);

  const result = archiveRound({ root, gameId, evaluationId });

  for (const relative of CURATED_REQUIRED_FILES) {
    assert.equal(fs.existsSync(path.join(recordDirectory, relative)), true, relative);
  }
  assert.equal(fs.existsSync(path.join(recordDirectory, "original/main.js")), false);
  for (const relative of PRUNABLE_FILES) {
    assert.equal(fs.existsSync(path.join(recordDirectory, relative)), false, relative);
  }
  assert.equal(result.unchanged.length, 0);

  const second = archiveRound({ root, gameId, evaluationId });
  assert.equal(second.written.length, 0);
  assert.deepEqual(second.unchanged.sort(), result.written.sort());
});

test("archiving fails closed on missing agent work and on a changed frozen round", () => {
  const gameId = "retention-game";
  const incomplete = makeRound(gameId, "round-2", { skip: ["private-policy.mjs"] });
  assert.throws(() => archiveRound({ root: incomplete.root, gameId, evaluationId: "round-2" }),
    /missing curated files: private-policy\.mjs/);

  const { root, roundDirectory } = makeRound(gameId, "round-3");
  archiveRound({ root, gameId, evaluationId: "round-3" });
  fs.writeFileSync(path.join(roundDirectory, "private-policy.mjs"), "tampered\n");
  assert.throws(() => archiveRound({ root, gameId, evaluationId: "round-3" }),
    /already holds different content: private-policy\.mjs/);
  archiveRound({ root, gameId, evaluationId: "round-3", force: true });
});

test("pruning refuses an unarchived round and records the hashes of what it removes", () => {
  const gameId = "retention-game";
  const evaluationId = "round-4";
  const { root, roundDirectory, recordDirectory } = makeRound(gameId, evaluationId);

  const blocked = planRoundPrune({ root, gameId, evaluationId });
  assert.equal(blocked.ready, false);
  assert.equal(blocked.blockers.length, CURATED_REQUIRED_FILES.length);
  assert.throws(() => pruneRound({ root, gameId, evaluationId, apply: true }), /refusing to prune/);
  for (const relative of PRUNABLE_FILES) {
    assert.equal(fs.existsSync(path.join(roundDirectory, relative)), true, relative);
  }

  archiveRound({ root, gameId, evaluationId });
  const dryRun = pruneRound({ root, gameId, evaluationId });
  assert.equal(dryRun.applied, false);
  assert.equal(dryRun.removable.length, PRUNABLE_FILES.length);
  assert.equal(fs.existsSync(path.join(roundDirectory, PRUNABLE_FILES[0])), true);

  const applied = pruneRound({ root, gameId, evaluationId, apply: true });
  assert.equal(applied.applied, true);
  for (const relative of PRUNABLE_FILES) {
    assert.equal(fs.existsSync(path.join(roundDirectory, relative)), false, relative);
  }
  assert.equal(fs.existsSync(path.join(roundDirectory, "artifacts/play-log-analysis/analysis-result.json")), true);

  const record = JSON.parse(fs.readFileSync(path.join(recordDirectory, "round-retention-record.json"), "utf8"));
  assert.equal(record.game_id, gameId);
  assert.deepEqual(record.pruned_files.map((file) => file.path), [...PRUNABLE_FILES].sort());
  for (const file of record.pruned_files) assert.match(file.sha256, /^[0-9a-f]{64}$/);

  const repeated = pruneRound({ root, gameId, evaluationId, apply: true });
  assert.equal(repeated.removable.length, 0);
  const merged = JSON.parse(fs.readFileSync(path.join(recordDirectory, "round-retention-record.json"), "utf8"));
  assert.deepEqual(merged.pruned_files, record.pruned_files);
});
