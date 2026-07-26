import fs from "node:fs";
import path from "node:path";
import { verifyPlayLogRankingHashes } from "../runtime/index.mjs";

const root = path.resolve(import.meta.dirname, "..");
const [sidecarArgument] = process.argv.slice(2);
if (sidecarArgument == null) {
  throw new Error("Usage: node scripts/verify-play-log-ranking-hashes.mjs <play-log-ranking-hashes.json>");
}
const sidecar = JSON.parse(fs.readFileSync(path.resolve(root, sidecarArgument), "utf8"));
const errors = verifyPlayLogRankingHashes(sidecar, { rootDir: root });
if (errors.length > 0) throw new Error(errors.join("; "));
process.stdout.write(`${sidecarArgument}: verified\n`);
