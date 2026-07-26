import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { assertValidArtifact } from "./artifact-contracts.mjs";

export function verifyPlayLogRankingHashes(sidecar, { rootDir = process.cwd() } = {}) {
  assertValidArtifact("play_log_ranking_hashes", sidecar);
  const root = path.resolve(rootDir);
  const errors = [];
  for (const name of ["contract", "result", "renderer", "report"]) {
    const entry = sidecar[name];
    const target = path.isAbsolute(entry.path) ? entry.path : path.resolve(root, entry.path);
    if (!fs.existsSync(target)) errors.push(`${name} file does not exist: ${entry.path}`);
    else if (sha(fs.readFileSync(target)) !== entry.sha256) errors.push(`${name} SHA-256 mismatch: ${entry.path}`);
  }
  return errors;
}

function sha(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
